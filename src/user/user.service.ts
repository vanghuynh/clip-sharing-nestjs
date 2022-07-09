import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Like, Repository } from 'typeorm';
import { UserDto, UserRo } from './user.dto';

@Injectable()
export class UserService {

    constructor(@InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>) { }

    async showAll(page: number = 1, query?: string): Promise<any> {
        const [users, total] = await this.userRepository.findAndCount({
            relations: ['clips'],
            take: 10,
            skip: 10 * (page - 1),
            order: { created: 'DESC' },
            where: [
                { firstName: Like('%' + query + '%') },
                { lastName: Like('%' + query + '%') }
            ]
        });
        return {
            data: users.map(user => user.toResponseObject(false)),
            total: total
        }
    }

    private toResponseObject(userEntity: UserEntity): UserRo {
        return {
            id: userEntity.id,
            username: userEntity.username,
            created: userEntity.created,
            firstName: userEntity.firstName,
            lastName: userEntity.lastName,
            email: userEntity.email,
            role: userEntity.role
        };
    }

    async login(data: UserDto) {
        const { username, password } = data;
        const user = await this.userRepository.findOne({ where: { username } });
        if (!user || !(await user.comparePassword(password))) {
            throw new HttpException(
                'Invalid username/password',
                HttpStatus.BAD_REQUEST
            );
        }
        return user.toResponseObject();
    }

    async register(data: UserDto) {
        const { username } = data;
        let user = await this.userRepository.findOne({ where: { username } });
        if (user) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
        delete data['id'];
        user = await this.userRepository.create(data);
        await this.userRepository.save(user);
        return user.toResponseObject();
    }

    async create(data: UserDto): Promise<UserRo> {
        delete data['id'];
        const user = await this.userRepository.create(data);
        await this.userRepository.save(user);
        return this.toResponseObject(user);
    }

    async read(id: string): Promise<UserRo> {
        const request = await this.userRepository.findOne({ where: { id } });
        if (!request) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return this.toResponseObject(request);
    }

    async update(id: string, data: Partial<UserDto>): Promise<UserRo> {
        let user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        await this.userRepository.update({ id }, {
            username: data.username,
        });
        user = await this.userRepository.findOne({ where: { id } });
        return this.toResponseObject(user);
    }

    async destroy(id: string) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        await this.userRepository.delete({ id });
        return this.toResponseObject(user);
    }

}

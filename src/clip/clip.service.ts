import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClipEntity } from 'src/clip/clip.entity';
import { UserEntity } from 'src/user/user.entity';
import { Like, Repository } from 'typeorm';
import { ClipDto, ClipRo } from './clip.dto';
import { GoogleService } from './google.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ClipService {
    constructor(
        @InjectRepository(ClipEntity) private clipRepository: Repository<ClipEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private googleService: GoogleService,
    ) {
    }

    private toResponseObject(clip: ClipEntity): ClipRo {
        if (!clip.owner) {
            return { ...clip, owner: null };
        }
        return { ...clip, owner: clip.owner.toResponseObject(false) };
    }


    private ensureOwnership(clip: ClipEntity, userId: string) {
        if (clip.owner.id !== userId) {
            throw new HttpException('Incorrect user', HttpStatus.UNAUTHORIZED);
        }
    }

    // a function always returns a promise. Other values are wrapped in a resolved promise automatically.
    async showAll(page: number = 1, latest?: boolean, query?: string): Promise<any> {
        const [clips, total] = await this.clipRepository.findAndCount({
            where:
            //`title ILIKE  '${query}'`,
            {
                title: Like('%' + query + '%'),
                //description: Like('%' + query+ '%')
            },
            relations: ['owner'],
            take: 10,
            skip: 10 * (page - 1),
            order: latest && { created: 'DESC' }
        });
        return {
            data: clips.map(clip => this.toResponseObject(clip)),
            total: total
        }
    }

    async create(userId: string, data: ClipDto): Promise<ClipRo> {
        // Get youtube clip info
        const youtubeClipInfo = await lastValueFrom(this.googleService.getYoutubeClipInfo(data.url));
        Logger.log(`YoutubeClipInfo: `, JSON.stringify(youtubeClipInfo.data.items[0]), 'ClipService');
        Logger.log(`YoutubeClipInfo thumbnail: `, JSON.stringify(youtubeClipInfo.data.items[0].snippet.thumbnails.default.url), 'ClipService');

        const title = youtubeClipInfo.data.items[0].snippet.title;
        const description = youtubeClipInfo.data.items[0].snippet.description;
        const thumbnail = youtubeClipInfo.data.items[0].snippet?.thumbnails.default.url;

        const user = await this.userRepository.findOne({ where: { id: userId } });

        const clip = this.clipRepository.create({ ...data, owner: user, title, description, thumbnail, author: user.username });
        await this.clipRepository.save(clip);
        return { ...clip, owner: clip.owner.toResponseObject(false) };
    }

    async read(id: string): Promise<ClipRo> {
        const clip = await this.clipRepository.findOne({ where: { id }, relations: ['owner'] });
        if (!clip) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return this.toResponseObject(clip);
    }

    async update(id: string, userId: string, data: Partial<ClipDto>): Promise<ClipRo> {
        let clip = await this.clipRepository.findOne({ where: { id }, relations: ['owner'] });
        if (!clip) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        this.ensureOwnership(clip, userId);
        await this.clipRepository.update({ id }, data);
        clip = await this.clipRepository.findOne({ where: { id } });
        return this.toResponseObject(clip);
    }

    async destroy(id: string, userId: string) {
        const clip = await this.clipRepository.findOne({ where: { id }, relations: ['owner'] });
        if (!clip) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        this.ensureOwnership(clip, userId);
        await this.clipRepository.delete({ id });
        return this.toResponseObject(clip);
    }
}

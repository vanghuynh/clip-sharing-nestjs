import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BeforeInsert, OneToMany, ManyToMany, JoinTable } from "typeorm";
import * as bcrypt from 'bcryptjs';
import * as jwt from "jsonwebtoken";
import { UserRo } from "./user.dto";
import { ClipEntity } from "../clip/clip.entity";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;

    @Column({
        type: 'text',
        unique: true
    })
    username: string;

    @Column('text')
    password: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    firstName: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    lastName: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    role: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    email: string;

    @OneToMany(type => ClipEntity, clip => clip.owner)
    clips: ClipEntity[];


    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    static toResponseObject(user: UserEntity, showToken: boolean = true): UserRo {
        const { id, created, username, firstName, lastName, email, role, token } = user;
        const responseObject: UserRo = { id, created, username, firstName, lastName, email, role };
        if (showToken) {
            responseObject.token = token;
        }
        if (user.clips) {
            responseObject.clips = user.clips.map(clip => ClipEntity.toResponseObject(clip));
        }
        return responseObject;
    }

    async comparePassword(attenpt: string) {
        return await bcrypt.compare(attenpt, this.password);
    }

    private get token() {
        const { id, username } = this;
        return jwt.sign({
            id, username
        },
            process.env.SECRET,
        );
    }
}

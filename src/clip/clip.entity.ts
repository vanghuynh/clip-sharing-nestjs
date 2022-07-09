import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { ClipRo } from "./clip.dto";

@Entity('clip')
export class ClipEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    title: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    author: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @Column('text')
    url: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    thumbnail: string;

    @ManyToOne(type => UserEntity, owner => owner.clips)
    owner: UserEntity;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    toResponseObject(): ClipRo {
        const { id, title, author, description, url } = this;
        const responseObject: any = { id, title, author, description, url };
        return responseObject;
    }


}

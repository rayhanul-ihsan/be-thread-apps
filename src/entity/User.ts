import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Like } from "./Like"
import { Reply } from "./Reply"

@Entity({name :'users'})
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    full_name: string

    @Column()
    user_name: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({nullable: true})
    profile_picture: string

    @Column({nullable: true})
    image_cover: string

    @Column({nullable: true})
    bio: string

    @OneToMany(() => Like, (like) => like.author)
    likes: Like[]

    @OneToMany(() => Reply, (reply) => reply.author)
    replies: Reply[]
}

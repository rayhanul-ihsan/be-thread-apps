import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany} from "typeorm"
import { User } from "./User"
import { Like } from "./Like"
import { Reply } from "./Reply"

@Entity({name :'threads'})
export class Thread {

    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    image: string

    @Column({nullable: true})
    content: string

    @OneToMany(()=>Like, (like) => like.thread)
    likes: Like[]

    @OneToMany(() => Reply, (reply) => reply.thread)
    replies: Reply[]

    @ManyToOne(()=>User,user=>user.id)
    author: User

    @Column({default: ()=> 'NOW()'})
    createdAt: Date

    @Column({nullable: true})
    updateAt: Date
}

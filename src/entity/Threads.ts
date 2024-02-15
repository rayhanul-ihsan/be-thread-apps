import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany} from "typeorm"
import { User } from "./User"
import { Like } from "./Like"
import { Reply } from "./Reply"

@Entity({name :'threads'})
export class Thread {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    image: string

    @Column()
    content: string

    @OneToMany(()=>Like, (like) => like.thread)
    likes: Like[]

    @Column(() => Reply, (reply) => reply.replay)
    replies: Reply[]

    @ManyToOne(()=>User,user=>user.id)
    author: User

    @Column({default: ()=> 'NOW{}'})
    createdAt: Date

    @Column()
    updateAt: Date
}

import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({name: 'Follows'})
export class Follows {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() =>User, (user) => user.followers, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    followers: User

    @ManyToOne(() =>User, (user) => user.followings, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    followings: User
}

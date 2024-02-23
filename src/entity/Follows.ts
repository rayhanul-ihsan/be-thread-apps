// import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { User } from "./User";

// @Entity({name: 'Follows'})
// export class Follow {
//     @PrimaryGeneratedColumn()
//     id: number

//     @ManyToOne(() =>User, (user) => user.Following, {
//         onUpdate: 'CASCADE',
//         onDelete: 'CASCADE'
//     })
//     Following: User

//     @ManyToOne(() =>User, (user) => user.Followers, {
//         onUpdate: 'CASCADE',
//         onDelete: 'CASCADE'
//     })
//     Followers: User
// }

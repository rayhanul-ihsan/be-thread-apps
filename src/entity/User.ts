import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({name :'user'})
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
}

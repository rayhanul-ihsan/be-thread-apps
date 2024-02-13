import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity({name :'user'})
export class Thread {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    image: string

    @Column()
    content: string

    @CreateDateColumn({
        type: "timestamp",
        default: () => "CURENT_TIMESTAMP"
    })
    
    
    @UpdateDateColumn({
        type: "timestamp",
        default: () => "CURENT_TIMESTAMP",
        

    })
}

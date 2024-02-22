import { Repository } from "typeorm"
import { User } from "../entity/User"
import { AppDataSource } from "../data-source"
import { Request, Response } from "express"
import * as bcrypt from 'bcrypt'

export default new class UserService {
    private readonly UserRepository: Repository<User> = AppDataSource.getRepository(User)

    async find(req: Request, res: Response): Promise<Response>{
        try {
            const user = await this.UserRepository.find({
                select:[
                    "id",
                    "full_name",
                    "user_name",
                    "email",
                    "bio",
                    "image_cover",
                    "profile_picture"
                ]
            })
            return res.status(200).json({
                message: "Success Getting All Users",
                data: user
            })
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
    async findOne(req: Request, res: Response): Promise<Response>{
        try {
            const user = await this.UserRepository.findOne({where:{id: Number(req.params.id)}})
            if(!user) return res.status(404).json({message: "User Not Found"})
            
            return res.status(200).json({
                message: "Success Getting All Users",
                data: user
            })
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
    async delete(req: Request, res: Response): Promise<Response>{
        try {
            const user = await this.UserRepository.delete({id: Number(req.params.id)})
            if(!user) return res.status(404).json({message: "User Not Found"})

            return res.status(200).json({
                message: "Success Getting All Users",
                data: user
            })
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
}
import { Repository } from "typeorm"
import { User } from "../entity/User"
import { AppDataSource } from "../data-source"
import { Request, Response } from "express"
import * as bcrypt from 'bcrypt'
import { updateUserSchema } from "../utils/validator/UserValidator"

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
                message: "Success Getting User",
                data: user
            })
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    async update(req: Request, res: Response): Promise<Response>{
        try {
            const user = await this.UserRepository.findOne({where:{id: Number(req.params.id)}})
            if(!user) return res.status(404).json({message: "User Not Found"})

            const data = req.body

            const { error, value } = updateUserSchema.validate(data)
            if(error) return res.status(400).json(error.details[0].message)

            if(data.password && data.password !== user.password)
            
            if(data.fullName) {
                user.full_name = value.fullName
            }
            if(data.userName) {
                user.user_name = value.userName
            }
            if(data.email) {
                user.email = value.email
            }
            if(data.password) {
                const hashPassword = await bcrypt.hash(value.password, 10)
                user.password = hashPassword
            }
            if(data.profilePicture) {
                user.profile_picture = value.profilePicture
            }
            if(data.imageCover) {
                user.image_cover = value.imageCover
            }
            if(data.bio) {
                user.bio = value.bio
            }
            
            const response = await this.UserRepository.save(user)
            res.status(200).json(response)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
    async delete(req: Request, res: Response): Promise<Response>{
        try {
            const user = await this.UserRepository.delete({id: Number(req.params.id)})
            if(!user) return res.status(404).json({message: "User Not Found"})

            return res.status(200).json({
                message: "Success Deleted user",
                data: user
            })
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
    
}
import { Equal, Repository } from "typeorm"
import { User } from "../entity/User"
import { AppDataSource } from "../data-source"
import { Request, Response } from "express"
import * as bcrypt from 'bcrypt'
import { updateUserSchema } from "../utils/validator/UserValidator"
import { Follows } from "../entity/Follows"
import CostumeError from "../error/CostumeError"
import cloudinary from "../libs/cloudinary"

export default new class UserService {
    private readonly UserRepository: Repository<User> = AppDataSource.getRepository(User)
    
    async find(req: Request, res: Response): Promise<Response>{
        try {
            const user = await this.UserRepository.find({
                where:{
                  user_name: req.body.user_name as string  
                },
                relations: {
                    threads: true,
                    likes: true,
                    replies: true,
                    followers: true,
                    followings: true
                },
                select:[
                    "id",
                    "full_name",
                    "user_name",
                    "email",
                    "bio",
                    "image_cover",
                    "profile_picture",
                    "threads"
                ]
            })
            // console.log("user", user)
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

    async getCurrent(id) {
        const response = await this.UserRepository.findOne({
            where:{id},
            relations:{
                followers: true,
                followings: true
            }
        })

        const followers = await AppDataSource.getRepository(Follows).find({
            where:{ followers: Equal(id) },
            relations:{
                followers: true
            }

        })

        const followings = await AppDataSource.getRepository(Follows).find({
            where:{ followings: Equal(id) },
            relations:{
                followings: true
            }
        })

        return {
            id: response.id,
            full_name: response.full_name,
            user_name: response.user_name,
            email: response.email,
            bio: response.bio,
            image_cover: response.image_cover,
            profile_picture: response.profile_picture,
            followers,
            followings
        }
    }

    async uploadPicture(id, session, profile_picture) {
        if (session !== id) throw new CostumeError(403, "Cannot update another user's profile");
        cloudinary.upload()
        const upload = await cloudinary.destination(profile_picture)
        profile_picture = upload.secure_url
        await this.UserRepository.update({ id }, { profile_picture });
        return {
            message: "Picture uploaded",
        };
    }

    async update(req: Request, res: Response): Promise<Response>{
        try {
            const data = req.body
            console.log("data :",data)
            const user = await this.UserRepository.findOne({where:{id: Number(req.params.id)}})
            if(!user) return res.status(404).json({message: "User Not Found"})

            const { error, value } = updateUserSchema.validate(data)
            if(error) return res.status(400).json(error.details[0].message)

            // if(data.password && data.password !== user.password)
            
            if(data.fullName) {
                user.full_name = value.fullName
            }
            if(data.userName) {
                user.user_name = value.userName
            }
            // if(data.email) {
            //     user.email = value.email
            // }
            // if(data.password) {
            //     const hashPassword = await bcrypt.hash(value.password, 10)
            //     user.password = hashPassword
            // }


            if(data.profile_picture) {

                cloudinary.upload()
                const upload = await cloudinary.destination(value.profile_picture)
                user.profile_picture = upload.secure_url
            }
            if(data.image_cover) {
                cloudinary.upload()
                const upload = await cloudinary.destination(value.image_cover)
                user.image_cover = upload.secure_url
            }
            if(data.bio) {
                user.bio = value.bio
            }
            
            const response = await this.UserRepository.save(user)
            // const response = "bwang"
            console.log("value :",value)
            return res.status(200).json(
                {data: response}
                )
        } catch (error) {
            return res.status(500).json({message: error.message})
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
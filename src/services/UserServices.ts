import { Equal, Repository } from "typeorm"
import { User } from "../entity/User"
import { AppDataSource } from "../data-source"
import { Request, Response } from "express"
import * as bcrypt from 'bcrypt'
import { updateUserSchema } from "../utils/validator/UserValidator"
import { Follows } from "../entity/Follows"
import CostumeError from "../error/CostumeError"
import cloudinary from "../libs/cloudinary"
import { redisClient } from "../libs/redis"

export default new class UserService {
    private readonly UserRepository: Repository<User> = AppDataSource.getRepository(User)
    
    async find(req: Request, res: Response): Promise<Response>{
        try {
            let data
            // data = await redisClient.get("users")

            if(!data){
                const dataUser = await this.UserRepository.find({
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
                const stringDataUser = JSON.stringify(dataUser)
                redisClient.set("users", stringDataUser)
                data = stringDataUser
                // console.log("user", user)
            }
            return res.status(200).json({
                message: "Success Getting All Users",
                data: JSON.parse(data)
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
        // profile_picture = upload.secure_url
        await this.UserRepository.update({ id }, { profile_picture: upload.secure_url });
        return {
            message: "Picture uploaded",
        };
    }
    async uploadCover(id, session, image_cover) {
        if (session !== id) throw new CostumeError(403, "Cannot update another user's profile");
        cloudinary.upload()
        const upload = await cloudinary.destination(image_cover)
        image_cover = upload.secure_url
        await this.UserRepository.update({ id }, { image_cover });
        return {
            message: "Picture uploaded",
        };
    }

    async update(id: number, loginSession: number, data) {
        if (loginSession !== id) throw new CostumeError(403, "Cannot update another user's profile");
        let user;

        if (!data.password) {
            user = { 
                full_name: data.full_name,
                user_name: data.user_name,
                bio: data.bio,
            };
        } else {
            const hash = await bcrypt.hash(data.password, 10);
            user = {
                full_name: data.full_name,
                user_name: data.user_name,
                bio: data.bio,
                password: hash,
            };
        }

        await this.UserRepository.update({ id }, user);
        return {
            message: "Account updated",
            user: data.user_name,
        };
    }

    // async update(req: Request, res: Response): Promise<Response> {
    //     try {
    //         const { id } = req.params;
    //         const { full_name, user_name, bio } = req.body;
    
    //         console.log("data :", req.body);
    
    //         const user = await this.UserRepository.findOne({ where: { id: Number(id) } });
    //         if (!user) {
    //             return res.status(404).json({ message: "User Not Found" });
    //         }
    
    //         const { error } = updateUserSchema.validate(req.body);
    //         if (error) {
    //             return res.status(400).json(error.details[0].message);
    //         }
    
    //         // Update user properties
    //         if (full_name) {
    //             user.full_name = full_name;
    //         }
    //         if (user_name) {
    //             user.user_name = user_name;
    //         }
    //         if (bio !== undefined) {
    //             user.bio = bio;
    //         }
    
    //         const updatedUser = await this.UserRepository.save(user);
    //         console.log("updatedUser :", updatedUser);
    
    //         return res.status(200).json({ data: updatedUser });
    //     } catch (error) {
    //         return res.status(500).json({ message: error.message });
    //     }
    // }
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
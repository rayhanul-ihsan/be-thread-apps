import { Repository } from "typeorm"
import { Thread } from "../entity/Threads"
import { AppDataSource } from "../data-source"
import updateThreadSchema, { createThreadSchema } from "../utils/validator/CreatThreadValidator"
import { validate } from "../utils/validator/validation"
import cloudinary from "../libs/cloudinary"
import { response } from "express"
import CostumeError from "../error/CostumeError"

export default new (class ThreadService{
    private readonly threadRepository: Repository<Thread> = AppDataSource.getRepository(Thread)

    async getThreads() {
        return this.threadRepository.find({
            relations:{
                author: true,
                likes: true,
                replies: true
            },
            select:{
                author: {
                    full_name: true,
                    user_name: true,
                    profile_picture: true
                },
                likes: {
                    id: true
                },
                replies: {
                    id: true
                },
            },
        })
    }
    async getThread(id) {
        return this.threadRepository.findOne({
            relations:{
                author: true,
                likes: true,
                replies: true
            },
            select:{
                author: {
                    full_name: true,
                    user_name: true,
                    profile_picture: true
                },
                likes: {
                    id: true
                },
                replies: {
                    id: true,
                    content: true,
                    image: true,
                    likes: {
                        id: true,
                    },
                    replies: {
                        id: true,
                    },
                    author: {
                        full_name: true,
                        user_name: true,
                        profile_picture: true,
                    },
                    created_at: true,
                },
            },
        })
    }

    async createThread(data) {
        const isValid = validate(createThreadSchema, data)
        let valid

        if (data.image && data.content) {
            cloudinary.upload()
            const uploadFile = await cloudinary.destination(isValid.image)

            valid = {
                content: isValid.content,
                image: uploadFile.image,
                author: isValid.author
            }
        } else if (!data.image && data.content) {
            valid = {
                content: isValid.content,
                author: isValid.author
            }
        } else if ( data.image && !data.content) {
            cloudinary.upload()
            const uploadFile = await cloudinary.destination(isValid.image)
            valid = {
                image: uploadFile.secure_url,
                author: isValid.author
            }
        } else {
            throw new CostumeError(400, "content or image is required")
        }
        
        await this.threadRepository.save(valid)
        return{
            message: "Thread Created",
            data: valid
        }
    }
    
    async updateThread(id, data) {
        const isValid = validate(updateThreadSchema, data)
        let valid
        
        if (data.image && data.content) {
            cloudinary.upload()
            const uploadFile = await cloudinary.destination(isValid.image)
    
            valid = {
                content: isValid.content,
                image: uploadFile.image,
                updatedAt: isValid.updatedAt
            }
        } else if (!data.image && data.content) {
            valid = {
                content: isValid.content,
                updatedAt: isValid.updatedAt
            }
        } else if ( data.image && !data.content) {
            cloudinary.upload()
            const uploadFile = await cloudinary.destination(isValid.image)
            valid = {
                image: uploadFile.secure_url,
                updatedAt: isValid.updatedAt
            }
        } else {
            throw new CostumeError(400, "content or image is required")
        }

        await this.threadRepository.update(id, valid)
        return {
            message: "Thread update",
            data: valid
        }
    }

    async deleteThread(id, session) {
        const checkThread = await this.threadRepository.findOne({ where: {id}})
        if (!checkThread) throw new CostumeError(404, "Not Found!")

        if (session !== checkThread.author.id) throw new CostumeError(403, "Cannot delete another users Thread")

        await this.threadRepository.delete(id)
        return {
            message: "Thread deleted"
        }
    }

})
import { Repository } from "typeorm"
import { Thread } from "../entity/Threads"
import { AppDataSource } from "../data-source"
import { createThreadSchema } from "../utils/validator/CreatThreadValidator"
import { validate } from "../utils/validator/validation"
import cloudinary from "../libs/cloudinary"

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
        }
    }
})
import { Repository } from "typeorm"
import { Thread } from "../entity/Threads"
import { AppDataSource } from "../data-source"
import updateThreadSchema, { createThreadSchema } from "../utils/validator/CreatThreadValidator"
import { validate } from "../utils/validator/validation"
import cloudinary from "../libs/cloudinary"
import { Request, Response, response } from "express"
import CostumeError from "../error/CostumeError"
import LikeService from "./LikeService"
import ReplyService from "./ReplyService"
 
export default new (class ThreadService{
    private readonly threadRepository: Repository<Thread> = AppDataSource.getRepository(Thread)


    async getThreads(id) {
        const response = await this.threadRepository.find({
            order: {
                id: "DESC"
            },
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
            },
        })
        const likes = response.map(async (value) => await LikeService.getLikeThread(value.id, id))

        const threads = []
        let i = 0
        const len = response.length
        for (i = 0; i < len; i++) {
            threads.push({
                id: response[i].id,
                content: response[i].content,
                image: response[i].image,
                likes: response[i].likes.length,
                isliked: await likes[i],
                replies: response[i].replies.length,
                reply: response[i].replies.length,
                author: response[i].author,
                createdAt: response[i].createdAt
            })
        }
        console.log(threads)
        return await Promise.all(threads)
    }
    async getThread(id, userId) {
        const response = await this.threadRepository.findOne({
            where: {id},
            relations:{
                author: true,
                likes: true,
                replies: true
            },
            select:{
                author: {
                    id: true,
                    full_name: true,
                    user_name: true,
                    profile_picture: true
                }
            },
        })
        
        const likes = await LikeService.getLikeThread(response.id, userId)
        const replies = await ReplyService.getRepliesByThread(response.id, userId)
        return{
            id: response.id,
            content: response.content,
            image: response.image,
            author: response.author,
            likes: response.likes.length,
            isliked: likes,
            replies: replies,
            reply: replies.length,
            createdAt: response.createdAt
        }
    }
    async createThread(data) {
        const isValid = validate(createThreadSchema, data)
        let valid
        
        if (data.image && data.content) {
            cloudinary.upload()
            const uploadFile = await cloudinary.destination(isValid.image)

            valid = {
                content: isValid.content,
                image: uploadFile.secure_url,
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

    async delete(req: Request, res: Response): Promise<Response>{
        try {
            // mengambil id dari req params lalu diubah tipe datanya jadi integer
            const id = parseInt(req.params.id, 10)
            const obj = await this.threadRepository.findOne({where : {id}}) 
            if(!obj) return res.json({message :  "Thread Id not found"})
            
            const thread = await this.threadRepository.delete(id)
            return res.status(200).json({messagae : "Succses Delete Thread", thread})
        } catch (error) {
            return res.status(500).json(error)
        }
    }
})
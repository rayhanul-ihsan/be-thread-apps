import { Check, Repository } from "typeorm"
import { AppDataSource } from "../data-source"
import { Reply } from "../entity/Reply"
import LikeService from "./LikeService"
import { validate } from "../utils/validator/validation"
import { ReplyThreadSchema } from "../utils/validator/ReplyValidator"
import cloudinary from "../libs/cloudinary"
import CostumeError from "../error/CostumeError"

 export default new class ReplyService {
    private readonly ReplyRepository: Repository<Reply> = AppDataSource.getRepository(Reply)

    async getRepliesByThread(threadId, userId) {
        const response = await this.ReplyRepository
            .createQueryBuilder("reply")
            .leftJoinAndSelect("reply.thread", "thread")
            .leftJoinAndSelect("reply.author", "author")
            .leftJoinAndSelect("reply.replay", "replay")
            .leftJoinAndSelect("reply.likes", "likes")
            .where("reply.thread = :thread", { thread: threadId })
            .getMany()
        const likes = response.map(async (value) => await LikeService.getLikeReply(value.id, userId))

        const replies = []
        let i = 0
        const len = response.length
        for (i = 0; i < len; i++) {
            replies.push({
                id: response[i].id,
                content: response[i].content,
                image: response[i].image,
                author: response[i].author,
                likes: response[i].likes.length,
                islike: await likes[i],
                replies: response[i].replies,
                created_at: response[i].created_at,

            })
        }
        return await Promise.all(replies)
    }
 
    async replyToThread(data) {
        const isValid = validate(ReplyThreadSchema, data)
        let valid

        if(data.image && data.content) {
            cloudinary.upload()
            const uploadFile = await cloudinary.destination(isValid.image)

            valid = {
                content: isValid.content,
                image: uploadFile.secure_url,
                author: isValid.author,
                thread: isValid.thread
            }
        } else if (!data.image && data.content) {
            valid = {
                content: isValid.content,
                author: isValid.author,
                thread: isValid.thread
            }
        } else if ( data.image && !data.content) {
            cloudinary.upload()
            const uploadFile = await cloudinary.destination(isValid.image)

            valid = {
                image: uploadFile.secure_url,
                author: isValid.author,
                thread: isValid.thread
            }
        } else {
            throw new CostumeError(400, "content or image is required")
        }
        await this.ReplyRepository.save(valid)
        return {
            message: "Reply created",
            data: valid
        }
    }

    async deleteReply(id, loginsession) {
        const check = await this.ReplyRepository.findOne({ where: { id }, relations: {author: true} })
        console.log(loginsession, check.author.id)
        if (!check) throw new CostumeError(404, "Not Found!")
        if (loginsession.id != check.author.id) throw new CostumeError(403, "Cannot delete another users Reply")
        
        cloudinary.delete(check.image)
        await this.ReplyRepository.delete(check.id)
        return {
            message: "Reply deleted"
        }
         
    }

}
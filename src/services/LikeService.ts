import { Repository } from "typeorm"
import { Like } from "../entity/Like"
import { AppDataSource } from "../data-source"

export default new class LikeService {
    private readonly LikeRepository: Repository<Like> = AppDataSource.getRepository(Like)
    async getLikeReply(replyId, authorId) {
        const check = await this.LikeRepository
            .createQueryBuilder("like")
            .where("like.reply = :reply", { reply: replyId })
            .andWhere("like.author = :author", { author: authorId })
            .getOne()
        if (check) {
            return true
        } else {
            return false
        }
    }

    async getLikeThread(threadId, authorId) {
        const check = await this.LikeRepository
            .createQueryBuilder("like")
            .where("like.thread = :thread", { thread: threadId })
            .andWhere("like.author = :author", { author: authorId })
            .getOne()
        if (check) {
            return true
        } else {
            return false
        }
    }

    async likeThread(threadId, loginsessionId) {
        const response = await this.LikeRepository.save({
            thread: threadId,
            author: loginsessionId
        })
        return {
            message: "Thread liked",
            // id: response.id
        }
    }
    
    async likeReply(replyId, loginsessionId) {
        this.LikeRepository.save({
            reply: replyId,
            author: loginsessionId
        })
        return {
            message: "reply liked"
        }
    }

    async unlikeReply(id, loginsession) {
        const getLike = await this.LikeRepository
            .createQueryBuilder("like")
            .leftJoinAndSelect("like.author", "author")
            .leftJoinAndSelect("like.reply", "reply")      
            .where("like.reply = :reply", { reply: id })  
            .andWhere("like.author = :author", { author: loginsession })
            .getOne()
        
        await this.LikeRepository.delete(getLike.id)
        return {
            message: "Reply unliked"
        }
    }

    async unlikeThread(id, loginsession) {
        const getLike = await this.LikeRepository
            .createQueryBuilder("like")
            .leftJoinAndSelect("like.author", "author")
            .leftJoinAndSelect("like.thread", "thread")
            .where("like.thread = :thread", { thread: id })
            .andWhere("like.author = :author", { author: loginsession })
            .getOne()

        await this.LikeRepository.delete(getLike.id)
        return{
            message: "Thread unliked"
        }
    }
}
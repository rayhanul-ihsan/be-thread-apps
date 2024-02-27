import { Equal, Repository } from "typeorm"
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

    async likeThread(data) {
        // const existLike = await this.LikeRepository.findOne({
        //     where: {
        //         thread: data.thread,
        //         author: data.author
        //     }
        // })
        // if (existLike) {
        //     const unlikeResponse = await this.LikeRepository
        //         .createQueryBuilder()
        //         .delete()
        //         .from(Like)
        //         .where("thread = :thread", { thread: data.thread })
        //         .andWhere("author = :author", { author: data.author })
        //         .execute()
        // } else if (!existLike) {
        //     const unlikeResponse = await this.LikeRepository
        //         .createQueryBuilder()
        //         .delete()
        //         .from(Like)
        //         .where("thread = :thread", { thread: data.thread })
        //         .andWhere("author = :author", { author: data.author })
        //         .execute()
            
        // } 
        // console.log(existLike)
        const response = await this.LikeRepository.save({
            thread: data.thread,
            author: data.author
        })
        return {
            message: "Thread liked",
            id: response.id
        }
        // console.log(threadId, loginsessionId)
    }
    
    async likeReply(data) {
        this.LikeRepository.save({
            reply: data.reply,
            author: data.author
        })
        return {
            message: "reply liked",
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

    async unlikeThread(data) {

        const res =await this.LikeRepository.delete({thread : Equal(data.thread), author : Equal(data.author)})
        console.log(res)
        return{
            message: "Thread unliked"
        }
    }
}
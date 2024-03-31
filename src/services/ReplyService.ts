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

    // async getRepliesByThread(threadId, userId) { 
    //     const response = await this.ReplyRepository
    //         .createQueryBuilder("reply") 
    //         .leftJoinAndSelect("reply.thread", "thread")
    //         .leftJoinAndSelect("reply.author", "author")
    //         .leftJoinAndSelect("reply.replay", "replay")
    //         .leftJoinAndSelect("reply.likes", "likes")
    //         .where("reply.thread = :thread", { thread: threadId })
    //         .getMany()
    //     const likes = response.map(async (value) => await LikeService.getLikeReply(value.id, userId))

    //     const replies = []
    //     let i = 0
    //     const len = response.length
    //     for (i = 0; i < len; i++) {
    //         replies.push({
    //             id: response[i].id,
    //             content: response[i].content,
    //             image: response[i].image,
    //             author: response[i].author,
    //             likes: response[i].likes.length,
    //             islike: await likes[i],
    //             replies: response[i].replies,
    //             created_at: response[i].created_at,

    //         })
    //     }
    //     return await Promise.all(replies)
    // }
    async getRepliesByThread(threadId, userId) {
        try {
            // Mengambil semua respons dari ReplyRepository dengan query builder
            const responses = await this.ReplyRepository
                .createQueryBuilder("reply") 
                .leftJoinAndSelect("reply.thread", "thread")
                .leftJoinAndSelect("reply.author", "author")
                .leftJoinAndSelect("reply.replay", "replay")
                .leftJoinAndSelect("reply.likes", "likes")
                .where("reply.thread = :thread", { thread: threadId })
                .getMany();
    
            // Mendapatkan semua likes dari setiap response
            const likePromises = responses.map(reply => LikeService.getLikeReply(reply.id, userId));
            const likes = await Promise.all(likePromises);
    
            // Mengonversi setiap response menjadi format yang diinginkan
            return responses.map((response, index) => ({
                id: response.id,
                content: response.content,
                image: response.image,
                author: response.author,
                likes: response.likes.length,
                islike: likes[index], // Menambahkan islike berdasarkan likes yang sudah didapat
                replies: response.replies,
                created_at: response.created_at
            }));
        } catch (error) {
            // Menangani kesalahan jika terjadi
            console.error("Error in getRepliesByThread:", error);
            throw error;
        }
    }
    
    // async replyToThread(data) {
    //     // Memvalidasi data masukan
    //     const isValid = validate(ReplyThreadSchema, data);
    
    //     let valid;
    
    //     // Memeriksa apakah data yang diberikan sesuai dengan syarat
    //     if (!data.content && !data.image) {
    //         throw new CostumeError(400, "Content or image is required");
    //     }
    
    //     // Jika ada gambar dan konten
    //     if (data.image && data.content) {
    //         // Upload gambar ke Cloudinary
    //         const uploadFile = await cloudinary.destination(isValid.image);
            
    //         // Menyusun data yang valid
    //         valid = {
    //             content: isValid.content,
    //             image: uploadFile.secure_url,
    //             author: isValid.author,
    //             thread: isValid.thread
    //         };
    //     } 
    //     // Jika hanya ada konten
    //     else if (!data.image && data.content) {
    //         valid = {
    //             content: isValid.content,
    //             author: isValid.author,
    //             thread: isValid.thread
    //         };
    //     } 
    //     // Jika hanya ada gambar
    //     else if (data.image && !data.content) {
    //         // Upload gambar ke Cloudinary
    //         const uploadFile = await cloudinary.destination(isValid.image);
            
    //         // Menyusun data yang valid
    //         valid = {
    //             image: uploadFile.secure_url,
    //             author: isValid.author,
    //             thread: isValid.thread
    //         };
    //     }
    
    //     // Menyimpan data yang valid ke database
    //     await this.ReplyRepository.save(valid);
    
    //     // Mengembalikan respons
    //     return {
    //         message: "Reply created",
    //         data: valid
    //     };
    // }
    
 
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
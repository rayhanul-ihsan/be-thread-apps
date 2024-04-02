import { Check, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Reply } from "../entity/Reply";
import LikeService from "./LikeService";
import { validate } from "../utils/validator/validation";
import { ReplyThreadSchema } from "../utils/validator/ReplyValidator";
import cloudinary from "../libs/cloudinary";
import CostumeError from "../error/CostumeError";
import { Request, Response } from "express";

export default new (class ReplyService {
  private readonly ReplyRepository: Repository<Reply> =
    AppDataSource.getRepository(Reply);
    
  async getRepliesByThread(threadId, userId) {
    try {
      const responses = await this.ReplyRepository.createQueryBuilder("reply")
        .leftJoinAndSelect("reply.thread", "thread")
        .leftJoinAndSelect("reply.author", "author")
        .leftJoinAndSelect("reply.replay", "replay")
        .leftJoinAndSelect("reply.likes", "likes")
        .where("reply.thread = :thread", { thread: threadId })
        .getMany();

      // Mendapatkan semua likes dari setiap response
      const likePromises = responses.map((reply) =>
        LikeService.getLikeReply(reply.id, userId)
      );
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
        created_at: response.created_at,
      }));
    } catch (error) {
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
    const isValid = validate(ReplyThreadSchema, data);
    let valid;

    if (data.image && data.content) {
      cloudinary.upload();
      const uploadFile = await cloudinary.destination(isValid.image);

      valid = {
        content: isValid.content,
        image: uploadFile.secure_url,
        author: isValid.author,
        thread: isValid.thread,
      };
    } else if (!data.image && data.content) {
      valid = {
        content: isValid.content,
        author: isValid.author,
        thread: isValid.thread,
      };
    } else if (data.image && !data.content) {
      cloudinary.upload();
      const uploadFile = await cloudinary.destination(isValid.image);

      valid = {
        image: uploadFile.secure_url,
        author: isValid.author,
        thread: isValid.thread,
      };
    } else {
      throw new CostumeError(400, "content or image is required");
    }
    await this.ReplyRepository.save(valid);
    return {
      message: "Reply created",
      data: valid,
    };
  }

  async deleteReply(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id, 10);
      const check = await this.ReplyRepository.findOne({
        where: { id },
        relations: { author: true },
      });
      if (!check) throw new CostumeError(404, "Not Found!");

    //   const loginsession = res.locals.loginSession;
    //   if (loginsession.id != check.author.id)
    //     throw new CostumeError(403, "Cannot delete another users Reply");

    //   cloudinary.delete(check.image);
      const reply = await this.ReplyRepository.delete(id);
      return res.status(200).json({ message: "Reply deleted", reply });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }
})();

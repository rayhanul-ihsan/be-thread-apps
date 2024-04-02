import { Equal, Repository } from "typeorm";
import { Like } from "../entity/Like";
import { AppDataSource } from "../data-source";

export default new (class LikeService {
  private readonly LikeRepository: Repository<Like> =
    AppDataSource.getRepository(Like);
  async getLikeReply(replyId, authorId) {
    const check = await this.LikeRepository.createQueryBuilder("like")
      .where("like.reply = :reply", { reply: replyId })
      .andWhere("like.author = :author", { author: authorId })
      .getOne();
    if (check) {
      return true;
    } else {
      return false;
    }
  }

  async getLikeThread(threadId, authorId) {
    const check = await this.LikeRepository.createQueryBuilder("like")
      .where("like.thread = :thread", { thread: threadId })
      .andWhere("like.author = :author", { author: authorId })
      .getOne();
    if (check) {
      return true;
    } else {
      return false;
    }
  }
  async likeThread(data) {
      
      try {
          const existLike = await this.LikeRepository.findOne({
              where: {
                  thread: Equal(data.thread),
                  author: Equal(data.author)
              }
          });
          console.log(existLike)

          if (existLike) {
             await this.LikeRepository.delete({
                  thread: data.thread,
                  author: data.author
              });
              return {
                message: "unLiked",
                id: data.thread
            } 
          }

          const response = await this.LikeRepository.save({
              thread: data.thread,
              author: data.author
          });

          return {
              message: "Thread liked",
              id: response.id
          };
      } catch (error) {
          console.error(error);
          throw new Error(error.message);
      }
  }

  async likeReply(data) {
      try {
          const existLike = await this.LikeRepository.findOne({
              where: {
                  reply: Equal(data.reply),
                  author: Equal(data.author)
                }
            });
            console.log(existLike)

        if (existLike) {
           await this.LikeRepository.delete({
                reply: data.reply,
                author: data.author
            });
            return {
              message: "unLiked",
              id: data.reply
          } 
        }

        const response = await this.LikeRepository.save({
            reply: data.reply,
            author: data.author
        });

        return {
            message: "reply liked",
            id: response.id
        };
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
  }
})();

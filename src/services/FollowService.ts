import { Equal, Repository } from "typeorm"
import { AppDataSource } from "../data-source"
import { Follows } from "../entity/Follows"
import { User } from "../entity/User"

export default new class FollowService {
    unFollow(followings: string | import("qs").ParsedQs | string[] | import("qs").ParsedQs[], id: any) {
        throw new Error("Method not implemented.")
    }
    private readonly FollowRepository: Repository<Follows> = AppDataSource.getRepository(Follows)

    async getFollow(id) {
        const followers = await AppDataSource.getRepository(User).find({
            where:{ followings: { followers: Equal(id)}},
            relations: {
                followings: true
            }
        })
        const followings = await AppDataSource.getRepository(User).find({
            where:{ followers: { followings: Equal(id)}},
            relations: {
                followings: true
            }
        })

        return {followers, followings}
    }

    async follow(followers, followings){
        await this.FollowRepository.save({followers, followings})
        return {
            message: "Followed Successfully!!" 
        }
    }

    async unfollow(followers, followings){
        await this.FollowRepository.delete({followers, followings})
        return {
            message: "Unfollowed Successfully!!" 
        }
    }
}
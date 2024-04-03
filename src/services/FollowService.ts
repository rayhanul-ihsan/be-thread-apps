import { Equal, Repository } from "typeorm"
import { AppDataSource } from "../data-source"
import { Follows } from "../entity/Follows"
import { User } from "../entity/User"
import CostumeError from "../error/CostumeError"

export default new class FollowService {
    
    private readonly FollowRepository: Repository<Follows> = AppDataSource.getRepository(Follows)

    async getFollows(id) {
        const followers = await AppDataSource.getRepository(User).find({
            where:{ followings: { followers: Equal(id)}},
            relations: {
                followings: true
            }
        })
        const followings = await AppDataSource.getRepository(User).find({
            where:{ followers: { followings: Equal(id)}},
            relations: {
                followers: true
            }
        }) 
        return {
            followers, 
            followings
        }
    }

    async getFollow(followers, followings){ 
        const chek = await this.FollowRepository.count({
            where:{
                followers: Equal(followers),
                followings: Equal(followings)
            }
        })
        if(chek !== 0) return true;

        return false
    }

    async follow(followers, followings){
        // console.log("followers:", followers)
        // console.log("followings:", followings)
        const checkFollow = await this.FollowRepository.countBy({
            followers: Equal(followers),
            followings: Equal(followings)
        })
        if (checkFollow) throw new CostumeError(400, "You Already Follow this User!")
        await this.FollowRepository.save({followers, followings})
                
        return {
            message: "Followed Successfully!!" 
        } 
    }

    async unfollow(followers, followings){
        const getFollow = await this.FollowRepository.findOne({
            where:{
                followers: Equal(followers),
                followings: Equal(followings)
            },
            relations:{
                followers: true,
                followings: true
            }
        })
        console.log(getFollow.id)
        if(!getFollow) throw new CostumeError(400, "You Dont Follow this User!")
        await this.FollowRepository.delete(getFollow.id)
        return {
            message: "Unfollowed Successfully!!" 
        }
    }
}
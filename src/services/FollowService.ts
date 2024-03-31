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
        // console.log("folower:",followers)
        // console.log("following:",followings)
        // const pollower = await Promise.all(
        //     followers.map(async (value) => {
        //         const isFollow = await this.getFollows(value.id, id );

        //         return {
        //             ...value,
        //             isFollow,
        //         };
        //     })
        // );
        // const pollowing = followings.map((value) => {
        //     return {
        //         ...value,
        //         isFollow: true,
        //     };
        // });

 
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
    // unFollow(followings: string | import("qs").ParsedQs | string[] | import("qs").ParsedQs[], id: any) {
    //     throw new Error("Method not implemented.")
    // }

    async unfollow(followers, followings){
        await this.FollowRepository.delete({followers, followings})
        return {
            message: "Unfollowed Successfully!!" 
        }
    }
}
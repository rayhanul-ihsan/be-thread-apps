import { Request, Response } from "express";
import FollowService from "../services/FollowService";

export default new class FollowController {
    async getFollows(req: Request, res: Response) {
        
        try {
            const response = await FollowService.getFollows( res.locals.loginSession.id)
            res.status(200).json(response)
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    async follow(req: Request, res: Response) {
        try {
            console.log(req.body);
            
            
            const response = await FollowService.follow(req.body.user, res.locals.loginSession.id)
            console.log(response)
            res.status(200).json(response)
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    async unFollow(req: Request, res: Response) {
        try {
            const response = await FollowService.unfollow(req.query.followings, res.locals.loginSession.obj.id)
            res.status(200).json(response)
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
}
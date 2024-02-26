import { Request, Response } from "express";
import FollowService from "../services/FollowService";

export default new class FollowController {
    async getFollow(req: Request, res: Response) {
        try {
            const response = await FollowService.getFollow(req.params.id)
            res.status(200).json(response)
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    async follow(req: Request, res: Response) {
        try {
            const response = await FollowService.follow(req.body.followings, res.locals.loginSession.id)
            res.status(200).json(response)
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    async unFollow(req: Request, res: Response) {
        try {
            const response = await FollowService.unFollow(req.query.followings, res.locals.loginSession.id)
            res.status(200).json(response)
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
}
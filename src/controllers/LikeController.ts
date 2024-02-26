import { Request, Response } from "express"
import LikeService from "../services/LikeService"


export default new class LikeController { 
    async likeThread(req: Request, res: Response){
        try {
            const response = await LikeService.likeThread(req.body.thread, res.locals.loginSession.id)
            res.status(200).json(response)
        } catch (error) {
            res.status(500).json({message: 'error like thread'})
        }        
    }

    async likeReply(req: Request, res: Response){
        try {
            const response = await LikeService.likeReply(req.body.reply, res.locals.loginSession.id)
            res.status(200).json(response)
        } catch (error) {
            res.status(500).json({message: 'error like reply'})
        }
    }

    async unlikeThread(req: Request, res: Response){
        try {
            const response = await LikeService.unlikeThread(req.query.thread, res.locals.loginSession.id)
            res.status(200).json(response)
        } catch (error) {
            res.status(500).json({message: 'error unlike thread'})
        }
    }

    async unlikeReply(req: Request, res: Response){
        try {
            const response = await LikeService.unlikeReply(req.query.reply, res.locals.loginSession.id)
            res.status(200).json(response)
        } catch (error) {
            res.status(500).json({message: 'error unlike reply'})
        }
    }
}
import { Request, Response } from "express"
import LikeService from "../services/LikeService"
import { date } from "joi"


export default new class LikeController { 
    async likeThread(req: Request, res: Response){
        try {
            const data = {
                thread: req.body.thread,
                author: res.locals.loginSession.obj.id
            }
            console.log(data)
            const response = await LikeService.likeThread(data)
            res.status(200).json(response)
        } catch (error) {
            res.status(500).json({message: 'error like thread'})
        }        
    }
 
    async likeReply(req: Request, res: Response){
        try {
            const data = {
                reply: req.body.reply,
                author: res.locals.loginSession.obj.id
            }
            const response = await LikeService.likeReply(data)
            res.status(200).json(response)
        } catch (error) {
            res.status(500).json({message: 'error like reply'})
        }
    }

    async unlikeThread(req: Request, res: Response){
        try {
            const data = {
                thread: req.body.thread,
                author: res.locals.loginSession.obj.id
            }
            const response = await LikeService.unlikeThread(data)
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
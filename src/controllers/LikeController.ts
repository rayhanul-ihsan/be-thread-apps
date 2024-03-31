import { Request, Response } from "express"
import LikeService from "../services/LikeService"


export default new class LikeController { 
    async likeThread(req: Request, res: Response){
        try {
            const data = {
                thread: req.body.thread,
                author: res.locals.loginSession.id
            }
            console.log(data)
            const response = await LikeService.likeThread(data)
            res.status(200).json(response)
        } catch (error) {
            res.status(500).json({message: error.message})
        }        
    }
 
    async likeReply(req: Request, res: Response){
        try {
            const data = {
                reply: req.body.reply,
                author: res.locals.loginSession.id
            }
            const response = await LikeService.likeReply(data)
            res.status(200).json(response)
        } catch (error) {
            res.status(500).json({message: 'error like reply'})
        }
    }
}
import { Request, Response } from "express"
import ReplyService from "../services/ReplyService"
import { log } from "console"

export default new class ReplyController {
    async ReplyThread(req: Request, res: Response) {
        try { 
            // console.log(res.locals.loginSession)
            let data
            if (!req.file) {
                data = { 
                    content: req.body.content,
                    author: res.locals.loginSession.obj.id,
                    thread: req.body.thread
                }
            } else {
                data = {
                    content: req.body.content,
                    image: req.file.filename,
                    author: res.locals.loginSession.obj.id,
                    thread: req.body.thread
                }
            }
            const response = await ReplyService.replyToThread(data)
            res.status(201).json(response)

        } catch (error) {
            res.status(error.status).json(error.message)
        }
    }

    async DeleteReply(req: Request, res: Response) {
        try {
            const response = await ReplyService.deleteReply(req.params.id, res.locals.loginSession.obj)
            res.status(200).json(response)
        } catch (error) {
            res.status(error.status).json({ message: error.message })
        }
    }
}
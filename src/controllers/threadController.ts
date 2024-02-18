import { Request, Response, response } from "express";
import ThreadService from "../services/ThreadService";

export default new (class threadController{
    async getThreads(req: Request, res: Response){
        try {
            const response = await ThreadService.getThreads()

            res.status(200).json(response)
        } catch (error) {
            res.status(error.status).json({message: error.message})
            
        }
    }

    async getThread(req: Request, res: Response){
        try {
            const response = await ThreadService.getThread(req.params)

            res.status(200).json(response)
        } catch (error) {
            res.status(error.status).json({message: error.message})
            
        }
    }

    async createThread(req: Request, res: Response){
        try {
            let data

            if(!req.file) {
                data = {
                    content: req.body.content,
                    author: res.locals.session.id
                }
            }else {
                data = {
                    content: req.body.content,
                    image: req.file.filename,
                    author: res.locals.session.id
                }                
            }
            const response = await ThreadService.createThread(data)
            res.status(201).json(response)
        } catch (error) {
            res.status(error.status).json({message: error.message})
            
        }
    }
})
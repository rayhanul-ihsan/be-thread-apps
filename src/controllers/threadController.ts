import { Request, Response } from "express";
import ThreadService from "../services/ThreadService";

export default new (class threadController{
    async getThreads(req: Request, res: Response){
        try {
            const response = await ThreadService.getThreads(req.query.id)

            res.status(200).json(response)
        } catch (error) {
            res.status(error.status).json({message: error.message})
            
        }
    }

    async getThread(req: Request, res: Response){
        try {
            // console.log(req.params.id, req.query.id)
            const response = await ThreadService.getThread(req.params.id, req.query.id)

            res.status(200).json(response)
        } catch (error) {
            res.status(error.status).json({message: error.message})
            
        }
    }

    async createThread(req: Request, res: Response) {
        try {
            let data 
            const loginSession = res.locals.loginSession 
            
               if (!req.file) {
                data = {
                    content: req.body.content,
                    author: loginSession.id,

                };
            } else {
                data = {
                    content: req.body.content,
                    image: req.file.filename,
                    author: loginSession.id,
                };
            }
            
            const response = await ThreadService.createThread(data);
            res.status(201).json(response);
        } catch (error) {
            res.status(error.status).json(error.message);
        }
    }

    async deleteThread(req: Request, res: Response){
        ThreadService.delete(req,res)
    }
})

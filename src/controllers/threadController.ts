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

    async createThread(req: Request, res: Response) {
        try {
            let data;
            console.log(req.body);
            
               if (!req.file) {
                data = {
                    content: req.body.content,
                    author: res.locals.loginSession.id,
                };
            } else {
                data = {
                    content: req.body.content,
                    image: req.file.filename,
                    author: res.locals.loginSession.id,
                };
            }
            console.log(data, 'data');
            
            const response = await ThreadService.createThread(data);

            res.status(201).json(response);
        } catch (error) {
            res.status(error.status).json(error.message);
        }
    }

    async updateThread(req: Request, res: Response){
        try {
            let data
    
            if(!req.file) {
                data = {
                    content: req.body.content
                }
            }else {
                data = {
                    content: req.body.content,
                    image: req.file.filename
                }                
            }
            const response = await ThreadService.updateThread(req.params, data, res.locals.loginSession.id)
            res.status(200).json(response)
        } catch (error) {
            res.status(error.status).json({message: error.message})
            
        }
    }
    async deleteThread(req: Request, res: Response){
        try {
            const response = await ThreadService.deleteThread(req.params, res.locals.loginSession.id)
            res.status(200).json(response)
        } catch (error) {
            res.status(error.status).json({message: error.message})
            
        }
    }
})

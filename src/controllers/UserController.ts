import { Request, Response } from "express";
import UserServices from "../services/UserServices";

export default new class UserControllers {
    all(req: Request,res: Response){
        UserServices.find(req, res)
    }
    findOne(req: Request,res: Response){
        UserServices.findOne(req, res)
    }

    update(req: Request,res: Response){
        UserServices.update(req, res)
    }
    delete(req: Request,res: Response){
        UserServices.delete(req, res)
    } 

    async uploadPicture(req: Request, res: Response) {
        try {
            console.log("response", res.locals.filename, req.params.id)
            // const image = res.locals.filename
            // console.log("image", image)
            const response = await UserServices.uploadPicture(
                parseInt(req.params.id, 10),
                res.locals.loginSession.id,
                req.file.filename
                );
                res.status(200).json(response);
                console.log("response", response)
        } catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }
    // async uploadCover(req: Request, res: Response) {
    //     try {
    //         console.log("response", req.file)
    //         const response = await UserServices.uploadCover(
    //             parseInt(req.params.id, 10),
    //             res.locals.loginSession.id,
    //             req.file.filename
    //             );
    //         res.status(200).json(response);
    //     } catch (error) {
    //         res.status(error.status).json({ message: error.message });
    //     }
    // }

    async getCurrent(req: Request, res: Response) {
        try {
            const response = await UserServices.getCurrent(res.locals.loginSession.id);

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }  

}
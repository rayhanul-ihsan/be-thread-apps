import { NextFunction, Request, Response } from "express"
import * as jwt from 'jsonwebtoken'

export default new class AuthMiddlewares {
    Auth(req: Request, res: Response, next: NextFunction) :Response{
        const authHeader = req.headers.authorization
        console.log(authHeader);
        

        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({message: "unauthrize"});
        }

        const token = authHeader.split(" ")[1];
        console.log(token);
        
        try{
            const loginSession =jwt.verify(token, "apaajah");
            res.locals.loginSession =loginSession
            next()
        } catch(error){
            return res.status(401).json({message: "token not valid"});
        };
    };
};
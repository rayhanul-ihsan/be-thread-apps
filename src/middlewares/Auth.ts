import { NextFunction, Request, Response } from "express"
import * as jwt from 'jsonwebtoken'

export default new class AuthMiddlewares {
    Auth(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization
        
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({message: "Login dulu Tolol!!"});
        }
 
        const token = authHeader.split(" ")[1];
        
        try{
            const loginSession : jwt.JwtPayload = jwt.verify(token, "apaajah") as jwt.JwtPayload;
            
            res.locals.loginSession = loginSession.obj
            
            next()
        } catch(error){
            return res.status(401).json({message: "token not valid"});
        };
    };
};
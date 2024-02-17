import { NextFunction, Request, Response } from 'express'
import * as multer from 'multer'
import * as path from 'path'

export default new class UploadImage {
    upload(fieldname: string) {
        const storage= multer.diskStorage({
            destination: (req, res, cb) => {
                cb(null, 'src/upload')
             },
             filename: (req,file, cb) => {
                cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
             }
        })
        const uploadFile = multer({
            storage
        })
        return (req: Request, res: Response, next: NextFunction) => {
            uploadFile.single(fieldname)(req,res, (error: any) => {
                if (error){
                    return res.status(400).json({message:'while proccessing upload image'})
                }
                next()
            })
        }
    }

}
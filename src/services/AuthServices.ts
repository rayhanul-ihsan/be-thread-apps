import { AppDataSource } from "../data-source"
import { User } from "../entity/User"
import { Repository } from "typeorm"
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { Request, Response } from "express"


export default new class AuthService {
    private readonly AuthRepository: Repository<User> = AppDataSource.getRepository(User)

    async register (reqbody:any): Promise<object | string> {
        try {
            const CheckUserName = await this.AuthRepository.count({where:{user_name: reqbody.user_name}})
            if(CheckUserName > 0)return `username: ${reqbody.user_name} has already used`

            const hashPassword = await bcrypt.hash(reqbody.password, 10)
            const obj = this.AuthRepository.create({
                user_name: reqbody.user_name,
                full_name: reqbody.full_name,
                email: reqbody.email,
                bio: reqbody.bio,
                profile_picture: reqbody.profile_picture,
                image_cover: reqbody.image_cover,
                password: hashPassword
            })
            const resRgis = await this.AuthRepository.save(obj)
            return {
                message: "SUCCESS",
                data: resRgis
            }
        } catch (error) {
            throw error
        }
    }
    async login (reqbody:any): Promise<object | string> {
        try {
            const checkUserName = await this.AuthRepository.findOneBy({user_name: reqbody.user_name})

            if(!checkUserName)return `username: ${reqbody.user_name} has not found`

            const isCheckPass = await bcrypt.compare(reqbody.password, checkUserName.password)
            if(!isCheckPass) return `password salah` 

            const obj = this.AuthRepository.create({
                id: checkUserName.id,
                user_name: checkUserName.user_name,
                full_name: checkUserName.full_name,
                email: checkUserName.email,
                bio: checkUserName.bio,
                profile_picture: checkUserName.profile_picture,
                image_cover: checkUserName.image_cover
            })
            const token =jwt.sign({obj}, "apaajah", {expiresIn: '24h'} )
            return {
                message:'Login SUCCSESS',
                token,
                user: obj
        }
        } catch (error) {
            throw error
        }
    }

    async loginCheck (req: Request, res: Response): Promise<Response | string> {
        try {
            const loginSession = res.locals.loginSession
            const user = await this.AuthRepository.findOne({
                where:
                {
                    id: loginSession.obj.id
                }
            })

            return res.status(200).json(user)
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}
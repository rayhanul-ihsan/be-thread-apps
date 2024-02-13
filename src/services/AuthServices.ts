import { AppDataSource } from "../data-source"
import { User } from "../entity/User"
import { Repository } from "typeorm"
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'


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

            const checkPass = await bcrypt.compare(reqbody.password, checkUserName.password)
            if(!checkPass) return `password salah` 

            const obj = this.AuthRepository.create({
                id: checkUserName.id,
                user_name: checkUserName.user_name,
                full_name: checkUserName.full_name,
                email: checkUserName.email
            })
            const token =jwt.sign({obj}, 'apaajah', {expiresIn: '24h'} )
            return {
                message:'login SUCCSESS',
                token
        }
        } catch (error) {
            throw error
        }
    }
}
import { Repository } from "typeorm"
import { Thread } from "../entity/Threads"
import { AppDataSource } from "../data-source"
import updateThreadSchema, { createThreadSchema } from "../utils/validator/CreatThreadValidator"
import { validate } from "../utils/validator/validation"
import cloudinary from "../libs/cloudinary"
import { Request, Response, response } from "express"
import CostumeError from "../error/CostumeError"

export default new (class ThreadService{
    private readonly threadRepository: Repository<Thread> = AppDataSource.getRepository(Thread)


    async getThreads() {
        return this.threadRepository.find({
            relations:{
                author: true,
                likes: true,
                replies: true
            },
            select:{
                author: {
                    full_name: true,
                    user_name: true,
                    profile_picture: true
                },
                likes: {
                    id: true
                },
                replies: {
                    id: true
                },
            },
        })
    }
    async getThread(id) {
        return this.threadRepository.findOne({
            relations:{
                author: true,
                likes: true,
                replies: true
            },
            select:{
                author: {
                    full_name: true,
                    user_name: true,
                    profile_picture: true
                },
                likes: {
                    id: true
                },
                replies: {
                    id: true,
                    content: true,
                    image: true,
                    likes: {
                        id: true,
                    },
                    replies: {
                        id: true,
                    },
                    author: {
                        full_name: true,
                        user_name: true,
                        profile_picture: true,
                    },
                    created_at: true,
                },
            },
        })
    }
    async createThread(data) {
        const isValid = validate(createThreadSchema, data)
        let valid
        
        console.log(data)
        if (data.image && data.content) {
            cloudinary.upload()
            const uploadFile = await cloudinary.destination(isValid.image)

            valid = {
                content: isValid.content,
                image: uploadFile.secure_url,
                author: isValid.author
            }
        } else if (!data.image && data.content) {
            valid = {
                content: isValid.content,
                author: isValid.author
            }
        } else if ( data.image && !data.content) {
            cloudinary.upload()
            const uploadFile = await cloudinary.destination(isValid.image)
            valid = {
                image: uploadFile.secure_url,
                author: isValid.author
            }
        } else {
            throw new CostumeError(400, "content or image is required")
        }
        console.log('va',valid);
        
        await this.threadRepository.save(valid)
        return{
            message: "Thread Created",
            data: valid
        }
    }
    async update(req: Request, res :Response): Promise<Response>{
        try {
            // mengambil id dari req params lalu diubah tipe datanya jadi integer
            const id = parseInt(req.params.id, 10)

            //setelah mendapatkan id lalu akan 
            //melakukan pencarian data dengan findOne sesuai id nya
            const obj = await this.threadRepository.findOne({
                where:{
                    id
                }
            })

            //melakukan pencarian data brdasarkan id tadi,jika tidak ada makan akan dihanddle dalam error
            if(!obj)
            return res.status(404).json({
                message: `Thread ID not found`
            })

            //mendapatkan data dari inputannya
            const data ={
                content: req.body.content, 
                image:req.file.filename
            }
            //melakukan pengecekan menggunakan validator
            const {error,value} = updateThreadSchema.validate(data)
            if (error) return res.status(400).json(error.details[0].message)

            cloudinary.upload()
            const uploadFile = await cloudinary.destination(value.image)
            // if (data) {
            //     obj.content= value.content
            //     obj.image_thread= value.image_thread
            // }
            if (data.content){
                obj.content= value.content
            }
            if (data.image){
                obj.image= uploadFile.secure_url
            }

            const thread = await  this.threadRepository.save(obj)
            return res.status(200).json(thread)

        } catch (error) {
            return res.status(500).json(error)
        }
    }


    //fahmi punya
    // async updateThread(id, data, session) {
    //     console.log("data service",data)
    //     const checkThread = await this.threadRepository.findOne({ 
    //         where: id,
    //         relations:{
    //             author: true
    //         }
    //     })
    //     console.log("ini check thread",checkThread)
    //     if(checkThread.author.id !== session.id) {
    //         throw new CostumeError(403, "forbidden")
    //     }
    //     const isValid = validate(updateThreadSchema, data)
    //     console.log("ini isvalid",isValid)
    //     let valid
        
    //     if (data.image && data.content) {
    //         cloudinary.upload()
    //         const uploadFile = await cloudinary.destination(isValid.image)
    
    //         valid = {
    //             content: isValid.content,
    //             image: uploadFile.secure_url,
    //             updatedAt: isValid.updatedAt
    //         }
    //     } else if (!data.image && data.content) {
    //         valid = {
    //             content: isValid.content,
    //             updatedAt: isValid.updatedAt
    //         }
    //     } else if ( data.image && !data.content) {
    //         cloudinary.upload()
    //         const uploadFile = await cloudinary.destination(isValid.image)
    //         valid = {
    //             image: uploadFile.secure_url,
    //             updatedAt: isValid.updatedAt
    //         }
    //     } else {
    //         throw new CostumeError(400, "content or image is required")
    //     }

    //     await this.threadRepository.update(id, valid)
    //     return {
    //         message: "Thread update",
    //         data: valid
    //     }
    // }


    async delete(req: Request, res: Response): Promise<Response>{
        try {
            // mengambil id dari req params lalu diubah tipe datanya jadi integer
            const id = parseInt(req.params.id, 10)
            //setelah mendapatkan id lalu akan melakukan pencarian data dengan findOne sesuai id nya
            const obj = await this.threadRepository.findOne({where : {id}}) 
             //melakukan pencarian data brdasarkan id tadi,jika tidak ada makan akan dihanddle dalam error
            if(!obj) return res.json({message :  "Thread Id not found"})

            //se
            const thread = await this.threadRepository.delete(id)
            return res.status(200).json({messagae : "Succses Delete Thread", thread})
        } catch (error) {
            return res.status(500).json(error)
        }
    }
    // async deleteThread(id, loginSession) {
    //     const checkThread = await this.threadRepository.findOne({ where: {id}})
    //     if (!checkThread) throw new CostumeError(404, "Not Found!")

    //     if (loginSession !== checkThread.author.id) throw new CostumeError(403, "Cannot delete another users Thread")

    //     await this.threadRepository.delete(id)
    //     return {
    //         message: "Thread deleted"
    //     }
    // }

})
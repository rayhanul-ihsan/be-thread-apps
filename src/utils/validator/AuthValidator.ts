import * as Joi from 'joi'

export const registerSchema = Joi.object({
    user_name: Joi.string().max(100).required(),
    full_name: Joi.string().min(8).max(100).required(),
    email: Joi.string().required(),
    password: Joi.string().min(8).required()
})

const loginSchema = Joi.object({
    user_name: Joi.string().min(8).max(100).required(),
    password: Joi.string().min(8).required()
})

export default loginSchema
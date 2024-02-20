import * as Joi from 'joi'

export const createThreadSchema = Joi.object({
    content: Joi.string().max(225),
    image: Joi.string(),
    author: Joi.number()
})

const updateThreadSchema = Joi.object({
    content: Joi.string().max(225),
    image: Joi.string(),
    updateAt: Joi.date().default(new Date())
})

export default updateThreadSchema
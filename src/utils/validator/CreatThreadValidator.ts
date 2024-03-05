import * as Joi from 'joi'
 
export const createThreadSchema = Joi.object({
    content: Joi.string().max(225).optional().allow(''),
    image: Joi.string().optional(),
    author: Joi.number()
})

const updateThreadSchema = Joi.object({
    content: Joi.string().max(225).optional().allow(''),
    image: Joi.string().optional(),
    updateAt: Joi.date().default(new Date())
})

export default updateThreadSchema
import * as Joi from "joi"
export const ReplyThreadSchema = Joi.object({
    content: Joi.string().max(225).optional().allow(''),
    image: Joi.string().optional(),
    thread: Joi.number().required(),
    author: Joi.number().required()
})
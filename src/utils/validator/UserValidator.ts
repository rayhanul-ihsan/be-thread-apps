import * as Joi from 'joi'

export const updateUserSchema = Joi.object({
    user_name: Joi.string(),
    full_name: Joi.string(),
    email: Joi.string(),
    password: Joi.string().min(8),
    profile_picture: Joi.string().max(255).allow(null),
    image_cover: Joi.string().max(255).allow(null),
    bio: Joi.string().max(255).allow(null),
})
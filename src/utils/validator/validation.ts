import { Request } from "express";
import { Schema } from "joi";
import CostumeError from "../../error/CostumeError";

export const validate = (schema: Schema, req: Request) => {
    const result = schema.validate(req,{
        abortEarly: false,
        allowUnknown: false,
    })
    if (result.error){
        throw new CostumeError(400,result.error.message)
    } else {
        return result.value
    }
}
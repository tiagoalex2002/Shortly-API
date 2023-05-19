import joi from "joi"

const urlSchema= joi.object({
    url: joi.url().required()
})

export default urlSchema;
import joi from "joi"

const urlSchema= joi.object({
    url: joi.uri().required()
})

export default urlSchema;
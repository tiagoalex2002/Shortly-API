import { Router } from "express";
import { getUser, getRanking } from "../Controllers/users.controllers.js";
import validateSchema from "../Middleware/validateSchema.js";
import { authValidation } from "../Middleware/authValidation.js";

const userRouter= Router()

userRouter.get("/ranking", getRanking)
userRouter.get("/users/me", authValidation, getUser)

export default userRouter
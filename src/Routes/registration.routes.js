import { Router } from "express"
import { signIn , signUp} from "../Controllers/registration.controllers.js";
import validateSchema from "../Middleware/validateSchema.js";
import signinSchema from "../Schemas/signinSchema.js";
import signupSchema from "../Schemas/signupSchema.js";


const registrationRouter = Router()

registrationRouter.post("/signup", validateSchema(signupSchema) ,signUp)
registrationRouter.post("/signin", validateSchema(signinSchema) ,signIn)


export default registrationRouter;
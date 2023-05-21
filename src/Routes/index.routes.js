import { Router } from "express"
import userRouter from "./users.routes.js";
import urlRouter from "./urls.routes.js";
import registrationRouter from "./registration.routes.js";


const router = Router()
router.use(userRouter)
router.use(urlRouter)
router.use(registrationRouter)

export default router;
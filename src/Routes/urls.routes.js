import { Router } from "express";
import { deleteUrl, getUrlbyId, shortenUrls } from "../Controllers/urls.controllers.js";
import validateSchema from "../Middleware/validateSchema.js";
import { authValidation } from "../Middleware/authValidation.js";
import urlSchema from "../Schemas/urlSchema.js";

const urlRouter= Router();

urlRouter.post("/urls/shorten", authValidation, validateSchema(urlSchema), shortenUrls)
urlRouter.get("/urls/:id",getUrlbyId)
urlRouter.delete("/urls/:id", authValidation, deleteUrl)

export default urlRouter;
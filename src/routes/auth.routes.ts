
import Router from "express";
import {register, login} from "../controllers/auth.controller.js";
import {registerSchema, loginSchema} from "../schema/auth.schema.js";
import {validate} from "../middlewares/authValidation.js";

const authRouter = Router();

authRouter.post('/register',validate(registerSchema), register);

authRouter.post('/login', validate(loginSchema), login);

export default authRouter;
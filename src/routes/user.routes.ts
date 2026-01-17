import Router from "express";
import {authenticateToken} from "../middlewares/auth.middleware.js";
import {getProfile} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get('/profile', authenticateToken, getProfile);


export default userRouter;
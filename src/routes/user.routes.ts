import Router from "express";
import {authenticateToken} from "../middlewares/auth.middleware.js";
import {getProfile, getUsers} from "../controllers/user.controller.js";
import { getUserPosts } from "../controllers/post.controller.js";

const userRouter = Router();

userRouter.get('/profile', authenticateToken, getProfile);

userRouter.get('/:id/posts', authenticateToken, getUserPosts);

userRouter.get('/', authenticateToken, getUsers);

export default userRouter;
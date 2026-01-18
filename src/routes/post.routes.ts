
import Router from "express";

import {validate} from "../middlewares/authValidation.js";
import {createPostSchema, updatePostSchema} from "../schema/post.schema.js";
import {authenticateToken} from "../middlewares/auth.middleware.js";
import {createPost, getPosts, deletePost, updatePost} from "../controllers/post.controller.js";


const postRouter = Router();

postRouter.post('/', authenticateToken, validate(createPostSchema), createPost);
postRouter.get('/', authenticateToken, getPosts);
postRouter.delete('/:id', authenticateToken, deletePost);
postRouter.patch('/:id', authenticateToken, validate(updatePostSchema), updatePost)

export default postRouter;

import Router from "express";

import {validate} from "../middlewares/authValidation.js";
import {createPostSchema, updatePostSchema} from "../schema/post.schema.js";
import {addCommentSchema} from "../schema/comment.schema.js";
import {authenticateToken} from "../middlewares/auth.middleware.js";

import {createPost,
        getPosts,
        deletePost,
        updatePost}
    from "../controllers/post.controller.js";
import {addComment,
        getCommentsOfPost,
        deleteComment,
        updateComment}
    from "../controllers/comment.controller.js";
import { toggleLike } from "../controllers/like.controller.js";

const postRouter = Router();

postRouter.post('/',
    authenticateToken, 
    validate(createPostSchema), 
    createPost
);

postRouter.get('/', 
    authenticateToken, 
    getPosts
);

postRouter.delete('/:id', 
    authenticateToken, 
    deletePost
);

postRouter.patch('/:id', 
    authenticateToken, 
    validate(updatePostSchema), 
    updatePost
);

postRouter.post('/:id/comments', 
    authenticateToken, 
    validate(addCommentSchema), 
    addComment
);

postRouter.get('/:id/comments', 
    authenticateToken, 
    getCommentsOfPost
);

postRouter.delete('/comments/:id', 
    authenticateToken, 
    deleteComment
);

postRouter.patch('/comments/:id', 
    authenticateToken, 
    validate(addCommentSchema), 
    updateComment
);

postRouter.post('/:id/like', 
    authenticateToken, 
    toggleLike
);

export default postRouter;
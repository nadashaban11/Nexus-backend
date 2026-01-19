
import type {Request, Response} from "express";

import pool from "../config/db.js";
import type {Comment} from "../models/models.js";

export const addComment = async (req: Request, res: Response) => {
    try{
        const userId = req.user?.id;
        const content = req.body.content;
        const postId = Number(req.params.id);

        const query = `
            INSERT INTO comments (content, user_id, post_id)
            VALUES($1, $2, $3)
            RETURNING *;
        `
        const comment = (await pool.query<Comment>(query, [content, userId, postId])).rows[0];
        
        res.status(201).json({
            message: "Comment added successfully",
            data: {comment: comment}
        });
    }
    catch(error: any){
        console.error(error);

        if (error.code === '23503') {
            return res.status(404).json({ 
                error: "Post not found. It might have been deleted." 
            });
        }

        res.status(500).json({
            error: "Server error"
        });
    }
}

export const getCommentsOfPost = async (req: Request, res: Response) => {
    try{
        const postId = Number(req.params.id);
        const query = `
            SELECT c.id,
                c.content,
                c.created_at,
                c.updated_at,
                u.id AS user_id,
                u.user_name
            FROM comments c 
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = $1
            ORDER BY c.created_at ASC; 
        `;

        const result = await pool.query(query, [postId]);

        res.status(200).json({
            message: "successful",
            total: result.rows.length,
            data: { comments: result.rows }
        });

    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
}

export const deleteComment = async (req: Request, res: Response) => {
    try{
        const commentId = Number(req.params.id);
        const userId = Number(req.user?.id);

        const query = `
            DELETE FROM comments 
            WHERE user_id = $1 AND id = $2
            RETURNING *;
        `;
        const deletedComment = (await pool.query<Comment>(query, [userId, commentId])).rows[0];
        
        if(!deletedComment){
            return res.status(404).json({
                error: "comment not found or you are not allowed to delete it"
            });
        }

        res.status(200).json({
            message: "Comment deleted successfully",
            data: {
                deleted_comment: deletedComment
            }
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            error: "Server error"
        });
    }
}

export const updateComment = async (req: Request, res: Response) => {
    try{
        const commentId = Number(req.params.id);
        const userId = Number(req.user?.id);
        const updated = req.body.content;

        const query = `
            UPDATE comments
            SET content = $1, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $2 AND id = $3
            RETURNING *;
        `;

        const updatedComment = (await pool.query(query, [updated, userId, commentId])).rows[0];

        if(!updatedComment){
            return res.status(404).json({
                error: "comment not found or you are not allowed to edit it "
            });
        }

        res.status(200).json({
            message: "Comment updated successfully",
            data: {
                comment: updatedComment
            }
        })
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            error: "Server error"
        });
    }
}
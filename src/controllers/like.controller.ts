
import type {Request, Response} from "express";
import pool from "../config/db.js";

export const toggleLike = async (req: Request, res: Response) => {
    try{
        const userId = Number(req.user?.id);
        const postId = Number(req.params.id);

        if (isNaN(postId)) {
            return res.status(400).json({ error: "Invalid Post ID" });
        }

        const checkIfLiked = 
            `SELECT * FROM likes WHERE user_id = $1 AND post_id = $2;`;
        const result = await pool.query(checkIfLiked, [userId, postId]);

        if(result.rows.length != 0){
            const deleteLike = 
                `DELETE FROM likes WHERE user_id = $1 AND post_id = $2;`;
            await pool.query(deleteLike, [userId, postId]);

            return res.status(200).json({
                message: "Post unliked successfully",
                data: {
                    isLiked: false
                }
            });
        }
        else{
            const addLike = 
                `INSERT INTO likes (user_id, post_id) VALUES ($1, $2);`;
            await pool.query(addLike, [userId, postId]);

            return res.status(201).json({
                message: "Post liked successfully",
                data: {
                    isLiked: true
                }
            });
        }
    }
    catch(error: any) {
        console.error(error);
        // Error Code 23503 (Foreign Key Violation)
        if (error.code === '23503') {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(500).json({
            error: "Server error"
        });
    }
}
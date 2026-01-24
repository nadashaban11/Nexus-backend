
import type {Request, Response} from "express";
import pool from "../config/db.js";
import type { Post } from "../models/models.js";

export const createPost = async (req: Request, res: Response) =>{
    try{
        const {title, content, url} = req.body;
        const userId = req.user?.id;

        const query = `
            INSERT INTO posts (title, content, url, user_id)
            values($1, $2, $3, $4)
            RETURNING *;
        `;

        const vals = [title, content, url, userId];
        const result = await pool.query<Post>(query, vals);
        const post = result.rows[0];

        return res.status(201).json({
            message: "Post created successfully",
            data: {post: post}
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            error: "Server error"
        });
    } 
}

export const getPosts = async (req: Request, res: Response) =>{

    try{
        const userId = Number(req.user?.id);

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const s = req.query.search as string || "";

        let searchQuery = "";
        let params: (string | number)[] = [userId, limit, offset];

        if(s){
            searchQuery = "AND (posts.title ILIKE $4 OR posts.content ILIKE $4)";
            params.push(`%${s}%`)
        }

        const query = `
            SELECT posts.*, users.user_name,
                (SELECT COUNT(*):: int FROM likes WHERE post_id = posts.id) AS likes_count,
                EXISTS(
                    SELECT 1 FROM likes
                    WHERE post_id = posts.id AND user_id = $1
                ) AS "isLiked"
            FROM posts 
            JOIN users ON posts.user_id = users.id
            WHERE 1=1
            ${searchQuery}
            ORDER BY posts.created_at DESC
            LIMIT $2 OFFSET $3;
        `;

        const result = await pool.query<Post>(query, params);

        const q = (!s)? `SELECT COUNT(*) FROM posts` : 
            `SELECT COUNT(*) FROM posts
             WHERE posts.title ILIKE $1 OR posts.content ILIKE $1
        `;

        const countParams = s ? [`%${s}%`] : [];
        const total = Number((await pool.query(q, countParams)).rows[0].count);

        res.status(200).json({
            message: "successful",
            total : total,
            page: page,
            limit: limit,
            total_pages: Math.ceil(total/limit),
            data: {posts: result.rows}
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            error: "Server error"
        });
    }

}

export const getUserPosts = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.user?.id); 
        
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10; 
        const offset = (page - 1) * limit;      
        
        const s = req.query.search as string || "";

        let params: any[] = [userId, limit, offset];
        let searchClause = "";

        if (s) {
            searchClause = "AND (posts.title ILIKE $4 OR posts.content ILIKE $4)";
            params.push(`%${s}%`);
        }

        const query = `
            SELECT 
                posts.*, 
                users.user_name,
                (SELECT COUNT(*):: int FROM likes WHERE post_id = posts.id) AS likes_count,
                EXISTS(
                    SELECT 1 FROM likes 
                    WHERE post_id = posts.id AND user_id = $1
                ) AS "isLiked"
            FROM posts
            JOIN users ON users.id = posts.user_id  
            
            WHERE posts.user_id = $1
            ${searchClause}
            
            ORDER BY posts.created_at DESC  
            LIMIT $2 OFFSET $3;
        `;
        
        const result = await pool.query<Post & { user_name: string; likes_count: number; isLiked: boolean }>(query, params);

        const countQuery = s 
            ? `SELECT COUNT(*) FROM posts WHERE user_id = $1 AND (title ILIKE $2 OR content ILIKE $2)`
            : `SELECT COUNT(*) FROM posts WHERE user_id = $1`;
            
        const countParams = s ? [userId, `%${s}%`] : [userId];
        
        const total = Number((await pool.query(countQuery, countParams)).rows[0].count);

        res.status(200).json({
            message: "successful",
            total: total,
            page: page,
            limit: limit,
            total_pages: Math.ceil(total / limit),
            data: { posts: result.rows }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
}

export const deletePost = async (req: Request, res: Response) => {
    try{
        const postId = Number(req.params.id);
        const userId = req.user?.id;
        const query = `
            DELETE FROM posts
            WHERE id = $1 AND user_id = $2
            RETURNING *
        `;
        const post = (await (pool.query<Post>(query, [postId, userId]))).rows[0];

        if(!post){
            return res.status(404).json({
                error: "Post not found or you are not authorized to delete it"
            });
        }

        res.status(200).json({
            message: "Post deleted successfully",
            data: {deleted_post: post}
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            error: "Server error"
        });
    }
}

export const updatePost = async (req: Request, res: Response) =>{
    try{
        const postId = req.params.id;
        const userId = Number(req.user?.id);

        const title = req.body.title || null;
        const content = req.body.content || null;
        const url = req.body.url || null;

        const query = `
            UPDATE posts 
            SET title = COALESCE($1, title),
                content = COALESCE($2, content),
                url = COALESCE($3, url),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4 AND user_id = $5
            RETURNING * ;
        `;

        const updated = (await pool.query(query, [title, content, url, postId, userId])).rows[0];

        if(!updated){
            res.status(404).json({
                error: "Post not found or you are not authorized to update it"
            });
        }

        res.status(200).json({
            message: "Post updated successfully",
            data: { post: updated}
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            error: "Server error"
        });
    }
}
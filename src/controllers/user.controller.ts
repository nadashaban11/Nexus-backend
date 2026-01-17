
import type {Request, Response} from "express";
import pool from "../config/db.js";

export const getProfile = async (req: Request, res: Response)=>{
    try{
        if(! req.user){
            return res.status(401).json({error: "Unauthorized"});
        }

        const userId = req.user.id;
        const query = `
        SELECT id, first_name, last_name, user_name, email, created_at
        FROM users
        WHERE id = $1 
        `;
        const result = await pool.query(query, [userId]);
        const user = result.rows[0];

        if(!user){
            return res.status(404).json({error: "User not found"});
        }

        res.status(200).json({
            message: "success",
            data: {user}
        })

    }
    catch(error){
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
}
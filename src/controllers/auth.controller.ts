import type {Request, Response} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import pool from "../config/db.js";
import type {User} from "../models/models.js"

export const register = async (req: Request, res: Response) =>{
    try{
        const {first_name, last_name, user_name, email, password} = req.body;

        const hashedPass = await bcrypt.hash(password, 10);
        
        const query = `
            INSERT INTO users (first_name, last_name, user_name, email, password)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, user_name, email;
        `;
        const vals = [first_name, last_name, user_name, email, hashedPass];
        const result = await pool.query<Pick<User, 'id' | 'user_name' | 'email'>>(query, vals);

        res.status(201).json({
            message: "User created successfully!",
            user: result.rows[0]
        });
    }catch(error: any){
        console.error(error);
        
        res.status(500).json({
            error: "server Error"
        });
    }
}

export const login = async (req: Request, res: Response) =>{
    try{
        const {email, password} = req.body;

        const sqlQuery = "SELECT * FROM users WHERE email = $1;";
        const result = await pool.query<User>(sqlQuery, [email]);
        if(result.rows.length === 0){
            return res.status(400).json({
                error: "user does not exist"
            });
        }
        const userFromDb = result.rows[0];
        if(!(await bcrypt.compare(password, userFromDb?.password as string))){
            return res.status(401).json({
                error: "invalid cradintials"
            })
        }

        // correct user

        const token = jwt.sign({id: userFromDb!.id, email: userFromDb!.email},process.env.JWT_SECRET as string,{expiresIn: process.env.JWT_EXPIRATION as any});

        res.status(200).json({
            message: "login successful",
            token: token,
            user: {
                id: userFromDb!.id,
                user_name: userFromDb!.user_name,
                email: userFromDb!.email
            }
        });
    }
    catch(error: any){
        console.error(error)
        res.status(500).json({
            message: "Server error"
        });
    }

}
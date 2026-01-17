
import type { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import {type TokenPayload} from "../models/models.js";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;

    if(auth){
        const token = auth.split(' ')[1];

        try{
            const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as TokenPayload;
            req.user = decoded;
            next();
        }
        catch(error: any){
            return res.status(403).json({error: "Invalid token"});
        }
    }
    else{
        return res.status(401).json({error: "No token provided"});
    }
}
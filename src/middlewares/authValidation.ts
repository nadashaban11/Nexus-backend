import type { Request, Response, NextFunction } from 'express';
import {type ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body = schema.parse(req.body); 
        next();
    }
    catch (error) {
        if (error instanceof ZodError) {
            const formattedErrors = error.issues.map(issue => ({
                field: issue.path[0], 
                message: issue.message 
            }));

            return res.status(400).json({ 
                status: 'error', 
                errors: formattedErrors 
            });
        }
        
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
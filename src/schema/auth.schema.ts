import {ZodObject} from "zod";
import * as z from "zod";

export const registerSchema = z.object({
    first_name: z.string().trim()
        .min(1, "First name is required")
        .min(3, "First name must be at least 3 characters"),
    last_name: z.string().trim()
        .min(1, "Last name is required")
        .min(3, "Last name must be at least 3 characters"),
    user_name: z.string().trim()
        .min(1, "User name is required")
        .min(3, "User name must be at least 3 characters"),
    email: z.string().trim()
        .min(1, "Email is required")
        .email("Invalid email format"),
    password: z.string().trim()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
});

export const loginSchema = z.object({
    email: z.string().trim()
        .min(1, "Email is required")
        .email("Invalid email format"),
    password: z.string().trim()
        .min(1, "Password is required")
})
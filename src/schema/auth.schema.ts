import {ZodObject} from "zod";
import * as z from "zod";

const nameRegex = /^[a-zA-Z\s]+$/;
const usernameRegex = /^[a-zA-Z0-9_]+$/;

export const registerSchema = z.object({
    first_name: z.string().trim()
        .min(1, "First name is required")
        .min(3, "First name must be at least 3 characters")
        .regex(nameRegex, "First name can only contain letters"),
    last_name: z.string().trim()
        .min(1, "Last name is required")
        .min(3, "Last name must be at least 3 characters")
        .regex(nameRegex, "First name can only contain letters"),
    user_name: z.string().trim()
        .min(1, "User name is required")
        .min(3, "User name must be at least 3 characters")
        .regex(usernameRegex, "User name can only contain letters, numbers, and underscores"),
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
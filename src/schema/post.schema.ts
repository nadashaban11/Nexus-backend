
import * as z from "zod";

export const createPostSchema = z.object({
    title: z.string().trim()
        .min(3, "title must be at least 3 characters")
        .max(200, "title is too long"),
    content: z.string().optional(),
    url: z.string().trim().url("must be a valid URL"),
    tags: z.array(z.string()).optional()
});


export const updatePostSchema = createPostSchema.partial();

import * as z from "zod";

export const addCommentSchema = z.object({
    content: z.string().trim()
    .min(1, "comment can not be empty")
});
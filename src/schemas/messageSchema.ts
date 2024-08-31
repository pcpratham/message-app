import { z } from "zod";


export const messageSchema = z.object({
    content: z
    .string()
    .min(10,{message:"Min content length must be 10"})
    .max(500,{message:"Max content length must be 500"}),
});




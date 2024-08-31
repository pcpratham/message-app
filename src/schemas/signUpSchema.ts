import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2, "Username must be of length 2")
    .max(7, "Username can be of max Length 7")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid Email" }),
    password : z.string().min(6,{message:"Password must be of length 6"})

});


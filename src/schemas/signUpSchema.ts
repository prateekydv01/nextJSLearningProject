import {email, z} from "zod";

export const usernameValidation = z
    .string()
    .min(3,"Username must be of 3 character")
    .max(20,"Username Cannot be more then 20 Characters")
    .regex(/^[a-zA-Z0-9_]+$/,"Username must not contrain special Character or spaces in-between")

export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid Email Address"}),
    password:z.string().min(6,{message:"password must be of 6 characters"})
})
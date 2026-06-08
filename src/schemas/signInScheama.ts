import {z} from "zod"

export const signInSchema = z.object({
    iderntifier:z.string(),
    password:z.string()
})
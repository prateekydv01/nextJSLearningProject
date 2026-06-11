import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import z, { success } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
    username : usernameValidation
})

export async function  GET(request:Request) {

    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParam  = {
            username:searchParams.get('username')
        }

        const result = usernameQuerySchema.safeParse(queryParam)
        console.log(result)
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
            success:false,
            message : usernameErrors?.length>0 ? usernameErrors.join(', '):'invalid query params'
        },{status:400})
        }

        const {username} = result.data
        const existingVerifiedUser = await userModel.findOne({
            username,isVerified: true
        })

        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:"username is already taken"
            },{status: 400})
        }

        return Response.json({
                success:true,
                message:"username available"
            },{status: 200})

    } catch (error) {
        console.log("Error while checking username",error)
        return Response.json({
            success:false,
            message : "error checking username"
        },{status:500})
    }

}
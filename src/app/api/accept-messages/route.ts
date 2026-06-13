import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";

export async function POST(request:Request){
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user= session?.user !

    if(!session || !session.user){
        return Response.json({
            success:false,
            message: "Not authneticated"
        },{status:401})
    }

    const userID = user._id;
    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await userModel.findByIdAndUpdate(userID,
            {isAcceptingMessage:acceptMessages},
            {new:true}
        )

        if(!updatedUser){
            return Response.json({
                success:false,
                message: "failed to update user status to accept message as updation of user failed"
            },{status:401})
        }

        return Response.json({
            success: true,
            message: "user status Accept message status updated",
            updatedUser
        },{status:201})

    } catch (error) {
        console.log("error while updating user status to accept messages: ",error)
        return Response.json({
                success:false,
                message: "failed to update user status to accept message "
            },{status:500})
    }

}

export async function GET(request:Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user= session?.user !

    if(!session || !session.user){
        return Response.json({
            success:false,
            message: "Not authneticated"
        },{status:401})
    }

     const userID = user._id;

    try {
        const foundUser = await userModel.findById(userID)
    
        if(! foundUser){
            return Response.json({
                status:false,
                message: "User not found ! "
            },{status:404})
        }
    
        return Response.json({
                success: true,
                isAcceptingMessage: foundUser.isAcceptingMessage
            },{status:200})
        
    } catch (error) {
         console.log("error in getting message acceptatnce user : ",error)
        return Response.json({
                success:false,
                message: "Error in getting acceptance message user "
            },{status:500})
    }
    
}
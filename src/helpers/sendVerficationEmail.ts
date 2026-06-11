import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { success } from "zod";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        
        const data = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: 'Verification code',
            react: VerificationEmail({username,otp:verifyCode}),
        });
        

        return {success: true, message: "verification email send successfully"}
        
    } catch (emailError) {
        console.error("Error sending verifcation emial: ",emailError)
        return {success:false,message:"Failed to send Verification Emails"}
    }
}
import { transporter } from "@/lib/nodemailer";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hello ${username},</h2>
          <p>Thank you for registering.</p>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 5px;">${verifyCode}</h1>
          <p>This code will expire shortly.</p>
          
        </div>
      `,
    });

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("Error sending verification email:", error);

    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
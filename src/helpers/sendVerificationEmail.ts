import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string

):Promise<ApiResponse>{
    try{

        await resend.emails.send({
            from: '<onboarding@resend.dev>',
            to: [email],
            subject: 'Mystery message Verification Code',
            react: VerificationEmail({ username: username,otp:verifyCode }),
          });
        return {
            success:true,
            message:"Verification Email sent successfully"
        }
    }
    catch(emailErr){
        console.log("Error in sending verification email",emailErr);
        return {
            success:false,
            message:"Error in sending verification email"
        }
    }
}
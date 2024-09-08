import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { messageSchema } from "@/schemas/messageSchema";


export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "username already exists"
            }, { status: 400 });
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserByEmail) {
            //user hai 
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User already registered with this email"
                }, { status: 400 });
            }
            else{
                const hashedPassword = await bcryptjs.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        }
        else {
            const hashedPassword = await bcryptjs.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            });
            await newUser.save();
        }

        //sending verification email
        const emailResponse = await sendVerificationEmail(email,username,verifyCode);

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 400 });
        }

        return Response.json({
            success: true,
            message: "User registerd successfully"
        }, { status: 200 });

    }
    catch (err) {
        console.log("Error in sign-up", err);
        return Response.json({
            success: false,
            message: "Error in sign-up"
        }, {
            status: 500
        });

    }
}

import { sendVerificationEmail } from "@/helpers/emailVerifcation";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from 'bcryptjs';


export async function POST(req: Request,) {
    await dbConnect();
    try {
        //user data from request
        const { username, email, password } = await req.json();
        console.log('username, email, password', username, email, password);


        //check if user already exists
        const existingUserByVerification = await UserModel.findOne({ username, isVerified: true });

        if (existingUserByVerification) {

            return Response.json({
                success: false,
                message: 'User already exists'
            }, { status: 400 });

        }

        const existingUserByEmail = await UserModel.findOne({ email });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        //found but not verified
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: 'User already exists with this email'
                }, { status: 400 }
                )

            } else {
                const hasedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hasedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpire = new Date(Date.now() + 36000000)
                await existingUserByEmail.save();
            }
        } else {
            //visit first time then register
            const hasedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date(); //object milra he 
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                verifyCode,
                verifyCodeExpire: expiryDate,
                isAcceptingMessage: true,
                isVerified: false,
                messages: []
            })
            await newUser.save();

        }

        //send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 }
            )
        }

        return Response.json({
            success: true,
            message: 'User registered successfully'
        }, { status: 201 }
        )



    } catch (error) {

        console.error('Error User registration: ', error);
        return Response.json({
            success: false,
            message: 'Error User registration. Please try again later.'
        }, {
            status: 500
        }
        )

    }
}


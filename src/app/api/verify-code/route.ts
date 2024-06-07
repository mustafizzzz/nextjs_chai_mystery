import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";


export async function POST(request: Request) {
    await dbConnect();

    try {
        const { usernmae, code } = await request.json();
        const decodedUsername = decodeURIComponent(usernmae);
        const user = await UserModel.findOne({ username: decodedUsername });
        if (!user) {

            return Response.json({
                success: false,
                message: 'User not found'
            }, {
                status: 500
            }
            )

        }
        const isCodevalid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpire) > new Date();

        if (isCodevalid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: 'Account verified successfully'
            }, {
                status: 200
            })

        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: 'Verification code is expired. Please request a new one'
            }, {
                status: 400
            })


        } else {
            return Response.json({
                success: false,
                message: 'Code is wrong please try again with correct code'
            }, {
                status: 400
            })

        }

    } catch (error) {

        console.error('Error User Code verification: ', error);
        return Response.json({
            success: false,
            message: 'Error User Verification. Please try again later.'
        }, {
            status: 500
        }
        )

    }

}

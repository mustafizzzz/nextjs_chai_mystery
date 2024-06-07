import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";



const UserNameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: Request) {

    // if (request.method !== 'GET') {
    //     return Response.json({
    //         success: false,
    //         message: 'Method is Wrong use GET method'
    //     }, { status: 405 })
    // }

    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username'),
        }

        //validate with zod
        const result = UserNameQuerySchema.safeParse(queryParam);
        console.log('result', result);//check only
        if (!result.success) {
            return Response.json({
                success: false,
                message: result.error.format().username?._errors || 'User name erro'
            }, {
                status: 400
            })
        }

        const { username } = result.data;
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: 'User name is already taken'
            }, {
                status: 400
            })
        }
        return Response.json({
            success: true,
            message: 'User name is unique you good to go'
        }, {
            status: 200
        })




    } catch (error) {

        console.log('error in check-username-unique', error);
        return Response.json({
            success: false,
            message: 'error in check-username-unique'
        }, {
            status: 500
        })


    }

}
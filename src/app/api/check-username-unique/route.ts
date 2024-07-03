import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";



const UserNameQuerySchema = z.object({
    username: usernameValidation
});
export const dynamicParams = true

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
            return new Response(JSON.stringify({
                success: false,
                message: result.error.format().username?._errors || "Username error",
            }), {
                status: 400,
            });
        }

        const { username } = result.data;
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })
        // console.log("Verfied user details ::", existingVerifiedUser);

        if (existingVerifiedUser) {
            return new Response(JSON.stringify({
                success: false,
                message: "Username is already taken",
            }), {
                status: 400,
            });
        }

        return new Response(JSON.stringify({
            success: true,
            message: "Username is unique",
        }), {
            status: 200,
        });




    } catch (error) {

        console.log('error in check-username-unique', error);
        return new Response(JSON.stringify(
            {
                success: false,
                message: "Error in check-username-unique",
            }), {
            status: 500,
        });


    }

}
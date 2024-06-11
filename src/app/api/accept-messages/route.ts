import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from 'next-auth'

export async function POST(request: Request) {

    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: 'Not authenticated'
        },
            { status: 401 })
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: 'faild to update user status to accept messages'
            },
                { status: 401 })

        }
        return Response.json({
            success: true,
            message: 'Message status updated successfully',
            updatedUser
        },
            { status: 200 })

    } catch (error) {

        console.log('faild to update user status to accept messages');
        return Response.json({
            success: false,
            message: 'faild to update user status to accept messages'
        },
            { status: 500 })
    }

}

export async function GET(request: Request) {

    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: 'Not authenticated'
        },
            { status: 401 })
    }

    try {
        const userId = user._id;
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json({
                success: false,
                message: 'User not found'
            },
                { status: 404 })
        }
        return Response.json({
            success: true,
            message: 'User found',
            isAcceptingMessages: foundUser.isAcceptingMessage,
            foundUser
        },
            { status: 200 })
    } catch (error) {

        console.log('Error in getting user status to accept messages');
        return Response.json({
            success: false,
            message: 'Error in getting user status to accept messages'
        },
            { status: 404 })

    }

}
import { resend } from "@/lib/resendEmail";

import VerificationEmail from "../../emailTemplate/verificationEmail";

import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail
    (email: string,
        username: string,
        verifyCode: string): Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mstery Mail Verification code',
            react: VerificationEmail //template for email
                ({
                    username,
                    otp: verifyCode
                }),
        });




        return {
            success: true,
            message: 'vrification email send successfully'
        }

    } catch (emailError) {
        console.error('Error sending email: ', emailError);
        return {
            success: false,
            message: 'Error sending email. Please try again later.'
        }
    }

}
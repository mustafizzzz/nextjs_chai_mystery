import { use } from 'react';
import { z } from 'zod';


export const usernameValidation =
    z
        .string()
        .min(3, 'Minimum 3 character required')
        .max(20, 'Maximum 20 character allowed')
        .regex(/^[a-zA-Z0-9_]*$/, 'Only alphanumeric and underscore allowed');

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be Minimum 6 character required' }),

})
import { z } from "zod";



export const messageSchema = z.object({
    content: z.string()
        .min(10, { message: 'Message must be Minimum 10 character required' })
        .max(300, { message: 'Message must be Maximum 300 character allowed' }),
})
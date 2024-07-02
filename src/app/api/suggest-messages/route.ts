import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// const openai = new OpenAI({
//     apiKey: "sk-proj-Pq8eF2oQ6PZXsegcT7ZLT3BlbkFJlyw65qNkANj8tBUj231p",
//     //process.env.OPENAI_API_KEY,
// });

const genAI = new GoogleGenerativeAI("AIzaSyAQXXRZjtLLf55rG6w1Wc0znHOavPj20xc");



export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const prompt =
            "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);

        if (!response) {
            return Response.json({
                success: false,
                message: 'Error Error suggest messages. Please try again later.'
            }, {
                status: 500
            }
            )
        } else {
            return Response.json({
                success: true,
                textData: text
            })

        }


        // const response = await openai.completions.create({
        //     model: 'gpt-3.5-turbo',
        //     max_tokens: 400,
        //     stream: true,
        //     prompt,
        // });

        // const stream = OpenAIStream(response);
        // return new StreamingTextResponse(stream);

    } catch (error) {
        // if (error instanceof OpenAI.APIError) {
        //     // OpenAI API error handling
        //     const { name, status, headers, message } = error;
        //     return NextResponse.json({ name, status, headers, message }, { status });
        // } else {
        //     // General error handling
        //     console.error('An unexpected error occurred:', error);
        //     throw error;
        // }


        console.error('Error suggest messages: ', error);
        return Response.json({
            success: false,
            message: 'Error Error suggest messages. Please try again later.'
        }, {
            status: 500
        }
        )
    }
}
'use client'

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/apiResponse';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { set } from 'mongoose';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {

    const [inputMessage, setInputMessage] = useState("");
    const [suggestedMessages, setSuggestedMessages] = useState([
        "What is something or someone that always manages to brighten your day?",
        "Tell us about a memorable travel experience you've had.",
        "If you could learn any skill instantly, what would it be?"
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSugesstion, setIsLoadingSugesstion] = useState(false);

    const param = useParams<{ username: string }>();
    const username = param.username;
    const { toast } = useToast();

    const handelMessageSend = async () => {
        setIsLoading(true);
        try {
            const reponse = await axios.post<ApiResponse>(`/api/send-message`, {
                username,
                content: inputMessage
            })

            if (reponse.data.message === 'User not found') {
                console.log('User not found');

                toast({
                    title: 'Invalid Username',
                    description: 'User not found',
                    variant: 'destructive',
                })

            }

            if (!reponse) {
                toast({
                    title: 'Sending Failed',
                    description: 'Error while sending message. Please try again.',
                    variant: 'destructive',
                });
                setIsLoading(false);
            }


            toast({
                title: 'Message Sent successfully',
                variant: 'default',
            });
            setInputMessage("");
            setIsLoading(false);

        } catch (error) {
            console.log('Error during verification:', error);

            toast({
                title: 'Sending Failed',
                description: 'Error while sending message. Please try again.',
                variant: 'destructive',
            });
            setIsLoading(false);

        }

    }

    const handelSuggestMessage = async () => {
        setIsLoadingSugesstion(true);
        try {
            const reponse = await axios.post(`/api/suggest-messages`);

            if (!reponse) {
                toast({
                    title: 'Suggesting Failed',
                    description: 'Error while suggesting message. Please try again.',
                    variant: 'destructive',
                });
                setIsLoadingSugesstion(false);
            }

            toast({
                title: 'Message Suggested successfully',
                variant: 'default',
            });



            console.log('Suggested Message:', reponse.data.textData);
            // Remove double quotes from messages
            const messagesWithoutQuotes = reponse.data.textData.replace(/"/g, '');
            // Split messages by '||'
            const messages = messagesWithoutQuotes.split("||");
            // const messages = reponse.data.textData.split("||");<==== problem of "" in the message


            setSuggestedMessages(messages);
            setIsLoadingSugesstion(false);

        } catch (error) {
            console.log('Error during Suggestion messages:', error);

            toast({
                title: 'Suggesting Failed',
                description: 'Error while suggesting message. Please try again.',
                variant: 'destructive',
            });
            setIsLoadingSugesstion(false);

        }

    }



    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 py-12">
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
                {/* Heading */}
                <h1 className="text-3xl font-bold mb-4 text-center">Public Profile Link</h1>

                {/* Subheading and Text Area */}
                <div className="mb-6">
                    <p className="text-lg mb-2 text-center">Send anonymous message to @{username}</p>
                    <textarea
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Write your anonymous message here"
                        rows={2}
                        onChange={(e) => setInputMessage(e.target.value)}
                        value={inputMessage}
                    ></textarea>
                    <Button className="w-full mt-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        onClick={handelMessageSend}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait...
                            </>
                        ) : (
                            'Send Message'
                        )}
                    </Button>
                </div>

                {/* Suggest Message Button */}
                <div className="mb-6">
                    <Button className="w-full py-2 mb-4 bg-blue-800 text-white rounded-lg hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onClick={handelSuggestMessage}
                        disabled={isLoadingSugesstion}>
                        {isLoadingSugesstion ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait...
                            </>
                        ) : (
                            'Suggest Message'
                        )}
                    </Button>

                    <p className="text-center mb-4">Click on any message below to select it.</p>

                    <div className="flex flex-col items-center space-y-2">
                        {/* <button className="w-full py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300">
                            What is something or someone that always manages to brighten your day?
                        </button> */}
                        {suggestedMessages.map((message, index) => (
                            <button
                                key={index}
                                className="w-full py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                onClick={() => setInputMessage(message)}
                            >
                                {message}
                            </button>
                        ))}

                    </div>
                </div>

                {/* Footer Heading */}
                <div className="mt-6 text-center">
                    <h2 className="text-xl font-semibold">Get started with your anonymous feedback</h2>
                </div>
            </div>
        </div>
    )
}



export default page
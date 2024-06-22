'use client'

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/models/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const page = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const { toast } = useToast();

    const handelDeleteMessage = (messageId: string) => {
        //instant ui update
        setMessages(messages.filter(message => message._id !== messageId));
    }

    const { data: session } = useSession();
    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
    })
    const { register, watch, setValue } = form;
    const acceptMessges = watch('acceptMessges');

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const reponse = await axios.get<ApiResponse>(`/api/accept-messages`);
            setValue('acceptMessges', reponse.data.isAcceptingMessage);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || 'Failed to fetch accept messages',
                variant: 'destructive'
            })

        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue])

    //fetch all the mesages
    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        setIsSwitchLoading(true);
        try {

            const reponse = await axios.get<ApiResponse>(`/api/get-messages`)
            setMessages(reponse.data.messages || []);

            if (refresh) {
                toast({
                    title: 'Refreshed MMessges',
                    description: 'showing latest messages',

                })
            }


        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || 'Failed to fetch messages',
                variant: 'destructive'
            })

        } finally {
            setIsSwitchLoading(false);
            setIsLoading(false);
        }


    }, [setIsLoading, setMessages]);

    useEffect(() => {
        if (!session || !session.user) return;
        fetchMessages();
        fetchAcceptMessage();
    }, [session, setValue, fetchAcceptMessage, fetchMessages]);

    //handle switch change
    const handelSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>(`/api/accept-messages`, {
                acceptMessges: !acceptMessges,
            })
            setValue('acceptMessges', !acceptMessges);
            toast({
                title: response.data.message,
                description: 'User status updated successfully'
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || 'Failed to update user status to accept messages',
                variant: 'destructive'
            })
        }


    }

    const { username } = session?.user as User;
    const baseURL = `${window.location.protocol}//${window.location.host}`;
    const profileURL = `${baseURL}/u/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileURL);
        toast({
            title: 'URL Copied',
            description: 'Profile URL copied to clipboard'
        })
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileURL}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register('acceptMessges')}
                    checked={acceptMessges}
                    onCheckedChange={handelSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessges ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                            key={index}
                            message={message}
                            onMessageDelete={handelDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    )
}

export default page
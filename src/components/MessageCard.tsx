import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Message } from '@/models/User'
import { useToast } from './ui/use-toast'
import axios from 'axios'
import { ApiResponse } from '@/types/apiResponse'

type MessageCardProps = {
  message: Message,
  onMessageDelete: (messageId: any) => void;
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

  const { toast } = useToast();

  const handelDeleteConfrim = async () => {

    const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);

    toast({
      title: response.data.message,
    })
    // console.log("Message ka content dekh ::::", message._id);
    onMessageDelete(message._id);
  }
  return (
    <div>
      <Card>
        <CardHeader className="flex justify-between flex-row">
          <CardTitle>{message.content}</CardTitle>



          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive"><X className='w-5 h-5' /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handelDeleteConfrim}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>




        </CardHeader>
        <CardContent>
          <p className='font-bold'>{new Date(message.createdAt).toLocaleString('en-IN', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default MessageCard
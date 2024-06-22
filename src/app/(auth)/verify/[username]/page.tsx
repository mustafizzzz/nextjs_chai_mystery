'use client'
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form';
import * as  z from 'zod';

const VerifyAccount = () => {

  const router = useRouter();
  const param = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const reponse = await axios.post('/api/verify-code',
        {
          username: param.username,
          code: data.code
        });
      toast({
        title: 'Success',
        description: reponse.data.message
      })

      router.replace('/sign-in');

    } catch (error) {

      console.error('Error during verification:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      // Default error message
      let errorMessage = axiosError.response?.data.message;
      ('There was a problem with your Verification. Please try again.');

      toast({
        title: 'Verification failed',
        description: errorMessage,
        variant: 'destructive',
      });



    }

  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">

        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Acoount
          </h1>
          <p className='mb-4'>
            Enter the verification code sent to your email
          </p>

        </div>

      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="code"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input placeholder="enter code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default VerifyAccount
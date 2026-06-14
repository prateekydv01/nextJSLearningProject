'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

import { toast } from 'sonner';

import { messageSchema } from '@/schemas/messageScheam';
import { ApiResponse } from '@/types/ApiResponse';

const specialChar = '||';

const parseStringMessages = (
  messageString: string
): string[] => {
  return messageString
    .split(specialChar)
    .map((msg) => msg.trim())
    .filter(Boolean);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

type MessageFormData = z.infer<typeof messageSchema>;

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [isLoading, setIsLoading] = useState(false);

  const [isSuggestLoading, setIsSuggestLoading] =
    useState(false);

  const [suggestedMessages, setSuggestedMessages] =
    useState<string[]>(
      parseStringMessages(initialMessageString)
    );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  const messageContent = watch('content');

  const handleMessageClick = (message: string) => {
    setValue('content', message, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (
    data: MessageFormData
  ) => {
    setIsLoading(true);

    try {
      const response =
        await axios.post<ApiResponse>(
          '/api/send-messages',
          {
            ...data,
            username,
          }
        );

      toast.success(response.data.message);

      reset({
        content: '',
      });
    } catch (error) {
      const axiosError =
        error as AxiosError<ApiResponse>;

      toast.error(
        axiosError.response?.data.message ??
          'Failed to send message'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);

    try {
      const response = await axios.post(
        '/api/suggest-messages'
      );

      const questions = parseStringMessages(
        response.data.questions || ''
      );

      setSuggestedMessages(questions);

      toast.success(
        'Suggestions generated successfully'
      );
    } catch (error) {
      const axiosError =
        error as AxiosError<ApiResponse>;

      toast.error(
        axiosError.response?.data.message ??
          'Failed to generate suggestions'
      );
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-8 max-w-4xl rounded bg-white p-6">
      <h1 className="mb-6 text-center text-4xl font-bold">
        Public Profile Link
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Send Anonymous Message to @{username}
          </label>

          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <Textarea
                id="content"
                placeholder="Write your anonymous message here"
                className="resize-none"
                {...field}
              />
            )}
          />

          {errors.content && (
            <p className="text-sm text-red-500">
              {errors.content.message}
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={
              isLoading ||
              !messageContent?.trim()
            }
          >
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {isLoading
              ? 'Please wait'
              : 'Send It'}
          </Button>
        </div>
      </form>

      <div className="my-8 space-y-4">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            disabled={isSuggestLoading}
            className="my-4"
            type="button"
          >
            {isSuggestLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {isSuggestLoading
              ? 'Generating...'
              : 'Suggest Messages'}
          </Button>

          <p>
            Click on any message below to
            select it.
          </p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">
              Suggested Messages
            </h3>
          </CardHeader>

          <CardContent className="flex flex-col space-y-4">
            {suggestedMessages.map(
              (message, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  onClick={() =>
                    handleMessageClick(
                      message
                    )
                  }
                  className="justify-start h-auto whitespace-normal text-left"
                >
                  {message}
                </Button>
              )
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <div className="text-center">
        <div className="mb-4">
          Get Your Message Board
        </div>

        <Link href="/sign-up">
          <Button>
            Create Your Account
          </Button>
        </Link>
      </div>
    </div>
  );
}
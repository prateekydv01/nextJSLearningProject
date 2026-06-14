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
  <div className="relative min-h-screen overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />

    {/* Blur Effects */}
    <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
    <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

    <div className="relative z-10 container mx-auto px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-2xl border bg-background/70 p-8 shadow-2xl backdrop-blur-md">
        <h1 className="mb-2 text-center text-4xl font-extrabold tracking-tight">
          Public
          <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            {' '}
            Profile
          </span>
        </h1>

        <p className="mb-8 text-center text-muted-foreground">
          Send completely anonymous messages to @{username}
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Your Anonymous Message
            </label>

            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="content"
                  placeholder={`Write an anonymous message to @${username}`}
                  className="min-h-[140px] resize-none bg-background/60 backdrop-blur"
                  {...field}
                />
              )}
            />

            {errors.content && (
              <p className="text-sm text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={
                isLoading ||
                !messageContent?.trim()
              }
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              {isLoading
                ? 'Please wait...'
                : 'Send Message'}
            </Button>
          </div>
        </form>

        <div className="my-10">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                AI Suggested Messages
              </h2>

              <p className="text-sm text-muted-foreground">
                Click any suggestion to use it.
              </p>
            </div>

            <Button
              onClick={
                fetchSuggestedMessages
              }
              disabled={
                isSuggestLoading
              }
              type="button"
            >
              {isSuggestLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              {isSuggestLoading
                ? 'Generating...'
                : 'Generate Suggestions'}
            </Button>
          </div>

          <Card className="border bg-background/50 shadow-xl backdrop-blur-md">
            <CardHeader>
              <h3 className="text-xl font-semibold">
                Suggested Messages
              </h3>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              {suggestedMessages.map(
                (
                  message,
                  index
                ) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    onClick={() =>
                      handleMessageClick(
                        message
                      )
                    }
                    className="h-auto justify-start whitespace-normal text-left"
                  >
                    {message}
                  </Button>
                )
              )}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <div className="text-center">
          <h3 className="mb-2 text-xl font-semibold">
            Want your own message
            board?
          </h3>

          <p className="mb-6 text-muted-foreground">
            Create an account and
            start receiving anonymous
            feedback.
          </p>

          <Link href="/sign-up">
            <Button size="lg">
              Create Your Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);
}
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';

import { useSession } from 'next-auth/react';
import { User } from 'next-auth';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';

import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

import MessageCard from '@/components/MessageCard';

function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });

  const { control, watch, setValue } = form;

  const acceptMessages = watch('acceptMessages');

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.filter(
        (message) =>
          message._id.toString() !== messageId
      )
    );
  };

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const res = await axios.get<ApiResponse>(
        '/api/accept-messages'
      );

      setValue(
        'acceptMessages',
        res.data.isAcceptingMessage ?? false
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error(
        axiosError.response?.data.message ??
          'Failed to fetch message settings'
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);

    try {
      const response =
        await axios.get<ApiResponse>(
          '/api/get-messages'
        );

      setMessages(response.data.messages || []);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error(
        axiosError.response?.data.message ??
          'Failed to fetch messages'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.user) return;

    fetchAcceptMessage();
    fetchMessages();
  }, [
    session,
    fetchAcceptMessage,
    fetchMessages,
  ]);

  const handleSwitchChange = async (
    checked: boolean
  ) => {
    try {
      const response =
        await axios.post<ApiResponse>(
          '/api/accept-messages',
          {
            acceptMessages: checked,
          }
        );

      setValue(
        'acceptMessages',
        checked
      );

      toast.success(response.data.message);
    } catch (error) {
      const axiosError =
        error as AxiosError<ApiResponse>;

      toast.error(
        axiosError.response?.data.message ??
          'Failed to update message settings'
      );
    }
  };

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  const { username } =
    session.user as User;

  const profileUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/u/${username}`
      : '';

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(
      profileUrl
    );

    toast.success(
      'Profile URL copied to clipboard'
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />

      {/* Blur Effects */}
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border bg-background/70 p-8 shadow-2xl backdrop-blur-md">
          <h1 className="mb-8 text-4xl font-extrabold tracking-tight">
            {username}'s
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              {' '}
              Dashboard
            </span>
          </h1>

          {/* Profile Link */}
          <div className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">
              Copy Your Unique Link
            </h2>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="w-full rounded-lg border bg-background/60 px-4 py-2 backdrop-blur"
              />

              <Button
                onClick={copyToClipboard}
                className="sm:w-auto"
              >
                Copy Link
              </Button>
            </div>
          </div>

          {/* Accept Messages Toggle */}
          <div className="mb-8 rounded-xl border bg-background/40 p-4 backdrop-blur">
            <div className="flex items-center gap-4">
              <Controller
                name="acceptMessages"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field?.value as boolean}
                    onCheckedChange={
                      handleSwitchChange
                    }
                    disabled={
                      isSwitchLoading
                    }
                  />
                )}
              />

              <span className="font-medium">
                Accept Messages:{' '}
                <span className="text-primary">
                  {acceptMessages
                    ? 'On'
                    : 'Off'}
                </span>
              </span>
            </div>
          </div>

          <Separator />

          {/* Messages */}
          <div className="mt-8">
            <h2 className="mb-6 text-2xl font-bold">
              Anonymous Messages
            </h2>

            {isLoading ? (
              <div className="py-10 text-center text-muted-foreground">
                Loading messages...
              </div>
            ) : messages.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {messages.map(
                  (message) => (
                    <MessageCard
                      key={message._id.toString()}
                      message={
                        message
                      }
                      onMessageDelete={
                        handleDeleteMessage
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <div className="rounded-xl border bg-background/40 p-8 text-center text-muted-foreground backdrop-blur">
                No messages found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
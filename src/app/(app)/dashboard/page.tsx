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
    return <div>Loading...</div>;
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
    <div className="mx-4 my-8 w-full max-w-6xl rounded bg-white p-6 md:mx-8 lg:mx-auto">
      <h1 className="mb-4 text-4xl font-bold">
        User Dashboard
      </h1>

      {/* Profile Link */}
      <div className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">
          Copy Your Unique Link
        </h2>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="w-full rounded border p-2"
          />

          <Button
            onClick={copyToClipboard}
          >
            Copy
          </Button>
        </div>
      </div>

      {/* Accept Messages Toggle */}
      <div className="mb-6 flex items-center gap-3">
        <Controller
          name="acceptMessages"
          control={control}
          render={({ field }) => (
            <Switch
              checked ={field?.value as boolean}
              onCheckedChange={
                handleSwitchChange
              }
              disabled={
                isSwitchLoading
              }
            />
          )}
        />

        <span>
          Accept Messages:{' '}
          {acceptMessages
            ? 'On'
            : 'Off'}
        </span>
      </div>

      <Separator />

      {/* Messages */}
      <div className="mt-6">
        <h2 className="mb-4 text-2xl font-semibold">
          Messages
        </h2>

        {isLoading ? (
          <p>Loading messages...</p>
        ) : messages.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          <p>No messages found.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
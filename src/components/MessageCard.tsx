'use client';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
} from '@/components/ui/alert-dialog';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from 'sonner';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

function MessageCard({
  message,
  onMessageDelete,
}: MessageCardProps) {
  const handleDeleteConfirm = async () => {
    try {
      const res = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );

      toast.success(res.data.message);

      onMessageDelete(message._id.toString());
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error(
        axiosError.response?.data.message ??
          'Failed to delete message'
      );
    }
  };

 return (
  <Card className="group border bg-background/60 backdrop-blur-md transition-all duration-300 hover:border-primary/30 hover:shadow-xl">
    <CardHeader className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-primary">
            Anonymous Message
          </div>

          <CardDescription className="text-xs">
            {new Date(
              message.createdAt
            ).toLocaleString()}
          </CardDescription>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="opacity-60 hover:opacity-100 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete Message?
              </AlertDialogTitle>

              <AlertDialogDescription>
                This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleDeleteConfirm}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="rounded-xl border bg-muted/30 p-4">
        <CardTitle className="text-base font-normal leading-7 break-words">
          {message.content}
        </CardTitle>
      </div>
    </CardHeader>
  </Card>
);
}

export default MessageCard;
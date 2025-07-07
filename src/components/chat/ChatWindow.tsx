"use client";
import {
  ChatMessage as ChatMessageType,
  SwapRequest,
  UserProfile,
} from "@/shared/types";
import LoadingSpinner from "@/tailwind/components/elements/LoadingSpinner";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Alert, { AlertVariant } from "@/tailwind/components/layout/Alert";
import clsx from "clsx";
import React, { useCallback, useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import MessageInput from "./MessageInput";
interface TypingUser {
  userId: string;
  userName: string;
  timestamp: number;
}
interface FileUpload {
  file: File;
  preview?: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "failed";
  error?: string;
}
export interface ChatWindowProps {
  swapRequest: SwapRequest;
  otherUser: UserProfile;
  currentUser: UserProfile;
  messages: ChatMessageType[];
  isLoading?: boolean;
  isSending?: boolean;
  error?: string | null;
  isOnline?: boolean;
  lastSeen?: Date;
  typingUsers?: TypingUser[];
  isTyping?: boolean;
  connectionStatus?: "connected" | "connecting" | "disconnected" | "error";
  enableFileUploads?: boolean;
  enableEncryption?: boolean;
  onSendMessage: (message: string, attachments?: FileUpload[]) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  onBack?: () => void;
  onViewSwapDetails?: () => void;
  onMarkAsRead?: () => void;
  className?: string;
}
const ChatWindow: React.FC<ChatWindowProps> = React.memo(
  ({
    swapRequest,
    otherUser,
    currentUser,
    messages,
    isLoading = false,
    isSending = false,
    error = null,
    isOnline = false,
    lastSeen,
    typingUsers = [],
    isTyping = false,
    connectionStatus = "connected",
    enableFileUploads = true,
    enableEncryption = false,
    onSendMessage,
    onTypingStart,
    onTypingStop,
    onBack,
    onViewSwapDetails,
    onMarkAsRead,
    className = "",
  }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = useCallback((smooth = true) => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: smooth ? "smooth" : "auto",
          block: "end",
        });
      }
    }, []);
    useEffect(() => {
      scrollToBottom();
    }, [messages.length, scrollToBottom]);
    useEffect(() => {
      scrollToBottom(false);
    }, [scrollToBottom]);
    useEffect(() => {
      if (onMarkAsRead && messages.length > 0) {
        const timer = setTimeout(onMarkAsRead, 1000);
        return () => clearTimeout(timer);
      }
    }, [messages.length, onMarkAsRead]);
    const groupedMessages = messages.reduce(
      (groups: ChatMessageType[][], message, index) => {
        if (index === 0 || message.senderId !== messages[index - 1].senderId) {
          groups.push([message]);
        } else {
          groups[groups.length - 1].push(message);
        }
        return groups;
      },
      []
    );
    const isChatDisabled =
      !currentUser || !otherUser || connectionStatus === "error";
    const otherTypingUsers = typingUsers.filter(
      (user) => user.userId !== currentUser.id
    );
    return (
      <div
        className={clsx(
          "flex flex-col h-full bg-background",
          "border border-border rounded-lg overflow-hidden",
          className
        )}
      >
        <ChatHeader
          swapRequest={swapRequest}
          otherUser={otherUser}
          currentUser={currentUser}
          onBack={onBack}
          onViewSwapDetails={onViewSwapDetails}
          isOnline={isOnline}
          lastSeen={lastSeen}
          connectionStatus={connectionStatus}
          enableEncryption={enableEncryption}
        />

        {error && (
          <div className="p-4">
            <Alert
              variant={AlertVariant.ERROR}
              message={error}
              className="mb-0"
            />
          </div>
        )}

        <div
          ref={messagesContainerRef}
          className={clsx(
            "flex-1 overflow-y-auto p-4 space-y-4 min-h-0",
            "touch-pan-y",
            "overscroll-behavior-y-contain"
          )}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "var(--border) transparent",
            WebkitOverflowScrolling: "touch",
          }}
          onScroll={(e) => {
            const element = e.currentTarget;
            const isNearBottom =
              element.scrollTop + element.clientHeight >=
              element.scrollHeight - 100;
            if (isNearBottom && onMarkAsRead && messages.length > 0) {
              onMarkAsRead();
            }
          }}
        >
          {isLoading && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <LoadingSpinner className="mb-4" />
              <Typography as={TypographyVariant.P} className="text-text-muted">
                Loading messages...
              </Typography>
            </div>
          )}

          {isLoading && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center px-4">
              <div className="text-4xl sm:text-6xl mb-4 opacity-50">💬</div>
              <Typography
                as={TypographyVariant.H3}
                className="mb-2 text-lg sm:text-xl"
              >
                Start the conversation
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-text-muted max-w-md text-sm sm:text-base"
              >
                Send a message to discuss the details of your swap request.
              </Typography>
            </div>
          )}

          {groupedMessages.map((messageGroup, groupIndex) => (
            <div key={`group-${groupIndex}`} className="space-y-1">
              {messageGroup.map((message, messageIndex) => {
                const isOwnMessage = message.senderId === currentUser.id;
                const isLastInGroup = messageIndex === messageGroup.length - 1;
                const isFirstMessage = groupIndex === 0 && messageIndex === 0;
                const shouldShowTimestamp =
                  isFirstMessage ||
                  (groupIndex > 0 &&
                    messageIndex === 0 &&
                    new Date(message.timestamp).getTime() -
                      new Date(
                        groupedMessages[groupIndex - 1][
                          groupedMessages[groupIndex - 1].length - 1
                        ].timestamp
                      ).getTime() >
                      60 * 60 * 1000);
                return (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isOwnMessage={isOwnMessage}
                    isLastInGroup={isLastInGroup}
                    showTimestamp={shouldShowTimestamp}
                    enableEncryption={enableEncryption}
                  />
                );
              })}
            </div>
          ))}

          {otherTypingUsers.length > 0 && (
            <div className="flex justify-start mb-2">
              <div className="bg-card border border-border rounded-2xl px-4 py-2 max-w-[75%] sm:max-w-[65%] lg:max-w-[55%]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce delay-200" />
                  </div>
                  <Typography
                    as={TypographyVariant.P}
                    className="text-sm text-text-muted"
                  >
                    {otherTypingUsers.length === 1
                      ? `${otherTypingUsers[0].userName} is typing...`
                      : `${otherTypingUsers.length} people are typing...`}
                  </Typography>
                </div>
              </div>
            </div>
          )}

          {isSending && (
            <div className="flex justify-end mb-2">
              <div className="bg-primary/20 rounded-2xl px-4 py-2 max-w-[75%] sm:max-w-[65%] lg:max-w-[55%]">
                <div className="flex items-center gap-2">
                  <LoadingSpinner className="w-4 h-4" />
                  <Typography
                    as={TypographyVariant.P}
                    className="text-sm text-primary"
                  >
                    Sending...
                  </Typography>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <MessageInput
          onSendMessage={(message, attachments) =>
            onSendMessage(message, attachments)
          }
          onTypingStart={onTypingStart}
          onTypingStop={onTypingStop}
          disabled={isChatDisabled}
          isSending={isSending}
          enableFileUploads={enableFileUploads}
          enableEncryption={enableEncryption}
          connectionStatus={connectionStatus}
          placeholder={
            isChatDisabled
              ? connectionStatus === "error"
                ? "Connection error - unable to send messages"
                : "Chat is not available"
              : `Message ${otherUser.name}...`
          }
        />
      </div>
    );
  }
);
ChatWindow.displayName = "ChatWindow";
export default ChatWindow;

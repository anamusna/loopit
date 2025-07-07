"use client";
import { allUsers } from "@/data";
import { useLoopItStore } from "@/store";
import Alert, { AlertVariant } from "@/tailwind/components/layout/Alert";
import Container from "@/tailwind/components/layout/Container";
import { useRouter } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ChatWindow from "./ChatWindow";
export interface ChatContainerProps {
  swapRequestId: string;
  className?: string;
  enableRealTime?: boolean;
  updateInterval?: number;
  enableWebSocket?: boolean;
  enableFileUploads?: boolean;
  enableEncryption?: boolean;
}
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
const ChatContainer: React.FC<ChatContainerProps> = ({
  swapRequestId,
  className = "",
  enableRealTime = true,
  updateInterval = 3000,
  enableWebSocket = false,
  enableFileUploads = true,
  enableEncryption = false,
}) => {
  const router = useRouter();
  const {
    user: currentUser,
    swapRequests,
    conversations,
    isLoadingMessages,
    isAuthenticated,
    sendMessage,
    fetchMessages,
    markMessagesAsRead,
    error,
    clearError,
  } = useLoopItStore();
  const [isSending, setIsSending] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<Date | undefined>(undefined);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "connecting" | "disconnected" | "error"
  >("disconnected");
  const [retryCount, setRetryCount] = useState(0);
  const [messageQueue, setMessageQueue] = useState<
    Array<{ message: string; attachments?: FileUpload[] }>
  >([]);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  const lastMessageTimestampRef = useRef<number>(0);
  const swapRequest = swapRequests.find((req) => req.id === swapRequestId);
  const messages = conversations[swapRequestId] || [];
  const otherUserId =
    currentUser?.id === swapRequest?.fromUserId
      ? swapRequest?.toUserId
      : swapRequest?.fromUserId;
  const otherUser = useMemo(() => {
    if (!otherUserId) return null;
    return allUsers.find((u) => u.id === otherUserId) || null;
  }, [otherUserId]);
  const hasAccess = useMemo(() => {
    if (!currentUser || !swapRequest) return false;
    return (
      currentUser.id === swapRequest.fromUserId ||
      currentUser.id === swapRequest.toUserId
    );
  }, [currentUser, swapRequest]);
  const startRealTimeUpdates = useCallback(() => {
    if (!enableRealTime || !hasAccess || !swapRequestId) return;
    setConnectionStatus("connecting");
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    pollingIntervalRef.current = setInterval(async () => {
      if (!mountedRef.current) return;
      try {
        await fetchMessages(swapRequestId);
        setConnectionStatus("connected");
        setRetryCount(0);
        setIsOnline(Math.random() > 0.3);
        setLastSeen(new Date(Date.now() - Math.random() * 300000));
        setTypingUsers((prev) =>
          prev.filter((user) => Date.now() - user.timestamp < 5000)
        );
      } catch (error) {
        console.warn("Failed to fetch messages during polling:", error);
        setConnectionStatus("error");
        setRetryCount((prev) => prev + 1);
        if (retryCount < 5) {
          const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000);
          setTimeout(() => {
            if (mountedRef.current) {
              startRealTimeUpdates();
            }
          }, retryDelay);
        }
      }
    }, updateInterval);
  }, [
    enableRealTime,
    hasAccess,
    swapRequestId,
    fetchMessages,
    updateInterval,
    retryCount,
  ]);
  const stopRealTimeUpdates = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setConnectionStatus("disconnected");
  }, []);
  const handleTypingStart = useCallback(() => {
    if (!currentUser || !otherUser) return;
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 3000);
  }, [currentUser, otherUser]);
  const handleTypingStop = useCallback(() => {
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);
  const processMessageQueue = useCallback(async () => {
    if (messageQueue.length === 0 || connectionStatus !== "connected") return;
    const queuedMessages = [...messageQueue];
    setMessageQueue([]);
    for (const queuedMessage of queuedMessages) {
      try {
        await sendMessage(swapRequestId, otherUser!.id, queuedMessage.message);
      } catch (error) {
        console.error("Failed to send queued message:", error);
        setMessageQueue((prev) => [...prev, queuedMessage]);
      }
    }
  }, [messageQueue, connectionStatus, swapRequestId, otherUser, sendMessage]);
  useEffect(() => {
    if (hasAccess && swapRequestId) {
      fetchMessages(swapRequestId);
      startRealTimeUpdates();
    }
    return () => {
      stopRealTimeUpdates();
    };
  }, [
    swapRequestId,
    hasAccess,
    fetchMessages,
    startRealTimeUpdates,
    stopRealTimeUpdates,
  ]);
  useEffect(() => {
    processMessageQueue();
  }, [processMessageQueue]);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      stopRealTimeUpdates();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [stopRealTimeUpdates]);
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);
  const handleSendMessage = useCallback(
    async (messageText: string, attachments?: FileUpload[]) => {
      if (!currentUser || !otherUser || !swapRequest) {
        setLocalError("Unable to send message: missing user information");
        return;
      }
      if (!messageText.trim() && (!attachments || attachments.length === 0)) {
        return;
      }
      setIsSending(true);
      setLocalError(null);
      handleTypingStop();
      try {
        if (connectionStatus !== "connected") {
          setMessageQueue((prev) => [
            ...prev,
            { message: messageText, attachments },
          ]);
          setIsSending(false);
          return;
        }
        await sendMessage(swapRequestId, otherUser.id, messageText);
        stopRealTimeUpdates();
        setTimeout(startRealTimeUpdates, 1000);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to send message";
        setLocalError(errorMessage);
        setMessageQueue((prev) => [
          ...prev,
          { message: messageText, attachments },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [
      currentUser,
      otherUser,
      swapRequest,
      swapRequestId,
      connectionStatus,
      sendMessage,
      handleTypingStop,
      stopRealTimeUpdates,
      startRealTimeUpdates,
    ]
  );
  const handleMarkAsRead = useCallback(async () => {
    if (!hasAccess || messages.length === 0) return;
    try {
      await markMessagesAsRead(swapRequestId);
    } catch (error) {
      console.warn("Failed to mark messages as read:", error);
      setTimeout(() => {
        if (mountedRef.current) {
          markMessagesAsRead(swapRequestId).catch(() => {});
        }
      }, 5000);
    }
  }, [hasAccess, messages.length, swapRequestId, markMessagesAsRead]);
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);
  const handleViewSwapDetails = useCallback(() => {
    if (swapRequest) {
      const itemId = swapRequest.itemId;
      router.push(`/item/${itemId}`);
    }
  }, [swapRequest, router]);
  const handleClearError = useCallback(() => {
    setLocalError(null);
    if (error) {
      clearError();
    }
  }, [error, clearError]);
  const handleRetryConnection = useCallback(() => {
    setRetryCount(0);
    setLocalError(null);
    startRealTimeUpdates();
  }, [startRealTimeUpdates]);
  if (!isAuthenticated || !currentUser) {
    return (
      <Container className="py-8">
        <Alert
          variant={AlertVariant.ERROR}
          message="You must be logged in to access chat."
        />
      </Container>
    );
  }
  if (!hasAccess) {
    return (
      <Container className="py-8">
        <Alert
          variant={AlertVariant.ERROR}
          message="You don't have permission to access this conversation."
        />
      </Container>
    );
  }
  if (!swapRequest) {
    return (
      <Container className="py-8">
        <Alert variant={AlertVariant.ERROR} message="Swap request not found." />
      </Container>
    );
  }
  if (!otherUser) {
    return (
      <Container className="py-8">
        <Alert
          variant={AlertVariant.ERROR}
          message="Unable to load conversation participant."
        />
      </Container>
    );
  }
  return (
    <div className={`h-full ${className}`}>
      {connectionStatus !== "connected" && (
        <div className="bg-warning/10 border-b border-warning/20 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === "connecting"
                    ? "bg-warning animate-pulse"
                    : connectionStatus === "error"
                    ? "bg-destructive"
                    : "bg-text-muted"
                }`}
              />
              <span className="text-sm text-warning">
                {connectionStatus === "connecting" && "Connecting..."}
                {connectionStatus === "disconnected" && "Disconnected"}
                {connectionStatus === "error" && "Connection error"}
              </span>
              {messageQueue.length > 0 && (
                <span className="text-xs text-text-muted">
                  ({messageQueue.length} message
                  {messageQueue.length !== 1 ? "s" : ""} queued)
                </span>
              )}
            </div>
            {connectionStatus === "error" && (
              <button
                onClick={handleRetryConnection}
                className="text-sm text-warning hover:text-warning/80 underline"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}

      {localError && (
        <div className="p-4 border-b border-border">
          <Alert
            variant={AlertVariant.ERROR}
            message={localError}
            onDismiss={handleClearError}
            className="mb-0"
          />
        </div>
      )}

      <ChatWindow
        swapRequest={swapRequest}
        otherUser={otherUser}
        currentUser={currentUser}
        messages={messages}
        isLoading={isLoadingMessages}
        isSending={isSending}
        error={localError}
        isOnline={isOnline}
        lastSeen={lastSeen}
        typingUsers={typingUsers}
        isTyping={isTyping}
        connectionStatus={connectionStatus}
        enableFileUploads={enableFileUploads}
        enableEncryption={enableEncryption}
        onSendMessage={handleSendMessage}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
        onBack={handleBack}
        onViewSwapDetails={handleViewSwapDetails}
        onMarkAsRead={handleMarkAsRead}
        className="flex-1"
      />
    </div>
  );
};
ChatContainer.displayName = "ChatContainer";
export default ChatContainer;

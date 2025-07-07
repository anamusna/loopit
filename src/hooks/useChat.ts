import { ChatMessage } from "@/shared/types";
import { useLoopItStore } from "@/store";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
export interface UseChatOptions {
  swapRequestId?: string;
  autoFetch?: boolean;
  enableRealTimeUpdates?: boolean;
  updateInterval?: number; 
}
export interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  unreadCount: number;
  sendMessage: (message: string) => Promise<void>;
  fetchMessages: () => Promise<void>;
  markAsRead: () => Promise<void>;
  clearError: () => void;
  navigateToChat: (swapRequestId: string) => void;
  goBack: () => void;
  startPolling: () => void;
  stopPolling: () => void;
}
export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const {
    swapRequestId,
    autoFetch = true,
    enableRealTimeUpdates = false,
    updateInterval = 5000, 
  } = options;
  const router = useRouter();
  const {
    conversations,
    isLoadingMessages,
    error,
    sendMessage: storeSendMessage,
    fetchMessages: storeFetchMessages,
    markMessagesAsRead,
    clearError: storeClearError,
    user,
    swapRequests,
  } = useLoopItStore();
  const [isSending, setIsSending] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const messages = swapRequestId ? conversations[swapRequestId] || [] : [];
  const unreadCount = messages.filter(
    (msg) => msg.receiverId === user?.id && !msg.isRead
  ).length;
  const sendMessage = useCallback(
    async (message: string) => {
      if (!swapRequestId) {
        throw new Error("No swap request ID provided");
      }
      if (!user) {
        throw new Error("User not authenticated");
      }
      const swapRequest = swapRequests.find((req) => req.id === swapRequestId);
      if (!swapRequest) {
        throw new Error("Swap request not found");
      }
      const receiverId =
        swapRequest.fromUserId === user.id
          ? swapRequest.toUserId
          : swapRequest.fromUserId;
      setIsSending(true);
      try {
        await storeSendMessage(swapRequestId, receiverId, message);
      } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
      } finally {
        setIsSending(false);
      }
    },
    [swapRequestId, user, swapRequests, storeSendMessage]
  );
  const fetchMessages = useCallback(async () => {
    if (!swapRequestId) return;
    try {
      await storeFetchMessages(swapRequestId);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      throw error;
    }
  }, [swapRequestId, storeFetchMessages]);
  const markAsRead = useCallback(async () => {
    if (!swapRequestId) return;
    try {
      await markMessagesAsRead(swapRequestId);
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
      throw error;
    }
  }, [swapRequestId, markMessagesAsRead]);
  const navigateToChat = useCallback(
    (chatSwapRequestId: string) => {
      router.push(`/chat/${chatSwapRequestId}`);
    },
    [router]
  );
  const goBack = useCallback(() => {
    router.back();
  }, [router]);
  const clearError = useCallback(() => {
    storeClearError();
  }, [storeClearError]);
  const startPolling = useCallback(() => {
    if (!enableRealTimeUpdates || !swapRequestId || pollingInterval) return;
    const interval = setInterval(() => {
      fetchMessages();
    }, updateInterval);
    setPollingInterval(interval);
  }, [
    enableRealTimeUpdates,
    swapRequestId,
    pollingInterval,
    fetchMessages,
    updateInterval,
  ]);
  const stopPolling = useCallback(() => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  }, [pollingInterval]);
  useEffect(() => {
    if (autoFetch && swapRequestId) {
      fetchMessages();
    }
  }, [autoFetch, swapRequestId, fetchMessages]);
  useEffect(() => {
    if (enableRealTimeUpdates) {
      startPolling();
    }
    return () => {
      stopPolling();
    };
  }, [enableRealTimeUpdates, startPolling, stopPolling]);
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);
  return {
    messages,
    isLoading: isLoadingMessages,
    isSending,
    error,
    unreadCount,
    sendMessage,
    fetchMessages,
    markAsRead,
    clearError,
    navigateToChat,
    goBack,
    startPolling,
    stopPolling,
  };
}

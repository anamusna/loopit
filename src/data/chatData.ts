import { ChatMessage, MessageStatus } from "@/shared/types";
export const defaultConversations: Record<string, ChatMessage[]> = {
  swap_001: [
    {
      id: "msg_001",
      swapRequestId: "swap_001",
      senderId: "user_002",
      receiverId: "user_001",
      message:
        "Hi! I'm interested in your vintage camera. Is it still available?",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 
      status: MessageStatus.READ,
      isRead: true,
    },
    {
      id: "msg_002",
      swapRequestId: "swap_001",
      senderId: "user_001",
      receiverId: "user_002",
      message:
        "Yes, it's still available! I'd love to see what you have to offer.",
      timestamp: new Date(
        Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000
      ), 
      status: MessageStatus.READ,
      isRead: true,
    },
    {
      id: "msg_003",
      swapRequestId: "swap_001",
      senderId: "user_002",
      receiverId: "user_001",
      message:
        "I have a professional microphone setup that might interest you. Would you like to see photos?",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), 
      status: MessageStatus.READ,
      isRead: true,
    },
    {
      id: "msg_004",
      swapRequestId: "swap_001",
      senderId: "user_001",
      receiverId: "user_002",
      message:
        "That sounds perfect! I've been looking for good audio equipment. Please send the photos.",
      timestamp: new Date(
        Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
      ), 
      status: MessageStatus.DELIVERED,
      isRead: false,
    },
  ],
  swap_002: [
    {
      id: "msg_005",
      swapRequestId: "swap_002",
      senderId: "user_003",
      receiverId: "user_001",
      message:
        "Hey! I saw your guitar listing. I have a keyboard that might be a good trade.",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), 
      status: MessageStatus.DELIVERED,
      isRead: false,
    },
    {
      id: "msg_006",
      swapRequestId: "swap_002",
      senderId: "user_001",
      receiverId: "user_003",
      message:
        "Interesting! What kind of keyboard is it? I'm looking for something with weighted keys.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), 
      status: MessageStatus.READ,
      isRead: true,
    },
    {
      id: "msg_007",
      swapRequestId: "swap_002",
      senderId: "user_003",
      receiverId: "user_001",
      message:
        "It's a Yamaha P-125 with 88 weighted keys. Perfect condition, barely used!",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), 
      status: MessageStatus.DELIVERED,
      isRead: false,
    },
  ],
  swap_003: [
    {
      id: "msg_008",
      swapRequestId: "swap_003",
      senderId: "user_004",
      receiverId: "user_001",
      message:
        "Hi there! I'm interested in your bike. Would you consider trading for art supplies?",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), 
      status: MessageStatus.SENT,
      isRead: false,
    },
  ],
  swap_004: [
    {
      id: "msg_009",
      swapRequestId: "swap_004",
      senderId: "user_001",
      receiverId: "user_005",
      message:
        "Hi! I'm interested in your laptop. Would you like to trade for my camera equipment?",
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), 
      status: MessageStatus.READ,
      isRead: true,
    },
    {
      id: "msg_010",
      swapRequestId: "swap_004",
      senderId: "user_005",
      receiverId: "user_001",
      message:
        "Thanks for reaching out! I'd love to see what camera equipment you have.",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), 
      status: MessageStatus.READ,
      isRead: true,
    },
    {
      id: "msg_011",
      swapRequestId: "swap_004",
      senderId: "user_001",
      receiverId: "user_005",
      message:
        "I have a Canon DSLR with several lenses and a tripod. All in excellent condition.",
      timestamp: new Date(
        Date.now() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
      ), 
      status: MessageStatus.READ,
      isRead: true,
    },
    {
      id: "msg_012",
      swapRequestId: "swap_004",
      senderId: "user_005",
      receiverId: "user_001",
      message:
        "That sounds like a great deal! When would be a good time to meet and check everything out?",
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), 
      status: MessageStatus.READ,
      isRead: true,
    },
  ],
};
export const defaultConversationMetadata: Record<
  string,
  {
    isArchived: boolean;
    isPinned: boolean;
    unreadCount: number;
    lastMessageTime: Date | null;
  }
> = {
  swap_001: {
    isArchived: false,
    isPinned: true,
    unreadCount: 1,
    lastMessageTime: new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
    ),
  },
  swap_002: {
    isArchived: false,
    isPinned: false,
    unreadCount: 2,
    lastMessageTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  swap_003: {
    isArchived: false,
    isPinned: false,
    unreadCount: 1,
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
  },
  swap_004: {
    isArchived: false,
    isPinned: false,
    unreadCount: 0,
    lastMessageTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
};
export const getConversationsForUser = (
  userId: string
): Record<string, ChatMessage[]> => {
  const userConversations: Record<string, ChatMessage[]> = {};
  Object.entries(defaultConversations).forEach(([swapRequestId, messages]) => {
    const userMessages = messages.filter(
      (msg) => msg.senderId === userId || msg.receiverId === userId
    );
    if (userMessages.length > 0) {
      userConversations[swapRequestId] = userMessages;
    }
  });
  return userConversations;
};
export const getConversationMessages = (
  swapRequestId: string
): ChatMessage[] => {
  return defaultConversations[swapRequestId] || [];
};
export const getUnreadMessagesCount = (userId: string): number => {
  let unreadCount = 0;
  Object.values(defaultConversations).forEach((messages) => {
    const unreadMessages = messages.filter(
      (msg) => msg.receiverId === userId && !msg.isRead
    );
    unreadCount += unreadMessages.length;
  });
  return unreadCount;
};
export const getLastMessageForConversation = (
  swapRequestId: string
): ChatMessage | null => {
  const messages = defaultConversations[swapRequestId];
  if (!messages || messages.length === 0) return null;
  return messages[messages.length - 1];
};

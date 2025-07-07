export const CHAT_CONFIG = {
  POLLING_INTERVAL: 3000, 
  TYPING_TIMEOUT: 2000, 
  CONNECTION_TIMEOUT: 10000, 
  RECONNECT_DELAY: 5000, 
  MAX_RECONNECT_ATTEMPTS: 5,
  MAX_MESSAGE_LENGTH: 1000,
  MAX_MESSAGES_PER_BATCH: 50,
  MESSAGE_RETRY_ATTEMPTS: 3,
  MESSAGE_RETRY_DELAY: 2000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, 
  ALLOWED_FILE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  MESSAGES_PER_PAGE: 50,
  SCROLL_THRESHOLD: 100,
  AUTO_SCROLL_DELAY: 100,
  TYPING_INDICATOR_DELAY: 500,
  SOUND_ENABLED_DEFAULT: true,
  NOTIFICATION_TIMEOUT: 5000,
  DESKTOP_NOTIFICATIONS: true,
  SEARCH_MIN_LENGTH: 2,
  SEARCH_DEBOUNCE_DELAY: 300,
  MAX_SEARCH_RESULTS: 100,
  ENCRYPTION_ENABLED: false, 
  MESSAGE_RETENTION_DAYS: 365,
  AUTO_DELETE_REPORTED_MESSAGES: false,
  AUTO_SCROLL_THRESHOLD: 100,
  LAZY_LOAD_THRESHOLD: 20,
} as const;
export const MESSAGE_TEMPLATES = {
  SWAP_INTEREST: [
    "Hi! I'm interested in your item. Is it still available?",
    "Hello! I'd love to swap something for your item. Let me know if you're interested!",
    "Hi there! I saw your listing and think we might have a good swap. Are you open to discussing?",
  ],
  SWAP_CONFIRMATION: [
    "Great! I'm definitely interested. When would be a good time to meet?",
    "Perfect! Let's arrange a time and place to meet up.",
    "Sounds good! I'm available this week. What works for you?",
  ],
  MEETING_ARRANGEMENT: [
    "How about we meet at [location] on [day] at [time]?",
    "I can meet you at the local coffee shop tomorrow around 2 PM. Does that work?",
    "Let's meet somewhere public and convenient for both of us.",
  ],
  POLITE_RESPONSES: [
    "Thank you for your interest!",
    "I appreciate you reaching out.",
    "Thanks for the quick response!",
    "No problem at all!",
  ],
  CLOSING: [
    "Thanks for the great swap! Hope you enjoy your new item.",
    "Pleasure doing business with you!",
    "Great meeting you today. Enjoy!",
    "Thanks again for the smooth transaction!",
  ],
} as const;
export const MESSAGE_REPORT_REASONS = [
  {
    id: "spam",
    label: "Spam or unwanted messages",
    description: "Repeated unwanted messages or promotional content",
  },
  {
    id: "harassment",
    label: "Harassment or bullying",
    description: "Threatening, intimidating, or abusive behavior",
  },
  {
    id: "inappropriate",
    label: "Inappropriate content",
    description: "Sexual, violent, or otherwise inappropriate content",
  },
  {
    id: "scam",
    label: "Scam or fraud",
    description: "Suspicious or fraudulent activity",
  },
  {
    id: "impersonation",
    label: "Impersonation",
    description: "Pretending to be someone else",
  },
  {
    id: "other",
    label: "Other",
    description: "Other reason not listed above",
  },
] as const;
export const CHAT_SOUNDS = {
  NEW_MESSAGE: "/sounds/message-received.mp3",
  SENT_MESSAGE: "/sounds/message-sent.mp3",
  TYPING: "/sounds/typing.mp3",
  NOTIFICATION: "/sounds/notification.mp3",
  ERROR: "/sounds/error.mp3",
} as const;
export const ENCRYPTION_CONFIG = {
  ALGORITHM: "", 
  KEY_LENGTH: 256,
  IV_LENGTH: 12,
  ENABLED: false,
} as const;
export const WEBSOCKET_CONFIG = {
  RECONNECT_INTERVAL: 5000,
  MAX_RECONNECT_ATTEMPTS: 10,
  HEARTBEAT_INTERVAL: 30000,
  MESSAGE_QUEUE_SIZE: 100,
} as const;
export const CHAT_STATUS = {
  ONLINE: "online",
  OFFLINE: "offline",
  AWAY: "away",
  BUSY: "busy",
} as const;
export const MESSAGE_STATUS = {
  SENDING: "sending",
  SENT: "sent",
  DELIVERED: "delivered",
  READ: "read",
  FAILED: "failed",
} as const;
export const CHAT_ACTIONS = {
  SEND_MESSAGE: "send_message",
  TYPING_START: "typing_start",
  TYPING_STOP: "typing_stop",
  MESSAGE_READ: "message_read",
  JOIN_CHAT: "join_chat",
  LEAVE_CHAT: "leave_chat",
  UPLOAD_FILE: "upload_file",
} as const;

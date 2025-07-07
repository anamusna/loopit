export const REPORT_REASONS = [
  {
    id: "spam",
    label: "Spam or Misleading",
    description: "Repeated or deceptive listings",
    icon: "🚫",
    category: "content",
  },
  {
    id: "inappropriate",
    label: "Inappropriate Content",
    description: "Offensive or unsuitable material",
    icon: "⚠️",
    category: "content",
  },
  {
    id: "wrong_category",
    label: "Wrong Category",
    description: "Item doesn't belong in this category",
    icon: "📂",
    category: "organization",
  },
  {
    id: "fake_item",
    label: "Fake or Counterfeit",
    description: "Item is not authentic or real",
    icon: "🎭",
    category: "authenticity",
  },
  {
    id: "broken_damaged",
    label: "Broken or Damaged",
    description: "Item condition not accurately described",
    icon: "💔",
    category: "condition",
  },
  {
    id: "sold_elsewhere",
    label: "Already Sold/Traded",
    description: "Item is no longer available",
    icon: "✅",
    category: "availability",
  },
  {
    id: "commercial",
    label: "Commercial Listing",
    description: "Business trying to sell products",
    icon: "🏪",
    category: "policy",
  },
  {
    id: "dangerous",
    label: "Dangerous or Illegal",
    description: "Item poses safety risks or is illegal",
    icon: "🚨",
    category: "safety",
  },
  {
    id: "harassment",
    label: "Harassment or Abuse",
    description: "User behavior is inappropriate",
    icon: "😡",
    category: "behavior",
  },
  {
    id: "other",
    label: "Other",
    description: "Other reason not listed above",
    icon: "❓",
    category: "other",
  },
] as const;
export const REPORT_CATEGORIES = [
  {
    id: "content",
    label: "Content Issues",
    description: "Problems with the item listing itself",
  },
  {
    id: "organization",
    label: "Organization",
    description: "Issues with categorization or structure",
  },
  {
    id: "authenticity",
    label: "Authenticity",
    description: "Questions about item legitimacy",
  },
  {
    id: "condition",
    label: "Condition",
    description: "Issues with item condition description",
  },
  {
    id: "availability",
    label: "Availability",
    description: "Items no longer available",
  },
  {
    id: "policy",
    label: "Policy Violation",
    description: "Breaks platform rules",
  },
  {
    id: "safety",
    label: "Safety",
    description: "Safety or legal concerns",
  },
  {
    id: "behavior",
    label: "User Behavior",
    description: "Issues with user conduct",
  },
  {
    id: "other",
    label: "Other",
    description: "Other issues",
  },
] as const;
export const REPORT_STATUS = {
  PENDING: "pending",
  UNDER_REVIEW: "under_review",
  RESOLVED: "resolved",
  DISMISSED: "dismissed",
  ESCALATED: "escalated",
} as const;
export const REPORT_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;
export const AUTO_MODERATION_RULES = [
  {
    id: "keyword_filter",
    name: "Keyword Filter",
    description: "Automatically flag items with banned keywords",
    enabled: true,
  },
  {
    id: "image_analysis",
    name: "Image Analysis",
    description: "Analyze images for inappropriate content",
    enabled: false,
  },
  {
    id: "duplicate_detection",
    name: "Duplicate Detection",
    description: "Detect and flag duplicate listings",
    enabled: true,
  },
  {
    id: "spam_detection",
    name: "Spam Detection",
    description: "Identify potential spam listings",
    enabled: true,
  },
];
export const MODERATION_ACTIONS = [
  {
    id: "warn",
    label: "Send Warning",
    description: "Send a warning message to the user",
    icon: "⚠️",
  },
  {
    id: "hide",
    label: "Hide Item",
    description: "Hide the item from public view",
    icon: "👁️",
  },
  {
    id: "remove",
    label: "Remove Item",
    description: "Permanently remove the item",
    icon: "🗑️",
  },
  {
    id: "suspend",
    label: "Suspend User",
    description: "Temporarily suspend the user account",
    icon: "⏸️",
  },
  {
    id: "ban",
    label: "Ban User",
    description: "Permanently ban the user account",
    icon: "🚫",
  },
];
export const REPORT_STORAGE_KEY = "loopit_reports";
export const MODERATION_STORAGE_KEY = "loopit_moderation";
export const MAX_REPORTS_PER_USER = 10;
export const REPORT_COOLDOWN_HOURS = 24;
export const MODERATION_THRESHOLDS = {
  WARNING_THRESHOLD: 2,
  SUSPENSION_THRESHOLD: 5,
  BAN_THRESHOLD: 10,
  AUTO_HIDE_THRESHOLD: 3,
} as const;

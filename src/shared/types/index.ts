import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
export interface LoginFormData {
  email: string;
  password: string;
}
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  location: string;
  agreedToTerms: boolean;
}
export interface AuthValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  location?: string;
  agreedToTerms?: string;
}
export interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  location?: string;
  agreedToTerms?: string;
}
export interface JWTToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
export interface EmailVerificationData {
  email: string;
  token: string;
  expiresAt: number;
  verified: boolean;
}
export interface PasswordResetData {
  email: string;
  token: string;
  expiresAt: number;
  used: boolean;
}
export interface TutorialState {
  seen: boolean;
  currentStep: number;
  completedSteps: number[];
  skipped: boolean;
}
export interface TermsAcceptance {
  accepted: boolean;
  acceptedAt: string;
  version: string;
}
export interface ProfileSetupState {
  completed: boolean;
  completedAt: string;
  stepsCompleted: string[];
}
export interface LocationPermissionState {
  granted: boolean;
  requested: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
  address?: string;
}
export enum ItemCategory {
  CLOTHING = "clothing",
  BOOKS = "books",
  FURNITURE = "furniture",
  ELECTRONICS = "electronics",
  TOYS = "toys",
  SPORTS = "sports",
  HOUSEHOLD = "household",
  OTHER = "other",
}
export enum ItemCondition {
  EXCELLENT = "excellent",
  GOOD = "good",
  FAIR = "fair",
  NEEDS_REPAIR = "needs_repair",
}
export enum ItemStatus {
  AVAILABLE = "available",
  SWAPPED = "swapped",
  REQUESTED = "requested",
  PENDING = "pending",
  REPORTED = "reported",
  REJECTED = "rejected",
  REMOVED = "removed",
  DRAFT = "draft",
  EXPIRED = "expired",
}
export enum SwapRequestStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}
export enum NotificationType {
  SWAP_REQUEST = "swap_request",
  REQUEST_ACCEPTED = "request_accepted",
  REQUEST_REJECTED = "request_rejected",
  NEW_MESSAGE = "new_message",
  ITEM_UPDATED = "item_updated",
  SWAP_COMPLETED = "swap_completed",
}
export enum UserRole {
  USER = "user",
  MODERATOR = "moderator",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}
export enum EventType {
  CLOTHING_SWAP = "clothing_swap",
  FREECYCLE_MEETUP = "freecycle_meetup",
  GIVEAWAY_DAY = "giveaway_day",
  COMMUNITY_REPAIR = "community_repair",
  SKILL_SHARE = "skill_share",
}
export enum CommunityBoardCategory {
  HELP_REQUESTS = "help_requests",
  LOCAL_DISCUSSIONS = "local_discussions",
  SKILL_SHARING = "skill_sharing",
  LOST_AND_FOUND = "lost_and_found",
  GENERAL = "general",
}
export enum SubscriptionTier {
  FREE = "free",
  BASIC = "basic",
  PREMIUM = "premium",
}
export enum BadgeType {
  NEW_USER = "new_user",
  TRUSTED_SWAPPER = "trusted_swapper",
  COMMUNITY_HELPER = "community_helper",
  ECO_WARRIOR = "eco_warrior",
  SUPER_SAVER = "super_saver",
  TOP_RATED = "top_rated",
}
export enum Permission {
  CREATE_ITEM = "create_item",
  EDIT_OWN_ITEM = "edit_own_item",
  DELETE_OWN_ITEM = "delete_own_item",
  EDIT_ANY_ITEM = "edit_any_item",
  DELETE_ANY_ITEM = "delete_any_item",
  VIEW_ITEMS = "view_items",
  BOOST_ITEM = "boost_item",
  SEND_SWAP_REQUEST = "send_swap_request",
  ACCEPT_SWAP_REQUEST = "accept_swap_request",
  REJECT_SWAP_REQUEST = "reject_swap_request",
  CANCEL_SWAP_REQUEST = "cancel_swap_request",
  SEND_MESSAGE = "send_message",
  VIEW_MESSAGES = "view_messages",
  DELETE_OWN_MESSAGE = "delete_own_message",
  DELETE_ANY_MESSAGE = "delete_any_message",
  LEAVE_REVIEW = "leave_review",
  EDIT_OWN_REVIEW = "edit_own_review",
  DELETE_OWN_REVIEW = "delete_own_review",
  DELETE_ANY_REVIEW = "delete_any_review",
  VIEW_REVIEWS = "view_reviews",
  CREATE_COMMUNITY_POST = "create_community_post",
  EDIT_OWN_POST = "edit_own_post",
  DELETE_OWN_POST = "delete_own_post",
  DELETE_ANY_POST = "delete_any_post",
  REPLY_TO_POST = "reply_to_post",
  UPVOTE_DOWNVOTE = "upvote_downvote",
  MARK_POST_RESOLVED = "mark_post_resolved",
  CREATE_EVENT = "create_event",
  EDIT_OWN_EVENT = "edit_own_event",
  DELETE_OWN_EVENT = "delete_own_event",
  DELETE_ANY_EVENT = "delete_any_event",
  JOIN_EVENT = "join_event",
  LEAVE_EVENT = "leave_event",
  MANAGE_EVENT_PARTICIPANTS = "manage_event_participants",
  VIEW_PROFILE = "view_profile",
  EDIT_OWN_PROFILE = "edit_own_profile",
  VIEW_ANY_PROFILE = "view_any_profile",
  EDIT_ANY_PROFILE = "edit_any_profile",
  SUSPEND_USER = "suspend_user",
  DELETE_USER = "delete_user",
  VIEW_USER_ANALYTICS = "view_user_analytics",
  REPORT_CONTENT = "report_content",
  VIEW_REPORTS = "view_reports",
  MODERATE_CONTENT = "moderate_content",
  BAN_USER = "ban_user",
  UNBAN_USER = "unban_user",
  FEATURE_CONTENT = "feature_content",
  HIDE_CONTENT = "hide_content",
  ACCESS_PREMIUM_FEATURES = "access_premium_features",
  VIEW_ANALYTICS = "view_analytics",
  BOOST_LISTINGS = "boost_listings",
  PRIORITY_SUPPORT = "priority_support",
  ADVANCED_SEARCH = "advanced_search",
  MANAGE_SETTINGS = "manage_settings",
  VIEW_SYSTEM_ANALYTICS = "view_system_analytics",
  MANAGE_SUBSCRIPTIONS = "manage_subscriptions",
  MANAGE_PAYMENTS = "manage_payments",
  ACCESS_ADMIN_PANEL = "access_admin_panel",
  MANAGE_PERMISSIONS = "manage_permissions",
  BACKUP_DATA = "backup_data",
  BYPASS_RATE_LIMITS = "bypass_rate_limits",
  ACCESS_API = "access_api",
  VIEW_SENSITIVE_DATA = "view_sensitive_data",
}
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
  trustScore: number;
  totalSwaps: number;
  joinedAt: Date;
  isActive: boolean;
}
export interface UserProfile extends User {
  phone?: string;
  website?: string;
  interests?: string[];
  items: Item[];
  preferences: {
    notifications: boolean;
    publicProfile: boolean;
    showLocation: boolean;
    autoAcceptTrustedUsers: boolean;
    emailNotifications: boolean;
  };
  stats: {
    itemsListed: number;
    successfulSwaps: number;
    rating: number;
    reviewCount: number;
    helpfulVotes: number;
    eventsAttended: number;
  };
  environmentalStats: {
    totalCarbonSaved: number;
    totalWaterSaved: number;
    totalLandfillSaved: number;
    ecoWarriorLevel: string;
    badges: UserBadge[];
  };
  warnings?: number;
  badges: UserBadge[];
  subscription: UserSubscription;
  security: UserSecuritySettings;
  lastActiveAt: Date;
}
export interface ItemChange {
  field: string;
  oldValue: any;
  newValue: any;
  changedAt: Date;
  changedBy: string;
}
export interface Item {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  condition: ItemCondition;
  status: ItemStatus;
  images: string[];
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  views: number;
  saves: number;
  swapRequests: number;
  tags: string[];
  isBoosted?: boolean;
  boostExpiresAt?: Date;
  environmentalImpact: {
    carbonSaved: number;
    waterSaved: number;
    landfillSaved: number;
    offsetComparisons: {
      carRides: number;
      flightHours: number;
      homeDays: number;
      treeDays: number;
      lightbulbHours: number;
      showerMinutes: number;
      meatMeals: number;
      coffeeCups: number;
    };
  };
  changeHistory?: ItemChange[];
  stats?: {
    successfulSwaps: number;
    views: number;
    saves: number;
    swapRequests: number;
  };
  swapCompletedAt?: Date;
}
export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  itemId: string;
  offeredItemId?: string;
  message: string;
  status: SwapRequestStatus;
  createdAt: Date;
  updatedAt: Date;
  respondedAt?: Date;
}
export interface OfferedItem {
  id?: string; 
  title: string;
  description: string;
  category: ItemCategory;
  condition: ItemCondition;
  images: ImageUploadState[];
  location: string;
  tags: string[];
}
export interface ChatMessage {
  id: string;
  swapRequestId: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
  status: MessageStatus;
  isRead: boolean;
  isEdited?: boolean;
  editedAt?: Date;
}
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}
export enum ReviewCriteria {
  ITEM_CONDITION = "item_condition",
  COMMUNICATION = "communication",
  TIMING = "timing",
  OVERALL_EXPERIENCE = "overall_experience",
  TRUSTWORTHINESS = "trustworthiness",
}
export enum ReviewStatus {
  PENDING = "pending",
  APPROVED = "approved",
  FLAGGED = "flagged",
  REJECTED = "rejected",
  HIDDEN = "hidden",
}
export enum ReviewSortOption {
  NEWEST = "newest",
  OLDEST = "oldest",
  HIGHEST_RATED = "highest_rated",
  LOWEST_RATED = "lowest_rated",
  MOST_HELPFUL = "most_helpful",
}
export enum ReviewFilterOption {
  ALL = "all",
  POSITIVE = "positive",
  NEUTRAL = "neutral",
  NEGATIVE = "negative",
  VERIFIED = "verified",
  FLAGGED = "flagged",
}
export interface ReviewCriteriaRating {
  criteria: ReviewCriteria;
  rating: number; 
}
export interface ReviewHelpfulness {
  helpful: number;
  notHelpful: number;
  userVote?: "helpful" | "not_helpful" | null;
}
export interface ReviewResponse {
  id: string;
  reviewId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  editedAt?: Date;
}
export interface ReviewModerationFlag {
  id: string;
  reviewId: string;
  flaggedBy: string;
  reason: string;
  category: "inappropriate" | "spam" | "fake" | "other";
  status: "pending" | "reviewed" | "dismissed";
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}
export interface Review {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar?: string;
  toUserId: string;
  swapRequestId: string;
  itemId: string;
  itemTitle: string;
  overallRating: number; 
  criteriaRatings?: ReviewCriteriaRating[]; 
  comment?: string;
  isAnonymous: boolean;
  isVerified: boolean; 
  status: ReviewStatus;
  moderationFlags?: ReviewModerationFlag[];
  helpfulness: ReviewHelpfulness;
  response?: ReviewResponse;
  createdAt: Date;
  updatedAt?: Date;
  editedAt?: Date;
  trustScoreImpact?: number;
}
export interface SearchFilters {
  category?: ItemCategory;
  condition?: ItemCondition;
  location?: string;
  radius?: number;
  query?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}
export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  organizerId: string;
  organizerName: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  dateTime: Date;
  endDateTime?: Date;
  maxParticipants?: number;
  currentParticipants: number;
  participants: string[];
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: CommunityBoardCategory;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  location: string;
  images?: string[];
  isResolved: boolean;
  upvotes: number;
  downvotes: number;
  replyCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
export interface CommunityReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface UserBadge {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  iconUrl: string;
  earnedAt: Date;
}
export interface UserSubscription {
  tier: SubscriptionTier;
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  features: string[];
}
export interface Analytics {
  totalViews: number;
  totalSwaps: number;
  mostViewedCategory: ItemCategory;
  averageResponseTime: number;
  successRate: number;
  topLocations: string[];
  monthlyStats: {
    month: string;
    views: number;
    swaps: number;
    newUsers: number;
  }[];
  environmentalImpact: {
    totalCarbonSaved: number;
    totalWaterSaved: number;
    totalLandfillSaved: number;
    impactByCategory: Record<
      ItemCategory,
      {
        carbonSaved: number;
        waterSaved: number;
        landfillSaved: number;
      }
    >;
    communityRankings: {
      topSavers: Array<{ userId: string; carbonSaved: number }>;
      mostActiveCategories: Array<{ category: ItemCategory; swaps: number }>;
    };
  };
}
export interface ProfileSetupFormData {
  name: string;
  profilePhoto?: File | string;
  location: string;
  bio?: string;
  phone?: string;
  website?: string;
  interests?: string[];
}
export interface ProfileSetupValidationErrors {
  name?: string;
  profilePhoto?: string;
  location?: string;
  bio?: string;
  phone?: string;
  website?: string;
}
export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
}
export interface LocationSuggestion {
  id: string;
  display_name: string;
  city?: string;
  state?: string;
  country?: string;
}
export interface ItemListingFormData {
  title: string;
  category: ItemCategory | "";
  condition: ItemCondition | "";
  description: string;
  location: string;
  images: (File | string)[];
  tags: string[];
  expiresAt?: Date;
  isBoosted?: boolean;
}
export interface ItemListingValidationErrors {
  title?: string;
  category?: string;
  condition?: string;
  description?: string;
  location?: string;
  images?: string;
  tags?: string;
}
export interface ImageUploadState {
  file: File;
  preview: string;
  isUploading: boolean;
  isUploaded: boolean;
  uploadedUrl?: string;
  error?: string;
}
export enum MessageStatus {
  SENDING = "sending",
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
  FAILED = "failed",
}
export interface ChatConversation {
  id: string;
  swapRequestId: string;
  participants: string[];
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
  lastActivity: Date;
  unreadCount: number;
  isActive: boolean;
  createdAt: Date;
}
export interface ChatState {
  conversations: Record<string, ChatConversation>;
  activeConversationId: string | null;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  unreadCount: number;
}
const USER_PERMISSIONS: Permission[] = [
  Permission.CREATE_ITEM,
  Permission.EDIT_OWN_ITEM,
  Permission.DELETE_OWN_ITEM,
  Permission.VIEW_ITEMS,
  Permission.SEND_SWAP_REQUEST,
  Permission.ACCEPT_SWAP_REQUEST,
  Permission.REJECT_SWAP_REQUEST,
  Permission.CANCEL_SWAP_REQUEST,
  Permission.SEND_MESSAGE,
  Permission.VIEW_MESSAGES,
  Permission.DELETE_OWN_MESSAGE,
  Permission.LEAVE_REVIEW,
  Permission.EDIT_OWN_REVIEW,
  Permission.DELETE_OWN_REVIEW,
  Permission.VIEW_REVIEWS,
  Permission.CREATE_COMMUNITY_POST,
  Permission.EDIT_OWN_POST,
  Permission.DELETE_OWN_POST,
  Permission.REPLY_TO_POST,
  Permission.UPVOTE_DOWNVOTE,
  Permission.MARK_POST_RESOLVED,
  Permission.CREATE_EVENT,
  Permission.EDIT_OWN_EVENT,
  Permission.DELETE_OWN_EVENT,
  Permission.JOIN_EVENT,
  Permission.LEAVE_EVENT,
  Permission.VIEW_PROFILE,
  Permission.EDIT_OWN_PROFILE,
  Permission.VIEW_ANY_PROFILE,
  Permission.REPORT_CONTENT,
];
const MODERATOR_ADDITIONAL_PERMISSIONS: Permission[] = [
  Permission.VIEW_REPORTS,
  Permission.MODERATE_CONTENT,
  Permission.HIDE_CONTENT,
  Permission.FEATURE_CONTENT,
  Permission.DELETE_ANY_POST,
  Permission.DELETE_ANY_REVIEW,
  Permission.DELETE_ANY_MESSAGE,
  Permission.DELETE_ANY_EVENT,
  Permission.SUSPEND_USER,
  Permission.VIEW_USER_ANALYTICS,
  Permission.MANAGE_EVENT_PARTICIPANTS,
];
const ADMIN_ADDITIONAL_PERMISSIONS: Permission[] = [
  Permission.EDIT_ANY_PROFILE,
  Permission.BAN_USER,
  Permission.UNBAN_USER,
  Permission.DELETE_USER,
  Permission.EDIT_ANY_ITEM,
  Permission.DELETE_ANY_ITEM,
  Permission.VIEW_ANALYTICS,
  Permission.VIEW_SYSTEM_ANALYTICS,
  Permission.MANAGE_SUBSCRIPTIONS,
  Permission.ACCESS_ADMIN_PANEL,
  Permission.PRIORITY_SUPPORT,
  Permission.BYPASS_RATE_LIMITS,
  Permission.ACCESS_API,
];
const SUPER_ADMIN_ADDITIONAL_PERMISSIONS: Permission[] = [
  Permission.MANAGE_SETTINGS,
  Permission.MANAGE_PAYMENTS,
  Permission.MANAGE_PERMISSIONS,
  Permission.BACKUP_DATA,
  Permission.VIEW_SENSITIVE_DATA,
];
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.USER]: USER_PERMISSIONS,
  [UserRole.MODERATOR]: [
    ...USER_PERMISSIONS,
    ...MODERATOR_ADDITIONAL_PERMISSIONS,
  ],
  [UserRole.ADMIN]: [
    ...USER_PERMISSIONS,
    ...MODERATOR_ADDITIONAL_PERMISSIONS,
    ...ADMIN_ADDITIONAL_PERMISSIONS,
  ],
  [UserRole.SUPER_ADMIN]: [
    ...USER_PERMISSIONS,
    ...MODERATOR_ADDITIONAL_PERMISSIONS,
    ...ADMIN_ADDITIONAL_PERMISSIONS,
    ...SUPER_ADMIN_ADDITIONAL_PERMISSIONS,
  ],
};
export const SUBSCRIPTION_PERMISSIONS: Record<SubscriptionTier, Permission[]> =
  {
    [SubscriptionTier.FREE]: [],
    [SubscriptionTier.BASIC]: [
      Permission.BOOST_ITEM,
      Permission.PRIORITY_SUPPORT,
      Permission.VIEW_ANALYTICS,
    ],
    [SubscriptionTier.PREMIUM]: [
      Permission.ACCESS_PREMIUM_FEATURES,
      Permission.BOOST_LISTINGS,
      Permission.ADVANCED_SEARCH,
      Permission.VIEW_ANALYTICS,
      Permission.PRIORITY_SUPPORT,
    ],
  };
export interface UserPermissions {
  rolePermissions: Permission[];
  subscriptionPermissions: Permission[];
  allPermissions: Permission[];
}
export interface PermissionCheck {
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  canAccess: (resource: string, action: string) => boolean;
}
export interface UserSecuritySettings {
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  loginAttempts: number;
  lastPasswordChange: Date;
  suspendedUntil?: Date;
  bannedUntil?: Date;
  banReason?: string;
  accountStatus: AccountStatus;
}
export enum AccountStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  BANNED = "banned",
  PENDING_VERIFICATION = "pending_verification",
  DEACTIVATED = "deactivated",
}
export const getUserPermissions = (user: UserProfile): UserPermissions => {
  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  const subscriptionPermissions =
    SUBSCRIPTION_PERMISSIONS[user.subscription.tier] || [];
  return {
    rolePermissions,
    subscriptionPermissions,
    allPermissions: [
      ...new Set([...rolePermissions, ...subscriptionPermissions]),
    ],
  };
};
export const createPermissionChecker = (user: UserProfile): PermissionCheck => {
  const userPermissions = getUserPermissions(user);
  return {
    hasPermission: (permission: Permission): boolean => {
      return userPermissions.allPermissions.includes(permission);
    },
    hasAnyPermission: (permissions: Permission[]): boolean => {
      return permissions.some((permission) =>
        userPermissions.allPermissions.includes(permission)
      );
    },
    hasAllPermissions: (permissions: Permission[]): boolean => {
      return permissions.every((permission) =>
        userPermissions.allPermissions.includes(permission)
      );
    },
    canAccess: (resource: string, action: string): boolean => {
      const permissionMap: Record<string, Permission> = {
        "item-create": Permission.CREATE_ITEM,
        "item-edit-own": Permission.EDIT_OWN_ITEM,
        "item-edit-any": Permission.EDIT_ANY_ITEM,
        "item-delete-own": Permission.DELETE_OWN_ITEM,
        "item-delete-any": Permission.DELETE_ANY_ITEM,
        "item-boost": Permission.BOOST_ITEM,
        "swap-send": Permission.SEND_SWAP_REQUEST,
        "message-send": Permission.SEND_MESSAGE,
        "community-create": Permission.CREATE_COMMUNITY_POST,
        "event-create": Permission.CREATE_EVENT,
        "admin-panel": Permission.ACCESS_ADMIN_PANEL,
        "analytics-view": Permission.VIEW_ANALYTICS,
        "user-ban": Permission.BAN_USER,
        "content-moderate": Permission.MODERATE_CONTENT,
      };
      const key = `${resource}-${action}`;
      const requiredPermission = permissionMap[key];
      return requiredPermission
        ? userPermissions.allPermissions.includes(requiredPermission)
        : false;
    },
  };
};
export const isUserActive = (user: UserProfile): boolean => {
  return user.security.accountStatus === AccountStatus.ACTIVE;
};
export const isUserSuspended = (user: UserProfile): boolean => {
  const now = new Date();
  return (
    user.security.accountStatus === AccountStatus.SUSPENDED ||
    (user.security.suspendedUntil ? user.security.suspendedUntil > now : false)
  );
};
export const isUserBanned = (user: UserProfile): boolean => {
  const now = new Date();
  return (
    user.security.accountStatus === AccountStatus.BANNED ||
    (user.security.bannedUntil ? user.security.bannedUntil > now : false)
  );
};
export const canUserPerformAction = (
  user: UserProfile,
  permission: Permission
): boolean => {
  if (!isUserActive(user) || isUserSuspended(user) || isUserBanned(user)) {
    return false;
  }
  const checker = createPermissionChecker(user);
  return checker.hasPermission(permission);
};
export interface DashboardMetric {
  label: string;
  value: number;
  change: number;
  icon: IconDefinition;
  color: string;
}
export interface ToastMessage {
  title: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}
export interface UIState {
  theme: "light" | "dark" | "system";
  isLoading: boolean;
  toast: ToastMessage | null;
}
export interface UIActions {
  setTheme: (theme: "light" | "dark" | "system") => void;
  showToast: (toast: ToastMessage) => void;
  hideToast: () => void;
}

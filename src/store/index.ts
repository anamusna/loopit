import {
  BADGE_CONFIGS,
  calculateProfileCompleteness,
  calculateTrustScore,
  getEarnedBadges,
} from "@/constants/badges";
import { STORAGE_KEYS } from "@/constants/storage";
import {
  allCommunityEvents,
  allCommunityPosts,
  allItems,
  allNotifications,
  allSwapRequests,
  defaultConversationMetadata,
  defaultConversations,
  defaultReviews,
} from "@/data";
import { mockDashboardMetrics } from "@/data/adminData";
import {
  calculateCarbonSavings,
  filterItemsByCategory,
  filterItemsBySearch,
} from "@/data/items";
import { allUsers, getDemoAccount } from "@/data/users";
import {
  AccountStatus,
  Analytics,
  BadgeType,
  ChatMessage,
  CommunityBoardCategory,
  CommunityEvent,
  CommunityPost,
  CommunityReply,
  createPermissionChecker,
  DashboardMetric,
  getUserPermissions,
  Item,
  ItemCategory,
  ItemStatus,
  MessageStatus,
  Notification,
  OfferedItem,
  Permission,
  PermissionCheck,
  Review,
  ReviewStatus,
  SearchFilters,
  SubscriptionTier,
  SwapRequest,
  SwapRequestStatus,
  User,
  UserBadge,
  UserPermissions,
  UserProfile,
  UserRole,
} from "@/shared/types";
import { generateDashboardMetrics } from "@/utils/adminMetrics";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
const calculateUserTrustScore = (user: UserProfile): number => {
  const accountAge = Math.floor(
    (Date.now() - new Date(user.joinedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  const profileCompleteness = calculateProfileCompleteness(user);
  const verificationStatus =
    (user.security?.emailVerified ? 0.5 : 0) +
    (user.security?.phoneVerified ? 0.5 : 0);
  const trustScoreFactors = {
    successfulSwaps: user.stats?.successfulSwaps || 0,
    averageRating: user.stats?.rating || 0,
    reviewCount: user.stats?.reviewCount || 0,
    profileCompleteness,
    communityParticipation: user.stats?.eventsAttended || 0,
    accountAge,
    verificationStatus,
  };
  return calculateTrustScore(trustScoreFactors);
};
const checkAndAwardBadges = (user: UserProfile): UserBadge[] => {
  const earnedBadgeTypes = getEarnedBadges(user);
  const currentBadges = user.badges || [];
  const newBadges: UserBadge[] = [];
  earnedBadgeTypes.forEach((badgeType) => {
    const alreadyHasBadge = currentBadges.some(
      (badge) => badge.type === badgeType
    );
    if (!alreadyHasBadge) {
      const config = BADGE_CONFIGS[badgeType];
      newBadges.push({
        id: `badge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: badgeType,
        name: config.name,
        description: config.description,
        iconUrl: config.iconUrl,
        earnedAt: new Date(),
      });
    }
  });
  return [...currentBadges, ...newBadges];
};
const validateUserItems = (user: UserProfile | null): UserProfile => {
  if (!user) {
    throw new Error("User is required");
  }
  if (user.items && user.items.length > 0) {
    const validatedItems = user.items.map((item) => ({
      ...item,
      environmentalImpact: item.environmentalImpact || {
        carbonSaved: calculateCarbonSavings(item.category),
        waterSaved: 500,
        landfillSaved: 2,
        offsetComparisons: {
          carRides: 5,
          flightHours: 0.5,
          homeDays: 2,
          treeDays: 10,
          lightbulbHours: 100,
          showerMinutes: 60,
          meatMeals: 3,
          coffeeCups: 20,
        },
      },
      changeHistory: item.changeHistory || [],
      tags: item.tags || [],
      views: item.views || 0,
      saves: item.saves || 0,
      swapRequests: item.swapRequests || 0,
    }));
    return {
      ...user,
      items: validatedItems,
    };
  }
  return user;
};
interface LoopItStore {
  user: UserProfile | null;
  users: UserProfile[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userPermissions: UserPermissions | null;
  permissionChecker: PermissionCheck | null;
  isEmailVerified: boolean;
  isProfileSetupCompleted: boolean;
  isTutorialCompleted: boolean;
  items: Item[];
  savedItems: Item[];
  featuredItems: Item[];
  searchResults: Item[];
  searchFilters: SearchFilters;
  isLoadingItems: boolean;
  getUserItems: () => Item[];
  getFilteredItems: (filters?: SearchFilters) => Item[];
  getSearchedItems: (query: string, filters?: SearchFilters) => Item[];
  getSavedItems: () => Item[];
  getFeaturedItems: () => Item[];
  getAllItems: () => Item[];
  swapRequests: SwapRequest[];
  sentRequests: SwapRequest[];
  receivedRequests: SwapRequest[];
  isLoadingRequests: boolean;
  offeredItems: Item[];
  isLoadingOfferedItems: boolean;
  conversations: Record<string, ChatMessage[]>;
  unreadCount: number;
  isLoadingMessages: boolean;
  notifications: Notification[];
  unreadNotifications: number;
  isLoadingNotifications: boolean;
  reviews: Review[];
  userReviews: Review[];
  receivedReviews: Review[];
  pendingReviews: Review[];
  isLoadingReviews: boolean;
  communityPosts: CommunityPost[];
  communityReplies: Record<string, CommunityReply[]>;
  communityEvents: CommunityEvent[];
  userEvents: CommunityEvent[];
  isLoadingCommunity: boolean;
  analytics: Analytics | null;
  isLoadingAnalytics: boolean;
  environmentalImpact: {
    userCarbonSaved: number;
    communityCarbonSaved: number;
    userEnvironmentalScore: number;
    environmentalBadgeProgress: Array<{
      level: string;
      threshold: number;
      progress: number;
      remaining: number;
      achieved: boolean;
    }>;
    categoryBreakdown: Record<
      ItemCategory,
      { count: number; totalSaved: number }
    >;
    topContributors: Array<{
      user: UserProfile;
      carbonSaved: number;
      totalSwaps: number;
      rank: number;
      rankEmoji: string;
    }>;
  } | null;
  isLoadingEnvironmentalImpact: boolean;
  theme: "light" | "dark" | "system";
  activeTab: string;
  selectedItem: Item | null;
  selectedEvent: CommunityEvent | null;
  selectedPost: CommunityPost | null;
  isMapView: boolean;
  currentLocation: {
    lat: number;
    lng: number;
  } | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (
    userData: Omit<
      User,
      "id" | "trustScore" | "totalSwaps" | "joinedAt" | "isActive"
    >
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  restoreSession: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  completeProfileSetup: () => Promise<void>;
  completeTutorial: () => Promise<void>;
  checkEmailVerification: (email: string) => boolean;
  checkProfileSetupStatus: () => boolean;
  checkTutorialStatus: () => boolean;
  storeJWTTokens: (tokens: {
    accessToken: string;
    refreshToken: string;
  }) => void;
  refreshJWTToken: () => Promise<boolean>;
  clearJWTTokens: () => void;
  validatePasswordResetToken: (token: string) => boolean;
  acceptTermsAndPrivacy: () => void;
  requestLocationPermission: () => Promise<boolean>;
  setLocationPermissionState: (
    granted: boolean,
    coordinates?: { lat: number; lng: number }
  ) => void;
  createItem: (
    itemData: Omit<
      Item,
      | "id"
      | "ownerId"
      | "ownerName"
      | "createdAt"
      | "updatedAt"
      | "views"
      | "saves"
      | "swapRequests"
      | "changeHistory"
    >
  ) => Promise<void>;
  updateItem: (itemId: string, updates: Partial<Item>) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  fetchItems: (filters?: SearchFilters) => Promise<void>;
  fetchUserItems: (userId?: string) => Promise<void>;
  searchItems: (query: string, filters?: SearchFilters) => Promise<void>;
  saveItem: (itemId: string) => Promise<void>;
  unsaveItem: (itemId: string) => Promise<void>;
  boostItem: (itemId: string) => Promise<void>;
  unboostItem: (itemId: string) => Promise<void>;
  renewItem: (itemId: string) => Promise<void>;
  archiveItem: (itemId: string) => Promise<void>;
  trackItemView: (itemId: string) => void;
  trackItemSave: (itemId: string) => void;
  trackItemRequest: (itemId: string) => void;
  getItemsByStatus: (status: ItemStatus | "all") => Item[];
  getBoostedItems: () => Item[];
  getExpiredItems: () => Item[];
  getItemsExpiringSoon: (days?: number) => Item[];
  getItemsNeedingStatusUpdate: () => Item[];
  updateItemStatus: (itemId: string, newStatus: ItemStatus) => Promise<void>;
  addItemChangeHistory: (
    itemId: string,
    field: string,
    oldValue: any,
    newValue: any
  ) => Promise<void>;
  sendSwapRequest: (
    request: Omit<SwapRequest, "id" | "status" | "createdAt" | "updatedAt">,
    offeredItem?: OfferedItem
  ) => Promise<void>;
  respondToSwapRequest: (
    requestId: string,
    status: SwapRequestStatus,
    message?: string
  ) => Promise<void>;
  fetchSwapRequests: () => Promise<void>;
  cancelSwapRequest: (requestId: string) => Promise<void>;
  createOfferedItem: (offeredItemData: OfferedItem) => Promise<Item>;
  sendMessage: (
    swapRequestId: string,
    receiverId: string,
    message: string
  ) => Promise<void>;
  fetchMessages: (swapRequestId: string) => Promise<void>;
  markMessagesAsRead: (swapRequestId: string) => Promise<void>;
  archiveConversation: (swapRequestId: string) => Promise<void>;
  unarchiveConversation: (swapRequestId: string) => Promise<void>;
  deleteConversation: (swapRequestId: string) => Promise<void>;
  pinConversation: (swapRequestId: string) => Promise<void>;
  unpinConversation: (swapRequestId: string) => Promise<void>;
  markConversationAsRead: (swapRequestId: string) => Promise<void>;
  getConversationMetadata: (swapRequestId: string) => {
    isArchived: boolean;
    isPinned: boolean;
    unreadCount: number;
    lastMessageTime: Date | null;
  } | null;
  conversationMetadata: Record<
    string,
    {
      isArchived: boolean;
      isPinned: boolean;
      unreadCount: number;
      lastMessageTime: Date | null;
    }
  >;
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  createReview: (reviewData: Omit<Review, "id" | "createdAt">) => Promise<void>;
  fetchUserReviews: (userId?: string) => Promise<void>;
  fetchReceivedReviews: (userId?: string) => Promise<void>;
  fetchPendingReviews: () => Promise<void>;
  hasReviewedSwap: (swapRequestId: string) => boolean;
  updateReview: (reviewId: string, updates: Partial<Review>) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  respondToReview: (reviewId: string, content: string) => Promise<void>;
  updateReviewResponse: (
    reviewId: string,
    responseId: string,
    content: string
  ) => Promise<void>;
  deleteReviewResponse: (reviewId: string, responseId: string) => Promise<void>;
  voteOnReview: (
    reviewId: string,
    voteType: "helpful" | "not_helpful"
  ) => Promise<void>;
  removeReviewVote: (reviewId: string) => Promise<void>;
  flagReview: (
    reviewId: string,
    reason: string,
    category: "inappropriate" | "spam" | "fake" | "other"
  ) => Promise<void>;
  moderateReview: (
    reviewId: string,
    action: "approve" | "reject" | "hide"
  ) => Promise<void>;
  getReviewsByStatus: (status: ReviewStatus) => Review[];
  getReviewsByRating: (minRating: number, maxRating?: number) => Review[];
  getReviewsForItem: (itemId: string) => Review[];
  getReviewsForSwap: (swapRequestId: string) => Review[];
  getVerifiedReviews: () => Review[];
  getRecentReviews: (days?: number) => Review[];
  getMostHelpfulReviews: (limit?: number) => Review[];
  getTopRatedReviews: (limit?: number) => Review[];
  calculateUserRatingStats: (userId: string) => {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
    helpfulVotes: number;
    responseRate: number;
  };
  generateReviewAnalytics: (userId?: string) => {
    totalReviews: number;
    averageRating: number;
    ratingTrend: "improving" | "stable" | "declining";
    monthlyStats: Array<{ month: string; count: number; average: number }>;
    criteriaBreakdown: Record<string, { average: number; count: number }>;
  };
  exportReviewsToCSV: (userId?: string) => string;
  shareReview: (reviewId: string) => {
    title: string;
    description: string;
    url: string;
  };
  checkReviewEligibility: (swapRequestId: string) => {
    eligible: boolean;
    reason?: string;
  };
  getReviewPrompts: (swapRequestId: string) => {
    shouldPrompt: boolean;
    daysAfterSwap: number;
  };
  autoModerateReview: (reviewContent: string) => {
    flagged: boolean;
    reasons: string[];
  };
  createCommunityPost: (
    postData: Omit<
      CommunityPost,
      | "id"
      | "authorId"
      | "authorName"
      | "authorAvatar"
      | "upvotes"
      | "downvotes"
      | "replyCount"
      | "createdAt"
      | "updatedAt"
    >
  ) => Promise<void>;
  fetchCommunityPosts: (category?: CommunityBoardCategory) => Promise<void>;
  upvotePost: (postId: string) => Promise<void>;
  downvotePost: (postId: string) => Promise<void>;
  replyToPost: (postId: string) => Promise<void>;
  markPostAsResolved: (postId: string) => Promise<void>;
  createEvent: (
    eventData: Omit<
      CommunityEvent,
      | "id"
      | "organizerId"
      | "organizerName"
      | "currentParticipants"
      | "participants"
      | "createdAt"
      | "updatedAt"
    >
  ) => Promise<void>;
  fetchCommunityEvents: () => Promise<void>;
  joinEvent: (eventId: string) => Promise<void>;
  leaveEvent: (eventId: string) => Promise<void>;
  fetchUserEvents: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  recordSuccessfulSwap: (swapRequestId: string) => void;
  updateUserStats: (stats: Partial<UserProfile["stats"]>) => Promise<void>;
  awardBadge: (badgeType: BadgeType) => Promise<void>;
  calculateAndUpdateTrustScore: () => Promise<void>;
  calculateEnvironmentalImpact: () => Promise<void>;
  updateItemCarbonSavings: (
    itemId: string,
    carbonSaved: number
  ) => Promise<void>;
  getEnvironmentalLeaderboard: (limit?: number) => Promise<
    Array<{
      user: UserProfile;
      carbonSaved: number;
      totalSwaps: number;
      rank: number;
      rankEmoji: string;
    }>
  >;
  shareEnvironmentalImpact: () => Promise<{
    username: string;
    totalCarbonSaved: number;
    carbonFormatted: string;
    primaryComparison: string;
    badgeAchieved: boolean;
    shareText: string;
  }>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setActiveTab: (tab: string) => void;
  setSelectedItem: (item: Item | null) => void;
  toggleMapView: () => void;
  setCurrentLocation: (location: { lat: number; lng: number } | null) => void;
  updateSearchFilters: (filters: Partial<SearchFilters>) => void;
  clearSearchResults: () => void;
  hasPermission: (permission: Permission) => boolean;
  canPerformAction: (resource: string, action: string) => boolean;
  refreshPermissions: () => void;
  fetchUsers: () => Promise<void>;
  getUserById: (userId: string) => UserProfile | undefined;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
  updateUserStatus: (userId: string, newStatus: AccountStatus) => Promise<void>;
  metrics: DashboardMetric[];
  pendingItems: Item[];
  recentUsers: UserProfile[];
  adminLoading: boolean;
  loadAdminDashboard: () => Promise<void>;
  handleItemAction: (
    itemId: string,
    action: "approve" | "reject"
  ) => Promise<void>;
  handleUserAction: (
    userId: string,
    action: "warn" | "suspend"
  ) => Promise<void>;
}
export const useLoopItStore = create<LoopItStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        users: allUsers,
        isAuthenticated: false,
        isLoading: false,
        theme: "system",
        error: null,
        userPermissions: null,
        permissionChecker: null,
        isEmailVerified: true,
        isProfileSetupCompleted: false,
        isTutorialCompleted: false,
        items: allItems,
        savedItems: [],
        featuredItems: allItems.slice(0, 6),
        searchResults: [],
        searchFilters: {},
        isLoadingItems: false,
        getUserItems: () => {
          const state = get();
          return state.user?.items || [];
        },
        getFilteredItems: (filters) => {
          const state = get();
          const allItems = state.users.flatMap(
            (user: UserProfile) => user.items || []
          );
          if (!filters) return allItems;
          return filterItemsByCategory(
            filterItemsBySearch(allItems, filters.query || ""),
            filters.category || "all"
          );
        },
        getSearchedItems: (query, filters) => {
          const state = get();
          const allItems = state.users.flatMap(
            (user: UserProfile) => user.items || []
          );
          return filterItemsByCategory(
            filterItemsBySearch(allItems, query),
            filters?.category || "all"
          );
        },
        getSavedItems: () => {
          const state = get();
          return state.savedItems;
        },
        getFeaturedItems: () => {
          const state = get();
          return state.featuredItems;
        },
        getAllItems: () => {
          const state = get();
          return state.users.flatMap((user: UserProfile) => user.items || []);
        },
        swapRequests: allSwapRequests,
        sentRequests: [],
        receivedRequests: [],
        isLoadingRequests: false,
        offeredItems: [],
        isLoadingOfferedItems: false,
        conversations: defaultConversations,
        conversationMetadata: defaultConversationMetadata,
        unreadCount: 0,
        isLoadingMessages: false,
        notifications: allNotifications,
        unreadNotifications: allNotifications.filter((n) => !n.isRead).length,
        isLoadingNotifications: false,
        reviews: defaultReviews,
        userReviews: [],
        receivedReviews: [],
        pendingReviews: [],
        isLoadingReviews: false,
        communityPosts: allCommunityPosts,
        communityReplies: {},
        communityEvents: allCommunityEvents,
        userEvents: [],
        isLoadingCommunity: false,
        analytics: null,
        isLoadingAnalytics: false,
        environmentalImpact: null,
        isLoadingEnvironmentalImpact: false,
        activeTab: "home",
        selectedItem: null,
        selectedEvent: null,
        selectedPost: null,
        isMapView: false,
        currentLocation: null,
        login: async (credentials) => {
          try {
            set({ isLoading: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const demoAccount = getDemoAccount(credentials.email);
            if (!demoAccount || demoAccount.password !== credentials.password) {
              throw new Error(
                "Invalid credentials. Please use one of the demo accounts with password 'demo1234' or admin accounts with password 'admin1234'"
              );
            }
            const userToLogin = validateUserItems({
              ...demoAccount.user,
              email: credentials.email,
              security: {
                ...demoAccount.user.security,
                accountStatus: AccountStatus.ACTIVE,
              },
            });
            const userPermissions = getUserPermissions(userToLogin);
            const permissionChecker = createPermissionChecker(userToLogin);
            const sessionData = {
              user: userToLogin,
              userPermissions,
              lastLogin: new Date().toISOString(),
            };
            try {
              localStorage.setItem(
                STORAGE_KEYS.USER_SESSION,
                JSON.stringify(sessionData)
              );
              const accessToken = `demo_access_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`;
              const refreshToken = `demo_refresh_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`;
              get().storeJWTTokens({ accessToken, refreshToken });
              localStorage.setItem(
                STORAGE_KEYS.LAST_LOGIN,
                new Date().toISOString()
              );
              set({
                isProfileSetupCompleted: true,
                isTutorialCompleted: false,
              });
            } catch (storageError) {
              console.warn(
                "Failed to save session to localStorage:",
                storageError
              );
            }
            set({
              user: userToLogin,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              userPermissions,
              permissionChecker,
            });
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : "Login failed",
            });
          }
        },
        register: async (userData) => {
          try {
            set({ isLoading: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const userId = `user_${Date.now()}`;
            const newUser = {
              ...userData,
              id: userId,
              trustScore: 0,
              totalSwaps: 0,
              joinedAt: new Date(),
              isActive: true,
              items: [],
              preferences: {
                notifications: true,
                publicProfile: true,
                showLocation: true,
                autoAcceptTrustedUsers: false,
                emailNotifications: true,
              },
              stats: {
                itemsListed: 0,
                successfulSwaps: 0,
                rating: 0,
                reviewCount: 0,
                helpfulVotes: 0,
                eventsAttended: 0,
              },
              badges: [],
              subscription: {
                tier: SubscriptionTier.FREE,
                isActive: true,
                startDate: new Date(),
                features: ["basic_listings"],
              },
              security: {
                twoFactorEnabled: false,
                emailVerified: true,
                phoneVerified: false,
                loginAttempts: 0,
                lastPasswordChange: new Date(),
                accountStatus: AccountStatus.ACTIVE,
              },
              lastActiveAt: new Date(),
              environmentalStats: {
                totalCarbonSaved: 0,
                totalWaterSaved: 0,
                totalLandfillSaved: 0,
                ecoWarriorLevel: "",
                badges: [],
              },
            };
            const userPermissions = getUserPermissions(newUser);
            const permissionChecker = createPermissionChecker(newUser);
            const sessionData = {
              user: newUser,
              userPermissions,
              lastLogin: new Date().toISOString(),
            };
            try {
              localStorage.setItem(
                STORAGE_KEYS.USER_SESSION,
                JSON.stringify(sessionData)
              );
              const accessToken = `user_access_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`;
              const refreshToken = `user_refresh_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`;
              get().storeJWTTokens({ accessToken, refreshToken });
              localStorage.setItem(
                STORAGE_KEYS.LAST_LOGIN,
                new Date().toISOString()
              );
              set({
                isEmailVerified: true,
                isProfileSetupCompleted: false,
                isTutorialCompleted: false,
              });
            } catch (storageError) {
              console.warn(
                "Failed to save session to localStorage:",
                storageError
              );
            }
            set({
              user: newUser,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              userPermissions,
              permissionChecker,
            });
          } catch (error) {
            set({
              isLoading: false,
              error:
                error instanceof Error ? error.message : "Registration failed",
            });
          }
        },
        logout: async () => {
          try {
            set({ isLoading: true });
            await new Promise((resolve) => setTimeout(resolve, 500));
            try {
              localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
              localStorage.removeItem(STORAGE_KEYS.LAST_LOGIN);
              get().clearJWTTokens();
            } catch (storageError) {
              console.warn("Failed to clear localStorage:", storageError);
            }
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
              userPermissions: null,
              permissionChecker: null,
              savedItems: [],
              swapRequests: [],
              sentRequests: [],
              receivedRequests: [],
              notifications: [],
              unreadNotifications: 0,
              conversations: defaultConversations,
              conversationMetadata: defaultConversationMetadata,
              unreadCount: 0,
            });
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : "Logout failed",
            });
          }
        },
        updateProfile: async (updates) => {
          try {
            set({ isLoading: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const currentUser = get().user;
            if (!currentUser) throw new Error("No user found");
            const updatedUser = {
              ...currentUser,
              ...updates,
              items: updates.items || currentUser.items || [],
            };
            const newTrustScore = calculateUserTrustScore(updatedUser);
            updatedUser.trustScore = newTrustScore;
            const updatedBadges = checkAndAwardBadges(updatedUser);
            updatedUser.badges = updatedBadges;
            if (updates.stats) {
              updatedUser.stats = { ...updatedUser.stats, ...updates.stats };
            }
            set({
              user: updatedUser,
              isLoading: false,
            });
          } catch (error) {
            set({
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Profile update failed",
            });
          }
        },
        createItem: async (itemData) => {
          set({ isLoadingItems: true });
          try {
            const state = get();
            if (!state.user) throw new Error("User not authenticated");
            const newItem = {
              ...itemData,
              id: `item_${Date.now()}`,
              ownerId: state.user.id,
              ownerName: state.user.name,
              ownerAvatar: state.user.avatar,
              createdAt: new Date(),
              updatedAt: new Date(),
              views: 0,
              saves: 0,
              swapRequests: 0,
              changeHistory: [],
            };
            const updatedUser = {
              ...state.user,
              items: [...state.user.items, newItem],
            };
            const updatedUsers = state.users.map((u) =>
              u.id === state.user?.id ? updatedUser : u
            );
            set({
              user: updatedUser,
              users: updatedUsers,
              isLoadingItems: false,
            });
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to create item",
              isLoadingItems: false,
            });
          }
        },
        updateItem: async (itemId, updates) => {
          set({ isLoadingItems: true });
          try {
            const state = get();
            if (!state.user) throw new Error("User not authenticated");
            const userItems = state.getUserItems();
            const itemIndex = userItems.findIndex((item) => item.id === itemId);
            if (itemIndex === -1) throw new Error("Item not found");
            const updatedItem = {
              ...userItems[itemIndex],
              ...updates,
              updatedAt: new Date(),
            };
            const updatedUser = {
              ...state.user,
              items: [
                ...state.user.items.slice(0, itemIndex),
                updatedItem,
                ...state.user.items.slice(itemIndex + 1),
              ],
            };
            const updatedUsers = state.users.map((u) =>
              u.id === state.user?.id ? updatedUser : u
            );
            set({
              user: updatedUser,
              users: updatedUsers,
              isLoadingItems: false,
            });
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to update item",
              isLoadingItems: false,
            });
          }
        },
        deleteItem: async (itemId) => {
          set({ isLoadingItems: true });
          try {
            const state = get();
            if (!state.user) throw new Error("User not authenticated");
            const updatedUser = {
              ...state.user,
              items: state.user.items.filter((item) => item.id !== itemId),
            };
            const updatedUsers = state.users.map((u) =>
              u.id === state.user?.id ? updatedUser : u
            );
            set({
              user: updatedUser,
              users: updatedUsers,
              isLoadingItems: false,
            });
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to delete item",
              isLoadingItems: false,
            });
          }
        },
        fetchItems: async (filters) => {
          try {
            set({ isLoadingItems: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 800));
            let filteredItems = [...allItems];
            if (filters?.category) {
              filteredItems = filteredItems.filter(
                (item) => item.category === filters.category
              );
            }
            if (filters?.query) {
              const query = filters.query.toLowerCase();
              filteredItems = filteredItems.filter(
                (item) =>
                  item.title.toLowerCase().includes(query) ||
                  item.description.toLowerCase().includes(query) ||
                  item.tags.some((tag: string) =>
                    tag.toLowerCase().includes(query)
                  )
              );
            }
            if (filters?.location) {
              filteredItems = filteredItems.filter((item) =>
                item.location
                  .toLowerCase()
                  .includes(filters.location!.toLowerCase())
              );
            }
            set({
              searchResults: filteredItems,
              searchFilters: filters || {},
              isLoadingItems: false,
            });
          } catch (error) {
            set({
              isLoadingItems: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch items",
            });
          }
        },
        fetchUserItems: async (userId) => {
          try {
            set({ isLoadingItems: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            const state = get();
            const currentUser = state.user;
            const targetUserId = userId || currentUser?.id;
            if (!targetUserId) throw new Error("No user ID provided");
            if (!state.user) throw new Error("User not authenticated");
            const targetUser = state.users.find((u) => u.id === targetUserId);
            if (!targetUser) throw new Error("User not found");
            if (targetUserId === currentUser?.id) {
              const updatedUser = validateUserItems({
                ...state.user,
                items: targetUser.items,
              });
              const updatedUsers = state.users.map((u) =>
                u.id === targetUserId ? updatedUser : u
              );
              set({
                user: updatedUser,
                users: updatedUsers,
                isLoadingItems: false,
              });
            }
          } catch (error) {
            set({
              isLoadingItems: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch user items",
            });
          }
        },
        searchItems: async (query, filters) => {
          try {
            set({ isLoadingItems: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            let results = [...allItems];
            if (query) {
              const searchQuery = query.toLowerCase();
              results = results.filter(
                (item) =>
                  item.title.toLowerCase().includes(searchQuery) ||
                  item.description.toLowerCase().includes(searchQuery) ||
                  item.tags.some((tag: string) =>
                    tag.toLowerCase().includes(searchQuery)
                  )
              );
            }
            if (filters?.category) {
              results = results.filter(
                (item) => item.category === filters.category
              );
            }
            if (filters?.location) {
              results = results.filter((item) =>
                item.location
                  .toLowerCase()
                  .includes(filters.location!.toLowerCase())
              );
            }
            set({
              searchResults: results,
              searchFilters: { ...filters, query },
              isLoadingItems: false,
            });
          } catch (error) {
            set({
              isLoadingItems: false,
              error: error instanceof Error ? error.message : "Search failed",
            });
          }
        },
        saveItem: async (itemId) => {
          try {
            const item = allItems.find((i: Item) => i.id === itemId);
            if (!item) throw new Error("Item not found");
            const state = get();
            if (!state.user) throw new Error("User not authenticated");
            const updatedUser = {
              ...state.user,
              items: state.user.items.map((item) =>
                item.id === itemId ? { ...item, saves: item.saves + 1 } : item
              ),
            };
            set({
              user: updatedUser,
              savedItems: [...state.savedItems, item],
            });
          } catch (error) {
            set({
              error:
                error instanceof Error ? error.message : "Failed to save item",
            });
          }
        },
        unsaveItem: async (itemId) => {
          try {
            const state = get();
            if (!state.user) throw new Error("User not authenticated");
            const updatedUser = {
              ...state.user,
              items: state.user.items.map((item) =>
                item.id === itemId
                  ? { ...item, saves: Math.max(0, item.saves - 1) }
                  : item
              ),
            };
            set({
              user: updatedUser,
              savedItems: state.savedItems.filter((item) => item.id !== itemId),
            });
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to unsave item",
            });
          }
        },
        boostItem: async (itemId) => {
          try {
            set({ isLoadingItems: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 500));
            const boostExpiresAt = new Date();
            boostExpiresAt.setDate(boostExpiresAt.getDate() + 7);
            const state = get();
            if (!state.user) throw new Error("User not authenticated");
            const updatedUser = {
              ...state.user,
              items: state.user.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      isBoosted: true,
                      boostExpiresAt,
                      updatedAt: new Date(),
                    }
                  : item
              ),
            };
            set({
              user: updatedUser,
              isLoadingItems: false,
            });
          } catch (error) {
            set({
              isLoadingItems: false,
              error:
                error instanceof Error ? error.message : "Failed to boost item",
            });
          }
        },
        unboostItem: async (itemId) => {
          try {
            set({ isLoadingItems: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 500));
            const state = get();
            if (!state.user) throw new Error("User not authenticated");
            const updatedUser = {
              ...state.user,
              items: state.user.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      isBoosted: false,
                      boostExpiresAt: undefined,
                      updatedAt: new Date(),
                    }
                  : item
              ),
            };
            set({
              user: updatedUser,
              isLoadingItems: false,
            });
          } catch (error) {
            set({
              isLoadingItems: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to unboost item",
            });
          }
        },
        renewItem: async (itemId) => {
          try {
            set({ isLoadingItems: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 500));
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30);
            const state = get();
            if (!state.user) throw new Error("User not authenticated");
            const updatedUser = {
              ...state.user,
              items: state.user.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      expiresAt,
                      status: ItemStatus.AVAILABLE,
                      updatedAt: new Date(),
                    }
                  : item
              ),
            };
            set({
              user: updatedUser,
              isLoadingItems: false,
            });
          } catch (error) {
            set({
              isLoadingItems: false,
              error:
                error instanceof Error ? error.message : "Failed to renew item",
            });
          }
        },
        archiveItem: async (itemId) => {
          try {
            set({ isLoadingItems: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 500));
            const state = get();
            if (!state.user) throw new Error("User not authenticated");
            const updatedUser = {
              ...state.user,
              items: state.user.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      status: ItemStatus.REMOVED,
                      updatedAt: new Date(),
                    }
                  : item
              ),
            };
            set({
              user: updatedUser,
              isLoadingItems: false,
            });
          } catch (error) {
            set({
              isLoadingItems: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to archive item",
            });
          }
        },
        trackItemView: (itemId) => {
          const state = get();
          if (!state.user) throw new Error("User not authenticated");
          const updatedUser = {
            ...state.user,
            items: state.user.items.map((item) =>
              item.id === itemId ? { ...item, views: item.views + 1 } : item
            ),
          };
          set({
            user: updatedUser,
          });
        },
        trackItemSave: (itemId) => {
          const state = get();
          if (!state.user) throw new Error("User not authenticated");
          const updatedUser = {
            ...state.user,
            items: state.user.items.map((item) =>
              item.id === itemId ? { ...item, saves: item.saves + 1 } : item
            ),
          };
          set({
            user: updatedUser,
          });
        },
        trackItemRequest: (itemId) => {
          const state = get();
          if (!state.user) throw new Error("User not authenticated");
          const updatedUser = {
            ...state.user,
            items: state.user.items.map((item) =>
              item.id === itemId
                ? { ...item, swapRequests: item.swapRequests + 1 }
                : item
            ),
          };
          set({
            user: updatedUser,
          });
        },
        getItemsByStatus: (status) => {
          const state = get();
          const allItems = state.users.flatMap(
            (user: UserProfile) => user.items || []
          );
          if (status === "all") return allItems;
          return allItems.filter((item) => item.status === status);
        },
        getBoostedItems: () => {
          const state = get();
          const allItems = state.users.flatMap(
            (user: UserProfile) => user.items || []
          );
          return allItems.filter(
            (item) =>
              item.isBoosted &&
              item.boostExpiresAt &&
              new Date() < item.boostExpiresAt
          );
        },
        getExpiredItems: () => {
          const state = get();
          const allItems = state.users.flatMap(
            (user: UserProfile) => user.items || []
          );
          return allItems.filter(
            (item) => item.expiresAt && new Date() > item.expiresAt
          );
        },
        getItemsExpiringSoon: (days = 7) => {
          const state = get();
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() + days);
          const allItems = state.users.flatMap(
            (user: UserProfile) => user.items || []
          );
          return allItems.filter(
            (item) =>
              item.expiresAt &&
              item.expiresAt <= cutoffDate &&
              new Date() < item.expiresAt
          );
        },
        getItemsNeedingStatusUpdate: () => {
          const state = get();
          const allItems = state.users.flatMap(
            (user: UserProfile) => user.items || []
          );
          return allItems.filter((item) => {
            if (
              item.expiresAt &&
              new Date() > item.expiresAt &&
              item.status === ItemStatus.AVAILABLE
            ) {
              return true;
            }
            if (
              item.isBoosted &&
              item.boostExpiresAt &&
              new Date() > item.boostExpiresAt
            ) {
              return true;
            }
            return false;
          });
        },
        updateItemStatus: async (itemId, newStatus) => {
          try {
            set({ isLoadingItems: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 500));
            const state = get();
            if (!state.user) throw new Error("User not authenticated");
            const updatedUser = {
              ...state.user,
              items: state.user.items.map((item) =>
                item.id === itemId
                  ? { ...item, status: newStatus, updatedAt: new Date() }
                  : item
              ),
            };
            set({
              user: updatedUser,
              isLoadingItems: false,
            });
          } catch (error) {
            set({
              isLoadingItems: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to update item status",
            });
          }
        },
        addItemChangeHistory: async (itemId, field, oldValue, newValue) => {
          try {
            const currentUser = get().user;
            if (!currentUser) throw new Error("User not authenticated");
            const changeEntry = {
              field,
              oldValue,
              newValue,
              changedAt: new Date(),
              changedBy: currentUser.id,
            };
            const state = get();
            if (!state.user) throw new Error("User not authenticated");
            const updatedUser = {
              ...state.user,
              items: state.user.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      changeHistory: [
                        ...(item.changeHistory || []),
                        changeEntry,
                      ],
                      updatedAt: new Date(),
                    }
                  : item
              ),
            };
            set({
              user: updatedUser,
            });
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to add change history",
            });
          }
        },
        sendSwapRequest: async (requestData, offeredItem) => {
          try {
            set({ isLoadingRequests: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 800));
            let offeredItemId: string | undefined;
            if (offeredItem) {
              const createdItem = await get().createOfferedItem(offeredItem);
              offeredItemId = createdItem.id;
            }
            const newRequest: SwapRequest = {
              ...requestData,
              offeredItemId,
              id: `request_${Date.now()}`,
              status: SwapRequestStatus.PENDING,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            set((state) => ({
              sentRequests: [newRequest, ...state.sentRequests],
              swapRequests: [newRequest, ...state.swapRequests],
              isLoadingRequests: false,
              error: null,
            }));
          } catch (error) {
            set({
              isLoadingRequests: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to send swap request",
            });
          }
        },
        respondToSwapRequest: async (requestId, status) => {
          try {
            set({ isLoadingRequests: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            set((state) => ({
              swapRequests: state.swapRequests.map((request) =>
                request.id === requestId
                  ? {
                      ...request,
                      status,
                      updatedAt: new Date(),
                      respondedAt: new Date(),
                    }
                  : request
              ),
              receivedRequests: state.receivedRequests.map((request) =>
                request.id === requestId
                  ? {
                      ...request,
                      status,
                      updatedAt: new Date(),
                      respondedAt: new Date(),
                    }
                  : request
              ),
              isLoadingRequests: false,
              error: null,
            }));
          } catch (error) {
            set({
              isLoadingRequests: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to respond to request",
            });
          }
        },
        fetchSwapRequests: async () => {
          try {
            set({ isLoadingRequests: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 800));
            const currentUser = get().user;
            if (!currentUser) throw new Error("User not authenticated");
            const allRequests = get().swapRequests;
            const sentRequests = allRequests.filter(
              (req) => req.fromUserId === currentUser.id
            );
            const receivedRequests = allRequests.filter(
              (req) => req.toUserId === currentUser.id
            );
            set({
              sentRequests,
              receivedRequests,
              isLoadingRequests: false,
              error: null,
            });
          } catch (error) {
            set({
              isLoadingRequests: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch swap requests",
            });
          }
        },
        cancelSwapRequest: async (requestId) => {
          try {
            set({ isLoadingRequests: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 500));
            set((state) => ({
              swapRequests: state.swapRequests.map((request) =>
                request.id === requestId
                  ? {
                      ...request,
                      status: SwapRequestStatus.CANCELLED,
                      updatedAt: new Date(),
                    }
                  : request
              ),
              sentRequests: state.sentRequests.map((request) =>
                request.id === requestId
                  ? {
                      ...request,
                      status: SwapRequestStatus.CANCELLED,
                      updatedAt: new Date(),
                    }
                  : request
              ),
              isLoadingRequests: false,
              error: null,
            }));
          } catch (error) {
            set({
              isLoadingRequests: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to cancel request",
            });
          }
        },
        createOfferedItem: async (offeredItemData) => {
          try {
            set({ isLoadingOfferedItems: true, error: null });
            const currentUser = get().user;
            if (!currentUser) throw new Error("User not authenticated");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const newItem: Item = {
              id: `offered_item_${Date.now()}`,
              title: offeredItemData.title,
              description: offeredItemData.description,
              category: offeredItemData.category,
              condition: offeredItemData.condition,
              status: ItemStatus.AVAILABLE,
              images: offeredItemData.images.map((img) => img.preview),
              location: offeredItemData.location,
              ownerId: currentUser.id,
              ownerName: currentUser.name,
              ownerAvatar: currentUser.avatar,
              createdAt: new Date(),
              updatedAt: new Date(),
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              views: 0,
              saves: 0,
              swapRequests: 0,
              tags: offeredItemData.tags,
              isBoosted: false,
              changeHistory: [],
              environmentalImpact: {
                carbonSaved: 0,
                waterSaved: 0,
                landfillSaved: 0,
                offsetComparisons: {
                  carRides: 0,
                  flightHours: 0,
                  homeDays: 0,
                  treeDays: 0,
                  lightbulbHours: 0,
                  showerMinutes: 0,
                  meatMeals: 0,
                  coffeeCups: 0,
                },
              },
            };
            const { user, users } = get();
            if (!user) throw new Error("User not authenticated");
            const updatedUser = {
              ...user,
              items: [newItem, ...user.items],
            };
            const updatedUsers = users.map((u: UserProfile) =>
              u.id === user.id ? updatedUser : u
            );
            set({
              user: updatedUser,
              users: updatedUsers,
              offeredItems: [newItem, ...get().offeredItems],
              isLoadingOfferedItems: false,
              error: null,
            });
            return newItem;
          } catch (error) {
            set({
              isLoadingOfferedItems: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to create offered item",
            });
            throw error;
          }
        },
        sendMessage: async (swapRequestId, receiverId, message) => {
          try {
            set({ isLoadingMessages: true, error: null });
            const currentUser = get().user;
            if (!currentUser) throw new Error("User not authenticated");
            const optimisticMessage: ChatMessage = {
              id: `temp_${Date.now()}`,
              swapRequestId,
              senderId: currentUser.id,
              receiverId,
              message,
              timestamp: new Date(),
              status: MessageStatus.SENDING,
              isRead: false,
            };
            set((state) => ({
              conversations: {
                ...state.conversations,
                [swapRequestId]: [
                  ...(state.conversations[swapRequestId] || []),
                  optimisticMessage,
                ],
              },
            }));
            await new Promise((resolve) => setTimeout(resolve, 500));
            const finalMessage: ChatMessage = {
              ...optimisticMessage,
              id: `msg_${Date.now()}`,
              status: MessageStatus.SENT,
            };
            set((state) => ({
              conversations: {
                ...state.conversations,
                [swapRequestId]: state.conversations[swapRequestId].map((msg) =>
                  msg.id === optimisticMessage.id ? finalMessage : msg
                ),
              },
              isLoadingMessages: false,
              error: null,
            }));
            setTimeout(() => {
              set((state) => ({
                conversations: {
                  ...state.conversations,
                  [swapRequestId]: state.conversations[swapRequestId].map(
                    (msg) =>
                      msg.id === finalMessage.id
                        ? { ...msg, status: MessageStatus.DELIVERED }
                        : msg
                  ),
                },
              }));
            }, 1000);
          } catch (error) {
            set((state) => ({
              conversations: {
                ...state.conversations,
                [swapRequestId]: state.conversations[swapRequestId].map((msg) =>
                  msg.status === MessageStatus.SENDING
                    ? { ...msg, status: MessageStatus.FAILED }
                    : msg
                ),
              },
              isLoadingMessages: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to send message",
            }));
          }
        },
        fetchMessages: async (swapRequestId) => {
          try {
            set({ isLoadingMessages: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            const mockMessages: ChatMessage[] = [
              {
                id: `msg_1_${swapRequestId}`,
                swapRequestId,
                senderId: "user_001",
                receiverId: "user_002",
                message:
                  "Hi! I'm interested in your item. Is it still available?",
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                status: MessageStatus.READ,
                isRead: true,
              },
              {
                id: `msg_2_${swapRequestId}`,
                swapRequestId,
                senderId: "user_002",
                receiverId: "user_001",
                message:
                  "Yes, it's still available! Would you like to arrange a swap?",
                timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
                status: MessageStatus.READ,
                isRead: true,
              },
              {
                id: `msg_3_${swapRequestId}`,
                swapRequestId,
                senderId: "user_001",
                receiverId: "user_002",
                message: "Great! When would be a good time to meet?",
                timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000),
                status: MessageStatus.DELIVERED,
                isRead: false,
              },
            ];
            set((state) => ({
              conversations: {
                ...state.conversations,
                [swapRequestId]: mockMessages,
              },
              isLoadingMessages: false,
              error: null,
            }));
          } catch (error) {
            set({
              isLoadingMessages: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch messages",
            });
          }
        },
        markMessagesAsRead: async (swapRequestId) => {
          try {
            const currentUser = get().user;
            if (!currentUser) return;
            set((state) => ({
              conversations: {
                ...state.conversations,
                [swapRequestId]:
                  state.conversations[swapRequestId]?.map((msg) =>
                    msg.receiverId === currentUser.id && !msg.isRead
                      ? { ...msg, isRead: true, status: MessageStatus.READ }
                      : msg
                  ) || [],
              },
              unreadCount: Math.max(0, state.unreadCount - 1),
            }));
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to mark messages as read",
            });
          }
        },
        fetchNotifications: async () => {
          try {
            set({ isLoadingNotifications: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            set({
              isLoadingNotifications: false,
              error: null,
            });
          } catch (error) {
            set({
              isLoadingNotifications: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch notifications",
            });
          }
        },
        markNotificationAsRead: async (notificationId) => {
          try {
            set((state) => ({
              notifications: state.notifications.map((notification) =>
                notification.id === notificationId
                  ? { ...notification, isRead: true }
                  : notification
              ),
              unreadNotifications: Math.max(0, state.unreadNotifications - 1),
            }));
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to mark notification as read",
            });
          }
        },
        markAllNotificationsAsRead: async () => {
          try {
            set((state) => ({
              notifications: state.notifications.map((notification) => ({
                ...notification,
                isRead: true,
              })),
              unreadNotifications: 0,
            }));
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to mark all notifications as read",
            });
          }
        },
        createReview: async (reviewData) => {
          try {
            set({ isLoadingReviews: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 800));
            const currentUser = get().user;
            if (!currentUser) throw new Error("User not authenticated");
            const newReview: Review = {
              ...reviewData,
              id: `review_${Date.now()}`,
              createdAt: new Date(),
            };
            set((state) => ({
              reviews: [newReview, ...state.reviews],
              userReviews: [newReview, ...state.userReviews],
              isLoadingReviews: false,
              error: null,
            }));
          } catch (error) {
            set({
              isLoadingReviews: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to create review",
            });
          }
        },
        fetchUserReviews: async (userId) => {
          try {
            set({ isLoadingReviews: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            const currentUser = get().user;
            const targetUserId = userId || currentUser?.id;
            if (!targetUserId) throw new Error("No user ID provided");
            const userReviews = get().reviews.filter(
              (review) => review.fromUserId === targetUserId
            );
            set({
              userReviews,
              isLoadingReviews: false,
            });
          } catch (error) {
            set({
              isLoadingReviews: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch user reviews",
            });
          }
        },
        fetchReceivedReviews: async (userId) => {
          try {
            set({ isLoadingReviews: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            const currentUser = get().user;
            const targetUserId = userId || currentUser?.id;
            if (!targetUserId) throw new Error("No user ID provided");
            const receivedReviews = get().reviews.filter(
              (review) => review.toUserId === targetUserId
            );
            set({
              receivedReviews,
              isLoadingReviews: false,
            });
          } catch (error) {
            set({
              isLoadingReviews: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch received reviews",
            });
          }
        },
        fetchPendingReviews: async () => {
          try {
            set({ isLoadingReviews: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            const pendingReviews: Review[] = [];
            set({
              pendingReviews,
              isLoadingReviews: false,
            });
          } catch (error) {
            set({
              isLoadingReviews: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch pending reviews",
            });
          }
        },
        hasReviewedSwap: (swapRequestId) => {
          const { userReviews } = get();
          return userReviews.some(
            (review) => review.swapRequestId === swapRequestId
          );
        },
        updateReview: async (reviewId, updates) => {
          try {
            set({ isLoadingReviews: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 800));
            const currentUser = get().user;
            if (!currentUser) throw new Error("User not authenticated");
            const existingReview = get().reviews.find(
              (review) => review.id === reviewId
            );
            if (!existingReview) throw new Error("Review not found");
            const updatedReview: Review = {
              ...existingReview,
              ...updates,
              updatedAt: new Date(),
            };
            set((state) => ({
              reviews: state.reviews.map((review) =>
                review.id === reviewId ? updatedReview : review
              ),
              userReviews: state.userReviews.map((review) =>
                review.id === reviewId ? updatedReview : review
              ),
              isLoadingReviews: false,
              error: null,
            }));
          } catch (error) {
            set({
              isLoadingReviews: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to update review",
            });
          }
        },
        deleteReview: async (reviewId) => {
          try {
            set({ isLoadingReviews: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 500));
            set((state) => ({
              reviews: state.reviews.filter((review) => review.id !== reviewId),
              userReviews: state.userReviews.filter(
                (review) => review.id !== reviewId
              ),
              isLoadingReviews: false,
              error: null,
            }));
          } catch (error) {
            set({
              isLoadingReviews: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to delete review",
            });
          }
        },
        respondToReview: async (reviewId, content) => {
          try {
            set({ isLoadingReviews: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            const currentUser = get().user;
            if (!currentUser) throw new Error("User not authenticated");
            const existingReview = get().reviews.find(
              (review) => review.id === reviewId
            );
            if (!existingReview) throw new Error("Review not found");
            const updatedReview: Review = {
              ...existingReview,
              response: {
                id: `response_${Date.now()}`,
                reviewId,
                authorId: currentUser.id,
                authorName: currentUser.name,
                content,
                createdAt: new Date(),
              },
              updatedAt: new Date(),
            };
            set((state) => ({
              reviews: state.reviews.map((review) =>
                review.id === reviewId ? updatedReview : review
              ),
              userReviews: state.userReviews.map((review) =>
                review.id === reviewId ? updatedReview : review
              ),
              isLoadingReviews: false,
              error: null,
            }));
          } catch (error) {
            set({
              isLoadingReviews: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to respond to review",
            });
          }
        },
        updateReviewResponse: async (reviewId, responseId, content) => {
          try {
            set({ isLoadingReviews: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            const currentUser = get().user;
            if (!currentUser) throw new Error("User not authenticated");
            const existingReview = get().reviews.find(
              (review) => review.id === reviewId
            );
            if (!existingReview || !existingReview.response)
              throw new Error("Review or response not found");
            const updatedReview: Review = {
              ...existingReview,
              response: {
                ...existingReview.response,
                content,
                editedAt: new Date(),
              },
              updatedAt: new Date(),
            };
            set((state) => ({
              reviews: state.reviews.map((review) =>
                review.id === reviewId ? updatedReview : review
              ),
              userReviews: state.userReviews.map((review) =>
                review.id === reviewId ? updatedReview : review
              ),
              isLoadingReviews: false,
              error: null,
            }));
          } catch (error) {
            set({
              isLoadingReviews: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to update review response",
            });
          }
        },
        deleteReviewResponse: async (reviewId, responseId) => {
          try {
            set({ isLoadingReviews: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            const currentUser = get().user;
            if (!currentUser) throw new Error("User not authenticated");
            const existingReview = get().reviews.find(
              (review) => review.id === reviewId
            );
            if (!existingReview) throw new Error("Review not found");
            const updatedReview: Review = {
              ...existingReview,
              response: undefined,
              updatedAt: new Date(),
            };
            set((state) => ({
              reviews: state.reviews.map((review) =>
                review.id === reviewId ? updatedReview : review
              ),
              userReviews: state.userReviews.map((review) =>
                review.id === reviewId ? updatedReview : review
              ),
              isLoadingReviews: false,
              error: null,
            }));
          } catch (error) {
            set({
              isLoadingReviews: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to delete review response",
            });
          }
        },
        voteOnReview: async (reviewId, voteType) => {
          try {
            set({ isLoadingReviews: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            const currentUser = get().user;
            if (!currentUser) throw new Error("User not authenticated");
            const existingReview = get().reviews.find(
              (review) => review.id === reviewId
            );
            if (!existingReview) throw new Error("Review not found");
            const updatedReview: Review = {
              ...existingReview,
              helpfulness: {
                ...existingReview.helpfulness,
                helpful:
                  voteType === "helpful"
                    ? existingReview.helpfulness.helpful + 1
                    : existingReview.helpfulness.helpful,
                notHelpful:
                  voteType === "not_helpful"
                    ? existingReview.helpfulness.notHelpful + 1
                    : existingReview.helpfulness.notHelpful,
                userVote: voteType,
              },
              updatedAt: new Date(),
            };
            set((state) => ({
              reviews: state.reviews.map((review) =>
                review.id === reviewId ? updatedReview : review
              ),
              userReviews: state.userReviews.map((review) =>
                review.id === reviewId ? updatedReview : review
              ),
              isLoadingReviews: false,
              error: null,
            }));
          } catch (error) {
            set({
              isLoadingReviews: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to vote on review",
            });
          }
        },
        removeReviewVote: async (reviewId) => {
          try {
            set({ isLoadingReviews: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            const currentUser = get().user;
            if (!currentUser) throw new Error("User not authenticated");
            const existingReview = get().reviews.find(
              (review) => review.id === reviewId
            );
            if (!existingReview) throw new Error("Review not found");
            const updatedReview: Review = {
              ...existingReview,
              helpfulness: {
                ...existingReview.helpfulness,
                helpful: Math.max(0, existingReview.helpfulness.helpful - 1),
                userVote: null,
              },
              updatedAt: new Date(),
            };
            set((state) => ({
              reviews: state.reviews.map((review) =>
                review.id === reviewId ? updatedReview : review
              ),
              userReviews: state.userReviews.map((review) =>
                review.id === reviewId ? updatedReview : review
              ),
              isLoadingReviews: false,
              error: null,
            }));
          } catch (error) {
            set({
              isLoadingReviews: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to remove vote from review",
            });
          }
        },
        flagReview: async (reviewId, reason, category) => {
          try {
            set({ isLoadingReviews: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            const currentUser = get().user;
            if (!currentUser) throw new Error("User not authenticated");
            const existingReview = get().reviews.find(
              (review) => review.id === reviewId
            );
            if (!existingReview) throw new Error("Review not found");
            const updatedReview: Review = {
              ...existingReview,
              moderationFlags: [
                ...(existingReview.moderationFlags || []),
                {
                  id: `flag_${Date.now()}`,
                  reviewId,
                  flaggedBy: currentUser.id,
                  reason,
                  category,
                  createdAt: new Date(),
                  status: "pending",
                },
              ],
              updatedAt: new Date(),
            };
            set((state) => ({
              reviews: state.reviews.map((review) =>
                review.id === reviewId ? updatedReview : review
              ),
              userReviews: state.userReviews.map((review) =>
                review.id === reviewId ? updatedReview : review
              ),
              isLoadingReviews: false,
              error: null,
            }));
          } catch (error) {
            set({
              isLoadingReviews: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to flag review",
            });
          }
        },
        moderateReview: async (reviewId, action) => {
          try {
            set({ isLoadingReviews: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            const currentUser = get().user;
            if (!currentUser) throw new Error("User not authenticated");
            const existingReview = get().reviews.find(
              (review) => review.id === reviewId
            );
            if (!existingReview) throw new Error("Review not found");
            const statusMap = {
              approve: ReviewStatus.APPROVED,
              reject: ReviewStatus.REJECTED,
              hide: ReviewStatus.HIDDEN,
            };
            const updatedReview: Review = {
              ...existingReview,
              status: statusMap[action],
              updatedAt: new Date(),
            };
            set((state) => ({
              reviews: state.reviews.map((review) =>
                review.id === reviewId ? updatedReview : review
              ),
              userReviews: state.userReviews.map((review) =>
                review.id === reviewId ? updatedReview : review
              ),
              isLoadingReviews: false,
              error: null,
            }));
          } catch (error) {
            set({
              isLoadingReviews: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to moderate review",
            });
          }
        },
        getReviewsByStatus: (status) => {
          const state = get();
          return state.reviews.filter((review) => review.status === status);
        },
        getReviewsByRating: (minRating, maxRating) => {
          const state = get();
          return state.reviews.filter((review) => {
            const overallRating = review.criteriaRatings
              ? review.criteriaRatings.reduce(
                  (sum, item) => sum + item.rating,
                  0
                ) / review.criteriaRatings.length
              : review.overallRating;
            return (
              overallRating >= minRating &&
              (maxRating ? overallRating <= maxRating : true)
            );
          });
        },
        getReviewsForItem: (itemId) => {
          const state = get();
          return state.reviews.filter((review) => review.itemId === itemId);
        },
        getReviewsForSwap: (swapRequestId) => {
          const state = get();
          return state.reviews.filter(
            (review) => review.swapRequestId === swapRequestId
          );
        },
        getVerifiedReviews: () => {
          const state = get();
          return state.reviews.filter((review) => review.isVerified);
        },
        getRecentReviews: (days = 30) => {
          const state = get();
          const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
          return state.reviews.filter(
            (review) => new Date(review.createdAt) >= cutoffDate
          );
        },
        getMostHelpfulReviews: (limit = 10) => {
          const state = get();
          return state.reviews
            .sort((a, b) => b.helpfulness.helpful - a.helpfulness.helpful)
            .slice(0, limit);
        },
        getTopRatedReviews: (limit = 10) => {
          const state = get();
          return state.reviews
            .sort((a, b) => {
              const aRating = a.criteriaRatings
                ? a.criteriaRatings.reduce(
                    (sum, item) => sum + item.rating,
                    0
                  ) / a.criteriaRatings.length
                : a.overallRating;
              const bRating = b.criteriaRatings
                ? b.criteriaRatings.reduce(
                    (sum, item) => sum + item.rating,
                    0
                  ) / b.criteriaRatings.length
                : b.overallRating;
              return bRating - aRating;
            })
            .slice(0, limit);
        },
        calculateUserRatingStats: (userId) => {
          const state = get();
          const userReviews = state.reviews.filter(
            (review) => review.toUserId === userId
          );
          const totalReviews = userReviews.length;
          const totalVotes = userReviews.reduce(
            (total, review) => total + review.helpfulness.helpful,
            0
          );
          const averageRating =
            totalReviews > 0
              ? userReviews.reduce((sum, review) => {
                  const overallRating = review.criteriaRatings
                    ? review.criteriaRatings.reduce(
                        (sum, item) => sum + item.rating,
                        0
                      ) / review.criteriaRatings.length
                    : review.overallRating;
                  return sum + overallRating;
                }, 0) / totalReviews
              : 0;
          const ratingDistribution = userReviews.reduce(
            (distribution, review) => {
              const overallRating = review.criteriaRatings
                ? Math.round(
                    review.criteriaRatings.reduce(
                      (sum, item) => sum + item.rating,
                      0
                    ) / review.criteriaRatings.length
                  )
                : Math.round(review.overallRating);
              distribution[overallRating] =
                (distribution[overallRating] || 0) + 1;
              return distribution;
            },
            {} as Record<number, number>
          );
          const helpfulVotes = userReviews.reduce(
            (total, review) => total + review.helpfulness.helpful,
            0
          );
          const responseRate =
            totalReviews > 0
              ? userReviews.filter((review) => review.response).length /
                totalReviews
              : 0;
          return {
            averageRating,
            totalReviews,
            ratingDistribution,
            helpfulVotes,
            responseRate,
          };
        },
        generateReviewAnalytics: (userId) => {
          const state = get();
          const userReviews = userId
            ? state.reviews.filter((review) => review.toUserId === userId)
            : state.reviews;
          const totalReviews = userReviews.length;
          const totalVotes = userReviews.reduce(
            (total, review) => total + review.helpfulness.helpful,
            0
          );
          const averageRating =
            totalReviews > 0 ? totalVotes / totalReviews : 0;
          const ratingTrend = "stable" as const;
          const monthlyStats: Array<{
            month: string;
            count: number;
            average: number;
          }> = [];
          const criteriaBreakdown: Record<
            string,
            { average: number; count: number }
          > = {};
          return {
            totalReviews,
            averageRating,
            ratingTrend,
            monthlyStats,
            criteriaBreakdown,
          };
        },
        exportReviewsToCSV: (userId) => {
          const state = get();
          const userReviews = userId
            ? state.reviews.filter((review) => review.toUserId === userId)
            : state.reviews;
          const headers = [
            "Review ID",
            "From User",
            "To User",
            "Swap Request ID",
            "Status",
            "Overall Rating",
            "Response",
            "Helpful Votes",
            "Not Helpful Votes",
            "Flags Count",
            "Created At",
            "Updated At",
            "From User ID",
            "To User ID",
            "Response ID",
            "Criteria Ratings",
            "Moderation Flags",
          ].join(",");
          const csvData = userReviews
            .map((review) => {
              const overallRating = review.criteriaRatings
                ? review.criteriaRatings.reduce(
                    (sum, item) => sum + item.rating,
                    0
                  ) / review.criteriaRatings.length
                : review.overallRating;
              return [
                review.id,
                review.fromUserName,
                review.toUserId,
                review.swapRequestId,
                review.status,
                overallRating,
                review.response?.content || "",
                review.helpfulness.helpful,
                review.helpfulness.notHelpful,
                review.moderationFlags?.length || 0,
                review.createdAt,
                review.updatedAt,
                review.fromUserId,
                review.toUserId,
                review.response?.id || "",
                JSON.stringify(review.criteriaRatings || {}),
                JSON.stringify(review.moderationFlags || []),
              ].join(",");
            })
            .join("\n");
          return `${headers}\n${csvData}`;
        },
        shareReview: (reviewId) => {
          const state = get();
          const review = state.reviews.find((r) => r.id === reviewId);
          return {
            title: review?.comment || "Review",
            description: review?.comment || "Check out this review",
            url: `/review/${reviewId}`,
          };
        },
        checkReviewEligibility: (swapRequestId) => {
          const state = get();
          const existingReview = state.reviews.find(
            (r) => r.swapRequestId === swapRequestId
          );
          if (existingReview) {
            return {
              eligible: false,
              reason: "Review already exists for this swap",
            };
          }
          return { eligible: true };
        },
        getReviewPrompts: (swapRequestId) => {
          const state = get();
          const review = state.reviews.find(
            (r) => r.swapRequestId === swapRequestId
          );
          return {
            shouldPrompt: !review,
            daysAfterSwap: review
              ? Math.floor(
                  (Date.now() - new Date(review.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              : 0,
          };
        },
        autoModerateReview: (reviewContent) => {
          const flaggedWords = ["spam", "fake", "scam", "terrible", "awful"];
          const flagged = flaggedWords.some((word) =>
            reviewContent.toLowerCase().includes(word)
          );
          const reasons = flagged
            ? ["Contains potentially inappropriate content"]
            : [];
          return { flagged, reasons };
        },
        createCommunityPost: async (postData) => {
          try {
            set({ isLoadingCommunity: true, error: null });
            const currentUser = get().user;
            if (!currentUser) throw new Error("User not authenticated");
            const newPost: CommunityPost = {
              ...postData,
              id: "post_" + Date.now(),
              authorId: currentUser.id,
              authorName: currentUser.name,
              authorAvatar: currentUser.avatar,
              upvotes: 0,
              downvotes: 0,
              replyCount: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            set((state) => ({
              communityPosts: [newPost, ...state.communityPosts],
              isLoadingCommunity: false,
            }));
          } catch (error) {
            set({
              isLoadingCommunity: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to create post",
            });
          }
        },
        fetchCommunityPosts: async (category) => {
          try {
            set({ isLoadingCommunity: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            const communityPosts = allCommunityPosts.filter(
              (post) => !category || post.category === category
            );
            set({
              communityPosts,
              isLoadingCommunity: false,
            });
          } catch (error) {
            set({
              isLoadingCommunity: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch community posts",
            });
          }
        },
        upvotePost: async (postId) => {
          try {
            set({ isLoadingCommunity: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            const currentUser = get().user;
            if (!currentUser) throw new Error("User not authenticated");
            const updatedPosts = allCommunityPosts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    upvotes: post.upvotes + 1,
                  }
                : post
            );
            set({
              communityPosts: updatedPosts,
              isLoadingCommunity: false,
            });
          } catch (error) {
            set({
              isLoadingCommunity: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to upvote post",
            });
          }
        },
        downvotePost: async (postId) => {
          try {
            set({ isLoadingCommunity: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            const currentUser = get().user;
            if (!currentUser) throw new Error("User not authenticated");
            const updatedPosts = allCommunityPosts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    downvotes: post.downvotes + 1,
                  }
                : post
            );
            set({
              communityPosts: updatedPosts,
              isLoadingCommunity: false,
            });
          } catch (error) {
            set({
              isLoadingCommunity: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to downvote post",
            });
          }
        },
        replyToPost: async (postId) => {
          try {
            set({ isLoadingCommunity: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 800));
            const currentUser = get().user;
            if (!currentUser) throw new Error("User not authenticated");
            const updatedPosts = allCommunityPosts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    replyCount: post.replyCount + 1,
                  }
                : post
            );
            set({
              communityPosts: updatedPosts,
              isLoadingCommunity: false,
            });
          } catch (error) {
            set({
              isLoadingCommunity: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to reply to post",
            });
          }
        },
        markPostAsResolved: async (postId) => {
          try {
            set({ isLoadingCommunity: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            const updatedPosts = allCommunityPosts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    isResolved: true,
                  }
                : post
            );
            set({
              communityPosts: updatedPosts,
              isLoadingCommunity: false,
            });
          } catch (error) {
            set({
              isLoadingCommunity: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to mark post as resolved",
            });
          }
        },
        createEvent: async (eventData) => {
          try {
            set({ isLoadingCommunity: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 800));
            const currentUser = get().user;
            if (!currentUser) throw new Error("User not authenticated");
            const newEvent: CommunityEvent = {
              ...eventData,
              id: "event_" + Date.now(),
              organizerId: currentUser.id,
              organizerName: currentUser.name,
              currentParticipants: 1,
              participants: [currentUser.id],
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            set((state) => ({
              communityEvents: [newEvent, ...state.communityEvents],
              userEvents: [newEvent, ...state.userEvents],
              isLoadingCommunity: false,
            }));
          } catch (error) {
            set({
              isLoadingCommunity: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to create event",
            });
          }
        },
        fetchCommunityEvents: async () => {
          try {
            set({ isLoadingCommunity: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            const communityEvents = allCommunityEvents;
            set({
              communityEvents,
              isLoadingCommunity: false,
            });
          } catch (error) {
            set({
              isLoadingCommunity: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch community events",
            });
          }
        },
        joinEvent: async (eventId) => {
          try {
            set({ isLoadingCommunity: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            const currentUser = get().user;
            if (!currentUser) throw new Error("User not authenticated");
            const updatedEvents = allCommunityEvents.map((event) =>
              event.id === eventId
                ? {
                    ...event,
                    currentParticipants: event.participants.length + 1,
                    participants: [...event.participants, currentUser.id],
                  }
                : event
            );
            set({
              communityEvents: updatedEvents,
              userEvents: updatedEvents.filter((event) =>
                event.participants.includes(currentUser.id)
              ),
              isLoadingCommunity: false,
            });
          } catch (error) {
            set({
              isLoadingCommunity: false,
              error:
                error instanceof Error ? error.message : "Failed to join event",
            });
          }
        },
        leaveEvent: async (eventId) => {
          try {
            set({ isLoadingCommunity: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            const currentUser = get().user;
            if (!currentUser) throw new Error("User not authenticated");
            const updatedEvents = allCommunityEvents.map((event) =>
              event.id === eventId
                ? {
                    ...event,
                    participants: event.participants.filter(
                      (id) => id !== currentUser.id
                    ),
                  }
                : event
            );
            set({
              communityEvents: updatedEvents,
              userEvents: updatedEvents.filter(
                (event) => !event.participants.includes(currentUser.id)
              ),
              isLoadingCommunity: false,
            });
          } catch (error) {
            set({
              isLoadingCommunity: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to leave event",
            });
          }
        },
        fetchUserEvents: async () => {
          try {
            set({ isLoadingCommunity: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            const currentUser = get().user;
            if (!currentUser) throw new Error("User not authenticated");
            const userEvents = allCommunityEvents.filter(
              (event) =>
                event.organizerId === currentUser.id ||
                event.participants.includes(currentUser.id)
            );
            set({
              userEvents,
              isLoadingCommunity: false,
            });
          } catch (error) {
            set({
              isLoadingCommunity: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch user events",
            });
          }
        },
        fetchAnalytics: async () => {
          try {
            set({ isLoadingAnalytics: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            const analytics: Analytics = {
              totalViews: 0,
              totalSwaps: 0,
              mostViewedCategory: ItemCategory.CLOTHING,
              averageResponseTime: 0,
              successRate: 0,
              topLocations: [],
              monthlyStats: [],
              environmentalImpact: {
                totalCarbonSaved: 0,
                totalWaterSaved: 0,
                totalLandfillSaved: 0,
                impactByCategory: {
                  [ItemCategory.CLOTHING]: {
                    carbonSaved: 0,
                    waterSaved: 0,
                    landfillSaved: 0,
                  },
                  [ItemCategory.BOOKS]: {
                    carbonSaved: 0,
                    waterSaved: 0,
                    landfillSaved: 0,
                  },
                  [ItemCategory.FURNITURE]: {
                    carbonSaved: 0,
                    waterSaved: 0,
                    landfillSaved: 0,
                  },
                  [ItemCategory.ELECTRONICS]: {
                    carbonSaved: 0,
                    waterSaved: 0,
                    landfillSaved: 0,
                  },
                  [ItemCategory.TOYS]: {
                    carbonSaved: 0,
                    waterSaved: 0,
                    landfillSaved: 0,
                  },
                  [ItemCategory.SPORTS]: {
                    carbonSaved: 0,
                    waterSaved: 0,
                    landfillSaved: 0,
                  },
                  [ItemCategory.HOUSEHOLD]: {
                    carbonSaved: 0,
                    waterSaved: 0,
                    landfillSaved: 0,
                  },
                  [ItemCategory.OTHER]: {
                    carbonSaved: 0,
                    waterSaved: 0,
                    landfillSaved: 0,
                  },
                },
                communityRankings: {
                  topSavers: [],
                  mostActiveCategories: [],
                },
              },
            };
            set({
              analytics,
              isLoadingAnalytics: false,
            });
          } catch (error) {
            set({
              isLoadingAnalytics: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch analytics",
            });
          }
        },
        recordSuccessfulSwap: (swapRequestId: string) => {
          const state = get();
          const user = state.user;
          if (!user) {
            set({ error: "User not authenticated" });
            return;
          }
          const itemIndex = user.items.findIndex(
            (item: Item) => item.id === swapRequestId
          );
          if (itemIndex === -1) {
            set({ error: "Item not found" });
            return;
          }
          const currentItem = user.items[itemIndex];
          const currentStats = currentItem.stats || {
            successfulSwaps: 0,
            views: currentItem.views,
            saves: currentItem.saves,
            swapRequests: currentItem.swapRequests,
          };
          const updatedItem: Item = {
            ...currentItem,
            status: ItemStatus.SWAPPED,
            swapCompletedAt: new Date(),
            stats: {
              ...currentStats,
              successfulSwaps: currentStats.successfulSwaps + 1,
            },
          };
          const updatedUser: UserProfile = {
            ...user,
            items: [
              ...user.items.slice(0, itemIndex),
              updatedItem,
              ...user.items.slice(itemIndex + 1),
            ],
            stats: {
              ...user.stats,
              successfulSwaps: user.stats.successfulSwaps + 1,
            },
          };
          set({ user: updatedUser });
        },
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),
        setActiveTab: (tab) => set({ activeTab: tab }),
        setSelectedItem: (item) => set({ selectedItem: item }),
        toggleMapView: () => set((state) => ({ isMapView: !state.isMapView })),
        setCurrentLocation: (location) => set({ currentLocation: location }),
        updateSearchFilters: (filters) =>
          set((state) => ({
            searchFilters: { ...state.searchFilters, ...filters },
          })),
        clearSearchResults: () => set({ searchResults: [], searchFilters: {} }),
        hasPermission: (permission) => {
          const { permissionChecker } = get();
          return permissionChecker
            ? permissionChecker.hasPermission(permission)
            : false;
        },
        canPerformAction: (resource, action) => {
          const { permissionChecker } = get();
          return permissionChecker
            ? permissionChecker.canAccess(resource, action)
            : false;
        },
        refreshPermissions: () => {
          const { user } = get();
          if (user) {
            const userPermissions = getUserPermissions(user);
            const permissionChecker = createPermissionChecker(user);
            set({ userPermissions, permissionChecker });
          }
        },
        verifyEmail: async (token: string) => {
          try {
            set({ isLoading: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 1000));
            set({ isEmailVerified: true, isLoading: false });
          } catch (error) {
            set({
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Email verification failed",
            });
          }
        },
        resendVerificationEmail: async () => {
          try {
            set({ isLoading: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 2000));
            set({ isLoading: false });
          } catch (error) {
            set({
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to resend verification email",
            });
          }
        },
        requestPasswordReset: async (email: string) => {
          try {
            set({ isLoading: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 2000));
            set({ isLoading: false });
          } catch (error) {
            set({
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to send password reset email",
            });
          }
        },
        resetPassword: async (token: string, newPassword: string) => {
          try {
            set({ isLoading: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 1500));
            set({ isLoading: false });
          } catch (error) {
            set({
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Password reset failed",
            });
          }
        },
        completeProfileSetup: async () => {
          try {
            set({ isLoading: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 1000));
            set({ isProfileSetupCompleted: true, isLoading: false });
          } catch (error) {
            set({
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Profile setup completion failed",
            });
          }
        },
        completeTutorial: async () => {
          try {
            set({ isLoading: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 500));
            set({ isTutorialCompleted: true, isLoading: false });
          } catch (error) {
            set({
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Tutorial completion failed",
            });
          }
        },
        checkEmailVerification: (email: string) => {
          return get().isEmailVerified;
        },
        checkProfileSetupStatus: () => {
          return get().isProfileSetupCompleted;
        },
        checkTutorialStatus: () => {
          return get().isTutorialCompleted;
        },
        restoreSession: async (): Promise<void> => {
          try {
            set({ isLoading: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const sessionData = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
            if (sessionData) {
              const parsedSessionData = JSON.parse(sessionData);
              const userItems = allItems.filter(
                (item) => item.ownerId === parsedSessionData.user.id
              );
              const userToLogin = validateUserItems({
                ...parsedSessionData.user,
              });
              const userPermissions = getUserPermissions(userToLogin);
              const permissionChecker = createPermissionChecker(userToLogin);
              set({
                user: userToLogin,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                userPermissions,
                permissionChecker,
                isEmailVerified: userToLogin.security?.emailVerified || false,
                isProfileSetupCompleted: true,
                isTutorialCompleted: true,
              });
              return;
            }
            set({ isLoading: false });
          } catch (error) {
            console.error("Error restoring session:", error);
            set({ isLoading: false, error: "Failed to restore session" });
          }
        },
        storeJWTTokens: (tokens: {
          accessToken: string;
          refreshToken: string;
        }) => {
          try {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
            localStorage.setItem(
              STORAGE_KEYS.REFRESH_TOKEN,
              tokens.refreshToken
            );
            const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
            localStorage.setItem(
              STORAGE_KEYS.AUTH_TOKEN,
              JSON.stringify({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                expiresAt,
              })
            );
          } catch (error) {
            console.error("Failed to store JWT tokens:", error);
          }
        },
        refreshJWTToken: async () => {
          try {
            const refreshToken = localStorage.getItem(
              STORAGE_KEYS.REFRESH_TOKEN
            );
            if (!refreshToken) {
              return false;
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const newAccessToken =
              "new_access_" +
              Date.now() +
              "_" +
              Math.random().toString(36).substr(2, 9);
            const newRefreshToken =
              "new_refresh_" +
              Date.now() +
              "_" +
              Math.random().toString(36).substr(2, 9);
            get().storeJWTTokens({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            });
            return true;
          } catch (error) {
            console.error("Failed to refresh JWT token:", error);
            return false;
          }
        },
        clearJWTTokens: () => {
          try {
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          } catch (error) {
            console.error("Failed to clear JWT tokens:", error);
          }
        },
        validatePasswordResetToken: (token: string) => {
          try {
            const resetData = localStorage.getItem(
              STORAGE_KEYS.PASSWORD_RESET_TOKEN
            );
            if (!resetData) return false;
            const parsedData = JSON.parse(resetData);
            return (
              parsedData.token === token &&
              Date.now() <= parsedData.expiresAt &&
              !parsedData.used
            );
          } catch (error) {
            console.error("Failed to validate password reset token:", error);
            return false;
          }
        },
        acceptTermsAndPrivacy: () => {
          try {
            const acceptance = {
              accepted: true,
              acceptedAt: new Date().toISOString(),
              version: "1.0",
            };
            localStorage.setItem(
              STORAGE_KEYS.TERMS_ACCEPTED,
              JSON.stringify(acceptance)
            );
          } catch (error) {
            console.error("Failed to store terms acceptance:", error);
          }
        },
        requestLocationPermission: async () => {
          try {
            if (!navigator.geolocation) {
              throw new Error("Geolocation is not supported by this browser");
            }
            return new Promise((resolve) => {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const coordinates = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  };
                  const permissionState = {
                    granted: true,
                    requested: true,
                    coordinates,
                    requestedAt: new Date().toISOString(),
                  };
                  localStorage.setItem(
                    STORAGE_KEYS.LOCATION_PERMISSION_GRANTED,
                    JSON.stringify(permissionState)
                  );
                  get().setLocationPermissionState(true, coordinates);
                  resolve(true);
                },
                (error) => {
                  console.error("Location permission denied:", error);
                  const permissionState = {
                    granted: false,
                    requested: true,
                    requestedAt: new Date().toISOString(),
                    error: error.message,
                  };
                  localStorage.setItem(
                    STORAGE_KEYS.LOCATION_PERMISSION_GRANTED,
                    JSON.stringify(permissionState)
                  );
                  get().setLocationPermissionState(false);
                  resolve(false);
                },
                {
                  enableHighAccuracy: true,
                  timeout: 10000,
                  maximumAge: 300000,
                }
              );
            });
          } catch (error) {
            console.error("Failed to request location permission:", error);
            return false;
          }
        },
        setLocationPermissionState: (
          granted: boolean,
          coordinates?: { lat: number; lng: number }
        ) => {
          set({ currentLocation: coordinates || null });
        },
        updateUserStats: async (stats) => {
          try {
            const currentUser = get().user;
            if (!currentUser) throw new Error("No user found");
            const updatedStats = { ...currentUser.stats, ...stats };
            const updatedUser = { ...currentUser, stats: updatedStats };
            const newTrustScore = calculateUserTrustScore(updatedUser);
            updatedUser.trustScore = newTrustScore;
            const updatedBadges = checkAndAwardBadges(updatedUser);
            updatedUser.badges = updatedBadges;
            set({ user: updatedUser });
          } catch (error) {
            console.error("Failed to update user stats:", error);
          }
        },
        awardBadge: async (badgeType) => {
          try {
            const currentUser = get().user;
            if (!currentUser) throw new Error("No user found");
            const config = BADGE_CONFIGS[badgeType];
            const newBadge: UserBadge = {
              id:
                "badge_" +
                Date.now() +
                "_" +
                Math.random().toString(36).substr(2, 9),
              type: badgeType,
              name: config.name,
              description: config.description,
              iconUrl: config.iconUrl,
              earnedAt: new Date(),
            };
            const updatedBadges = [...(currentUser.badges || []), newBadge];
            const updatedUser = { ...currentUser, badges: updatedBadges };
            set({ user: updatedUser });
          } catch (error) {
            console.error("Failed to award badge:", error);
          }
        },
        calculateAndUpdateTrustScore: async () => {
          try {
            const currentUser = get().user;
            if (!currentUser) throw new Error("No user found");
            const newTrustScore = calculateUserTrustScore(currentUser);
            const updatedUser = { ...currentUser, trustScore: newTrustScore };
            const updatedBadges = checkAndAwardBadges(updatedUser);
            updatedUser.badges = updatedBadges;
            set({ user: updatedUser });
          } catch (error) {
            console.error("Failed to calculate trust score:", error);
          }
        },
        calculateEnvironmentalImpact: async () => {
          try {
            set({ isLoadingEnvironmentalImpact: true });
            const { user, users } = get();
            if (!user) throw new Error("No user found");
            const allItems = users.flatMap((u) => u.items);
            const {
              calculateUserCarbonSavings,
              calculateCommunityCarbonSavings,
              calculateEnvironmentalScore,
              getEnvironmentalBadgeProgress,
              getUserEnvironmentalImpact,
              generateEnvironmentalLeaderboard,
              checkEnvironmentalBadgeEligibility,
            } = await import("@/utils/environmentalHelpers");
            const userCarbonSaved = calculateUserCarbonSavings(user, allItems);
            const communityCarbonSaved =
              calculateCommunityCarbonSavings(allItems);
            const userEnvironmentalScore = calculateEnvironmentalScore(
              user,
              allItems
            );
            const environmentalBadgeProgress = getEnvironmentalBadgeProgress(
              user,
              allItems
            );
            const userImpact = getUserEnvironmentalImpact(user, allItems);
            const topContributors = generateEnvironmentalLeaderboard(
              users,
              allItems,
              10
            );
            const badgeEligibility = checkEnvironmentalBadgeEligibility(
              user,
              allItems
            );
            if (badgeEligibility.eligible) {
              await get().awardBadge(BadgeType.ECO_WARRIOR);
            }
            const environmentalImpact = {
              userCarbonSaved,
              communityCarbonSaved,
              userEnvironmentalScore,
              environmentalBadgeProgress,
              categoryBreakdown: userImpact.categoryBreakdown,
              topContributors,
            };
            set({
              environmentalImpact,
              isLoadingEnvironmentalImpact: false,
            });
          } catch (error) {
            console.error("Failed to calculate environmental impact:", error);
            set({ isLoadingEnvironmentalImpact: false });
          }
        },
        updateItemCarbonSavings: async (
          itemId: string,
          carbonSaved: number
        ) => {
          try {
            const { user, users } = get();
            if (!user) throw new Error("User not authenticated");
            const updatedUser = {
              ...user,
              items: user.items.map((item) =>
                item.id === itemId ? { ...item, carbonSaved } : item
              ),
            };
            const updatedUsers = users.map((u) =>
              u.id === user.id ? updatedUser : u
            );
            set({
              user: updatedUser,
              users: updatedUsers,
            });
            await get().calculateEnvironmentalImpact();
          } catch (error) {
            console.error("Failed to update item carbon savings:", error);
          }
        },
        getEnvironmentalLeaderboard: async (limit = 10) => {
          const { user, users } = get();
          if (!user) return [];
          const allItems = users.flatMap((u) => u.items);
          const { generateEnvironmentalLeaderboard } = await import(
            "@/utils/environmentalHelpers"
          );
          return generateEnvironmentalLeaderboard(users, allItems, limit);
        },
        shareEnvironmentalImpact: async () => {
          try {
            const { user, users } = get();
            if (!user) throw new Error("No user found");
            const allItems = users.flatMap((u) => u.items);
            const { generateEnvironmentalShareData } = await import(
              "@/utils/environmentalHelpers"
            );
            const shareData = generateEnvironmentalShareData(user, allItems);
            return {
              username: shareData.username,
              totalCarbonSaved: shareData.totalCarbonSaved,
              carbonFormatted: shareData.carbonFormatted,
              primaryComparison: shareData.primaryComparison,
              badgeAchieved: shareData.badgeAchieved,
              shareText: shareData.shareText,
            };
          } catch (error) {
            console.error("Failed to generate share data:", error);
            throw error;
          }
        },
        archiveConversation: async (swapRequestId) => {
          try {
            set((state) => ({
              conversationMetadata: {
                ...state.conversationMetadata,
                [swapRequestId]: {
                  ...state.conversationMetadata[swapRequestId],
                  isArchived: true,
                },
              },
            }));
          } catch (error) {
            console.error("Failed to archive conversation:", error);
          }
        },
        unarchiveConversation: async (swapRequestId) => {
          try {
            set((state) => ({
              conversationMetadata: {
                ...state.conversationMetadata,
                [swapRequestId]: {
                  ...state.conversationMetadata[swapRequestId],
                  isArchived: false,
                },
              },
            }));
          } catch (error) {
            console.error("Failed to unarchive conversation:", error);
          }
        },
        deleteConversation: async (swapRequestId) => {
          try {
            set((state) => {
              const {
                [swapRequestId]: removedConversation,
                ...restConversations
              } = state.conversations;
              const { [swapRequestId]: removedMetadata, ...restMetadata } =
                state.conversationMetadata;
              return {
                conversations: restConversations,
                conversationMetadata: restMetadata,
              };
            });
          } catch (error) {
            console.error("Failed to delete conversation:", error);
          }
        },
        pinConversation: async (swapRequestId) => {
          try {
            set((state) => ({
              conversationMetadata: {
                ...state.conversationMetadata,
                [swapRequestId]: {
                  ...state.conversationMetadata[swapRequestId],
                  isPinned: true,
                },
              },
            }));
          } catch (error) {
            console.error("Failed to pin conversation:", error);
          }
        },
        unpinConversation: async (swapRequestId) => {
          try {
            set((state) => ({
              conversationMetadata: {
                ...state.conversationMetadata,
                [swapRequestId]: {
                  ...state.conversationMetadata[swapRequestId],
                  isPinned: false,
                },
              },
            }));
          } catch (error) {
            console.error("Failed to unpin conversation:", error);
          }
        },
        markConversationAsRead: async (swapRequestId) => {
          try {
            set((state) => ({
              conversationMetadata: {
                ...state.conversationMetadata,
                [swapRequestId]: {
                  ...state.conversationMetadata[swapRequestId],
                  unreadCount: 0,
                  lastMessageTime: new Date(),
                },
              },
            }));
          } catch (error) {
            console.error("Failed to mark conversation as read:", error);
          }
        },
        getConversationMetadata: (swapRequestId) => {
          const state = get();
          return state.conversationMetadata[swapRequestId] || null;
        },
        fetchUsers: async () => {
          try {
            set({ isLoading: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            set({ users: allUsers, isLoading: false });
          } catch (error) {
            set({
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch users",
            });
          }
        },
        getUserById: (userId: string) => {
          const state = get();
          return state.users.find((user) => user.id === userId);
        },
        updateUserRole: async (userId: string, newRole: UserRole) => {
          try {
            set({ isLoading: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            set((state) => ({
              users: state.users.map((user) =>
                user.id === userId ? { ...user, role: newRole } : user
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to update user role",
            });
          }
        },
        updateUserStatus: async (userId: string, newStatus: AccountStatus) => {
          try {
            set({ isLoading: true, error: null });
            await new Promise((resolve) => setTimeout(resolve, 600));
            set((state) => ({
              users: state.users.map((user) =>
                user.id === userId
                  ? {
                      ...user,
                      security: { ...user.security, accountStatus: newStatus },
                    }
                  : user
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to update user status",
            });
          }
        },
        metrics: mockDashboardMetrics,
        pendingItems: [],
        recentUsers: [],
        adminLoading: false,
        loadAdminDashboard: async () => {
          set({ adminLoading: true });
          try {
            const state = get();
            const allItems = state.getAllItems();
            const users = state.users;
            const metrics = generateDashboardMetrics(users, allItems);
            const pendingItems = allItems.filter(
              (item) => item.status === ItemStatus.PENDING
            );
            const recentUsers = users
              .sort((a, b) => b.joinedAt.getTime() - a.joinedAt.getTime())
              .slice(0, 5);
            set({
              metrics,
              pendingItems,
              recentUsers,
              adminLoading: false,
            });
          } catch (error) {
            set({ adminLoading: false });
            console.error("Error loading admin dashboard:", error);
          }
        },
        handleItemAction: async (
          itemId: string,
          action: "approve" | "reject"
        ) => {
          set({ adminLoading: true });
          try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const { user, users } = get();
            if (!user) throw new Error("User not authenticated");
            const itemOwner = users.find((u) =>
              u.items.some((item) => item.id === itemId)
            );
            if (!itemOwner) throw new Error("Item owner not found");
            const updatedOwner = {
              ...itemOwner,
              items: itemOwner.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      status:
                        action === "approve"
                          ? ItemStatus.AVAILABLE
                          : ItemStatus.REJECTED,
                    }
                  : item
              ),
            };
            const updatedUsers = users.map((u) =>
              u.id === itemOwner.id ? updatedOwner : u
            );
            set({
              users: updatedUsers,
              user: user.id === itemOwner.id ? updatedOwner : user,
              pendingItems: get().pendingItems.filter(
                (item) => item.id !== itemId
              ),
              adminLoading: false,
            });
          } catch (error) {
            set({ adminLoading: false });
            console.error("Error handling item action:", error);
          }
        },
        handleUserAction: async (
          userId: string,
          action: "warn" | "suspend"
        ) => {
          set({ adminLoading: true });
          try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const users = get().users;
            const updatedUsers = users.map((user) =>
              user.id === userId
                ? {
                    ...user,
                    status:
                      action === "suspend"
                        ? AccountStatus.SUSPENDED
                        : AccountStatus.ACTIVE,
                    warnings:
                      action === "warn"
                        ? (user.warnings || 0) + 1
                        : user.warnings,
                  }
                : user
            );
            set({
              users: updatedUsers,
              recentUsers: updatedUsers.slice(0, 5),
              adminLoading: false,
            });
          } catch (error) {
            set({ adminLoading: false });
            console.error("Error handling user action:", error);
          }
        },
      }),
      {
        name: STORAGE_KEYS.STORE,
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          theme: state.theme,
        }),
      }
    )
  )
);
export const useStore = useLoopItStore;
export type { LoopItStore };

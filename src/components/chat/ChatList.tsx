"use client";
import {
  AccountStatus,
  SubscriptionTier,
  SwapRequest,
  SwapRequestStatus,
  UserProfile,
  UserRole,
} from "@/shared/types";
import { useLoopItStore } from "@/store";
import Badge, { BadgeVariant } from "@/tailwind/components/elements/Badge";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import LoadingSpinner from "@/tailwind/components/elements/LoadingSpinner";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Input from "@/tailwind/components/forms/Input";
import Alert, { AlertVariant } from "@/tailwind/components/layout/Alert";
import Container from "@/tailwind/components/layout/Container";
import {
  faArchive,
  faEllipsisVertical,
  faEnvelope,
  faSearch,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
export interface ChatListProps {
  className?: string;
}
interface ChatListItem {
  swapRequest: SwapRequest;
  otherUser: UserProfile;
  lastMessage?: {
    content: string;
    timestamp: Date;
    isFromCurrentUser: boolean;
  };
  unreadCount: number;
  isArchived: boolean;
  isPinned: boolean;
}
type FilterType = "all" | "unread" | "pinned" | "archived";
interface ConfirmationDialog {
  isOpen: boolean;
  type: "delete" | "deleteSelected" | null;
  title: string;
  message: string;
  onConfirm: () => void;
}
const ChatList: React.FC<ChatListProps> = ({ className = "" }) => {
  const router = useRouter();
  const {
    user: currentUser,
    swapRequests,
    conversations,
    conversationMetadata,
    isLoadingMessages,
    isAuthenticated,
    archiveConversation,
    deleteConversation,
    pinConversation,
    unpinConversation,
  } = useLoopItStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [confirmationDialog, setConfirmationDialog] =
    useState<ConfirmationDialog>({
      isOpen: false,
      type: null,
      title: "",
      message: "",
      onConfirm: () => {},
    });
  const showConfirmation = useCallback(
    (
      type: "delete" | "deleteSelected",
      title: string,
      message: string,
      onConfirm: () => void
    ) => {
      setConfirmationDialog({
        isOpen: true,
        type,
        title,
        message,
        onConfirm,
      });
    },
    []
  );
  const hideConfirmation = useCallback(() => {
    setConfirmationDialog({
      isOpen: false,
      type: null,
      title: "",
      message: "",
      onConfirm: () => {},
    });
  }, []);
  const chatListItems = useMemo(() => {
    if (!currentUser) return [];
    const userSwapRequests = swapRequests.filter(
      (req) =>
        req.fromUserId === currentUser.id || req.toUserId === currentUser.id
    );
    return userSwapRequests.map((swapRequest): ChatListItem => {
      const otherUserId =
        swapRequest.fromUserId === currentUser.id
          ? swapRequest.toUserId
          : swapRequest.fromUserId;
      const otherUser: UserProfile = {
        id: otherUserId,
        name: `User ${otherUserId}`,
        email: `${otherUserId}@loopit.gm`,
        avatar: `https://i.pravatar.cc/150?img=11`,
        location: "Banjul",
        role: UserRole.USER,
        trustScore: 4.5,
        totalSwaps: 10,
        joinedAt: new Date(),
        isActive: true,
        preferences: {
          notifications: true,
          publicProfile: true,
          showLocation: true,
          autoAcceptTrustedUsers: false,
          emailNotifications: true,
        },
        stats: {
          itemsListed: 3,
          successfulSwaps: 5,
          rating: 4.2,
          reviewCount: 8,
          helpfulVotes: 12,
          eventsAttended: 2,
        },
        environmentalStats: {
          totalCarbonSaved: 0,
          totalWaterSaved: 0,
          totalLandfillSaved: 0,
          ecoWarriorLevel: "Beginner",
          badges: [],
        },
        badges: [],
        items: [],
        subscription: {
          tier: SubscriptionTier.FREE,
          isActive: true,
          startDate: new Date(),
          features: [],
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
        password: "",
        confirmPassword: "",
        agreedToTerms: true,
      };
      const messages = conversations[swapRequest.id] || [];
      const lastMessage = messages[messages.length - 1];
      const metadata = conversationMetadata[swapRequest.id] || {
        isArchived: false,
        isPinned: false,
        unreadCount: 0,
        lastMessageTime: null,
      };
      return {
        swapRequest,
        otherUser,
        lastMessage: lastMessage
          ? {
              content: lastMessage.message,
              timestamp: lastMessage.timestamp,
              isFromCurrentUser: lastMessage.senderId === currentUser.id,
            }
          : undefined,
        unreadCount: metadata.unreadCount,
        isArchived: metadata.isArchived,
        isPinned: metadata.isPinned,
      };
    });
  }, [currentUser, swapRequests, conversations, conversationMetadata]);
  const filteredChats = useMemo(() => {
    let filtered = chatListItems;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (chat) =>
          chat.otherUser.name.toLowerCase().includes(query) ||
          chat.lastMessage?.content.toLowerCase().includes(query) ||
          chat.swapRequest.itemId.toLowerCase().includes(query)
      );
    }
    switch (activeFilter) {
      case "unread":
        filtered = filtered.filter((chat) => chat.unreadCount > 0);
        break;
      case "pinned":
        filtered = filtered.filter((chat) => chat.isPinned);
        break;
      case "archived":
        filtered = filtered.filter((chat) => chat.isArchived);
        break;
      default:
        filtered = filtered.filter((chat) => !chat.isArchived);
    }
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const aTime = a.lastMessage?.timestamp || a.swapRequest.createdAt;
      const bTime = b.lastMessage?.timestamp || b.swapRequest.createdAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
  }, [chatListItems, searchQuery, activeFilter]);
  const handleChatClick = useCallback(
    (swapRequestId: string) => {
      router.push(`/chat/${swapRequestId}`);
    },
    [router]
  );
  const handleSelectAll = useCallback(() => {
    if (selectedChats.size === filteredChats.length) {
      setSelectedChats(new Set());
    } else {
      setSelectedChats(
        new Set(filteredChats.map((chat) => chat.swapRequest.id))
      );
    }
  }, [selectedChats.size, filteredChats]);
  const handleArchiveSelected = useCallback(async () => {
    for (const chatId of selectedChats) {
      try {
        await archiveConversation(chatId);
      } catch (error) {
        console.error("Failed to archive conversation:", error);
      }
    }
    setSelectedChats(new Set());
  }, [selectedChats, archiveConversation]);
  const handleDeleteSelected = useCallback(async () => {
    for (const chatId of selectedChats) {
      try {
        await deleteConversation(chatId);
      } catch (error) {
        console.error("Failed to delete conversation:", error);
      }
    }
    setSelectedChats(new Set());
    hideConfirmation();
  }, [selectedChats, deleteConversation, hideConfirmation]);
  const handleDeleteSingle = useCallback(
    async (chatId: string) => {
      try {
        await deleteConversation(chatId);
        setShowActionMenu(null);
        hideConfirmation();
      } catch (error) {
        console.error("Failed to delete conversation:", error);
      }
    },
    [deleteConversation, hideConfirmation]
  );
  const formatTime = useCallback((date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
    }).format(new Date(date));
  }, []);
  const getStatusBadge = useCallback((status: SwapRequestStatus) => {
    switch (status) {
      case SwapRequestStatus.PENDING:
        return <Badge variant={BadgeVariant.WARNING}>Pending</Badge>;
      case SwapRequestStatus.ACCEPTED:
        return <Badge variant={BadgeVariant.SUCCESS}>Accepted</Badge>;
      case SwapRequestStatus.REJECTED:
        return <Badge variant={BadgeVariant.DESTRUCTIVE}>Rejected</Badge>;
      case SwapRequestStatus.COMPLETED:
        return <Badge variant={BadgeVariant.SUCCESS}>Completed</Badge>;
      case SwapRequestStatus.CANCELLED:
        return <Badge variant={BadgeVariant.SECONDARY}>Cancelled</Badge>;
      default:
        return null;
    }
  }, []);
  if (!isAuthenticated || !currentUser) {
    return (
      <Container className="py-8">
        <Alert
          variant={AlertVariant.ERROR}
          message="You must be logged in to view messages."
        />
      </Container>
    );
  }
  return (
    <>
      <div className={clsx("h-full flex flex-col bg-background", className)}>
        {/* Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <Typography
              as={TypographyVariant.H2}
              className="text-xl font-semibold"
            >
              Messages
            </Typography>
            {selectedChats.size > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant={ButtonVariant.GHOST}
                  size={ButtonSize.SM}
                  onClick={handleArchiveSelected}
                  className="text-text-muted hover:text-primary"
                >
                  <FontAwesomeIcon icon={faArchive} className="w-4 h-4" />
                </Button>
                <Button
                  variant={ButtonVariant.GHOST}
                  size={ButtonSize.SM}
                  onClick={() =>
                    showConfirmation(
                      "deleteSelected",
                      "Delete Conversations",
                      `Are you sure you want to delete ${selectedChats.size} conversation(s)? This action cannot be undone.`,
                      handleDeleteSelected
                    )
                  }
                  className="text-text-muted hover:text-destructive"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <FontAwesomeIcon
              icon={faSearch}
              className={clsx(
                "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors",
                isSearchFocused ? "text-primary" : "text-text-muted"
              )}
            />
            <Input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {[
              { key: "all", label: "All" },
              { key: "unread", label: "Unread" },
              { key: "pinned", label: "Pinned" },
              { key: "archived", label: "Archived" },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as FilterType)}
                className={clsx(
                  "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  activeFilter === filter.key
                    ? "bg-background text-primary shadow-sm"
                    : "text-text-muted hover:text-text-primary"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="w-16 h-16 text-text-muted mb-4"
              />
              <Typography as={TypographyVariant.H3} className="mb-2">
                {searchQuery || activeFilter !== "all"
                  ? "No messages found"
                  : "No conversations yet"}
              </Typography>
              <Typography as={TypographyVariant.P} className="text-text-muted">
                {searchQuery || activeFilter !== "all"
                  ? "Try adjusting your search or filter"
                  : "Start a conversation by making a swap request"}
              </Typography>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredChats.map((chat) => (
                <div
                  key={chat.swapRequest.id}
                  className={clsx(
                    "relative p-4 hover:bg-muted/50 cursor-pointer transition-colors",
                    chat.unreadCount > 0 && "bg-primary/5",
                    selectedChats.has(chat.swapRequest.id) && "bg-primary/10"
                  )}
                  onClick={() => handleChatClick(chat.swapRequest.id)}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedChats.has(chat.swapRequest.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        const newSelected = new Set(selectedChats);
                        if (e.target.checked) {
                          newSelected.add(chat.swapRequest.id);
                        } else {
                          newSelected.delete(chat.swapRequest.id);
                        }
                        setSelectedChats(newSelected);
                      }}
                      className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    />

                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="w-6 h-6 text-primary"
                        />
                      </div>
                      {chat.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                          {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <Typography
                          as={TypographyVariant.P}
                          className="font-medium text-text-primary truncate"
                        >
                          {chat.otherUser.name}
                        </Typography>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(chat.swapRequest.status)}
                          {chat.lastMessage && (
                            <Typography
                              as={TypographyVariant.SMALL}
                              className="text-xs text-text-muted"
                            >
                              {formatTime(chat.lastMessage.timestamp)}
                            </Typography>
                          )}
                        </div>
                      </div>
                      {}
                      {chat.lastMessage ? (
                        <Typography
                          as={TypographyVariant.P}
                          className={clsx(
                            "text-sm truncate",
                            chat.unreadCount > 0
                              ? "text-text-primary font-medium"
                              : "text-text-muted"
                          )}
                        >
                          {chat.lastMessage.isFromCurrentUser ? "You: " : ""}
                          {chat.lastMessage.content}
                        </Typography>
                      ) : (
                        <Typography
                          as={TypographyVariant.P}
                          className="text-sm text-text-muted italic"
                        >
                          No messages yet
                        </Typography>
                      )}
                      {}
                      <Typography
                        as={TypographyVariant.SMALL}
                        className="text-xs text-text-muted mt-1"
                      >
                        Swap Request: {chat.swapRequest.itemId}
                      </Typography>
                    </div>
                    {}
                    <Button
                      variant={ButtonVariant.GHOST}
                      size={ButtonSize.SM}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActionMenu(
                          showActionMenu === chat.swapRequest.id
                            ? null
                            : chat.swapRequest.id
                        );
                      }}
                      className="flex-shrink-0 text-text-muted hover:text-primary"
                    >
                      <FontAwesomeIcon
                        icon={faEllipsisVertical}
                        className="w-4 h-4"
                      />
                    </Button>
                  </div>
                  {}
                  {showActionMenu === chat.swapRequest.id && (
                    <div className="absolute right-4 top-16 bg-card border border-border rounded-lg shadow-lg py-1 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (chat.isPinned) {
                            unpinConversation(chat.swapRequest.id);
                          } else {
                            pinConversation(chat.swapRequest.id);
                          }
                          setShowActionMenu(null);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-muted"
                      >
                        {chat.isPinned ? "Unpin" : "Pin"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          archiveConversation(chat.swapRequest.id);
                          setShowActionMenu(null);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-muted"
                      >
                        Archive
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          showConfirmation(
                            "delete",
                            "Delete Conversation",
                            "Are you sure you want to delete this conversation? This action cannot be undone.",
                            () => handleDeleteSingle(chat.swapRequest.id)
                          );
                          setShowActionMenu(null);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-muted"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {}
        {selectedChats.size > 0 && (
          <div className="p-4 border-t border-border bg-card">
            <div className="flex items-center justify-between">
              <Typography
                as={TypographyVariant.P}
                className="text-sm text-text-muted"
              >
                {selectedChats.size} conversation
                {selectedChats.size !== 1 ? "s" : ""} selected
              </Typography>
              <div className="flex gap-2">
                <Button
                  variant={ButtonVariant.GHOST}
                  size={ButtonSize.SM}
                  onClick={handleSelectAll}
                >
                  {selectedChats.size === filteredChats.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
                <Button
                  variant={ButtonVariant.GHOST}
                  size={ButtonSize.SM}
                  onClick={() => setSelectedChats(new Set())}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {}
      {confirmationDialog.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg shadow-xl max-w-md w-full">
            <Alert
              variant={AlertVariant.WARNING}
              title={confirmationDialog.title}
              message={confirmationDialog.message}
              showConfirmButton
              confirmButtonText="Delete"
              cancelButtonText="Cancel"
              onConfirm={confirmationDialog.onConfirm}
              onDismiss={hideConfirmation}
              isDismissible={false}
              showIcon
            />
          </div>
        </div>
      )}
    </>
  );
};
ChatList.displayName = "ChatList";
export default ChatList;

"use client";
import { SwapRequest, SwapRequestStatus, UserProfile } from "@/shared/types";
import Avatar, { AvatarSize } from "@/tailwind/components/elements/Avatar";
import Badge, { BadgeVariant } from "@/tailwind/components/elements/Badge";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import {
  faArrowLeft,
  faInfoCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React from "react";
export interface ChatHeaderProps {
  swapRequest: SwapRequest;
  otherUser: UserProfile;
  currentUser: UserProfile;
  onBack?: () => void;
  onViewSwapDetails?: () => void;
  isOnline?: boolean;
  lastSeen?: Date;
  connectionStatus?: "connected" | "connecting" | "disconnected" | "error";
  enableEncryption?: boolean;
  className?: string;
}
const ChatHeader: React.FC<ChatHeaderProps> = React.memo(
  ({
    swapRequest,
    otherUser,
    currentUser,
    onBack,
    onViewSwapDetails,
    isOnline = false,
    lastSeen,
    connectionStatus,
    enableEncryption,
    className = "",
  }) => {
    const getStatusBadge = (status: SwapRequestStatus) => {
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
          return <Badge variant={BadgeVariant.SECONDARY}>{status}</Badge>;
      }
    };
    const formatLastSeen = (date: Date) => {
      const now = new Date();
      const diff = now.getTime() - new Date(date).getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (minutes < 1) return "Just now";
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
      }).format(new Date(date));
    };
    const isFromCurrentUser = swapRequest.fromUserId === currentUser.id;
    return (
      <div
        className={clsx(
          "bg-card border-b border-border p-4",
          "flex items-center gap-3",
          className
        )}
      >
        {onBack && (
          <Button
            variant={ButtonVariant.GHOST}
            size={ButtonSize.SM}
            onClick={onBack}
            className="lg:hidden flex-shrink-0"
            aria-label="Go back"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          </Button>
        )}

        <div className="relative flex-shrink-0">
          <Avatar
            src={otherUser.avatar}
            alt={otherUser.name}
            initials={otherUser.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
            size={AvatarSize.MD}
          />

          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-card" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Typography
              as={TypographyVariant.H4}
              className="font-semibold text-text-primary truncate"
            >
              {otherUser.name}
            </Typography>
            {getStatusBadge(swapRequest.status)}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <FontAwesomeIcon
                icon={faUser}
                className="w-3 h-3 text-text-muted"
              />
              <Typography
                as={TypographyVariant.SMALL}
                className={clsx(
                  "text-xs",
                  isOnline ? "text-success" : "text-text-muted"
                )}
              >
                {isOnline
                  ? "Online"
                  : lastSeen
                  ? formatLastSeen(lastSeen)
                  : "Offline"}
              </Typography>
            </div>

            <Typography
              as={TypographyVariant.SMALL}
              className="text-xs text-text-muted"
            >
              {isFromCurrentUser ? "Your request" : "Their request"}
            </Typography>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {onViewSwapDetails && (
            <Button
              variant={ButtonVariant.GHOST}
              size={ButtonSize.SM}
              onClick={onViewSwapDetails}
              className="text-text-muted hover:text-primary"
              aria-label="View swap details"
            >
              <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }
);
ChatHeader.displayName = "ChatHeader";
export default ChatHeader;

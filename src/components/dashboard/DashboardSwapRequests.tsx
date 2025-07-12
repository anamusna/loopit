"use client";
import { SwapRequest, SwapRequestStatus } from "@/shared/types";
import { useLoopItStore } from "@/store";
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
  faArrowRight,
  faCalendar,
  faExchangeAlt,
  faInbox,
  faPaperPlane,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React from "react";
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
const RequestCard: React.FC<{
  request: SwapRequest;
  type: "incoming" | "outgoing";
  onView: (id: string) => void;
  onChat: (id: string) => void;
}> = ({ request, type, onView, onChat }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };
  return (
    <div className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
          <FontAwesomeIcon
            icon={type === "incoming" ? faInbox : faPaperPlane}
            className="w-3 h-3 sm:w-4 sm:h-4 text-text-muted"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
          <div className="flex items-start justify-between gap-2">
            <Typography
              as={TypographyVariant.H4}
              className="text-sm sm:text-base font-semibold text-text-primary truncate"
            >
              {type === "incoming" ? "Incoming Request" : "Outgoing Request"}
            </Typography>
            {getStatusBadge(request.status)}
          </div>

          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faUser}
              className="w-3 h-3 text-text-muted flex-shrink-0"
            />
            <Typography
              as={TypographyVariant.SMALL}
              className="text-xs sm:text-sm text-text-muted truncate"
            >
              {type === "incoming" ? "From:" : "To:"}{" "}
              {type === "incoming" ? request.fromUserId : request.toUserId}
            </Typography>
          </div>

          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faCalendar}
              className="w-3 h-3 text-text-muted flex-shrink-0"
            />
            <Typography
              as={TypographyVariant.SMALL}
              className="text-xs sm:text-sm text-text-muted"
            >
              {formatDate(request.createdAt)}
            </Typography>
          </div>

          {request.message && (
            <div className="bg-secondary/10 rounded-lg p-2 sm:p-3">
              <Typography
                as={TypographyVariant.SMALL}
                className="text-xs sm:text-sm text-text-secondary italic line-clamp-2"
              >
                &ldquo;{request.message}&rdquo;
              </Typography>
            </div>
          )}

          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 pt-1">
            <Button
              variant={ButtonVariant.OUTLINE}
              size={ButtonSize.SM}
              onClick={() => onView(request.id)}
              className="flex-1 text-xs sm:text-sm font-medium min-h-[36px] sm:min-h-[40px]"
            >
              View Details
            </Button>
            <Button
              variant={ButtonVariant.GHOST}
              size={ButtonSize.SM}
              onClick={() => onChat(request.id)}
              className="flex-1 text-xs sm:text-sm font-medium min-h-[36px] sm:min-h-[40px] hover:text-primary"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="w-3 h-3 mr-1.5" />
              Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export const DashboardSwapRequests: React.FC = () => {
  const router = useRouter();
  const { sentRequests, receivedRequests, isLoadingRequests } =
    useLoopItStore();
  const handleViewRequest = (requestId: string) => {
    console.log("View request:", requestId);
  };
  const handleChat = (requestId: string) => {
    router.push(`/chat/${requestId}`);
  };
  const handleViewAllRequests = () => {
    router.push("/requests");
  };
  const totalRequests = sentRequests.length + receivedRequests.length;
  const pendingIncoming = receivedRequests.filter(
    (r) => r.status === SwapRequestStatus.PENDING
  ).length;
  const pendingOutgoing = sentRequests.filter(
    (r) => r.status === SwapRequestStatus.PENDING
  ).length;
  if (isLoadingRequests) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4">
          <div className="space-y-2">
            <div className="h-5 sm:h-6 bg-secondary/30 rounded w-48 animate-pulse" />
            <div className="h-4 bg-secondary/30 rounded w-32 animate-pulse" />
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-4 animate-pulse"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary/30 rounded-lg" />
                <div className="flex-1 space-y-2 sm:space-y-3">
                  <div className="h-4 sm:h-5 bg-secondary/30 rounded w-3/4" />
                  <div className="h-3 sm:h-4 bg-secondary/30 rounded w-1/2" />
                  <div className="h-3 sm:h-4 bg-secondary/30 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (totalRequests === 0) {
    return (
      <div className="text-center py-8 sm:py-12 lg:py-16 px-4">
        <div className="max-w-sm mx-auto space-y-4 sm:space-y-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-secondary/20 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={faExchangeAlt}
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-text-muted"
            />
          </div>

          <div className="space-y-2 sm:space-y-3">
            <Typography
              as={TypographyVariant.H3}
              className="text-lg sm:text-xl lg:text-2xl font-bold text-text-primary"
            >
              No Swap Requests
            </Typography>
            <Typography
              as={TypographyVariant.P}
              className="text-sm sm:text-base text-text-muted leading-relaxed"
            >
              Start browsing items to send your first swap request
            </Typography>
          </div>

          <Button
            variant={ButtonVariant.PRIMARY}
            size={ButtonSize.MD}
            onClick={() => router.push("/items")}
            className="w-full sm:w-auto sm:min-w-[180px] min-h-[44px] sm:min-h-[48px] font-medium"
          >
            <FontAwesomeIcon
              icon={faExchangeAlt}
              className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
            />
            Browse Items
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
          <Typography
            as={TypographyVariant.H4}
            className="text-lg sm:text-xl lg:text-2xl font-bold text-primary"
          >
            {receivedRequests.length}
          </Typography>
          <Typography
            as={TypographyVariant.SMALL}
            className="text-xs sm:text-sm text-text-muted"
          >
            Incoming
          </Typography>
        </div>
        <div className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
          <Typography
            as={TypographyVariant.H4}
            className="text-lg sm:text-xl lg:text-2xl font-bold text-accent"
          >
            {sentRequests.length}
          </Typography>
          <Typography
            as={TypographyVariant.SMALL}
            className="text-xs sm:text-sm text-text-muted"
          >
            Outgoing
          </Typography>
        </div>
        <div className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-4 text-center col-span-2 sm:col-span-1">
          <Typography
            as={TypographyVariant.H4}
            className="text-lg sm:text-xl lg:text-2xl font-bold text-warning"
          >
            {pendingIncoming + pendingOutgoing}
          </Typography>
          <Typography
            as={TypographyVariant.SMALL}
            className="text-xs sm:text-sm text-text-muted"
          >
            Pending
          </Typography>
        </div>

        <div className="hidden lg:flex bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-4 items-center justify-center">
          <Button
            variant={ButtonVariant.GHOST}
            size={ButtonSize.SM}
            onClick={handleViewAllRequests}
            className="text-xs font-medium text-text-muted hover:text-primary"
          >
            View Stats
          </Button>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {receivedRequests.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <Typography
                as={TypographyVariant.H4}
                className="text-sm sm:text-base font-semibold text-text-primary flex items-center gap-2"
              >
                <FontAwesomeIcon
                  icon={faInbox}
                  className="w-4 h-4 text-primary"
                />
                Incoming ({receivedRequests.length})
                {pendingIncoming > 0 && (
                  <Badge variant={BadgeVariant.WARNING} className="text-xs">
                    {pendingIncoming} pending
                  </Badge>
                )}
              </Typography>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {receivedRequests.slice(0, 3).map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  type="incoming"
                  onView={handleViewRequest}
                  onChat={handleChat}
                />
              ))}
            </div>
          </div>
        )}

        {sentRequests.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <Typography
                as={TypographyVariant.H4}
                className="text-sm sm:text-base font-semibold text-text-primary flex items-center gap-2"
              >
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  className="w-4 h-4 text-accent"
                />
                Outgoing ({sentRequests.length})
                {pendingOutgoing > 0 && (
                  <Badge variant={BadgeVariant.WARNING} className="text-xs">
                    {pendingOutgoing} pending
                  </Badge>
                )}
              </Typography>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {sentRequests.slice(0, 3).map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  type="outgoing"
                  onView={handleViewRequest}
                  onChat={handleChat}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {totalRequests > 6 && (
        <div className="text-center pt-2 sm:pt-4 border-t border-border">
          <Button
            variant={ButtonVariant.GHOST}
            onClick={handleViewAllRequests}
            className="text-sm sm:text-base font-medium text-primary hover:text-primary-hover transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 mr-2" />
            View All {totalRequests} Requests
          </Button>
        </div>
      )}
    </div>
  );
};

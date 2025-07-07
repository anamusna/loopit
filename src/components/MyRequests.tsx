"use client";
import { SwapRequest, SwapRequestStatus } from "@/shared/types";
import { useLoopItStore } from "@/store";
import Badge, { BadgeVariant } from "@/tailwind/components/elements/Badge";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import Tabs, { TabItem } from "@/tailwind/components/elements/Tabs";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Alert, { AlertVariant } from "@/tailwind/components/layout/Alert";
import Card, { CardBody, CardHeader } from "@/tailwind/components/layout/Card";
import Container from "@/tailwind/components/layout/Container";
import {
  faCalendar,
  faCheck,
  faEye,
  faInbox,
  faPaperPlane,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
interface RequestCardProps {
  request: SwapRequest;
  type: "incoming" | "outgoing";
  onAccept?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  onView?: (requestId: string) => void;
  onChat?: (requestId: string) => void;
  isLoading?: boolean;
}
const RequestCard: React.FC<RequestCardProps> = React.memo(
  ({
    request,
    type,
    onAccept,
    onReject,
    onView,
    onChat,
    isLoading = false,
  }) => {
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(date));
    };
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
    const canTakeAction =
      type === "incoming" && request.status === SwapRequestStatus.PENDING;
    return (
      <Card className="mb-4 hover:shadow-md transition-shadow duration-200">
        <CardBody className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-secondary/30 flex items-center justify-center flex-shrink-0">
              <Typography as={TypographyVariant.P} className="text-2xl">
                📦
              </Typography>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <Typography
                  as={TypographyVariant.H4}
                  className="font-semibold text-text-primary truncate pr-2"
                >
                  Item Request
                </Typography>
                {getStatusBadge(request.status)}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon
                  icon={faUser}
                  className="w-3 h-3 text-text-muted"
                />
                <Typography
                  as={TypographyVariant.P}
                  className="text-sm text-text-muted"
                >
                  {type === "incoming" ? "From:" : "To:"}{" "}
                  {type === "incoming" ? request.fromUserId : request.toUserId}
                </Typography>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <FontAwesomeIcon
                  icon={faCalendar}
                  className="w-3 h-3 text-text-muted"
                />
                <Typography
                  as={TypographyVariant.SMALL}
                  className="text-xs text-text-muted"
                >
                  {formatDate(request.createdAt)}
                </Typography>
              </div>
              {request.message && (
                <Typography
                  as={TypographyVariant.P}
                  className="text-sm text-text-secondary bg-secondary/20 rounded-lg p-3 mb-3 italic"
                >
                  &ldquo;{request.message}&rdquo;
                </Typography>
              )}
              <div className="flex gap-2">
                {canTakeAction && (
                  <>
                    <Button
                      variant={ButtonVariant.PRIMARY}
                      size={ButtonSize.SM}
                      onClick={() => onAccept?.(request.id)}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-3 h-3 mr-1"
                      />
                      Accept
                    </Button>
                    <Button
                      variant={ButtonVariant.OUTLINE}
                      size={ButtonSize.SM}
                      onClick={() => onReject?.(request.id)}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="w-3 h-3 mr-1"
                      />
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  variant={ButtonVariant.GHOST}
                  size={ButtonSize.SM}
                  onClick={() => onView?.(request.id)}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={faEye} className="w-3 h-3 mr-1" />
                  View
                </Button>
                <Button
                  variant={ButtonVariant.GHOST}
                  size={ButtonSize.SM}
                  onClick={() => onChat?.(request.id)}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    className="w-3 h-3 mr-1"
                  />
                  Chat
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
);
RequestCard.displayName = "RequestCard";
const EmptyState: React.FC<{ type: "incoming" | "outgoing" }> = ({ type }) => (
  <div className="text-center py-12">
    <div className="text-6xl mb-4 opacity-50">
      {type === "incoming" ? "📥" : "📤"}
    </div>
    <Typography as={TypographyVariant.H3} className="mb-2">
      No {type} requests
    </Typography>
    <Typography as={TypographyVariant.P} className="text-text-muted">
      {type === "incoming"
        ? "You haven't received any swap requests yet."
        : "You haven't sent any swap requests yet."}
    </Typography>
  </div>
);
export const MyRequests: React.FC = () => {
  const router = useRouter();
  const {
    sentRequests,
    receivedRequests,
    isLoadingRequests,
    error,
    fetchSwapRequests,
    respondToSwapRequest,
    clearError,
  } = useLoopItStore();
  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">(
    "incoming"
  );
  const [isResponding, setIsResponding] = useState<string | null>(null);
  useEffect(() => {
    fetchSwapRequests();
  }, [fetchSwapRequests]);
  const handleAccept = async (requestId: string) => {
    setIsResponding(requestId);
    try {
      await respondToSwapRequest(requestId, SwapRequestStatus.ACCEPTED);
    } catch (error) {
      console.error("Failed to accept request:", error);
    } finally {
      setIsResponding(null);
    }
  };
  const handleReject = async (requestId: string) => {
    setIsResponding(requestId);
    try {
      await respondToSwapRequest(requestId, SwapRequestStatus.REJECTED);
    } catch (error) {
      console.error("Failed to reject request:", error);
    } finally {
      setIsResponding(null);
    }
  };
  const handleView = (requestId: string) => {
    console.log("View request:", requestId);
  };
  const handleChat = (requestId: string) => {
    router.push(`/chat/${requestId}`);
  };
  const tabs: TabItem[] = [
    {
      id: "incoming",
      label: `Incoming (${receivedRequests.length})`,
      icon: <FontAwesomeIcon icon={faInbox} className="w-4 h-4" />,
      content: <></>,
    },
    {
      id: "outgoing",
      label: `Outgoing (${sentRequests.length})`,
      icon: <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />,
      content: <></>,
    },
  ];
  return (
    <Container className="py-6">
      <div className="container mx-auto">
        <div className="mb-8">
          <Typography as={TypographyVariant.H1} className="mb-2">
            My Swap Requests
          </Typography>
          <Typography as={TypographyVariant.P} className="text-text-muted">
            Manage your incoming and outgoing swap requests
          </Typography>
        </div>
        {error && (
          <Alert
            variant={AlertVariant.ERROR}
            message={error}
            onDismiss={clearError}
            className="mb-6"
          />
        )}
        <Card>
          <CardHeader>
            <Tabs
              items={tabs}
              activeTab={activeTab}
              onTabChange={(key) =>
                setActiveTab(key as "incoming" | "outgoing")
              }
              className="w-full"
            />
          </CardHeader>
          <CardBody className="p-6">
            {isLoadingRequests ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {activeTab === "incoming" && (
                  <div>
                    {receivedRequests.length === 0 ? (
                      <EmptyState type="incoming" />
                    ) : (
                      <div>
                        {receivedRequests.map((request) => (
                          <RequestCard
                            key={request.id}
                            request={request}
                            type="incoming"
                            onAccept={handleAccept}
                            onReject={handleReject}
                            onView={handleView}
                            onChat={handleChat}
                            isLoading={isResponding === request.id}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {activeTab === "outgoing" && (
                  <div>
                    {sentRequests.length === 0 ? (
                      <EmptyState type="outgoing" />
                    ) : (
                      <div>
                        {sentRequests.map((request) => (
                          <RequestCard
                            key={request.id}
                            request={request}
                            type="outgoing"
                            onView={handleView}
                            onChat={handleChat}
                            isLoading={isResponding === request.id}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </Container>
  );
};
export default MyRequests;

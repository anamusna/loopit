import { SwapRequest, SwapRequestStatus } from "@/shared/types";
import { useLoopItStore } from "@/store";
import { useCallback, useEffect, useMemo, useState } from "react";
export interface UseReviewPromptProps {
  swapRequestId?: string;
}
export const useReviewPrompt = ({
  swapRequestId,
}: UseReviewPromptProps = {}) => {
  const swapRequests = useLoopItStore((state) => state.swapRequests);
  const hasReviewedSwap = useLoopItStore((state) => state.hasReviewedSwap);
  const user = useLoopItStore((state) => state.user);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [pendingReview, setPendingReview] = useState<{
    swapRequestId: string;
    toUserId: string;
    toUserName: string;
    itemTitle: string;
  } | null>(null);
  const shouldShowReviewPrompt = useCallback(
    (swapRequest: SwapRequest): boolean => {
      if (swapRequest.status !== SwapRequestStatus.COMPLETED) {
        return false;
      }
      if (hasReviewedSwap(swapRequest.id)) {
        return false;
      }
      if (swapRequest.fromUserId === user?.id) {
        return false;
      }
      return true;
    },
    [hasReviewedSwap, user?.id]
  );
  const specificSwapRequest = useMemo(() => {
    if (!swapRequestId) return null;
    return swapRequests.find((req) => req.id === swapRequestId);
  }, [swapRequestId, swapRequests]);
  const pendingReviewRequest = useMemo(() => {
    if (!user) return null;
    return swapRequests.find(
      (req) =>
        req.status === SwapRequestStatus.COMPLETED &&
        req.toUserId === user.id &&
        !hasReviewedSwap(req.id)
    );
  }, [swapRequests, user, hasReviewedSwap]);
  useEffect(() => {
    if (!user || !swapRequestId) return;
    if (specificSwapRequest && shouldShowReviewPrompt(specificSwapRequest)) {
      setPendingReview({
        swapRequestId: specificSwapRequest.id,
        toUserId: specificSwapRequest.toUserId,
        toUserName: "Swap Partner", 
        itemTitle: "Swapped Item", 
      });
      setShowReviewPrompt(true);
    }
  }, [swapRequestId, specificSwapRequest, shouldShowReviewPrompt, user]);
  const closeReviewPrompt = useCallback(() => {
    setShowReviewPrompt(false);
    setPendingReview(null);
  }, []);
  const checkForPendingReviews = useCallback(() => {
    if (!user || !pendingReviewRequest) return;
    setPendingReview({
      swapRequestId: pendingReviewRequest.id,
      toUserId: pendingReviewRequest.fromUserId,
      toUserName: "Swap Partner", 
      itemTitle: "Swapped Item", 
    });
    setShowReviewPrompt(true);
  }, [user, pendingReviewRequest]);
  return {
    showReviewPrompt,
    pendingReview,
    closeReviewPrompt,
    checkForPendingReviews,
  };
};

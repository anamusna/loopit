import { Review } from "@/shared/types";
import { useLoopItStore } from "@/store";
import { useMemo } from "react";
export interface UseReviewsOptions {
  userId?: string;
  page?: number;
  perPage?: number;
}
export interface UseReviewsReturn {
  receivedReviews: Review[];
  isLoadingReviews: boolean;
  currentReviews: Review[];
  totalPages: number;
  currentPage: number;
  averageRating: number;
  totalReviews: number;
  fetchReceivedReviews: (userId?: string) => Promise<void>;
  createReview: (reviewData: Omit<Review, "id" | "createdAt">) => Promise<void>;
  hasReviewedSwap: (swapRequestId: string) => boolean;
}
export const useReviews = (
  options: UseReviewsOptions = {}
): UseReviewsReturn => {
  const { page = 1, perPage = 5 } = options;
  const receivedReviews = useLoopItStore((state) => state.receivedReviews);
  const isLoadingReviews = useLoopItStore((state) => state.isLoadingReviews);
  const fetchReceivedReviews = useLoopItStore(
    (state) => state.fetchReceivedReviews
  );
  const createReview = useLoopItStore((state) => state.createReview);
  const hasReviewedSwap = useLoopItStore((state) => state.hasReviewedSwap);
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(receivedReviews.length / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const currentReviews = receivedReviews.slice(startIndex, endIndex);
    return {
      totalPages,
      currentReviews,
      startIndex,
      endIndex,
    };
  }, [receivedReviews, page, perPage]);
  const averageRating = useMemo(() => {
    if (receivedReviews.length === 0) return 0;
    return (
      receivedReviews.reduce((sum, review) => sum + review.overallRating, 0) /
      receivedReviews.length
    );
  }, [receivedReviews]);
  const totalReviews = useMemo(
    () => receivedReviews.length,
    [receivedReviews.length]
  );
  return {
    receivedReviews,
    isLoadingReviews,
    currentReviews: paginationData.currentReviews,
    totalPages: paginationData.totalPages,
    currentPage: page,
    averageRating,
    totalReviews,
    fetchReceivedReviews,
    createReview,
    hasReviewedSwap,
  };
};

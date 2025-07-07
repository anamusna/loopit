"use client";
import {
  Review,
  ReviewFilterOption,
  ReviewSortOption,
  ReviewStatus,
} from "@/shared/types";
import { useLoopItStore } from "@/store";
import Button, { ButtonVariant } from "@/tailwind/components/elements/Button";
import Icon from "@/tailwind/components/elements/Icon";
import LoadingSpinner, {
  LoadingSpinnerSize,
} from "@/tailwind/components/elements/LoadingSpinner";
import Pagination from "@/tailwind/components/elements/Pagination";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Input from "@/tailwind/components/forms/Input";
import Select from "@/tailwind/components/forms/Select";
import Alert, { AlertVariant } from "@/tailwind/components/layout/Alert";
import Modal from "@/tailwind/components/layout/Modal";
import {
  faFilter,
  faSearch,
  faSortAmountDown,
  faStar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import React, { useCallback, useMemo, useState } from "react";
import ReviewCard from "./ReviewCard";
interface ReviewsListProps {
  reviews?: Review[];
  userId?: string;
  itemId?: string;
  showFilters?: boolean;
  showPagination?: boolean;
  itemsPerPage?: number;
  className?: string;
}
interface FlagReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewId: string;
  onSubmit: (reason: string, category: string) => void;
}
const FlagReviewModal: React.FC<FlagReviewModalProps> = ({
  isOpen,
  onClose,
  reviewId,
  onSubmit,
}) => {
  const [reason, setReason] = useState("");
  const [category, setCategory] = useState("");
  const handleSubmit = useCallback(() => {
    if (reason.trim() && category) {
      onSubmit(reason.trim(), category);
      setReason("");
      setCategory("");
      onClose();
    }
  }, [reason, category, onSubmit, onClose]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-w-md">
        <Typography as={TypographyVariant.H3} className="mb-4">
          Report Review
        </Typography>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Why are you reporting this review?
            </label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: "", label: "Select a reason..." },
                { value: "inappropriate", label: "Inappropriate content" },
                { value: "spam", label: "Spam or fake review" },
                { value: "fake", label: "Fake or misleading" },
                { value: "other", label: "Other" },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Additional details (optional)
            </label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide more context..."
              maxLength={200}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant={ButtonVariant.OUTLINE} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={ButtonVariant.DESTRUCTIVE}
            onClick={handleSubmit}
            disabled={!category}
          >
            Report Review
          </Button>
        </div>
      </div>
    </Modal>
  );
};
const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews: propReviews,
  userId,
  itemId,
  showFilters = true,
  showPagination = true,
  itemsPerPage = 10,
  className = "",
}) => {
  const {
    reviews: storeReviews,
    isLoadingReviews,
    flagReview,
    getReviewsForItem,
    getReviewsByRating,
    getVerifiedReviews,
  } = useLoopItStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<ReviewSortOption>(
    ReviewSortOption.NEWEST
  );
  const [filterOption, setFilterOption] = useState<ReviewFilterOption>(
    ReviewFilterOption.ALL
  );
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const allReviews = useMemo(() => {
    if (propReviews) return propReviews;
    if (userId)
      return storeReviews.filter((review) => review.toUserId === userId);
    if (itemId) return getReviewsForItem(itemId);
    return storeReviews;
  }, [propReviews, userId, itemId, storeReviews, getReviewsForItem]);
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = [...allReviews];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (review) =>
          review.comment?.toLowerCase().includes(query) ||
          review.fromUserName.toLowerCase().includes(query) ||
          review.itemTitle.toLowerCase().includes(query)
      );
    }
    switch (filterOption) {
      case ReviewFilterOption.POSITIVE:
        filtered = filtered.filter((review) => review.overallRating >= 4);
        break;
      case ReviewFilterOption.NEUTRAL:
        filtered = filtered.filter(
          (review) => review.overallRating >= 2 && review.overallRating < 4
        );
        break;
      case ReviewFilterOption.NEGATIVE:
        filtered = filtered.filter((review) => review.overallRating < 2);
        break;
      case ReviewFilterOption.VERIFIED:
        filtered = getVerifiedReviews();
        break;
      case ReviewFilterOption.FLAGGED:
        filtered = filtered.filter(
          (review) => review.status === ReviewStatus.FLAGGED
        );
        break;
    }
    switch (sortOption) {
      case ReviewSortOption.NEWEST:
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case ReviewSortOption.OLDEST:
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case ReviewSortOption.HIGHEST_RATED:
        filtered.sort((a, b) => b.overallRating - a.overallRating);
        break;
      case ReviewSortOption.LOWEST_RATED:
        filtered.sort((a, b) => a.overallRating - b.overallRating);
        break;
      case ReviewSortOption.MOST_HELPFUL:
        filtered.sort((a, b) => b.helpfulness.helpful - a.helpfulness.helpful);
        break;
    }
    return filtered;
  }, [allReviews, searchQuery, filterOption, sortOption, getVerifiedReviews]);
  const totalPages = Math.ceil(filteredAndSortedReviews.length / itemsPerPage);
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedReviews.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [filteredAndSortedReviews, currentPage, itemsPerPage]);
  const reviewStats = useMemo(() => {
    const total = filteredAndSortedReviews.length;
    const avgRating =
      total > 0
        ? filteredAndSortedReviews.reduce(
            (sum, r) => sum + r.overallRating,
            0
          ) / total
        : 0;
    const verifiedCount = filteredAndSortedReviews.filter(
      (r) => r.isVerified
    ).length;
    return { total, avgRating, verifiedCount };
  }, [filteredAndSortedReviews]);
  const handleFlagReview = useCallback((reviewId: string) => {
    setSelectedReviewId(reviewId);
    setFlagModalOpen(true);
  }, []);
  const handleSubmitFlag = useCallback(
    async (reason: string, category: string) => {
      if (selectedReviewId) {
        try {
          await flagReview(selectedReviewId, reason, category as any);
        } catch (error) {
          console.error("Failed to flag review:", error);
        }
      }
    },
    [selectedReviewId, flagReview]
  );
  if (isLoadingReviews) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size={LoadingSpinnerSize.LG} />
      </div>
    );
  }
  return (
    <div className={className}>
      {}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Typography as={TypographyVariant.H3}>
            Reviews ({reviewStats.total})
          </Typography>
          {reviewStats.total > 0 && (
            <div className="flex items-center gap-4 text-sm text-secondary">
              <div className="flex items-center gap-1">
                <Icon icon={faStar} className="w-4 h-4 text-warning" />
                <span>{reviewStats.avgRating.toFixed(1)} average</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon icon={faUser} className="w-4 h-4" />
                <span>{reviewStats.verifiedCount} verified</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {}
      {showFilters && (
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {}
            <div className="flex-1">
              <div className="relative">
                <Icon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary"
                />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reviews..."
                  className="pl-10"
                />
              </div>
            </div>
            {}
            <div className="sm:w-48">
              <Select
                value={sortOption}
                onChange={(e) =>
                  setSortOption(e.target.value as ReviewSortOption)
                }
                options={[
                  { value: ReviewSortOption.NEWEST, label: "Newest First" },
                  { value: ReviewSortOption.OLDEST, label: "Oldest First" },
                  {
                    value: ReviewSortOption.HIGHEST_RATED,
                    label: "Highest Rated",
                  },
                  {
                    value: ReviewSortOption.LOWEST_RATED,
                    label: "Lowest Rated",
                  },
                  {
                    value: ReviewSortOption.MOST_HELPFUL,
                    label: "Most Helpful",
                  },
                ]}
                leftIcon={faSortAmountDown}
              />
            </div>
            {}
            <div className="sm:w-48">
              <Select
                value={filterOption}
                onChange={(e) =>
                  setFilterOption(e.target.value as ReviewFilterOption)
                }
                options={[
                  { value: ReviewFilterOption.ALL, label: "All Reviews" },
                  {
                    value: ReviewFilterOption.VERIFIED,
                    label: "Verified Only",
                  },
                  {
                    value: ReviewFilterOption.POSITIVE,
                    label: "Positive (4-5★)",
                  },
                  {
                    value: ReviewFilterOption.NEUTRAL,
                    label: "Neutral (2-3★)",
                  },
                  {
                    value: ReviewFilterOption.NEGATIVE,
                    label: "Negative (1★)",
                  },
                ]}
                leftIcon={faFilter}
              />
            </div>
          </div>
        </div>
      )}
      {}
      {paginatedReviews.length === 0 ? (
        <Alert
          variant={AlertVariant.INFO}
          message={
            searchQuery || filterOption !== ReviewFilterOption.ALL
              ? "No reviews match your current filters."
              : "No reviews yet. Be the first to leave a review!"
          }
        />
      ) : (
        <div className="space-y-6">
          {paginatedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onFlag={handleFlagReview}
              showCriteria={true}
              showHelpfulness={true}
              showResponse={true}
              allowResponse={true}
            />
          ))}
        </div>
      )}
      {}
      {showPagination && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
      {}
      <FlagReviewModal
        isOpen={flagModalOpen}
        onClose={() => setFlagModalOpen(false)}
        reviewId={selectedReviewId || ""}
        onSubmit={handleSubmitFlag}
      />
    </div>
  );
};
export default ReviewsList;

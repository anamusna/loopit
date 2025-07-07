"use client";
import { Review, ReviewCriteria, ReviewStatus } from "@/shared/types";
import { useLoopItStore } from "@/store";
import Button, { ButtonVariant } from "@/tailwind/components/elements/Button";
import Icon from "@/tailwind/components/elements/Icon";
import LoadingSpinner, {
  LoadingSpinnerSize,
} from "@/tailwind/components/elements/LoadingSpinner";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Textarea from "@/tailwind/components/forms/Textarea";
import Toggle from "@/tailwind/components/forms/Toggle";
import Alert, { AlertVariant } from "@/tailwind/components/layout/Alert";
import Modal from "@/tailwind/components/layout/Modal";
import {
  faCheckCircle,
  faStar,
  faStarHalfAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import React, { useCallback, useState } from "react";
interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  swapRequestId: string;
  toUserId: string;
  toUserName: string;
  itemId: string;
  itemTitle: string;
  onSubmit?: (review: Omit<Review, "id" | "createdAt">) => void;
}
interface CriteriaRating {
  criteria: ReviewCriteria;
  rating: number;
}
const CRITERIA_LABELS = {
  [ReviewCriteria.ITEM_CONDITION]: "Item Condition",
  [ReviewCriteria.COMMUNICATION]: "Communication",
  [ReviewCriteria.TIMING]: "Timing & Reliability",
  [ReviewCriteria.OVERALL_EXPERIENCE]: "Overall Experience",
  [ReviewCriteria.TRUSTWORTHINESS]: "Trustworthiness",
};
const CRITERIA_DESCRIPTIONS = {
  [ReviewCriteria.ITEM_CONDITION]:
    "How well did the item match the description and photos?",
  [ReviewCriteria.COMMUNICATION]:
    "How responsive and clear was the communication?",
  [ReviewCriteria.TIMING]: "How punctual and reliable was the person?",
  [ReviewCriteria.OVERALL_EXPERIENCE]:
    "How would you rate the overall swap experience?",
  [ReviewCriteria.TRUSTWORTHINESS]:
    "How trustworthy and honest was this person?",
};
const ReviewForm: React.FC<ReviewFormProps> = ({
  isOpen,
  onClose,
  swapRequestId,
  toUserId,
  toUserName,
  itemId,
  itemTitle,
  onSubmit,
}) => {
  const { user, createReview, isLoadingReviews, error } = useLoopItStore();
  const [criteriaRatings, setCriteriaRatings] = useState<CriteriaRating[]>(
    Object.values(ReviewCriteria).map((criteria) => ({
      criteria,
      rating: 0,
    }))
  );
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const calculateOverallRating = useCallback(() => {
    const totalRating = criteriaRatings.reduce((sum, cr) => sum + cr.rating, 0);
    return criteriaRatings.length > 0
      ? totalRating / criteriaRatings.length
      : 0;
  }, [criteriaRatings]);
  const updateCriteriaRating = useCallback(
    (criteria: ReviewCriteria, rating: number) => {
      setCriteriaRatings((prev) =>
        prev.map((cr) => (cr.criteria === criteria ? { ...cr, rating } : cr))
      );
    },
    []
  );
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) {
        alert("You must be logged in to submit a review.");
        return;
      }
      const overallRating = calculateOverallRating();
      if (overallRating === 0) {
        alert("Please provide ratings for all criteria.");
        return;
      }
      const reviewData: Omit<Review, "id" | "createdAt"> = {
        swapRequestId,
        fromUserId: user.id,
        fromUserName: isAnonymous ? "Anonymous" : user.name,
        fromUserAvatar: isAnonymous ? undefined : user.avatar,
        toUserId,
        itemId,
        itemTitle,
        overallRating,
        criteriaRatings,
        comment: comment.trim() || undefined,
        isAnonymous,
        isVerified: true, 
        status: ReviewStatus.PENDING,
        helpfulness: {
          helpful: 0,
          notHelpful: 0,
        },
      };
      try {
        await createReview(reviewData);
        if (onSubmit) {
          onSubmit(reviewData);
        }
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 2000);
      } catch (error) {
        console.error("Failed to submit review:", error);
      }
    },
    [
      user,
      calculateOverallRating,
      swapRequestId,
      toUserId,
      itemId,
      itemTitle,
      criteriaRatings,
      comment,
      isAnonymous,
      createReview,
      onSubmit,
      onClose,
    ]
  );
  const renderStarRating = useCallback(
    (criteria: ReviewCriteria, currentRating: number) => {
      return (
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => updateCriteriaRating(criteria, star)}
              className={`p-1 transition-colors duration-200 ${
                star <= currentRating
                  ? "text-warning hover:text-warning-dark"
                  : "text-secondary hover:text-warning"
              }`}
            >
              <Icon
                icon={faStar}
                className={`w-6 h-6 ${
                  star <= currentRating ? "fill-current" : ""
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-secondary">
            {currentRating > 0 ? `${currentRating}/5` : "Not rated"}
          </span>
        </div>
      );
    },
    [updateCriteriaRating]
  );
  if (showSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-6 text-center">
          <Icon
            icon={faCheckCircle}
            className="w-16 h-16 text-success mx-auto mb-4"
          />
          <Typography as={TypographyVariant.H3} className="mb-2">
            Review Submitted Successfully!
          </Typography>
          <Typography as={TypographyVariant.LABEL} className="text-secondary">
            Thank you for your feedback. It helps build trust in our community.
          </Typography>
        </div>
      </Modal>
    );
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Typography as={TypographyVariant.H2} className="mb-1">
              Review Your Swap
            </Typography>
            <Typography as={TypographyVariant.LABEL} className="text-secondary">
              Share your experience swapping {itemTitle} with {toUserName}
            </Typography>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <Icon icon={faTimes} className="w-5 h-5 text-secondary" />
          </button>
        </div>
        {error && (
          <Alert
            variant={AlertVariant.ERROR}
            message={error}
            className="mb-6"
          />
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {}
          <div className="space-y-4">
            <Typography as={TypographyVariant.H4}>
              Rate Your Experience
            </Typography>
            {criteriaRatings.map(({ criteria, rating }) => (
              <div key={criteria} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <Typography
                      as={TypographyVariant.LABEL}
                      className="font-medium"
                    >
                      {CRITERIA_LABELS[criteria]}
                    </Typography>
                    <Typography
                      as={TypographyVariant.SMALL}
                      className="text-secondary"
                    >
                      {CRITERIA_DESCRIPTIONS[criteria]}
                    </Typography>
                  </div>
                </div>
                {renderStarRating(criteria, rating)}
              </div>
            ))}
          </div>
          {}
          <div className="bg-neutral-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <Typography as={TypographyVariant.H3} className="font-medium">
                Overall Rating
              </Typography>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      icon={
                        star <= Math.round(calculateOverallRating())
                          ? faStar
                          : faStarHalfAlt
                      }
                      className={`w-5 h-5 ${
                        star <= calculateOverallRating()
                          ? "text-warning fill-current"
                          : "text-secondary"
                      }`}
                    />
                  ))}
                </div>
                <Typography as={TypographyVariant.H3} className="font-medium">
                  {calculateOverallRating().toFixed(1)}/5
                </Typography>
              </div>
            </div>
          </div>
          {}
          <div className="space-y-2">
            <Typography as={TypographyVariant.H3} className="font-medium">
              Share Your Experience (Optional)
            </Typography>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your swap experience. What went well? Any tips for future swappers?"
              rows={4}
              maxLength={500}
              className="resize-none"
            />
            <div className="flex justify-between text-sm text-secondary">
              <span>Help others make informed decisions</span>
              <span>{comment.length}/500</span>
            </div>
          </div>
          {}
          <div className="space-y-3">
            <Typography as={TypographyVariant.H3} className="font-medium">
              Privacy Settings
            </Typography>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div>
                <Typography
                  as={TypographyVariant.LABEL}
                  className="font-medium"
                >
                  Submit Anonymously
                </Typography>
                <Typography
                  as={TypographyVariant.SMALL}
                  className="text-secondary"
                >
                  Your name won`t be shown, but the review will still be
                  verified
                </Typography>
              </div>
              <Toggle
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
            </div>
          </div>
          {}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant={ButtonVariant.OUTLINE}
              onClick={onClose}
              disabled={isLoadingReviews}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={ButtonVariant.PRIMARY}
              disabled={isLoadingReviews || calculateOverallRating() === 0}
              className="min-w-[120px]"
            >
              {isLoadingReviews ? (
                <LoadingSpinner size={LoadingSpinnerSize.SM} />
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
export default ReviewForm;

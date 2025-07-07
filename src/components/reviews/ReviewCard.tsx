"use client";
import { Review, ReviewCriteria } from "@/shared/types";
import { useLoopItStore } from "@/store";
import Avatar, { AvatarSize } from "@/tailwind/components/elements/Avatar";
import Badge, { BadgeVariant } from "@/tailwind/components/elements/Badge";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import Icon from "@/tailwind/components/elements/Icon";
import LoadingSpinner, {
  LoadingSpinnerSize,
} from "@/tailwind/components/elements/LoadingSpinner";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Textarea from "@/tailwind/components/forms/Textarea";
import Card, { CardBody } from "@/tailwind/components/layout/Card";
import {
  faCalendarAlt,
  faCheckCircle,
  faFlag,
  faReply,
  faStar,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import React, { useCallback, useMemo, useState } from "react";
export interface ReviewCardProps {
  review: Review;
  className?: string;
  showCriteria?: boolean;
  showHelpfulness?: boolean;
  showResponse?: boolean;
  allowResponse?: boolean;
  onFlag?: (reviewId: string) => void;
}
const CRITERIA_LABELS = {
  [ReviewCriteria.ITEM_CONDITION]: "Item Condition",
  [ReviewCriteria.COMMUNICATION]: "Communication",
  [ReviewCriteria.TIMING]: "Timing",
  [ReviewCriteria.OVERALL_EXPERIENCE]: "Experience",
  [ReviewCriteria.TRUSTWORTHINESS]: "Trustworthiness",
};
const ReviewCard: React.FC<ReviewCardProps> = React.memo(
  ({
    review,
    className = "",
    showCriteria = true,
    showHelpfulness = true,
    showResponse = true,
    allowResponse = false,
    onFlag,
  }) => {
    const { user, voteOnReview, respondToReview, isLoadingReviews } =
      useLoopItStore();
    const [showResponseForm, setShowResponseForm] = useState(false);
    const [responseText, setResponseText] = useState("");
    const formattedDate = useMemo(() => {
      return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(review.createdAt));
    }, [review.createdAt]);
    const ratingColor = useMemo(() => {
      if (review.overallRating >= 4) return "text-success";
      if (review.overallRating >= 3) return "text-warning";
      return "text-destructive";
    }, [review.overallRating]);
    const ratingText = useMemo(() => {
      if (review.overallRating === 5) return "Excellent";
      if (review.overallRating >= 4) return "Good";
      if (review.overallRating >= 3) return "Average";
      if (review.overallRating >= 2) return "Below Average";
      return "Poor";
    }, [review.overallRating]);
    const reviewerInitial = useMemo(() => {
      return review.fromUserName.charAt(0).toUpperCase();
    }, [review.fromUserName]);
    const userHasVoted = useMemo(() => {
      return user && review.helpfulness.userVote;
    }, [user, review.helpfulness.userVote]);
    const canRespond = useMemo(() => {
      return (
        allowResponse && user && user.id === review.toUserId && !review.response
      );
    }, [allowResponse, user, review.toUserId, review.response]);
    const handleHelpfulVote = useCallback(
      async (voteType: "helpful" | "not_helpful") => {
        if (!user || userHasVoted) return;
        try {
          await voteOnReview(review.id, voteType);
        } catch (error) {
          console.error("Failed to vote on review:", error);
        }
      },
      [user, userHasVoted, voteOnReview, review.id]
    );
    const handleSubmitResponse = useCallback(async () => {
      if (!responseText.trim()) return;
      try {
        await respondToReview(review.id, responseText.trim());
        setResponseText("");
        setShowResponseForm(false);
      } catch (error) {
        console.error("Failed to respond to review:", error);
      }
    }, [responseText, respondToReview, review.id]);
    const renderStarRating = useCallback((rating: number, label?: string) => {
      return (
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Icon
              key={star}
              icon={faStar}
              className={`w-4 h-4 ${
                star <= rating ? "text-warning fill-current" : "text-secondary"
              }`}
            />
          ))}
          {label && (
            <span className="ml-2 text-sm text-secondary">{label}</span>
          )}
        </div>
      );
    }, []);
    return (
      <Card
        className={clsx(
          "hover:shadow-md transition-shadow duration-200",
          className
        )}
      >
        <CardBody className="p-6">
          {}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Avatar
                src={review.fromUserAvatar}
                alt={review.fromUserName}
                initials={reviewerInitial}
                size={AvatarSize.MD}
                className="ring-2 ring-border/50"
              />
              <div>
                <div className="flex items-center gap-2">
                  <Typography as={TypographyVariant.P} className="font-medium">
                    {review.fromUserName}
                  </Typography>
                  {review.isVerified && (
                    <Badge variant={BadgeVariant.SUCCESS} className="text-xs">
                      <Icon icon={faCheckCircle} className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-secondary">
                  <Icon icon={faCalendarAlt} className="w-3 h-3" />
                  <Typography as={TypographyVariant.SMALL}>
                    {formattedDate}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                {renderStarRating(review.overallRating)}
              </div>
              <Typography
                as={TypographyVariant.SMALL}
                className={clsx("font-medium", ratingColor)}
              >
                {ratingText} ({review.overallRating.toFixed(1)}/5)
              </Typography>
            </div>
          </div>
          {}
          {showCriteria &&
            review.criteriaRatings &&
            review.criteriaRatings.length > 0 && (
              <div className="mb-4 p-4 bg-neutral-50 rounded-lg">
                <Typography
                  as={TypographyVariant.P}
                  className="font-medium mb-3"
                >
                  Detailed Ratings
                </Typography>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {review.criteriaRatings.map(({ criteria, rating }) => (
                    <div
                      key={criteria}
                      className="flex items-center justify-between"
                    >
                      <Typography
                        as={TypographyVariant.SMALL}
                        className="text-secondary"
                      >
                        {CRITERIA_LABELS[criteria]}
                      </Typography>
                      {renderStarRating(rating)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          {}
          {review.comment && (
            <div className="mb-4">
              <Typography as={TypographyVariant.P} className="leading-relaxed">
                &ldquo;{review.comment}&rdquo;
              </Typography>
            </div>
          )}
          {}
          {showResponse && review.response && (
            <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-200 rounded-r-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon icon={faReply} className="w-4 h-4 text-blue-600" />
                <Typography
                  as={TypographyVariant.P}
                  className="font-medium text-blue-900"
                >
                  Response from {review.response.authorName}
                </Typography>
                <Typography
                  as={TypographyVariant.SMALL}
                  className="text-blue-600"
                >
                  {new Intl.DateTimeFormat("en-US", {
                    day: "2-digit",
                    month: "short",
                  }).format(new Date(review.response.createdAt))}
                </Typography>
              </div>
              <Typography as={TypographyVariant.P} className="text-blue-800">
                {review.response.content}
              </Typography>
            </div>
          )}
          {}
          {canRespond && showResponseForm && (
            <div className="mb-4 p-4 border border-neutral-200 rounded-lg">
              <Typography as={TypographyVariant.P} className="font-medium mb-3">
                Respond to this review
              </Typography>
              <Textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Thank the reviewer or clarify any points..."
                rows={3}
                maxLength={300}
                className="mb-3"
              />
              <div className="flex justify-between items-center">
                <Typography
                  as={TypographyVariant.SMALL}
                  className="text-secondary"
                >
                  {responseText.length}/300 characters
                </Typography>
                <div className="flex gap-2">
                  <Button
                    variant={ButtonVariant.OUTLINE}
                    size={ButtonSize.SM}
                    onClick={() => setShowResponseForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={ButtonVariant.PRIMARY}
                    size={ButtonSize.SM}
                    onClick={handleSubmitResponse}
                    disabled={!responseText.trim() || isLoadingReviews}
                  >
                    {isLoadingReviews ? (
                      <LoadingSpinner size={LoadingSpinnerSize.SM} />
                    ) : (
                      "Post Response"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
          {}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            {}
            {showHelpfulness && (
              <div className="flex items-center gap-4">
                <Typography
                  as={TypographyVariant.SMALL}
                  className="text-secondary"
                >
                  Was this review helpful?
                </Typography>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleHelpfulVote("helpful")}
                    disabled={!!userHasVoted || !user}
                    className={clsx(
                      "flex items-center gap-1 px-2 py-1 rounded transition-colors",
                      userHasVoted === "helpful"
                        ? "bg-success text-white"
                        : "hover:bg-neutral-100 text-secondary"
                    )}
                  >
                    <Icon icon={faThumbsUp} className="w-3 h-3" />
                    <span className="text-sm">
                      {review.helpfulness.helpful}
                    </span>
                  </button>
                  <button
                    onClick={() => handleHelpfulVote("not_helpful")}
                    disabled={!!userHasVoted || !user}
                    className={clsx(
                      "flex items-center gap-1 px-2 py-1 rounded transition-colors",
                      userHasVoted === "not_helpful"
                        ? "bg-destructive text-white"
                        : "hover:bg-neutral-100 text-secondary"
                    )}
                  >
                    <Icon icon={faThumbsDown} className="w-3 h-3" />
                    <span className="text-sm">
                      {review.helpfulness.notHelpful}
                    </span>
                  </button>
                </div>
              </div>
            )}
            {}
            <div className="flex items-center gap-2">
              {canRespond && !showResponseForm && (
                <Button
                  variant={ButtonVariant.OUTLINE}
                  size={ButtonSize.SM}
                  onClick={() => setShowResponseForm(true)}
                >
                  <Icon icon={faReply} className="w-3 h-3 mr-1" />
                  Respond
                </Button>
              )}
              {user && user.id !== review.fromUserId && onFlag && (
                <Button
                  variant={ButtonVariant.OUTLINE}
                  size={ButtonSize.SM}
                  onClick={() => onFlag(review.id)}
                  className="text-secondary hover:text-destructive"
                >
                  <Icon icon={faFlag} className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
          {}
          {review.isVerified && (
            <div className="mt-3 flex items-center gap-1 text-success">
              <Icon icon={faCheckCircle} className="w-3 h-3" />
              <Typography as={TypographyVariant.SMALL}>
                Verified swap completion
              </Typography>
            </div>
          )}
        </CardBody>
      </Card>
    );
  }
);
ReviewCard.displayName = "ReviewCard";
export default ReviewCard;

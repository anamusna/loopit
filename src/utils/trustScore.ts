import { Review } from "@/shared/types";
export interface TrustScoreFactors {
  successfulSwaps: number;
  averageRating: number;
  reviewCount: number;
  profileCompleteness: number;
  communityParticipation: number;
  accountAge: number; 
  verificationStatus: number; 
  helpfulVotesReceived: number;
  responseRate: number; 
  consistencyScore: number; 
}
export interface TrustScoreBreakdown {
  totalScore: number;
  factors: {
    reviews: number;
    activity: number;
    reliability: number;
    community: number;
    verification: number;
  };
  level: "New" | "Growing" | "Trusted" | "Verified" | "Expert";
  nextLevelThreshold: number;
  progressToNext: number;
}
export const calculateTrustScore = (factors: TrustScoreFactors): number => {
  const {
    successfulSwaps,
    averageRating,
    reviewCount,
    profileCompleteness,
    communityParticipation,
    accountAge,
    verificationStatus,
    helpfulVotesReceived,
    responseRate,
    consistencyScore,
  } = factors;
  const weights = {
    reviews: 0.35, 
    activity: 0.25, 
    reliability: 0.2, 
    community: 0.1, 
    verification: 0.1, 
  };
  const reviewScore = calculateReviewScore(
    averageRating,
    reviewCount,
    helpfulVotesReceived
  );
  const activityScore = calculateActivityScore(successfulSwaps, accountAge);
  const reliabilityScore = calculateReliabilityScore(
    responseRate,
    consistencyScore
  );
  const communityScore = calculateCommunityScore(
    communityParticipation,
    profileCompleteness
  );
  const verificationScore = verificationStatus;
  const totalScore =
    reviewScore * weights.reviews +
    activityScore * weights.activity +
    reliabilityScore * weights.reliability +
    communityScore * weights.community +
    verificationScore * weights.verification;
  return Math.min(Math.max(totalScore, 0), 1); 
};
export const calculateTrustScoreBreakdown = (
  factors: TrustScoreFactors
): TrustScoreBreakdown => {
  const {
    successfulSwaps,
    averageRating,
    reviewCount,
    profileCompleteness,
    communityParticipation,
    accountAge,
    verificationStatus,
    helpfulVotesReceived,
    responseRate,
    consistencyScore,
  } = factors;
  const reviewScore = calculateReviewScore(
    averageRating,
    reviewCount,
    helpfulVotesReceived
  );
  const activityScore = calculateActivityScore(successfulSwaps, accountAge);
  const reliabilityScore = calculateReliabilityScore(
    responseRate,
    consistencyScore
  );
  const communityScore = calculateCommunityScore(
    communityParticipation,
    profileCompleteness
  );
  const totalScore = calculateTrustScore(factors);
  const level = getTrustLevel(totalScore);
  const { nextLevelThreshold, progressToNext } =
    getTrustLevelProgress(totalScore);
  return {
    totalScore,
    factors: {
      reviews: Math.round(reviewScore * 100),
      activity: Math.round(activityScore * 100),
      reliability: Math.round(reliabilityScore * 100),
      community: Math.round(communityScore * 100),
      verification: Math.round(verificationStatus * 100),
    },
    level,
    nextLevelThreshold,
    progressToNext,
  };
};
const calculateReviewScore = (
  averageRating: number,
  reviewCount: number,
  helpfulVotes: number
): number => {
  if (reviewCount === 0) return 0;
  const ratingScore = Math.max((averageRating - 1) / 4, 0); 
  const volumeBonus = Math.min(Math.log10(reviewCount + 1) / 2, 0.3); 
  const helpfulnessBonus = Math.min(helpfulVotes * 0.01, 0.2); 
  return Math.min(ratingScore + volumeBonus + helpfulnessBonus, 1);
};
const calculateActivityScore = (
  successfulSwaps: number,
  accountAge: number
): number => {
  if (successfulSwaps === 0) return 0;
  const swapScore = Math.min(successfulSwaps / 20, 1); 
  const ageMultiplier = Math.min(accountAge / 90, 1); 
  return swapScore * ageMultiplier;
};
const calculateReliabilityScore = (
  responseRate: number,
  consistencyScore: number
): number => {
  return responseRate * 0.6 + consistencyScore * 0.4;
};
const calculateCommunityScore = (
  communityParticipation: number,
  profileCompleteness: number
): number => {
  const participationScore = Math.min(communityParticipation / 10, 1); 
  return participationScore * 0.6 + profileCompleteness * 0.4;
};
export const getTrustLevel = (score: number): TrustScoreBreakdown["level"] => {
  if (score >= 0.9) return "Expert";
  if (score >= 0.75) return "Verified";
  if (score >= 0.5) return "Trusted";
  if (score >= 0.25) return "Growing";
  return "New";
};
export const getTrustLevelProgress = (
  score: number
): { nextLevelThreshold: number; progressToNext: number } => {
  const thresholds = [0, 0.25, 0.5, 0.75, 0.9, 1];
  for (let i = 0; i < thresholds.length - 1; i++) {
    if (score >= thresholds[i] && score < thresholds[i + 1]) {
      const nextLevelThreshold = thresholds[i + 1];
      const currentLevelThreshold = thresholds[i];
      const progressToNext =
        ((score - currentLevelThreshold) /
          (nextLevelThreshold - currentLevelThreshold)) *
        100;
      return {
        nextLevelThreshold: Math.round(nextLevelThreshold * 100),
        progressToNext: Math.round(progressToNext),
      };
    }
  }
  return { nextLevelThreshold: 100, progressToNext: 100 };
};
export const calculateRatingConsistency = (reviews: Review[]): number => {
  if (reviews.length < 2) return 1;
  const ratings = reviews.map((r) => r.overallRating);
  const mean =
    ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  const variance =
    ratings.reduce((sum, rating) => sum + Math.pow(rating - mean, 2), 0) /
    ratings.length;
  const standardDeviation = Math.sqrt(variance);
  return Math.max(1 - standardDeviation / 2, 0);
};
export const calculateReviewTrustImpact = (
  review: Review,
  userCurrentScore: number,
  userReviewCount: number
): number => {
  const reviewWeight = 1 / Math.max(userReviewCount, 1); 
  const ratingImpact = (review.overallRating - 3) / 10; 
  const verificationBonus = review.isVerified ? 0.05 : 0;
  return (ratingImpact + verificationBonus) * reviewWeight;
};
export const getTrustBadgeInfo = (score: number) => {
  const level = getTrustLevel(score);
  const badges = {
    New: {
      icon: "🌱",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      description: "New to the community",
    },
    Growing: {
      icon: "📈",
      color: "text-info",
      bgColor: "bg-info/10",
      description: "Building reputation",
    },
    Trusted: {
      icon: "⭐",
      color: "text-warning",
      bgColor: "bg-warning/10",
      description: "Trusted community member",
    },
    Verified: {
      icon: "✅",
      color: "text-success",
      bgColor: "bg-success/10",
      description: "Verified trusted trader",
    },
    Expert: {
      icon: "👑",
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "Expert community leader",
    },
  };
  return badges[level];
};
export const getTrustScoreRecommendations = (
  breakdown: TrustScoreBreakdown
): string[] => {
  const recommendations: string[] = [];
  if (breakdown.factors.reviews < 70) {
    recommendations.push("Complete more swaps to improve your review score");
  }
  if (breakdown.factors.verification < 100) {
    recommendations.push("Verify your email and phone number for higher trust");
  }
  if (breakdown.factors.community < 50) {
    recommendations.push(
      "Participate in community events and complete your profile"
    );
  }
  if (breakdown.factors.reliability < 60) {
    recommendations.push(
      "Respond quickly to messages and maintain consistent quality"
    );
  }
  if (breakdown.factors.activity < 50) {
    recommendations.push(
      "Stay active with regular swaps and community engagement"
    );
  }
  return recommendations;
};

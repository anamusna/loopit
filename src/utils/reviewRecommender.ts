import { Item, Review, SwapRequest, UserProfile } from "@/shared/types";
export interface UserRecommendation {
  user: UserProfile;
  score: number;
  reasons: string[];
  trustLevel: string;
  commonInterests: string[];
  locationMatch: boolean;
  ratingCompatibility: number;
}
export interface ItemRecommendation {
  item: Item;
  score: number;
  reasons: string[];
  ownerTrustScore: number;
  reviewCount: number;
  averageRating: number;
}
export interface SwapRecommendation {
  swapRequest: SwapRequest;
  score: number;
  reasons: string[];
  riskLevel: "low" | "medium" | "high";
  trustCompatibility: number;
}
export const generateUserRecommendations = (
  currentUser: UserProfile,
  allUsers: UserProfile[],
  reviews: Review[],
  maxRecommendations: number = 10
): UserRecommendation[] => {
  const recommendations: UserRecommendation[] = [];
  allUsers.forEach((user) => {
    if (user.id === currentUser.id) return;
    const userReviews = reviews.filter((r) => r.toUserId === user.id);
    const score = calculateUserRecommendationScore(
      currentUser,
      user,
      userReviews
    );
    const reasons = generateRecommendationReasons(
      currentUser,
      user,
      userReviews
    );
    const trustLevel = getTrustLevelFromScore(user.trustScore);
    const commonInterests = findCommonInterests(currentUser, user);
    const locationMatch = isLocationMatch(currentUser.location, user.location);
    const ratingCompatibility = calculateRatingCompatibility(
      currentUser,
      user,
      reviews
    );
    if (score > 0.3) {
      recommendations.push({
        user,
        score,
        reasons,
        trustLevel,
        commonInterests,
        locationMatch,
        ratingCompatibility,
      });
    }
  });
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, maxRecommendations);
};
const calculateUserRecommendationScore = (
  currentUser: UserProfile,
  targetUser: UserProfile,
  targetUserReviews: Review[]
): number => {
  let score = 0;
  score += targetUser.trustScore * 0.4;
  if (targetUserReviews.length > 0) {
    const averageRating =
      targetUserReviews.reduce((sum, r) => sum + r.overallRating, 0) /
      targetUserReviews.length;
    score += (averageRating / 5) * 0.25;
  }
  const commonInterests = findCommonInterests(currentUser, targetUser);
  const interestScore = Math.min(commonInterests.length / 5, 1); 
  score += interestScore * 0.15;
  const locationScore = isLocationMatch(
    currentUser.location,
    targetUser.location
  )
    ? 1
    : 0.3;
  score += locationScore * 0.1;
  const activityScore = Math.min(targetUser.stats.successfulSwaps / 20, 1);
  score += activityScore * 0.1;
  return Math.min(score, 1);
};
const generateRecommendationReasons = (
  currentUser: UserProfile,
  targetUser: UserProfile,
  targetUserReviews: Review[]
): string[] => {
  const reasons: string[] = [];
  if (targetUser.trustScore >= 0.8) {
    reasons.push("Highly trusted community member");
  } else if (targetUser.trustScore >= 0.6) {
    reasons.push("Reliable trader with good reputation");
  }
  if (targetUserReviews.length >= 10) {
    const averageRating =
      targetUserReviews.reduce((sum, r) => sum + r.overallRating, 0) /
      targetUserReviews.length;
    if (averageRating >= 4.5) {
      reasons.push("Consistently excellent reviews");
    } else if (averageRating >= 4.0) {
      reasons.push("Strong positive feedback");
    }
  }
  const commonInterests = findCommonInterests(currentUser, targetUser);
  if (commonInterests.length >= 3) {
    reasons.push(`Shares ${commonInterests.length} interests with you`);
  }
  if (isLocationMatch(currentUser.location, targetUser.location)) {
    reasons.push("Lives in your area");
  }
  if (targetUser.stats.successfulSwaps >= 20) {
    reasons.push("Very active trader");
  }
  if (targetUser.security.emailVerified && targetUser.security.phoneVerified) {
    reasons.push("Fully verified account");
  }
  return reasons;
};
const findCommonInterests = (
  user1: UserProfile,
  user2: UserProfile
): string[] => {
  const interests1 = user1.interests || [];
  const interests2 = user2.interests || [];
  return interests1.filter((interest) =>
    interests2.some((i) => i.toLowerCase() === interest.toLowerCase())
  );
};
const isLocationMatch = (location1: string, location2: string): boolean => {
  const normalize = (loc: string) => loc.toLowerCase().trim();
  const loc1Parts = normalize(location1).split(",");
  const loc2Parts = normalize(location2).split(",");
  return loc1Parts.some((part1) =>
    loc2Parts.some((part2) => part1.trim() === part2.trim())
  );
};
const calculateRatingCompatibility = (
  user1: UserProfile,
  user2: UserProfile,
  allReviews: Review[]
): number => {
  const user1Reviews = allReviews.filter((r) => r.fromUserId === user1.id);
  const user2Reviews = allReviews.filter((r) => r.fromUserId === user2.id);
  if (user1Reviews.length === 0 || user2Reviews.length === 0) return 0.5;
  const user1AvgRating =
    user1Reviews.reduce((sum, r) => sum + r.overallRating, 0) /
    user1Reviews.length;
  const user2AvgRating =
    user2Reviews.reduce((sum, r) => sum + r.overallRating, 0) /
    user2Reviews.length;
  const difference = Math.abs(user1AvgRating - user2AvgRating);
  return Math.max(1 - difference / 4, 0); 
};
const getTrustLevelFromScore = (score: number): string => {
  if (score >= 0.9) return "Expert";
  if (score >= 0.75) return "Verified";
  if (score >= 0.5) return "Trusted";
  if (score >= 0.25) return "Growing";
  return "New";
};
const calculateTrustCompatibility = (
  user1: UserProfile,
  user2: UserProfile
): number => {
  const scoreDifference = Math.abs(user1.trustScore - user2.trustScore);
  return Math.max(1 - scoreDifference, 0);
};

import { ItemCategory, Review, ReviewCriteria } from "@/shared/types";
export interface ReviewAnalytics {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  criteriaBreakdown: Record<ReviewCriteria, { average: number; count: number }>;
  categoryPerformance: Record<ItemCategory, { average: number; count: number }>;
  monthlyTrends: Array<{
    month: string;
    reviewCount: number;
    averageRating: number;
    helpfulVotes: number;
  }>;
  topReviewers: Array<{
    userId: string;
    userName: string;
    reviewCount: number;
    averageRating: number;
    helpfulVotes: number;
  }>;
  insights: string[];
}
export interface UserReviewStats {
  totalReceived: number;
  totalGiven: number;
  averageReceived: number;
  averageGiven: number;
  helpfulVotesReceived: number;
  helpfulVotesGiven: number;
  responseRate: number;
  consistencyScore: number;
  recentTrend: "improving" | "stable" | "declining";
}
export const calculateReviewAnalytics = (
  reviews: Review[]
): ReviewAnalytics => {
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: {},
      criteriaBreakdown: {} as Record<
        ReviewCriteria,
        { average: number; count: number }
      >,
      categoryPerformance: {} as Record<
        ItemCategory,
        { average: number; count: number }
      >,
      monthlyTrends: [],
      topReviewers: [],
      insights: ["No reviews available yet"],
    };
  }
  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((sum, r) => sum + r.overallRating, 0) / totalReviews;
  return {
    totalReviews,
    averageRating,
    ratingDistribution: calculateRatingDistribution(reviews),
    criteriaBreakdown: calculateCriteriaBreakdown(reviews),
    categoryPerformance: calculateCategoryPerformance(reviews),
    monthlyTrends: calculateMonthlyTrends(reviews),
    topReviewers: calculateTopReviewers(reviews),
    insights: generateInsights(reviews, averageRating),
  };
};
const calculateRatingDistribution = (
  reviews: Review[]
): Record<number, number> => {
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((review) => {
    const rating = Math.round(review.overallRating);
    if (rating >= 1 && rating <= 5) {
      distribution[rating]++;
    }
  });
  return distribution;
};
const calculateCriteriaBreakdown = (
  reviews: Review[]
): Record<ReviewCriteria, { average: number; count: number }> => {
  const breakdown: Record<ReviewCriteria, { total: number; count: number }> =
    {} as any;
  reviews.forEach((review) => {
    if (review.criteriaRatings) {
      review.criteriaRatings.forEach((criteria) => {
        if (!breakdown[criteria.criteria]) {
          breakdown[criteria.criteria] = { total: 0, count: 0 };
        }
        breakdown[criteria.criteria].total += criteria.rating;
        breakdown[criteria.criteria].count++;
      });
    }
  });
  const result: Record<ReviewCriteria, { average: number; count: number }> =
    {} as any;
  Object.entries(breakdown).forEach(([criteria, data]) => {
    result[criteria as ReviewCriteria] = {
      average: data.total / data.count,
      count: data.count,
    };
  });
  return result;
};
const calculateCategoryPerformance = (
  reviews: Review[]
): Record<ItemCategory, { average: number; count: number }> => {
  return {} as Record<ItemCategory, { average: number; count: number }>;
};
const calculateMonthlyTrends = (
  reviews: Review[]
): Array<{
  month: string;
  reviewCount: number;
  averageRating: number;
  helpfulVotes: number;
}> => {
  const monthlyData: Record<
    string,
    {
      reviews: Review[];
      helpfulVotes: number;
    }
  > = {};
  reviews.forEach((review) => {
    const monthKey = new Date(review.createdAt).toISOString().slice(0, 7); 
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { reviews: [], helpfulVotes: 0 };
    }
    monthlyData[monthKey].reviews.push(review);
    monthlyData[monthKey].helpfulVotes += review.helpfulness.helpful;
  });
  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      reviewCount: data.reviews.length,
      averageRating:
        data.reviews.reduce((sum, r) => sum + r.overallRating, 0) /
        data.reviews.length,
      helpfulVotes: data.helpfulVotes,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};
const calculateTopReviewers = (
  reviews: Review[]
): Array<{
  userId: string;
  userName: string;
  reviewCount: number;
  averageRating: number;
  helpfulVotes: number;
}> => {
  const reviewerData: Record<
    string,
    {
      reviews: Review[];
      helpfulVotes: number;
    }
  > = {};
  reviews.forEach((review) => {
    if (!reviewerData[review.fromUserId]) {
      reviewerData[review.fromUserId] = { reviews: [], helpfulVotes: 0 };
    }
    reviewerData[review.fromUserId].reviews.push(review);
    reviewerData[review.fromUserId].helpfulVotes += review.helpfulness.helpful;
  });
  return Object.entries(reviewerData)
    .map(([userId, data]) => ({
      userId,
      userName: data.reviews[0]?.fromUserName || "Unknown",
      reviewCount: data.reviews.length,
      averageRating:
        data.reviews.reduce((sum, r) => sum + r.overallRating, 0) /
        data.reviews.length,
      helpfulVotes: data.helpfulVotes,
    }))
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 10); 
};
const generateInsights = (
  reviews: Review[],
  averageRating: number
): string[] => {
  const insights: string[] = [];
  const recentReviews = reviews.filter(
    (r) =>
      new Date(r.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  if (averageRating >= 4.5) {
    insights.push("Excellent reputation with consistently high ratings");
  } else if (averageRating >= 4.0) {
    insights.push("Strong reputation with mostly positive feedback");
  } else if (averageRating >= 3.5) {
    insights.push("Good reputation with room for improvement");
  } else {
    insights.push("Consider focusing on improving swap quality");
  }
  if (reviews.length >= 50) {
    insights.push("Highly experienced trader with extensive feedback");
  } else if (reviews.length >= 20) {
    insights.push("Experienced trader with good feedback history");
  } else if (reviews.length >= 5) {
    insights.push("Building reputation with growing feedback");
  } else {
    insights.push("New trader - consider completing more swaps");
  }
  if (recentReviews.length > 0) {
    const recentAverage =
      recentReviews.reduce((sum, r) => sum + r.overallRating, 0) /
      recentReviews.length;
    if (recentAverage > averageRating + 0.3) {
      insights.push("Recent performance is improving");
    } else if (recentAverage < averageRating - 0.3) {
      insights.push("Recent performance shows room for improvement");
    }
  }
  const totalHelpfulVotes = reviews.reduce(
    (sum, r) => sum + r.helpfulness.helpful,
    0
  );
  if (totalHelpfulVotes > reviews.length * 0.7) {
    insights.push("Reviews are consistently helpful to the community");
  }
  return insights;
};
export const calculateUserReviewStats = (
  receivedReviews: Review[],
  givenReviews: Review[]
): UserReviewStats => {
  const totalReceived = receivedReviews.length;
  const totalGiven = givenReviews.length;
  const averageReceived =
    totalReceived > 0
      ? receivedReviews.reduce((sum, r) => sum + r.overallRating, 0) /
        totalReceived
      : 0;
  const averageGiven =
    totalGiven > 0
      ? givenReviews.reduce((sum, r) => sum + r.overallRating, 0) / totalGiven
      : 0;
  const helpfulVotesReceived = receivedReviews.reduce(
    (sum, r) => sum + r.helpfulness.helpful,
    0
  );
  const helpfulVotesGiven = givenReviews.reduce(
    (sum, r) => sum + r.helpfulness.helpful,
    0
  );
  const responseRate = calculateResponseRate(receivedReviews);
  const consistencyScore = calculateConsistencyScore(receivedReviews);
  const recentTrend = calculateRecentTrend(receivedReviews);
  return {
    totalReceived,
    totalGiven,
    averageReceived,
    averageGiven,
    helpfulVotesReceived,
    helpfulVotesGiven,
    responseRate,
    consistencyScore,
    recentTrend,
  };
};
const calculateResponseRate = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const responsesCount = reviews.filter((r) => r.response).length;
  return responsesCount / reviews.length;
};
const calculateConsistencyScore = (reviews: Review[]): number => {
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
const calculateRecentTrend = (
  reviews: Review[]
): "improving" | "stable" | "declining" => {
  if (reviews.length < 6) return "stable";
  const sortedReviews = reviews.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const recentHalf = sortedReviews.slice(-Math.floor(reviews.length / 2));
  const earlierHalf = sortedReviews.slice(0, Math.floor(reviews.length / 2));
  const recentAverage =
    recentHalf.reduce((sum, r) => sum + r.overallRating, 0) / recentHalf.length;
  const earlierAverage =
    earlierHalf.reduce((sum, r) => sum + r.overallRating, 0) /
    earlierHalf.length;
  const difference = recentAverage - earlierAverage;
  if (difference > 0.3) return "improving";
  if (difference < -0.3) return "declining";
  return "stable";
};
export const exportReviewsToCSV = (reviews: Review[]): string => {
  const headers = [
    "Review ID",
    "From User",
    "To User",
    "Item Title",
    "Overall Rating",
    "Comment",
    "Is Verified",
    "Helpful Votes",
    "Created At",
    "Status",
  ];
  const rows = reviews.map((review) => [
    review.id,
    review.fromUserName,
    review.toUserId, 
    review.itemTitle,
    review.overallRating.toString(),
    review.comment || "",
    review.isVerified ? "Yes" : "No",
    review.helpfulness.helpful.toString(),
    new Date(review.createdAt).toLocaleDateString(),
    review.status,
  ]);
  return [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");
};
export const generateShareableReviewPreview = (
  review: Review
): {
  title: string;
  description: string;
  url: string;
} => {
  const ratingStars = "⭐".repeat(Math.round(review.overallRating));
  return {
    title: `${review.fromUserName} rated their swap ${ratingStars}`,
    description: review.comment
      ? `"${review.comment.substring(0, 100)}${
          review.comment.length > 100 ? "..." : ""
        }"`
      : `${review.overallRating}/5 stars for swapping ${review.itemTitle}`,
    url: `${window.location.origin}/reviews/${review.id}`,
  };
};

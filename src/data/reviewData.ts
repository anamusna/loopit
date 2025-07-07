import { Review, ReviewCriteria, ReviewStatus } from "@/shared/types";
export const defaultReviews: Review[] = [
  {
    id: "review_001",
    swapRequestId: "swap_001",
    fromUserId: "user_001",
    fromUserName: "Sarah Chen",
    toUserId: "user_002",
    itemId: "item_002",
    itemTitle: "Vintage Leather Jacket",
    overallRating: 4.8,
    criteriaRatings: [
      { criteria: ReviewCriteria.ITEM_CONDITION, rating: 5 },
      { criteria: ReviewCriteria.COMMUNICATION, rating: 5 },
      { criteria: ReviewCriteria.TIMING, rating: 4 },
      { criteria: ReviewCriteria.OVERALL_EXPERIENCE, rating: 5 },
      { criteria: ReviewCriteria.TRUSTWORTHINESS, rating: 5 },
    ],
    comment:
      "Excellent swap! The leather jacket was in perfect condition, exactly as described. Mike was very communicative and flexible with the meeting time. Would definitely swap with him again!",
    isAnonymous: false,
    isVerified: true,
    status: ReviewStatus.APPROVED,
    helpfulness: {
      helpful: 12,
      notHelpful: 1,
    },
    response: {
      id: "response_001",
      reviewId: "review_001",
      authorId: "user_002",
      authorName: "Mike Johnson",
      content:
        "Thanks Sarah! Your camera was amazing too. Hope you enjoy the jacket!",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), 
    },
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), 
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "review_002",
    swapRequestId: "swap_001",
    fromUserId: "user_002",
    fromUserName: "Mike Johnson",
    toUserId: "user_001",
    itemId: "item_001",
    itemTitle: "Vintage Film Camera",
    overallRating: 4.9,
    criteriaRatings: [
      { criteria: ReviewCriteria.ITEM_CONDITION, rating: 5 },
      { criteria: ReviewCriteria.COMMUNICATION, rating: 5 },
      { criteria: ReviewCriteria.TIMING, rating: 5 },
      { criteria: ReviewCriteria.OVERALL_EXPERIENCE, rating: 5 },
      { criteria: ReviewCriteria.TRUSTWORTHINESS, rating: 4 },
    ],
    comment:
      "Sarah's camera was in pristine condition and worked perfectly. She was super responsive and professional throughout the process. Highly recommend!",
    isAnonymous: false,
    isVerified: true,
    status: ReviewStatus.APPROVED,
    helpfulness: {
      helpful: 8,
      notHelpful: 0,
    },
    response: {
      id: "response_002",
      reviewId: "review_002",
      authorId: "user_001",
      authorName: "Sarah Chen",
      content:
        "Thank you Mike! It was a pleasure swapping with you. Enjoy the camera!",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "review_003",
    swapRequestId: "swap_003",
    fromUserId: "user_003",
    fromUserName: "Emma Davis",
    toUserId: "user_004",
    itemId: "item_004",
    itemTitle: "Board Game Collection",
    overallRating: 4.2,
    criteriaRatings: [
      { criteria: ReviewCriteria.ITEM_CONDITION, rating: 4 },
      { criteria: ReviewCriteria.COMMUNICATION, rating: 4 },
      { criteria: ReviewCriteria.TIMING, rating: 4 },
      { criteria: ReviewCriteria.OVERALL_EXPERIENCE, rating: 4 },
      { criteria: ReviewCriteria.TRUSTWORTHINESS, rating: 5 },
    ],
    comment:
      "Good swap overall. The games were mostly in good condition, though one had a few missing pieces that Alex mentioned upfront. Communication was clear and honest.",
    isAnonymous: false,
    isVerified: true,
    status: ReviewStatus.APPROVED,
    helpfulness: {
      helpful: 5,
      notHelpful: 2,
    },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), 
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: "review_004",
    swapRequestId: "swap_004",
    fromUserId: "user_005",
    fromUserName: "Jordan Kim",
    toUserId: "user_001",
    itemId: "item_005",
    itemTitle: "Yoga Mat Set",
    overallRating: 5.0,
    criteriaRatings: [
      { criteria: ReviewCriteria.ITEM_CONDITION, rating: 5 },
      { criteria: ReviewCriteria.COMMUNICATION, rating: 5 },
      { criteria: ReviewCriteria.TIMING, rating: 5 },
      { criteria: ReviewCriteria.OVERALL_EXPERIENCE, rating: 5 },
      { criteria: ReviewCriteria.TRUSTWORTHINESS, rating: 5 },
    ],
    comment:
      "Perfect swap! Sarah's yoga equipment was brand new and exactly what I needed. She was incredibly helpful and even gave me some great yoga tips. 5 stars!",
    isAnonymous: false,
    isVerified: true,
    status: ReviewStatus.APPROVED,
    helpfulness: {
      helpful: 15,
      notHelpful: 0,
    },
    response: {
      id: "response_004",
      reviewId: "review_004",
      authorId: "user_001",
      authorName: "Sarah Chen",
      content:
        "So happy you're enjoying the yoga set! Thanks for the great books in return. Namaste! 🧘‍♀️",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), 
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "review_005",
    swapRequestId: "swap_005",
    fromUserId: "user_006",
    fromUserName: "Taylor Wilson",
    toUserId: "user_002",
    itemId: "item_006",
    itemTitle: "Kitchen Appliances",
    overallRating: 3.8,
    criteriaRatings: [
      { criteria: ReviewCriteria.ITEM_CONDITION, rating: 3 },
      { criteria: ReviewCriteria.COMMUNICATION, rating: 4 },
      { criteria: ReviewCriteria.TIMING, rating: 4 },
      { criteria: ReviewCriteria.OVERALL_EXPERIENCE, rating: 4 },
      { criteria: ReviewCriteria.TRUSTWORTHINESS, rating: 4 },
    ],
    comment:
      "The appliances worked but showed more wear than expected from the photos. Mike was honest about it when I asked and offered a partial credit. Fair swap overall.",
    isAnonymous: false,
    isVerified: true,
    status: ReviewStatus.APPROVED,
    helpfulness: {
      helpful: 3,
      notHelpful: 1,
    },
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), 
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
];
export const getReviewsForUser = (userId: string): Review[] => {
  return defaultReviews.filter((review) => review.toUserId === userId);
};
export const getReviewsByUser = (userId: string): Review[] => {
  return defaultReviews.filter((review) => review.fromUserId === userId);
};
export const getReviewsForItem = (itemId: string): Review[] => {
  return defaultReviews.filter((review) => review.itemId === itemId);
};
export const getReviewsForSwap = (swapRequestId: string): Review[] => {
  return defaultReviews.filter(
    (review) => review.swapRequestId === swapRequestId
  );
};
export const getVerifiedReviews = (): Review[] => {
  return defaultReviews.filter((review) => review.isVerified);
};
export const getReviewsByStatus = (status: ReviewStatus): Review[] => {
  return defaultReviews.filter((review) => review.status === status);
};
export const getReviewsByRating = (minRating: number): Review[] => {
  return defaultReviews.filter((review) => review.overallRating >= minRating);
};
export const getRecentReviews = (days: number = 7): Review[] => {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return defaultReviews.filter(
    (review) => new Date(review.createdAt) > cutoffDate
  );
};
export const getTopRatedReviews = (limit: number = 10): Review[] => {
  return defaultReviews
    .sort((a, b) => b.overallRating - a.overallRating)
    .slice(0, limit);
};
export const getMostHelpfulReviews = (limit: number = 10): Review[] => {
  return defaultReviews
    .sort((a, b) => b.helpfulness.helpful - a.helpfulness.helpful)
    .slice(0, limit);
};

import { BadgeType } from "@/shared/types";
export interface BadgeConfig {
  type: BadgeType;
  name: string;
  description: string;
  iconUrl: string;
  color: string;
  criteria: {
    type: "swaps" | "reviews" | "profile" | "community" | "environmental";
    threshold: number;
    description: string;
  };
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
}
export const BADGE_CONFIGS: Record<BadgeType, BadgeConfig> = {
  [BadgeType.NEW_USER]: {
    type: BadgeType.NEW_USER,
    name: "New User",
    description: "Welcome to LoopIt! You've joined our sustainable community.",
    iconUrl: "/badges/new-user.svg",
    color: "bg-blue-500",
    criteria: {
      type: "profile",
      threshold: 1,
      description: "Complete profile setup",
    },
    rarity: "common",
  },
  [BadgeType.TRUSTED_SWAPPER]: {
    type: BadgeType.TRUSTED_SWAPPER,
    name: "Trusted Swapper",
    description:
      "You've completed multiple successful swaps with positive feedback.",
    iconUrl: "/badges/trusted-swapper.svg",
    color: "bg-green-500",
    criteria: {
      type: "swaps",
      threshold: 5,
      description: "Complete 5 successful swaps",
    },
    rarity: "uncommon",
  },
  [BadgeType.COMMUNITY_HELPER]: {
    type: BadgeType.COMMUNITY_HELPER,
    name: "Community Helper",
    description:
      "You actively help other community members and participate in events.",
    iconUrl: "/badges/community-helper.svg",
    color: "bg-purple-500",
    criteria: {
      type: "community",
      threshold: 3,
      description: "Attend 3 community events",
    },
    rarity: "uncommon",
  },
  [BadgeType.ECO_WARRIOR]: {
    type: BadgeType.ECO_WARRIOR,
    name: "Eco Warrior",
    description:
      "You've saved significant carbon emissions through sustainable swapping.",
    iconUrl: "/badges/eco-warrior.svg",
    color: "bg-emerald-500",
    criteria: {
      type: "environmental",
      threshold: 100,
      description: "Save 100kg of CO2 through swaps",
    },
    rarity: "rare",
  },
  [BadgeType.SUPER_SAVER]: {
    type: BadgeType.SUPER_SAVER,
    name: "Super Saver",
    description:
      "You've completed an impressive number of swaps and saved money.",
    iconUrl: "/badges/super-saver.svg",
    color: "bg-yellow-500",
    criteria: {
      type: "swaps",
      threshold: 25,
      description: "Complete 25 successful swaps",
    },
    rarity: "rare",
  },
  [BadgeType.TOP_RATED]: {
    type: BadgeType.TOP_RATED,
    name: "Top Rated",
    description: "You consistently receive excellent reviews from other users.",
    iconUrl: "/badges/top-rated.svg",
    color: "bg-orange-500",
    criteria: {
      type: "reviews",
      threshold: 4.5,
      description: "Maintain 4.5+ average rating with 10+ reviews",
    },
    rarity: "epic",
  },
};
export interface TrustScoreFactors {
  successfulSwaps: number;
  averageRating: number;
  reviewCount: number;
  profileCompleteness: number;
  communityParticipation: number;
  accountAge: number;
  verificationStatus: number;
}
export const TRUST_SCORE_WEIGHTS = {
  successfulSwaps: 0.25,
  averageRating: 0.2,
  reviewCount: 0.15,
  profileCompleteness: 0.15,
  communityParticipation: 0.1,
  accountAge: 0.1,
  verificationStatus: 0.05,
};
export const calculateTrustScore = (factors: TrustScoreFactors): number => {
  const {
    successfulSwaps,
    averageRating,
    reviewCount,
    profileCompleteness,
    communityParticipation,
    accountAge,
    verificationStatus,
  } = factors;
  const normalizedSwaps = Math.min(successfulSwaps / 50, 1); 
  const normalizedRating = averageRating / 5; 
  const normalizedReviews = Math.min(reviewCount / 20, 1); 
  const normalizedProfile = profileCompleteness / 100; 
  const normalizedParticipation = Math.min(communityParticipation / 10, 1); 
  const normalizedAge = Math.min(accountAge / 365, 1); 
  const normalizedVerification = verificationStatus; 
  const score =
    normalizedSwaps * TRUST_SCORE_WEIGHTS.successfulSwaps +
    normalizedRating * TRUST_SCORE_WEIGHTS.averageRating +
    normalizedReviews * TRUST_SCORE_WEIGHTS.reviewCount +
    normalizedProfile * TRUST_SCORE_WEIGHTS.profileCompleteness +
    normalizedParticipation * TRUST_SCORE_WEIGHTS.communityParticipation +
    normalizedAge * TRUST_SCORE_WEIGHTS.accountAge +
    normalizedVerification * TRUST_SCORE_WEIGHTS.verificationStatus;
  return Math.min(Math.max(score, 0), 1); 
};
export const calculateProfileCompleteness = (user: any): number => {
  let completeness = 0;
  const factors = [
    { field: "name", weight: 15 },
    { field: "email", weight: 10 },
    { field: "location", weight: 15 },
    { field: "bio", weight: 10 },
    { field: "avatar", weight: 10 },
    { field: "phone", weight: 5 },
    { field: "security.emailVerified", weight: 10 },
    { field: "security.phoneVerified", weight: 5 },
    { field: "preferences", weight: 10 },
    { field: "stats", weight: 10 },
  ];
  factors.forEach(({ field, weight }) => {
    const value = field.includes(".")
      ? field.split(".").reduce((obj, key) => obj?.[key], user)
      : user[field];
    if (value && (typeof value === "string" ? value.trim() : true)) {
      completeness += weight;
    }
  });
  return Math.min(completeness, 100);
};
export const checkBadgeEligibility = (
  user: any,
  badgeType: BadgeType
): { eligible: boolean; progress: number; remaining: number } => {
  const config = BADGE_CONFIGS[badgeType];
  const { type, threshold } = config.criteria;
  let currentValue = 0;
  let progress = 0;
  let remaining = 0;
  switch (type) {
    case "swaps":
      currentValue = user.stats?.successfulSwaps || 0;
      break;
    case "reviews":
      const avgRating = user.stats?.rating || 0;
      const reviewCount = user.stats?.reviewCount || 0;
      currentValue = reviewCount >= 10 ? avgRating : 0;
      break;
    case "profile":
      currentValue = calculateProfileCompleteness(user);
      break;
    case "community":
      currentValue = user.stats?.eventsAttended || 0;
      break;
    case "environmental":
      currentValue = (user.stats?.successfulSwaps || 0) * 4; 
      break;
  }
  progress = Math.min((currentValue / threshold) * 100, 100);
  remaining = Math.max(threshold - currentValue, 0);
  return {
    eligible: currentValue >= threshold,
    progress,
    remaining,
  };
};
export const getEarnedBadges = (user: any): BadgeType[] => {
  return Object.values(BadgeType).filter((badgeType) => {
    const { eligible } = checkBadgeEligibility(user, badgeType);
    return eligible;
  });
};
export const getBadgeProgress = (
  user: any
): Array<{
  badgeType: BadgeType;
  config: BadgeConfig;
  progress: number;
  remaining: number;
  eligible: boolean;
}> => {
  return Object.values(BadgeType).map((badgeType) => {
    const config = BADGE_CONFIGS[badgeType];
    const { eligible, progress, remaining } = checkBadgeEligibility(
      user,
      badgeType
    );
    return {
      badgeType,
      config,
      progress,
      remaining,
      eligible,
    };
  });
};

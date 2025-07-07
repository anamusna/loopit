import {
  CATEGORY_CARBON_SAVINGS,
  CATEGORY_LANDFILL_SAVINGS,
  CATEGORY_WATER_SAVINGS,
  ENVIRONMENTAL_BADGE_THRESHOLDS,
  getCarbonSavingsForCategory,
  getEnvironmentalImpactSummary,
  getImpactLevel,
  getOffsetComparison,
  getRandomEcoTip,
  IMPACT_LEVEL_STYLES,
  OFFSET_COMPARISONS,
} from "@/constants/environmentalImpact";
import { BadgeType, Item, ItemCategory, UserProfile } from "@/shared/types";
export const calculateItemCarbonSavings = (item: Item): number => {
  if (item.environmentalImpact?.carbonSaved) {
    return item.environmentalImpact.carbonSaved;
  }
  const baseSavings = getCarbonSavingsForCategory(item.category);
  const conditionMultiplier =
    {
      excellent: 1.2,
      good: 1.0,
      fair: 0.8,
      needs_repair: 0.6,
    }[item.condition] || 1.0;
  return Math.round(baseSavings * conditionMultiplier);
};
export const calculateUserCarbonSavings = (
  user: UserProfile,
  items: Item[]
): number => {
  const userItems = items.filter((item) => item.ownerId === user.id);
  return userItems.reduce((total, item) => {
    const itemSavings = calculateItemCarbonSavings(item);
    if (item.status === "swapped") {
      return total + itemSavings;
    }
    return total;
  }, 0);
};
export const calculateCarbonSavingsByCategory = (
  items: Item[]
): Record<ItemCategory, number> => {
  const breakdown: Record<ItemCategory, number> = {
    [ItemCategory.CLOTHING]: 0,
    [ItemCategory.BOOKS]: 0,
    [ItemCategory.FURNITURE]: 0,
    [ItemCategory.ELECTRONICS]: 0,
    [ItemCategory.TOYS]: 0,
    [ItemCategory.SPORTS]: 0,
    [ItemCategory.HOUSEHOLD]: 0,
    [ItemCategory.OTHER]: 0,
  };
  items.forEach((item) => {
    if (item.status === "swapped") {
      breakdown[item.category] += calculateItemCarbonSavings(item);
    }
  });
  return breakdown;
};
export const calculateCommunityCarbonSavings = (items: Item[]): number => {
  return items
    .filter((item) => item.status === "swapped")
    .reduce((total, item) => total + calculateItemCarbonSavings(item), 0);
};
export const getEnvironmentalBadgeEligibility = (
  totalCarbonSaved: number
): {
  eligible: boolean;
  currentLevel: string;
  nextLevel: string | null;
  progress: number;
  remaining: number;
} => {
  const levels = Object.entries(ENVIRONMENTAL_BADGE_THRESHOLDS);
  const sortedLevels = levels.sort(([, a], [, b]) => a - b);
  let currentLevel = "none";
  let nextLevel: string | null = null;
  let progress = 0;
  let remaining = 0;
  for (let i = 0; i < sortedLevels.length; i++) {
    const [level, threshold] = sortedLevels[i];
    if (totalCarbonSaved >= threshold) {
      currentLevel = level;
      if (i < sortedLevels.length - 1) {
        const [nextLevelName, nextThreshold] = sortedLevels[i + 1];
        nextLevel = nextLevelName;
        progress =
          ((totalCarbonSaved - threshold) / (nextThreshold - threshold)) * 100;
        remaining = nextThreshold - totalCarbonSaved;
      } else {
        progress = 100;
        remaining = 0;
      }
    } else {
      if (i === 0) {
        nextLevel = level;
        progress = (totalCarbonSaved / threshold) * 100;
        remaining = threshold - totalCarbonSaved;
      }
      break;
    }
  }
  return {
    eligible: currentLevel !== "none",
    currentLevel,
    nextLevel,
    progress: Math.min(progress, 100),
    remaining: Math.max(remaining, 0),
  };
};
export const getBadgeLevelInfo = (level: string) => {
  const levelInfo = {
    ECO_WARRIOR_BRONZE: {
      name: "Eco Warrior Bronze",
      icon: "🥉",
      color: "text-amber-600",
      description: "Saved 50kg CO₂ through sustainable swapping",
    },
    ECO_WARRIOR_SILVER: {
      name: "Eco Warrior Silver",
      icon: "🥈",
      color: "text-gray-400",
      description: "Saved 100kg CO₂ through sustainable swapping",
    },
    ECO_WARRIOR_GOLD: {
      name: "Eco Warrior Gold",
      icon: "🥇",
      color: "text-yellow-500",
      description: "Saved 250kg CO₂ through sustainable swapping",
    },
    ECO_WARRIOR_PLATINUM: {
      name: "Eco Warrior Platinum",
      icon: "💎",
      color: "text-blue-400",
      description: "Saved 500kg CO₂ through sustainable swapping",
    },
    ECO_WARRIOR_DIAMOND: {
      name: "Eco Warrior Diamond",
      icon: "💎",
      color: "text-purple-400",
      description: "Saved 1000kg CO₂ through sustainable swapping",
    },
  };
  return (
    levelInfo[level as keyof typeof levelInfo] || {
      name: "Eco Warrior",
      icon: "🌱",
      color: "text-green-500",
      description: "Making a difference through sustainable swapping",
    }
  );
};
export const generateEnvironmentalLeaderboard = (
  users: UserProfile[],
  items: Item[],
  limit: number = 10
) => {
  const userContributions = users
    .map((user) => ({
      user,
      carbonSaved: calculateUserCarbonSavings(user, items),
      totalSwaps: items.filter(
        (item) => item.ownerId === user.id && item.status === "swapped"
      ).length,
    }))
    .filter((contribution) => contribution.carbonSaved > 0)
    .sort((a, b) => b.carbonSaved - a.carbonSaved)
    .slice(0, limit)
    .map((contribution, index) => ({
      ...contribution,
      rank: index + 1,
      rankEmoji: index < 3 ? ["🥇", "🥈", "🥉"][index] : `${index + 1}`,
    }));
  return userContributions;
};
export const getEnvironmentalStats = (items: Item[], users: UserProfile[]) => {
  const totalCarbonSaved = calculateCommunityCarbonSavings(items);
  const totalItemsSwapped = items.filter(
    (item) => item.status === "swapped"
  ).length;
  const activeUsers = users.filter((user) => user.isActive).length;
  const averageCarbonPerUser =
    activeUsers > 0 ? totalCarbonSaved / activeUsers : 0;
  const averageCarbonPerSwap =
    totalItemsSwapped > 0 ? totalCarbonSaved / totalItemsSwapped : 0;
  const breakdown = calculateCarbonSavingsByCategory(items);
  const topCategory = Object.entries(breakdown).reduce((a, b) =>
    breakdown[a[0] as ItemCategory] > breakdown[b[0] as ItemCategory] ? a : b
  );
  return {
    totalCarbonSaved,
    totalItemsSwapped,
    activeUsers,
    averageCarbonPerUser,
    averageCarbonPerSwap,
    breakdown,
    topCategory: {
      category: topCategory[0] as ItemCategory,
      carbonSaved: topCategory[1],
    },
    impactSummary: getEnvironmentalImpactSummary(totalCarbonSaved),
  };
};
export const getItemEnvironmentalImpact = (item: Item) => {
  const carbonSaved = calculateItemCarbonSavings(item);
  const impactLevel = getImpactLevel(carbonSaved);
  const styles = IMPACT_LEVEL_STYLES[impactLevel];
  const offset = getOffsetComparison(carbonSaved);
  return {
    carbonSaved,
    impactLevel,
    styles,
    offset,
    summary: getEnvironmentalImpactSummary(carbonSaved),
  };
};
export const getUserEnvironmentalImpact = (
  user: UserProfile,
  items: Item[]
) => {
  const totalCarbonSaved = calculateUserCarbonSavings(user, items);
  const impactSummary = getEnvironmentalImpactSummary(totalCarbonSaved);
  const impactLevel = getImpactLevel(totalCarbonSaved);
  const impactStyles = IMPACT_LEVEL_STYLES[impactLevel];
  const categoryBreakdown = items
    .filter((item) => item.ownerId === user.id && item.status === "swapped")
    .reduce((acc, item) => {
      const category = item.category;
      const savings = calculateItemCarbonSavings(item);
      if (!acc[category]) {
        acc[category] = { count: 0, totalSaved: 0 };
      }
      acc[category].count += 1;
      acc[category].totalSaved += savings;
      return acc;
    }, {} as Record<ItemCategory, { count: number; totalSaved: number }>);
  return {
    totalCarbonSaved,
    impactSummary,
    impactLevel,
    impactStyles,
    categoryBreakdown,
    offsetComparisons: getOffsetComparison(totalCarbonSaved),
  };
};
export const formatEnvironmentalData = {
  carbon: (kgCO2: number) => {
    if (kgCO2 >= 1000) {
      return `${(kgCO2 / 1000).toFixed(1)}t CO₂`;
    }
    return `${Math.round(kgCO2)}kg CO₂`;
  },
  percentage: (value: number, total: number) => {
    if (total === 0) return "0%";
    return `${Math.round((value / total) * 100)}%`;
  },
  rank: (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  },
  comparison: (kgCO2: number) => {
    const offset = getOffsetComparison(kgCO2);
    if (offset.carRides > 1) {
      return `Equivalent to skipping ${offset.carRides} car rides`;
    }
    if (Number(offset.homeDays) > 1) {
      return `Equivalent to powering a home for ${offset.homeDays} days`;
    }
    if (offset.treeDays > 1) {
      return `Equivalent to ${offset.treeDays} trees absorbing CO₂ for a day`;
    }
    return `Equivalent to ${offset.coffeeCups} cups of coffee`;
  },
};
export const generateEnvironmentalShareCard = (
  user: UserProfile,
  carbonSaved: number,
  badgeLevel?: string
) => {
  const impactSummary = getEnvironmentalImpactSummary(carbonSaved);
  const badgeInfo = badgeLevel ? getBadgeLevelInfo(badgeLevel) : null;
  return {
    username: user.name,
    avatar: user.avatar,
    carbonSaved: impactSummary.carbonSaved,
    comparison: impactSummary.primaryComparison,
    badge: badgeInfo,
    timestamp: new Date().toISOString(),
    platform: "LoopIt",
  };
};
export const checkEnvironmentalBadgeEligibility = (
  user: UserProfile,
  items: Item[]
): {
  eligible: boolean;
  progress: number;
  remaining: number;
  badgeType: BadgeType;
} => {
  const totalCarbonSaved = calculateUserCarbonSavings(user, items);
  const thresholds = Object.entries(ENVIRONMENTAL_BADGE_THRESHOLDS).sort(
    ([, a], [, b]) => (b as number) - (a as number)
  );
  for (const [badgeKey, threshold] of thresholds) {
    if (totalCarbonSaved >= (threshold as number)) {
      const badgeType = BadgeType.ECO_WARRIOR;
      const progress = Math.min(
        (totalCarbonSaved / (threshold as number)) * 100,
        100
      );
      const remaining = Math.max((threshold as number) - totalCarbonSaved, 0);
      return {
        eligible: true,
        progress,
        remaining,
        badgeType,
      };
    }
  }
  const nextThreshold = ENVIRONMENTAL_BADGE_THRESHOLDS.ECO_WARRIOR_BRONZE;
  const progress = Math.min((totalCarbonSaved / nextThreshold) * 100, 100);
  const remaining = Math.max(nextThreshold - totalCarbonSaved, 0);
  return {
    eligible: false,
    progress,
    remaining,
    badgeType: BadgeType.ECO_WARRIOR,
  };
};
export const getEnvironmentalBadgeProgress = (
  user: UserProfile,
  items: Item[]
) => {
  const totalCarbonSaved = calculateUserCarbonSavings(user, items);
  return Object.entries(ENVIRONMENTAL_BADGE_THRESHOLDS).map(
    ([level, threshold]) => {
      const progress = Math.min((totalCarbonSaved / threshold) * 100, 100);
      const remaining = Math.max(threshold - totalCarbonSaved, 0);
      const achieved = totalCarbonSaved >= threshold;
      return {
        level: level.replace("ECO_WARRIOR_", "").toLowerCase(),
        threshold,
        progress,
        remaining,
        achieved,
        carbonSaved: totalCarbonSaved,
      };
    }
  );
};
export const getContextualEcoTip = (category?: ItemCategory): string => {
  return getRandomEcoTip();
};
export const getPersonalEnvironmentalInsights = (
  user: UserProfile,
  items: Item[]
): string[] => {
  const impact = getUserEnvironmentalImpact(user, items);
  const insights: string[] = [];
  if (impact.totalCarbonSaved > 0) {
    insights.push(
      `You've saved ${impact.impactSummary.carbonSaved} through sustainable swapping!`
    );
    if (impact.offsetComparisons.carRides > 1) {
      insights.push(
        `That's equivalent to skipping ${impact.offsetComparisons.carRides} car rides!`
      );
    }
    if (Number(impact.offsetComparisons.homeDays) > 1) {
      insights.push(
        `Or powering a home for ${impact.offsetComparisons.homeDays} days!`
      );
    }
  }
  const topCategory = Object.entries(impact.categoryBreakdown).sort(
    ([, a], [, b]) => b.totalSaved - a.totalSaved
  )[0];
  if (topCategory) {
    const [category, data] = topCategory;
    insights.push(
      `Your top impact category is ${category} with ${data.count} items swapped!`
    );
  }
  return insights;
};
export const generateEnvironmentalShareData = (
  user: UserProfile,
  items: Item[]
) => {
  const impact = getUserEnvironmentalImpact(user, items);
  const badgeEligibility = checkEnvironmentalBadgeEligibility(user, items);
  return {
    username: user.name,
    totalCarbonSaved: impact.totalCarbonSaved,
    carbonFormatted: impact.impactSummary.carbonSaved,
    primaryComparison: impact.impactSummary.primaryComparison,
    badgeAchieved: badgeEligibility.eligible,
    badgeType: badgeEligibility.badgeType,
    totalSwaps: items.filter(
      (item) => item.ownerId === user.id && item.status === "swapped"
    ).length,
    impactLevel: impact.impactLevel,
    shareText: `I've saved ${impact.impactSummary.carbonSaved} through sustainable swapping on LoopIt! ${impact.impactSummary.primaryComparison} 🌱♻️`,
  };
};
export const formatCarbonSavings = (kgCO2: number): string => {
  if (kgCO2 >= 1000) {
    return `${(kgCO2 / 1000).toFixed(1)}t CO₂`;
  }
  return `${Math.round(kgCO2)}kg CO₂`;
};
export const getImpactLevelStyling = (kgCO2: number) => {
  const level = getImpactLevel(kgCO2);
  return IMPACT_LEVEL_STYLES[level];
};
export const calculateEnvironmentalScore = (
  user: UserProfile,
  items: Item[]
): number => {
  const totalCarbonSaved = calculateUserCarbonSavings(user, items);
  const totalSwaps = items.filter(
    (item) => item.ownerId === user.id && item.status === "swapped"
  ).length;
  const carbonScore = Math.min((totalCarbonSaved / 100) * 50, 50); 
  const swapScore = Math.min((totalSwaps / 20) * 30, 30); 
  const consistencyScore = totalSwaps > 0 ? 20 : 0; 
  return Math.round(carbonScore + swapScore + consistencyScore);
};
export const calculateItemEnvironmentalImpact = (category: ItemCategory) => {
  const carbonSaved =
    CATEGORY_CARBON_SAVINGS[category] ||
    CATEGORY_CARBON_SAVINGS[ItemCategory.OTHER];
  const waterSaved =
    CATEGORY_WATER_SAVINGS[category] ||
    CATEGORY_WATER_SAVINGS[ItemCategory.OTHER];
  const landfillSaved =
    CATEGORY_LANDFILL_SAVINGS[category] ||
    CATEGORY_LANDFILL_SAVINGS[ItemCategory.OTHER];
  const offsetComparisons = {
    carRides: Math.round(carbonSaved / OFFSET_COMPARISONS.CAR_RIDES),
    flightHours: Number(
      (carbonSaved / OFFSET_COMPARISONS.FLIGHT_HOURS).toFixed(1)
    ),
    homeDays: Number((carbonSaved / OFFSET_COMPARISONS.HOME_DAYS).toFixed(1)),
    treeDays: Math.round(carbonSaved / OFFSET_COMPARISONS.TREE_DAYS),
    lightbulbHours: Math.round(
      carbonSaved / OFFSET_COMPARISONS.LIGHTBULB_HOURS
    ),
    showerMinutes: Math.round(carbonSaved / OFFSET_COMPARISONS.SHOWER_MINUTES),
    meatMeals: Math.round(carbonSaved / OFFSET_COMPARISONS.MEAT_MEALS),
    coffeeCups: Math.round(carbonSaved / OFFSET_COMPARISONS.COFFEE_CUPS),
  };
  return {
    carbonSaved,
    waterSaved,
    landfillSaved,
    offsetComparisons,
  };
};
export const calculateUserEnvironmentalStats = (totalCarbonSaved: number) => {
  let ecoWarriorLevel = "None";
  if (totalCarbonSaved >= ENVIRONMENTAL_BADGE_THRESHOLDS.ECO_WARRIOR_DIAMOND) {
    ecoWarriorLevel = "Diamond";
  } else if (
    totalCarbonSaved >= ENVIRONMENTAL_BADGE_THRESHOLDS.ECO_WARRIOR_PLATINUM
  ) {
    ecoWarriorLevel = "Platinum";
  } else if (
    totalCarbonSaved >= ENVIRONMENTAL_BADGE_THRESHOLDS.ECO_WARRIOR_GOLD
  ) {
    ecoWarriorLevel = "Gold";
  } else if (
    totalCarbonSaved >= ENVIRONMENTAL_BADGE_THRESHOLDS.ECO_WARRIOR_SILVER
  ) {
    ecoWarriorLevel = "Silver";
  } else if (
    totalCarbonSaved >= ENVIRONMENTAL_BADGE_THRESHOLDS.ECO_WARRIOR_BRONZE
  ) {
    ecoWarriorLevel = "Bronze";
  }
  return ecoWarriorLevel;
};
export const formatEnvironmentalImpact = (impact: {
  carbonSaved: number;
  waterSaved: number;
  landfillSaved: number;
}) => {
  return {
    carbonSaved:
      impact.carbonSaved >= 1000
        ? `${(impact.carbonSaved / 1000).toFixed(1)}t CO₂`
        : `${Math.round(impact.carbonSaved)}kg CO₂`,
    waterSaved:
      impact.waterSaved >= 1000
        ? `${(impact.waterSaved / 1000).toFixed(1)}kL`
        : `${Math.round(impact.waterSaved)}L`,
    landfillSaved: `${impact.landfillSaved.toFixed(2)}m³`,
  };
};
export const getImpactComparison = (carbonSaved: number) => {
  const comparisons = [
    carbonSaved / OFFSET_COMPARISONS.CAR_RIDES >= 1
      ? `${Math.round(carbonSaved / OFFSET_COMPARISONS.CAR_RIDES)} car rides`
      : null,
    carbonSaved / OFFSET_COMPARISONS.HOME_DAYS >= 1
      ? `${Math.round(
          carbonSaved / OFFSET_COMPARISONS.HOME_DAYS
        )} days of home energy`
      : null,
    carbonSaved / OFFSET_COMPARISONS.TREE_DAYS >= 1
      ? `${Math.round(
          carbonSaved / OFFSET_COMPARISONS.TREE_DAYS
        )} days of tree growth`
      : null,
  ].filter(Boolean);
  return comparisons.length > 0
    ? `Equivalent to ${comparisons[0]}`
    : "Every small action counts!";
};

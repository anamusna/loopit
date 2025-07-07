import { ItemCategory } from "@/shared/types";
export const CATEGORY_CARBON_SAVINGS: Record<ItemCategory, number> = {
  [ItemCategory.ELECTRONICS]: 25, 
  [ItemCategory.FURNITURE]: 20, 
  [ItemCategory.CLOTHING]: 15, 
  [ItemCategory.BOOKS]: 8, 
  [ItemCategory.SPORTS]: 12, 
  [ItemCategory.TOYS]: 10, 
  [ItemCategory.HOUSEHOLD]: 18, 
  [ItemCategory.OTHER]: 12, 
};
export const CATEGORY_WATER_SAVINGS: Record<ItemCategory, number> = {
  [ItemCategory.ELECTRONICS]: 1500, 
  [ItemCategory.FURNITURE]: 800, 
  [ItemCategory.CLOTHING]: 2500, 
  [ItemCategory.BOOKS]: 200, 
  [ItemCategory.SPORTS]: 600, 
  [ItemCategory.TOYS]: 400, 
  [ItemCategory.HOUSEHOLD]: 1000, 
  [ItemCategory.OTHER]: 500, 
};
export const CATEGORY_LANDFILL_SAVINGS: Record<ItemCategory, number> = {
  [ItemCategory.ELECTRONICS]: 0.05, 
  [ItemCategory.FURNITURE]: 0.3, 
  [ItemCategory.CLOTHING]: 0.02, 
  [ItemCategory.BOOKS]: 0.01, 
  [ItemCategory.SPORTS]: 0.08, 
  [ItemCategory.TOYS]: 0.03, 
  [ItemCategory.HOUSEHOLD]: 0.1, 
  [ItemCategory.OTHER]: 0.05, 
};
export const OFFSET_COMPARISONS = {
  CAR_RIDES: 0.4, 
  FLIGHT_HOURS: 90, 
  HOME_DAYS: 5, 
  TREE_DAYS: 0.022, 
  LIGHTBULB_HOURS: 0.0004, 
  SHOWER_MINUTES: 0.1, 
  MEAT_MEALS: 2.5, 
  COFFEE_CUPS: 0.2, 
};
export const ECO_TIPS: Record<ItemCategory, string[]> = {
  [ItemCategory.ELECTRONICS]: [
    "Reusing electronics saves rare earth metals and reduces e-waste",
    "One smartphone swap saves enough energy to power a home for 3 days",
    "Electronics manufacturing uses 1,500 liters of water per device",
  ],
  [ItemCategory.FURNITURE]: [
    "Furniture reuse prevents deforestation and saves manufacturing energy",
    "One furniture swap saves enough wood to make 50 sheets of paper",
    "Furniture production releases 20kg of CO2 per item on average",
  ],
  [ItemCategory.CLOTHING]: [
    "Second-hand clothing saves 2,500 liters of water per item",
    "Fast fashion produces 10% of global carbon emissions",
    "One clothing swap saves enough water for 3 weeks of showers",
  ],
  [ItemCategory.BOOKS]: [
    "Book sharing reduces paper waste and saves trees",
    "One book swap saves enough paper for 50 sheets",
    "Publishing industry uses 32 million trees annually",
  ],
  [ItemCategory.SPORTS]: [
    "Sports equipment reuse extends product life and reduces waste",
    "One sports item swap saves manufacturing energy for 2 hours",
    "Sports equipment often contains non-recyclable materials",
  ],
  [ItemCategory.TOYS]: [
    "Toy swapping reduces plastic waste and saves resources",
    "One toy swap prevents 10 plastic bottles worth of waste",
    "Children outgrow toys quickly - perfect for sharing!",
  ],
  [ItemCategory.HOUSEHOLD]: [
    "Household item reuse reduces manufacturing demand",
    "One household swap saves enough energy to charge a phone 50 times",
    "Household items often end up in landfills unnecessarily",
  ],
  [ItemCategory.OTHER]: [
    "Every swap counts towards a more sustainable future",
    "Reusing items reduces the need for new manufacturing",
    "Small actions add up to big environmental impact",
  ],
};
export const GENERAL_ECO_TIPS = [
  "Every swap reduces carbon emissions and saves resources",
  "Local swapping reduces transportation emissions",
  "Quality items last longer and reduce waste",
  "Repairing items extends their useful life",
  "Sharing with neighbors builds community connections",
  "Sustainable consumption starts with reuse",
  "Small changes create big environmental impact",
  "Together we can reduce waste and save the planet",
];
export const ENVIRONMENTAL_BADGE_THRESHOLDS = {
  ECO_WARRIOR_BRONZE: 50, 
  ECO_WARRIOR_SILVER: 100, 
  ECO_WARRIOR_GOLD: 250, 
  ECO_WARRIOR_PLATINUM: 500, 
  ECO_WARRIOR_DIAMOND: 1000, 
};
export const getCarbonSavingsForCategory = (category: ItemCategory): number => {
  return (
    CATEGORY_CARBON_SAVINGS[category] ||
    CATEGORY_CARBON_SAVINGS[ItemCategory.OTHER]
  );
};
export const getWaterSavingsForCategory = (category: ItemCategory): number => {
  return (
    CATEGORY_WATER_SAVINGS[category] ||
    CATEGORY_WATER_SAVINGS[ItemCategory.OTHER]
  );
};
export const getLandfillSavingsForCategory = (
  category: ItemCategory
): number => {
  return (
    CATEGORY_LANDFILL_SAVINGS[category] ||
    CATEGORY_LANDFILL_SAVINGS[ItemCategory.OTHER]
  );
};
export const getOffsetComparison = (kgCO2: number) => {
  return {
    carRides: Math.round(kgCO2 / OFFSET_COMPARISONS.CAR_RIDES),
    flightHours: (kgCO2 / OFFSET_COMPARISONS.FLIGHT_HOURS).toFixed(1),
    homeDays: (kgCO2 / OFFSET_COMPARISONS.HOME_DAYS).toFixed(1),
    treeDays: Math.round(kgCO2 / OFFSET_COMPARISONS.TREE_DAYS),
    lightbulbHours: Math.round(kgCO2 / OFFSET_COMPARISONS.LIGHTBULB_HOURS),
    showerMinutes: Math.round(kgCO2 / OFFSET_COMPARISONS.SHOWER_MINUTES),
    meatMeals: Math.round(kgCO2 / OFFSET_COMPARISONS.MEAT_MEALS),
    coffeeCups: Math.round(kgCO2 / OFFSET_COMPARISONS.COFFEE_CUPS),
  };
};
export const getEcoTip = (category?: ItemCategory): string => {
  if (category && ECO_TIPS[category]) {
    const tips = ECO_TIPS[category];
    return tips[Math.floor(Math.random() * tips.length)];
  }
  return GENERAL_ECO_TIPS[Math.floor(Math.random() * GENERAL_ECO_TIPS.length)];
};
export const getRandomEcoTip = (): string => {
  const allTips = Object.values(ECO_TIPS).flat().concat(GENERAL_ECO_TIPS);
  return allTips[Math.floor(Math.random() * allTips.length)];
};
export const formatCarbonSavings = (kgCO2: number): string => {
  if (kgCO2 >= 1000) {
    return `${(kgCO2 / 1000).toFixed(1)}t CO₂`;
  }
  return `${Math.round(kgCO2)}kg CO₂`;
};
export const formatWaterSavings = (liters: number): string => {
  if (liters >= 1000) {
    return `${(liters / 1000).toFixed(1)}kL`;
  }
  return `${Math.round(liters)}L`;
};
export const getEnvironmentalImpactSummary = (kgCO2: number) => {
  const offset = getOffsetComparison(kgCO2);
  return {
    carbonSaved: formatCarbonSavings(kgCO2),
    equivalentCarRides: offset.carRides,
    equivalentFlightHours: offset.flightHours,
    equivalentHomeDays: offset.homeDays,
    equivalentTreeDays: offset.treeDays,
    primaryComparison:
      offset.carRides > 1
        ? `Equivalent to skipping ${offset.carRides} car rides`
        : `Equivalent to powering a home for ${offset.homeDays} days`,
  };
};
export const getImpactLevel = (
  kgCO2: number
): "low" | "medium" | "high" | "very-high" => {
  if (kgCO2 < 10) return "low";
  if (kgCO2 < 25) return "medium";
  if (kgCO2 < 50) return "high";
  return "very-high";
};
export const IMPACT_LEVEL_STYLES = {
  low: {
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/20",
    icon: "🌱",
  },
  medium: {
    color: "text-success",
    bgColor: "bg-success/15",
    borderColor: "border-success/30",
    icon: "♻️",
  },
  high: {
    color: "text-success",
    bgColor: "bg-success/20",
    borderColor: "border-success/40",
    icon: "🌿",
  },
  "very-high": {
    color: "text-success",
    bgColor: "bg-success/25",
    borderColor: "border-success/50",
    icon: "🌳",
  },
};

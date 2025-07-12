import { ItemCategory, ItemCondition } from "@/shared/types";
export const DISTANCE_OPTIONS = [
  { value: 1, label: "1 km", description: "Very local" },
  { value: 5, label: "5 km", description: "Local area" },
  { value: 10, label: "10 km", description: "City area" },
  { value: 25, label: "25 km", description: "Metropolitan" },
  { value: 50, label: "50 km", description: "Regional" },
  { value: 100, label: "100 km", description: "Wide area" },
];
export const PRICE_RANGE_OPTIONS = [
  { value: "free", label: "Free", description: "No cost items" },
  { value: "low", label: "Low Value", description: "Under $50" },
  { value: "medium", label: "Medium Value", description: "$50 - $200" },
  { value: "high", label: "High Value", description: "Over $200" },
  { value: "custom", label: "Custom Range", description: "Set your own" },
];
export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First", icon: "🆕" },
  { value: "oldest", label: "Oldest First", icon: "📅" },
  { value: "distance", label: "Nearest First", icon: "📍" },
  { value: "popular", label: "Most Popular", icon: "🔥" },
  { value: "carbon", label: "Highest Carbon Impact", icon: "🌱" },
  { value: "condition", label: "Best Condition", icon: "⭐" },
];
export const VIEW_MODE_OPTIONS = [
  { value: "grid", label: "Grid View", icon: "⊞" },
  { value: "list", label: "List View", icon: "☰" },
  { value: "masonry", label: "Masonry", icon: "▤" },
];
export const CATEGORY_ICONS: Record<ItemCategory, string> = {
  [ItemCategory.CLOTHING]: "👕",
  [ItemCategory.BOOKS]: "📚",
  [ItemCategory.FURNITURE]: "🪑",
  [ItemCategory.ELECTRONICS]: "📱",
  [ItemCategory.TOYS]: "🧸",
  [ItemCategory.SPORTS]: "⚽",
  [ItemCategory.HOUSEHOLD]: "🏠",
  [ItemCategory.OTHER]: "📦",
};
export const CONDITION_ICONS: Record<
  ItemCondition,
  { icon: string; color: string }
> = {
  [ItemCondition.EXCELLENT]: { icon: "✨", color: "text-success" },
  [ItemCondition.GOOD]: { icon: "👍", color: "text-primary" },
  [ItemCondition.FAIR]: { icon: "⚠️", color: "text-warning" },
  [ItemCondition.NEEDS_REPAIR]: { icon: "🔧", color: "text-destructive" },
};
export const SAVED_SEARCH_TEMPLATES = [
  {
    id: "electronics-nearby",
    name: "Electronics Nearby",
    description: "Find electronics within 10km",
    filters: {
      category: ItemCategory.ELECTRONICS,
      radius: 10,
    },
  },
  {
    id: "furniture-excellent",
    name: "Excellent Furniture",
    description: "High-quality furniture items",
    filters: {
      category: ItemCategory.FURNITURE,
      condition: ItemCondition.EXCELLENT,
    },
  },
  {
    id: "free-items",
    name: "Free Items",
    description: "All free items in your area",
    filters: {
      priceRange: { min: 0, max: 0 },
    },
  },
];
export const SEARCH_SUGGESTIONS = [
  "electronics",
  "furniture",
  "books",
  "clothing",
  "toys",
  "sports",
  "household",
  "macbook",
  "laptop",
  "smartphone",
  "coffee table",
  "office chair",
  "dress",
  "kaftan",
  "football boots",
  "basketball",
  "kitchen utensils",
  "garden tools",
  "djembe drum",
  "yoga mat",
  "dinnerware",
  "banjul",
  "serrekunda",
  "brikama",
  "kanifing",
  "bakau",
  "gunjur",
  "farafenni",
  "excellent",
  "good",
  "fair",
  "needs repair",
  "traditional",
  "handmade",
  "vintage",
  "professional",
  "ergonomic",
  "portable",
  "adjustable",
  "complete set",
  "authentic",
  "cultural",
];
export const FILTER_PRESETS = [
  {
    id: "trending",
    name: "Trending",
    description: "Popular electronics in Banjul",
    icon: "🔥",
  },
  {
    id: "eco-friendly",
    name: "Eco-Friendly",
    description: "Excellent electronics in Serrekunda",
    icon: "🌱",
  },
  {
    id: "new-arrivals",
    name: "New Arrivals",
    description: "Recent items in Kanifing",
    icon: "🆕",
  },
  {
    id: "ending-soon",
    name: "Ending Soon",
    description: "Clothing expiring soon in Bakau",
    icon: "⏰",
  },
];
export const SEARCH_HISTORY_KEY = "loopit_search_history";
export const SAVED_SEARCHES_KEY = "loopit_saved_searches";
export const MAX_SEARCH_HISTORY = 20;
export const MAX_SAVED_SEARCHES = 10;
export const DEFAULT_ITEMS_PER_PAGE = 24;
export const MAX_ITEMS_PER_PAGE = 100;
export const SEARCH_DEBOUNCE_MS = 300;
export const LOCATION_DETECTION_TIMEOUT = 10000;
export const DEFAULT_LOCATION_RADIUS = 10;
export const RECOMMENDATION_WEIGHTS = {
  category: 0.3,
  location: 0.25,
  condition: 0.2,
  popularity: 0.15,
  recency: 0.1,
};
export const SEARCH_EVENTS = {
  SEARCH_PERFORMED: "search_performed",
  FILTER_APPLIED: "filter_applied",
  SEARCH_SAVED: "search_saved",
  ITEM_VIEWED: "item_viewed",
  ITEM_SAVED: "item_saved",
  COMPARISON_STARTED: "comparison_started",
} as const;

import {
  MAX_SAVED_SEARCHES,
  MAX_SEARCH_HISTORY,
  RECOMMENDATION_WEIGHTS,
  SAVED_SEARCHES_KEY,
  SEARCH_HISTORY_KEY,
} from "@/constants/searchFilters";
import { Item, SearchFilters } from "@/shared/types";
export interface SearchHistoryItem {
  query: string;
  filters: SearchFilters;
  timestamp: number;
  resultCount: number;
}
export interface SavedSearch {
  id: string;
  name: string;
  description?: string;
  query: string;
  filters: SearchFilters;
  createdAt: number;
  lastUsed: number;
  useCount: number;
}
export const getSearchHistory = (): SearchHistoryItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error reading search history:", error);
    return [];
  }
};
export const addToSearchHistory = (
  query: string,
  filters: SearchFilters,
  resultCount: number
): void => {
  if (typeof window === "undefined") return;
  try {
    const history = getSearchHistory();
    const newEntry: SearchHistoryItem = {
      query,
      filters,
      timestamp: Date.now(),
      resultCount,
    };
    const filteredHistory = history.filter(
      (item) =>
        !(
          item.query === query &&
          JSON.stringify(item.filters) === JSON.stringify(filters)
        )
    );
    const updatedHistory = [newEntry, ...filteredHistory].slice(
      0,
      MAX_SEARCH_HISTORY
    );
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Error saving search history:", error);
  }
};
export const clearSearchHistory = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SEARCH_HISTORY_KEY);
};
export const getSavedSearches = (): SavedSearch[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(SAVED_SEARCHES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error reading saved searches:", error);
    return [];
  }
};
export const saveSearch = (
  name: string,
  query: string,
  filters: SearchFilters,
  description?: string
): string => {
  if (typeof window === "undefined") return "";
  try {
    const savedSearches = getSavedSearches();
    const newSearch: SavedSearch = {
      id: `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      query,
      filters,
      createdAt: Date.now(),
      lastUsed: Date.now(),
      useCount: 1,
    };
    const updatedSearches = [newSearch, ...savedSearches].slice(
      0,
      MAX_SAVED_SEARCHES
    );
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updatedSearches));
    return newSearch.id;
  } catch (error) {
    console.error("Error saving search:", error);
    return "";
  }
};
export const updateSavedSearchUsage = (id: string): void => {
  if (typeof window === "undefined") return;
  try {
    const savedSearches = getSavedSearches();
    const updatedSearches = savedSearches.map((search) =>
      search.id === id
        ? { ...search, lastUsed: Date.now(), useCount: search.useCount + 1 }
        : search
    );
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updatedSearches));
  } catch (error) {
    console.error("Error updating saved search usage:", error);
  }
};
export const deleteSavedSearch = (id: string): void => {
  if (typeof window === "undefined") return;
  try {
    const savedSearches = getSavedSearches();
    const updatedSearches = savedSearches.filter((search) => search.id !== id);
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updatedSearches));
  } catch (error) {
    console.error("Error deleting saved search:", error);
  }
};
export const filterItems = (
  items: Item[],
  filters: SearchFilters,
  userLocation?: { lat: number; lng: number }
): Item[] => {
  let filteredItems = [...items];
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filteredItems = filteredItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        item.category.toLowerCase().includes(query)
    );
  }
  if (filters.category) {
    filteredItems = filteredItems.filter(
      (item) => item.category === filters.category
    );
  }
  if (filters.condition) {
    filteredItems = filteredItems.filter(
      (item) => item.condition === filters.condition
    );
  }
  if (filters.location && filters.radius && userLocation) {
    filteredItems = filteredItems.filter((item) => {
      if (!item.coordinates) return false;
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        item.coordinates.lat,
        item.coordinates.lng
      );
      return distance <= filters.radius!;
    });
  }
  if (filters.priceRange) {
  }
  return filteredItems;
};
export const sortItems = (items: Item[], sortBy: string): Item[] => {
  const sortedItems = [...items];
  switch (sortBy) {
    case "newest":
      return sortedItems.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "oldest":
      return sortedItems.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case "popular":
      return sortedItems.sort(
        (a, b) => b.views + b.saves - (a.views + a.saves)
      );
    case "carbon":
      return sortedItems.sort(
        (a, b) =>
          (b.environmentalImpact?.carbonSaved || 0) -
          (a.environmentalImpact?.carbonSaved || 0)
      );
    case "condition":
      const conditionOrder = {
        excellent: 4,
        good: 3,
        fair: 2,
        needs_repair: 1,
      };
      return sortedItems.sort(
        (a, b) =>
          (conditionOrder[b.condition as keyof typeof conditionOrder] || 0) -
          (conditionOrder[a.condition as keyof typeof conditionOrder] || 0)
      );
    default:
      return sortedItems;
  }
};
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
export const generateRecommendations = (
  items: Item[],
  userProfile?: {
    interests?: string[];
    location?: string;
    pastSearches?: string[];
    savedItems?: string[];
  },
  limit: number = 10
): Item[] => {
  if (!userProfile) {
    return items
      .sort((a, b) => b.views + b.saves - (a.views + a.saves))
      .slice(0, limit);
  }
  const scoredItems = items.map((item) => {
    let score = 0;
    if (userProfile.interests) {
      const categoryMatch = userProfile.interests.some((interest) =>
        item.category.toLowerCase().includes(interest.toLowerCase())
      );
      if (categoryMatch) score += RECOMMENDATION_WEIGHTS.category;
    }
    if (userProfile.location && item.location) {
      const locationMatch = item.location
        .toLowerCase()
        .includes(userProfile.location.toLowerCase());
      if (locationMatch) score += RECOMMENDATION_WEIGHTS.location;
    }
    const conditionScore =
      {
        excellent: 1.0,
        good: 0.8,
        fair: 0.6,
        needs_repair: 0.4,
      }[item.condition] || 0.5;
    score += conditionScore * RECOMMENDATION_WEIGHTS.condition;
    const popularityScore = Math.min((item.views + item.saves) / 100, 1);
    score += popularityScore * RECOMMENDATION_WEIGHTS.popularity;
    const daysSinceCreation =
      (Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 1 - daysSinceCreation / 30); 
    score += recencyScore * RECOMMENDATION_WEIGHTS.recency;
    return { item, score };
  });
  return scoredItems
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
};
export const getSearchSuggestions = (
  query: string,
  items: Item[],
  limit: number = 5
): string[] => {
  if (!query.trim()) return [];
  const suggestions = new Set<string>();
  const queryLower = query.toLowerCase();
  items.forEach((item) => {
    if (item.category.toLowerCase().includes(queryLower)) {
      suggestions.add(item.category);
    }
  });
  items.forEach((item) => {
    item.tags.forEach((tag) => {
      if (tag.toLowerCase().includes(queryLower)) {
        suggestions.add(tag);
      }
    });
  });
  items.forEach((item) => {
    if (item.location.toLowerCase().includes(queryLower)) {
      suggestions.add(item.location);
    }
  });
  return Array.from(suggestions).slice(0, limit);
};
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
export const trackSearchEvent = (
  event: string,
  data: Record<string, any>
): void => {
  console.log("Search Analytics:", { event, data, timestamp: Date.now() });
};

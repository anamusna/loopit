import { Item, ItemStatus } from "@/shared/types";
export interface ItemStatusTransition {
  from: ItemStatus;
  to: ItemStatus;
  allowed: boolean;
  requiresConfirmation?: boolean;
  message?: string;
}
export const ITEM_STATUS_TRANSITIONS: Record<
  ItemStatus,
  ItemStatusTransition[]
> = {
  [ItemStatus.DRAFT]: [
    { from: ItemStatus.DRAFT, to: ItemStatus.AVAILABLE, allowed: true },
    { from: ItemStatus.DRAFT, to: ItemStatus.REMOVED, allowed: true },
  ],
  [ItemStatus.AVAILABLE]: [
    { from: ItemStatus.AVAILABLE, to: ItemStatus.REQUESTED, allowed: true },
    { from: ItemStatus.AVAILABLE, to: ItemStatus.EXPIRED, allowed: true },
    { from: ItemStatus.AVAILABLE, to: ItemStatus.PENDING, allowed: true },
    {
      from: ItemStatus.AVAILABLE,
      to: ItemStatus.REMOVED,
      allowed: true,
      requiresConfirmation: true,
      message: "Are you sure you want to remove this item?",
    },
  ],
  [ItemStatus.REQUESTED]: [
    { from: ItemStatus.REQUESTED, to: ItemStatus.AVAILABLE, allowed: true },
    { from: ItemStatus.REQUESTED, to: ItemStatus.PENDING, allowed: true },
    { from: ItemStatus.REQUESTED, to: ItemStatus.SWAPPED, allowed: true },
    { from: ItemStatus.REQUESTED, to: ItemStatus.REJECTED, allowed: true },
    {
      from: ItemStatus.REQUESTED,
      to: ItemStatus.REMOVED,
      allowed: true,
      requiresConfirmation: true,
      message: "Are you sure you want to remove this item?",
    },
  ],
  [ItemStatus.SWAPPED]: [
    { from: ItemStatus.SWAPPED, to: ItemStatus.AVAILABLE, allowed: false },
    { from: ItemStatus.SWAPPED, to: ItemStatus.REMOVED, allowed: true },
  ],
  [ItemStatus.EXPIRED]: [
    { from: ItemStatus.EXPIRED, to: ItemStatus.AVAILABLE, allowed: true },
    { from: ItemStatus.EXPIRED, to: ItemStatus.REMOVED, allowed: true },
  ],
  [ItemStatus.REMOVED]: [
    { from: ItemStatus.REMOVED, to: ItemStatus.AVAILABLE, allowed: true },
  ],
  [ItemStatus.PENDING]: [
    { from: ItemStatus.PENDING, to: ItemStatus.AVAILABLE, allowed: true },
    { from: ItemStatus.PENDING, to: ItemStatus.REQUESTED, allowed: true },
    { from: ItemStatus.PENDING, to: ItemStatus.SWAPPED, allowed: true },
    { from: ItemStatus.PENDING, to: ItemStatus.REJECTED, allowed: true },
  ],
  [ItemStatus.REPORTED]: [
    { from: ItemStatus.REPORTED, to: ItemStatus.AVAILABLE, allowed: true },
    { from: ItemStatus.REPORTED, to: ItemStatus.REMOVED, allowed: true },
    {
      from: ItemStatus.REPORTED,
      to: ItemStatus.REJECTED,
      allowed: true,
      requiresConfirmation: true,
      message: "Are you sure you want to reject this report?",
    },
  ],
  [ItemStatus.REJECTED]: [
    { from: ItemStatus.REJECTED, to: ItemStatus.AVAILABLE, allowed: true },
    { from: ItemStatus.REJECTED, to: ItemStatus.REMOVED, allowed: true },
  ],
};
export const canTransitionStatus = (
  from: ItemStatus,
  to: ItemStatus
): boolean => {
  const transitions = ITEM_STATUS_TRANSITIONS[from];
  return transitions.some(
    (transition) => transition.to === to && transition.allowed
  );
};
export const getStatusTransition = (
  from: ItemStatus,
  to: ItemStatus
): ItemStatusTransition | null => {
  const transitions = ITEM_STATUS_TRANSITIONS[from];
  return transitions.find((transition) => transition.to === to) || null;
};
export const getAvailableTransitions = (
  currentStatus: ItemStatus
): ItemStatusTransition[] => {
  return ITEM_STATUS_TRANSITIONS[currentStatus] || [];
};
export const getItemStatusInfo = (
  status: ItemStatus
): {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
  description: string;
} => {
  const statusInfo: Record<
    ItemStatus,
    {
      label: string;
      color: string;
      bgColor: string;
      icon: string;
      description: string;
    }
  > = {
    [ItemStatus.DRAFT]: {
      label: "Draft",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      icon: "pencil",
      description: "Item is still in draft mode",
    },
    [ItemStatus.AVAILABLE]: {
      label: "Available",
      color: "text-green-600",
      bgColor: "bg-green-100",
      icon: "check-circle",
      description: "Item is available for swapping",
    },
    [ItemStatus.REQUESTED]: {
      label: "Requested",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      icon: "clock",
      description: "Item has pending swap requests",
    },
    [ItemStatus.SWAPPED]: {
      label: "Swapped",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      icon: "exchange",
      description: "Item has been successfully swapped",
    },
    [ItemStatus.EXPIRED]: {
      label: "Expired",
      color: "text-red-600",
      bgColor: "bg-red-100",
      icon: "calendar-x",
      description: "Item listing has expired",
    },
    [ItemStatus.REMOVED]: {
      label: "Removed",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      icon: "trash",
      description: "Item has been removed",
    },
    [ItemStatus.PENDING]: {
      label: "Pending",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      icon: "clock",
      description: "Item is pending review",
    },
    [ItemStatus.REPORTED]: {
      label: "Reported",
      color: "text-red-600",
      bgColor: "bg-red-100",
      icon: "flag",
      description: "Item has been reported",
    },
    [ItemStatus.REJECTED]: {
      label: "Rejected",
      color: "text-red-600",
      bgColor: "bg-red-100",
      icon: "x-circle",
      description: "Item has been rejected",
    },
  };
  return statusInfo[status];
};
export const calculateItemExpiration = (
  createdAt: Date,
  daysToExpire: number = 30
): Date => {
  const expirationDate = new Date(createdAt);
  expirationDate.setDate(expirationDate.getDate() + daysToExpire);
  return expirationDate;
};
export const isItemExpired = (item: Item): boolean => {
  if (!item.expiresAt) return false;
  return new Date() > new Date(item.expiresAt);
};
export const getDaysUntilExpiration = (item: Item): number | null => {
  if (!item.expiresAt) return null;
  const now = new Date();
  const expiration = new Date(item.expiresAt);
  const diffTime = expiration.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
export const shouldShowExpirationWarning = (item: Item): boolean => {
  const daysUntilExpiration = getDaysUntilExpiration(item);
  return (
    daysUntilExpiration !== null &&
    daysUntilExpiration <= 7 &&
    daysUntilExpiration > 0
  );
};
export const calculateCarbonSaved = (category: string): number => {
  const carbonEstimates: Record<string, number> = {
    clothing: 23, 
    electronics: 45, 
    furniture: 67, 
    books: 2.5, 
    toys: 8, 
    sports: 15, 
    household: 12, 
    other: 10, 
  };
  return carbonEstimates[category] || carbonEstimates.other;
};

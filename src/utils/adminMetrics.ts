import { DashboardMetric, Item, ItemStatus, UserProfile } from "@/shared/types";
import {
  faBoxes,
  faExchangeAlt,
  faFlag,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
interface MetricCalculationResult {
  currentValue: number;
  previousValue: number;
}
const calculateUsersMetric = (
  users: UserProfile[]
): MetricCalculationResult => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const currentValue = users.length;
  const previousValue = users.filter(
    (user) => new Date(user.joinedAt) < thirtyDaysAgo
  ).length;
  return {
    currentValue,
    previousValue,
  };
};
const calculateActiveItemsMetric = (items: Item[]): MetricCalculationResult => {
  const activeItems = items.filter(
    (item) => item.status === ItemStatus.AVAILABLE
  );
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const currentValue = activeItems.length;
  const previousValue = items.filter(
    (item) =>
      item.status === ItemStatus.AVAILABLE &&
      new Date(item.createdAt) < thirtyDaysAgo
  ).length;
  return {
    currentValue,
    previousValue,
  };
};
const calculateSwapsMetric = (items: Item[]): MetricCalculationResult => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const currentValue = items.filter(
    (item) => item.status === ItemStatus.SWAPPED
  ).length;
  const previousValue = items.filter(
    (item) =>
      item.status === ItemStatus.SWAPPED &&
      item.swapCompletedAt &&
      new Date(item.swapCompletedAt) < thirtyDaysAgo
  ).length;
  return {
    currentValue,
    previousValue,
  };
};
const calculateReportsMetric = (items: Item[]): MetricCalculationResult => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const currentValue = items.filter(
    (item) => item.status === ItemStatus.REPORTED
  ).length;
  const previousValue = items.filter(
    (item) =>
      item.status === ItemStatus.REPORTED &&
      new Date(item.updatedAt) < thirtyDaysAgo
  ).length;
  return {
    currentValue,
    previousValue,
  };
};
const calculateChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};
export const generateDashboardMetrics = (
  users: UserProfile[],
  items: Item[]
): DashboardMetric[] => {
  const usersMetric = calculateUsersMetric(users);
  const itemsMetric = calculateActiveItemsMetric(items);
  const swapsMetric = calculateSwapsMetric(items);
  const reportsMetric = calculateReportsMetric(items);
  return [
    {
      label: "Total Users",
      value: usersMetric.currentValue,
      change: calculateChange(
        usersMetric.currentValue,
        usersMetric.previousValue
      ),
      icon: faUsers,
      color: "text-blue-500",
    },
    {
      label: "Active Items",
      value: itemsMetric.currentValue,
      change: calculateChange(
        itemsMetric.currentValue,
        itemsMetric.previousValue
      ),
      icon: faBoxes,
      color: "text-green-500",
    },
    {
      label: "Completed Swaps",
      value: swapsMetric.currentValue,
      change: calculateChange(
        swapsMetric.currentValue,
        swapsMetric.previousValue
      ),
      icon: faExchangeAlt,
      color: "text-purple-500",
    },
    {
      label: "Reports",
      value: reportsMetric.currentValue,
      change: calculateChange(
        reportsMetric.currentValue,
        reportsMetric.previousValue
      ),
      icon: faFlag,
      color: "text-red-500",
    },
  ];
};

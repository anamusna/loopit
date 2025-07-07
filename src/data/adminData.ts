import { DashboardMetric, UserProfile } from "@/shared/types";
import { generateDashboardMetrics } from "@/utils/adminMetrics";
import { allItems } from "./items";
import { allUsers } from "./users";
export const mockDashboardMetrics: DashboardMetric[] = generateDashboardMetrics(
  allUsers,
  allItems
);
export const mockReportedUsers: UserProfile[] = [];

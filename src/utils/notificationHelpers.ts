export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  availabilityAlerts: boolean;
  swapRequests: boolean;
  messages: boolean;
  communityUpdates: boolean;
}
export interface AvailabilityAlert {
  id: string;
  userId: string;
  itemId: string;
  itemTitle: string;
  itemCategory: string;
  createdAt: number;
  isActive: boolean;
  lastTriggered?: number;
}
export interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: number;
  expiresAt?: number;
}
const NOTIFICATION_PREFERENCES_KEY = "loopit_notification_preferences";
const AVAILABILITY_ALERTS_KEY = "loopit_availability_alerts";
const NOTIFICATIONS_KEY = "loopit_notifications";
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  email: true,
  push: true,
  inApp: true,
  availabilityAlerts: true,
  swapRequests: true,
  messages: true,
  communityUpdates: false,
};
export const getNotificationPreferences = (): NotificationPreferences => {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATION_PREFERENCES;
  try {
    const stored = localStorage.getItem(NOTIFICATION_PREFERENCES_KEY);
    return stored
      ? { ...DEFAULT_NOTIFICATION_PREFERENCES, ...JSON.parse(stored) }
      : DEFAULT_NOTIFICATION_PREFERENCES;
  } catch (error) {
    console.error("Error reading notification preferences:", error);
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }
};
export const saveNotificationPreferences = (
  preferences: Partial<NotificationPreferences>
): void => {
  if (typeof window === "undefined") return;
  try {
    const current = getNotificationPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(NOTIFICATION_PREFERENCES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving notification preferences:", error);
  }
};
export const createAvailabilityAlert = (
  userId: string,
  itemId: string,
  itemTitle: string,
  itemCategory: string
): string => {
  if (typeof window === "undefined") return "";
  try {
    const alerts = getAvailabilityAlerts();
    const newAlert: AvailabilityAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      itemId,
      itemTitle,
      itemCategory,
      createdAt: Date.now(),
      isActive: true,
    };
    const updatedAlerts = [...alerts, newAlert];
    localStorage.setItem(
      AVAILABILITY_ALERTS_KEY,
      JSON.stringify(updatedAlerts)
    );
    return newAlert.id;
  } catch (error) {
    console.error("Error creating availability alert:", error);
    return "";
  }
};
export const getAvailabilityAlerts = (userId?: string): AvailabilityAlert[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(AVAILABILITY_ALERTS_KEY);
    const alerts: AvailabilityAlert[] = stored ? JSON.parse(stored) : [];
    if (userId) {
      return alerts.filter(
        (alert) => alert.userId === userId && alert.isActive
      );
    }
    return alerts.filter((alert) => alert.isActive);
  } catch (error) {
    console.error("Error reading availability alerts:", error);
    return [];
  }
};
export const removeAvailabilityAlert = (alertId: string): void => {
  if (typeof window === "undefined") return;
  try {
    const alerts = getAvailabilityAlerts();
    const updatedAlerts = alerts.map((alert) =>
      alert.id === alertId ? { ...alert, isActive: false } : alert
    );
    localStorage.setItem(
      AVAILABILITY_ALERTS_KEY,
      JSON.stringify(updatedAlerts)
    );
  } catch (error) {
    console.error("Error removing availability alert:", error);
  }
};
export const hasAvailabilityAlert = (
  userId: string,
  itemId: string
): boolean => {
  const alerts = getAvailabilityAlerts(userId);
  return alerts.some((alert) => alert.itemId === itemId);
};
export const triggerAvailabilityAlert = (
  itemId: string
): AvailabilityAlert[] => {
  const alerts = getAvailabilityAlerts();
  const triggeredAlerts = alerts.filter(
    (alert) => alert.itemId === itemId && alert.isActive
  );
  if (triggeredAlerts.length > 0) {
    const updatedAlerts = alerts.map((alert) =>
      triggeredAlerts.some((triggered) => triggered.id === alert.id)
        ? { ...alert, lastTriggered: Date.now() }
        : alert
    );
    try {
      localStorage.setItem(
        AVAILABILITY_ALERTS_KEY,
        JSON.stringify(updatedAlerts)
      );
    } catch (error) {
      console.error("Error updating triggered alerts:", error);
    }
  }
  return triggeredAlerts;
};
export const createNotification = (
  type: string,
  title: string,
  message: string,
  data?: Record<string, any>
): string => {
  if (typeof window === "undefined") return "";
  try {
    const notifications = getNotifications();
    const newNotification: NotificationData = {
      id: `notification_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      type,
      title,
      message,
      data,
      isRead: false,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, 
    };
    const updatedNotifications = [newNotification, ...notifications].slice(
      0,
      100
    ); 
    localStorage.setItem(
      NOTIFICATIONS_KEY,
      JSON.stringify(updatedNotifications)
    );
    return newNotification.id;
  } catch (error) {
    console.error("Error creating notification:", error);
    return "";
  }
};
export const getNotifications = (): NotificationData[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    const notifications: NotificationData[] = stored ? JSON.parse(stored) : [];
    const now = Date.now();
    const validNotifications = notifications.filter(
      (notification) => !notification.expiresAt || notification.expiresAt > now
    );
    if (validNotifications.length !== notifications.length) {
      localStorage.setItem(
        NOTIFICATIONS_KEY,
        JSON.stringify(validNotifications)
      );
    }
    return validNotifications;
  } catch (error) {
    console.error("Error reading notifications:", error);
    return [];
  }
};
export const markNotificationAsRead = (notificationId: string): void => {
  if (typeof window === "undefined") return;
  try {
    const notifications = getNotifications();
    const updatedNotifications = notifications.map((notification) =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    );
    localStorage.setItem(
      NOTIFICATIONS_KEY,
      JSON.stringify(updatedNotifications)
    );
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};
export const markAllNotificationsAsRead = (): void => {
  if (typeof window === "undefined") return;
  try {
    const notifications = getNotifications();
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      isRead: true,
    }));
    localStorage.setItem(
      NOTIFICATIONS_KEY,
      JSON.stringify(updatedNotifications)
    );
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
  }
};
export const deleteNotification = (notificationId: string): void => {
  if (typeof window === "undefined") return;
  try {
    const notifications = getNotifications();
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== notificationId
    );
    localStorage.setItem(
      NOTIFICATIONS_KEY,
      JSON.stringify(updatedNotifications)
    );
  } catch (error) {
    console.error("Error deleting notification:", error);
  }
};
export const getUnreadNotificationCount = (): number => {
  const notifications = getNotifications();
  return notifications.filter((notification) => !notification.isRead).length;
};
export const clearAllNotifications = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(NOTIFICATIONS_KEY);
};
export const sendPushNotification = async (
  title: string,
  message: string,
  data?: Record<string, any>
): Promise<boolean> => {
  console.log("Push notification would be sent:", { title, message, data });
  return true;
};
export const sendEmailNotification = async (
  to: string,
  subject: string,
  body: string
): Promise<boolean> => {
  console.log("Email notification would be sent:", { to, subject, body });
  return true;
};
export const showToastNotification = (
  title: string,
  message: string,
  type: "success" | "error" | "warning" | "info" = "info",
  duration: number = 5000
): void => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      body: message,
      icon: "/favicon.ico",
      tag: "loopit-notification",
    });
  }
  const event = new CustomEvent("show-toast", {
    detail: { title, message, type, duration },
  });
  window.dispatchEvent(event);
};
export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.warn("Notifications not supported");
    return false;
  }
  if (Notification.permission === "granted") {
    return true;
  }
  if (Notification.permission === "denied") {
    return false;
  }
  try {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};
export const areNotificationsEnabled = (): boolean => {
  if (!("Notification" in window)) {
    return false;
  }
  const preferences = getNotificationPreferences();
  return preferences.push && Notification.permission === "granted";
};
export const cleanupNotifications = (): void => {
  const notifications = getNotifications();
  const alerts = getAvailabilityAlerts();
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const validNotifications = notifications.filter(
    (notification) => notification.createdAt > thirtyDaysAgo
  );
  const validAlerts = alerts.filter(
    (alert) => alert.createdAt > now - 90 * 24 * 60 * 60 * 1000
  );
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(validNotifications));
    localStorage.setItem(AVAILABILITY_ALERTS_KEY, JSON.stringify(validAlerts));
  } catch (error) {
    console.error("Error cleaning up notifications:", error);
  }
};

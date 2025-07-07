import { Notification, NotificationType } from "@/shared/types";
export const defaultNotifications: Notification[] = [
  {
    id: "notif_001",
    userId: "default_user_001",
    type: NotificationType.SWAP_REQUEST,
    title: "New Swap Request",
    message:
      "Momodou Ceesay wants to swap educational books for your MacBook Pro 2019",
    data: {
      swapRequestId: "swap_002",
      fromUserId: "demo_user_002",
      fromUserName: "Momodou Ceesay",
      itemId: "my_item_001",
      itemTitle: "MacBook Pro 2019",
    },
    isRead: false,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "notif_002",
    userId: "default_user_001",
    type: NotificationType.REQUEST_ACCEPTED,
    title: "Swap Request Accepted",
    message:
      "Ousman Danso accepted your swap request for the handmade coffee table",
    data: {
      swapRequestId: "swap_003",
      toUserId: "demo_user_003",
      toUserName: "Ousman Danso",
      itemId: "item_003",
      itemTitle: "Handmade Wooden Coffee Table",
    },
    isRead: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "notif_003",
    userId: "default_user_001",
    type: NotificationType.REQUEST_REJECTED,
    title: "Swap Request Declined",
    message: "Isatou Sanyang declined your swap request for the recipe books",
    data: {
      swapRequestId: "swap_004",
      toUserId: "demo_user_004",
      toUserName: "Isatou Sanyang",
      itemId: "my_item_003",
      itemTitle: "Cooking Recipe Book Collection",
    },
    isRead: true,
    createdAt: new Date("2024-01-14"),
  },
  {
    id: "notif_004",
    userId: "default_user_001",
    type: NotificationType.SWAP_COMPLETED,
    title: "Swap Completed",
    message:
      "Your swap with Mariama Bojang for the toy cars has been completed!",
    data: {
      swapRequestId: "swap_005",
      toUserId: "demo_user_005",
      toUserName: "Mariama Bojang",
      itemId: "item_005",
      itemTitle: "Children's Toy Car Collection",
    },
    isRead: false,
    createdAt: new Date("2024-01-13"),
  },
  {
    id: "notif_005",
    userId: "default_user_001",
    type: NotificationType.NEW_MESSAGE,
    title: "New Message",
    message: "You have a new message from Fatou Jallow about the kaftan swap",
    data: {
      swapRequestId: "swap_001",
      fromUserId: "demo_user_001",
      fromUserName: "Fatou Jallow",
      messagePreview: "Thank you for your interest! I'd love to see...",
    },
    isRead: false,
    createdAt: new Date("2024-01-16"),
  },
  {
    id: "notif_006",
    userId: "default_user_001",
    type: NotificationType.ITEM_UPDATED,
    title: "Item Views Update",
    message: "Your MacBook Pro 2019 listing has reached 50+ views!",
    data: {
      itemId: "my_item_001",
      itemTitle: "MacBook Pro 2019",
      views: 67,
      milestone: "50_views",
    },
    isRead: true,
    createdAt: new Date("2024-01-12"),
  },
];
export const allNotifications = defaultNotifications;
export const getNotificationsForUser = (userId: string) => {
  return allNotifications.filter(
    (notification) => notification.userId === userId
  );
};
export const getUnreadNotificationsForUser = (userId: string) => {
  return allNotifications.filter(
    (notification) => notification.userId === userId && !notification.isRead
  );
};
export const getNotificationsByType = (
  userId: string,
  type: NotificationType
) => {
  return allNotifications.filter(
    (notification) =>
      notification.userId === userId && notification.type === type
  );
};

import { SwapRequest, SwapRequestStatus } from "@/shared/types";
export const defaultSwapRequests: SwapRequest[] = [
  {
    id: "swap_001",
    fromUserId: "default_user_001",
    toUserId: "demo_user_001",
    itemId: "item_001",
    offeredItemId: "my_item_002",
    message:
      "Hi! I love your traditional kaftan. Would you be interested in swapping it for my designer dress? Both are in excellent condition.",
    status: SwapRequestStatus.PENDING,
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "swap_002",
    fromUserId: "demo_user_002",
    toUserId: "default_user_001",
    itemId: "my_item_001",
    offeredItemId: "item_002",
    message:
      "Hello! I'm really interested in your MacBook. I have a set of educational books that might be useful. Let me know what you think!",
    status: SwapRequestStatus.PENDING,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "swap_003",
    fromUserId: "default_user_001",
    toUserId: "demo_user_003",
    itemId: "item_003",
    offeredItemId: "my_item_004",
    message:
      "Your handmade coffee table is beautiful! I have an ergonomic office chair that might work well in exchange.",
    status: SwapRequestStatus.ACCEPTED,
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-15"),
    respondedAt: new Date("2024-01-15"),
  },
  {
    id: "swap_004",
    fromUserId: "demo_user_004",
    toUserId: "default_user_001",
    itemId: "my_item_003",
    offeredItemId: "item_004",
    message:
      "I'd love to have those recipe books! Would you consider my Samsung phone for them?",
    status: SwapRequestStatus.REJECTED,
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-14"),
    respondedAt: new Date("2024-01-14"),
  },
  {
    id: "swap_005",
    fromUserId: "default_user_001",
    toUserId: "demo_user_005",
    itemId: "item_005",
    message:
      "Hi Mariama! My kids would love those toy cars. I don't have a specific item to offer, but I'm happy to help with any household needs you might have.",
    status: SwapRequestStatus.COMPLETED,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-13"),
    respondedAt: new Date("2024-01-13"),
  },
];
export const allSwapRequests = defaultSwapRequests;
export const getSwapRequestsForUser = (userId: string) => {
  return allSwapRequests.filter(
    (request) => request.fromUserId === userId || request.toUserId === userId
  );
};
export const getSentSwapRequests = (userId: string) => {
  return allSwapRequests.filter((request) => request.fromUserId === userId);
};
export const getReceivedSwapRequests = (userId: string) => {
  return allSwapRequests.filter((request) => request.toUserId === userId);
};

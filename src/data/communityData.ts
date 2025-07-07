import {
  CommunityBoardCategory,
  CommunityEvent,
  CommunityPost,
  CommunityReply,
  EventType,
} from "@/shared/types";
export const defaultCommunityPosts: CommunityPost[] = [
  {
    id: "post_001",
    title: "Looking for someone to help fix my bicycle",
    content:
      "Hi everyone! I have an old bicycle that needs some chain adjustments and brake repair. Would anyone be willing to help or know someone who could? Happy to offer something in return from my listings!",
    category: CommunityBoardCategory.HELP_REQUESTS,
    authorId: "default_user_001",
    authorName: "Amina Jallow",
    authorAvatar: "https://i.pravatar.cc/150?img=11",
    location: "Banjul",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
    ],
    isResolved: false,
    upvotes: 8,
    downvotes: 0,
    replyCount: 3,
    tags: ["bicycle", "repair", "help", "community"],
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "post_002",
    title: "Best places for community swapping events?",
    content:
      "I'm thinking of organizing a small clothing swap event in our neighborhood. Does anyone know good community spaces in Banjul or Serrekunda that would be suitable? Looking for somewhere accessible and with enough space.",
    category: CommunityBoardCategory.LOCAL_DISCUSSIONS,
    authorId: "demo_user_001",
    authorName: "Fatou Jallow",
    authorAvatar: "https://i.pravatar.cc/150?img=11",
    location: "Banjul",
    isResolved: false,
    upvotes: 12,
    downvotes: 1,
    replyCount: 6,
    tags: ["events", "community", "clothing swap", "venues"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "post_003",
    title: "Teaching basic smartphone skills - free sessions",
    content:
      "I'm offering free sessions to help older community members learn basic smartphone skills like messaging, calls, and using simple apps. Sessions will be in Kanifing every Saturday afternoon. All welcome!",
    category: CommunityBoardCategory.SKILL_SHARING,
    authorId: "demo_user_004",
    authorName: "Isatou Sanyang",
    authorAvatar: "https://i.pravatar.cc/150?img=11",
    location: "Kanifing",
    isResolved: false,
    upvotes: 25,
    downvotes: 0,
    replyCount: 8,
    tags: ["teaching", "smartphones", "community service", "digital literacy"],
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "post_004",
    title: "Lost: Blue children's backpack near market",
    content:
      "My daughter lost her blue school backpack with cartoon characters near the Serrekunda market yesterday afternoon. It contains her school books and a small water bottle. Please let me know if you've seen it!",
    category: CommunityBoardCategory.LOST_AND_FOUND,
    authorId: "demo_user_005",
    authorName: "Mariama Bojang",
    authorAvatar: "https://i.pravatar.cc/150?img=11",
    location: "Serrekunda",
    isResolved: true,
    upvotes: 15,
    downvotes: 0,
    replyCount: 4,
    tags: ["lost", "backpack", "children", "market", "found"],
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-14"),
  },
  {
    id: "post_005",
    title: "Welcome new members to our community!",
    content:
      "Let's give a warm welcome to all the new members who joined LoopIt this week! Don't hesitate to ask questions or share what you're looking for. We're here to help each other build a more sustainable community.",
    category: CommunityBoardCategory.GENERAL,
    authorId: "demo_user_003",
    authorName: "Ousman Danso",
    authorAvatar: "https://i.pravatar.cc/150?img=11",
    location: "Brikama",
    isResolved: false,
    upvotes: 18,
    downvotes: 0,
    replyCount: 12,
    tags: ["welcome", "community", "new members", "sustainability"],
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-16"),
  },
];
export const defaultCommunityReplies: Record<string, CommunityReply[]> = {
  post_001: [
    {
      id: "reply_001",
      postId: "post_001",
      authorId: "demo_user_003",
      authorName: "Ousman Danso",
      authorAvatar: "https://i.pravatar.cc/150?img=11",
      content:
        "I can help with the bicycle repair! I have experience with basic bike maintenance. Send me a message and we can arrange a time.",
      upvotes: 5,
      downvotes: 0,
      createdAt: new Date("2024-01-16"),
      updatedAt: new Date("2024-01-16"),
    },
    {
      id: "reply_002",
      postId: "post_001",
      authorId: "demo_user_002",
      authorName: "Momodou Ceesay",
      authorAvatar: "https://i.pravatar.cc/150?img=11",
      content:
        "There's also a small bike repair shop near the university that's very reasonable if you need professional help.",
      upvotes: 3,
      downvotes: 0,
      createdAt: new Date("2024-01-16"),
      updatedAt: new Date("2024-01-16"),
    },
  ],
  post_002: [
    {
      id: "reply_003",
      postId: "post_002",
      authorId: "demo_user_004",
      authorName: "Isatou Sanyang",
      authorAvatar: "https://i.pravatar.cc/150?img=11",
      content:
        "The community center in Kanifing has a large hall that they rent out for events. Very reasonable rates and good accessibility.",
      upvotes: 8,
      downvotes: 0,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
  ],
};
export const defaultCommunityEvents: CommunityEvent[] = [
  {
    id: "event_001",
    title: "Monthly Clothing Swap Event",
    description:
      "Join us for our monthly clothing swap! Bring clothes you no longer wear and find something new for yourself. All sizes and styles welcome. Refreshments provided.",
    type: EventType.CLOTHING_SWAP,
    organizerId: "demo_user_001",
    organizerName: "Fatou Jallow",
    location: "Community Center, Banjul",
    coordinates: {
      lat: 13.4549,
      lng: -16.579,
    },
    dateTime: new Date("2024-02-10T14:00:00"),
    endDateTime: new Date("2024-02-10T17:00:00"),
    maxParticipants: 30,
    currentParticipants: 12,
    participants: [
      "default_user_001",
      "demo_user_002",
      "demo_user_003",
      "demo_user_004",
      "demo_user_005",
    ],
    isActive: true,
    tags: ["clothing", "swap", "community", "sustainability"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "event_002",
    title: "Smartphone Skills Workshop",
    description:
      "Learn basic smartphone skills in a friendly, patient environment. Perfect for beginners! We'll cover making calls, sending messages, and using helpful apps.",
    type: EventType.SKILL_SHARE,
    organizerId: "demo_user_004",
    organizerName: "Isatou Sanyang",
    location: "Kanifing Community Hall",
    coordinates: {
      lat: 13.4667,
      lng: -16.6833,
    },
    dateTime: new Date("2024-01-20T15:00:00"),
    endDateTime: new Date("2024-01-20T17:00:00"),
    maxParticipants: 15,
    currentParticipants: 8,
    participants: ["default_user_001", "demo_user_001", "demo_user_005"],
    isActive: true,
    tags: ["workshop", "smartphones", "digital literacy", "learning"],
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "event_003",
    title: "Community Repair Café",
    description:
      "Bring broken items and learn to repair them together! From clothes to small electronics, let's fix things instead of throwing them away. Tools and guidance provided.",
    type: EventType.COMMUNITY_REPAIR,
    organizerId: "demo_user_003",
    organizerName: "Ousman Danso",
    location: "Brikama Workshop Space",
    coordinates: {
      lat: 13.271,
      lng: -16.6499,
    },
    dateTime: new Date("2024-01-27T10:00:00"),
    endDateTime: new Date("2024-01-27T14:00:00"),
    maxParticipants: 20,
    currentParticipants: 6,
    participants: ["default_user_001", "demo_user_002"],
    isActive: true,
    tags: ["repair", "sustainability", "skills", "community"],
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "event_004",
    title: "Children's Toy Giveaway Day",
    description:
      "A special day for families! Bring toys your children have outgrown and find 'new' ones for them to enjoy. Creating joy while reducing waste!",
    type: EventType.GIVEAWAY_DAY,
    organizerId: "demo_user_005",
    organizerName: "Mariama Bojang",
    location: "Bakau Community Park",
    coordinates: {
      lat: 13.4783,
      lng: -16.6815,
    },
    dateTime: new Date("2024-02-03T09:00:00"),
    endDateTime: new Date("2024-02-03T12:00:00"),
    maxParticipants: 50,
    currentParticipants: 18,
    participants: [
      "default_user_001",
      "demo_user_001",
      "demo_user_002",
      "demo_user_003",
    ],
    isActive: true,
    tags: ["children", "toys", "giveaway", "families"],
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-16"),
  },
];
export const allCommunityPosts = defaultCommunityPosts;
export const allCommunityReplies = defaultCommunityReplies;
export const allCommunityEvents = defaultCommunityEvents;
export const getCommunityPostsByCategory = (
  category: CommunityBoardCategory
) => {
  return allCommunityPosts.filter((post) => post.category === category);
};
export const getCommunityEventsByType = (type: EventType) => {
  return allCommunityEvents.filter((event) => event.type === type);
};
export const getUpcomingEvents = () => {
  const now = new Date();
  return allCommunityEvents.filter(
    (event) => event.dateTime > now && event.isActive
  );
};
export const getUserEvents = (userId: string) => {
  return allCommunityEvents.filter(
    (event) =>
      event.organizerId === userId || event.participants.includes(userId)
  );
};

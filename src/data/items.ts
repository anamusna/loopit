import {
  Item,
  ItemCategory,
  ItemCondition,
  ItemStatus,
  UserProfile,
} from "@/shared/types";

const CARBON_SAVINGS_BY_CATEGORY: Record<ItemCategory, number> = {
  [ItemCategory.CLOTHING]: 10,
  [ItemCategory.BOOKS]: 5,
  [ItemCategory.FURNITURE]: 25,
  [ItemCategory.ELECTRONICS]: 30,
  [ItemCategory.TOYS]: 8,
  [ItemCategory.SPORTS]: 12,
  [ItemCategory.HOUSEHOLD]: 15,
  [ItemCategory.OTHER]: 10,
};

export const DEFAULT_EXPIRATION_DAYS = 30;

export const BOOST_DURATION_DAYS = 7;

export const allItems = [
  // Super Admin (Lamin Sanneh) - Platform admin items
  {
    id: "item_sa_001",
    title: "Professional Camera Setup",
    description:
      "High-quality DSLR camera with tripod and lighting kit. Perfect for community event documentation.",
    category: ItemCategory.ELECTRONICS,
    condition: ItemCondition.EXCELLENT,
    status: ItemStatus.AVAILABLE,
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
    ],
    location: "Banjul",
    coordinates: { lat: 13.4549, lng: -16.579 },
    ownerId: "super_admin_001",
    ownerName: "Lamin Sanneh",
    ownerAvatar: "https://i.pravatar.cc/150?img=11",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    views: 120,
    saves: 45,
    swapRequests: 8,
    tags: ["camera", "professional", "electronics", "events"],
    isBoosted: true,
    environmentalImpact: {
      carbonSaved: CARBON_SAVINGS_BY_CATEGORY[ItemCategory.ELECTRONICS],
      waterSaved: 500,
      landfillSaved: 2,
      offsetComparisons: {
        carRides: 5,
        flightHours: 0.5,
        homeDays: 2,
        treeDays: 10,
        lightbulbHours: 100,
        showerMinutes: 60,
        meatMeals: 3,
        coffeeCups: 20,
      },
    },
    changeHistory: [],
  },
  {
    id: "item_sa_002",
    title: "Event Planning Kit",
    description:
      "Complete event planning kit with templates, checklists, and professional resources for community events.",
    category: ItemCategory.OTHER,
    condition: ItemCondition.EXCELLENT,
    status: ItemStatus.AVAILABLE,
    images: [
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=400&fit=crop",
    ],
    location: "Banjul",
    coordinates: { lat: 13.4549, lng: -16.579 },
    ownerId: "super_admin_001",
    ownerName: "Lamin Sanneh",
    ownerAvatar: "https://i.pravatar.cc/150?img=11",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
    views: 85,
    saves: 32,
    swapRequests: 5,
    tags: ["events", "planning", "professional", "community"],
    isBoosted: true,
    environmentalImpact: {
      carbonSaved: CARBON_SAVINGS_BY_CATEGORY[ItemCategory.OTHER],
      waterSaved: 300,
      landfillSaved: 1,
      offsetComparisons: {
        carRides: 3,
        flightHours: 0.3,
        homeDays: 1,
        treeDays: 8,
        lightbulbHours: 80,
        showerMinutes: 45,
        meatMeals: 2,
        coffeeCups: 15,
      },
    },
    changeHistory: [],
  },

  // Admin (Fatou Ceesay) - Content creation items
  {
    id: "item_a_001",
    title: "Content Creation Laptop",
    description:
      "High-performance laptop optimized for content creation and community management.",
    category: ItemCategory.ELECTRONICS,
    condition: ItemCondition.EXCELLENT,
    status: ItemStatus.AVAILABLE,
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    ],
    location: "Serrekunda",
    coordinates: { lat: 13.4383, lng: -16.6784 },
    ownerId: "admin_001",
    ownerName: "Fatou Ceesay",
    ownerAvatar: "https://i.pravatar.cc/150?img=12",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
    views: 95,
    saves: 28,
    swapRequests: 6,
    tags: ["laptop", "content creation", "professional", "electronics"],
    isBoosted: true,
    environmentalImpact: {
      carbonSaved: CARBON_SAVINGS_BY_CATEGORY[ItemCategory.ELECTRONICS],
      waterSaved: 450,
      landfillSaved: 2,
      offsetComparisons: {
        carRides: 4,
        flightHours: 0.4,
        homeDays: 2,
        treeDays: 9,
        lightbulbHours: 90,
        showerMinutes: 50,
        meatMeals: 3,
        coffeeCups: 18,
      },
    },
    changeHistory: [],
  },

  // Moderator Items
  {
    id: "item_m_001",
    title: "Content Review Tablet",
    description:
      "Tablet device dedicated to content moderation and community management.",
    category: ItemCategory.ELECTRONICS,
    condition: ItemCondition.GOOD,
    status: ItemStatus.AVAILABLE,
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
    ],
    location: "Bakau",
    coordinates: { lat: 13.4783, lng: -16.6815 },
    ownerId: "moderator_001",
    ownerName: "Omar Jobe",
    ownerAvatar: "https://i.pravatar.cc/150?img=13",
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-01-04"),
    views: 75,
    saves: 22,
    swapRequests: 4,
    tags: ["tablet", "moderation", "electronics", "professional"],
    isBoosted: false,
    environmentalImpact: {
      carbonSaved: CARBON_SAVINGS_BY_CATEGORY[ItemCategory.ELECTRONICS],
      waterSaved: 400,
      landfillSaved: 1,
      offsetComparisons: {
        carRides: 4,
        flightHours: 0.4,
        homeDays: 2,
        treeDays: 8,
        lightbulbHours: 85,
        showerMinutes: 48,
        meatMeals: 2,
        coffeeCups: 16,
      },
    },
    changeHistory: [],
  },
  {
    id: "item_m_002",
    title: "Safety Guide Collection",
    description:
      "Comprehensive collection of community safety guidelines and best practices.",
    category: ItemCategory.BOOKS,
    condition: ItemCondition.EXCELLENT,
    status: ItemStatus.AVAILABLE,
    images: [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop",
    ],
    location: "Bakau",
    coordinates: { lat: 13.4783, lng: -16.6815 },
    ownerId: "moderator_001",
    ownerName: "Omar Jobe",
    ownerAvatar: "https://i.pravatar.cc/150?img=13",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
    views: 65,
    saves: 18,
    swapRequests: 3,
    tags: ["books", "safety", "guidelines", "community"],
    isBoosted: false,
    environmentalImpact: {
      carbonSaved: CARBON_SAVINGS_BY_CATEGORY[ItemCategory.BOOKS],
      waterSaved: 350,
      landfillSaved: 1,
      offsetComparisons: {
        carRides: 3,
        flightHours: 0.3,
        homeDays: 1,
        treeDays: 7,
        lightbulbHours: 75,
        showerMinutes: 42,
        meatMeals: 2,
        coffeeCups: 14,
      },
    },
    changeHistory: [],
  },

  // Regular Users
  // Fatou Jallow (Traditional crafts)
  {
    id: "item_u1_001",
    title: "Traditional Woven Basket Set",
    description:
      "Set of beautifully crafted traditional baskets made from local materials. Perfect for storage or decoration.",
    category: ItemCategory.HOUSEHOLD,
    condition: ItemCondition.EXCELLENT,
    status: ItemStatus.AVAILABLE,
    images: [
      "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400&h=400&fit=crop",
    ],
    location: "Banjul",
    coordinates: { lat: 13.4549, lng: -16.579 },
    ownerId: "demo_user_001",
    ownerName: "Fatou Jallow",
    ownerAvatar: "https://i.pravatar.cc/150?img=3",
    createdAt: new Date("2024-01-06"),
    updatedAt: new Date("2024-01-06"),
    views: 42,
    saves: 15,
    swapRequests: 3,
    tags: ["crafts", "traditional", "household", "storage"],
    isBoosted: false,
    environmentalImpact: {
      carbonSaved: CARBON_SAVINGS_BY_CATEGORY[ItemCategory.HOUSEHOLD],
      waterSaved: 300,
      landfillSaved: 1,
      offsetComparisons: {
        carRides: 3,
        flightHours: 0.3,
        homeDays: 1,
        treeDays: 6,
        lightbulbHours: 70,
        showerMinutes: 40,
        meatMeals: 2,
        coffeeCups: 12,
      },
    },
    changeHistory: [],
  },

  // Momodou Ceesay (Book collector)
  {
    id: "item_u2_001",
    title: "Educational Book Collection",
    description:
      "Collection of educational books covering various subjects. Great for students and lifelong learners.",
    category: ItemCategory.BOOKS,
    condition: ItemCondition.GOOD,
    status: ItemStatus.AVAILABLE,
    images: [
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=400&fit=crop",
    ],
    location: "Serrekunda",
    coordinates: { lat: 13.4383, lng: -16.6784 },
    ownerId: "demo_user_002",
    ownerName: "Momodou Ceesay",
    ownerAvatar: "https://i.pravatar.cc/150?img=4",
    createdAt: new Date("2024-01-07"),
    updatedAt: new Date("2024-01-07"),
    views: 38,
    saves: 12,
    swapRequests: 2,
    tags: ["books", "education", "learning", "academic"],
    isBoosted: false,
    environmentalImpact: {
      carbonSaved: CARBON_SAVINGS_BY_CATEGORY[ItemCategory.BOOKS],
      waterSaved: 250,
      landfillSaved: 1,
      offsetComparisons: {
        carRides: 2,
        flightHours: 0.2,
        homeDays: 1,
        treeDays: 5,
        lightbulbHours: 60,
        showerMinutes: 35,
        meatMeals: 1,
        coffeeCups: 10,
      },
    },
    changeHistory: [],
  },

  // Ousman Danso (Craftsman)
  {
    id: "item_u3_001",
    title: "Handmade Wooden Coffee Table",
    description:
      "Beautiful handcrafted coffee table made from local mahogany wood. Features intricate carved details.",
    category: ItemCategory.FURNITURE,
    condition: ItemCondition.EXCELLENT,
    status: ItemStatus.AVAILABLE,
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    ],
    location: "Brikama",
    coordinates: { lat: 13.271, lng: -16.6499 },
    ownerId: "demo_user_003",
    ownerName: "Ousman Danso",
    ownerAvatar: "https://i.pravatar.cc/150?img=5",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
    views: 55,
    saves: 20,
    swapRequests: 4,
    tags: ["furniture", "handmade", "wooden", "crafts"],
    isBoosted: false,
    environmentalImpact: {
      carbonSaved: CARBON_SAVINGS_BY_CATEGORY[ItemCategory.FURNITURE],
      waterSaved: 400,
      landfillSaved: 2,
      offsetComparisons: {
        carRides: 4,
        flightHours: 0.4,
        homeDays: 2,
        treeDays: 8,
        lightbulbHours: 85,
        showerMinutes: 48,
        meatMeals: 2,
        coffeeCups: 16,
      },
    },
    changeHistory: [],
  },

  // Isatou Sanyang (Tech enthusiast)
  {
    id: "item_u4_001",
    title: "Smart Home Starter Kit",
    description:
      "Complete smart home starter kit including smart bulbs, plugs, and hub. Perfect for home automation.",
    category: ItemCategory.ELECTRONICS,
    condition: ItemCondition.EXCELLENT,
    status: ItemStatus.AVAILABLE,
    images: [
      "https://images.unsplash.com/photo-1558002038-876f1d8bf8d6?w=400&h=400&fit=crop",
    ],
    location: "Kololi",
    coordinates: { lat: 13.4411, lng: -16.7059 },
    ownerId: "demo_user_004",
    ownerName: "Isatou Sanyang",
    ownerAvatar: "https://i.pravatar.cc/150?img=6",
    createdAt: new Date("2024-01-09"),
    updatedAt: new Date("2024-01-09"),
    views: 48,
    saves: 16,
    swapRequests: 3,
    tags: ["electronics", "smart home", "technology", "automation"],
    isBoosted: false,
    environmentalImpact: {
      carbonSaved: CARBON_SAVINGS_BY_CATEGORY[ItemCategory.ELECTRONICS],
      waterSaved: 350,
      landfillSaved: 1,
      offsetComparisons: {
        carRides: 3,
        flightHours: 0.3,
        homeDays: 1,
        treeDays: 7,
        lightbulbHours: 75,
        showerMinutes: 42,
        meatMeals: 2,
        coffeeCups: 14,
      },
    },
    changeHistory: [],
  },

  // Mariama Bojang (Mother of three)
  {
    id: "item_u5_001",
    title: "Children's Educational Toy Set",
    description:
      "Collection of educational toys for children aged 3-8. Includes building blocks, puzzles, and learning games.",
    category: ItemCategory.TOYS,
    condition: ItemCondition.GOOD,
    status: ItemStatus.AVAILABLE,
    images: [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop",
    ],
    location: "Bakau",
    coordinates: { lat: 13.4783, lng: -16.6815 },
    ownerId: "demo_user_005",
    ownerName: "Mariama Bojang",
    ownerAvatar: "https://i.pravatar.cc/150?img=7",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    views: 35,
    saves: 10,
    swapRequests: 2,
    tags: ["toys", "education", "children", "learning"],
    isBoosted: false,
    environmentalImpact: {
      carbonSaved: CARBON_SAVINGS_BY_CATEGORY[ItemCategory.TOYS],
      waterSaved: 200,
      landfillSaved: 1,
      offsetComparisons: {
        carRides: 2,
        flightHours: 0.2,
        homeDays: 1,
        treeDays: 4,
        lightbulbHours: 50,
        showerMinutes: 30,
        meatMeals: 1,
        coffeeCups: 8,
      },
    },
    changeHistory: [],
  },

  // Lamin Touray (Sports enthusiast)
  {
    id: "item_u6_001",
    title: "Complete Sports Equipment Set",
    description:
      "Set of high-quality sports equipment including soccer ball, basketball, and training gear.",
    category: ItemCategory.SPORTS,
    condition: ItemCondition.GOOD,
    status: ItemStatus.AVAILABLE,
    images: [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=400&fit=crop",
    ],
    location: "Fajara",
    coordinates: { lat: 13.4619, lng: -16.6827 },
    ownerId: "demo_user_006",
    ownerName: "Lamin Touray",
    ownerAvatar: "https://i.pravatar.cc/150?img=8",
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-11"),
    views: 40,
    saves: 14,
    swapRequests: 3,
    tags: ["sports", "fitness", "equipment", "training"],
    isBoosted: false,
    environmentalImpact: {
      carbonSaved: CARBON_SAVINGS_BY_CATEGORY[ItemCategory.SPORTS],
      waterSaved: 300,
      landfillSaved: 1,
      offsetComparisons: {
        carRides: 3,
        flightHours: 0.3,
        homeDays: 1,
        treeDays: 6,
        lightbulbHours: 70,
        showerMinutes: 40,
        meatMeals: 2,
        coffeeCups: 12,
      },
    },
    changeHistory: [],
  },

  // Awa Sowe (Home organizer)
  {
    id: "item_u7_001",
    title: "Professional Organization System",
    description:
      "Complete home organization system including storage containers, labels, and planning materials.",
    category: ItemCategory.HOUSEHOLD,
    condition: ItemCondition.EXCELLENT,
    status: ItemStatus.AVAILABLE,
    images: [
      "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400&h=400&fit=crop",
    ],
    location: "Farafenni",
    coordinates: { lat: 13.5667, lng: -15.6 },
    ownerId: "demo_user_007",
    ownerName: "Awa Sowe",
    ownerAvatar: "https://i.pravatar.cc/150?img=9",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
    views: 45,
    saves: 18,
    swapRequests: 4,
    tags: ["organization", "household", "storage", "planning"],
    isBoosted: false,
    environmentalImpact: {
      carbonSaved: CARBON_SAVINGS_BY_CATEGORY[ItemCategory.HOUSEHOLD],
      waterSaved: 350,
      landfillSaved: 1,
      offsetComparisons: {
        carRides: 3,
        flightHours: 0.3,
        homeDays: 1,
        treeDays: 7,
        lightbulbHours: 75,
        showerMinutes: 42,
        meatMeals: 2,
        coffeeCups: 14,
      },
    },
    changeHistory: [],
  },

  // Binta Camara (Fashion enthusiast)
  {
    id: "item_u8_001",
    title: "Designer Fashion Collection",
    description:
      "Curated collection of sustainable fashion pieces including dresses, accessories, and shoes.",
    category: ItemCategory.CLOTHING,
    condition: ItemCondition.EXCELLENT,
    status: ItemStatus.AVAILABLE,
    images: [
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=400&fit=crop",
    ],
    location: "Banjul",
    coordinates: { lat: 13.4549, lng: -16.579 },
    ownerId: "demo_user_008",
    ownerName: "Binta Camara",
    ownerAvatar: "https://i.pravatar.cc/150?img=10",
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13"),
    views: 52,
    saves: 22,
    swapRequests: 5,
    tags: ["fashion", "clothing", "sustainable", "designer"],
    isBoosted: false,
    environmentalImpact: {
      carbonSaved: CARBON_SAVINGS_BY_CATEGORY[ItemCategory.CLOTHING],
      waterSaved: 400,
      landfillSaved: 2,
      offsetComparisons: {
        carRides: 4,
        flightHours: 0.4,
        homeDays: 2,
        treeDays: 8,
        lightbulbHours: 85,
        showerMinutes: 48,
        meatMeals: 2,
        coffeeCups: 16,
      },
    },
    changeHistory: [],
  },

  // John Doe
  {
    id: "item_u9_001",
    title: "Home Office Setup",
    description:
      "Complete home office setup including ergonomic desk, chair, and accessories. Perfect for remote work.",
    category: ItemCategory.FURNITURE,
    condition: ItemCondition.GOOD,
    status: ItemStatus.AVAILABLE,
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=400&fit=crop",
    ],
    location: "New York, NY",
    ownerId: "1",
    ownerName: "John Doe",
    ownerAvatar: "https://i.pravatar.cc/150?img=14",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
    views: 38,
    saves: 12,
    swapRequests: 2,
    tags: ["furniture", "office", "work", "ergonomic"],
    isBoosted: false,
    environmentalImpact: {
      carbonSaved: CARBON_SAVINGS_BY_CATEGORY[ItemCategory.FURNITURE],
      waterSaved: 350,
      landfillSaved: 1,
      offsetComparisons: {
        carRides: 3,
        flightHours: 0.3,
        homeDays: 1,
        treeDays: 7,
        lightbulbHours: 75,
        showerMinutes: 42,
        meatMeals: 2,
        coffeeCups: 14,
      },
    },
    changeHistory: [],
  },

  // Lamin Darboe
  {
    id: "item_u10_001",
    title: "Yoga and Meditation Set",
    description:
      "Complete yoga set including premium mat, blocks, and meditation cushions. Perfect for home practice.",
    category: ItemCategory.SPORTS,
    condition: ItemCondition.EXCELLENT,
    status: ItemStatus.AVAILABLE,
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    ],
    location: "Dumbuto",
    ownerId: "2",
    ownerName: "Lamin Darboe",
    ownerAvatar: "https://i.pravatar.cc/150?img=15",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    views: 42,
    saves: 15,
    swapRequests: 3,
    tags: ["yoga", "sports", "meditation", "wellness"],
    isBoosted: false,
    environmentalImpact: {
      carbonSaved: CARBON_SAVINGS_BY_CATEGORY[ItemCategory.SPORTS],
      waterSaved: 300,
      landfillSaved: 1,
      offsetComparisons: {
        carRides: 3,
        flightHours: 0.3,
        homeDays: 1,
        treeDays: 6,
        lightbulbHours: 70,
        showerMinutes: 40,
        meatMeals: 2,
        coffeeCups: 12,
      },
    },
    changeHistory: [],
  },
];

export const currentUserItems: Item[] = [
  {
    id: "my_item_001",
    title: "MacBook Pro 2019",
    description:
      "MacBook Pro 13-inch from 2019. Works perfectly, battery life still excellent. Comes with original charger and laptop sleeve. Perfect for students or professionals.",
    category: ItemCategory.ELECTRONICS,
    condition: ItemCondition.GOOD,
    status: ItemStatus.AVAILABLE,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    ],
    location: "Banjul",
    coordinates: {
      lat: 13.4549,
      lng: -16.579,
    },
    ownerId: "default_user_001",
    ownerName: "Amina Jallow",
    ownerAvatar: "https://i.pravatar.cc/150?img=1",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
    expiresAt: new Date("2024-02-13"),
    views: 67,
    saves: 15,
    swapRequests: 8,
    tags: ["macbook", "laptop", "apple", "professional", "2019"],
    isBoosted: false,
    environmentalImpact: {
      carbonSaved: CARBON_SAVINGS_BY_CATEGORY[ItemCategory.ELECTRONICS],
      waterSaved: 500,
      landfillSaved: 2,
      offsetComparisons: {
        carRides: 5,
        flightHours: 0.5,
        homeDays: 2,
        treeDays: 10,
        lightbulbHours: 100,
        showerMinutes: 60,
        meatMeals: 3,
        coffeeCups: 20,
      },
    },
    changeHistory: [],
  },
  {
    id: "my_item_002",
    title: "Designer Dress",
    description:
      "Elegant black evening dress, size M. Worn only once for a special event. Designer brand, perfect for formal occasions or parties.",
    category: ItemCategory.CLOTHING,
    condition: ItemCondition.EXCELLENT,
    status: ItemStatus.AVAILABLE,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop",
    ],
    location: "Banjul",
    coordinates: {
      lat: 13.4549,
      lng: -16.579,
    },
    ownerId: "default_user_001",
    ownerName: "Amina Jallow",
    ownerAvatar: "https://i.pravatar.cc/150?img=1",
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13"),
    expiresAt: new Date("2024-02-12"),
    views: 23,
    saves: 8,
    swapRequests: 3,
    tags: ["dress", "elegant", "black", "designer", "formal"],
    isBoosted: false,
    environmentalImpact: {
      carbonSaved: CARBON_SAVINGS_BY_CATEGORY[ItemCategory.CLOTHING],
      waterSaved: 500,
      landfillSaved: 2,
      offsetComparisons: {
        carRides: 5,
        flightHours: 0.5,
        homeDays: 2,
        treeDays: 10,
        lightbulbHours: 100,
        showerMinutes: 60,
        meatMeals: 3,
        coffeeCups: 20,
      },
    },
    changeHistory: [],
  },
  {
    id: "my_item_003",
    title: "Cooking Recipe Book Collection",
    description:
      "Collection of 5 recipe books featuring African cuisine, Mediterranean dishes, and healthy eating. Great condition, barely used.",
    category: ItemCategory.BOOKS,
    condition: ItemCondition.EXCELLENT,
    status: ItemStatus.REQUESTED,
    images: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    ],
    location: "Banjul",
    coordinates: {
      lat: 13.4549,
      lng: -16.579,
    },
    ownerId: "default_user_001",
    ownerName: "Amina Jallow",
    ownerAvatar: "https://i.pravatar.cc/150?img=1",
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-11"),
    expiresAt: new Date("2024-02-10"),
    views: 14,
    saves: 3,
    swapRequests: 2,
    tags: ["cooking", "recipes", "books", "african cuisine", "healthy"],
    isBoosted: false,
    environmentalImpact: {
      carbonSaved: CARBON_SAVINGS_BY_CATEGORY[ItemCategory.BOOKS],
      waterSaved: 500,
      landfillSaved: 2,
      offsetComparisons: {
        carRides: 5,
        flightHours: 0.5,
        homeDays: 2,
        treeDays: 10,
        lightbulbHours: 100,
        showerMinutes: 60,
        meatMeals: 3,
        coffeeCups: 20,
      },
    },
    changeHistory: [],
  },
  {
    id: "my_item_004",
    title: "Office Chair",
    description:
      "Ergonomic office chair with lumbar support. Height adjustable, swivels 360 degrees. Perfect for home office or study room.",
    category: ItemCategory.FURNITURE,
    condition: ItemCondition.GOOD,
    status: ItemStatus.AVAILABLE,
    images: [
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    ],
    location: "Banjul",
    coordinates: {
      lat: 13.4549,
      lng: -16.579,
    },
    ownerId: "default_user_001",
    ownerName: "Amina Jallow",
    ownerAvatar: "https://i.pravatar.cc/150?img=1",
    createdAt: new Date("2024-01-09"),
    updatedAt: new Date("2024-01-09"),
    expiresAt: new Date("2024-02-08"),
    views: 29,
    saves: 6,
    swapRequests: 4,
    tags: [
      "office chair",
      "ergonomic",
      "furniture",
      "adjustable",
      "comfortable",
    ],
    isBoosted: false,
    environmentalImpact: {
      carbonSaved: CARBON_SAVINGS_BY_CATEGORY[ItemCategory.FURNITURE],
      waterSaved: 500,
      landfillSaved: 2,
      offsetComparisons: {
        carRides: 5,
        flightHours: 0.5,
        homeDays: 2,
        treeDays: 10,
        lightbulbHours: 100,
        showerMinutes: 60,
        meatMeals: 3,
        coffeeCups: 20,
      },
    },
    changeHistory: [],
  },
  {
    id: "my_item_005",
    title: "Basketball and Gear",
    description:
      "Professional basketball with pump and carrying bag. Perfect for playing at local courts or practicing at home.",
    category: ItemCategory.SPORTS,
    condition: ItemCondition.GOOD,
    status: ItemStatus.SWAPPED,
    images: [
      "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=400&h=400&fit=crop",
    ],
    location: "Banjul",
    coordinates: {
      lat: 13.4549,
      lng: -16.579,
    },
    ownerId: "default_user_001",
    ownerName: "Amina Jallow",
    ownerAvatar: "https://i.pravatar.cc/150?img=1",
    createdAt: new Date("2024-01-07"),
    updatedAt: new Date("2024-01-12"),
    expiresAt: new Date("2024-02-06"),
    views: 18,
    saves: 4,
    swapRequests: 5,
    tags: ["basketball", "sports", "gear", "professional", "exercise"],
    isBoosted: false,
    environmentalImpact: {
      carbonSaved: CARBON_SAVINGS_BY_CATEGORY[ItemCategory.SPORTS],
      waterSaved: 500,
      landfillSaved: 2,
      offsetComparisons: {
        carRides: 5,
        flightHours: 0.5,
        homeDays: 2,
        treeDays: 10,
        lightbulbHours: 100,
        showerMinutes: 60,
        meatMeals: 3,
        coffeeCups: 20,
      },
    },
    changeHistory: [
      {
        field: "status",
        oldValue: ItemStatus.AVAILABLE,
        newValue: ItemStatus.SWAPPED,
        changedAt: new Date("2024-01-12"),
        changedBy: "default_user_001",
      },
    ],
  },
];

export const itemsByCategory = {
  [ItemCategory.CLOTHING]: allItems.filter(
    (item) => item.category === ItemCategory.CLOTHING
  ),
  [ItemCategory.BOOKS]: allItems.filter(
    (item) => item.category === ItemCategory.BOOKS
  ),
  [ItemCategory.FURNITURE]: allItems.filter(
    (item) => item.category === ItemCategory.FURNITURE
  ),
  [ItemCategory.ELECTRONICS]: allItems.filter(
    (item) => item.category === ItemCategory.ELECTRONICS
  ),
  [ItemCategory.TOYS]: allItems.filter(
    (item) => item.category === ItemCategory.TOYS
  ),
  [ItemCategory.SPORTS]: allItems.filter(
    (item) => item.category === ItemCategory.SPORTS
  ),
  [ItemCategory.HOUSEHOLD]: allItems.filter(
    (item) => item.category === ItemCategory.HOUSEHOLD
  ),
  [ItemCategory.OTHER]: allItems.filter(
    (item) => item.category === ItemCategory.OTHER
  ),
};

export const filterItemsByStatus = (
  items: Item[],
  status: ItemStatus | "all"
): Item[] => {
  if (status === "all") return items;
  return items.filter((item) => item.status === status);
};

export const filterItemsBySearch = (
  items: Item[],
  searchQuery: string
): Item[] => {
  if (!searchQuery.trim()) return items;

  const query = searchQuery.toLowerCase();
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.tags.some((tag) => tag.toLowerCase().includes(query))
  );
};

export const filterItemsByCategory = (
  items: Item[],
  category: ItemCategory | "all"
): Item[] => {
  if (category === "all") return items;
  return items.filter((item) => item.category === category);
};

export const getItemStatusCounts = (items: Item[] = allItems) => {
  return {
    all: items.length,
    available: items.filter((item) => item.status === ItemStatus.AVAILABLE)
      .length,
    requested: items.filter((item) => item.status === ItemStatus.REQUESTED)
      .length,
    swapped: items.filter((item) => item.status === ItemStatus.SWAPPED).length,
  };
};

export const getItemsByOwner = (
  ownerId: string,
  items: Item[] = allItems
): Item[] => {
  return items.filter((item) => item.ownerId === ownerId);
};

export const getRecentItems = (items: Item[] = allItems): Item[] => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return items
    .filter((item) => new Date(item.createdAt) >= thirtyDaysAgo)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export const getPopularItems = (items: Item[] = allItems): Item[] => {
  return [...items]
    .sort((a, b) => b.views + b.saves * 2 - (a.views + a.saves * 2))
    .slice(0, 5);
};

export const searchAndFilterItems = (
  items: Item[],
  filters: {
    searchQuery?: string;
    status?: ItemStatus | "all";
    category?: ItemCategory | "all";
  }
): Item[] => {
  let filteredItems = items;

  if (filters.searchQuery) {
    filteredItems = filterItemsBySearch(filteredItems, filters.searchQuery);
  }

  if (filters.status) {
    filteredItems = filterItemsByStatus(filteredItems, filters.status);
  }

  if (filters.category) {
    filteredItems = filterItemsByCategory(filteredItems, filters.category);
  }

  return filteredItems;
};

export const addItemToUserCollection = (
  newItem: Omit<
    Item,
    | "id"
    | "ownerId"
    | "ownerName"
    | "ownerAvatar"
    | "createdAt"
    | "updatedAt"
    | "views"
    | "saves"
  >
): Item => {
  const item: Item = {
    ...newItem,
    id: `item_${Date.now()}`,
    ownerId: "current_user",
    ownerName: "Current User",
    ownerAvatar: "https://i.pravatar.cc/150?img=1",
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 0,
    saves: 0,
    swapRequests: 0,
    environmentalImpact: {
      carbonSaved: calculateCarbonSavings(newItem.category),
      waterSaved: 500,
      landfillSaved: 2,
      offsetComparisons: {
        carRides: 5,
        flightHours: 0.5,
        homeDays: 2,
        treeDays: 10,
        lightbulbHours: 100,
        showerMinutes: 60,
        meatMeals: 3,
        coffeeCups: 20,
      },
    },
    changeHistory: [],
  };

  currentUserItems.push(item);
  return item;
};

export const updateItemInUserCollection = (
  itemId: string,
  updates: Partial<Item>
): Item | null => {
  const index = currentUserItems.findIndex((item) => item.id === itemId);

  if (index === -1) return null;

  currentUserItems[index] = {
    ...currentUserItems[index],
    ...updates,
    updatedAt: new Date(),
  };

  return currentUserItems[index];
};

export const deleteItemFromUserCollection = (itemId: string): boolean => {
  const index = currentUserItems.findIndex((item) => item.id === itemId);

  if (index === -1) return false;

  currentUserItems.splice(index, 1);
  return true;
};

export const dataCollections = {
  allItems: allItems,

  myListings: currentUserItems,

  recentItems: getRecentItems(),

  popularItems: getPopularItems(),

  availableItems: filterItemsByStatus(currentUserItems, ItemStatus.AVAILABLE),
  requestedItems: filterItemsByStatus(currentUserItems, ItemStatus.REQUESTED),
  swappedItems: filterItemsByStatus(currentUserItems, ItemStatus.SWAPPED),

  statusCounts: getItemStatusCounts(),
};

export const listingConfigs = {
  myListings: {
    title: "My Listings",
    description: "Manage your items and track their status",
    emptyStateMessage:
      "You haven't listed any items yet. Create your first listing to get started!",
    items: currentUserItems,
    allowAdd: true,
    allowEdit: true,
    allowDelete: true,
  },

  browsing: {
    title: "Browse Items",
    description: "Discover amazing items from your community",
    emptyStateMessage: "No items available right now. Check back later!",
    items: allItems,
    allowAdd: false,
    allowEdit: false,
    allowDelete: false,
  },

  saved: {
    title: "Saved Items",
    description: "Items you've saved for later",
    emptyStateMessage:
      "You haven't saved any items yet. Browse items and save the ones you like!",
    items: [],
    allowAdd: false,
    allowEdit: false,
    allowDelete: false,
  },
};

export const calculateCarbonSavings = (category: ItemCategory): number => {
  return CARBON_SAVINGS_BY_CATEGORY[category] || 1.0;
};

export const isItemExpired = (item: Item): boolean => {
  if (!item.expiresAt) return false;
  return new Date() > item.expiresAt;
};

export const isBoostExpired = (item: Item): boolean => {
  if (!item.isBoosted || !item.boostExpiresAt) return false;
  return new Date() > item.boostExpiresAt;
};

export const getDaysUntilExpiration = (item: Item): number => {
  if (!item.expiresAt) return -1;
  const now = new Date();
  const diffTime = item.expiresAt.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getDaysUntilBoostExpiration = (item: Item): number => {
  if (!item.isBoosted || !item.boostExpiresAt) return -1;
  const now = new Date();
  const diffTime = item.boostExpiresAt.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateDefaultExpiration = (): Date => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + DEFAULT_EXPIRATION_DAYS);
  return expirationDate;
};

export const calculateBoostExpiration = (): Date => {
  const boostExpirationDate = new Date();
  boostExpirationDate.setDate(
    boostExpirationDate.getDate() + BOOST_DURATION_DAYS
  );
  return boostExpirationDate;
};

export const getItemStatusInfo = (
  status: ItemStatus
): {
  label: string;
  color: string;
  bgColor: string;
  description: string;
} => {
  const statusInfo: Record<
    ItemStatus,
    {
      label: string;
      color: string;
      bgColor: string;
      description: string;
    }
  > = {
    [ItemStatus.AVAILABLE]: {
      label: "Available",
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "This item is available for swapping",
    },
    [ItemStatus.REQUESTED]: {
      label: "Requested",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Someone has requested to swap this item",
    },
    [ItemStatus.SWAPPED]: {
      label: "Swapped",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "This item has been successfully swapped",
    },
    [ItemStatus.PENDING]: {
      label: "Pending",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      description: "This swap request is pending approval",
    },
    [ItemStatus.REPORTED]: {
      label: "Reported",
      color: "text-red-600",
      bgColor: "bg-red-100",
      description: "This item has been reported for review",
    },
    [ItemStatus.REJECTED]: {
      label: "Rejected",
      color: "text-red-600",
      bgColor: "bg-red-100",
      description: "This swap request has been rejected",
    },
    [ItemStatus.REMOVED]: {
      label: "Removed",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      description: "This item has been removed from the platform",
    },
    [ItemStatus.DRAFT]: {
      label: "Draft",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      description: "This item is still in draft mode",
    },
    [ItemStatus.EXPIRED]: {
      label: "Expired",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      description: "This item listing has expired",
    },
  };

  return statusInfo[status];
};

export const isValidStatusTransition = (
  currentStatus: ItemStatus,
  newStatus: ItemStatus
): boolean => {
  const validTransitions: Record<ItemStatus, ItemStatus[]> = {
    [ItemStatus.AVAILABLE]: [
      ItemStatus.REQUESTED,
      ItemStatus.REMOVED,
      ItemStatus.REPORTED,
      ItemStatus.REJECTED,
      ItemStatus.EXPIRED,
    ],
    [ItemStatus.REQUESTED]: [
      ItemStatus.AVAILABLE,
      ItemStatus.SWAPPED,
      ItemStatus.REMOVED,
      ItemStatus.REPORTED,
      ItemStatus.REJECTED,
    ],
    [ItemStatus.SWAPPED]: [ItemStatus.AVAILABLE, ItemStatus.REMOVED],
    [ItemStatus.PENDING]: [
      ItemStatus.AVAILABLE,
      ItemStatus.SWAPPED,
      ItemStatus.REMOVED,
      ItemStatus.REJECTED,
    ],
    [ItemStatus.REPORTED]: [
      ItemStatus.AVAILABLE,
      ItemStatus.REMOVED,
      ItemStatus.REJECTED,
    ],
    [ItemStatus.REJECTED]: [ItemStatus.AVAILABLE, ItemStatus.REMOVED],
    [ItemStatus.REMOVED]: [ItemStatus.AVAILABLE],
    [ItemStatus.DRAFT]: [ItemStatus.AVAILABLE, ItemStatus.REMOVED],
    [ItemStatus.EXPIRED]: [ItemStatus.AVAILABLE, ItemStatus.REMOVED],
  };

  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

export const getItemsNeedingStatusUpdate = (items: Item[]): Item[] => {
  return items.filter((item) => {
    if (isItemExpired(item) && item.status === ItemStatus.AVAILABLE) {
      return true;
    }

    if (isBoostExpired(item)) {
      return true;
    }

    return false;
  });
};

export const updateItemAnalytics = (
  item: Item,
  action: "view" | "save" | "unsave" | "request"
): Item => {
  const updatedItem = { ...item };

  switch (action) {
    case "view":
      updatedItem.views += 1;
      break;
    case "save":
      updatedItem.saves += 1;
      break;
    case "unsave":
      updatedItem.saves = Math.max(0, updatedItem.saves - 1);
      break;
    case "request":
      updatedItem.swapRequests += 1;
      break;
  }

  updatedItem.updatedAt = new Date();
  return updatedItem;
};

export const createNewItem = (
  itemData: Omit<
    Item,
    | "id"
    | "ownerId"
    | "ownerName"
    | "ownerAvatar"
    | "createdAt"
    | "updatedAt"
    | "views"
    | "swapRequests"
    | "saves"
    | "changeHistory"
  >
): Omit<Item, "id" | "ownerId" | "ownerName" | "ownerAvatar"> => {
  return {
    ...itemData,
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 0,
    saves: 0,
    swapRequests: 0,
    environmentalImpact: {
      carbonSaved: calculateCarbonSavings(itemData.category),
      waterSaved: 500,
      landfillSaved: 2,
      offsetComparisons: {
        carRides: 5,
        flightHours: 0.5,
        homeDays: 2,
        treeDays: 10,
        lightbulbHours: 100,
        showerMinutes: 60,
        meatMeals: 3,
        coffeeCups: 20,
      },
    },
    changeHistory: [],
  };
};

export const addChangeHistory = (
  item: Item,
  field: string,
  oldValue: any,
  newValue: any,
  changedBy: string
): Item => {
  const changeEntry = {
    field,
    oldValue,
    newValue,
    changedAt: new Date(),
    changedBy,
  };

  return {
    ...item,
    changeHistory: [...(item.changeHistory || []), changeEntry],
    updatedAt: new Date(),
  };
};

export const getItemsByStatus = (
  items: Item[],
  status: ItemStatus | "all"
): Item[] => {
  if (status === "all") {
    return items;
  }
  return items.filter((item) => item.status === status);
};

export const getBoostedItems = (items: Item[]): Item[] => {
  return items.filter((item) => item.isBoosted && !isBoostExpired(item));
};

export const getExpiredItems = (items: Item[]): Item[] => {
  return items.filter((item) => isItemExpired(item));
};

export const getItemsExpiringSoon = (
  items: Item[],
  days: number = 7
): Item[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + days);

  return items.filter((item) => {
    if (!item.expiresAt) return false;
    return item.expiresAt <= cutoffDate && !isItemExpired(item);
  });
};

export const calculateTotalCarbonSavings = (items: Item[]): number => {
  return items.reduce((total, item) => {
    return total + (item.environmentalImpact?.carbonSaved || 0);
  }, 0);
};

export const getItemsByCarbonSavings = (
  items: Item[],
  limit: number = 10
): Item[] => {
  return [...items]
    .sort(
      (a, b) =>
        (b.environmentalImpact?.carbonSaved || 0) -
        (a.environmentalImpact?.carbonSaved || 0)
    )
    .slice(0, limit);
};

export const getItemsByPopularity = (
  items: Item[],
  limit: number = 10
): Item[] => {
  return [...items]
    .sort((a, b) => b.views + b.saves * 2 - (a.views + a.saves * 2))
    .slice(0, limit);
};

export const getItemsByRecentActivity = (
  items: Item[],
  limit: number = 10
): Item[] => {
  return [...items]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, limit);
};

export const mockItemData = {
  id: "mock_item_001",
  title: "Mock Item",
  description: "A mock item for testing",
  category: ItemCategory.OTHER,
  condition: ItemCondition.EXCELLENT,
  status: ItemStatus.AVAILABLE,
  images: ["https://via.placeholder.com/400"],
  location: "Test Location",
  coordinates: { lat: 0, lng: 0 },
  ownerId: "mock_user_001",
  ownerName: "Mock User",
  ownerAvatar: "https://i.pravatar.cc/150?img=1",
  createdAt: new Date(),
  updatedAt: new Date(),
  views: 0,
  saves: 0,
  swapRequests: 0,
  tags: ["mock", "test"],
  environmentalImpact: {
    carbonSaved: CARBON_SAVINGS_BY_CATEGORY[ItemCategory.OTHER],
    waterSaved: 500,
    landfillSaved: 2,
    offsetComparisons: {
      carRides: 5,
      flightHours: 0.5,
      homeDays: 2,
      treeDays: 10,
      lightbulbHours: 100,
      showerMinutes: 60,
      meatMeals: 3,
      coffeeCups: 20,
    },
  },
  changeHistory: [],
};

export const ensureUserItems = (user: UserProfile): Item[] => {
  if (!user) {
    return [];
  }

  if (!user.items) {
    return allItems.filter((item) => item.ownerId === user.id) || [];
  }
  return user.items
    .filter((item): item is Item => {
      if (!item || typeof item !== "object") return false;

      const requiredProps = [
        "id",
        "title",
        "description",
        "category",
        "condition",
        "status",
        "images",
        "location",
        "ownerId",
        "ownerName",
        "createdAt",
        "updatedAt",
        "views",
        "saves",
        "swapRequests",
        "tags",
        "environmentalImpact",
      ];

      return requiredProps.every((prop) => prop in item);
    })
    .map((item) => ({
      ...item,
      environmentalImpact: item.environmentalImpact || {
        carbonSaved: 0,
        waterSaved: 0,
        landfillSaved: 0,
        offsetComparisons: {
          carRides: 0,
          flightHours: 0,
          homeDays: 0,
          treeDays: 0,
          lightbulbHours: 0,
          showerMinutes: 0,
          meatMeals: 0,
          coffeeCups: 0,
        },
      },
    }));
};

const getAllowedStatusTransitions = (
  currentStatus: ItemStatus
): ItemStatus[] => {
  const allowedTransitions: Record<ItemStatus, ItemStatus[]> = {
    [ItemStatus.AVAILABLE]: [
      ItemStatus.REQUESTED,
      ItemStatus.REPORTED,
      ItemStatus.REJECTED,
      ItemStatus.REMOVED,
    ],
    [ItemStatus.REQUESTED]: [
      ItemStatus.AVAILABLE,
      ItemStatus.SWAPPED,
      ItemStatus.REPORTED,
      ItemStatus.REJECTED,
      ItemStatus.REMOVED,
    ],
    [ItemStatus.SWAPPED]: [
      ItemStatus.REPORTED,
      ItemStatus.REJECTED,
      ItemStatus.REMOVED,
    ],
    [ItemStatus.PENDING]: [
      ItemStatus.AVAILABLE,
      ItemStatus.REQUESTED,
      ItemStatus.SWAPPED,
      ItemStatus.REJECTED,
    ],
    [ItemStatus.REPORTED]: [
      ItemStatus.AVAILABLE,
      ItemStatus.REJECTED,
      ItemStatus.REMOVED,
    ],
    [ItemStatus.REJECTED]: [ItemStatus.AVAILABLE, ItemStatus.REMOVED],
    [ItemStatus.REMOVED]: [ItemStatus.AVAILABLE],
    [ItemStatus.DRAFT]: [ItemStatus.AVAILABLE, ItemStatus.REMOVED],
    [ItemStatus.EXPIRED]: [ItemStatus.AVAILABLE, ItemStatus.REMOVED],
  };

  return allowedTransitions[currentStatus];
};

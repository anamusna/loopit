"use client";
import {
  CommunityBoardCategory,
  CommunityEvent,
  CommunityPost,
  EventType,
} from "@/shared/types";
import { useLoopItStore } from "@/store";
import {
  faAward,
  faBook,
  faCalendarAlt,
  faCheckCircle,
  faClock,
  faComments,
  faExclamationCircle,
  faGift,
  faGlobe,
  faHandshake,
  faHeart,
  faLeaf,
  faLightbulb,
  faMapMarkerAlt,
  faPlus,
  faQuestionCircle,
  faRecycle,
  faReply,
  faSearch,
  faThumbsUp,
  faTools,
  faTrophy,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

// Client-side only date formatter to prevent hydration issues
const useClientDateFormatter = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatDate = (date: Date) => {
    if (!isClient) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }).format(date);
  };

  const formatPostDate = (date: Date) => {
    if (!isClient) return "";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return { formatDate, formatPostDate, isClient };
};

// Category configuration with icons and colors
const CATEGORY_CONFIG = {
  [CommunityBoardCategory.HELP_REQUESTS]: {
    icon: faQuestionCircle,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  [CommunityBoardCategory.LOCAL_DISCUSSIONS]: {
    icon: faComments,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  [CommunityBoardCategory.SKILL_SHARING]: {
    icon: faLightbulb,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  [CommunityBoardCategory.LOST_AND_FOUND]: {
    icon: faExclamationCircle,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
  [CommunityBoardCategory.GENERAL]: {
    icon: faComments,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
};

const EVENT_TYPE_CONFIG = {
  [EventType.CLOTHING_SWAP]: {
    icon: faHandshake,
    color: "text-pink-600",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
  },
  [EventType.FREECYCLE_MEETUP]: {
    icon: faRecycle,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  [EventType.GIVEAWAY_DAY]: {
    icon: faGift,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  [EventType.COMMUNITY_REPAIR]: {
    icon: faTools,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  [EventType.SKILL_SHARE]: {
    icon: faBook,
    color: "text-teal-600",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
  },
};

// Community Stats Component
const CommunityStats: React.FC = () => {
  const environmentalImpact = useLoopItStore(
    (state) => state.environmentalImpact
  );
  const communityPosts = useLoopItStore((state) => state.communityPosts);
  const communityEvents = useLoopItStore((state) => state.communityEvents);

  const stats = useMemo(() => {
    const totalPosts = communityPosts.length;
    const totalEvents = communityEvents.length;
    const activeEvents = communityEvents.filter(
      (event) => event.isActive
    ).length;
    const totalParticipants = communityEvents.reduce(
      (sum, event) => sum + event.currentParticipants,
      0
    );

    return {
      posts: totalPosts,
      events: totalEvents,
      activeEvents,
      participants: totalParticipants,
      carbonSaved: environmentalImpact?.communityCarbonSaved || 0,
      topContributors: environmentalImpact?.topContributors || [],
    };
  }, [communityPosts, communityEvents, environmentalImpact]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200/60 dark:border-blue-800/60 animate-elegant-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Community Posts
            </p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {stats.posts}
            </p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-800/40 rounded-lg">
            <FontAwesomeIcon
              icon={faComments}
              className="h-6 w-6 text-blue-600 dark:text-blue-400"
            />
          </div>
        </div>
      </div>

      <div
        className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200/60 dark:border-green-800/60 animate-elegant-fade-up"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              Active Events
            </p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
              {stats.activeEvents}
            </p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-800/40 rounded-lg">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="h-6 w-6 text-green-600 dark:text-green-400"
            />
          </div>
        </div>
      </div>

      <div
        className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200/60 dark:border-purple-800/60 animate-elegant-fade-up"
        style={{ animationDelay: "200ms" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Participants
            </p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {stats.participants}
            </p>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-800/40 rounded-lg">
            <FontAwesomeIcon
              icon={faUsers}
              className="h-6 w-6 text-purple-600 dark:text-purple-400"
            />
          </div>
        </div>
      </div>

      <div
        className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl p-6 border border-emerald-200/60 dark:border-emerald-800/60 animate-elegant-fade-up"
        style={{ animationDelay: "300ms" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              CO₂ Saved
            </p>
            <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              {Math.round(stats.carbonSaved)}kg
            </p>
          </div>
          <div className="p-3 bg-emerald-100 dark:bg-emerald-800/40 rounded-lg">
            <FontAwesomeIcon
              icon={faLeaf}
              className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Community Post Card Component
const CommunityPostCard: React.FC<{ post: CommunityPost }> = ({ post }) => {
  const config = CATEGORY_CONFIG[post.category];
  const [isLiked, setIsLiked] = useState(false);
  const { formatPostDate } = useClientDateFormatter();

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-6 hover:shadow-lg transition-all duration-300 animate-elegant-fade-up group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent">
            <Image
              src={post.authorAvatar || "https://i.pravatar.cc/150?img=11"}
              alt={post.authorName}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {post.authorName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {post.location}
            </p>
          </div>
        </div>
        <div
          className={clsx(
            "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1",
            config.bgColor,
            config.color
          )}
        >
          <FontAwesomeIcon icon={config.icon} className="h-3 w-3" />
          {post.category.replace(/_/g, " ").toLowerCase()}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary transition-colors duration-200">
        {post.title}
      </h3>

      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
        {post.content}
      </p>

      {post.images && post.images.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-1 gap-2">
            {post.images.slice(0, 2).map((image, index) => (
              <div
                key={index}
                className="relative h-32 rounded-lg overflow-hidden"
              >
                <Image
                  src={image}
                  alt={`Post image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={clsx(
              "flex items-center gap-1.5 transition-all duration-200",
              isLiked ? "text-red-500" : "hover:text-red-500"
            )}
          >
            <FontAwesomeIcon icon={faThumbsUp} className="h-4 w-4" />
            <span>{post.upvotes + (isLiked ? 1 : 0)}</span>
          </button>
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faReply} className="h-4 w-4" />
            <span>{post.replyCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
            <span>{formatPostDate(new Date(post.createdAt))}</span>
          </div>
        </div>

        {post.isResolved && (
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4" />
            <span className="text-xs font-medium">Resolved</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Community Event Card Component
const CommunityEventCard: React.FC<{ event: CommunityEvent }> = ({ event }) => {
  const config = EVENT_TYPE_CONFIG[event.type];
  const [isJoined, setIsJoined] = useState(
    event.participants.includes("current_user_id")
  );
  const { formatDate } = useClientDateFormatter();

  const isUpcoming = new Date(event.dateTime) > new Date();
  const isFull = Boolean(
    event.maxParticipants && event.currentParticipants >= event.maxParticipants
  );

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-6 hover:shadow-lg transition-all duration-300 animate-elegant-fade-up group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={clsx("p-3 rounded-lg", config.bgColor)}>
            <FontAwesomeIcon
              icon={config.icon}
              className={clsx("h-5 w-5", config.color)}
            />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {event.organizerName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {event.location}
            </p>
          </div>
        </div>
        <div
          className={clsx(
            "px-3 py-1 rounded-full text-xs font-medium",
            config.bgColor,
            config.color
          )}
        >
          {event.type.replace(/_/g, " ").toLowerCase()}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary transition-colors duration-200">
        {event.title}
      </h3>

      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
        {event.description}
      </p>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4" />
          <span>{formatDate(event.dateTime)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <FontAwesomeIcon icon={faUsers} className="h-4 w-4" />
          <span>
            {event.currentParticipants}/{event.maxParticipants || "∞"}{" "}
            participants
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {event.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => setIsJoined(!isJoined)}
          disabled={!isUpcoming || isFull}
          className={clsx(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            isJoined
              ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              : isFull
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/90"
          )}
        >
          {isJoined ? "Leave" : isFull ? "Full" : "Join"}
        </button>
      </div>
    </div>
  );
};

// Top Contributors Component
const TopContributors: React.FC = () => {
  const environmentalImpact = useLoopItStore(
    (state) => state.environmentalImpact
  );
  const topContributors = environmentalImpact?.topContributors || [];

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200/60 dark:border-amber-800/60">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-amber-100 dark:bg-amber-800/40 rounded-lg">
          <FontAwesomeIcon
            icon={faTrophy}
            className="h-6 w-6 text-amber-600 dark:text-amber-400"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Top Contributors
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Community environmental champions
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {topContributors.slice(0, 5).map((contributor) => (
          <div
            key={contributor.user.id}
            className="flex items-center gap-4 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent">
                  <Image
                    src={
                      contributor.user.avatar ||
                      "https://i.pravatar.cc/150?img=11"
                    }
                    alt={contributor.user.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {contributor.rankEmoji}
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {contributor.user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {contributor.totalSwaps} swaps
                </p>
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round(contributor.carbonSaved)}kg CO₂
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">saved</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Quick Actions Component
const QuickActions: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <button className="group bg-gradient-to-br from-primary to-accent text-white rounded-xl p-6 text-left hover:shadow-lg transition-all duration-300 animate-elegant-fade-up">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-200">
            <FontAwesomeIcon icon={faPlus} className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Create Post</h3>
            <p className="text-sm opacity-90">Share with the community</p>
          </div>
        </div>
      </button>

      <button
        className="group bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl p-6 text-left hover:shadow-lg transition-all duration-300 animate-elegant-fade-up"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-200">
            <FontAwesomeIcon icon={faCalendarAlt} className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Host Event</h3>
            <p className="text-sm opacity-90">Organize community events</p>
          </div>
        </div>
      </button>

      <button
        className="group bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl p-6 text-left hover:shadow-lg transition-all duration-300 animate-elegant-fade-up"
        style={{ animationDelay: "200ms" }}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-200">
            <FontAwesomeIcon icon={faSearch} className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Find Help</h3>
            <p className="text-sm opacity-90">Browse help requests</p>
          </div>
        </div>
      </button>
    </div>
  );
};

const CommunityPage: React.FC = () => {
  const {
    communityPosts,
    communityEvents,
    isLoadingCommunity,
    fetchCommunityPosts,
    fetchCommunityEvents,
  } = useLoopItStore();

  const [activeTab, setActiveTab] = useState<"posts" | "events">("posts");
  const [selectedCategory, setSelectedCategory] = useState<
    CommunityBoardCategory | "all"
  >("all");

  useEffect(() => {
    fetchCommunityPosts();
    fetchCommunityEvents();
  }, [fetchCommunityPosts, fetchCommunityEvents]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "all") return communityPosts;
    return communityPosts.filter((post) => post.category === selectedCategory);
  }, [communityPosts, selectedCategory]);

  const upcomingEvents = useMemo(() => {
    return communityEvents
      .filter(
        (event) => new Date(event.dateTime) > new Date() && event.isActive
      )
      .sort(
        (a, b) =>
          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      );
  }, [communityEvents]);

  const categories = Object.values(CommunityBoardCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-emerald-900/10">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center animate-elegant-fade-up">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Welcome to the{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                LoopIt Community
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect with neighbors, share skills, and build a sustainable
              community together. From help requests to local events, everything
              happens here.
            </p>

            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUsers} className="h-4 w-4" />
                <span>Active Community</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faLeaf} className="h-4 w-4" />
                <span>Eco-Friendly</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faHandshake} className="h-4 w-4" />
                <span>Local Focus</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <CommunityStats />

        <QuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("posts")}
                className={clsx(
                  "px-6 py-3 font-medium transition-all duration-200 border-b-2",
                  activeTab === "posts"
                    ? "text-primary border-primary"
                    : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                <FontAwesomeIcon icon={faComments} className="h-4 w-4 mr-2" />
                Community Posts
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={clsx(
                  "px-6 py-3 font-medium transition-all duration-200 border-b-2",
                  activeTab === "events"
                    ? "text-primary border-primary"
                    : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="h-4 w-4 mr-2"
                />
                Upcoming Events
              </button>
            </div>

            {/* Category Filter for Posts */}
            {activeTab === "posts" && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={clsx(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    selectedCategory === "all"
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={clsx(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      selectedCategory === category
                        ? "bg-primary text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    )}
                  >
                    {category.replace(/_/g, " ").toLowerCase()}
                  </button>
                ))}
              </div>
            )}

            {/* Content */}
            {isLoadingCommunity ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white/80 dark:bg-gray-900/80 rounded-xl p-6 animate-pulse"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activeTab === "posts" ? (
              <div className="space-y-6">
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <FontAwesomeIcon
                      icon={faComments}
                      className="h-12 w-12 text-gray-400 mx-auto mb-4"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No posts found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Be the first to start a conversation!
                    </p>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <CommunityPostCard key={post.id} post={post} />
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="h-12 w-12 text-gray-400 mx-auto mb-4"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No upcoming events
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Be the first to organize an event!
                    </p>
                  </div>
                ) : (
                  upcomingEvents.map((event) => (
                    <CommunityEventCard key={event.id} event={event} />
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <TopContributors />

            {/* Environmental Impact */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200/60 dark:border-emerald-800/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-800/40 rounded-lg">
                  <FontAwesomeIcon
                    icon={faGlobe}
                    className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Community Impact
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Environmental achievements
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    CO₂ Saved
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {Math.round(
                      useLoopItStore.getState().environmentalImpact
                        ?.communityCarbonSaved || 0
                    )}
                    kg
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Items Swapped
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {communityPosts.length + upcomingEvents.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Active Members
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {upcomingEvents.reduce(
                      (sum, event) => sum + event.currentParticipants,
                      0
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200/60 dark:border-blue-800/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-800/40 rounded-lg">
                  <FontAwesomeIcon
                    icon={faAward}
                    className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Community Guidelines
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Keep our community positive
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="h-4 w-4 text-red-500 mt-0.5"
                  />
                  <span>Be kind and respectful to everyone</span>
                </div>
                <div className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faRecycle}
                    className="h-4 w-4 text-green-500 mt-0.5"
                  />
                  <span>Focus on sustainability and reuse</span>
                </div>
                <div className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faHandshake}
                    className="h-4 w-4 text-blue-500 mt-0.5"
                  />
                  <span>Build trust through honest interactions</span>
                </div>
                <div className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="h-4 w-4 text-purple-500 mt-0.5"
                  />
                  <span>Support local community growth</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;

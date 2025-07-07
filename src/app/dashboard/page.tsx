"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DashboardMessages } from "@/components/dashboard/DashboardMessages";
import { DashboardSwapRequests } from "@/components/dashboard/DashboardSwapRequests";
import { SavedItems } from "@/components/dashboard/SavedItems";
import {
  EcoTip,
  EnvironmentalImpactCard,
  EnvironmentalLeaderboard,
} from "@/components/environmental";
import { MyListings } from "@/components/item/MyListings";
import { ProfileOverview } from "@/components/profile/ProfileOverview";
import { ReviewForm, ReviewsList } from "@/components/reviews";
import { useDashboardItems } from "@/hooks/useItems";
import { useReviewPrompt } from "@/hooks/useReviewPrompt";
import { useLoopItStore } from "@/store";
import Badge, { BadgeVariant } from "@/tailwind/components/elements/Badge";
import Tabs, {
  TabsSize,
  TabsVariant,
} from "@/tailwind/components/elements/Tabs";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Card, { CardBody } from "@/tailwind/components/layout/Card";
import Container from "@/tailwind/components/layout/Container";
import {
  faBell,
  faChartLine,
  faComments,
  faExchangeAlt,
  faHeart,
  faLeaf,
  faList,
  faShieldAlt,
  faStar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}> = ({
  title,
  value,
  icon,
  trend,
  trendType = "neutral",
  className = "",
  style,
  onClick,
}) => {
  const getTrendColor = () => {
    switch (trendType) {
      case "positive":
        return "text-success";
      case "negative":
        return "text-destructive";
      default:
        return "text-text-muted";
    }
  };
  return (
    <Card
      className={`bg-gradient-to-br from-card to-card/80 shadow-medium border border-border/20 hover:shadow-heavy transition-all duration-300 animate-refined-fade cursor-pointer group ${
        onClick ? "hover:scale-105 hover:border-primary/40 active:scale-95" : ""
      } ${className}`}
      style={style}
      onClick={onClick}
    >
      <CardBody className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Typography
              as={TypographyVariant.P}
              className="text-xs sm:text-sm font-medium text-text-muted mb-1"
            >
              {title}
            </Typography>
            <Typography
              as={TypographyVariant.H3}
              className="text-lg sm:text-xl lg:text-2xl font-bold text-text-primary mb-1"
            >
              {value}
            </Typography>
            {trend && (
              <div
                className={`flex items-center gap-1 text-xs font-medium ${getTrendColor()}`}
              >
                <FontAwesomeIcon icon={faChartLine} className="w-3 h-3" />
                <span>{trend}</span>
              </div>
            )}
          </div>
          <div
            className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center border border-primary/20 transition-all duration-300 ${
              onClick
                ? "group-hover:scale-110 group-hover:bg-primary/30 group-hover:border-primary/40"
                : ""
            }`}
          >
            <div className="text-primary text-lg sm:text-xl transition-transform duration-300 group-hover:scale-110">
              {icon}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
const DashboardContent: React.FC = React.memo(() => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    userItems,
    savedItems,
    itemStats,
    isLoading: isLoadingItems,
  } = useDashboardItems();
  const {
    user,
    unreadCount,
    sentRequests,
    receivedRequests,
    receivedReviews,
    environmentalImpact,
    swapRequests,
  } = useLoopItStore();
  const validTabs = useMemo(
    () => [
      "profile",
      "my-listings",
      "saved-items",
      "swap-requests",
      "messages",
      "reviews",
      "environmental",
    ],
    []
  );
  const initialTab = searchParams.get("tab") || "profile";
  const validatedInitialTab = useMemo(
    () => (validTabs.includes(initialTab) ? initialTab : "profile"),
    [initialTab, validTabs]
  );
  const [activeTab, setActiveTab] = useState(validatedInitialTab);
  const {
    showReviewPrompt,
    pendingReview,
    closeReviewPrompt,
    checkForPendingReviews,
  } = useReviewPrompt();
  const totalSwapRequests = useMemo(
    () => sentRequests.length + receivedRequests.length,
    [sentRequests.length, receivedRequests.length]
  );
  const statsData = useMemo(
    () => [
      {
        title: "Active Listings",
        value: itemStats.totalItems,
        icon: <FontAwesomeIcon icon={faList} />,
        trend: "+2 this week",
        trendType: "positive" as const,
        tabId: "my-listings" as const,
      },
      {
        title: "Saved Items",
        value: itemStats.savedItemsCount,
        icon: <FontAwesomeIcon icon={faHeart} />,
        trend: "+5 this month",
        trendType: "positive" as const,
        tabId: "saved-items" as const,
      },
      {
        title: "Swap Requests",
        value: totalSwapRequests,
        icon: <FontAwesomeIcon icon={faExchangeAlt} />,
        trend: "3 pending",
        trendType: "neutral" as const,
        tabId: "swap-requests" as const,
      },
      {
        title: "Unread Messages",
        value: unreadCount,
        icon: <FontAwesomeIcon icon={faBell} />,
        trend: unreadCount > 0 ? "New messages" : "All caught up",
        trendType:
          unreadCount > 0 ? ("negative" as const) : ("positive" as const),
        tabId: "messages" as const,
      },
      {
        title: "Carbon Saved",
        value: environmentalImpact?.userCarbonSaved
          ? `${Math.round(environmentalImpact.userCarbonSaved)}kg`
          : "0kg",
        icon: <FontAwesomeIcon icon={faLeaf} />,
        trend: environmentalImpact?.userCarbonSaved
          ? "View Impact"
          : "Start Swapping",
        trendType: "positive" as const,
        tabId: "environmental" as const,
      },
    ],
    [
      itemStats.totalItems,
      itemStats.savedItemsCount,
      totalSwapRequests,
      unreadCount,
      environmentalImpact?.userCarbonSaved,
    ]
  );
  useEffect(() => {
    const tab = searchParams.get("tab") || "profile";
    const validatedTab = validTabs.includes(tab) ? tab : "profile";
    setActiveTab(validatedTab);
    if (tab !== validatedTab) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("tab", validatedTab);
      router.replace(currentUrl.pathname + currentUrl.search, {
        scroll: false,
      });
    }
  }, [searchParams, router, validTabs]);
  useEffect(() => {
    if (user) {
      checkForPendingReviews();
    }
  }, [user, checkForPendingReviews]);
  const handleTabChange = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);
      router.push(`/dashboard?tab=${tabId}`, { scroll: false });
    },
    [router]
  );
  const tabs = useMemo(
    () => [
      {
        id: "profile",
        label: "Profile",
        icon: <FontAwesomeIcon icon={faUser} />,
        content: <ProfileOverview />,
      },
      {
        id: "my-listings",
        label: "My Listings",
        icon: <FontAwesomeIcon icon={faList} />,
        badge:
          itemStats.totalItems > 0
            ? itemStats.totalItems.toString()
            : undefined,
        content: <MyListings />,
      },
      {
        id: "saved-items",
        label: "Saved Items",
        icon: <FontAwesomeIcon icon={faHeart} />,
        badge:
          itemStats.savedItemsCount > 0
            ? itemStats.savedItemsCount.toString()
            : undefined,
        content: <SavedItems />,
      },
      {
        id: "swap-requests",
        label: "Swap Requests",
        icon: <FontAwesomeIcon icon={faExchangeAlt} />,
        badge: totalSwapRequests > 0 ? totalSwapRequests.toString() : undefined,
        content: <DashboardSwapRequests />,
      },
      {
        id: "messages",
        label: "Messages",
        icon: <FontAwesomeIcon icon={faComments} />,
        badge: unreadCount > 0 ? unreadCount.toString() : undefined,
        content: <DashboardMessages />,
      },
      {
        id: "reviews",
        label: "Reviews",
        icon: <FontAwesomeIcon icon={faStar} />,
        badge:
          receivedReviews.length > 0
            ? receivedReviews.length.toString()
            : undefined,
        content: <ReviewsList reviews={receivedReviews} />,
      },
      {
        id: "environmental",
        label: "Environmental",
        icon: <FontAwesomeIcon icon={faLeaf} />,
        content: (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EnvironmentalImpactCard />
            <EnvironmentalLeaderboard />
            <EcoTip />
          </div>
        ),
      },
    ],
    [
      itemStats.totalItems,
      itemStats.savedItemsCount,
      totalSwapRequests,
      unreadCount,
      receivedReviews.length,
      receivedReviews,
    ]
  );
  const renderTabContent = () => {
    const tab = tabs.find((t) => t.id === activeTab);
    return tab ? tab.content : tabs[0].content;
  };
  return (
    <Container className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl" />
        <div className="relative py-4 sm:py-6 lg:py-8">
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div>
                    <Typography
                      as={TypographyVariant.H1}
                      className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-text-primary to-primary bg-clip-text text-transparent"
                    >
                      Welcome back
                      {user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
                    </Typography>
                    <Typography
                      as={TypographyVariant.P}
                      className="text-sm sm:text-base text-text-muted leading-relaxed"
                    >
                      Manage your profile, items, track swaps, and stay
                      connected
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Badge
                  variant={BadgeVariant.SUCCESS}
                  className="text-xs sm:text-sm font-semibold px-3 py-1.5"
                >
                  <FontAwesomeIcon
                    icon={faShieldAlt}
                    className="w-3 h-3 mr-1.5"
                  />
                  Account Active
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative space-y-6 sm:space-y-8 lg:space-y-10">
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl shadow-light border border-border/20 p-2 sm:p-3 mb-4 sm:mb-6 lg:mb-8">
          <Tabs
            items={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            size={TabsSize.LG}
            variant={TabsVariant.PILLS}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statsData.map((stat, index) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              trendType={stat.trendType}
              className="animate-elegant-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleTabChange(stat.tabId)}
            />
          ))}
        </div>
        {showReviewPrompt && pendingReview && (
          <ReviewForm
            isOpen={showReviewPrompt}
            onClose={closeReviewPrompt}
            swapRequestId={pendingReview.swapRequestId}
            toUserId={pendingReview.toUserId}
            toUserName={pendingReview.toUserName}
            itemId={
              swapRequests.find((req) => req.id === pendingReview.swapRequestId)
                ?.itemId || ""
            }
            itemTitle={pendingReview.itemTitle}
          />
        )}
      </div>
    </Container>
  );
});
DashboardContent.displayName = "DashboardContent";
const Dashboard: React.FC = React.memo(() => {
  return (
    <ProtectedRoute requireAuth={true}>
      <Suspense
        fallback={
          <Container className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
              <Typography as={TypographyVariant.P} className="text-text-muted">
                Loading your dashboard...
              </Typography>
            </div>
          </Container>
        }
      >
        <DashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
});
Dashboard.displayName = "Dashboard";
export default Dashboard;

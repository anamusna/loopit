"use client";
import { SubscriptionTier } from "@/shared/types";
import { useLoopItStore } from "@/store";
import Avatar, { AvatarSize } from "@/tailwind/components/elements/Avatar";
import Badge, { BadgeVariant } from "@/tailwind/components/elements/Badge";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import {
  faBell,
  faChartLine,
  faChevronRight,
  faCog,
  faComments,
  faCrown,
  faExchangeAlt,
  faHeart,
  faHome,
  faList,
  faShield,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
interface ProfileDropdownProps {
  className?: string;
}
const navigationItems = [
  {
    label: "Browse Items",
    path: "/",
    icon: faHome,
    color: "text-blue-600",
    bgHover: "hover:bg-blue-500/10",
    requiresAuth: false,
  },
  {
    label: "Saved Items",
    path: "/dashboard?tab=saved-items",
    icon: faHeart,
    color: "text-red-500",
    bgHover: "hover:bg-red-500/10",
    requiresAuth: true,
  },
  {
    label: "My Dashboard",
    path: "/dashboard?tab=profile",
    icon: faChartLine,
    color: "text-emerald-600",
    bgHover: "hover:bg-emerald-500/10",
    requiresAuth: true,
  },
  {
    label: "My Listings",
    path: "/dashboard?tab=my-listings",
    icon: faList,
    color: "text-teal-600",
    bgHover: "hover:bg-teal-500/10",
    requiresAuth: true,
  },
  {
    label: "Swap Requests",
    path: "/dashboard?tab=swap-requests",
    icon: faExchangeAlt,
    color: "text-purple-600",
    bgHover: "hover:bg-purple-500/10",
    requiresAuth: true,
  },
  {
    label: "Messages",
    path: "/dashboard?tab=messages",
    icon: faComments,
    color: "text-indigo-600",
    bgHover: "hover:bg-indigo-500/10",
    requiresAuth: true,
  },
  {
    label: "Notifications",
    path: "/dashboard?tab=notifications",
    icon: faBell,
    color: "text-amber-600",
    bgHover: "hover:bg-amber-500/10",
    requiresAuth: true,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: faCog,
    color: "text-gray-600",
    bgHover: "hover:bg-gray-500/10",
    requiresAuth: true,
  },
];
const UserStats = React.memo<{
  user: any;
  handleNavigation: (path: string) => void;
}>(({ user, handleNavigation }) => (
  <div className="grid grid-cols-3 gap-2 p-3 bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-xl border border-border/30">
    <button
      onClick={() => handleNavigation("/dashboard?tab=my-listings")}
      className="group text-center p-2 rounded-lg hover:bg-primary/10 transition-all duration-200"
    >
      <div className="text-lg font-bold text-emerald-600 group-hover:text-primary transition-colors">
        {user.stats?.itemsListed || 0}
      </div>
      <div className="text-xs text-text-muted">Items</div>
    </button>
    <button
      onClick={() => handleNavigation("/dashboard?tab=swap-requests")}
      className="group text-center p-2 rounded-lg hover:bg-primary/10 transition-all duration-200"
    >
      <div className="text-lg font-bold text-blue-600 group-hover:text-primary transition-colors">
        {user.stats?.successfulSwaps || 0}
      </div>
      <div className="text-xs text-text-muted">Swaps</div>
    </button>
    <button
      onClick={() => handleNavigation("/dashboard?tab=reviews")}
      className="group text-center p-2 rounded-lg hover:bg-primary/10 transition-all duration-200"
    >
      <div className="text-lg font-bold text-amber-600 group-hover:text-primary transition-colors">
        {user.stats?.rating?.toFixed(1) || "0.0"}
      </div>
      <div className="text-xs text-text-muted">Rating</div>
    </button>
  </div>
));
UserStats.displayName = "UserStats";
const NavigationItem = React.memo<{
  item: (typeof navigationItems)[0];
  badge?: React.ReactNode;
  onClick: () => void;
  isAuthenticated: boolean;
}>(({ item, badge, onClick, isAuthenticated }) => {
  if (item.requiresAuth && !isAuthenticated) return null;
  return (
    <button
      onClick={onClick}
      className={clsx(
        "group relative w-full rounded-lg p-3 transition-all duration-200",
        "border border-transparent hover:border-primary/20",
        "transform hover:scale-[1.01] hover:shadow-md",
        item.bgHover
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={clsx(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
              "bg-secondary/50 group-hover:bg-primary/20 group-hover:scale-110",
              "border border-border/50 group-hover:border-primary/30"
            )}
          >
            <FontAwesomeIcon
              icon={item.icon}
              className={clsx(
                "w-3.5 h-3.5 transition-all duration-200",
                item.color,
                "group-hover:text-primary group-hover:scale-110"
              )}
            />
          </div>
          <Typography
            as={TypographyVariant.P}
            className="font-medium text-text-primary group-hover:text-primary transition-colors duration-200"
          >
            {item.label}
          </Typography>
        </div>
        <div className="flex items-center space-x-2">
          {badge}
          <FontAwesomeIcon
            icon={faChevronRight}
            className="w-3 h-3 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200"
          />
        </div>
      </div>
    </button>
  );
});
NavigationItem.displayName = "NavigationItem";
const ProfileDropdown: React.FC<ProfileDropdownProps> = React.memo(
  ({ className = "" }) => {
    const router = useRouter();
    const {
      user,
      logout,
      isAuthenticated,
      unreadNotifications,
      unreadCount,
      receivedRequests,
    } = useLoopItStore();
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const toggleDropdown = useCallback(() => {
      if (isOpen) {
        setIsAnimating(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsAnimating(false);
        }, 150);
      } else {
        setIsOpen(true);
      }
    }, [isOpen]);
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          toggleDropdown();
        }
      };
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }
    }, [isOpen, toggleDropdown]);
    useEffect(() => {
      const handleKeyboard = (event: KeyboardEvent) => {
        if (event.key === "Escape" && isOpen) {
          toggleDropdown();
        }
      };
      if (isOpen) {
        document.addEventListener("keydown", handleKeyboard);
        return () => {
          document.removeEventListener("keydown", handleKeyboard);
        };
      }
    }, [isOpen, toggleDropdown]);
    const handleNavigation = useCallback(
      (path: string) => {
        setIsAnimating(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsAnimating(false);
          router.push(path);
        }, 100);
      },
      [router]
    );
    const handleLogout = useCallback(async () => {
      setIsAnimating(true);
      try {
        await logout();
        setTimeout(() => {
          setIsOpen(false);
          setIsAnimating(false);
          router.push("/login");
        }, 150);
      } catch (error) {
        console.error("Logout failed:", error);
        setIsAnimating(false);
      }
    }, [logout, router]);
    if (!isAuthenticated || !user) {
      return null;
    }
    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };
    const totalNotifications = (unreadNotifications || 0) + (unreadCount || 0);
    const pendingRequests =
      receivedRequests?.filter((req) => req.status === "pending")?.length || 0;
    const totalBadgeCount = totalNotifications + pendingRequests;
    return (
      <div className={clsx("relative z-[70]", className)} ref={dropdownRef}>
        {}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className={clsx(
              "relative group transition-all duration-200 transform",
              "hover:scale-105 focus:scale-105 focus:outline-none",
              "hover:drop-shadow-lg focus:drop-shadow-lg",
              isOpen && "scale-105 drop-shadow-lg"
            )}
            aria-label="Open profile menu"
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            <Avatar
              src={user.avatar}
              alt={user.name}
              initials={getInitials(user.name)}
              size={AvatarSize.MD}
              className={clsx(
                "ring-2 transition-all duration-200",
                isOpen
                  ? "ring-primary/60 shadow-lg shadow-primary/20"
                  : "ring-transparent group-hover:ring-primary/40 group-focus:ring-primary/40",
                "bg-gradient-to-br from-primary/10 to-accent/10"
              )}
            />
            {}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-card rounded-full animate-pulse" />
          </button>
          {}
          {totalBadgeCount > 0 && (
            <div className="absolute -top-1 -right-1 z-20">
              <Badge
                variant={BadgeVariant.DESTRUCTIVE}
                className={clsx(
                  "min-w-[20px] h-4 text-[10px] font-bold flex items-center justify-center px-1",
                  "animate-bounce shadow-md",
                  "bg-gradient-to-r from-red-500 to-red-600",
                  "ring-2 ring-card"
                )}
              >
                {totalBadgeCount > 99 ? "99+" : totalBadgeCount}
              </Badge>
            </div>
          )}
        </div>
        {}
        {(isOpen || isAnimating) && (
          <>
            {}
            <div
              className={clsx(
                "fixed inset-0 z-[75] lg:hidden transition-all duration-200",
                "bg-background/80 backdrop-blur-md",
                isOpen && !isAnimating ? "opacity-100" : "opacity-0"
              )}
              onClick={toggleDropdown}
            />
            <div
              className={clsx(
                "absolute right-0 mt-3 w-72 sm:w-80 z-[80]",
                "bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl",
                "max-h-[80vh] overflow-y-auto",
                isOpen && !isAnimating
                  ? "animate-elegant-fade-down opacity-100 scale-100"
                  : "opacity-0 scale-95 animate-fade-out",
                "lg:absolute lg:right-0",
                "max-lg:fixed max-lg:top-16 max-lg:left-3 max-lg:right-3 max-lg:w-auto"
              )}
              role="menu"
              aria-orientation="vertical"
              style={{
                transformOrigin: "top right",
                background: "var(--card)",
                backdropFilter: "blur(20px)",
                borderColor: "var(--border)",
              }}
            >
              {}
              <div className="relative p-4 border-b border-border/30">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-t-xl" />
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="relative">
                      <Avatar
                        src={user.avatar}
                        alt={user.name}
                        initials={getInitials(user.name)}
                        size={AvatarSize.LG}
                        className="shadow-lg ring-3 ring-primary/20 bg-gradient-to-br from-primary/10 to-accent/10"
                      />
                      {}
                      {user.subscription?.tier &&
                        user.subscription.tier !== SubscriptionTier.FREE && (
                          <div className="absolute -top-1 -right-1">
                            <div className="w-5 h-5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                              <FontAwesomeIcon
                                icon={faCrown}
                                className="w-2.5 h-2.5 text-white"
                              />
                            </div>
                          </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <button
                          onClick={() => {
                            router.push("/dashboard?tab=profile");
                            setIsOpen(false);
                          }}
                          className="group flex items-center space-x-2 hover:text-primary transition-colors duration-200"
                        >
                          <Typography
                            as={TypographyVariant.H4}
                            className="text-base font-bold text-foreground truncate group-hover:text-primary transition-colors duration-200"
                          >
                            {user.name}
                          </Typography>
                          {user.trustScore > 80 && (
                            <FontAwesomeIcon
                              icon={faShield}
                              className="w-3.5 h-3.5 text-blue-500"
                              title="Trusted User"
                            />
                          )}
                        </button>
                      </div>
                      <Typography
                        as={TypographyVariant.P}
                        className="text-xs text-text-muted truncate"
                      >
                        {user.email}
                      </Typography>
                      <div className="flex items-center mt-1 space-x-2">
                        <div className="flex items-center space-x-1">
                          <span className="text-xs">📍</span>
                          <Typography
                            as={TypographyVariant.SMALL}
                            className="text-xs text-text-muted"
                          >
                            {user.location}
                          </Typography>
                        </div>
                        {user.trustScore && (
                          <div className="flex items-center space-x-1">
                            <span className="text-xs">⭐</span>
                            <Typography
                              as={TypographyVariant.SMALL}
                              className="text-xs font-medium text-primary"
                            >
                              {user.trustScore}% Trust
                            </Typography>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {user.bio && (
                    <Typography
                      as={TypographyVariant.P}
                      className="text-xs text-text-secondary leading-relaxed bg-secondary/20 rounded-lg p-2 border border-border/30"
                    >
                      {user.bio}
                    </Typography>
                  )}
                </div>
              </div>
              {}
              <div className="p-3">
                <UserStats user={user} handleNavigation={handleNavigation} />
              </div>
              {}
              <div className="p-3 space-y-1">
                {navigationItems.map((item, index) => {
                  let badge = null;
                  if (
                    item.path === "/dashboard?tab=swap-requests" &&
                    pendingRequests > 0
                  ) {
                    badge = (
                      <Badge
                        variant={BadgeVariant.WARNING}
                        className="text-[10px] font-bold min-w-[18px] h-4 bg-gradient-to-r from-amber-500 to-orange-500"
                      >
                        {pendingRequests > 99 ? "99+" : pendingRequests}
                      </Badge>
                    );
                  } else if (
                    item.path.includes("notifications") &&
                    totalNotifications > 0
                  ) {
                    badge = (
                      <Badge
                        variant={BadgeVariant.DESTRUCTIVE}
                        className="text-[10px] font-bold min-w-[18px] h-4 bg-gradient-to-r from-red-500 to-red-600"
                      >
                        {totalNotifications > 99 ? "99+" : totalNotifications}
                      </Badge>
                    );
                  }
                  return (
                    <div
                      key={item.path}
                      className="animate-elegant-fade-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <NavigationItem
                        item={item}
                        badge={badge}
                        onClick={() => handleNavigation(item.path)}
                        isAuthenticated={isAuthenticated}
                      />
                    </div>
                  );
                })}
              </div>
              {}
              <div className="p-3 border-t border-border/30 bg-gradient-to-r from-destructive/5 to-red-500/5">
                <button
                  onClick={handleLogout}
                  disabled={isAnimating}
                  className={clsx(
                    "group relative w-full rounded-lg p-3 transition-all duration-200",
                    "border border-destructive/20 hover:border-destructive/40",
                    "bg-destructive/5 hover:bg-destructive/10",
                    "transform hover:scale-[1.01] active:scale-[0.99]",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  role="menuitem"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-6 h-6 rounded-lg bg-destructive/20 flex items-center justify-center group-hover:bg-destructive/30 transition-colors duration-200">
                      <FontAwesomeIcon
                        icon={faSignOutAlt}
                        className="w-3 h-3 text-destructive group-hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                    <Typography
                      as={TypographyVariant.P}
                      className="font-medium text-destructive"
                    >
                      {isAnimating ? "Signing out..." : "Sign Out"}
                    </Typography>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
);
ProfileDropdown.displayName = "ProfileDropdown";
export default ProfileDropdown;

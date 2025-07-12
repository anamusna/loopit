"use client";
import { useAuthModal } from "@/components/auth/AuthModalContext";
import { SubscriptionTier } from "@/shared/types";
import { useLoopItStore } from "@/store";
import Avatar, { AvatarSize } from "@/tailwind/components/elements/Avatar";
import Badge, { BadgeVariant } from "@/tailwind/components/elements/Badge";
import Button, { ButtonVariant } from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import {
  faBell,
  faCog,
  faCrown,
  faHeart,
  faList,
  faShield,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface ProfileDropdownProps {
  className?: string;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  className = "",
}) => {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    logout,
    unreadNotifications,
    unreadCount,
    receivedRequests,
  } = useLoopItStore();
  const { openLogin } = useAuthModal();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = useCallback(() => {
    if (isAnimating) return;
    setIsOpen((prev) => !prev);
  }, [isAnimating]);

  const closeDropdown = useCallback(() => {
    if (isAnimating) return;
    setIsOpen(false);
  }, [isAnimating]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyboard);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, [isOpen, closeDropdown]);

  const handleLogout = useCallback(async () => {
    setIsAnimating(true);
    try {
      await logout();
      setTimeout(() => {
        setIsOpen(false);
        setIsAnimating(false);
        openLogin();
      }, 150);
    } catch (error) {
      console.error("Logout failed:", error);
      setIsAnimating(false);
    }
  }, [logout, openLogin]);

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
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-card rounded-full animate-pulse" />
        </button>

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

      {(isOpen || isAnimating) && (
        <>
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

            <div className="p-2 space-y-1">
              <button
                onClick={() => {
                  router.push("/dashboard");
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left hover:bg-secondary/50 transition-colors duration-200 group"
              >
                <FontAwesomeIcon
                  icon={faUser}
                  className="w-4 h-4 text-primary group-hover:text-primary/80 transition-colors"
                />
                <span className="text-sm font-medium text-foreground">
                  Dashboard
                </span>
              </button>

              <button
                onClick={() => {
                  router.push("/dashboard?tab=my-listings");
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left hover:bg-secondary/50 transition-colors duration-200 group"
              >
                <FontAwesomeIcon
                  icon={faList}
                  className="w-4 h-4 text-primary group-hover:text-primary/80 transition-colors"
                />
                <span className="text-sm font-medium text-foreground">
                  My Listings
                </span>
              </button>

              <button
                onClick={() => {
                  router.push("/messages");
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left hover:bg-secondary/50 transition-colors duration-200 group"
              >
                <FontAwesomeIcon
                  icon={faBell}
                  className="w-4 h-4 text-primary group-hover:text-primary/80 transition-colors"
                />
                <span className="text-sm font-medium text-foreground">
                  Messages
                  {totalNotifications > 0 && (
                    <Badge
                      variant={BadgeVariant.DESTRUCTIVE}
                      className="ml-2 text-xs"
                    >
                      {totalNotifications}
                    </Badge>
                  )}
                </span>
              </button>

              <button
                onClick={() => {
                  router.push("/dashboard?tab=saved");
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left hover:bg-secondary/50 transition-colors duration-200 group"
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  className="w-4 h-4 text-primary group-hover:text-primary/80 transition-colors"
                />
                <span className="text-sm font-medium text-foreground">
                  Saved Items
                </span>
              </button>

              <button
                onClick={() => {
                  router.push("/settings");
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left hover:bg-secondary/50 transition-colors duration-200 group"
              >
                <FontAwesomeIcon
                  icon={faCog}
                  className="w-4 h-4 text-primary group-hover:text-primary/80 transition-colors"
                />
                <span className="text-sm font-medium text-foreground">
                  Settings
                </span>
              </button>
            </div>

            <div className="p-2 border-t border-border/30">
              <Button
                onClick={handleLogout}
                variant={ButtonVariant.DESTRUCTIVE}
                className="w-full justify-start"
                disabled={isAnimating}
              >
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  className={clsx(
                    "w-4 h-4 mr-2",
                    isAnimating && "animate-spin"
                  )}
                />
                {isAnimating ? "Signing Out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

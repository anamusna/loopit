"use client";
import { ICONS } from "@/lib/fontawesome";
import { useLoopItStore } from "@/store";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { memo, useCallback, useMemo } from "react";
const navigationItems = [
  {
    label: "Browse",
    path: "/",
    icon: "search" as const,
    requiresAuth: false,
  },
  {
    label: "My Requests",
    path: "/dashboard?tab=swap-requests",
    icon: "envelope" as const,
    requiresAuth: true,
  },
  {
    label: "Messages",
    path: "/dashboard?tab=messages",
    icon: "comment" as const,
    requiresAuth: true,
  },
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "user" as const,
    requiresAuth: true,
  },
];
const BottomNavItem: React.FC<{
  item: (typeof navigationItems)[0];
  isActive: boolean;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}> = memo(({ item, isActive, onClick, className = "", style }) => (
  <button
    onClick={onClick}
    className={clsx(
      "group relative flex flex-col items-center justify-center min-h-[44px] sm:min-h-[48px] px-2 sm:px-3 transition-all duration-200 ease-out",
      "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 focus:ring-offset-background rounded-xl",
      "transform hover:scale-105 active:scale-95",
      isActive
        ? "text-primary bg-primary/10 shadow-sm"
        : "text-text-muted hover:text-text-primary hover:bg-muted/50",
      className
    )}
    style={style}
    aria-label={`Navigate to ${item.label}`}
    title={item.label}
  >
    {}
    {isActive && (
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
    )}
    {}
    <div className="relative mb-1">
      <FontAwesomeIcon
        icon={
          (ICONS[item.icon.toUpperCase() as keyof typeof ICONS] ??
            ICONS.SEARCH) as IconProp
        }
        className={clsx(
          "w-5 h-5 sm:w-5 sm:h-5 transition-all duration-200 ease-out",
          isActive ? "transform scale-110" : "group-hover:scale-105"
        )}
      />
    </div>
    {}
    <span
      className={clsx(
        "text-[10px] sm:text-xs font-medium transition-all duration-200 ease-out",
        isActive
          ? "text-primary font-semibold"
          : "group-hover:text-text-primary"
      )}
    >
      {item.label}
    </span>
  </button>
));
BottomNavItem.displayName = "BottomNavItem";
const BottomNavigation = memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useLoopItStore();
  const visibleNavItems = useMemo(
    () =>
      navigationItems.filter((item) => !item.requiresAuth || isAuthenticated),
    [isAuthenticated]
  );
  const handleNavigate = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {}
      <div className="absolute inset-0 bg-background border-t border-border/50 shadow-xl" />
      {}
      <div className="absolute inset-0 bg-background/98 backdrop-blur-xl" />
      {}
      <div className="relative container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-around py-2 sm:py-3">
          {visibleNavItems.map((item, index) => {
            const isActive =
              pathname === item.path ||
              (item.path !== "/" && pathname.startsWith(item.path));
            return (
              <BottomNavItem
                key={item.path}
                item={item}
                isActive={isActive}
                onClick={() => handleNavigate(item.path)}
                style={{ animationDelay: `${index * 50}ms` }}
              />
            );
          })}
        </div>
      </div>
      {}
      <div className="h-safe-bottom bg-background" />
    </nav>
  );
});
BottomNavigation.displayName = "BottomNavigation";
export default BottomNavigation;

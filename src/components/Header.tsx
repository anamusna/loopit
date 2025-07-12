"use client";
import { useAuthModal } from "@/components/auth/AuthModalContext";
import { useTheme } from "@/hooks/useTheme";
import { ICONS } from "@/lib/fontawesome";
import { ItemCategory } from "@/shared/types";
import { useLoopItStore } from "@/store";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faBook,
  faChevronDown,
  faCouch,
  faDesktop,
  faDumbbell,
  faGamepad,
  faHome,
  faMapMarkerAlt,
  faShirt,
  faStar,
  faTh,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { memo, useCallback } from "react";
import { GAMBIA_LOCATIONS } from "./profile/LocationInput";
import { ProfileDropdown } from "./profile/ProfileDropdown";

interface HeaderProps {
  className?: string;
}

const Header = memo<HeaderProps>(({ className = "" }) => {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
  const { isAuthenticated, user, items } = useLoopItStore();
  const { openLogin, openRegister } = useAuthModal();

  const [showLocation, setShowLocation] = React.useState(false);
  const [showItems, setShowItems] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState("Categories");
  const [selectedLocation, setSelectedLocation] = React.useState("Gambia");
  const [showAuthDropdown, setShowAuthDropdown] = React.useState(false);

  const handleThemeToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const handleLogin = useCallback(() => {
    setShowAuthDropdown(false);
    openLogin();
  }, [openLogin]);

  const handleRegister = useCallback(() => {
    setShowAuthDropdown(false);
    openRegister();
  }, [openRegister]);

  const handleLogoClick = useCallback(() => {
    router.push("/");
  }, [router]);

  const themeIcon = isDarkMode ? ICONS.SUN : ICONS.MOON;

  const worldRef = React.useRef<HTMLDivElement>(null);
  const goodsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        worldRef.current &&
        !worldRef.current.contains(event.target as Node)
      ) {
        setShowLocation(false);
      }
      if (
        goodsRef.current &&
        !goodsRef.current.contains(event.target as Node)
      ) {
        setShowItems(false);
      }
    }
    if (showLocation || showItems) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showLocation, showItems]);

  const authDropdownRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        authDropdownRef.current &&
        !authDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAuthDropdown(false);
      }
    }
    if (showAuthDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showAuthDropdown]);

  const itemCategories = React.useMemo(() => {
    if (items && items.length > 0) {
      const uniqueCats = Array.from(
        new Set(items.map((item) => item.category))
      );

      const categoryMapping: Record<
        ItemCategory,
        { icon: IconProp; label: string }
      > = {
        [ItemCategory.ELECTRONICS]: { icon: faDesktop, label: "Electronics" },
        [ItemCategory.HOUSEHOLD]: { icon: faHome, label: "Household" },
        [ItemCategory.FURNITURE]: { icon: faCouch, label: "Furniture" },
        [ItemCategory.CLOTHING]: { icon: faShirt, label: "Clothing" },
        [ItemCategory.BOOKS]: { icon: faBook, label: "Books" },
        [ItemCategory.TOYS]: { icon: faGamepad, label: "Toys" },
        [ItemCategory.SPORTS]: { icon: faDumbbell, label: "Sports" },
        [ItemCategory.OTHER]: { icon: faStar, label: "Other" },
      };
      return uniqueCats.map((cat) => ({
        icon: categoryMapping[cat]?.icon || faStar,
        label: categoryMapping[cat]?.label || cat,
        value: cat,
      }));
    }

    return [
      {
        icon: faDesktop,
        label: "Electronics",
        value: ItemCategory.ELECTRONICS,
      },
      { icon: faHome, label: "Household", value: ItemCategory.HOUSEHOLD },
      { icon: faCouch, label: "Furniture", value: ItemCategory.FURNITURE },
      { icon: faShirt, label: "Clothing", value: ItemCategory.CLOTHING },
      { icon: faBook, label: "Books", value: ItemCategory.BOOKS },
      { icon: faGamepad, label: "Toys", value: ItemCategory.TOYS },
      { icon: faDumbbell, label: "Sports", value: ItemCategory.SPORTS },
      { icon: faStar, label: "Other", value: ItemCategory.OTHER },
    ];
  }, [items]);

  return (
    <>
      <div className="w-full bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-b border-border/20 text-xs sm:text-sm flex items-center justify-between px-3 sm:px-4 lg:px-6 py-2 relative z-[70] backdrop-blur-sm">
        <div className="relative flex-shrink-0" ref={worldRef}>
          <button
            className="flex items-center gap-1.5 font-medium px-2.5 py-1.5 rounded-lg hover:bg-primary/10 transition-all duration-200 text-text-primary hover:text-primary group"
            onClick={() => setShowLocation((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={showLocation}
          >
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform duration-200"
            />
            <span className="hidden xs:inline font-semibold">
              {selectedLocation}
            </span>
            <span className="xs:hidden font-semibold">GM</span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`w-3 h-3 text-text-muted transition-transform duration-200 ${
                showLocation ? "rotate-180" : ""
              }`}
            />
          </button>
          {showLocation && (
            <div className="absolute left-0 mt-1 bg-card backdrop-blur-md border border-border/50 rounded-xl shadow-xl min-w-[140px] max-h-64 overflow-y-auto z-50">
              {GAMBIA_LOCATIONS.map((loc, idx) => (
                <button
                  key={loc + "-" + idx}
                  className="block w-full text-left px-3 py-2.5 hover:bg-primary/10 transition-colors duration-200 text-sm font-medium truncate"
                  onClick={() => {
                    setSelectedLocation(loc);
                    setShowLocation(false);
                    router.push(`/items/?location=${encodeURIComponent(loc)}`);
                  }}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 text-center px-2 truncate hidden sm:block">
          <span className="text-xs font-medium text-text-muted">
            <span className="text-primary font-semibold">Declutter</span>
            {" • "}
            <span className="text-accent font-semibold">Save Money</span>
            {" • "}
            <span className="text-success font-semibold">Reduce Waste</span>
          </span>
        </div>

        <div className="relative flex-shrink-0" ref={goodsRef}>
          <button
            className="flex items-center gap-1.5 font-medium px-2.5 py-1.5 rounded-lg hover:bg-accent/10 transition-all duration-200 text-text-primary hover:text-accent group"
            onClick={() => setShowItems((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={showItems}
          >
            <FontAwesomeIcon
              icon={faTh}
              className="w-3.5 h-3.5 text-accent group-hover:scale-110 transition-transform duration-200"
            />
            <span className="hidden xs:inline font-semibold">
              {selectedItems}
            </span>
            <span className="xs:hidden font-semibold">Cat</span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`w-3 h-3 text-text-muted transition-transform duration-200 ${
                showItems ? "rotate-180" : ""
              }`}
            />
          </button>
          {showItems && (
            <div className="absolute right-0 mt-1 bg-card backdrop-blur-xl border border-border/50 rounded-xl shadow-xl min-w-[160px] z-50 py-1">
              {itemCategories.map((cat) => (
                <button
                  key={cat.label}
                  className="flex items-center gap-3 w-full text-left px-3 py-2.5 hover:bg-accent/10 transition-colors duration-200 text-sm font-medium group"
                  onClick={() => {
                    setSelectedItems(cat.label);
                    setShowItems(false);
                    router.push(
                      `/items/?category=${encodeURIComponent(cat.value)}`
                    );
                  }}
                >
                  <FontAwesomeIcon
                    icon={cat.icon}
                    className="w-3.5 h-3.5 text-accent group-hover:scale-110 transition-transform duration-200"
                  />
                  <span className="flex-1">{cat.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <header
        className={`w-full sticky top-0 z-[60] border-b border-border/20 backdrop-blur-md bg-card/95 shadow-sm ${className}`}
      >
        <div className="mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <button
                onClick={handleLogoClick}
                className="group flex items-center gap-2 hover:opacity-90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg p-1"
                aria-label="Go to home"
              >
                <div className="relative w-7 h-7 sm:w-8 sm:h-8">
                  <Image
                    src="/shared/images/192x192.png"
                    alt="LoopIt Logo"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110"
                    priority
                  />
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">
                  LoopIt
                </h1>
              </button>
            </div>

            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <a
                href="/items"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Browse
              </a>
              <a
                href="/how-it-works"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                How It Works
              </a>
              <a
                href="/community"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Community
              </a>
              <a
                href="/impact"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Impact
              </a>
              <a
                href="/help"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Help
              </a>
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 relative">
              <Button
                onClick={handleThemeToggle}
                variant={ButtonVariant.GHOST}
                size={ButtonSize.SM}
                className="sm:flex min-h-[36px] min-w-[36px] p-0 rounded-lg hover:bg-primary/10 transition-all duration-300"
                aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
              >
                <FontAwesomeIcon
                  icon={themeIcon as IconProp}
                  className="w-4 h-4 text-primary"
                />
              </Button>

              {isAuthenticated && user ? (
                <ProfileDropdown />
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2 relative">
                  <Button
                    onClick={() => setShowAuthDropdown((v) => !v)}
                    variant={ButtonVariant.GHOST}
                    size={ButtonSize.SM}
                    icon={faUser}
                    isIconOnly
                    className="min-h-[36px] px-3 text-sm font-medium text-foreground hover:bg-primary/10 transition-all duration-300 rounded-lg"
                  >
                    <span className="hidden sm:inline">Log in</span>
                    <span className="sm:hidden">Login</span>
                  </Button>

                  {showAuthDropdown && (
                    <div
                      ref={authDropdownRef}
                      className="absolute right-0 top-12 sm:top-14 min-w-[260px] max-w-xs bg-card border border-border/40 rounded-2xl shadow-2xl p-5 z-50 animate-fade-in-up backdrop-blur-xl flex flex-col gap-3"
                    >
                      <div className="font-bold text-lg text-foreground mb-1">
                        Welcome to LoopIt
                      </div>
                      <div className="text-sm text-text-secondary mb-2">
                        Join your local swap community.
                        <br />
                        <span className="text-primary font-semibold">
                          Declutter
                        </span>
                        ,{" "}
                        <span className="text-accent font-semibold">
                          save money
                        </span>
                        , and{" "}
                        <span className="text-success font-semibold">
                          help the planet
                        </span>
                        .
                      </div>
                      <ul className="text-xs text-text-muted mb-3 space-y-1 pl-4 list-disc">
                        <li>Trusted profiles & reviews</li>
                        <li>Eco impact badges</li>
                        <li>Free to join</li>
                      </ul>
                      <div className="flex gap-2 mt-2">
                        <Button
                          onClick={handleLogin}
                          variant={ButtonVariant.PRIMARY}
                          size={ButtonSize.MD}
                          className="flex-1 font-semibold rounded-lg text-base min-h-[40px]"
                        >
                          Sign In
                        </Button>
                        <Button
                          onClick={handleRegister}
                          variant={ButtonVariant.GHOST}
                          size={ButtonSize.MD}
                          className="flex-1 font-semibold rounded-lg text-base min-h-[40px] border border-primary"
                        >
                          Sign Up
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
});

Header.displayName = "Header";
export default Header;

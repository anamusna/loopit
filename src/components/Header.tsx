"use client";
import { useTheme } from "@/hooks/useTheme";
import { ICONS } from "@/lib/fontawesome";
import { useLoopItStore } from "@/store";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { memo, useCallback } from "react";
import ProfileDropdown from "./profile/ProfileDropdown";
interface HeaderProps {
  className?: string;
}
const Header = memo<HeaderProps>(({ className = "" }) => {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useLoopItStore();
  const handleThemeToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);
  const handleLogin = useCallback(() => {
    router.push("/login");
  }, [router]);
  const handleRegister = useCallback(() => {
    router.push("/register");
  }, [router]);
  const handleLogoClick = useCallback(() => {
    router.push("/");
  }, [router]);
  const themeIcon = isDarkMode ? ICONS.SUN : ICONS.MOON;
  return (
    <header
      className={`sticky top-0 z-[60] w-full border-b border-border/40 backdrop-blur-md bg-card/90 shadow-sm ${className}`}
    >
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
          <div className="flex items-center">
            <button
              onClick={handleLogoClick}
              className="group flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-xl p-1.5 sm:p-2"
              aria-label="Go to home"
            >
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <Image
                  src="/shared/images/192x192.png"
                  alt="LoopIt Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col items-start">
                <h1 className="text-lg sm:text-xl lg:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  LoopIt
                </h1>
                <span className="hidden sm:block text-xs text-text-muted font-medium">
                  Community Swapping
                </span>
              </div>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Button
              onClick={handleThemeToggle}
              variant={ButtonVariant.GHOST}
              size={ButtonSize.SM}
              className="group relative overflow-hidden min-h-[40px] px-3 rounded-xl hover:bg-primary/10 transition-all duration-300"
              aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            >
              <FontAwesomeIcon
                icon={themeIcon as IconProp}
                className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </Button>
            {isAuthenticated && user ? (
              <ProfileDropdown />
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleLogin}
                  variant={ButtonVariant.GHOST}
                  size={ButtonSize.SM}
                  className="min-h-[40px] px-4 font-medium rounded-xl hover:bg-primary/10 transition-all duration-300"
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleRegister}
                  variant={ButtonVariant.PRIMARY}
                  size={ButtonSize.SM}
                  className="group relative overflow-hidden min-h-[40px] px-4 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="relative z-10">Join LoopIt</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                </Button>
              </div>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <Button
              onClick={handleThemeToggle}
              variant={ButtonVariant.GHOST}
              size={ButtonSize.SM}
              className="min-h-[40px] min-w-[40px] p-0 rounded-xl hover:bg-primary/10 transition-all duration-300"
              aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            >
              <FontAwesomeIcon
                icon={themeIcon as IconProp}
                className="w-4 h-4"
              />
            </Button>
            {isAuthenticated && user ? (
              <ProfileDropdown />
            ) : (
              <div className="flex items-center gap-1.5">
                <Button
                  onClick={handleLogin}
                  variant={ButtonVariant.GHOST}
                  size={ButtonSize.SM}
                  className="min-h-[40px] px-3 text-sm font-medium rounded-xl hover:bg-primary/10 transition-all duration-300"
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleRegister}
                  variant={ButtonVariant.PRIMARY}
                  size={ButtonSize.SM}
                  className="min-h-[40px] px-3 text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Join
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});
Header.displayName = "Header";
export default Header;

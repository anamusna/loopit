"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Tutorial from "@/components/onboarding/Tutorial";
import { usePermissions } from "@/hooks/usePermissions";
import { useTutorial } from "@/hooks/useTutorial";
import { useLoopItStore } from "@/store";
import LoadingSpinner, {
  LoadingSpinnerSize,
} from "@/tailwind/components/elements/LoadingSpinner";
import { faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  includeHeader?: boolean;
  includeFooter?: boolean;
  requireProfileSetup?: boolean;
  requireTutorial?: boolean;
  requireAdmin?: boolean;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = React.memo(
  ({
    children,
    redirectTo = "/login",
    requireAuth = true,
    includeHeader = true,
    includeFooter = true,
    requireProfileSetup = false,
    requireTutorial = true,
    requireAdmin = false,
  }) => {
    const router = useRouter();
    const {
      isAuthenticated,
      isLoading,
      user,
      isProfileSetupCompleted,
      isTutorialCompleted,
      checkProfileSetupStatus,
      checkTutorialStatus,
    } = useLoopItStore();
    const { isAdmin, permissions } = usePermissions();
    const { isTutorialActive } = useTutorial();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [authChecks, setAuthChecks] = useState({
      profileSetup: false,
      tutorialCompleted: false,
    });
    useEffect(() => {
      if (isLoading) return;
      const storeIntendedDestination = () => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "intendedDestination",
            window.location.pathname
          );
        }
      };
      if (requireAuth && !isAuthenticated) {
        storeIntendedDestination();
        setIsRedirecting(true);
        setTimeout(() => {
          router.push(window.location.pathname);
        }, 800);
        return;
      }
      if (requireAdmin && !isAdmin()) {
        if (!isAuthenticated) {
          storeIntendedDestination();
          setIsRedirecting(true);
          setTimeout(() => {
            router.push(redirectTo);
          }, 800);
        } else {
          setIsRedirecting(true);
          setTimeout(() => {
            router.push("/dashboard");
          }, 800);
        }
        return;
      }
      if (!requireAuth && isAuthenticated) {
        setIsRedirecting(true);
        setTimeout(() => {
          const destination =
            typeof window !== "undefined"
              ? sessionStorage.getItem("intendedDestination")
              : null;
          if (destination) {
            if (destination.startsWith("/admin") && !isAdmin()) {
              router.push("/dashboard");
            } else {
              sessionStorage.removeItem("intendedDestination");
              router.push(destination);
            }
          } else {
            router.push("/dashboard");
          }
        }, 800);
        return;
      }
      if (isAuthenticated && user) {
        const destination =
          typeof window !== "undefined"
            ? sessionStorage.getItem("intendedDestination")
            : null;
        if (destination) {
          console.log("requireAdmin", requireAdmin);
          console.log("isAuthenticated", isAuthenticated);
          console.log("isAdmin", isAdmin());
          console.log("requireAuth", requireAuth);
          if (destination.startsWith("/admin") && isAdmin()) {
            sessionStorage.removeItem("intendedDestination");
            router.push(destination);
            return;
          }
        }
        const profileSetup = true;
        const tutorialCompleted = requireTutorial
          ? checkTutorialStatus()
          : true;
        setAuthChecks({
          profileSetup,
          tutorialCompleted,
        });
      }
    }, [
      isAuthenticated,
      isLoading,
      requireAuth,
      requireAdmin,
      isAdmin,
      router,
      redirectTo,
      user,
      requireProfileSetup,
      requireTutorial,
      checkProfileSetupStatus,
      checkTutorialStatus,
    ]);
    if (isLoading || isRedirecting) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-20 h-20 sm:w-32 sm:h-32 bg-primary rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-16 h-16 sm:w-24 sm:h-24 bg-accent rounded-full blur-xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-success rounded-full blur-lg animate-pulse delay-500" />
          </div>
          <div className="relative z-10 text-center space-y-6 sm:space-y-8 px-6 sm:px-8 max-w-md mx-auto">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-2xl">
                {isRedirecting ? (
                  <FontAwesomeIcon
                    icon={faShieldAlt}
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white animate-pulse"
                  />
                ) : (
                  <LoadingSpinner
                    size={LoadingSpinnerSize.LG}
                    className="text-white"
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" />
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary animate-fade-in">
                {isRedirecting ? "Redirecting..." : "Loading..."}
              </h2>
              <div className="space-y-2">
                <p className="text-sm sm:text-base text-text-muted animate-fade-in-delay">
                  {isRedirecting
                    ? requireAuth && !isAuthenticated
                      ? "Please log in to continue"
                      : requireAdmin && !isAdmin()
                      ? "You need admin access to view this page"
                      : "Taking you to your dashboard"
                    : "Please wait while we verify your session"}
                </p>

                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <FontAwesomeIcon
                  icon={faShieldAlt}
                  className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0"
                />
                <div className="text-left">
                  <h3 className="font-semibold text-text-primary text-sm sm:text-base">
                    Secure Connection
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted mt-1">
                    Your connection is encrypted and secure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (requireAuth && !isAuthenticated) {
      return null;
    }
    if (requireAdmin && !isAdmin()) {
      return null;
    }
    if (!requireAuth && isAuthenticated) {
      return null;
    }
    if (
      isAuthenticated &&
      requireTutorial &&
      !authChecks.tutorialCompleted &&
      isTutorialActive()
    ) {
      return <Tutorial />;
    }
    return (
      <>
        {includeHeader && <Header />}
        {children}
        {includeFooter && <Footer />}
      </>
    );
  }
);
ProtectedRoute.displayName = "ProtectedRoute";
export default ProtectedRoute;

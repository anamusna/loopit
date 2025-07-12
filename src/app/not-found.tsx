"use client";
import { useAuthModal } from "@/components/auth/AuthModalContext";
import { useLoopItStore } from "@/store";
import Button, { ButtonVariant } from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Container from "@/tailwind/components/layout/Container";
import { faArrowLeft, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const { isAuthenticated } = useLoopItStore();
  const { openLogin, openRegister } = useAuthModal();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const navLabel = [
    {
      label: "Browse Items",
      link: "/items",
    },
    {
      label: isAuthenticated ? "Dashboard" : "Login",
      action: isAuthenticated ? () => router.push("/dashboard") : openLogin,
    },
    {
      label: isAuthenticated ? "My Listings" : "Register",
      action: isAuthenticated
        ? () => router.push("/dashboard?tab=my-listings")
        : openRegister,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Container className="min-h-screen flex items-center justify-center py-8">
        <div className="text-center space-y-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            <Typography
              as={TypographyVariant.H1}
              className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse"
            >
              404
            </Typography>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
          </div>
          <div className="space-y-4">
            <Typography
              as={TypographyVariant.H2}
              className="text-2xl md:text-3xl font-bold text-text-primary"
            >
              Oops! Page Not Found
            </Typography>
            <Typography
              as={TypographyVariant.P}
              className="text-lg text-text-muted max-w-md mx-auto leading-relaxed"
            >
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved. Don&apos;t worry, there are plenty of great items to
              discover on LoopIt!
            </Typography>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              variant={ButtonVariant.PRIMARY}
              onClick={handleGoHome}
              className="w-full sm:w-auto px-8 py-3 text-lg"
            >
              <FontAwesomeIcon icon={faHome} className="w-4 h-4 mr-2" />
              Go Home
            </Button>
            <Button
              variant={ButtonVariant.SECONDARY}
              onClick={handleGoBack}
              className="w-full sm:w-auto px-8 py-3 text-lg"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
          <div className="pt-8 border-t border-border/30">
            <Typography
              as={TypographyVariant.H3}
              className="text-lg font-semibold text-text-primary mb-4"
            >
              Popular Pages
            </Typography>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {navLabel.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="p-3 rounded-lg bg-card hover:bg-card/80 border border-border/30 transition-all duration-200 hover:shadow-md group text-left"
                >
                  <Typography
                    as={TypographyVariant.SMALL}
                    className="font-medium text-text-primary group-hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Typography>
                </button>
              ))}
            </div>
          </div>
          <div className="pt-6">
            <Typography
              as={TypographyVariant.P}
              className="text-sm text-text-muted"
            >
              Looking for something specific? Try searching for items on our{" "}
              <Link
                href="/"
                className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
              >
                homepage
              </Link>
              .
            </Typography>
          </div>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-secondary/10 rounded-full blur-lg"></div>
            <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-primary/5 rounded-full blur-lg"></div>
          </div>
        </div>
      </Container>
    </div>
  );
}

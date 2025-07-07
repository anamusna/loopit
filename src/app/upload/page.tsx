"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Container from "@/tailwind/components/layout/Container";
import { faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
const UploadPage: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard?tab=my-listings");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);
  const handleGoToDashboard = () => {
    router.push("/dashboard?tab=my-listings");
  };
  const handleGoBack = () => {
    router.back();
  };
  return (
    <ProtectedRoute requireAuth={true}>
      <Container className="py-6 sm:py-8 lg:py-12 min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={faPlus}
              className="w-10 h-10 sm:w-14 sm:h-14 text-primary"
            />
          </div>
          <Typography
            as={TypographyVariant.H1}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            Item Upload Moved!
          </Typography>
          <Typography
            as={TypographyVariant.P}
            className="text-text-muted text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 leading-relaxed max-w-lg mx-auto"
          >
            We&apos;ve improved the experience! You can now add and edit items
            directly from your dashboard with our new modal system.
          </Typography>
          <div className="bg-card/50 rounded-xl p-6 mb-8 border border-border/50">
            <Typography
              as={TypographyVariant.H3}
              className="text-lg font-semibold mb-4 text-foreground"
            >
              ✨ What&apos;s Better:
            </Typography>
            <ul className="text-left space-y-2 text-text-secondary">
              <li>• Add items without leaving your dashboard</li>
              <li>• Edit existing items with a single click</li>
              <li>• Better mobile experience</li>
              <li>• Faster workflow for managing multiple items</li>
            </ul>
          </div>
          <div className="bg-info/10 rounded-lg p-4 mb-8 border border-info/20">
            <Typography
              as={TypographyVariant.P}
              className="text-info text-sm sm:text-base"
            >
              🚀 Redirecting to dashboard in 3 seconds...
            </Typography>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant={ButtonVariant.OUTLINE}
              size={ButtonSize.LG}
              onClick={handleGoBack}
              className="min-h-[48px] px-6 sm:px-8 font-semibold"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-3" />
              Go Back
            </Button>
            <Button
              variant={ButtonVariant.PRIMARY}
              size={ButtonSize.LG}
              onClick={handleGoToDashboard}
              className="min-h-[48px] px-6 sm:px-8 font-bold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-3" />
              Go to Dashboard
            </Button>
          </div>
        </div>
      </Container>
    </ProtectedRoute>
  );
};
export default UploadPage;

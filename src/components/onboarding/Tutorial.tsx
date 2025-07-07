"use client";
import { useTutorial } from "@/hooks/useTutorial";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  highlight?: string;
}
const tutorialSteps: TutorialStep[] = [
  {
    id: 0,
    title: "Welcome to LoopIt!",
    description:
      "Let's take a quick tour to help you get started with sustainable swapping.",
    icon: "🌱",
  },
  {
    id: 1,
    title: "Discover Items",
    description:
      "Browse items from your community. Find what you need without buying new.",
    icon: "🔍",
    highlight: "search",
  },
  {
    id: 2,
    title: "List Your Items",
    description:
      "Share items you no longer need. Give them a second life in your community.",
    icon: "📦",
    highlight: "upload",
  },
  {
    id: 3,
    title: "Make Swaps",
    description:
      "Propose trades with other users. Exchange items instead of buying new.",
    icon: "🤝",
    highlight: "swap",
  },
  {
    id: 4,
    title: "Build Community",
    description:
      "Connect with like-minded people who care about sustainability.",
    icon: "👥",
    highlight: "community",
  },
  {
    id: 5,
    title: "Track Your Impact",
    description:
      "See how much carbon you've saved and items you've diverted from landfills.",
    icon: "📊",
    highlight: "impact",
  },
];
const Tutorial: React.FC = () => {
  const router = useRouter();
  const {
    tutorialState,
    startTutorial,
    completeStep,
    skipTutorial,
    completeTutorial,
    isTutorialActive,
  } = useTutorial();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (!isTutorialActive()) {
      startTutorial();
    }
    setCurrentStep(tutorialState.currentStep);
    setIsVisible(true);
  }, [tutorialState.currentStep, isTutorialActive, startTutorial]);
  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      completeStep(currentStep);
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
      router.push("/dashboard");
    }
  };
  const handleSkip = () => {
    skipTutorial();
    router.push("/dashboard");
  };
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  if (!isVisible) {
    return null;
  }
  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-6 sm:space-y-8">
        {}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-text-muted">
            <span>
              Step {currentStep + 1} of {tutorialSteps.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        {}
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-3xl">{step.icon}</span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {step.title}
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              {step.description}
            </p>
          </div>
          {}
          {step.highlight && (
            <div className="p-3 rounded-lg bg-info-subtle border border-info/20">
              <p className="text-xs sm:text-sm text-info">
                💡 This feature will be highlighted in the app
              </p>
            </div>
          )}
        </div>
        {}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button
                onClick={handleBack}
                variant={ButtonVariant.SECONDARY}
                size={ButtonSize.MD}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              variant={ButtonVariant.PRIMARY}
              size={ButtonSize.MD}
              className="flex-1"
            >
              {isLastStep ? "Get Started" : "Next"}
            </Button>
          </div>
          <Button
            onClick={handleSkip}
            variant={ButtonVariant.SECONDARY}
            size={ButtonSize.SM}
            className="w-full"
          >
            Skip Tutorial
          </Button>
        </div>
        {}
        <div className="flex justify-center space-x-2">
          {tutorialSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep
                  ? "bg-primary"
                  : index < currentStep
                  ? "bg-primary/50"
                  : "bg-border"
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Tutorial;

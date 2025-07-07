import { TutorialState } from "@/shared/types";
import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
export const useTutorial = () => {
  const [tutorialState, setTutorialState] = useLocalStorage<TutorialState>(
    "TUTORIAL_SEEN",
    {
      seen: false,
      currentStep: 0,
      completedSteps: [],
      skipped: false,
    }
  );
  const startTutorial = useCallback(() => {
    setTutorialState({
      seen: true,
      currentStep: 0,
      completedSteps: [],
      skipped: false,
    });
  }, [setTutorialState]);
  const completeStep = useCallback(
    (stepIndex: number) => {
      setTutorialState((prev) => ({
        ...prev,
        currentStep: stepIndex + 1,
        completedSteps: [...prev.completedSteps, stepIndex],
      }));
    },
    [setTutorialState]
  );
  const goToStep = useCallback(
    (stepIndex: number) => {
      setTutorialState((prev) => ({
        ...prev,
        currentStep: stepIndex,
      }));
    },
    [setTutorialState]
  );
  const skipTutorial = useCallback(() => {
    setTutorialState((prev) => ({
      ...prev,
      skipped: true,
      seen: true,
    }));
  }, [setTutorialState]);
  const completeTutorial = useCallback(() => {
    setTutorialState((prev) => ({
      ...prev,
      seen: true,
      currentStep: -1, 
    }));
  }, [setTutorialState]);
  const resetTutorial = useCallback(() => {
    setTutorialState({
      seen: false,
      currentStep: 0,
      completedSteps: [],
      skipped: false,
    });
  }, [setTutorialState]);
  const isStepCompleted = useCallback(
    (stepIndex: number): boolean => {
      return tutorialState.completedSteps.includes(stepIndex);
    },
    [tutorialState.completedSteps]
  );
  const isTutorialCompleted = useCallback((): boolean => {
    return tutorialState.seen && tutorialState.currentStep === -1;
  }, [tutorialState]);
  const isTutorialActive = useCallback((): boolean => {
    return (
      tutorialState.seen &&
      !tutorialState.skipped &&
      tutorialState.currentStep >= 0
    );
  }, [tutorialState]);
  return {
    tutorialState,
    startTutorial,
    completeStep,
    goToStep,
    skipTutorial,
    completeTutorial,
    resetTutorial,
    isStepCompleted,
    isTutorialCompleted,
    isTutorialActive,
  };
};

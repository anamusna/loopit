"use client";
import { AuthMode } from "@/components/auth/AuthModal";
import { useCallback, useState } from "react";

interface UseAuthModalReturn {
  isOpen: boolean;
  currentMode: AuthMode;
  openLogin: () => void;
  openRegister: () => void;
  closeModal: () => void;
}

export const useAuthModal = (): UseAuthModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<AuthMode>(AuthMode.LOGIN);

  const openLogin = useCallback(() => {
    setCurrentMode(AuthMode.LOGIN);
    setIsOpen(true);
  }, []);

  const openRegister = useCallback(() => {
    setCurrentMode(AuthMode.REGISTER);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    currentMode,
    openLogin,
    openRegister,
    closeModal,
  };
};

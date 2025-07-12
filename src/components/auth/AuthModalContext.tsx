"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { AuthMode } from "./AuthModal";

const AuthModalContext = createContext<{
  isOpen: boolean;
  currentMode: AuthMode;
  openLogin: () => void;
  openRegister: () => void;
  closeModal: () => void;
}>({
  isOpen: false,
  currentMode: AuthMode.LOGIN,
  openLogin: () => {},
  openRegister: () => {},
  closeModal: () => {},
});

export const AuthModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState(AuthMode.LOGIN);

  const openLogin = useCallback(() => {
    setCurrentMode(AuthMode.LOGIN);
    setIsOpen(true);
  }, []);
  const openRegister = useCallback(() => {
    setCurrentMode(AuthMode.REGISTER);
    setIsOpen(true);
  }, []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <AuthModalContext.Provider
      value={{ isOpen, currentMode, openLogin, openRegister, closeModal }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);

  if (typeof window === "undefined") {
    return {
      isOpen: false,
      currentMode: AuthMode.LOGIN,
      openLogin: () => {},
      openRegister: () => {},
      closeModal: () => {},
    };
  }

  return context;
};

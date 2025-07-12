"use client";

import AuthModal from "@/components/auth/AuthModal";
import {
  AuthModalProvider,
  useAuthModal,
} from "@/components/auth/AuthModalContext";
import SessionProvider from "@/components/auth/SessionProvider";
import { ThemeMode } from "@/constants/themes";
import { ThemeProvider } from "@/hooks/useTheme";
import "@/lib/fontawesome";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

config.autoAddCss = false;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface RootLayoutProps {
  children: React.ReactNode;
}

function AuthModalRoot() {
  const { isOpen, currentMode, closeModal } = useAuthModal();
  return (
    <AuthModal isOpen={isOpen} onClose={closeModal} initialMode={currentMode} />
  );
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <ThemeProvider defaultTheme={ThemeMode.LIGHT} storageKey="loopit-theme">
          <SessionProvider>
            <AuthModalProvider>
              <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
                {children}
              </div>
              <AuthModalRoot />
            </AuthModalProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

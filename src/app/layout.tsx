import SessionProvider from "@/components/auth/SessionProvider";
import { ThemeMode } from "@/constants/themes";
import { ThemeProvider } from "@/hooks/useTheme";
import "@/lib/fontawesome";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { Metadata } from "next";
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
export const metadata: Metadata = {
  title: "LoopIt - Local Item Swapping Community",
  description:
    "A trusted, local-first item swapping platform that helps you declutter, save money, and reduce waste while connecting neighbors in meaningful ways.",
  keywords:
    "item swapping, local community, sustainability, declutter, reuse, The Gambia",
  authors: [{ name: "LoopIt Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1917" },
  ],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/shared/images/32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/shared/images/192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/shared/images/192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
};
interface RootLayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <ThemeProvider defaultTheme={ThemeMode.LIGHT} storageKey="loopit-theme">
          <SessionProvider>
            <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
              {children}
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

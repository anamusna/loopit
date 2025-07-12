import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "LoopIt - Local Item Swapping Community",
  description:
    "A trusted, local-first item swapping platform that helps you declutter, save money, and reduce waste while connecting neighbors in meaningful ways.",
  keywords:
    "item swapping, local community, sustainability, declutter, reuse, The Gambia",
  authors: [{ name: "LoopIt Team" }],
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1917" },
  ],
};

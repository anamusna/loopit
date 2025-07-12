"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ImpactPage from "@/components/ImpactPage";

import { useLoopItStore } from "@/store";
import { LoadingSpinner } from "@/tailwind/components/elements";
export default function Home() {
  const { isAuthenticated, isLoading } = useLoopItStore();
  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 mb-16 sm:mb-20">
        <ImpactPage />
      </main>
      <Footer />
    </div>
  );
}

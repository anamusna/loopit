"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ItemsPage from "@/components/ItemsPage";
import { useLoopItStore } from "@/store";
import { LoadingSpinner } from "@/tailwind/components/elements";
import { Suspense } from "react";

function ItemsPageWrapper() {
  const { isAuthenticated, isLoading } = useLoopItStore();
  if (isLoading) {
    return <LoadingSpinner />;
  }
  return <ItemsPage />;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 mb-16 sm:mb-20">
        <Suspense fallback={<LoadingSpinner />}>
          <ItemsPageWrapper />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Homepage from "@/components/Homepage";
export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 mb-16 sm:mb-20 ">
        <Homepage />
      </main>
      <Footer />
    </div>
  );
}

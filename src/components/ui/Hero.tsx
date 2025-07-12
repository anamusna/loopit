"use client";
import { useLoopItStore } from "@/store";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import "swiper/css";

const IMPACT_DATA = {
  items: 1248,
  co2: 3821, // in kg
};

export interface HomepageProps {
  className?: string;
}

const HeroSection: React.FC<{
  onStartSwapping: () => void;
  onBrowseNearby: () => void;
}> = ({ onStartSwapping, onBrowseNearby }) => {
  const [itemsCount, setItemsCount] = useState(0);
  const [co2Count, setCo2Count] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) {
      setHasAnimated(true);
      const duration = 2000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setItemsCount(Math.floor(progress * IMPACT_DATA.items));
        setCo2Count(Math.floor(progress * IMPACT_DATA.co2));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setItemsCount(IMPACT_DATA.items);
          setCo2Count(IMPACT_DATA.co2);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [hasAnimated]);

  const heroStats = [
    { icon: "🌱", label: "CO₂ Saved", value: `${co2Count.toLocaleString()}kg` },
    { icon: "📦", label: "Items", value: itemsCount.toLocaleString() },
    { icon: "🗂️", label: "Categories", value: "8" },
    { icon: "👥", label: "Members", value: "14" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-morphing-gradient" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-accent/20 to-primary/20 rounded-full blur-3xl animate-morphing-gradient"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-success/10 to-info/10 rounded-full blur-2xl animate-aurora-flow" />
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary/30 rounded-full animate-particle-drift" />
        <div
          className="absolute top-40 right-32 w-1 h-1 bg-accent/40 rounded-full animate-particle-drift"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-success/30 rounded-full animate-particle-drift"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute bottom-20 right-1/4 w-1 h-1 bg-info/40 rounded-full animate-particle-drift"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 w-full mx-auto text-center space-y-8">
        <div className="space-y-6 animate-elegant-reveal">
          <h1 className="text-4xl md:text-6xl font-extrabold text-balance leading-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent animate-gradient-x">
              Discover
            </span>

            <span className="text-text-primary">• Trade •</span>

            <span
              className="bg-gradient-to-r from-success via-accent to-primary bg-clip-text text-transparent animate-gradient-x"
              style={{ animationDelay: "1s" }}
            >
              Save the Planet
            </span>
          </h1>

          <p
            className="text-lg sm:text-xl lg:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed animate-elegant-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            Find treasures from your local community and help save the planet
            with every swap.
          </p>
        </div>

        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto animate-elegant-fade-up"
          style={{ animationDelay: "0.6s" }}
        >
          {heroStats.map((stat, i) => (
            <div
              key={i}
              className="group relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:border-primary/30 animate-elegant-fade-up"
              style={{ animationDelay: `${0.9 + i * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 text-center space-y-2">
                <div
                  className="text-2xl sm:text-3xl mb-2 animate-float"
                  style={{ animationDelay: `${i * 0.5}s` }}
                >
                  {stat.icon}
                </div>
                <div className="font-bold text-lg sm:text-xl text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-text-muted font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-elegant-fade-up"
          style={{ animationDelay: "1.2s" }}
        >
          <button
            className="group relative px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-primary/30 text-lg sm:text-xl animate-elastic-scale"
            onClick={onStartSwapping}
            aria-label="Start Swapping"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" />
            <span className="relative z-10">Start Swapping</span>
          </button>

          <button
            className="group relative px-8 py-4 bg-card border-2 border-accent  font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-accent/30 text-lg sm:text-xl hover:bg-accent/10 animate-elastic-scale"
            style={{ animationDelay: "0.1s" }}
            onClick={onBrowseNearby}
            aria-label="Browse Nearby"
          >
            <span className="relative z-10">Browse Nearby</span>
          </button>
        </div>
      </div>
    </section>
  );
};

const Homepage: React.FC<HomepageProps> = ({ className = "" }) => {
  const router = useRouter();
  const { isAuthenticated } = useLoopItStore();

  const handleStartSwapping = useCallback(() => {
    if (isAuthenticated) {
      router.push("/items");
    } else {
      router.push("/register");
    }
  }, [isAuthenticated, router]);

  const handleBrowseNearby = useCallback(() => {
    setTimeout(() => {
      const itemsSection = document.getElementById("items-section");
      if (itemsSection) {
        itemsSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }, []);

  return (
    <div
      className={clsx(
        "min-h-screen container mx-auto bg-background",
        className
      )}
    >
      <HeroSection
        onStartSwapping={handleStartSwapping}
        onBrowseNearby={handleBrowseNearby}
      />
    </div>
  );
};

export default Homepage;

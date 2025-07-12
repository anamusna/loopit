"use client";
import { useHomepage } from "@/hooks/useHomepage";
import { useLoopItStore } from "@/store";
import LoadingSpinner from "@/tailwind/components/elements/LoadingSpinner";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Alert, { AlertVariant } from "@/tailwind/components/layout/Alert";
import Carousel, {
  CarouselItem,
  CarouselSize,
  CarouselVariant,
} from "@/tailwind/components/layout/Carousel";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import "swiper/css";
import ItemsGrid from "./ui/ItemsGrid";

export interface HomepageProps {
  className?: string;
}

const EmptyState: React.FC<{
  hasFilters: boolean;
  onClearFilters: () => void;
}> = ({ hasFilters, onClearFilters }) => (
  <div className="text-center py-16 px-4">
    <div className="max-w-md mx-auto">
      <div className="text-6xl mb-6 opacity-30 animate-float">🔍</div>
      <Typography
        as={TypographyVariant.H2}
        className="text-2xl font-bold mb-4 text-text-primary"
      >
        {hasFilters ? "No items match your search" : "No items available"}
      </Typography>
      <Typography
        as={TypographyVariant.P}
        className="text-text-muted mb-6 leading-relaxed"
      >
        {hasFilters
          ? "Try adjusting your search terms or filters to find what you're looking for."
          : "Be the first to list an item in your community!"}
      </Typography>
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="text-primary hover:text-primary-hover font-medium transition-colors duration-200"
        >
          Clear all filters
        </button>
      )}
    </div>
  </div>
);

const ResultsHeader: React.FC<{
  resultsText: string;
  totalItems: number;
  filteredCount: number;
  hasActiveFilters: boolean;
  onRefresh: () => void;
  isLoading: boolean;
}> = ({
  resultsText,
  totalItems,
  filteredCount,
  hasActiveFilters,
  onRefresh,
  isLoading,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div>
      <Typography
        as={TypographyVariant.H2}
        className="text-xl sm:text-2xl font-bold text-text-primary mb-1"
      >
        {resultsText}
      </Typography>
      {hasActiveFilters && totalItems !== filteredCount && (
        <Typography
          as={TypographyVariant.SMALL}
          className="text-text-muted text-sm"
        >
          Filtered from {totalItems} total items
        </Typography>
      )}
    </div>
    <button
      onClick={onRefresh}
      disabled={isLoading}
      className={clsx(
        "inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
        "border border-border hover:border-primary/50 hover:bg-primary/5",
        "text-text-secondary hover:text-primary",
        isLoading && "opacity-50 cursor-not-allowed"
      )}
    >
      <div
        className={clsx(
          "w-4 h-4 mr-2 transition-transform duration-500",
          isLoading && "animate-spin"
        )}
      >
        🔄
      </div>
      Refresh
    </button>
  </div>
);

const HeroSection: React.FC<{
  onStartSwapping: () => void;
  onBrowseNearby: () => void;
}> = ({ onStartSwapping, onBrowseNearby }) => {
  const router = useRouter();
  const { getAllItems, users } = useLoopItStore();

  // Get real data from store
  const allItems = getAllItems();
  const totalItems = allItems.length;
  const totalUsers = users.length;

  // Calculate total CO2 savings from all items
  const totalCO2Saved = useMemo(() => {
    return allItems.reduce((total, item) => {
      return total + (item.environmentalImpact?.carbonSaved || 0);
    }, 0);
  }, [allItems]);

  // Get unique categories count
  const uniqueCategories = useMemo(() => {
    const categories = new Set(allItems.map((item) => item.category));
    return categories.size;
  }, [allItems]);

  const [itemsCount, setItemsCount] = useState(0);
  const [co2Count, setCo2Count] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [membersCount, setMembersCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) {
      setHasAnimated(true);
      const duration = 2000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setItemsCount(Math.floor(progress * totalItems));
        setCo2Count(Math.floor(progress * totalCO2Saved));
        setCategoriesCount(Math.floor(progress * uniqueCategories));
        setMembersCount(Math.floor(progress * totalUsers));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setItemsCount(totalItems);
          setCo2Count(totalCO2Saved);
          setCategoriesCount(uniqueCategories);
          setMembersCount(totalUsers);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [hasAnimated, totalItems, totalCO2Saved, uniqueCategories, totalUsers]);

  const heroCarouselItems: CarouselItem[] = [
    {
      id: "discover",
      content: (
        <div className="relative h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl overflow-hidden border border-blue-100 dark:border-blue-800/30">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 animate-morphing-gradient" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.2),transparent_50%)]" />
          <div className="relative z-10 text-center px-4 sm:px-6 space-y-4">
            <div className="text-6xl sm:text-7xl animate-float mb-4 drop-shadow-lg">
              🔍
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">
              Discover Treasures
            </h3>
            <p className="text-sm sm:text-base text-blue-700 dark:text-blue-200 max-w-md mx-auto leading-relaxed mb-4">
              Find amazing items from your local community. From vintage clothes
              to tech gadgets, discover what your neighbors are sharing.
            </p>
            <button
              onClick={() => router.push("/items")}
              className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 text-sm animate-elastic-scale"
              aria-label="Browse Items"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>Browse Items</span>
                <span className="text-base">→</span>
              </span>
            </button>
          </div>
        </div>
      ),
    },
    {
      id: "trade",
      content: (
        <div className="relative h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 rounded-2xl overflow-hidden border border-emerald-100 dark:border-emerald-800/30">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 animate-morphing-gradient" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(16,185,129,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_30%,rgba(16,185,129,0.2),transparent_50%)]" />
          <div className="relative z-10 text-center px-4 sm:px-6 space-y-4">
            <div className="text-6xl sm:text-7xl animate-float mb-4 drop-shadow-lg">
              🤝
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
              Trade & Connect
            </h3>
            <p className="text-sm sm:text-base text-emerald-700 dark:text-emerald-200 max-w-md mx-auto leading-relaxed mb-4">
              Build meaningful connections with neighbors. Every trade creates
              community bonds and gives items a second life.
            </p>
            <button
              onClick={() => router.push("/community")}
              className="group relative px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-800 text-sm animate-elastic-scale"
              aria-label="Join Community"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>Join Community</span>
                <span className="text-base">→</span>
              </span>
            </button>
          </div>
        </div>
      ),
    },
    {
      id: "impact",
      content: (
        <div className="relative h-full flex items-center justify-center bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 dark:from-green-900/20 dark:via-lime-900/20 dark:to-yellow-900/20 rounded-2xl overflow-hidden border border-green-100 dark:border-green-800/30">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-lime-500/10 to-yellow-500/10 animate-morphing-gradient" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(34,197,94,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_80%,rgba(34,197,94,0.2),transparent_50%)]" />
          <div className="relative z-10 text-center px-4 sm:px-6 space-y-4">
            <div className="text-6xl sm:text-7xl animate-float mb-4 drop-shadow-lg">
              🌍
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-green-900 dark:text-green-100 mb-2">
              Save the Planet
            </h3>
            <p className="text-sm sm:text-base text-green-700 dark:text-green-200 max-w-md mx-auto leading-relaxed mb-4">
              Every swap reduces waste and carbon emissions. Track your
              environmental impact and join the sustainability movement.
            </p>
            <button
              onClick={() => router.push("/impact")}
              className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 text-sm animate-elastic-scale"
              aria-label="View Impact"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-lime-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>View Impact</span>
                <span className="text-base">→</span>
              </span>
            </button>
          </div>
        </div>
      ),
    },
  ];

  const heroStats = [
    {
      icon: "🌱",
      label: "CO₂ Saved",
      value: `${co2Count.toLocaleString()}kg`,
      color: "text-success",
    },
    {
      icon: "📦",
      label: "Items Available",
      value: itemsCount.toLocaleString(),
      color: "text-primary",
    },
    {
      icon: "🗂️",
      label: "Categories",
      value: `${categoriesCount}+`,
      color: "text-accent",
    },
    {
      icon: "👥",
      label: "Community",
      value: `${membersCount}+`,
      color: "text-info",
    },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-morphing-gradient" />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-tl from-accent/20 to-primary/20 rounded-full blur-3xl animate-morphing-gradient"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-r from-success/10 to-info/10 rounded-full blur-2xl animate-aurora-flow" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-16 left-8 sm:top-20 sm:left-20 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary/30 rounded-full animate-particle-drift" />
        <div
          className="absolute top-32 right-12 sm:top-40 sm:right-32 w-1 h-1 bg-accent/40 rounded-full animate-particle-drift"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-24 left-1/3 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-success/30 rounded-full animate-particle-drift"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute bottom-16 right-1/4 w-1 h-1 bg-info/40 rounded-full animate-particle-drift"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen py-12 sm:py-16">
          {/* Left Column - Content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-4 sm:space-y-6 animate-elegant-reveal">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                <span className="block bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent animate-gradient-x">
                  Discover
                </span>
                <span className="block text-text-primary my-2">
                  {" "}
                  • Trade •{" "}
                </span>
                <span
                  className="block bg-gradient-to-r from-success via-accent to-primary bg-clip-text text-transparent animate-gradient-x"
                  style={{ animationDelay: "1s" }}
                >
                  Transform
                </span>
              </h1>

              <p
                className="text-base sm:text-lg lg:text-xl text-text-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-elegant-fade-up"
                style={{ animationDelay: "0.3s" }}
              >
                Join the sustainable revolution. Find treasures from your local
                community, build meaningful connections, and help save the
                planet with every swap.
              </p>
            </div>

            {/* Action Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start items-center animate-elegant-fade-up"
              style={{ animationDelay: "0.6s" }}
            >
              <button
                className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-primary/30 text-base sm:text-lg animate-elastic-scale"
                onClick={onStartSwapping}
                aria-label="Start Swapping"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>Start Swapping</span>
                  <span className="text-lg">🚀</span>
                </span>
              </button>

              <button
                className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-card border-2 border-accent font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-accent/30 text-base sm:text-lg hover:bg-accent/10 animate-elastic-scale"
                style={{ animationDelay: "0.1s" }}
                onClick={onBrowseNearby}
                aria-label="Browse Nearby"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>Browse Nearby</span>
                  <span className="text-lg">🔍</span>
                </span>
              </button>
            </div>

            {/* Impact Stats */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto lg:mx-0 animate-elegant-fade-up"
              style={{ animationDelay: "0.9s" }}
            >
              {heroStats.map((stat, i) => (
                <div
                  key={i}
                  className="group relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:border-primary/30 animate-elegant-fade-up"
                  style={{ animationDelay: `${1.2 + i * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 text-center space-y-1 sm:space-y-2">
                    <div
                      className="text-xl sm:text-2xl animate-float"
                      style={{ animationDelay: `${i * 0.5}s` }}
                    >
                      {stat.icon}
                    </div>
                    <div
                      className={`font-bold text-sm sm:text-base ${stat.color}`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-text-muted font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Interactive Carousel */}
          <div
            className="order-1 lg:order-2 animate-elegant-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="relative max-w-lg mx-auto">
              <Carousel
                items={heroCarouselItems}
                size={CarouselSize.LG}
                variant={CarouselVariant.CARD}
                autoPlay={true}
                interval={4000}
                showControls={true}
                showIndicators={true}
                showPlayButton={false}
                className="shadow-2xl shadow-primary/10"
                aria-label="LoopIt Features Showcase"
              />

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full animate-float opacity-60" />
              <div
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-success to-info rounded-full animate-float opacity-60"
                style={{ animationDelay: "1s" }}
              />
              <div
                className="absolute top-1/2 -left-8 w-4 h-4 bg-gradient-to-br from-primary to-accent rounded-full animate-float opacity-40"
                style={{ animationDelay: "2s" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-5" />
    </section>
  );
};

const HOW_IT_WORKS_STEPS = [
  {
    icon: "📤",
    title: "List Your Items",
    desc: "Upload photos and describe what you want to swap.",
  },
  {
    icon: "🔍",
    title: "Browse Nearby",
    desc: "Find amazing items from your local community.",
  },
  {
    icon: "💬",
    title: "Propose Trades",
    desc: "Message users to arrange a swap and chat details.",
  },
  {
    icon: "🤝",
    title: "Meet & Swap",
    desc: "Complete the trade and help save the planet!",
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-background via-card/50 to-accent/5 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
      </div>

      <div className="relative z-10 w-full  mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 animate-elegant-reveal">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
            Start swapping in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <div
              key={i}
              className="group relative bg-card border border-border rounded-3xl shadow-lg hover:shadow-xl p-6 sm:p-8 transition-all duration-500 hover:scale-105 animate-elegant-fade-up"
              style={{ animationDelay: `${0.3 + i * 0.2}s` }}
            >
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold shadow-lg animate-float">
                {i + 1}
              </div>

              <div className="text-center space-y-4">
                <div
                  className="text-4xl sm:text-5xl mb-4 animate-float"
                  style={{ animationDelay: `${i * 0.5}s` }}
                >
                  {step.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const GET_INVOLVED_CTA = [
  {
    title: "Sign Up & Start Swapping",
    desc: "Create your free account and join the LoopIt community.",
    button: { label: "Sign Up", href: "/register", primary: true },
  },
  {
    title: "Volunteer or Partner",
    desc: "Help us organize events or become a local LoopIt ambassador.",
    button: {
      label: "Volunteer/Partner",
      href: "mailto:hello@loopit.com?subject=LoopIt%20Volunteer%20or%20Partner",
      primary: false,
    },
  },
  {
    title: "Newsletter & Updates",
    desc: "Get the latest on swaps, events, and eco-tips.",
    button: {
      label: "Join Newsletter",
      href: "mailto:hello@loopit.com?subject=LoopIt%20Newsletter%20Signup",
      primary: false,
    },
  },
];

const EnvironmentalImpactSection: React.FC = () => {
  const { getAllItems } = useLoopItStore();

  const allItems = getAllItems();
  const totalItems = allItems.length;

  const totalCO2Saved = useMemo(() => {
    return allItems.reduce((total, item) => {
      return total + (item.environmentalImpact?.carbonSaved || 0);
    }, 0);
  }, [allItems]);

  const [itemsCount, setItemsCount] = useState(0);
  const [co2Count, setCo2Count] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    setEmail("");
  };

  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true);
      const duration = 1500;
      const startItems = 0;
      const startCo2 = 0;
      const animate = (timestamp: number, startTime: number) => {
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setItemsCount(Math.floor(progress * totalItems));
        setCo2Count(Math.floor(progress * totalCO2Saved));
        if (progress < 1) {
          requestAnimationFrame((t) => animate(t, startTime));
        } else {
          setItemsCount(totalItems);
          setCo2Count(totalCO2Saved);
        }
      };
      requestAnimationFrame((t) => animate(t, t));
    }
  }, [inView, hasAnimated, totalItems, totalCO2Saved]);

  return (
    <section
      ref={ref}
      className="py-16 sm:py-24 bg-gradient-to-br from-accent/5 via-success/5 to-primary/5 relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-success/10 to-info/10 animate-morphing-gradient" />
      </div>

      <div className="relative z-10 w-full mx-auto px-4 sm:px-6">
        <div className="text-center space-y-8 animate-elegant-reveal">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
              Environmental Impact
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-secondary">
              Get Involved / Join the Movement
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 max-w-4xl mx-auto">
            <div className="group bg-card border border-border rounded-3xl shadow-lg hover:shadow-xl p-8 transition-all duration-500 hover:scale-105 animate-elegant-fade-up">
              <div className="text-center space-y-4">
                <div className="text-5xl sm:text-6xl font-extrabold text-success mb-4 animate-float">
                  {itemsCount.toLocaleString()}
                </div>
                <div className="text-lg text-text-secondary font-semibold">
                  Items Saved
                </div>
              </div>
            </div>

            <div
              className="group bg-card border border-border rounded-3xl shadow-lg hover:shadow-xl p-8 transition-all duration-500 hover:scale-105 animate-elegant-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="text-center space-y-4">
                <div
                  className="text-5xl sm:text-6xl font-extrabold text-info mb-4 animate-float"
                  style={{ animationDelay: "0.5s" }}
                >
                  {co2Count.toLocaleString()} kg
                </div>
                <div className="text-lg text-text-secondary font-semibold">
                  CO₂ Saved
                </div>
              </div>
            </div>
          </div>

          <div className="text-text-secondary max-w-4xl mx-auto text-lg leading-relaxed">
            Every time you swap instead of buying new, you help reduce waste and
            carbon emissions. <b>Carbon badges</b> are calculated based on the
            estimated CO₂ savings for each item type, using data from
            environmental studies and our own platform analytics.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {GET_INVOLVED_CTA.map((cta, i) => (
              <div
                key={i}
                className={`group relative bg-card border border-border rounded-3xl shadow-lg hover:shadow-xl p-8 text-center transition-all duration-500 hover:scale-105 animate-elegant-fade-up ${
                  cta.button.primary ? "ring-2 ring-primary/30" : ""
                }`}
                style={{ animationDelay: `${0.4 + i * 0.1}s` }}
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-text-primary">
                    {cta.title}
                  </h3>
                  <p className="text-text-secondary text-base leading-relaxed">
                    {cta.desc}
                  </p>
                  <a
                    href={cta.button.href}
                    className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 text-base focus:outline-none focus:ring-4 focus:ring-primary/40 hover:scale-105 ${
                      cta.button.primary
                        ? "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-xl"
                        : "bg-secondary/20 text-primary hover:bg-primary/10 border border-primary/20"
                    }`}
                    aria-label={cta.button.label}
                  >
                    {cta.button.label}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div
            className="max-w-2xl mx-auto animate-elegant-fade-up"
            style={{ animationDelay: "0.8s" }}
          >
            <form
              className="flex flex-col sm:flex-row gap-4 items-center justify-center"
              onSubmit={handleNewsletter}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-6 py-4 rounded-2xl border border-border focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none text-base bg-card shadow-lg"
                aria-label="Email address"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base focus:outline-none focus:ring-4 focus:ring-primary/40 hover:scale-105"
                aria-label="Join Newsletter"
              >
                Join Newsletter
              </button>
            </form>
            {error && (
              <div className="text-red-600 text-sm text-center mt-4 animate-elegant-fade-up">
                {error}
              </div>
            )}
            {submitted && (
              <div className="text-success text-sm text-center mt-4 animate-elegant-fade-up">
                Thank you for joining!
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Homepage: React.FC<HomepageProps> = ({ className = "" }) => {
  const router = useRouter();
  const { isAuthenticated } = useLoopItStore();

  const {
    filteredItems,
    searchQuery,
    filters,
    isLoading,
    error,
    totalItems,
    hasActiveFilters,
    resultsText,
    setSearchQuery,
    clearSearch,
    setFilters,
    clearAllFilters,
    handleItemClick,
    handleSaveItem,
    handleUnsaveItem,
    isItemSaved,
    refreshItems,
  } = useHomepage({
    enableUrlSync: true,
  });

  const handleStartSwapping = useCallback(() => {
    router.push("/items");
  }, [router]);

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

      <HowItWorksSection />

      <section
        id="items-section"
        className="py-16 sm:py-24 bg-gradient-to-br from-background via-card/30 to-primary/5 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        </div>

        <div className="relative z-10 w-full mx-auto px-4 sm:px-6">
          <div className="space-y-8">
            <div className="text-center animate-elegant-reveal">
              <Typography
                as={TypographyVariant.H2}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4"
              >
                Discover Amazing Items
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto mb-8 leading-relaxed"
              >
                Find treasures from your local community and help save the
                planet
              </Typography>
            </div>

            {error && (
              <Alert
                variant={AlertVariant.ERROR}
                message={error}
                className="max-w-2xl mx-auto animate-elegant-fade-up"
              />
            )}

            {!error && (
              <>
                <ResultsHeader
                  resultsText={resultsText}
                  totalItems={totalItems}
                  filteredCount={filteredItems.length}
                  hasActiveFilters={hasActiveFilters}
                  onRefresh={refreshItems}
                  isLoading={isLoading}
                />

                {filteredItems.length === 0 && !isLoading ? (
                  <EmptyState
                    hasFilters={hasActiveFilters}
                    onClearFilters={clearAllFilters}
                  />
                ) : (
                  <ItemsGrid
                    items={filteredItems}
                    isLoading={isLoading}
                    onItemClick={handleItemClick}
                    onSaveItem={handleSaveItem}
                    onUnsaveItem={handleUnsaveItem}
                    isItemSaved={isItemSaved}
                    viewMode="grid"
                    className="animate-elegant-fade-up"
                  />
                )}

                {isLoading && filteredItems.length === 0 && (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <EnvironmentalImpactSection />
    </div>
  );
};

export default Homepage;

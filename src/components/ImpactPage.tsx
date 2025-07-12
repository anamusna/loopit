"use client";
import { useLoopItStore } from "@/store";
import {
  faArrowDown,
  faArrowUp,
  faCalculator,
  faCar,
  faChartLine,
  faCopy,
  faDownload,
  faEquals,
  faGlobe,
  faHandshake,
  faHeart,
  faHome,
  faLeaf,
  faPlane,
  faRecycle,
  faSeedling,
  faShare,
  faTree,
  faTrophy,
  faUsers,
  faWater,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

const useClientFormatter = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatNumber = (num: number) => {
    if (!isClient) return "0";
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatPercentage = (num: number) => {
    if (!isClient) return "0%";
    return `${num.toFixed(1)}%`;
  };

  return { formatNumber, formatPercentage, isClient };
};

const AnimatedCounter: React.FC<{
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}> = ({ value, suffix = "", prefix = "", duration = 2000 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const { formatNumber } = useClientFormatter();

  useEffect(() => {
    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentValue = Math.floor(
        startValue + (endValue - startValue) * progress
      );
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [value, duration]);

  return (
    <span className="font-bold text-2xl md:text-3xl">
      {prefix}
      {formatNumber(displayValue)}
      {suffix}
    </span>
  );
};

const ImpactMetricCard: React.FC<{
  title: string;
  value: number;
  unit: string;
  icon: any;
  color: string;
  bgColor: string;
  trend?: "up" | "down" | "stable";
  trendValue?: number;
  description?: string;
  delay?: number;
}> = ({
  title,
  value,
  unit,
  icon,
  color,
  bgColor,
  trend,
  trendValue,
  description,
  delay = 0,
}) => {
  return (
    <div
      className={clsx(
        "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-6 hover:shadow-lg transition-all duration-300 animate-elegant-fade-up group",
        "hover:scale-105 hover:shadow-xl"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={clsx("p-3 rounded-lg", bgColor)}>
          <FontAwesomeIcon icon={icon} className={clsx("h-6 w-6", color)} />
        </div>
        {trend && (
          <div
            className={clsx(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              trend === "up"
                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : trend === "down"
                ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
            )}
          >
            <FontAwesomeIcon
              icon={
                trend === "up"
                  ? faArrowUp
                  : trend === "down"
                  ? faArrowDown
                  : faEquals
              }
              className="h-3 w-3"
            />
            {trendValue && <span>{trendValue}%</span>}
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>

      <div className="mb-3">
        <AnimatedCounter value={value} suffix={unit} />
      </div>

      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
};

const EnvironmentalImpactChart: React.FC = () => {
  const environmentalImpact = useLoopItStore(
    (state) => state.environmentalImpact
  );
  const { formatNumber } = useClientFormatter();

  const impactData = useMemo(() => {
    if (!environmentalImpact) return null;

    const totalCarbon = environmentalImpact.communityCarbonSaved;
    const totalWater = environmentalImpact.communityCarbonSaved * 1000; // Estimated water savings
    const totalLandfill = environmentalImpact.communityCarbonSaved * 0.5; // Estimated landfill savings

    return {
      carbon: totalCarbon,
      water: totalWater,
      landfill: totalLandfill,
      total: totalCarbon + totalWater + totalLandfill,
    };
  }, [environmentalImpact]);

  if (!impactData) return null;

  const maxValue = Math.max(
    impactData.carbon,
    impactData.water,
    impactData.landfill
  );

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200/60 dark:border-emerald-800/60">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-800/40 rounded-lg">
          <FontAwesomeIcon
            icon={faChartLine}
            className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Environmental Impact
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Community-wide sustainability metrics
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300">CO₂ Saved</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {formatNumber(impactData.carbon)}kg
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(impactData.carbon / maxValue) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300">
              Water Saved
            </span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {formatNumber(impactData.water)}L
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(impactData.water / maxValue) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300">
              Landfill Avoided
            </span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {formatNumber(impactData.landfill)}kg
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-amber-500 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(impactData.landfill / maxValue) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ImpactComparison: React.FC = () => {
  const environmentalImpact = useLoopItStore(
    (state) => state.environmentalImpact
  );
  const { formatNumber } = useClientFormatter();

  const comparisons = useMemo(() => {
    if (!environmentalImpact) return [];

    const carbonSaved = environmentalImpact.communityCarbonSaved;

    return [
      {
        icon: faCar,
        title: "Car Rides",
        value: Math.round(carbonSaved / 2.3), // kg CO2 per km
        unit: "km",
        color: "text-red-600",
        bgColor: "bg-red-100 dark:bg-red-900/20",
      },
      {
        icon: faPlane,
        title: "Flight Hours",
        value: Math.round(carbonSaved / 90), // kg CO2 per hour
        unit: "hours",
        color: "text-blue-600",
        bgColor: "bg-blue-100 dark:bg-blue-900/20",
      },
      {
        icon: faHome,
        title: "Home Days",
        value: Math.round(carbonSaved / 20), // kg CO2 per day
        unit: "days",
        color: "text-green-600",
        bgColor: "bg-green-100 dark:bg-green-900/20",
      },
      {
        icon: faTree,
        title: "Tree Days",
        value: Math.round(carbonSaved / 22), // kg CO2 per tree per day
        unit: "days",
        color: "text-emerald-600",
        bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
      },
    ];
  }, [environmentalImpact]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200/60 dark:border-blue-800/60">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 dark:bg-blue-800/40 rounded-lg">
          <FontAwesomeIcon
            icon={faCalculator}
            className="h-6 w-6 text-blue-600 dark:text-blue-400"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Impact Equivalents
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            What your impact means in real terms
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {comparisons.map((comparison, index) => (
          <div
            key={index}
            className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg"
          >
            <div
              className={clsx(
                "p-3 rounded-lg mx-auto mb-3 w-fit",
                comparison.bgColor
              )}
            >
              <FontAwesomeIcon
                icon={comparison.icon}
                className={clsx("h-5 w-5", comparison.color)}
              />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {comparison.title}
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {formatNumber(comparison.value)} {comparison.unit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const TopContributors: React.FC = () => {
  const environmentalImpact = useLoopItStore(
    (state) => state.environmentalImpact
  );
  const topContributors = environmentalImpact?.topContributors || [];

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200/60 dark:border-amber-800/60">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-amber-100 dark:bg-amber-800/40 rounded-lg">
          <FontAwesomeIcon
            icon={faTrophy}
            className="h-6 w-6 text-amber-600 dark:text-amber-400"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Top Contributors
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Community environmental champions
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {topContributors.slice(0, 5).map((contributor, index) => (
          <div
            key={contributor.user.id}
            className="flex items-center gap-4 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent">
                  <Image
                    src={
                      contributor.user.avatar ||
                      "https://i.pravatar.cc/150?img=11"
                    }
                    alt={contributor.user.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {contributor.rankEmoji}
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {contributor.user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {contributor.totalSwaps} swaps
                </p>
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round(contributor.carbonSaved)}kg CO₂
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">saved</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ImpactSharing: React.FC = () => {
  const environmentalImpact = useLoopItStore(
    (state) => state.environmentalImpact
  );
  const { formatNumber } = useClientFormatter();

  const shareData = useMemo(() => {
    if (!environmentalImpact) return null;

    return {
      carbonSaved: environmentalImpact.communityCarbonSaved,
      totalSwaps: environmentalImpact.topContributors.reduce(
        (sum, c) => sum + c.totalSwaps,
        0
      ),
      participants: environmentalImpact.topContributors.length,
      shareText: `I've helped save ${Math.round(
        environmentalImpact.communityCarbonSaved
      )}kg of CO₂ through sustainable swapping on LoopIt! 🌱♻️`,
    };
  }, [environmentalImpact]);

  if (!shareData) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200/60 dark:border-purple-800/60">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 dark:bg-purple-800/40 rounded-lg">
          <FontAwesomeIcon
            icon={faShare}
            className="h-6 w-6 text-purple-600 dark:text-purple-400"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Share Your Impact
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Inspire others with your sustainability story
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            {shareData.shareText}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <FontAwesomeIcon icon={faUsers} className="h-3 w-3" />
            <span>{formatNumber(shareData.participants)} participants</span>
            <FontAwesomeIcon icon={faHandshake} className="h-3 w-3 ml-2" />
            <span>{formatNumber(shareData.totalSwaps)} swaps</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
            <FontAwesomeIcon icon={faShare} className="h-4 w-4 mr-2" />
            Share on Twitter
          </button>
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
            <FontAwesomeIcon icon={faShare} className="h-4 w-4 mr-2" />
            Share on WhatsApp
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
            <FontAwesomeIcon icon={faCopy} className="h-4 w-4 mr-2" />
            Copy Link
          </button>
          <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
            <FontAwesomeIcon icon={faDownload} className="h-4 w-4 mr-2" />
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

const ImpactPage: React.FC = () => {
  const {
    environmentalImpact,
    communityPosts,
    communityEvents,
    items,
    fetchCommunityPosts,
    fetchCommunityEvents,
  } = useLoopItStore();

  useEffect(() => {
    fetchCommunityPosts();
    fetchCommunityEvents();
  }, [fetchCommunityPosts, fetchCommunityEvents]);

  const impactStats = useMemo(() => {
    const totalItems = items.length;
    const totalPosts = communityPosts.length;
    const totalEvents = communityEvents.length;
    const activeEvents = communityEvents.filter(
      (event) => event.isActive
    ).length;
    const totalParticipants = communityEvents.reduce(
      (sum, event) => sum + event.currentParticipants,
      0
    );

    return {
      items: totalItems,
      posts: totalPosts,
      events: totalEvents,
      activeEvents,
      participants: totalParticipants,
      carbonSaved: environmentalImpact?.communityCarbonSaved || 0,
      waterSaved: (environmentalImpact?.communityCarbonSaved || 0) * 1000,
      landfillSaved: (environmentalImpact?.communityCarbonSaved || 0) * 0.5,
    };
  }, [items, communityPosts, communityEvents, environmentalImpact]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/30 dark:from-gray-900 dark:via-green-900/10 dark:to-emerald-900/10">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center animate-elegant-fade-up">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Our{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Environmental Impact
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              See how our community is making a real difference for the planet.
              Every swap, every post, and every event contributes to a more
              sustainable future.
            </p>

            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faLeaf} className="h-4 w-4" />
                <span>CO₂ Reduction</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faRecycle} className="h-4 w-4" />
                <span>Waste Prevention</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUsers} className="h-4 w-4" />
                <span>Community Building</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <ImpactMetricCard
            title="CO₂ Saved"
            value={Math.round(impactStats.carbonSaved)}
            unit="kg"
            icon={faLeaf}
            color="text-emerald-600 dark:text-emerald-400"
            bgColor="bg-emerald-100 dark:bg-emerald-900/20"
            trend="up"
            trendValue={12.5}
            description="Equivalent to planting 15 trees"
            delay={0}
          />

          <ImpactMetricCard
            title="Water Saved"
            value={Math.round(impactStats.waterSaved)}
            unit="L"
            icon={faWater}
            color="text-blue-600 dark:text-blue-400"
            bgColor="bg-blue-100 dark:bg-blue-900/20"
            trend="up"
            trendValue={8.3}
            description="Enough for 50 showers"
            delay={100}
          />

          <ImpactMetricCard
            title="Landfill Avoided"
            value={Math.round(impactStats.landfillSaved)}
            unit="kg"
            icon={faRecycle}
            color="text-amber-600 dark:text-amber-400"
            bgColor="bg-amber-100 dark:bg-amber-900/20"
            trend="up"
            trendValue={15.7}
            description="Items given second life"
            delay={200}
          />

          <ImpactMetricCard
            title="Community Members"
            value={impactStats.participants}
            unit=""
            icon={faUsers}
            color="text-purple-600 dark:text-purple-400"
            bgColor="bg-purple-100 dark:bg-purple-900/20"
            trend="up"
            trendValue={23.1}
            description="Active sustainability advocates"
            delay={300}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <EnvironmentalImpactChart />
            <ImpactComparison />
          </div>

          <div className="space-y-8">
            <TopContributors />
            <ImpactSharing />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200/60 dark:border-green-800/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-800/40 rounded-lg">
                <FontAwesomeIcon
                  icon={faSeedling}
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Sustainable Future
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Building tomorrow&apos;s habits
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Every item swapped instead of bought new reduces demand for new
              production, conserving resources and reducing environmental
              impact.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200/60 dark:border-blue-800/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-800/40 rounded-lg">
                <FontAwesomeIcon
                  icon={faGlobe}
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Global Impact
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Local actions, worldwide effects
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Our community&apos;s collective actions contribute to global
              sustainability goals and demonstrate the power of local
              environmental stewardship.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200/60 dark:border-purple-800/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-800/40 rounded-lg">
                <FontAwesomeIcon
                  icon={faHeart}
                  className="h-6 w-6 text-purple-600 dark:text-purple-400"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Community Care
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Supporting each other
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Beyond environmental benefits, we&apos;re building stronger, more
              connected communities through shared values and mutual support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactPage;

"use client";
import { getOffsetComparison } from "@/constants/environmentalImpact";
import { useLoopItStore } from "@/store";
import Avatar, { AvatarSize } from "@/tailwind/components/elements/Avatar";
import Badge, { BadgeVariant } from "@/tailwind/components/elements/Badge";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Card, { CardBody, CardHeader } from "@/tailwind/components/layout/Card";
import {
  formatCarbonSavings,
  getImpactLevelStyling,
} from "@/utils/environmentalHelpers";
import {
  faChartLine,
  faLeaf,
  faShare,
  faTrophy,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useState } from "react";
export interface EnvironmentalImpactCardProps {
  className?: string;
  showLeaderboard?: boolean;
  showShareButton?: boolean;
}
export const EnvironmentalImpactCard: React.FC<
  EnvironmentalImpactCardProps
> = ({ className = "", showLeaderboard = false, showShareButton = true }) => {
  const {
    user,
    items,
    environmentalImpact,
    isLoadingEnvironmentalImpact,
    calculateEnvironmentalImpact,
    getEnvironmentalLeaderboard,
    shareEnvironmentalImpact,
  } = useLoopItStore();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  useEffect(() => {
    if (user && items.length > 0) {
      calculateEnvironmentalImpact();
    }
  }, [user, items, calculateEnvironmentalImpact]);
  useEffect(() => {
    if (showLeaderboard && user) {
      setIsLoadingLeaderboard(true);
      getEnvironmentalLeaderboard(5)
        .then(setLeaderboard)
        .catch(console.error)
        .finally(() => setIsLoadingLeaderboard(false));
    }
  }, [showLeaderboard, user, getEnvironmentalLeaderboard]);
  useEffect(() => {
    if (user && items.length > 0) {
      import("@/utils/environmentalHelpers").then(
        ({ getPersonalEnvironmentalInsights }) => {
          setInsights(getPersonalEnvironmentalInsights(user, items));
        }
      );
    }
  }, [user, items]);
  const handleShareImpact = useCallback(async () => {
    try {
      await shareEnvironmentalImpact();
    } catch (error) {
      console.error("Failed to share environmental impact:", error);
    }
  }, [shareEnvironmentalImpact]);
  if (!user || !environmentalImpact) {
    return (
      <Card className={className}>
        <CardBody>
          <div className="text-center py-8">
            <FontAwesomeIcon
              icon={faLeaf}
              className="w-12 h-12 text-success/50 mb-4"
            />
            <Typography as={TypographyVariant.P} className="text-text-muted">
              {isLoadingEnvironmentalImpact
                ? "Calculating your environmental impact..."
                : "No environmental data available"}
            </Typography>
          </div>
        </CardBody>
      </Card>
    );
  }
  const {
    userCarbonSaved,
    communityCarbonSaved,
    userEnvironmentalScore,
    environmentalBadgeProgress,
    categoryBreakdown,
  } = environmentalImpact;
  const impactStyling = getImpactLevelStyling(userCarbonSaved);
  const carbonFormatted = formatCarbonSavings(userCarbonSaved);
  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="bg-gradient-to-br from-success/5 to-accent/5 border-success/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faLeaf} className="w-5 h-5 text-success" />
            </div>
            <div>
              <Typography as={TypographyVariant.H3} className="font-bold">
                Environmental Impact
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-sm text-text-muted"
              >
                Your contribution to a sustainable future
              </Typography>
            </div>
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl">{impactStyling.icon}</span>
              <Typography
                as={TypographyVariant.H2}
                className={`text-4xl font-bold ${impactStyling.color}`}
              >
                {carbonFormatted}
              </Typography>
            </div>
            <Typography
              as={TypographyVariant.P}
              className="text-sm text-text-muted"
            >
              Carbon dioxide saved through sustainable swapping
            </Typography>
          </div>

          {userCarbonSaved > 0 && (
            <div className="bg-background/50 rounded-lg p-4 border border-border/30">
              <Typography
                as={TypographyVariant.H4}
                className="font-semibold mb-3 text-center"
              >
                💚 Your Impact Equals
              </Typography>
              <div className="grid grid-cols-2 gap-3">
                {(() => {
                  const offset = getOffsetComparison(userCarbonSaved);
                  const comparisons = [
                    {
                      icon: "🚗",
                      label: "Car Rides",
                      value: offset.carRides,
                      unit: "rides",
                    },
                    {
                      icon: "🏠",
                      label: "Home Power",
                      value: offset.homeDays,
                      unit: "days",
                    },
                    {
                      icon: "🌳",
                      label: "Tree Days",
                      value: offset.treeDays,
                      unit: "days",
                    },
                    {
                      icon: "💡",
                      label: "Light Hours",
                      value: offset.lightbulbHours,
                      unit: "hours",
                    },
                  ];
                  return comparisons.map((comparison) => (
                    <div
                      key={comparison.label}
                      className="text-center p-2 bg-success/10 rounded-lg border border-success/20"
                    >
                      <div className="text-lg mb-1">{comparison.icon}</div>
                      <Typography
                        as={TypographyVariant.P}
                        className="text-xs font-medium text-text-primary"
                      >
                        {comparison.label}
                      </Typography>
                      <Typography
                        as={TypographyVariant.P}
                        className="text-sm font-bold text-success"
                      >
                        {comparison.value} {comparison.unit}
                      </Typography>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          <div className="bg-background/50 rounded-lg p-4 border border-border/30">
            <div className="flex items-center justify-between mb-2">
              <Typography as={TypographyVariant.P} className="font-medium">
                Environmental Score
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-lg font-bold text-success"
              >
                {userEnvironmentalScore}/100
              </Typography>
            </div>
            <div className="w-full bg-secondary/30 rounded-full h-2">
              <div
                className="bg-success h-2 rounded-full transition-all duration-500"
                style={{ width: `${userEnvironmentalScore}%` }}
              />
            </div>
          </div>

          {Object.keys(categoryBreakdown).length > 0 && (
            <div>
              <Typography
                as={TypographyVariant.H4}
                className="font-semibold mb-3"
              >
                Impact by Category
              </Typography>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(categoryBreakdown)
                  .filter(([, data]) => data.count > 0)
                  .sort(([, a], [, b]) => b.totalSaved - a.totalSaved)
                  .slice(0, 4)
                  .map(([category, data]) => (
                    <div
                      key={category}
                      className="bg-background/50 rounded-lg p-3 border border-border/30"
                    >
                      <Typography
                        as={TypographyVariant.P}
                        className="font-medium text-sm capitalize"
                      >
                        {category}
                      </Typography>
                      <Typography
                        as={TypographyVariant.P}
                        className="text-success font-bold"
                      >
                        {formatCarbonSavings(data.totalSaved)}
                      </Typography>
                      <Typography
                        as={TypographyVariant.SMALL}
                        className="text-text-muted"
                      >
                        {data.count} item{data.count !== 1 ? "s" : ""}
                      </Typography>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {insights.length > 0 && (
            <div className="bg-info/5 border border-info/20 rounded-lg p-4">
              <Typography
                as={TypographyVariant.H4}
                className="font-semibold mb-2 text-info"
              >
                🌱 Your Impact
              </Typography>
              <ul className="space-y-1">
                {insights.slice(0, 2).map((insight, index) => (
                  <li key={index}>
                    <Typography
                      as={TypographyVariant.P}
                      className="text-sm text-info"
                    >
                      • {insight}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            {showShareButton && (
              <Button
                variant={ButtonVariant.OUTLINE}
                size={ButtonSize.MD}
                onClick={handleShareImpact}
                className="flex-1 sm:flex-none"
              >
                <FontAwesomeIcon icon={faShare} className="w-4 h-4 mr-2" />
                Share Impact
              </Button>
            )}
            <Button
              variant={ButtonVariant.PRIMARY}
              size={ButtonSize.MD}
              onClick={calculateEnvironmentalImpact}
              disabled={isLoadingEnvironmentalImpact}
              className="flex-1 sm:flex-none"
            >
              <FontAwesomeIcon icon={faChartLine} className="w-4 h-4 mr-2" />
              {isLoadingEnvironmentalImpact ? "Updating..." : "Update Impact"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {environmentalBadgeProgress.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faTrophy}
                className="w-5 h-5 text-warning"
              />
              <Typography as={TypographyVariant.H4} className="font-semibold">
                Environmental Badges
              </Typography>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {environmentalBadgeProgress.map((badge) => (
                <div key={badge.level} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Typography
                      as={TypographyVariant.P}
                      className="font-medium"
                    >
                      {badge.level.charAt(0).toUpperCase() +
                        badge.level.slice(1)}
                    </Typography>
                    <div className="flex items-center gap-2">
                      {badge.achieved && (
                        <Badge
                          variant={BadgeVariant.SUCCESS}
                          className="text-xs"
                        >
                          ✓ Earned
                        </Badge>
                      )}
                      <Typography
                        as={TypographyVariant.P}
                        className="text-sm text-text-muted"
                      >
                        {formatCarbonSavings(badge.threshold)}
                      </Typography>
                    </div>
                  </div>
                  <div className="w-full bg-secondary/30 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        badge.achieved ? "bg-success" : "bg-warning"
                      }`}
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                  <Typography
                    as={TypographyVariant.SMALL}
                    className="text-text-muted"
                  >
                    {badge.achieved
                      ? "Badge earned!"
                      : `${formatCarbonSavings(badge.remaining)} more to earn`}
                  </Typography>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUsers} className="w-5 h-5 text-accent" />
            <Typography as={TypographyVariant.H4} className="font-semibold">
              Community Impact
            </Typography>
          </div>
        </CardHeader>
        <CardBody>
          <div className="text-center">
            <Typography
              as={TypographyVariant.H3}
              className="text-3xl font-bold text-accent mb-2"
            >
              {formatCarbonSavings(communityCarbonSaved)}
            </Typography>
            <Typography as={TypographyVariant.P} className="text-text-muted">
              Total carbon saved by the LoopIt community
            </Typography>
          </div>
        </CardBody>
      </Card>

      {showLeaderboard && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faTrophy}
                className="w-5 h-5 text-warning"
              />
              <Typography as={TypographyVariant.H4} className="font-semibold">
                Top Contributors
              </Typography>
            </div>
          </CardHeader>
          <CardBody>
            {isLoadingLeaderboard ? (
              <div className="text-center py-4">
                <Typography
                  as={TypographyVariant.P}
                  className="text-text-muted"
                >
                  Loading leaderboard...
                </Typography>
              </div>
            ) : leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.user.id}
                    className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/30"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{entry.rankEmoji}</span>
                      <Avatar
                        src={entry.user.avatar}
                        alt={entry.user.name}
                        size={AvatarSize.SM}
                      />
                    </div>
                    <div className="flex-1">
                      <Typography
                        as={TypographyVariant.P}
                        className="font-medium"
                      >
                        {entry.user.name}
                      </Typography>
                      <Typography
                        as={TypographyVariant.SMALL}
                        className="text-text-muted"
                      >
                        {entry.totalSwaps} swaps
                      </Typography>
                    </div>
                    <div className="text-right">
                      <Typography
                        as={TypographyVariant.P}
                        className="font-bold text-success"
                      >
                        {formatCarbonSavings(entry.carbonSaved)}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Typography
                  as={TypographyVariant.P}
                  className="text-text-muted"
                >
                  No leaderboard data available
                </Typography>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
};
export default EnvironmentalImpactCard;

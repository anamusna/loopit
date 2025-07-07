"use client";
import { getOffsetComparison } from "@/constants/environmentalImpact";
import { UserProfile } from "@/shared/types";
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
import { formatCarbonSavings } from "@/utils/environmentalHelpers";
import {
  faCrown,
  faLeaf,
  faMedal,
  faTrophy,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useState } from "react";
export interface EnvironmentalLeaderboardProps {
  className?: string;
  limit?: number;
  showTitle?: boolean;
  showRefreshButton?: boolean;
}
export interface LeaderboardEntry {
  user: UserProfile;
  carbonSaved: number;
  totalSwaps: number;
  rank: number;
  rankEmoji: string;
}
export const EnvironmentalLeaderboard: React.FC<
  EnvironmentalLeaderboardProps
> = ({
  className = "",
  limit = 10,
  showTitle = true,
  showRefreshButton = true,
}) => {
  const { getEnvironmentalLeaderboard } = useLoopItStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getEnvironmentalLeaderboard(limit);
      setLeaderboard(data);
    } catch (err) {
      setError("Failed to load leaderboard");
      console.error("Failed to load leaderboard:", err);
    } finally {
      setIsLoading(false);
    }
  }, [getEnvironmentalLeaderboard, limit]);
  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <FontAwesomeIcon icon={faCrown} className="w-4 h-4 text-warning" />
        );
      case 2:
        return (
          <FontAwesomeIcon icon={faMedal} className="w-4 h-4 text-gray-400" />
        );
      case 3:
        return (
          <FontAwesomeIcon icon={faMedal} className="w-4 h-4 text-amber-600" />
        );
      default:
        return (
          <span className="text-sm font-bold text-text-muted">#{rank}</span>
        );
    }
  };
  const getRankBadgeVariant = (rank: number): BadgeVariant => {
    switch (rank) {
      case 1:
        return BadgeVariant.PRIMARY;
      case 2:
        return BadgeVariant.SECONDARY;
      case 3:
        return BadgeVariant.WARNING;
      default:
        return BadgeVariant.DEFAULT;
    }
  };
  if (error) {
    return (
      <Card className={className}>
        <CardBody>
          <div className="text-center py-8">
            <FontAwesomeIcon
              icon={faUsers}
              className="w-12 h-12 text-text-muted/50 mb-4"
            />
            <Typography
              as={TypographyVariant.P}
              className="text-text-muted mb-4"
            >
              {error}
            </Typography>
            <Button
              variant={ButtonVariant.OUTLINE}
              size={ButtonSize.SM}
              onClick={loadLeaderboard}
            >
              Try Again
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }
  return (
    <Card className={className}>
      {showTitle && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faTrophy}
                  className="w-5 h-5 text-success"
                />
              </div>
              <div>
                <Typography as={TypographyVariant.H3} className="font-bold">
                  Environmental Champions
                </Typography>
                <Typography
                  as={TypographyVariant.P}
                  className="text-sm text-text-muted"
                >
                  Top contributors by carbon savings
                </Typography>
              </div>
            </div>
            {showRefreshButton && (
              <Button
                variant={ButtonVariant.OUTLINE}
                size={ButtonSize.SM}
                onClick={loadLeaderboard}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faLeaf} className="w-4 h-4 mr-2" />
                {isLoading ? "Loading..." : "Refresh"}
              </Button>
            )}
          </div>
        </CardHeader>
      )}
      <CardBody>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: Math.min(limit, 5) }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/30 animate-pulse"
              >
                <div className="w-8 h-8 bg-secondary/30 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-secondary/30 rounded w-24" />
                  <div className="h-3 bg-secondary/30 rounded w-16" />
                </div>
                <div className="h-6 bg-secondary/30 rounded w-20" />
              </div>
            ))}
          </div>
        ) : leaderboard.length > 0 ? (
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div
                key={entry.user.id}
                className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  entry.rank <= 3
                    ? "bg-gradient-to-r from-warning/5 to-success/5 border-warning/20"
                    : "bg-background/50 border-border/30"
                }`}
              >
                <div className="flex items-center justify-center w-10 h-10">
                  {getRankIcon(entry.rank)}
                </div>

                <Avatar
                  src={entry.user.avatar}
                  alt={entry.user.name}
                  size={AvatarSize.MD}
                  className="ring-2 ring-background"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Typography
                      as={TypographyVariant.P}
                      className="font-semibold truncate"
                    >
                      {entry.user.name}
                    </Typography>
                    {entry.rank <= 3 && (
                      <Badge
                        variant={getRankBadgeVariant(entry.rank)}
                        className="text-xs px-2 py-0.5"
                      >
                        {entry.rankEmoji}
                      </Badge>
                    )}
                  </div>
                  <Typography
                    as={TypographyVariant.SMALL}
                    className="text-text-muted"
                  >
                    {entry.totalSwaps} swap{entry.totalSwaps !== 1 ? "s" : ""}{" "}
                    completed
                  </Typography>
                </div>

                <div className="text-right">
                  <Typography
                    as={TypographyVariant.P}
                    className="font-bold text-success"
                  >
                    {formatCarbonSavings(entry.carbonSaved)}
                  </Typography>
                  <Typography
                    as={TypographyVariant.SMALL}
                    className="text-text-muted"
                  >
                    CO₂ saved
                  </Typography>

                  {entry.rank <= 3 && (
                    <Typography
                      as={TypographyVariant.SMALL}
                      className="text-success/70 font-medium"
                    >
                      {(() => {
                        const offset = getOffsetComparison(entry.carbonSaved);
                        return `= ${offset.carRides} car rides`;
                      })()}
                    </Typography>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FontAwesomeIcon
              icon={faLeaf}
              className="w-12 h-12 text-text-muted/50 mb-4"
            />
            <Typography
              as={TypographyVariant.P}
              className="text-text-muted mb-2"
            >
              No environmental data available
            </Typography>
            <Typography
              as={TypographyVariant.P}
              className="text-sm text-text-muted"
            >
              Start swapping to see your impact!
            </Typography>
          </div>
        )}

        {leaderboard.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border/30">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <Typography
                  as={TypographyVariant.P}
                  className="text-2xl font-bold text-success"
                >
                  {formatCarbonSavings(
                    leaderboard.reduce(
                      (total, entry) => total + entry.carbonSaved,
                      0
                    )
                  )}
                </Typography>
                <Typography
                  as={TypographyVariant.SMALL}
                  className="text-text-muted"
                >
                  Total CO₂ saved
                </Typography>
              </div>
              <div>
                <Typography
                  as={TypographyVariant.P}
                  className="text-2xl font-bold text-accent"
                >
                  {leaderboard.reduce(
                    (total, entry) => total + entry.totalSwaps,
                    0
                  )}
                </Typography>
                <Typography
                  as={TypographyVariant.SMALL}
                  className="text-text-muted"
                >
                  Total swaps
                </Typography>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
export default EnvironmentalLeaderboard;

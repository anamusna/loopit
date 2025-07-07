"use client";
import {
  calculateProfileCompleteness,
  calculateTrustScore,
} from "@/constants/badges";
import { useLoopItStore } from "@/store";
import Badge, { BadgeVariant } from "@/tailwind/components/elements/Badge";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Card, { CardBody, CardHeader } from "@/tailwind/components/layout/Card";
import {
  faAward,
  faCalendarAlt,
  faChartLine,
  faLeaf,
  faStar,
  faTrophy,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo } from "react";
export interface AnalyticsDashboardProps {
  className?: string;
}
const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  className = "",
}) => {
  const { user } = useLoopItStore();
  const analytics = useMemo(() => {
    if (!user) return null;
    const accountAge = Math.floor(
      (Date.now() - new Date(user.joinedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    const profileCompleteness = calculateProfileCompleteness(user);
    const verificationStatus =
      (user.security?.emailVerified ? 0.5 : 0) +
      (user.security?.phoneVerified ? 0.5 : 0);
    const trustScoreFactors = {
      successfulSwaps: user.stats?.successfulSwaps || 0,
      averageRating: user.stats?.rating || 0,
      reviewCount: user.stats?.reviewCount || 0,
      profileCompleteness,
      communityParticipation: user.stats?.eventsAttended || 0,
      accountAge,
      verificationStatus,
    };
    const trustScore = calculateTrustScore(trustScoreFactors);
    const carbonSaved = (user.stats?.successfulSwaps || 0) * 4; 
    const moneySaved = (user.stats?.successfulSwaps || 0) * 25; 
    return {
      trustScore: Math.round(trustScore * 100),
      profileCompleteness,
      carbonSaved,
      moneySaved,
      accountAge,
      verificationStatus,
      trustScoreFactors,
    };
  }, [user]);
  if (!user || !analytics) {
    return (
      <Card className={className}>
        <CardBody>
          <Typography as={TypographyVariant.P} className="text-text-muted">
            No analytics data available
          </Typography>
        </CardBody>
      </Card>
    );
  }
  const formatJoinDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };
  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };
  const getTrustScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };
  return (
    <div className={`space-y-6 ${className}`}>
      {}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon
            icon={faChartLine}
            className="w-6 h-6 text-primary"
          />
          <Typography as={TypographyVariant.H3} className="font-bold">
            Your Impact Dashboard
          </Typography>
        </div>
        <Badge variant={BadgeVariant.PRIMARY} className="text-xs">
          Member since {formatJoinDate(user.joinedAt)}
        </Badge>
      </div>
      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardBody className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-primary" />
              <Typography
                as={TypographyVariant.H4}
                className={`text-2xl font-bold ${getTrustScoreColor(
                  analytics.trustScore
                )}`}
              >
                {analytics.trustScore}%
              </Typography>
            </div>
            <Typography
              as={TypographyVariant.P}
              className="text-sm text-text-muted mb-1"
            >
              Trust Score
            </Typography>
            <Typography
              as={TypographyVariant.SMALL}
              className={`text-xs font-medium ${getTrustScoreColor(
                analytics.trustScore
              )}`}
            >
              {getTrustScoreLabel(analytics.trustScore)}
            </Typography>
          </CardBody>
        </Card>
        {}
        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardBody className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FontAwesomeIcon icon={faLeaf} className="w-4 h-4 text-success" />
              <Typography
                as={TypographyVariant.H4}
                className="text-2xl font-bold text-success"
              >
                {analytics.carbonSaved}kg
              </Typography>
            </div>
            <Typography
              as={TypographyVariant.P}
              className="text-sm text-text-muted mb-1"
            >
              CO₂ Saved
            </Typography>
            <Typography
              as={TypographyVariant.SMALL}
              className="text-xs text-success font-medium"
            >
              Environmental Impact
            </Typography>
          </CardBody>
        </Card>
        {}
        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardBody className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FontAwesomeIcon
                icon={faTrophy}
                className="w-4 h-4 text-warning"
              />
              <Typography
                as={TypographyVariant.H4}
                className="text-2xl font-bold text-warning"
              >
                ${analytics.moneySaved}
              </Typography>
            </div>
            <Typography
              as={TypographyVariant.P}
              className="text-sm text-text-muted mb-1"
            >
              Money Saved
            </Typography>
            <Typography
              as={TypographyVariant.SMALL}
              className="text-xs text-warning font-medium"
            >
              Through Swapping
            </Typography>
          </CardBody>
        </Card>
        {}
        <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <CardBody className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-accent" />
              <Typography
                as={TypographyVariant.H4}
                className="text-2xl font-bold text-accent"
              >
                {user.stats?.eventsAttended || 0}
              </Typography>
            </div>
            <Typography
              as={TypographyVariant.P}
              className="text-sm text-text-muted mb-1"
            >
              Events Attended
            </Typography>
            <Typography
              as={TypographyVariant.SMALL}
              className="text-xs text-accent font-medium"
            >
              Community Engagement
            </Typography>
          </CardBody>
        </Card>
      </div>
      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {}
        <Card>
          <CardHeader>
            <Typography as={TypographyVariant.H4} className="font-semibold">
              Activity Statistics
            </Typography>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <Typography
                  as={TypographyVariant.H5}
                  className="text-xl font-bold text-primary"
                >
                  {user.stats?.itemsListed || 0}
                </Typography>
                <Typography
                  as={TypographyVariant.SMALL}
                  className="text-text-muted"
                >
                  Items Listed
                </Typography>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <Typography
                  as={TypographyVariant.H5}
                  className="text-xl font-bold text-success"
                >
                  {user.stats?.successfulSwaps || 0}
                </Typography>
                <Typography
                  as={TypographyVariant.SMALL}
                  className="text-text-muted"
                >
                  Successful Swaps
                </Typography>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <Typography
                  as={TypographyVariant.H5}
                  className="text-xl font-bold text-warning"
                >
                  {user.stats?.rating || 0}/5
                </Typography>
                <Typography
                  as={TypographyVariant.SMALL}
                  className="text-text-muted"
                >
                  Average Rating
                </Typography>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <Typography
                  as={TypographyVariant.H5}
                  className="text-xl font-bold text-accent"
                >
                  {user.stats?.reviewCount || 0}
                </Typography>
                <Typography
                  as={TypographyVariant.SMALL}
                  className="text-text-muted"
                >
                  Reviews Received
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>
        {}
        <Card>
          <CardHeader>
            <Typography as={TypographyVariant.H4} className="font-semibold">
              Profile Completeness
            </Typography>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Typography as={TypographyVariant.P} className="text-sm">
                  Profile Completion
                </Typography>
                <Typography
                  as={TypographyVariant.P}
                  className="text-sm font-medium"
                >
                  {analytics.profileCompleteness}%
                </Typography>
              </div>
              <div className="w-full bg-secondary/20 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${analytics.profileCompleteness}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="w-4 h-4 text-text-muted"
                />
                <Typography as={TypographyVariant.SMALL} className="text-sm">
                  Member for {analytics.accountAge} days
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faAward}
                  className="w-4 h-4 text-text-muted"
                />
                <Typography as={TypographyVariant.SMALL} className="text-sm">
                  {user.badges?.length || 0} badges earned
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      {}
      <Card className="bg-gradient-to-r from-success/5 to-accent/5 border-success/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faLeaf} className="w-5 h-5 text-success" />
            <Typography as={TypographyVariant.H4} className="font-semibold">
              Environmental Impact
            </Typography>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-success/10 rounded-lg">
              <Typography
                as={TypographyVariant.H5}
                className="text-lg font-bold text-success mb-1"
              >
                {analytics.carbonSaved}kg CO₂
              </Typography>
              <Typography
                as={TypographyVariant.SMALL}
                className="text-text-muted"
              >
                Carbon emissions saved
              </Typography>
            </div>
            <div className="text-center p-4 bg-accent/10 rounded-lg">
              <Typography
                as={TypographyVariant.H5}
                className="text-lg font-bold text-accent mb-1"
              >
                {user.stats?.successfulSwaps || 0}
              </Typography>
              <Typography
                as={TypographyVariant.SMALL}
                className="text-text-muted"
              >
                Items diverted from landfill
              </Typography>
            </div>
            <div className="text-center p-4 bg-warning/10 rounded-lg">
              <Typography
                as={TypographyVariant.H5}
                className="text-lg font-bold text-warning mb-1"
              >
                ${analytics.moneySaved}
              </Typography>
              <Typography
                as={TypographyVariant.SMALL}
                className="text-text-muted"
              >
                Money saved through swapping
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
export default AnalyticsDashboard;

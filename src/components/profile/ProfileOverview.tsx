"use client";
import {
  calculateProfileCompleteness,
  calculateTrustScore,
  getBadgeProgress,
} from "@/constants/badges";
import { SubscriptionTier } from "@/shared/types";
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
import Modal, { ModalSize } from "@/tailwind/components/layout/Modal";
import {
  faCalendarAlt,
  faChartLine,
  faEdit,
  faMapMarkerAlt,
  faStar,
  faTrophy,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo, useState } from "react";
import AnalyticsDashboard from "./AnalyticsDashboard";
import ProfileEdit from "./ProfileEdit";
export interface ProfileOverviewProps {
  className?: string;
}
export const ProfileOverview: React.FC<ProfileOverviewProps> = ({
  className = "",
}) => {
  const { user } = useLoopItStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };
  const handleEditSave = () => {
    setIsEditModalOpen(false);
  };
  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };
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
    const badgeProgress = getBadgeProgress(user);
    const earnedBadges = badgeProgress.filter((badge) => badge.eligible);
    const carbonSaved = (user.stats?.successfulSwaps || 0) * 4; 
    return {
      trustScore: Math.round(trustScore * 100),
      profileCompleteness,
      earnedBadges,
      badgeProgress,
      carbonSaved,
      accountAge,
      verificationStatus,
      trustScoreFactors,
    };
  }, [user]);
  if (!user) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <Typography as={TypographyVariant.P} className="text-text-muted">
          No user profile available
        </Typography>
      </div>
    );
  }
  const formatJoinDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };
  return (
    <div className="w-full space-y-6">
      <div
        className={`bg-gradient-to-br from-card via-card to-card/50 rounded-xl border border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
      >
        {}
        <div className="relative bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-6 border-b border-border/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary-rgb),0.1),transparent_50%)]" />
          <div className="relative flex flex-col sm:flex-row items-center gap-6">
            {}
            <div className="relative">
              <Avatar
                src={user.avatar}
                alt={user.name}
                initials={user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
                size={AvatarSize.XL}
                className="ring-4 ring-background/50 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
                <div className="w-2 h-2 bg-success-foreground rounded-full" />
              </div>
            </div>
            {}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Typography
                    as={TypographyVariant.H2}
                    className="text-2xl font-bold text-text-primary"
                  >
                    {user.name}
                  </Typography>
                  {}
                  {user.security?.emailVerified && (
                    <Badge variant={BadgeVariant.SUCCESS} className="text-xs">
                      ✓ Email
                    </Badge>
                  )}
                  {user.security?.phoneVerified && (
                    <Badge variant={BadgeVariant.SUCCESS} className="text-xs">
                      ✓ Phone
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <div className="flex items-center gap-1 text-warning">
                    <FontAwesomeIcon icon={faStar} className="w-4 h-4" />
                    <span className="font-medium text-sm">
                      {user.stats?.rating || 0}/5
                    </span>
                  </div>
                  <span className="text-text-muted text-sm">
                    ({user.stats?.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-text-secondary">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="w-4 h-4 text-text-muted"
                  />
                  <span className="text-sm">{user.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="w-4 h-4 text-text-muted"
                  />
                  <span className="text-sm">
                    Member since {formatJoinDate(user.joinedAt)}
                  </span>
                </div>
              </div>
              {user.bio && (
                <Typography
                  as={TypographyVariant.P}
                  className="text-text-secondary italic max-w-md"
                >
                  &ldquo;{user.bio}&rdquo;
                </Typography>
              )}
            </div>
            {}
            <div className="flex flex-col gap-2">
              <Button
                variant={ButtonVariant.OUTLINE}
                size={ButtonSize.SM}
                onClick={handleEditClick}
                className="group hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
              >
                <FontAwesomeIcon
                  icon={faEdit}
                  className="w-4 h-4 mr-2 group-hover:text-primary transition-colors"
                />
                Edit Profile
              </Button>
              <Button
                variant={ButtonVariant.OUTLINE}
                size={ButtonSize.SM}
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="group hover:bg-accent/10 hover:border-accent/30 transition-all duration-200"
              >
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="w-4 h-4 mr-2 group-hover:text-accent transition-colors"
                />
                {showAnalytics ? "Hide Analytics" : "Show Analytics"}
              </Button>
            </div>
          </div>
        </div>
        {}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6">
          <div className="text-center p-4 bg-background/50 rounded-lg border border-border/30">
            <Typography
              as={TypographyVariant.H3}
              className="text-2xl font-bold text-primary mb-1"
            >
              {user.stats?.itemsListed || 0}
            </Typography>
            <Typography
              as={TypographyVariant.P}
              className="text-sm text-text-muted"
            >
              Items Listed
            </Typography>
          </div>
          <div className="text-center p-4 bg-background/50 rounded-lg border border-border/30">
            <Typography
              as={TypographyVariant.H3}
              className="text-2xl font-bold text-success mb-1"
            >
              {user.stats?.successfulSwaps || 0}
            </Typography>
            <Typography
              as={TypographyVariant.P}
              className="text-sm text-text-muted"
            >
              Successful Swaps
            </Typography>
          </div>
          <div className="text-center p-4 bg-background/50 rounded-lg border border-border/30">
            <Typography
              as={TypographyVariant.H3}
              className="text-2xl font-bold text-accent mb-1"
            >
              {Math.round(user.trustScore * 100) || 0}%
            </Typography>
            <Typography
              as={TypographyVariant.P}
              className="text-sm text-text-muted"
            >
              Trust Score
            </Typography>
          </div>
          <div className="text-center p-4 bg-background/50 rounded-lg border border-border/30">
            <Typography
              as={TypographyVariant.H3}
              className="text-2xl font-bold text-info mb-1"
            >
              {user.stats?.eventsAttended || 0}
            </Typography>
            <Typography
              as={TypographyVariant.P}
              className="text-sm text-text-muted"
            >
              Events Attended
            </Typography>
          </div>
        </div>
        {}
        <div className="px-6 pb-6 space-y-4">
          {}
          {user.badges && user.badges.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FontAwesomeIcon
                  icon={faTrophy}
                  className="w-4 h-4 text-warning"
                />
                <Typography
                  as={TypographyVariant.H4}
                  className="font-semibold text-text-primary"
                >
                  Achievements
                </Typography>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge, index) => (
                  <Badge
                    key={index}
                    variant={BadgeVariant.SUCCESS}
                    className="text-xs px-3 py-1"
                  >
                    {badge.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {}
          {user.interests && user.interests.length > 0 && (
            <div>
              <Typography
                as={TypographyVariant.H4}
                className="font-semibold text-text-primary mb-3"
              >
                Interests
              </Typography>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <Badge
                    key={index}
                    variant={BadgeVariant.SECONDARY}
                    className="text-xs px-3 py-1"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {}
          <div className="flex items-center justify-between pt-4 border-t border-border/30">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faUser}
                className="w-4 h-4 text-text-muted"
              />
              <Typography
                as={TypographyVariant.P}
                className="text-sm text-text-secondary"
              >
                Subscription Plan:
              </Typography>
            </div>
            {user.subscription && (
              <Badge
                variant={
                  user.subscription.tier === SubscriptionTier.PREMIUM
                    ? BadgeVariant.PRIMARY
                    : user.subscription.tier === SubscriptionTier.BASIC
                    ? BadgeVariant.SECONDARY
                    : BadgeVariant.DEFAULT
                }
                className="text-xs px-3 py-1 font-medium"
              >
                {user.subscription.tier}
              </Badge>
            )}
          </div>
        </div>
      </div>
      {}
      {showAnalytics && <AnalyticsDashboard className="mt-6" />}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleEditCancel}
        size={ModalSize.FULL}
        className="w-full mx-auto"
        title="Edit Profile"
      >
        <div className="bg-card rounded-lg shadow-xl border border-border overflow-hidden">
          <div className="max-h-[calc(85vh-120px)] overflow-y-auto">
            <div className="p-0">
              <ProfileEdit
                onSave={handleEditSave}
                onCancel={handleEditCancel}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default ProfileOverview;

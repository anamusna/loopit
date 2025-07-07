"use client";
import { useLoopItStore } from "@/store";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Toggle from "@/tailwind/components/forms/Toggle";
import Card, { CardBody, CardHeader } from "@/tailwind/components/layout/Card";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faHeart,
  faMapMarkerAlt,
  faPhone,
  faShieldAlt,
  faStar,
  faTrophy,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useState } from "react";
export interface PrivacySettingsProps {
  className?: string;
}
const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  className = "",
}) => {
  const { user, updateProfile } = useLoopItStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [privacySettings, setPrivacySettings] = useState({
    showProfile: user?.preferences?.publicProfile ?? true,
    showLocation: user?.preferences?.showLocation ?? true,
    showStats: true,
    showReviews: true,
    showBadges: true,
    showInterests: true,
    showBio: true,
    showEmail: false,
    showPhone: false,
  });
  const handleToggleChange = useCallback(
    (
      setting: keyof typeof privacySettings,
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setPrivacySettings((prev) => ({
        ...prev,
        [setting]: event.target.checked,
      }));
    },
    []
  );
  const handleSaveSettings = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      await updateProfile({
        preferences: {
          ...user.preferences,
          publicProfile: privacySettings.showProfile,
          showLocation: privacySettings.showLocation,
        },
      });
      console.log("Privacy settings updated:", privacySettings);
    } catch (err) {
      setError("Failed to update privacy settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [user, updateProfile, privacySettings]);
  const handleResetToDefaults = useCallback(() => {
    setPrivacySettings({
      showProfile: true,
      showLocation: true,
      showStats: true,
      showReviews: true,
      showBadges: true,
      showInterests: true,
      showBio: true,
      showEmail: false,
      showPhone: false,
    });
  }, []);
  if (!user) {
    return (
      <Card className={className}>
        <CardBody>
          <Typography as={TypographyVariant.P} className="text-text-muted">
            No user profile available
          </Typography>
        </CardBody>
      </Card>
    );
  }
  const privacyOptions = [
    {
      key: "showProfile" as const,
      title: "Public Profile",
      description: "Allow other users to view your profile",
      icon: faUser,
      category: "Profile",
    },
    {
      key: "showLocation" as const,
      title: "Show Location",
      description: "Display your city/region to other users",
      icon: faMapMarkerAlt,
      category: "Profile",
    },
    {
      key: "showStats" as const,
      title: "Show Statistics",
      description: "Display your swap statistics and achievements",
      icon: faShieldAlt,
      category: "Activity",
    },
    {
      key: "showReviews" as const,
      title: "Show Reviews",
      description: "Allow others to see reviews you've received",
      icon: faStar,
      category: "Activity",
    },
    {
      key: "showBadges" as const,
      title: "Show Badges",
      description: "Display your earned badges and achievements",
      icon: faTrophy,
      category: "Activity",
    },
    {
      key: "showInterests" as const,
      title: "Show Interests",
      description: "Display your interests and hobbies",
      icon: faHeart,
      category: "Profile",
    },
    {
      key: "showBio" as const,
      title: "Show Bio",
      description: "Display your personal bio and description",
      icon: faUser,
      category: "Profile",
    },
    {
      key: "showEmail" as const,
      title: "Show Email",
      description: "Allow others to see your email address",
      icon: faEnvelope,
      category: "Contact",
    },
    {
      key: "showPhone" as const,
      title: "Show Phone",
      description: "Allow others to see your phone number",
      icon: faPhone,
      category: "Contact",
    },
  ];
  const groupedOptions = privacyOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, typeof privacyOptions>);
  return (
    <div className={`space-y-6 ${className}`}>
      {}
      <div className="flex items-center gap-3">
        <FontAwesomeIcon icon={faShieldAlt} className="w-6 h-6 text-primary" />
        <Typography as={TypographyVariant.H3} className="font-bold">
          Privacy Settings
        </Typography>
      </div>
      {}
      <Card className="bg-info/5 border-info/20">
        <CardBody>
          <Typography as={TypographyVariant.P} className="text-sm text-info">
            Control who can see different parts of your profile. These settings
            help you maintain privacy while still connecting with the community.
          </Typography>
        </CardBody>
      </Card>
      {}
      <div className="space-y-6">
        {Object.entries(groupedOptions).map(([category, options]) => (
          <Card key={category}>
            <CardHeader>
              <Typography as={TypographyVariant.H4} className="font-semibold">
                {category}
              </Typography>
            </CardHeader>
            <CardBody className="space-y-4">
              {options.map((option) => (
                <div
                  key={option.key}
                  className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/30"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                      <FontAwesomeIcon
                        icon={option.icon}
                        className="w-4 h-4 text-primary"
                      />
                    </div>
                    <div className="flex-1">
                      <Typography
                        as={TypographyVariant.P}
                        className="font-medium text-text-primary"
                      >
                        {option.title}
                      </Typography>
                      <Typography
                        as={TypographyVariant.SMALL}
                        className="text-text-muted"
                      >
                        {option.description}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={privacySettings[option.key] ? faEye : faEyeSlash}
                      className={`w-4 h-4 ${
                        privacySettings[option.key]
                          ? "text-success"
                          : "text-text-muted"
                      }`}
                    />
                    <Toggle
                      checked={privacySettings[option.key]}
                      onChange={(event) =>
                        handleToggleChange(option.key, event)
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        ))}
      </div>
      {}
      {error && (
        <Card className="bg-destructive/5 border-destructive/20">
          <CardBody>
            <Typography as={TypographyVariant.P} className="text-destructive">
              {error}
            </Typography>
          </CardBody>
        </Card>
      )}
      {}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
        <Button
          variant={ButtonVariant.OUTLINE}
          size={ButtonSize.LG}
          onClick={handleResetToDefaults}
          disabled={isLoading}
          className="flex-1 sm:flex-none"
        >
          Reset to Defaults
        </Button>
        <Button
          variant={ButtonVariant.PRIMARY}
          size={ButtonSize.LG}
          onClick={handleSaveSettings}
          disabled={isLoading}
          isLoading={isLoading}
          className="flex-1 sm:flex-none"
        >
          {isLoading ? "Saving..." : "Save Privacy Settings"}
        </Button>
      </div>
      {}
      <Card className="bg-warning/5 border-warning/20">
        <CardBody>
          <Typography as={TypographyVariant.H5} className="font-semibold mb-2">
            Privacy Tips
          </Typography>
          <ul className="space-y-1 text-sm text-text-muted">
            <li>• Sharing your location helps with local swaps</li>
            <li>• Reviews and badges build trust in the community</li>
            <li>• Keep contact information private for security</li>
            <li>• You can change these settings anytime</li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
};
export default PrivacySettings;

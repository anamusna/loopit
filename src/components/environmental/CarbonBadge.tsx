"use client";
import { getOffsetComparison } from "@/constants/environmentalImpact";
import { Item } from "@/shared/types";
import Badge, { BadgeVariant } from "@/tailwind/components/elements/Badge";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import {
  calculateItemCarbonSavings,
  formatCarbonSavings,
  getImpactLevelStyling,
} from "@/utils/environmentalHelpers";
import React, { useMemo } from "react";
export interface CarbonBadgeProps {
  item: Item;
  showTooltip?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}
export const CarbonBadge: React.FC<CarbonBadgeProps> = ({
  item,
  showTooltip = true,
  size = "md",
  className = "",
}) => {
  const carbonSaved = useMemo(() => {
    return calculateItemCarbonSavings(item);
  }, [item]);
  const impactStyling = useMemo(() => {
    return getImpactLevelStyling(carbonSaved);
  }, [carbonSaved]);
  const formattedCarbon = useMemo(() => {
    return formatCarbonSavings(carbonSaved);
  }, [carbonSaved]);
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };
  if (carbonSaved <= 0) {
    return null;
  }
  const badgeContent = (
    <div className="flex items-center gap-1.5">
      <span className={iconSizes[size]}>{impactStyling.icon}</span>
      <Typography
        as={TypographyVariant.SPAN}
        className={`font-medium ${sizeClasses[size]}`}
      >
        Saved {formattedCarbon}
      </Typography>
    </div>
  );
  if (showTooltip) {
    return (
      <div className="group relative">
        <Badge
          variant={BadgeVariant.SUCCESS}
          className={`${sizeClasses[size]} ${impactStyling.bgColor} ${impactStyling.borderColor} ${className}`}
        >
          {badgeContent}
        </Badge>

        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-background border border-border rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 min-w-[280px] max-w-[320px]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{impactStyling.icon}</span>
              <Typography
                as={TypographyVariant.P}
                className="text-sm font-bold text-text-primary"
              >
                Environmental Impact
              </Typography>
            </div>
            <div className="space-y-1">
              <Typography
                as={TypographyVariant.P}
                className="text-sm text-text-primary font-medium"
              >
                This item saves {formattedCarbon} of CO₂ emissions
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-xs text-text-muted"
              >
                compared to buying new
              </Typography>
            </div>

            {(() => {
              const offset = getOffsetComparison(carbonSaved);
              const primaryComparison =
                offset.carRides > 1
                  ? `Equivalent to skipping ${offset.carRides} car rides`
                  : `Equivalent to powering a home for ${offset.homeDays} days`;
              return (
                <div className="pt-2 border-t border-border/30">
                  <Typography
                    as={TypographyVariant.P}
                    className="text-xs text-success font-medium"
                  >
                    💚 {primaryComparison}
                  </Typography>
                </div>
              );
            })()}
          </div>

          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-border" />
        </div>
      </div>
    );
  }
  return (
    <Badge
      variant={BadgeVariant.SUCCESS}
      className={`${sizeClasses[size]} ${impactStyling.bgColor} ${impactStyling.borderColor} ${className}`}
    >
      {badgeContent}
    </Badge>
  );
};
export default CarbonBadge;

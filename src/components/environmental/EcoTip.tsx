"use client";
import { ItemCategory } from "@/shared/types";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Card, { CardBody, CardHeader } from "@/tailwind/components/layout/Card";
import { getContextualEcoTip } from "@/utils/environmentalHelpers";
import {
  faLightbulb,
  faRefresh,
  faSeedling,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useState } from "react";
export interface EcoTipProps {
  category?: ItemCategory;
  className?: string;
  showRefreshButton?: boolean;
  autoRotate?: boolean;
  rotationInterval?: number;
}
export const EcoTip: React.FC<EcoTipProps> = ({
  category,
  className = "",
  showRefreshButton = true,
  autoRotate = false,
  rotationInterval = 30000,
}) => {
  const [currentTip, setCurrentTip] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const generateTip = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const tip = getContextualEcoTip(category);
      setCurrentTip(tip);
      setIsLoading(false);
    }, 300);
  }, [category]);
  useEffect(() => {
    generateTip();
  }, [generateTip]);
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      generateTip();
    }, rotationInterval);
    return () => clearInterval(interval);
  }, [autoRotate, rotationInterval, generateTip]);
  const handleRefresh = useCallback(() => {
    generateTip();
  }, [generateTip]);
  return (
    <Card
      className={`bg-gradient-to-br from-info/5 to-accent/5 border-info/20 ${className}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon
                icon={faLightbulb}
                className="w-5 h-5 text-info"
              />
            </div>
            <div>
              <Typography as={TypographyVariant.H4} className="font-semibold">
                Eco Tip
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-sm text-text-muted"
              >
                {category ? `Tips for ${category}` : "Environmental wisdom"}
              </Typography>
            </div>
          </div>
          {showRefreshButton && (
            <Button
              variant={ButtonVariant.OUTLINE}
              size={ButtonSize.SM}
              onClick={handleRefresh}
              disabled={isLoading}
              className="text-info border-info/30 hover:bg-info/10"
            >
              <FontAwesomeIcon
                icon={faRefresh}
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "Loading..." : "New Tip"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 bg-info/20 rounded animate-pulse" />
            <div className="h-4 bg-info/20 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-info/20 rounded w-1/2 animate-pulse" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <FontAwesomeIcon
                  icon={faSeedling}
                  className="w-4 h-4 text-success"
                />
              </div>
              <div className="flex-1">
                <Typography
                  as={TypographyVariant.P}
                  className="text-text-primary leading-relaxed"
                >
                  {currentTip}
                </Typography>
              </div>
            </div>

            {category && (
              <div className="flex items-center gap-2 pt-2 border-t border-info/20">
                <Typography
                  as={TypographyVariant.SMALL}
                  className="text-info font-medium"
                >
                  💡 Tip for {category} items
                </Typography>
              </div>
            )}

            {autoRotate && (
              <div className="flex items-center gap-2 pt-2 border-t border-info/20">
                <Typography
                  as={TypographyVariant.SMALL}
                  className="text-text-muted"
                >
                  🔄 Tips rotate every {Math.round(rotationInterval / 1000)}s
                </Typography>
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
export default EcoTip;

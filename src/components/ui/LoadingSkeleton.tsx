"use client";
import clsx from "clsx";
import React from "react";
export interface LoadingSkeletonProps {
  viewMode: "grid" | "list";
  itemCount?: number;
  className?: string;
}
const LoadingSkeleton: React.FC<LoadingSkeletonProps> = React.memo(
  ({ viewMode, itemCount = viewMode === "list" ? 6 : 24, className = "" }) => {
    if (viewMode === "list") {
      return (
        <div className={clsx("space-y-4", className)}>
          {Array.from({ length: itemCount }).map((_, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-6 animate-pulse"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-secondary/30 rounded" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-secondary/30 rounded w-3/4" />
                  <div className="h-3 bg-secondary/30 rounded w-1/2" />
                  <div className="h-3 bg-secondary/30 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div
        className={clsx(
          "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4",
          className
        )}
      >
        {Array.from({ length: itemCount }).map((_, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-secondary/30" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-secondary/30 rounded w-full" />
              <div className="h-3 bg-secondary/30 rounded w-3/4" />
              <div className="h-3 bg-secondary/30 rounded w-1/2" />
              <div className="h-8 bg-secondary/30 rounded w-full mt-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }
);
LoadingSkeleton.displayName = "LoadingSkeleton";
export default LoadingSkeleton;

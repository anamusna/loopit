"use client";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import Icon, { IconColor, IconSize } from "@/tailwind/components/elements/Icon";
import Card from "@/tailwind/components/layout/Card";
import {
  faCheck,
  faCog,
  faExchangeAlt,
  faHeart,
  faHome,
  faInfo,
  faLeaf,
  faMoon,
  faPalette,
  faRecycle,
  faSearch,
  faStar,
  faSun,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { memo, useMemo } from "react";
interface ThemeDemoProps {
  className?: string;
}
const colorSections = [
  {
    title: "Brand Colors",
    description: "Deep green primary and teal accent colors for LoopIt",
    items: [
      {
        name: "Primary",
        cssVar: "--primary",
        description: "Deep green for trust & sustainability",
      },
      {
        name: "Primary Hover",
        cssVar: "--primary-hover",
        description: "Darker on interaction",
      },
      {
        name: "Accent",
        cssVar: "--accent",
        description: "Bright teal for energy & CTAs",
      },
      {
        name: "Accent Hover",
        cssVar: "--accent-hover",
        description: "Darker teal on hover",
      },
    ],
  },
  {
    title: "Background System",
    description: "Warm backgrounds that adapt to light and dark themes",
    items: [
      {
        name: "Background",
        cssVar: "--background",
        description: "Main page background",
      },
      { name: "Card", cssVar: "--card", description: "Elevated surfaces" },
      {
        name: "Muted",
        cssVar: "--muted",
        description: "Containers & sections",
      },
      {
        name: "Footer",
        cssVar: "--footer",
        description: "Deeper neutral areas",
      },
    ],
  },
  {
    title: "Text Hierarchy",
    description: "Typography colors for different content priorities",
    items: [
      {
        name: "Text Primary",
        cssVar: "--text-primary",
        description: "Main content text",
      },
      {
        name: "Text Secondary",
        cssVar: "--text-secondary",
        description: "Supporting text",
      },
      {
        name: "Text Muted",
        cssVar: "--text-muted",
        description: "Placeholders & low-priority",
      },
      { name: "Link", cssVar: "--link", description: "Interactive links" },
    ],
  },
  {
    title: "Semantic Status",
    description: "Colors for different states and feedback",
    items: [
      {
        name: "Success",
        cssVar: "--success",
        description: "Successful swaps & confirmations",
      },
      {
        name: "Warning",
        cssVar: "--warning",
        description: "Cautions & alerts",
      },
      {
        name: "Destructive",
        cssVar: "--destructive",
        description: "Errors & dangerous actions",
      },
      {
        name: "Info",
        cssVar: "--info",
        description: "General information & tips",
      },
    ],
  },
];
const ColorSwatch = memo<{
  name: string;
  cssVar: string;
  description?: string;
}>(({ name, cssVar, description }) => {
  const swatchStyles = useMemo(
    () => ({
      backgroundColor: `var(${cssVar})`,
      border: "1px solid var(--border)",
    }),
    [cssVar]
  );
  return (
    <div className="flex items-center space-x-3 p-4 rounded-lg border bg-card hover:bg-muted transition-colors">
      <div className="w-12 h-12 rounded-lg shadow-sm" style={swatchStyles} />
      <div className="flex-1">
        <div className="font-medium text-text-primary">{name}</div>
        <div className="text-sm text-text-muted">{cssVar}</div>
        {description && (
          <div className="text-xs text-text-secondary mt-1">{description}</div>
        )}
      </div>
    </div>
  );
});
ColorSwatch.displayName = "ColorSwatch";
const ButtonShowcase = memo(() => {
  const buttonVariants = [
    { variant: ButtonVariant.PRIMARY, label: "Join LoopIt", icon: faLeaf },
    { variant: ButtonVariant.SECONDARY, label: "Browse Items", icon: faSearch },
    {
      variant: ButtonVariant.OUTLINE,
      label: "Start Swap",
      icon: faExchangeAlt,
    },
    { variant: ButtonVariant.GHOST, label: "View Profile", icon: faUser },
    { variant: ButtonVariant.DESTRUCTIVE, label: "Delete Item", icon: null },
    { variant: ButtonVariant.SUCCESS, label: "Swap Complete", icon: faCheck },
    { variant: ButtonVariant.WARNING, label: "Review Needed", icon: faInfo },
  ];
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-text-primary flex items-center">
        <Icon
          icon={faPalette}
          size={IconSize.MD}
          color={IconColor.PRIMARY}
          className="mr-2"
        />
        Button Variants for LoopIt
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {buttonVariants.map(({ variant, label, icon }) => (
          <Button
            key={variant}
            variant={variant}
            size={ButtonSize.MD}
            className="flex items-center justify-center"
          >
            {icon && <Icon icon={icon} size={IconSize.SM} className="mr-2" />}
            {label}
          </Button>
        ))}
      </div>
    </Card>
  );
});
ButtonShowcase.displayName = "ButtonShowcase";
const IconShowcase = memo(() => {
  const iconExamples = [
    { icon: faLeaf, color: IconColor.PRIMARY, label: "Sustainability" },
    { icon: faExchangeAlt, color: IconColor.ACCENT, label: "Swapping" },
    { icon: faRecycle, color: IconColor.SUCCESS, label: "Reuse" },
    { icon: faUser, color: IconColor.SECONDARY, label: "Community" },
    { icon: faHome, color: IconColor.MUTED, label: "Local" },
    { icon: faHeart, color: IconColor.DESTRUCTIVE, label: "Favorites" },
    { icon: faStar, color: IconColor.WARNING, label: "Rating" },
    { icon: faInfo, color: IconColor.LINK, label: "Information" },
  ];
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-text-primary flex items-center">
        <Icon
          icon={faRecycle}
          size={IconSize.MD}
          color={IconColor.SUCCESS}
          className="mr-2"
        />
        LoopIt Icon System
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {iconExamples.map(({ icon, color, label }, index) => (
          <div
            key={index}
            className="flex flex-col items-center space-y-2 p-3 rounded-lg border bg-secondary hover:bg-muted transition-colors"
          >
            <Icon icon={icon} size={IconSize.LG} color={color} />
            <div className="text-xs text-center text-text-muted font-medium">
              {label}
            </div>
            <div className="text-xs text-center text-text-disabled">
              {color}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
});
IconShowcase.displayName = "IconShowcase";
const BackgroundShowcase = memo(() => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-text-primary flex items-center">
        <Icon
          icon={faPalette}
          size={IconSize.MD}
          color={IconColor.PRIMARY}
          className="mr-2"
        />
        Background System
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-background border">
            <div className="text-sm font-medium text-text-primary">
              Background
            </div>
            <div className="text-xs text-text-muted">Main page background</div>
          </div>
          <div className="p-4 rounded-lg bg-card border">
            <div className="text-sm font-medium text-text-primary">Card</div>
            <div className="text-xs text-text-muted">Elevated surfaces</div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-muted border">
            <div className="text-sm font-medium text-text-primary">Muted</div>
            <div className="text-xs text-text-muted">Containers & sections</div>
          </div>
          <div
            className="p-4 rounded-lg border"
            style={{ backgroundColor: "var(--footer)" }}
          >
            <div className="text-sm font-medium text-foreground">Footer</div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Deeper neutral areas
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});
BackgroundShowcase.displayName = "BackgroundShowcase";
const ThemeDemo = memo<ThemeDemoProps>(({ className = "" }) => {
  const { currentTheme, isDarkMode, toggleTheme } = useTheme();
  return (
    <div className={cn("space-y-8", className)}>
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-text-primary flex items-center justify-center">
          <Icon
            icon={faLeaf}
            size={IconSize.LG}
            color={IconColor.PRIMARY}
            className="mr-3"
          />
          LoopIt Theme System
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Professional, sustainable design with deep green primary and teal
          accent colors. Built for accessibility and community trust.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <span className="text-text-primary">
            Current Theme:{" "}
            <span className="font-semibold capitalize">{currentTheme}</span>
          </span>
          <Button
            onClick={toggleTheme}
            variant={ButtonVariant.OUTLINE}
            size={ButtonSize.MD}
            className="flex items-center"
          >
            <Icon
              icon={isDarkMode ? faSun : faMoon}
              size={IconSize.SM}
              color={IconColor.WARNING}
              className="mr-2"
            />
            Toggle Theme
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {colorSections.map((section) => (
          <Card key={section.title} className="p-6">
            <h3 className="text-lg font-semibold mb-2 text-text-primary">
              {section.title}
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              {section.description}
            </p>
            <div className="space-y-3">
              {section.items.map((item) => (
                <ColorSwatch
                  key={item.name}
                  name={item.name}
                  cssVar={item.cssVar}
                  description={item.description}
                />
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <ButtonShowcase />
        <IconShowcase />
        <BackgroundShowcase />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-text-primary flex items-center">
          <Icon
            icon={faCheck}
            size={IconSize.MD}
            color={IconColor.SUCCESS}
            className="mr-2"
          />
          LoopIt Theme Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Icon
                icon={faLeaf}
                size={IconSize.SM}
                color={IconColor.SUCCESS}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-text-primary">
                  Sustainable Design
                </div>
                <div className="text-sm text-text-secondary">
                  Green colors reinforce eco-consciousness
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Icon
                icon={faUser}
                size={IconSize.SM}
                color={IconColor.PRIMARY}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-text-primary">
                  Community Trust
                </div>
                <div className="text-sm text-text-secondary">
                  Professional appearance builds confidence
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Icon
                icon={faHeart}
                size={IconSize.SM}
                color={IconColor.DESTRUCTIVE}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-text-primary">
                  Accessible Design
                </div>
                <div className="text-sm text-text-secondary">
                  WCAG compliant contrast ratios
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Icon
                icon={faCog}
                size={IconSize.SM}
                color={IconColor.MUTED}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-text-primary">
                  Adaptive Themes
                </div>
                <div className="text-sm text-text-secondary">
                  Seamless light and dark mode support
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
});
ThemeDemo.displayName = "ThemeDemo";
export default ThemeDemo;

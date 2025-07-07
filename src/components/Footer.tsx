"use client";
import { useTheme } from "@/hooks/useTheme";
import { ICONS } from "@/lib/fontawesome";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { memo, useCallback } from "react";
interface FooterProps {
  className?: string;
}
const Footer = memo<FooterProps>(({ className = "" }) => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const handleNavigation = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );
  const currentYear = new Date().getFullYear();
  return (
    <footer
      className={`border-t border-border/20 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm ${className}`}
    >
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="py-4 sm:py-5 lg:py-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            <div className="col-span-2 lg:col-span-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <FontAwesomeIcon
                    icon={ICONS.REACT as IconProp}
                    className="text-lg sm:text-xl transition-all duration-200"
                    style={{ color: "var(--primary)" }}
                  />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg scale-150 opacity-60" />
                </div>
                <div className="flex flex-col">
                  <Typography
                    as={TypographyVariant.H3}
                    className="text-base sm:text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                  >
                    LoopIt
                  </Typography>
                  <Typography
                    as={TypographyVariant.P}
                    className="text-xs text-text-muted font-medium"
                  >
                    Community Swapping
                  </Typography>
                </div>
              </div>
              <Typography
                as={TypographyVariant.P}
                className="text-xs text-text-muted leading-relaxed max-w-xs"
              >
                Join the sustainable revolution. Swap, share, and build a
                greener future together.
              </Typography>

              <div className="pt-1">
                <div className="flex items-center gap-1.5">
                  {[
                    { icon: ICONS.TWITTER, label: "Twitter", href: "#" },
                    { icon: ICONS.INSTAGRAM, label: "Instagram", href: "#" },
                    { icon: ICONS.FACEBOOK, label: "Facebook", href: "#" },
                    { icon: ICONS.LINKEDIN, label: "LinkedIn", href: "#" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                      aria-label={social.label}
                    >
                      <FontAwesomeIcon
                        icon={social.icon as IconProp}
                        className="w-3 h-3 text-primary group-hover:text-primary/80 transition-colors duration-200"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Typography
                as={TypographyVariant.H4}
                className="text-sm font-bold text-text-primary"
              >
                Quick Links
              </Typography>
              <div className="space-y-1">
                {[
                  { label: "Browse Items", path: "/" },
                  { label: "How It Works", path: "/how-it-works" },
                  { label: "Safety Tips", path: "/safety" },
                  { label: "Success Stories", path: "/stories" },
                ].map((link) => (
                  <button
                    key={link.path}
                    onClick={() => handleNavigation(link.path)}
                    className="block text-xs text-text-muted hover:text-primary transition-colors duration-200 hover:translate-x-0.5 transform"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Typography
                as={TypographyVariant.H4}
                className="text-sm font-bold text-text-primary"
              >
                Support
              </Typography>
              <div className="space-y-1">
                {[
                  { label: "Help Center", path: "/help" },
                  { label: "Contact Us", path: "/contact" },
                  { label: "Report Issue", path: "/report" },
                  { label: "Community Guidelines", path: "/guidelines" },
                ].map((link) => (
                  <button
                    key={link.path}
                    onClick={() => handleNavigation(link.path)}
                    className="block text-xs text-text-muted hover:text-primary transition-colors duration-200 hover:translate-x-0.5 transform"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Typography
                as={TypographyVariant.H4}
                className="text-sm font-bold text-text-primary"
              >
                Legal
              </Typography>
              <div className="space-y-1">
                {[
                  { label: "Privacy Policy", path: "/privacy" },
                  { label: "Terms of Service", path: "/terms" },
                  { label: "Cookie Policy", path: "/cookies" },
                  { label: "GDPR", path: "/gdpr" },
                ].map((link) => (
                  <button
                    key={link.path}
                    onClick={() => handleNavigation(link.path)}
                    className="block text-xs text-text-muted hover:text-primary transition-colors duration-200 hover:translate-x-0.5 transform"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/20 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span>© {currentYear} LoopIt. All rights reserved.</span>
              <div className="hidden sm:block w-1 h-1 bg-text-muted rounded-full" />
              <span className="hidden sm:inline">Made with</span>
              <FontAwesomeIcon
                icon={ICONS.HEART as IconProp}
                className="w-3 h-3 hidden sm:inline text-red-500 animate-pulse"
              />
              <span className="hidden sm:inline">for the planet</span>
            </div>

            <div className="sm:hidden flex items-center gap-1.5 text-xs text-text-muted">
              <span>Made with</span>
              <FontAwesomeIcon
                icon={ICONS.HEART as IconProp}
                className="w-3 h-3 text-red-500 animate-pulse"
              />
              <span>for the planet</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});
Footer.displayName = "Footer";
export default Footer;

"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Card from "@/tailwind/components/layout/Card";
import {
  faArrowRight,
  faCog,
  faCookie,
  faFingerprint,
  faLock,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
const cookieTypes = [
  {
    icon: faLock,
    title: "Essential Cookies",
    description: "Required for basic site functionality and security",
    color: "text-primary",
  },
  {
    icon: faCog,
    title: "Functional Cookies",
    description: "Remember your preferences and settings",
    color: "text-success",
  },
  {
    icon: faFingerprint,
    title: "Analytics Cookies",
    description: "Help us understand how you use LoopIt",
    color: "text-warning",
  },
  {
    icon: faShieldAlt,
    title: "Security Cookies",
    description: "Protect your account and transactions",
    color: "text-info",
  },
];
const cookieDetails = [
  {
    title: "Essential Cookies",
    content: [
      {
        subtitle: "Authentication",
        details: [
          "Session management",
          "Login status",
          "Security tokens",
          "CSRF protection",
        ],
      },
      {
        subtitle: "Basic Functions",
        details: [
          "Shopping cart",
          "Page navigation",
          "Form submissions",
          "Error handling",
        ],
      },
    ],
  },
  {
    title: "Functional Cookies",
    content: [
      {
        subtitle: "Preferences",
        details: [
          "Language selection",
          "Theme settings",
          "Location preferences",
          "Search history",
        ],
      },
      {
        subtitle: "Personalization",
        details: [
          "Recently viewed items",
          "Custom filters",
          "Saved searches",
          "User preferences",
        ],
      },
    ],
  },
  {
    title: "Analytics Cookies",
    content: [
      {
        subtitle: "Usage Data",
        details: ["Page views", "Click patterns", "Time spent", "User journey"],
      },
      {
        subtitle: "Performance",
        details: [
          "Load times",
          "Error tracking",
          "Feature usage",
          "User behavior",
        ],
      },
    ],
  },
  {
    title: "Security Cookies",
    content: [
      {
        subtitle: "Protection",
        details: [
          "Fraud prevention",
          "Account security",
          "Suspicious activity",
          "Device verification",
        ],
      },
      {
        subtitle: "Compliance",
        details: [
          "Legal requirements",
          "Privacy standards",
          "Data protection",
          "Audit logs",
        ],
      },
    ],
  },
];
const lastUpdated = "January 1, 2024";
export default function Cookies() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 mb-16 sm:mb-20">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 border-b border-border/20">
          <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <FontAwesomeIcon
                  icon={faCookie}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm font-medium text-primary">
                  Cookie Policy
                </span>
              </div>
              <Typography
                as={TypographyVariant.H1}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4"
              >
                Cookie Policy
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-text-secondary text-lg sm:text-xl leading-relaxed mb-4"
              >
                Understanding how we use cookies to improve your experience
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-text-muted text-sm mb-8"
              >
                Last updated: {lastUpdated}
              </Typography>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cookieTypes.map((type, index) => (
                <Card
                  key={index}
                  className="group hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-background to-card flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                      <FontAwesomeIcon
                        icon={type.icon}
                        className={`w-8 h-8 ${type.color}`}
                      />
                    </div>
                    <Typography
                      as={TypographyVariant.H3}
                      className="text-lg font-bold text-text-primary mb-2"
                    >
                      {type.title}
                    </Typography>
                    <Typography
                      as={TypographyVariant.P}
                      className="text-text-secondary text-sm"
                    >
                      {type.description}
                    </Typography>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {cookieDetails.map((section, index) => (
                <div key={index} className="mb-12 last:mb-0">
                  <Typography
                    as={TypographyVariant.H2}
                    className="text-2xl sm:text-3xl font-bold text-text-primary mb-6"
                  >
                    {section.title}
                  </Typography>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {section.content.map((subsection, i) => (
                      <Card key={i} className="p-6">
                        <Typography
                          as={TypographyVariant.H3}
                          className="text-lg font-bold text-text-primary mb-4"
                        >
                          {subsection.subtitle}
                        </Typography>
                        <ul className="space-y-3">
                          {subsection.details.map((detail, j) => (
                            <li key={j} className="flex items-start gap-3">
                              <FontAwesomeIcon
                                icon={faCookie}
                                className="w-4 h-4 text-primary flex-shrink-0 mt-1"
                              />
                              <Typography
                                as={TypographyVariant.P}
                                className="text-text-secondary"
                              >
                                {detail}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 border-none">
              <div className="p-8 sm:p-12 text-center">
                <div className="max-w-2xl mx-auto">
                  <Typography
                    as={TypographyVariant.H2}
                    className="text-2xl sm:text-3xl font-bold text-text-primary mb-4"
                  >
                    Manage Your Cookie Preferences
                  </Typography>
                  <Typography
                    as={TypographyVariant.P}
                    className="text-text-secondary mb-8"
                  >
                    You can customize which cookies you allow us to use
                  </Typography>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant={ButtonVariant.PRIMARY}
                      size={ButtonSize.LG}
                      onClick={() => router.push("/settings")}
                      className="group"
                    >
                      Cookie Settings
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                      />
                    </Button>
                    <Button
                      variant={ButtonVariant.OUTLINE}
                      size={ButtonSize.LG}
                      onClick={() => router.push("/privacy")}
                      className="group"
                    >
                      Privacy Policy
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

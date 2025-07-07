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
  faCheck,
  faExclamationTriangle,
  faLock,
  faMapMarkerAlt,
  faMessage,
  faShield,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
const safetyTips = [
  {
    icon: faUserShield,
    title: "Meet in Safe Places",
    description:
      "Always meet in public, well-lit locations like cafes or community centers",
    color: "text-primary",
  },
  {
    icon: faMessage,
    title: "Keep Communication Clear",
    description:
      "Use our in-app messaging system for all swap-related communication",
    color: "text-accent",
  },
  {
    icon: faMapMarkerAlt,
    title: "Share Location Wisely",
    description:
      "Never share your home address - use public meeting spots instead",
    color: "text-warning",
  },
  {
    icon: faLock,
    title: "Protect Your Privacy",
    description: "Keep personal and financial information private and secure",
    color: "text-info",
  },
];
const guidelines = [
  "Verify user profiles and reviews before meeting",
  "Trust your instincts - if something feels off, don't proceed",
  "Bring a friend when meeting for high-value swaps",
  "Inspect items carefully before completing the swap",
  "Report suspicious behavior immediately",
  "Keep all communication within the app",
];
const reportingSteps = [
  {
    title: "Use the Report Button",
    description: "Find the report button on user profiles or item listings",
  },
  {
    title: "Select the Issue",
    description: "Choose the appropriate category for your report",
  },
  {
    title: "Provide Details",
    description: "Give specific information about the incident",
  },
  {
    title: "Submit Report",
    description: "Our team will review and take action within 24 hours",
  },
];
export default function Safety() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 mb-16 sm:mb-20">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 border-b border-border/20">
          <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/20 mb-6">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="w-4 h-4 text-warning"
                />
                <span className="text-sm font-medium text-warning">
                  Safety First
                </span>
              </div>
              <Typography
                as={TypographyVariant.H1}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4"
              >
                Your Safety is Our Priority
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-text-secondary text-lg sm:text-xl leading-relaxed mb-8"
              >
                Follow these guidelines to ensure safe and successful swaps
                within our community. We&apos;re committed to maintaining a
                secure environment for all users.
              </Typography>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {safetyTips.map((tip, index) => (
                <Card
                  key={index}
                  className="group hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-background to-card flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                      <FontAwesomeIcon
                        icon={tip.icon}
                        className={`w-8 h-8 ${tip.color}`}
                      />
                    </div>
                    <Typography
                      as={TypographyVariant.H3}
                      className="text-lg font-bold text-text-primary mb-2"
                    >
                      {tip.title}
                    </Typography>
                    <Typography
                      as={TypographyVariant.P}
                      className="text-text-secondary text-sm"
                    >
                      {tip.description}
                    </Typography>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Typography
                as={TypographyVariant.H2}
                className="text-2xl sm:text-3xl font-bold text-text-primary mb-4"
              >
                Community Guidelines
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-text-secondary"
              >
                Follow these best practices for safe and successful swaps
              </Typography>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {guidelines.map((guideline, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/20 hover:border-primary/20 transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="w-5 h-5 text-success"
                    />
                  </div>
                  <Typography
                    as={TypographyVariant.P}
                    className="text-text-primary"
                  >
                    {guideline}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Typography
                as={TypographyVariant.H2}
                className="text-2xl sm:text-3xl font-bold text-text-primary mb-4"
              >
                How to Report Issues
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-text-secondary"
              >
                We take all reports seriously and act quickly to maintain
                community safety
              </Typography>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {reportingSteps.map((step, index) => (
                <Card key={index} className="relative">
                  <div className="p-6">
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <Typography
                      as={TypographyVariant.H3}
                      className="text-lg font-bold text-text-primary mb-2 mt-2"
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      as={TypographyVariant.P}
                      className="text-text-secondary text-sm"
                    >
                      {step.description}
                    </Typography>
                  </div>
                </Card>
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
                    Need Help or Support?
                  </Typography>
                  <Typography
                    as={TypographyVariant.P}
                    className="text-text-secondary mb-8"
                  >
                    Our support team is here to help you with any safety
                    concerns or questions.
                  </Typography>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant={ButtonVariant.PRIMARY}
                      size={ButtonSize.LG}
                      onClick={() => router.push("/contact")}
                      className="group"
                    >
                      Contact Support
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                      />
                    </Button>
                    <Button
                      variant={ButtonVariant.OUTLINE}
                      size={ButtonSize.LG}
                      onClick={() => router.push("/report")}
                      className="group"
                    >
                      Report an Issue
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="ml-2 group-hover:scale-110 transition-transform duration-300"
                      />
                    </Button>
                  </div>
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-2 text-text-muted text-sm">
                    <FontAwesomeIcon icon={faShield} className="text-success" />
                    <span>Protected by LoopIt Safety Guarantee</span>
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

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
  faBalanceScale,
  faBook,
  faGavel,
  faHandshake,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
const termsHighlights = [
  {
    icon: faHandshake,
    title: "User Agreement",
    description: "Terms governing your use of LoopIt services",
    color: "text-primary",
  },
  {
    icon: faBalanceScale,
    title: "Legal Rights",
    description: "Your rights and responsibilities as a user",
    color: "text-success",
  },
  {
    icon: faGavel,
    title: "Dispute Resolution",
    description: "How we handle conflicts and disputes",
    color: "text-warning",
  },
  {
    icon: faShieldAlt,
    title: "Protection",
    description: "Safeguards for users and the platform",
    color: "text-info",
  },
];
const termsSections = [
  {
    title: "Account Terms",
    content: [
      {
        subtitle: "Account Creation",
        details: [
          "Must be 18 years or older",
          "Provide accurate information",
          "Keep credentials secure",
          "One account per person",
        ],
      },
      {
        subtitle: "Account Responsibilities",
        details: [
          "Maintain accurate information",
          "Report unauthorized access",
          "No account sharing",
          "Regular security updates",
        ],
      },
    ],
  },
  {
    title: "Platform Usage",
    content: [
      {
        subtitle: "Acceptable Use",
        details: [
          "Follow community guidelines",
          "Post accurate listings",
          "Respect other users",
          "No harmful content",
        ],
      },
      {
        subtitle: "Prohibited Activities",
        details: [
          "No illegal items",
          "No harassment",
          "No spam or scams",
          "No intellectual property violations",
        ],
      },
    ],
  },
  {
    title: "Swapping Rules",
    content: [
      {
        subtitle: "Transaction Guidelines",
        details: [
          "Honor swap agreements",
          "Meet in safe locations",
          "Inspect items carefully",
          "Report issues promptly",
        ],
      },
      {
        subtitle: "Safety Measures",
        details: [
          "Verify user identities",
          "Use in-app messaging",
          "Follow safety guidelines",
          "Document transactions",
        ],
      },
    ],
  },
  {
    title: "Legal Considerations",
    content: [
      {
        subtitle: "Liability",
        details: [
          "Platform not liable for swaps",
          "User responsible for items",
          "No warranty on items",
          "Use platform at own risk",
        ],
      },
      {
        subtitle: "Dispute Resolution",
        details: [
          "Mediation process",
          "User cooperation required",
          "Evidence submission",
          "Final decisions binding",
        ],
      },
    ],
  },
];
const lastUpdated = "January 1, 2024";
export default function Terms() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 mb-16 sm:mb-20">

        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 border-b border-border/20">
          <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
            <div className="text-center max-w-3xl mx-auto">
              <Typography
                as={TypographyVariant.H1}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4"
              >
                Terms of Service
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-text-secondary text-lg sm:text-xl leading-relaxed mb-4"
              >
                Please read these terms carefully before using LoopIt
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
              {termsHighlights.map((highlight, index) => (
                <Card
                  key={index}
                  className="group hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-background to-card flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                      <FontAwesomeIcon
                        icon={highlight.icon}
                        className={`w-8 h-8 ${highlight.color}`}
                      />
                    </div>
                    <Typography
                      as={TypographyVariant.H3}
                      className="text-lg font-bold text-text-primary mb-2"
                    >
                      {highlight.title}
                    </Typography>
                    <Typography
                      as={TypographyVariant.P}
                      className="text-text-secondary text-sm"
                    >
                      {highlight.description}
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
              {termsSections.map((section, index) => (
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
                                icon={faBook}
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
                    Questions About Our Terms?
                  </Typography>
                  <Typography
                    as={TypographyVariant.P}
                    className="text-text-secondary mb-8"
                  >
                    Our team is here to help you understand our terms and
                    conditions
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
                      onClick={() => router.push("/help")}
                      className="group"
                    >
                      Visit Help Center
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

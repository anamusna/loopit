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
  faDownload,
  faEye,
  faFileExport,
  faLock,
  faShieldAlt,
  faTrash,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
const gdprRights = [
  {
    icon: faEye,
    title: "Right to Access",
    description: "View all personal data we hold about you",
    color: "text-primary",
  },
  {
    icon: faFileExport,
    title: "Right to Portability",
    description: "Transfer your data to another service",
    color: "text-success",
  },
  {
    icon: faTrash,
    title: "Right to Erasure",
    description: "Request deletion of your data",
    color: "text-warning",
  },
  {
    icon: faLock,
    title: "Right to Object",
    description: "Control how your data is used",
    color: "text-info",
  },
];
const gdprDetails = [
  {
    title: "Your GDPR Rights",
    content: [
      {
        subtitle: "Data Access",
        details: [
          "View your personal data",
          "Request data copies",
          "Check data accuracy",
          "Update information",
        ],
      },
      {
        subtitle: "Data Control",
        details: [
          "Restrict processing",
          "Object to processing",
          "Withdraw consent",
          "Stop marketing",
        ],
      },
    ],
  },
  {
    title: "Data Processing",
    content: [
      {
        subtitle: "Legal Basis",
        details: [
          "Contract fulfillment",
          "Legal obligations",
          "Legitimate interests",
          "User consent",
        ],
      },
      {
        subtitle: "Processing Activities",
        details: [
          "Account management",
          "Service provision",
          "Security measures",
          "Analytics",
        ],
      },
    ],
  },
  {
    title: "International Transfers",
    content: [
      {
        subtitle: "Data Location",
        details: [
          "EU data centers",
          "Secure transfers",
          "Partner compliance",
          "Transfer safeguards",
        ],
      },
      {
        subtitle: "Protection Measures",
        details: [
          "Standard clauses",
          "Privacy Shield",
          "Data agreements",
          "Regular audits",
        ],
      },
    ],
  },
  {
    title: "Your Choices",
    content: [
      {
        subtitle: "Data Management",
        details: [
          "Privacy settings",
          "Cookie preferences",
          "Marketing options",
          "Account deletion",
        ],
      },
      {
        subtitle: "Support",
        details: [
          "Contact DPO",
          "File complaints",
          "Request help",
          "Get information",
        ],
      },
    ],
  },
];
const lastUpdated = "January 1, 2024";
export default function GDPR() {
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
                  icon={faUserShield}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm font-medium text-primary">
                  GDPR Compliance
                </span>
              </div>
              <Typography
                as={TypographyVariant.H1}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4"
              >
                GDPR Data Protection
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-text-secondary text-lg sm:text-xl leading-relaxed mb-4"
              >
                Understanding your rights under the General Data Protection
                Regulation
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
              {gdprRights.map((right, index) => (
                <Card
                  key={index}
                  className="group hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-background to-card flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                      <FontAwesomeIcon
                        icon={right.icon}
                        className={`w-8 h-8 ${right.color}`}
                      />
                    </div>
                    <Typography
                      as={TypographyVariant.H3}
                      className="text-lg font-bold text-text-primary mb-2"
                    >
                      {right.title}
                    </Typography>
                    <Typography
                      as={TypographyVariant.P}
                      className="text-text-secondary text-sm"
                    >
                      {right.description}
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
              {gdprDetails.map((section, index) => (
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
                                icon={faShieldAlt}
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
                    Exercise Your Rights
                  </Typography>
                  <Typography
                    as={TypographyVariant.P}
                    className="text-text-secondary mb-8"
                  >
                    Request your data or manage your privacy preferences
                  </Typography>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant={ButtonVariant.PRIMARY}
                      size={ButtonSize.LG}
                      onClick={() => router.push("/settings/privacy")}
                      className="group"
                    >
                      <FontAwesomeIcon icon={faDownload} className="mr-2" />
                      Download Your Data
                    </Button>
                    <Button
                      variant={ButtonVariant.OUTLINE}
                      size={ButtonSize.LG}
                      onClick={() => router.push("/contact")}
                      className="group"
                    >
                      <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
                      Contact DPO
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

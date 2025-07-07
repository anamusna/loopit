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
  faDatabase,
  faEnvelope,
  faLock,
  faShieldAlt,
  faUserLock,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
const privacyHighlights = [
  {
    icon: faUserLock,
    title: "Data Protection",
    description: "Your personal information is encrypted and securely stored",
    color: "text-primary",
  },
  {
    icon: faShieldAlt,
    title: "Privacy Controls",
    description: "Control what information is visible to other users",
    color: "text-success",
  },
  {
    icon: faDatabase,
    title: "Data Rights",
    description: "Access, modify, or delete your data at any time",
    color: "text-warning",
  },
  {
    icon: faUserShield,
    title: "Safe Communication",
    description: "Secure messaging system for all interactions",
    color: "text-info",
  },
];
const privacyPolicySections = [
  {
    title: "Information We Collect",
    content: [
      {
        subtitle: "Personal Information",
        details: [
          "Name and contact information",
          "Profile picture and bio",
          "Location (city/region level only)",
          "Communication preferences",
        ],
      },
      {
        subtitle: "Usage Information",
        details: [
          "Items you view and swap",
          "Messages and interactions",
          "Device and browser information",
          "IP address and location data",
        ],
      },
    ],
  },
  {
    title: "How We Use Your Data",
    content: [
      {
        subtitle: "Core Services",
        details: [
          "Facilitating item swaps",
          "Matching you with relevant items",
          "Processing messages and notifications",
          "Maintaining account security",
        ],
      },
      {
        subtitle: "Service Improvement",
        details: [
          "Analyzing usage patterns",
          "Improving user experience",
          "Preventing fraud and abuse",
          "Customizing recommendations",
        ],
      },
    ],
  },
  {
    title: "Data Sharing",
    content: [
      {
        subtitle: "With Other Users",
        details: [
          "Public profile information",
          "Item listings and photos",
          "Swap history and ratings",
          "Location (approximate only)",
        ],
      },
      {
        subtitle: "With Third Parties",
        details: [
          "Only with explicit consent",
          "For essential service providers",
          "When legally required",
          "In anonymized format",
        ],
      },
    ],
  },
  {
    title: "Your Rights",
    content: [
      {
        subtitle: "Control Your Data",
        details: [
          "Access your personal data",
          "Request data modification",
          "Delete your account",
          "Export your data",
        ],
      },
      {
        subtitle: "Privacy Settings",
        details: [
          "Manage visibility settings",
          "Control notifications",
          "Block unwanted users",
          "Manage cookies",
        ],
      },
    ],
  },
];
export default function Privacy() {
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
                Privacy Policy
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-text-secondary text-lg sm:text-xl leading-relaxed mb-8"
              >
                We&apos;re committed to protecting your privacy and ensuring
                your data is secure
              </Typography>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant={ButtonVariant.PRIMARY}
                  size={ButtonSize.LG}
                  onClick={() => router.push("/contact")}
                  className="group"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  Contact Privacy Team
                </Button>
                <Button
                  variant={ButtonVariant.OUTLINE}
                  size={ButtonSize.LG}
                  onClick={() => router.push("/help")}
                  className="group"
                >
                  <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {privacyHighlights.map((highlight, index) => (
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
              {privacyPolicySections.map((section, index) => (
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
                                icon={faLock}
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
                    Questions About Privacy?
                  </Typography>
                  <Typography
                    as={TypographyVariant.P}
                    className="text-text-secondary mb-8"
                  >
                    Our privacy team is here to help you understand how we
                    protect your data
                  </Typography>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant={ButtonVariant.PRIMARY}
                      size={ButtonSize.LG}
                      onClick={() => router.push("/contact")}
                      className="group"
                    >
                      <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                      Contact Privacy Team
                    </Button>
                    <Button
                      variant={ButtonVariant.OUTLINE}
                      size={ButtonSize.LG}
                      onClick={() => router.push("/gdpr")}
                      className="group"
                    >
                      <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
                      GDPR Rights
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

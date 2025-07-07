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
import Input from "@/tailwind/components/forms/Input";
import Select from "@/tailwind/components/forms/Select";
import Textarea from "@/tailwind/components/forms/Textarea";
import Card from "@/tailwind/components/layout/Card";
import {
  faArrowRight,
  faExclamationTriangle,
  faFlag,
  faShieldAlt,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
const reportTypes = [
  {
    icon: faUserShield,
    title: "Safety Concerns",
    description: "Report unsafe behavior or dangerous items",
    color: "text-warning",
  },
  {
    icon: faFlag,
    title: "Policy Violations",
    description: "Report violations of community guidelines",
    color: "text-error",
  },
  {
    icon: faExclamationTriangle,
    title: "Suspicious Activity",
    description: "Report potential scams or fraud",
    color: "text-primary",
  },
  {
    icon: faShieldAlt,
    title: "Account Issues",
    description: "Report account-related problems",
    color: "text-info",
  },
];
const reportCategories = [
  { value: "safety", label: "Safety Concern" },
  { value: "policy", label: "Policy Violation" },
  { value: "suspicious", label: "Suspicious Activity" },
  { value: "harassment", label: "Harassment" },
  { value: "scam", label: "Scam or Fraud" },
  { value: "inappropriate", label: "Inappropriate Content" },
  { value: "other", label: "Other" },
];
const urgencyLevels = [
  { value: "low", label: "Low - Not time sensitive" },
  { value: "medium", label: "Medium - Needs attention within 24 hours" },
  { value: "high", label: "High - Needs immediate attention" },
];
export default function Report() {
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
                  Report an Issue
                </span>
              </div>
              <Typography
                as={TypographyVariant.H1}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4"
              >
                Help Us Keep LoopIt Safe
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-text-secondary text-lg sm:text-xl leading-relaxed mb-8"
              >
                Your safety is our priority. Report any concerns and we&apos;ll
                take immediate action.
              </Typography>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {reportTypes.map((type, index) => (
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
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <Typography
                  as={TypographyVariant.H2}
                  className="text-2xl sm:text-3xl font-bold text-text-primary mb-4"
                >
                  Submit a Report
                </Typography>
                <Typography
                  as={TypographyVariant.P}
                  className="text-text-secondary"
                >
                  Please provide as much detail as possible to help us
                  investigate
                </Typography>
              </div>
              <Card className="p-6 sm:p-8">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Report Category
                    </label>
                    <Select
                      options={reportCategories}
                      placeholder="Select a category"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Urgency Level
                    </label>
                    <Select
                      options={urgencyLevels}
                      placeholder="Select urgency level"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      User or Item URL
                    </label>
                    <Input
                      type="text"
                      placeholder="Paste the URL of the user profile or item"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Description
                    </label>
                    <Textarea
                      placeholder="Describe the issue in detail"
                      rows={5}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Evidence (Optional)
                    </label>
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                      <Typography
                        as={TypographyVariant.P}
                        className="text-text-secondary text-sm mb-4"
                      >
                        Drag and drop files here or click to upload
                      </Typography>
                      <Button
                        variant={ButtonVariant.OUTLINE}
                        size={ButtonSize.SM}
                      >
                        Choose Files
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      variant={ButtonVariant.PRIMARY}
                      size={ButtonSize.LG}
                      className="group transform hover:scale-105 transition-all duration-300"
                    >
                      Submit Report
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                      />
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <Card className="relative overflow-hidden bg-gradient-to-br from-warning/10 to-error/10 border-none">
              <div className="p-8 sm:p-12 text-center">
                <div className="max-w-2xl mx-auto">
                  <Typography
                    as={TypographyVariant.H2}
                    className="text-2xl sm:text-3xl font-bold text-text-primary mb-4"
                  >
                    Emergency?
                  </Typography>
                  <Typography
                    as={TypographyVariant.P}
                    className="text-text-secondary mb-8"
                  >
                    If you&apos;re in immediate danger or witness a crime,
                    please contact your local emergency services immediately.
                  </Typography>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant={ButtonVariant.PRIMARY}
                      size={ButtonSize.LG}
                      onClick={() => router.push("/safety")}
                      className="group"
                    >
                      <FontAwesomeIcon icon={faUserShield} className="mr-2" />
                      Safety Guidelines
                    </Button>
                    <Button
                      variant={ButtonVariant.OUTLINE}
                      size={ButtonSize.LG}
                      onClick={() => router.push("/help")}
                      className="group"
                    >
                      <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
                      Get Help
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

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
  faHandshake,
  faHeart,
  faLeaf,
  faShieldAlt,
  faUserFriends,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
const communityValues = [
  {
    icon: faHeart,
    title: "Respect & Kindness",
    description:
      "Treat all members with respect and foster a welcoming environment",
    color: "text-error",
  },
  {
    icon: faHandshake,
    title: "Trust & Honesty",
    description: "Be truthful about items and maintain open communication",
    color: "text-primary",
  },
  {
    icon: faLeaf,
    title: "Sustainability",
    description: "Promote reuse and help reduce environmental impact",
    color: "text-success",
  },
  {
    icon: faUsers,
    title: "Community First",
    description: "Support and engage with our diverse community",
    color: "text-accent",
  },
];
const guidelines = [
  {
    category: "Item Quality",
    rules: [
      "Items must be in good, usable condition",
      "Provide accurate descriptions and clear photos",
      "Disclose any defects or issues",
      "No counterfeit or replica items",
    ],
  },
  {
    category: "Communication",
    rules: [
      "Respond to messages promptly",
      "Be clear about your expectations",
      "Keep all communication within the app",
      "Use respectful language",
    ],
  },
  {
    category: "Safety",
    rules: [
      "Meet in public, well-lit locations",
      "Don't share personal information",
      "Report suspicious behavior",
      "Trust your instincts",
    ],
  },
  {
    category: "Swapping",
    rules: [
      "Honor your commitments",
      "Be on time for meetups",
      "Inspect items before completing swaps",
      "Follow through with agreed terms",
    ],
  },
];
const prohibitedItems = [
  "Illegal items or substances",
  "Weapons or dangerous materials",
  "Counterfeit or stolen goods",
  "Expired or unsafe food items",
  "Live animals",
  "Adult content or explicit materials",
  "Prescription medications",
  "Personal information or data",
];
export default function Guidelines() {
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
                Community Guidelines
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-text-secondary text-lg sm:text-xl leading-relaxed mb-8"
              >
                Our guidelines help create a safe, trustworthy, and enjoyable
                environment for all members
              </Typography>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {communityValues.map((value, index) => (
                <Card
                  key={index}
                  className="group hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-background to-card flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                      <FontAwesomeIcon
                        icon={value.icon}
                        className={`w-8 h-8 ${value.color}`}
                      />
                    </div>
                    <Typography
                      as={TypographyVariant.H3}
                      className="text-lg font-bold text-text-primary mb-2"
                    >
                      {value.title}
                    </Typography>
                    <Typography
                      as={TypographyVariant.P}
                      className="text-text-secondary text-sm"
                    >
                      {value.description}
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
                Community Rules
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-text-secondary"
              >
                Follow these guidelines to ensure a positive experience for
                everyone
              </Typography>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guidelines.map((section, index) => (
                <Card key={index} className="p-6">
                  <Typography
                    as={TypographyVariant.H3}
                    className="text-lg font-bold text-text-primary mb-4"
                  >
                    {section.category}
                  </Typography>
                  <ul className="space-y-3">
                    {section.rules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
                        />
                        <Typography
                          as={TypographyVariant.P}
                          className="text-text-secondary"
                        >
                          {rule}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="p-6 sm:p-8 bg-gradient-to-br from-error/10 to-warning/10 border-none">
                <div className="text-center mb-8">
                  <Typography
                    as={TypographyVariant.H2}
                    className="text-2xl sm:text-3xl font-bold text-text-primary mb-4"
                  >
                    Prohibited Items
                  </Typography>
                  <Typography
                    as={TypographyVariant.P}
                    className="text-text-secondary"
                  >
                    The following items are not allowed on LoopIt
                  </Typography>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {prohibitedItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/20"
                    >
                      <FontAwesomeIcon
                        icon={faShieldAlt}
                        className="w-5 h-5 text-error"
                      />
                      <Typography
                        as={TypographyVariant.P}
                        className="text-text-primary"
                      >
                        {item}
                      </Typography>
                    </div>
                  ))}
                </div>
              </Card>
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
                    Join Our Community
                  </Typography>
                  <Typography
                    as={TypographyVariant.P}
                    className="text-text-secondary mb-8"
                  >
                    Be part of a community that values sustainability, trust,
                    and mutual respect
                  </Typography>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant={ButtonVariant.PRIMARY}
                      size={ButtonSize.LG}
                      onClick={() => router.push("/register")}
                      className="group"
                    >
                      <FontAwesomeIcon icon={faUserFriends} className="mr-2" />
                      Join LoopIt
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
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

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
  faBook,
  faCircleQuestion,
  faComments,
  faEnvelope,
  faHandshake,
  faHeadset,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
const helpCategories = [
  {
    icon: faCircleQuestion,
    title: "Getting Started",
    description: "Learn the basics of using LoopIt and start swapping",
    links: [
      "How to create an account",
      "Setting up your profile",
      "Posting your first item",
      "Finding items to swap",
    ],
  },
  {
    icon: faHandshake,
    title: "Making Swaps",
    description: "Everything you need to know about successful swapping",
    links: [
      "Proposing a swap",
      "Negotiating terms",
      "Meeting safely",
      "Completing the swap",
    ],
  },
  {
    icon: faBook,
    title: "Policies & Guidelines",
    description: "Important rules and guidelines for our community",
    links: [
      "Community guidelines",
      "Prohibited items",
      "Safety policies",
      "Trust & verification",
    ],
  },
  {
    icon: faHeadset,
    title: "Support & Help",
    description: "Get help when you need it",
    links: [
      "Contacting support",
      "Reporting issues",
      "Account recovery",
      "Technical help",
    ],
  },
];
const faqItems = [
  {
    question: "How do I start swapping?",
    answer:
      "Create an account, upload items you want to swap, and browse other items. When you find something you like, propose a swap with the owner.",
  },
  {
    question: "Is LoopIt free to use?",
    answer:
      "Yes! LoopIt is completely free. We believe in building a sustainable community without financial barriers.",
  },
  {
    question: "How do I stay safe when meeting?",
    answer:
      "Always meet in public places, bring a friend for high-value swaps, and keep all communication within the app.",
  },
  {
    question: "What items can I swap?",
    answer:
      "Most legal items are allowed. Check our prohibited items list for specifics. Items should be in good condition and accurately described.",
  },
  {
    question: "What if something goes wrong?",
    answer:
      "Contact our support team immediately. We're here to help resolve any issues and ensure a safe swapping experience.",
  },
  {
    question: "How is my impact calculated?",
    answer:
      "We calculate environmental impact based on item type, weight, and average manufacturing footprint. Each swap shows its specific impact.",
  },
];
export default function Help() {
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
                How Can We Help?
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-text-secondary text-lg sm:text-xl leading-relaxed mb-8"
              >
                Find answers to common questions and learn how to make the most
                of LoopIt
              </Typography>
              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for help..."
                    className="w-full px-6 py-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300 pl-12"
                  />
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {helpCategories.map((category, index) => (
                <Card
                  key={index}
                  className="group hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                      <FontAwesomeIcon
                        icon={category.icon}
                        className="w-6 h-6 text-primary"
                      />
                    </div>
                    <Typography
                      as={TypographyVariant.H3}
                      className="text-lg font-bold text-text-primary mb-2"
                    >
                      {category.title}
                    </Typography>
                    <Typography
                      as={TypographyVariant.P}
                      className="text-text-secondary text-sm mb-4"
                    >
                      {category.description}
                    </Typography>
                    <ul className="space-y-2">
                      {category.links.map((link, i) => (
                        <li key={i}>
                          <button className="text-sm text-text-primary hover:text-primary transition-colors duration-300 flex items-center gap-2 group">
                            <span>{link}</span>
                            <FontAwesomeIcon
                              icon={faArrowRight}
                              className="w-3 h-3 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300"
                            />
                          </button>
                        </li>
                      ))}
                    </ul>
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
                Frequently Asked Questions
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-text-secondary"
              >
                Quick answers to common questions
              </Typography>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {faqItems.map((item, index) => (
                <Card key={index} className="p-6">
                  <Typography
                    as={TypographyVariant.H3}
                    className="text-lg font-bold text-text-primary mb-2 flex items-start gap-3"
                  >
                    <FontAwesomeIcon
                      icon={faCircleQuestion}
                      className="w-5 h-5 text-primary flex-shrink-0 mt-1"
                    />
                    {item.question}
                  </Typography>
                  <Typography
                    as={TypographyVariant.P}
                    className="text-text-secondary pl-8"
                  >
                    {item.answer}
                  </Typography>
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
                    Still Need Help?
                  </Typography>
                  <Typography
                    as={TypographyVariant.P}
                    className="text-text-secondary mb-8"
                  >
                    Our support team is here to help you with any questions or
                    concerns
                  </Typography>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant={ButtonVariant.PRIMARY}
                      size={ButtonSize.LG}
                      onClick={() => router.push("/contact")}
                      className="group"
                    >
                      <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                      Email Support
                    </Button>
                    <Button
                      variant={ButtonVariant.OUTLINE}
                      size={ButtonSize.LG}
                      onClick={() => router.push("/chat")}
                      className="group"
                    >
                      <FontAwesomeIcon icon={faComments} className="mr-2" />
                      Live Chat
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

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
  faMagnifyingGlass,
  faMessage,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
const steps = [
  {
    icon: faUpload,
    title: "Upload Items",
    description:
      "Take a photo and describe your items or services you'd like to swap",
    color: "text-primary",
  },
  {
    icon: faMagnifyingGlass,
    title: "Browse Listings",
    description:
      "Find items you want using filters for category, distance, and eco-impact",
    color: "text-accent",
  },
  {
    icon: faMessage,
    title: "Propose Trades",
    description:
      "Suggest swaps with flexible combinations of items and services",
    color: "text-success",
  },
  {
    icon: faHandshake,
    title: "Meet & Exchange",
    description:
      "Chat to arrange the swap and meet safely to complete the trade",
    color: "text-info",
  },
];
const benefits = [
  "Save money while getting what you need",
  "Reduce waste and environmental impact",
  "Connect with your local community",
  "Give items a second life",
  "Track your carbon savings",
  "Build trust through successful swaps",
];
export default function HowItWorks() {
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
                How LoopIt Works
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-text-secondary text-lg sm:text-xl leading-relaxed mb-8"
              >
                Join our community of mindful swappers and start exchanging
                items sustainably. It&apos;s easy, eco-friendly, and completely
                free!
              </Typography>
              <Button
                variant={ButtonVariant.PRIMARY}
                size={ButtonSize.LG}
                onClick={() => router.push("/register")}
                className="group transform hover:scale-105 transition-all duration-300"
              >
                Start Swapping Now
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <Card
                  key={index}
                  className="group hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-background to-card flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                      <FontAwesomeIcon
                        icon={step.icon}
                        className={`w-8 h-8 ${step.color}`}
                      />
                    </div>
                    <Typography
                      as={TypographyVariant.H3}
                      className="text-lg font-bold text-text-primary mb-2"
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

        <section className="py-12 sm:py-16 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Typography
                as={TypographyVariant.H2}
                className="text-2xl sm:text-3xl font-bold text-text-primary mb-4"
              >
                Why Choose LoopIt?
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-text-secondary"
              >
                Join thousands of users already making a difference
              </Typography>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
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
                    {benefit}
                  </Typography>
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
                    Ready to Start Your Sustainable Journey?
                  </Typography>
                  <Typography
                    as={TypographyVariant.P}
                    className="text-text-secondary mb-8"
                  >
                    Join our growing community of eco-conscious swappers and
                    make a positive impact on the environment.
                  </Typography>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant={ButtonVariant.PRIMARY}
                      size={ButtonSize.LG}
                      onClick={() => router.push("/register")}
                      className="group"
                    >
                      Create Free Account
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                      />
                    </Button>
                    <Button
                      variant={ButtonVariant.OUTLINE}
                      size={ButtonSize.LG}
                      onClick={() => router.push("/")}
                      className="group"
                    >
                      Browse Items
                      <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="ml-2 group-hover:scale-110 transition-transform duration-300"
                      />
                    </Button>
                  </div>
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-2 text-text-muted text-sm">
                    <FontAwesomeIcon icon={faHeart} className="text-red-500" />
                    <span>
                      Join {Math.floor(Math.random() * 5000 + 10000)} happy
                      swappers
                    </span>
                    <FontAwesomeIcon icon={faLeaf} className="text-success" />
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

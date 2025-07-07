"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import Image from "@/tailwind/components/elements/Image";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Card from "@/tailwind/components/layout/Card";
import {
  faArrowRight,
  faHeart,
  faLeaf,
  faQuoteLeft,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
const successStories = [
  {
    id: 1,
    title: "A New Home for Books",
    description:
      "I swapped my old tech books for gardening guides. Now my garden is thriving, and someone else is learning to code!",
    author: "Sarah Chen",
    avatar: "https://i.pravatar.cc/150?img=1",
    location: "San Francisco, CA",
    category: "Books",
    impact: "Saved 5kg CO₂",
    rating: 5,
  },
  {
    id: 2,
    title: "Furniture with a Story",
    description:
      "Found the perfect vintage desk for my home office, and my old coffee table found a loving new home. Win-win!",
    author: "Michael Brown",
    avatar: "https://i.pravatar.cc/150?img=2",
    location: "Portland, OR",
    category: "Furniture",
    impact: "Saved 50kg CO₂",
    rating: 5,
  },
  {
    id: 3,
    title: "Fashion Forward",
    description:
      "Swapped my barely-worn dresses for some amazing vintage pieces. Sustainable fashion at its best!",
    author: "Emma Wilson",
    avatar: "https://i.pravatar.cc/150?img=3",
    location: "Austin, TX",
    category: "Clothing",
    impact: "Saved 8kg CO₂",
    rating: 4,
  },
];
const impactStats = [
  {
    label: "Items Swapped",
    value: "50,000+",
    description: "Successfully exchanged items",
  },
  {
    label: "CO₂ Saved",
    value: "25,000kg",
    description: "Environmental impact",
  },
  {
    label: "Active Users",
    value: "15,000+",
    description: "Growing community",
  },
  {
    label: "Local Communities",
    value: "100+",
    description: "Across the country",
  },
];
const testimonials = [
  {
    quote:
      "LoopIt has completely changed how I think about consumption. It's not just about swapping items - it's about building community.",
    author: "Jessica Lee",
    role: "Community Member",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    quote:
      "I've met amazing people through LoopIt. The platform makes it so easy to connect with like-minded individuals who care about sustainability.",
    author: "David Martinez",
    role: "Active Swapper",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    quote:
      "As a student, LoopIt helps me save money while reducing waste. It's a win-win for my wallet and the environment!",
    author: "Alex Thompson",
    role: "Student",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
];
export default function Stories() {
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
                Success Stories
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-text-secondary text-lg sm:text-xl leading-relaxed mb-8"
              >
                Real stories from our community members who are making a
                difference through sustainable swapping.
              </Typography>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {successStories.map((story) => (
                <Card
                  key={story.id}
                  className="group hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Image
                        src={story.avatar}
                        alt={story.author}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <Typography
                          as={TypographyVariant.H3}
                          className="font-bold text-text-primary"
                        >
                          {story.author}
                        </Typography>
                        <Typography
                          as={TypographyVariant.P}
                          className="text-sm text-text-secondary"
                        >
                          {story.location}
                        </Typography>
                      </div>
                    </div>
                    <Typography
                      as={TypographyVariant.H4}
                      className="text-lg font-bold text-text-primary mb-2"
                    >
                      {story.title}
                    </Typography>
                    <Typography
                      as={TypographyVariant.P}
                      className="text-text-secondary mb-4"
                    >
                      {story.description}
                    </Typography>
                    <div className="flex items-center justify-between text-sm">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary">
                        <FontAwesomeIcon icon={faLeaf} className="w-3 h-3" />
                        {story.impact}
                      </span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: story.rating }).map((_, i) => (
                          <FontAwesomeIcon
                            key={i}
                            icon={faStar}
                            className="w-3 h-3 text-warning"
                          />
                        ))}
                      </div>
                    </div>
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
                Our Impact Together
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-text-secondary"
              >
                Making a difference one swap at a time
              </Typography>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {impactStats.map((stat, index) => (
                <Card key={index} className="text-center p-6">
                  <Typography
                    as={TypographyVariant.H3}
                    className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2"
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    as={TypographyVariant.H4}
                    className="font-bold text-text-primary mb-1"
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    as={TypographyVariant.P}
                    className="text-sm text-text-secondary"
                  >
                    {stat.description}
                  </Typography>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="p-6 group hover:scale-[1.02] transition-all duration-300"
                >
                  <FontAwesomeIcon
                    icon={faQuoteLeft}
                    className="w-8 h-8 text-primary/20 mb-4"
                  />
                  <Typography
                    as={TypographyVariant.P}
                    className="text-text-primary italic mb-6"
                  >
                    &quot;{testimonial.quote}&quot;
                  </Typography>
                  <div className="flex items-center gap-4">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <Typography
                        as={TypographyVariant.H4}
                        className="font-bold text-text-primary"
                      >
                        {testimonial.author}
                      </Typography>
                      <Typography
                        as={TypographyVariant.P}
                        className="text-sm text-text-secondary"
                      >
                        {testimonial.role}
                      </Typography>
                    </div>
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
                    Start Your Success Story
                  </Typography>
                  <Typography
                    as={TypographyVariant.P}
                    className="text-text-secondary mb-8"
                  >
                    Join our community and be part of the sustainable swapping
                    movement.
                  </Typography>
                  <Button
                    variant={ButtonVariant.PRIMARY}
                    size={ButtonSize.LG}
                    onClick={() => router.push("/register")}
                    className="group transform hover:scale-105 transition-all duration-300"
                  >
                    Join LoopIt Today
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-2 text-text-muted text-sm">
                    <FontAwesomeIcon icon={faHeart} className="text-red-500" />
                    <span>Join our growing community of happy swappers</span>
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

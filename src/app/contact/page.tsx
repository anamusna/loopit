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
  faComments,
  faEnvelope,
  faHeadset,
  faMapMarkerAlt,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
const contactMethods = [
  {
    icon: faPhone,
    title: "Phone Support",
    description: "Available Mon-Fri, 9am-5pm",
    value: "+1 (555) 123-4567",
    color: "text-primary",
  },
  {
    icon: faEnvelope,
    title: "Email Support",
    description: "24/7 Response within 24h",
    value: "support@loopit.eco",
    color: "text-accent",
  },
  {
    icon: faComments,
    title: "Live Chat",
    description: "Available 24/7",
    value: "Start Chat",
    color: "text-success",
  },
  {
    icon: faMapMarkerAlt,
    title: "Office Location",
    description: "Visit us in person",
    value: "San Francisco, CA",
    color: "text-info",
  },
];
const contactTopics = [
  { value: "general", label: "General Inquiry" },
  { value: "technical", label: "Technical Support" },
  { value: "account", label: "Account Issues" },
  { value: "safety", label: "Safety Concerns" },
  { value: "feedback", label: "Feedback & Suggestions" },
  { value: "business", label: "Business Inquiries" },
];
export default function Contact() {
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
                Get in Touch
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-text-secondary text-lg sm:text-xl leading-relaxed mb-8"
              >
                We&apos;re here to help! Choose your preferred way to reach us
                or fill out the contact form below.
              </Typography>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <Card
                  key={index}
                  className="group hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-background to-card flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                      <FontAwesomeIcon
                        icon={method.icon}
                        className={`w-8 h-8 ${method.color}`}
                      />
                    </div>
                    <Typography
                      as={TypographyVariant.H3}
                      className="text-lg font-bold text-text-primary mb-2"
                    >
                      {method.title}
                    </Typography>
                    <Typography
                      as={TypographyVariant.P}
                      className="text-text-secondary text-sm mb-4"
                    >
                      {method.description}
                    </Typography>
                    <Typography
                      as={TypographyVariant.P}
                      className={`font-medium ${method.color}`}
                    >
                      {method.value}
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
                  Send Us a Message
                </Typography>
                <Typography
                  as={TypographyVariant.P}
                  className="text-text-secondary"
                >
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible
                </Typography>
              </div>
              <Card className="p-6 sm:p-8">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        First Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter your first name"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Last Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter your last name"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Topic
                    </label>
                    <Select
                      options={contactTopics}
                      placeholder="Select a topic"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Message
                    </label>
                    <Textarea
                      placeholder="Enter your message"
                      rows={5}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-center">
                    <Button
                      variant={ButtonVariant.PRIMARY}
                      size={ButtonSize.LG}
                      className="group transform hover:scale-105 transition-all duration-300"
                    >
                      Send Message
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
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 border-none">
              <div className="p-8 sm:p-12 text-center">
                <div className="max-w-2xl mx-auto">
                  <Typography
                    as={TypographyVariant.H2}
                    className="text-2xl sm:text-3xl font-bold text-text-primary mb-4"
                  >
                    24/7 Support Available
                  </Typography>
                  <Typography
                    as={TypographyVariant.P}
                    className="text-text-secondary mb-8"
                  >
                    Our support team is always here to help you with any
                    questions or concerns
                  </Typography>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant={ButtonVariant.PRIMARY}
                      size={ButtonSize.LG}
                      onClick={() => router.push("/chat")}
                      className="group"
                    >
                      <FontAwesomeIcon icon={faComments} className="mr-2" />
                      Start Live Chat
                    </Button>
                    <Button
                      variant={ButtonVariant.OUTLINE}
                      size={ButtonSize.LG}
                      onClick={() => router.push("/help")}
                      className="group"
                    >
                      <FontAwesomeIcon icon={faHeadset} className="mr-2" />
                      Visit Help Center
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

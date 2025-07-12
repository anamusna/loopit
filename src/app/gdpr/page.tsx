"use client";

import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Typography
          as={TypographyVariant.H1}
          className="text-3xl font-bold mb-8"
        >
          GDPR Compliance
        </Typography>

        <div className="space-y-6">
          <Typography as={TypographyVariant.P} className="text-lg">
            LoopIt is committed to protecting your privacy and ensuring
            compliance with the General Data Protection Regulation (GDPR).
          </Typography>

          <Typography
            as={TypographyVariant.H2}
            className="text-2xl font-semibold"
          >
            Your Rights
          </Typography>

          <Typography as={TypographyVariant.P}>
            Under GDPR, you have the right to:
          </Typography>

          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your data</li>
            <li>Restrict processing</li>
            <li>Data portability</li>
            <li>Object to processing</li>
          </ul>

          <Typography as={TypographyVariant.P}>
            For more information about how we handle your data, please see our
            Privacy Policy.
          </Typography>
        </div>
      </div>
    </div>
  );
}

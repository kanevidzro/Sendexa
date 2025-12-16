import BenefitsGrid from '@/components/sections/benefits-grid';
import TestimonialsSection from '@/components/sections/client-testimonial';
import FaqAccordion from '@/components/sections/faq-accordion';
import HeroSection from '@/components/sections/hero-section';
import { CoreFeatures } from '@/components/sections/core-features';
import PricingSection from '@/components/sections/pricing';
import SMSFeatures from '@/components/sections/sms-features';
import UseCases from '@/components/sections/use-cases';
import NetworkCoverage from '@/components/sections/network-coverage';
import CTASection from '@/components/sections/cta-section';
import DeveloperSection from '@/components/sections/developer-section';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sendexa — SMS & OTP API for Ghana Startups",
  description:
    "Send SMS and OTP in Ghana with simple APIs. Built for startups, credit unions, and developers. Reliable delivery on MTN, Telecel, and AT.",
  keywords: [
    "SMS API Ghana",
    "OTP API Ghana",
    "Bulk SMS Ghana",
    "SMS gateway Ghana",
    "OTP verification Ghana",
    "SMS for startups Ghana",
    "Credit union SMS Ghana"
  ],
  openGraph: {
    title: "Sendexa — Simple SMS & OTP APIs for Ghana",
    description:
      "Developer-friendly SMS and OTP APIs for Ghanaian startups and businesses.",
    url: "https://sendexa.co",
    siteName: "Sendexa",
    locale: "en_GH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sendexa — SMS & OTP API for Ghana",
    description:
      "Simple SMS and OTP APIs built in Ghana for startups and businesses.",
  },
};

export default async function Home() {
  return (
    <>
      {/* 1. Clear value + Ghana positioning */}
      <HeroSection />

      {/* 2. What problem you solve (quick understanding) */}
      <CoreFeatures />

      {/* 3. What people can actually do (SMS / OTP clarity) */}
      <SMSFeatures />

      {/* 4. Who this is for (conversion booster) */}
      <UseCases />

      {/* 5. Why Sendexa is easy & different */}
      <BenefitsGrid />

      {/* 6. Social proof (trust before pricing) */}
      <TestimonialsSection />

      {/* 7. Pricing after trust */}
      <PricingSection />

      {/* 8. Developers come AFTER pricing */}
      <DeveloperSection />

      {/* 9. Local advantage */}
      <NetworkCoverage />

      {/* 10. Objections */}
      <FaqAccordion />

      {/* 11. Final push */}
      <CTASection />
    </>
  );
}

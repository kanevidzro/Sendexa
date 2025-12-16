// app/sms-api/page.tsx
import type { Metadata } from "next";
import HeroSection from "@/components/sms-api/hero-section";
import SMSCapabilities from "@/components/sms-api/sms-capabilities";
import TwoWayMessaging from "@/components/sms-api/two-way-messaging";
import BulkSMSFeatures from "@/components/sms-api/bulk-sms-features";
import APIDocumentation from "@/components/sms-api/api-documentation";
import UseCases from "@/components/sms-api/use-cases";
import PricingSection from "@/components/sms-api/pricing";
import IntegrationSteps from "@/components/sms-api/integration-steps";
import CTASection from "@/components/sections/cta-section";

export const metadata: Metadata = {
  title: "SMS API for Ghana | Bulk SMS, 2-Way Messaging & More | Sendexa",
  description: "Powerful SMS API for Ghana with bulk SMS, two-way messaging, scheduled campaigns, and high deliverability. Integrate in minutes.",
  keywords: [
    "SMS API Ghana",
    "Bulk SMS Ghana",
    "Two-way SMS Ghana",
    "SMS Gateway Ghana",
    "SMS Campaigns Ghana",
    "SMS Marketing Ghana",
    "Transactional SMS Ghana"
  ],
  openGraph: {
    title: "Sendexa SMS API — Bulk SMS & 2-Way Messaging for Ghana",
    description: "Complete SMS solution for Ghanaian businesses with bulk messaging, two-way conversations, and high deliverability.",
    url: "https://sendexa.co/sms-api",
    type: "website",
  },
};

export default function SMSPage() {
  return (
    <>
      <HeroSection />
      <SMSCapabilities />
      <TwoWayMessaging />
      <BulkSMSFeatures />
      <APIDocumentation />
      <UseCases />
      <IntegrationSteps />
      <PricingSection />
      <CTASection />
    </>
  );
}
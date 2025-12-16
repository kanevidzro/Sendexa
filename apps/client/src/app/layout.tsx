//personal/src/app/layout.tsx

import type React from "react";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Sendexa",
    template: "%s | Dashboard",
  },
  description:
    "Manage your SMS, OTP, Sender IDs, contacts, and credits with the Sendexa Dashboard — built for fast, reliable communication.",
  generator: "Sendexa Platform",
  applicationName: "Sendexa Dashboard",
  keywords: [
    "Sendexa",
    "SMS",
    "OTP",
    "Messaging Dashboard",
    "Sender ID",
    "SMS Campaigns",
    "Buy SMS Credits",
    "Ghana Bulk SMS",
  ],
  authors: [{ name: "Sendexa Team", url: "https://sendexa.co" }],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  // themeColor: "#3a0ca3",
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-center" expand={true} richColors />
      </body>
    </html>
  );
}

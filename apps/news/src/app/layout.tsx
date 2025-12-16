import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Onest } from "next/font/google";
import "./globals.css";
import { ToasterProvider } from "../components/ui/toaster";

const onest = Onest({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:
      "Sendexa | Ghana's Leading Communication APIs – SMS, WhatsApp, Email, OTP",
    template: "%s | Sendexa",
  },
  description:
    "Sendexa powers 10,000+ African businesses with reliable SMS, WhatsApp, Email, and OTP APIs. Enjoy 99.9% uptime, instant delivery, developer-first tools, and easy integration across Africa.",
  metadataBase: new URL("https://sendexa.co"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`bg-gray-50 dark:bg-dark-secondary min-h-screen flex flex-col ${onest.className}`}
      >
        {/* <ThemeProvider disableTransitionOnChange> */}
         
          <ToasterProvider />

          <div className="isolate flex flex-col flex-1">{children}</div>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}

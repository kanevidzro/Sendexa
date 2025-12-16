import { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Join Sendexa. Choose between Individual Developer or Business Organization accounts to get started.",
  keywords: ["sign up", "account type", "developer", "business", "sendexa"],
};

import { SignupForm } from "@/components/auth/SignupForm";
import Link from "next/link";
import { EnhancedLoader } from "@/components/ui/EnhancedLoader";

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Image
              src="/exaweb.png"
              alt="Sendexa Logo"
              width={150}
              height={50}
              className="dark:invert"
            />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <Suspense
              fallback={
                <EnhancedLoader
                  message="Preparing Signup Form"
                  subMessage="Getting everything ready for your account creation"
                  spinnerSize="lg"
                />
              }
            >
              <SignupForm />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 relative hidden lg:block overflow-hidden">
        <Image
          src="/auth/auth.jpg" // You'll need to add this image
          alt="Choose your path with Sendexa"
          fill
          priority
          className="absolute inset-0 h-full w-full object-cover"
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30" />
        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="text-center text-white max-w-lg">
            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
              Choose Your Journey
            </h2>
            <p className="text-xl mb-6 drop-shadow-md opacity-90">
              Whether you&apos;re an individual developer or a growing business,
              Sendexa has the perfect tools for your communication needs.
            </p>
            <div className="flex justify-center gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">👨‍💻</span>
                </div>
                <p className="font-medium">For Developers</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">🏢</span>
                </div>
                <p className="font-medium">For Businesses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

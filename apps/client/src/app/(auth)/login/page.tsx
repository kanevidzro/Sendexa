// app/login/page.tsx
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Securely login to your Sendexa account. Access your dashboard, APIs, and communication tools.",
  keywords: ["login", "sign in", "sendexa login", "account access"],
};

import { LoginForm } from "@/components/auth/loginForm";
import Link from "next/link";
import { Suspense } from "react";
import { EnhancedLoader } from "@/components/ui/EnhancedLoader";

export default function LoginPage() {
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
            {" "}
            <Suspense
              fallback={
                <EnhancedLoader
                  message="Securing Your Login"
                  subMessage="Loading secure authentication form..."
                  spinnerSize="lg"
                  showLogo={true}
                />
              }
            >
              <LoginForm />
            </Suspense>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <a
              href="https://sendexa.co/legal/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="https://sendexa.co/legal/terms"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </a>

            <a
              href="https://sendexa.co/contact"
              className="hover:text-primary transition-colors"
            >
              Contact
            </a>
          </div>
          <p>© {new Date().getFullYear()} Sendexa. All rights reserved.</p>
        </div>
      </div>

      {/* Enhanced Auth Image Side */}
      <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-blue-500/5 relative hidden lg:block overflow-hidden">
        <Image
          src="/auth/login.jpg" // Recommended: Create/login-specific image
          alt="Secure login to Sendexa platform"
          fill
          priority
          className="absolute inset-0 h-full w-full object-cover"
          sizes="100vw"
        />

        {/* Gradient Overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" /> */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-end p-10 text-white">
          <div className="max-w-lg text-center mb-20">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🔐</span>
            </div>

            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
              Welcome Back
            </h2>

            <p className="text-xl mb-8 drop-shadow-md opacity-90">
              Secure access to your communication dashboard and developer tools
            </p>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">⚡</span>
                </div>
                <p className="font-medium text-sm">Instant Access</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">🛡️</span>
                </div>
                <p className="font-medium text-sm">Bank-level Security</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">📊</span>
                </div>
                <p className="font-medium text-sm">Real-time Dashboard</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">🌐</span>
                </div>
                <p className="font-medium text-sm">Multi-platform</p>
              </div>
            </div>

            {/* Testimonial/Quote */}
            <div className="border-t border-white/20 pt-6">
              <p className="italic opacity-80 mb-2">
                &quot;Sendexa has revolutionized how our team communicates. The
                login process is seamless and secure.&quot;
              </p>
              <p className="text-sm opacity-60">— Sarah Chen, Tech Lead</p>
            </div>
          </div>
        </div>

        {/* Floating Elements for visual interest */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-purple-500/10 blur-2xl" />
      </div>
    </div>
  );
}

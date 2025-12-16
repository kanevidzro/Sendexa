
// app/verify-email/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { VerifyEmailContent } from "@/components/auth/VerifyEmailContent";
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: "Verify Email | Sendexa",
  description: "Verify your email address to complete your Sendexa account setup.",
  keywords: ["verify email", "email verification", "account verification", "sendexa"],
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2 flex flex-col">
      <div className="flex-1 flex flex-col p-6 md:p-10">
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
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
          <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
            </Suspense>
          </div>
        </div>
        
        {/* Footer Links */}
        <div className="mt-auto pt-8 text-center text-sm text-muted-foreground">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <a href="https://sendexa.co/legal/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="https://sendexa.co/legal/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="https://sendexa.co/contact" className="hover:text-primary transition-colors">
              Contact
            </a>
          </div>
          <p>© {new Date().getFullYear()} Sendexa. All rights reserved.</p>
        </div>
      </div>
      
      {/* Enhanced Side Panel */}
      <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 relative hidden lg:block overflow-hidden">
        <Image
          src="/auth/login.jpg"
          alt="Email verification security"
          fill
          priority
          className="absolute inset-0 h-full w-full object-cover"
          sizes="100vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-end p-10 text-white">
          <div className="max-w-lg text-center mb-20">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✅</span>
            </div>
            
            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
              Secure Your Account
            </h2>
            
            <p className="text-xl mb-8 drop-shadow-md opacity-90">
              Email verification adds an extra layer of security to your account
            </p>
            
            {/* Benefits */}
            <div className="grid grid-cols-1 gap-4 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">🛡️</span>
                </div>
                <p className="font-medium text-sm">Account Security</p>
                <p className="text-xs opacity-80 mt-1">Prevent unauthorized access</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">🔔</span>
                </div>
                <p className="font-medium text-sm">Notifications</p>
                <p className="text-xs opacity-80 mt-1">Receive important updates</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">🚀</span>
                </div>
                <p className="font-medium text-sm">Full Access</p>
                <p className="text-xs opacity-80 mt-1">Unlock all features</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-cyan-500/10 blur-2xl" />
      </div>
    </div>
  );
}
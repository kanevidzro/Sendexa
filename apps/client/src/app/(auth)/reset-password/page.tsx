// app/reset-password/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Create a new password for your Sendexa account.",
  keywords: ["reset password", "new password", "sendexa"],
};

export default function ResetPasswordPage() {
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
            <ResetPasswordForm />
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
      <div className="bg-gradient-to-br from-green-500/20 to-teal-500/10 relative hidden lg:block overflow-hidden">
        <Image
          src="/auth/login.jpg"
          alt="Create new secure password"
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
              <span className="text-3xl">🔑</span>
            </div>
            
            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
              Create New Password
            </h2>
            
            <p className="text-xl mb-8 drop-shadow-md opacity-90">
              Choose a strong, secure password to protect your account.
            </p>
            
            {/* Password Tips */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-10">
              <h3 className="font-medium text-lg mb-4">Password Requirements:</h3>
              <ul className="text-sm space-y-2 text-left">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  At least 8 characters long
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Include uppercase & lowercase letters
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Include at least one number
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Include special characters (!@#$%)
                </li>
              </ul>
            </div>
            
            {/* Security Message */}
            <div className="border-t border-white/20 pt-6">
              <p className="text-sm opacity-80 italic">
                &quot;Your security is our priority. Create a unique password that you don&apos;t use elsewhere.&quot;
              </p>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-green-500/10 blur-2xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-teal-500/10 blur-2xl" />
      </div>
    </div>
  );
}
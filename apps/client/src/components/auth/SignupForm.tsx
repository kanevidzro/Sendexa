
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/auth/SignupForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface ApiResponse {
  token?: string;
  user: {
    id: string;
    email: string;
    name: string;
    image: string | null;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleInputChange = (
    field: keyof SignupFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): string | null => {
    if (formData.password !== formData.confirmPassword) {
      return "Passwords don't match";
    }

    if (formData.password.length < 8) {
      return "Password must be at least 8 characters long";
    }

    if (!formData.terms) {
      return "Please accept the Terms and Conditions";
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return "Please enter a valid email address";
    }

    if (!formData.name.trim()) {
      return "Please enter your name";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      console.log("Sending signup request:", submitData);

      const response = await fetch("/auth/sign-up/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result: ApiResponse & { error?: string } = await response.json();
      console.log("Response data:", result);

      if (!response.ok) {
        const errorMessage =
          result.error ||
          (response.status === 422
            ? "User already exists"
            : `HTTP error! status: ${response.status}`);
        throw new Error(errorMessage);
      }

      toast.success("Account created successfully!");

      // Store user data and token
      if (result.token) {
        localStorage.setItem("auth_token", result.token);
      }

      localStorage.setItem("user", JSON.stringify(result.user));

      if (result.user.emailVerified) {
        // User is already verified, redirect to dashboard
        toast.success("Welcome! Redirecting to your dashboard...");

        const redirectTo = searchParams.get("redirect") || "/home";
        setTimeout(() => {
          router.push(redirectTo);
        }, 1500);
      } else {
        // Email verification required
        toast.success("Account created! Please verify your email.");

        // Store email for verification page
        localStorage.setItem("pendingVerificationEmail", result.user.email);

        setTimeout(() => {
          router.push(
            `/signup-success?email=${encodeURIComponent(result.user.email)}`
          );
        }, 1500);
      }
    } catch (error: any) {
      console.error("Signup error:", error);

      // Handle specific error messages
      if (
        error.message.includes("User already exists") ||
        error.message.includes("already exists")
      ) {
        toast.error("An account with this email already exists.");
      } else if (error.message.includes("Validation failed")) {
        toast.error("Please check your information and try again.");
      } else if (error.message.includes("HTTP error")) {
        toast.error("Unable to create account. Please try again.");
      } else {
        toast.error(error.message || "An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: "google" | "github") => {
    try {
      setIsLoading(true);

      const redirectTo = searchParams.get("redirect") || "/home";
      const state = JSON.stringify({
        type: "signup",
        redirect: redirectTo,
      });

      // Redirect to OAuth provider with state
      if (provider === "google") {
        window.location.href = `/api/auth/oauth/google?state=${encodeURIComponent(
          state
        )}`;
      } else if (provider === "github") {
        window.location.href = `/api/auth/oauth/github?state=${encodeURIComponent(
          state
        )}`;
      }
    } catch (error) {
      console.error(`${provider} signup error:`, error);
      toast.error(`Failed to sign up with ${provider}. Please try again.`);
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    const redirectTo = searchParams.get("redirect");
    if (redirectTo) {
      router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`);
    } else {
      router.push("/login");
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6 w-full", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        {/* Name Field */}
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            disabled={isLoading}
            className="h-11"
            autoComplete="name"
          />
        </Field>

        {/* Email Field */}
        <Field>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={isLoading}
            className="h-11"
            autoComplete="email"
          />
        </Field>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              disabled={isLoading}
              minLength={8}
              className="h-11"
              autoComplete="new-password"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              disabled={isLoading}
              minLength={8}
              className="h-11"
              autoComplete="new-password"
            />
          </Field>
        </div>

        <FieldDescription>
          Password must be at least 8 characters long
        </FieldDescription>

        {/* Terms and conditions checkbox */}
        <Field>
          <div className="flex items-start space-x-3">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                id="terms"
                className="peer sr-only"
                required
                checked={formData.terms}
                onChange={(e) => handleInputChange("terms", e.target.checked)}
                disabled={isLoading}
              />
              <label
                htmlFor="terms"
                className="block w-5 h-5 rounded border border-gray-300 peer-checked:bg-primary peer-checked:border-primary cursor-pointer transition-colors hover:border-gray-400 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed relative"
              >
                <svg
                  className="absolute inset-0 m-auto w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </label>
            </div>

            <div>
              <label
                htmlFor="terms"
                className="block text-sm text-muted-foreground leading-relaxed cursor-pointer"
              >
                I agree to the{" "}
                <a
                  href="https://sendexa.co/legal/terms"
                  className="text-primary hover:underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a
                  href="https://sendexa.co/legal/privacy"
                  className="text-primary hover:underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                <span className="text-destructive ml-1">*</span>
              </label>
              {/* <p className="text-xs text-muted-foreground mt-1">
                By checking this box, you acknowledge that you have read and
                agree to our policies.
              </p> */}
            </div>
          </div>
        </Field>

        {/* Submit Button */}
        <Field>
          <Button
            type="submit"
            className="w-full h-11"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </Field>

        {/* Separator */}
        <FieldSeparator>Or continue with</FieldSeparator>

        {/* Social Signup Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field>
            <Button
              variant="outline"
              type="button"
              className="w-full h-11"
              onClick={() => handleSocialSignup("google")}
              disabled={isLoading}
            >
              <Image
                src="/svg/google.svg"
                alt="Google Logo"
                width={20}
                height={20}
                className="mr-2"
              />
              Google
            </Button>
          </Field>
          <Field>
            <Button
              variant="outline"
              type="button"
              className="w-full h-11"
              onClick={() => handleSocialSignup("github")}
              disabled={isLoading}
            >
              <Image
                src="/svg/github.svg"
                alt="GitHub Logo"
                width={20}
                height={20}
                className="mr-2"
              />
              GitHub
            </Button>
          </Field>
        </div>

        {/* Sign in Link */}
        <FieldDescription className="text-center pt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={handleLogin}
            className="text-primary hover:underline font-medium"
            disabled={isLoading}
          >
            Sign In
          </button>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}

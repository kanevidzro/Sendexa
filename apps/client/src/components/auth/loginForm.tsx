// components/auth/LoginForm.tsx
"use client";
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
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

interface LoginFormData {
  email: string;
  password: string;
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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/home";

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        email: formData.email.trim(),
        password: formData.password,
        // Optional fields
        // callbackURL: "",
        // rememberMe: true
      };

      console.log("Sending login request:", { email: submitData.email });

      const response = await fetch("/auth/sign-in/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result: ApiResponse & { error?: string } = await response.json();
      console.log("Login response:", result);

      if (!response.ok) {
        const errorMessage =
          result.error ||
          (response.status === 401
            ? "Invalid email or password"
            : response.status === 404
            ? "User not found"
            : `HTTP error! status: ${response.status}`);
        throw new Error(errorMessage);
      }

      // Store authentication data
      if (result.token) {
        localStorage.setItem("auth_token", result.token);
      }

      localStorage.setItem("user", JSON.stringify(result.user));

      toast.success("Signed in successfully!");

      // Check if email needs verification
      if (!result.user.emailVerified) {
        toast.info("Please verify your email address for full access");
      }

      // Redirect to the intended destination
      setTimeout(() => {
        router.push(redirectTo);
      }, 1000);
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle specific error messages
      if (
        error.message.includes("Invalid email or password") ||
        error.message.includes("incorrect")
      ) {
        toast.error("Invalid email or password. Please try again.");
      } else if (error.message.includes("User not found")) {
        toast.error("No account found with this email.");
      } else if (error.message.includes("HTTP error")) {
        toast.error("Unable to sign in. Please try again.");
      } else {
        toast.error(error.message || "An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    try {
      setIsLoading(true);

      // Add redirect URL to social login
      const state = JSON.stringify({
        type: "login",
        redirect: redirectTo,
      });

      const redirectUrl = `/api/auth/oauth/${provider}?state=${encodeURIComponent(
        state
      )}`;
      window.location.href = redirectUrl;
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast.error(`Failed to login with ${provider}. Please try again.`);
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push(`/forgot-password?redirect=${encodeURIComponent(redirectTo)}`);
  };

  const handleSignup = () => {
    router.push(`/signup?redirect=${encodeURIComponent(redirectTo)}`);
  };

  return (
    <form
      className={cn("flex flex-col gap-6 w-full", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            required
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={isLoading}
            autoComplete="email"
            className="h-11"
          />
        </Field>

        {/* Password */}
        <Field>
          <div className="flex items-center justify-between mb-2">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:underline font-medium"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            disabled={isLoading}
            autoComplete="current-password"
            className="h-11"
          />
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
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </Field>

        {/* Separator */}
        <FieldSeparator>Or continue with</FieldSeparator>

        {/* Social Login Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field>
            <Button
              variant="outline"
              type="button"
              className="w-full h-11"
              onClick={() => handleSocialLogin("google")}
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
              onClick={() => handleSocialLogin("github")}
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

        {/* Sign up Link */}
        <FieldDescription className="text-center pt-4">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={handleSignup}
            className="text-primary hover:underline font-medium"
            disabled={isLoading}
          >
            Sign Up
          </button>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
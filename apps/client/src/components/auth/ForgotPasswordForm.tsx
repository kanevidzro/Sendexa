// components/auth/ForgotPasswordForm.tsx
"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        email: email.trim(),
        redirectTo: `${window.location.origin}/reset-password`,
      };

      console.log("Sending password reset request:", submitData);

      const response = await fetch("/auth/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();
      console.log("Response:", result);

      if (response.ok) {
        setIsSubmitted(true);
        toast.success("Password reset link sent to your email!");
      } else {
        const errorMessage =
          result.error ||
          (response.status === 404
            ? "No account found with this email"
            : response.status === 429
            ? "Too many attempts. Please try again later."
            : `Failed to send reset link. Status: ${response.status}`);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);

      if (error.message.includes("No account found")) {
        toast.error("No account found with this email address.");
      } else if (error.message.includes("Too many attempts")) {
        toast.error("Too many attempts. Please wait and try again later.");
      } else {
        toast.error(
          error.message || "An unexpected error occurred. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const submitData = {
        email: email.trim(),
        redirectTo: `${window.location.origin}/reset-password`,
      };

      const response = await fetch("/auth/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        toast.success("Reset link resent to your email!");
      } else {
        const result = await response.json();
        throw new Error(
          result.error || `Failed to resend. Status: ${response.status}`
        );
      }
    } catch (error: any) {
      console.error("Resend error:", error);
      toast.error(error.message || "Failed to resend. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6 w-full max-w-md", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        {/* Back Button */}
        <div className="mb-2">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => router.push("/login")}
            disabled={isLoading}
            className="p-0 h-auto hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to login
          </Button>
        </div>

        <div className="flex flex-col items-center gap-1 text-center mb-6">
          <div className="p-3 rounded-full bg-primary/10 mb-2">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Forgot Password?</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {isSubmitted
              ? "Check your email for the reset link"
              : "Enter your email to receive a password reset link"}
          </p>
        </div>

        {!isSubmitted ? (
          <>
            {/* Email Input */}
            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
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
                    Sending reset link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </Field>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Reset link sent successfully!
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      We&apos;ve sent a password reset link to{" "}
                      <strong>{email}</strong>. Please check your inbox and
                      follow the instructions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11"
                onClick={handleResend}
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                    Resending...
                  </>
                ) : (
                  "Resend Reset Link"
                )}
              </Button>

              <Button
                type="button"
                className="w-full h-11"
                onClick={() => router.push("/login")}
                size="lg"
              >
                Return to Login
              </Button>
            </div>

            {/* Help Tips */}
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Didn&apos;t receive the email?
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Check your spam or junk folder</li>
                      <li>Make sure you entered the correct email</li>
                      <li>Wait a few minutes and try resending</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Sign up Link */}
        <FieldDescription className="text-center pt-4">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="text-primary hover:underline font-medium"
            disabled={isLoading}
          >
            Sign up
          </button>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}

// components/auth/ResetPasswordForm.tsx
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
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Lock } from "lucide-react";

interface ResetPasswordFormProps extends React.ComponentProps<"form"> {
  token?: string;
}

export function ResetPasswordForm({
  className,
  token: propToken,
  ...props
}: ResetPasswordFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  // Get token from props or URL search params
  const token = propToken || searchParams?.get("token") || "";

  useEffect(() => {
    // Extract email from token or URL if available
    const emailParam = searchParams?.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }

    // Validate token on mount
    if (token) {
      validateToken();
    } else {
      setIsTokenValid(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const validateToken = async () => {
    try {
      // Note: Your auth doesn't have a specific token validation endpoint
      // We'll assume the token is valid if present
      // The actual validation will happen when submitting the form
      if (token) {
        setIsTokenValid(true);
      } else {
        setIsTokenValid(false);
      }
    } catch (error) {
      console.error("Token validation error:", error);
      setIsTokenValid(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validatePassword = (password: string) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    // Validate password strength
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      toast.error(passwordErrors[0]);
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        newPassword: formData.password,
        token: token,
      };

      console.log("Sending password reset:", {
        token: token.substring(0, 10) + "...",
      });

      const response = await fetch("/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();
      console.log("Reset response:", result);

      if (response.ok) {
        toast.success("Password reset successfully! Redirecting to login...");

        // Clear any stored auth data
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");

        // Redirect to login after delay
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const errorMessage =
          result.error ||
          (response.status === 401
            ? "Invalid or expired reset token"
            : response.status === 422
            ? "Password does not meet requirements"
            : `Failed to reset password. Status: ${response.status}`);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("Reset password error:", error);

      if (error.message.includes("Invalid or expired")) {
        setIsTokenValid(false);
        toast.error("Invalid or expired reset link. Please request a new one.");
      } else if (error.message.includes("Password does not meet")) {
        toast.error("Password does not meet security requirements.");
      } else {
        toast.error(
          error.message || "An unexpected error occurred. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestNewLink = () => {
    router.push("/forgot-password");
  };

  if (isTokenValid === null) {
    // Loading state
    return (
      <div className="flex flex-col items-center justify-center py-8 w-full max-w-md">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading reset form...</p>
        </div>
      </div>
    );
  }

  if (isTokenValid === false) {
    // Invalid token state
    return (
      <div className="w-full max-w-md">
        <FieldGroup>
          {/* Back Button */}
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => router.push("/login")}
              className="p-0 h-auto hover:bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to login
            </Button>
          </div>

          <div className="flex flex-col items-center gap-1 text-center mb-6">
            <div className="p-3 rounded-full bg-red-100 mb-2">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold">Invalid Reset Link</h1>
            <p className="text-muted-foreground text-sm text-balance">
              This password reset link is invalid or has expired
            </p>
          </div>

          {/* Error Message */}
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Link Expired or Invalid
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    This password reset link may have been used already,
                    expired, or is invalid. Please request a new reset link.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              className="w-full h-11"
              onClick={handleRequestNewLink}
              size="lg"
            >
              Request New Reset Link
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11"
              onClick={() => router.push("/login")}
              size="lg"
            >
              Return to Login
            </Button>
          </div>
        </FieldGroup>
      </div>
    );
  }

  // Valid token state - show reset form
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
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Create New Password</h1>
          {email && (
            <p className="text-muted-foreground text-sm">
              Resetting password for:{" "}
              <span className="font-medium">{email}</span>
            </p>
          )}
          <p className="text-muted-foreground text-sm text-balance">
            Enter your new password below
          </p>
        </div>

        {/* Password Input */}
        <Field>
          <FieldLabel htmlFor="password">New Password</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            disabled={isLoading}
            autoComplete="new-password"
            minLength={8}
            className="h-11"
          />
          <FieldDescription>
            Password must be at least 8 characters long
          </FieldDescription>
        </Field>

        {/* Confirm Password Input */}
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            disabled={isLoading}
            autoComplete="new-password"
            minLength={8}
            className="h-11"
          />
        </Field>

        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-sm font-medium mb-2">Password Requirements:</p>
            <div className="space-y-2">
              {[
                {
                  test: formData.password.length >= 8,
                  text: "At least 8 characters",
                },
              ].map((req, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      req.test ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  <span
                    className={`text-xs ${
                      req.test ? "text-green-700" : "text-gray-500"
                    }`}
                  >
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

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
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </Field>

        {/* Security Note */}
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
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
              <p className="text-sm text-blue-700">
                After resetting your password, you&apos;ll need to log in again
                with your new password.
              </p>
            </div>
          </div>
        </div>
      </FieldGroup>
    </form>
  );
}

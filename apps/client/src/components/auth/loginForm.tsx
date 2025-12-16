// components/auth/LoginForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { authClient } from "@/lib/auth";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setLoading(true);
    try {
      await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
          callbackURL: "/dashboard",
        },
        {
          onSuccess: () => {
            toast.success("Successfully signed in!");
            router.push("/dashboard");
          },
          onError: (ctx) => {
            if (ctx.error.status === 403) {
              toast.error("Please verify your email address");
            } else {
              toast.error(ctx.error.message || "Sign in failed");
            }
          },
        }
      );
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialLogin(provider: "google" | "github") {
    setLoading(true);
    try {
      await authClient.signIn.social(
        { provider, callbackURL: "/dashboard" },
        {
          onSuccess: () => {
            toast.success(`Signed in with ${provider}!`);
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || `Sign in with ${provider} failed`);
          },
        }
      );
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full"
      >
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="kane@kanemt.com"
                  disabled={loading}
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between mb-2">
                <FormLabel>Password</FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11"
          disabled={loading}
          size="lg"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        {/* Separator */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-muted" />
          <span className="text-sm text-muted-foreground">
            Or continue with
          </span>
          <div className="flex-1 h-px bg-muted" />
        </div>

        {/* Social Login Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            variant="outline"
            type="button"
            className="w-full h-11"
            disabled={loading}
            onClick={() => handleSocialLogin("google")}
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
          <Button
            variant="outline"
            type="button"
            className="w-full h-11"
            disabled={loading}
            onClick={() => handleSocialLogin("github")}
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
        </div>

        {/* Sign up Link */}
        <p className="text-center pt-4 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  );
}

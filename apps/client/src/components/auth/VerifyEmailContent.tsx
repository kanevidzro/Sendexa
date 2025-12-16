// components/auth/VerifyEmailContent.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  Loader2,
  Mail,
  ArrowRight,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const token = searchParams?.get("token") || "";
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (!token) {
      setVerificationStatus("error");
      setMessage("Invalid verification link. No token provided.");
      toast.error("Invalid verification link");
      return;
    }

    verifyEmailToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const verifyEmailToken = async () => {
    try {
      const callbackURL = `${window.location.origin}/home`;
      const apiUrl = `/auth/verify-email?token=${encodeURIComponent(token)}&callbackURL=${encodeURIComponent(callbackURL)}`;

      console.log("Verifying email with token:", token.substring(0, 10) + "...");

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Accept": "application/json"
        },
      });

      const result = await response.json();
      console.log("Verification response:", result);

      if (response.ok) {
        setVerificationStatus("success");
        setUserEmail(result.user?.email || "");
        setMessage("Email verified successfully!");
        
        // Store user data if available
        if (result.user) {
          localStorage.setItem("user", JSON.stringify(result.user));
        }
        
        // Update user verification status in localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          user.emailVerified = true;
          localStorage.setItem("user", JSON.stringify(user));
        }
        
        toast.success("Email verified successfully!");
        
        // Auto-redirect after 3 seconds
        setTimeout(() => {
          router.push("/home");
        }, 3000);
      } else {
        setVerificationStatus("error");
        const errorMessage = result.error || 
                           (response.status === 400 ? "Invalid verification token" :
                            response.status === 401 ? "Unauthorized request" :
                            response.status === 422 ? "Token has expired" :
                            `Failed to verify email. Status: ${response.status}`);
        setMessage(errorMessage);
        toast.error("Verification failed");
      }
    } catch (error) {
      console.error("Email verification error:", error);
      setVerificationStatus("error");
      setMessage("An unexpected error occurred. Please try again.");
      toast.error("Verification failed");
    }
  };

  const handleResendVerification = () => {
    // Redirect to signup success page with email parameter
    if (userEmail) {
      router.push(`/signup-success?email=${encodeURIComponent(userEmail)}`);
    } else {
      router.push("/signup-success");
    }
  };

  const handleGoToDashboard = () => {
    router.push("/home");
  };

  const handleGoToLogin = () => {
    router.push("/login");
  };

  // Early return for invalid token
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardHeader>
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-red-100 mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle>Invalid Link</CardTitle>
              <CardDescription className="mt-2">
                No verification token provided
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert className="bg-red-50 border-red-200">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="ml-2">Missing Token</AlertTitle>
              <AlertDescription className="ml-2 mt-1">
                The verification link appears to be invalid or incomplete.
              </AlertDescription>
            </Alert>
            
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium text-sm">What to do next:</h4>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 pl-5 list-disc">
                <li>Check that you clicked the complete verification link from your email</li>
                <li>Try copying and pasting the link directly into your browser</li>
                <li>Request a new verification email from your account settings</li>
              </ul>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-3">
            <Button onClick={handleGoToLogin} variant="outline" className="w-full h-11">
              Go to Login
            </Button>
            
            <div className="text-center w-full">
              <p className="text-xs text-muted-foreground">
                Need help?{" "}
                <a 
                  href="mailto:support@sendexa.co" 
                  className="text-primary hover:underline"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-none">
        <CardHeader>
          <div className="flex flex-col items-center text-center">
            <div className={cn(
              "p-3 rounded-full mb-4",
              verificationStatus === "success" ? "bg-green-100" :
              verificationStatus === "error" ? "bg-red-100" :
              "bg-blue-100"
            )}>
              {verificationStatus === "success" ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : verificationStatus === "error" ? (
                <XCircle className="h-8 w-8 text-red-600" />
              ) : (
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              )}
            </div>
            
            <CardTitle>
              {verificationStatus === "success" ? "Email Verified!" :
               verificationStatus === "error" ? "Verification Failed" :
               "Verifying Email"}
            </CardTitle>
            
            <CardDescription className="mt-2">
              {verificationStatus === "success" ? "Your email has been verified successfully" :
               verificationStatus === "error" ? "We couldn't verify your email address" :
               "Please wait while we verify your email address"}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Status Message */}
          {message && (
            <Alert className={
              verificationStatus === "success" ? "bg-green-50 border-green-200" :
              verificationStatus === "error" ? "bg-red-50 border-red-200" :
              "bg-blue-50 border-blue-200"
            }>
              {verificationStatus === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : verificationStatus === "error" ? (
                <XCircle className="h-4 w-4 text-red-600" />
              ) : (
                <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
              )}
              <AlertTitle className="ml-2">
                {verificationStatus === "success" ? "Success" :
                 verificationStatus === "error" ? "Error" :
                 "Processing"}
              </AlertTitle>
              <AlertDescription className="ml-2 mt-1">
                {message}
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {verificationStatus === "loading" && (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Verifying your email address...</span>
              </div>
              <p className="text-xs text-muted-foreground">
                This should only take a moment
              </p>
            </div>
          )}

          {/* Success State */}
          {verificationStatus === "success" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                <p className="text-sm text-green-700">
                  Your account is now fully activated. You'll be redirected to your dashboard shortly.
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span>Redirecting to dashboard...</span>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {verificationStatus === "error" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-700">
                  This verification link may have expired or is invalid. 
                  Please request a new verification email.
                </p>
              </div>
            </div>
          )}

          {/* Security Note */}
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium text-sm">Security Note</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Email verification helps protect your account and ensures you receive important notifications.
              Never share verification links with anyone.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3">
          {verificationStatus === "success" && (
            <Button onClick={handleGoToDashboard} className="w-full h-11">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {verificationStatus === "error" && (
            <div className="w-full space-y-3">
              <Button onClick={handleResendVerification} className="w-full h-11">
                <Mail className="mr-2 h-4 w-4" />
                Resend Verification Email
              </Button>
              <Button onClick={handleGoToLogin} variant="outline" className="w-full h-11">
                Go to Login
              </Button>
            </div>
          )}

          {/* Support Link */}
          <div className="text-center w-full">
            <p className="text-xs text-muted-foreground">
              Need help?{" "}
              <a 
                href="mailto:support@sendexa.co" 
                className="text-primary hover:underline"
              >
                Contact Support
              </a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
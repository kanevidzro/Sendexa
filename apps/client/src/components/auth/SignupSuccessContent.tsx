// components/auth/SignupSuccessContent.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Mail, 
  ExternalLink, 
  RefreshCw,
  ArrowRight,
  Zap,
  User,
  Clock,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export function SignupSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get params from URL
  const email = searchParams?.get("email") || "";
  
  const [isLoading, setIsLoading] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds cooldown
  const [isVerified, setIsVerified] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Check if user is already verified on mount
  useEffect(() => {
    if (!email) return;

    // Check localStorage for user data
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData(user);
      if (user.email === email && user.emailVerified) {
        setIsVerified(true);
      }
    }

    // Also check from pending verification email
    const pendingEmail = localStorage.getItem("pendingVerificationEmail");
    if (pendingEmail === email) {
      // Clear the pending email since we're showing the success page
      localStorage.removeItem("pendingVerificationEmail");
    }
  }, [email]);

  // Check verification status periodically
  useEffect(() => {
    if (isVerified || !email) return;

    const checkVerification = async () => {
      setCheckingVerification(true);
      try {
        // Check localStorage first
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user.email === email && user.emailVerified) {
            setIsVerified(true);
            toast.success("Email verified successfully!");
            
            // Auto-redirect after verification
            setTimeout(() => {
              const redirectTo = searchParams?.get("redirect") || "/home";
              router.push(redirectTo);
            }, 2000);
            return;
          }
        }

        // You might want to implement an API endpoint to check verification status
        // For now, we'll rely on the user clicking the verification link
        // and being redirected to the verify-email page
      } catch (error) {
        console.error("Verification check error:", error);
      } finally {
        setCheckingVerification(false);
      }
    };

    // Initial check
    checkVerification();

    // Set up polling every 15 seconds (less frequent to reduce API calls)
    const interval = setInterval(checkVerification, 15000);

    return () => clearInterval(interval);
  }, [email, isVerified, router, searchParams]);

  const handleResendVerification = async () => {
    if (timeLeft > 0) {
      toast.error(`Please wait ${timeLeft} seconds before resending`);
      return;
    }

    if (resendCount >= 3) {
      toast.error("Too many resend attempts. Please check your spam folder or contact support.");
      return;
    }

    if (!email) {
      toast.error("Email address is required");
      return;
    }

    setIsLoading(true);
    try {
      const submitData = {
        email: email.trim(),
        callbackURL: `${window.location.origin}/verify-email`
      };

      console.log("Resending verification email:", submitData);

      const response = await fetch("/auth/send-verification-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();
      console.log("Resend response:", result);

      if (response.ok) {
        setResendCount(prev => prev + 1);
        setTimeLeft(60);
        toast.success("Verification email resent successfully!");
      } else {
        const errorMessage = result.error || 
                           (response.status === 400 ? "Invalid email address" :
                            response.status === 429 ? "Too many attempts. Please try again later." :
                            `Failed to resend verification email. Status: ${response.status}`);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      toast.error("Failed to resend verification email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEmailClient = () => {
    if (!email) return;
    const mailtoLink = `mailto:${email}`;
    window.open(mailtoLink, '_blank');
  };

  const handleContinueWithoutVerification = () => {
    toast.info("Some features may be limited until you verify your email");
    
    // Store that user is continuing without verification
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      localStorage.setItem("user_verification_pending", "true");
    }
    
    router.push("/home");
  };

  // If no email provided, try to get it from localStorage
  useEffect(() => {
    if (!email) {
      const pendingEmail = localStorage.getItem("pendingVerificationEmail");
      if (pendingEmail) {
        // Update URL with email parameter
        router.replace(`/signup-success?email=${encodeURIComponent(pendingEmail)}`);
      }
    }
  }, [email, router]);

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardHeader>
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-red-100 mb-4">
                <HelpCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle>Missing Information</CardTitle>
              <CardDescription>
                No email address provided. Please complete the signup process.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>Invalid Request</AlertTitle>
              <AlertDescription>
                Unable to load verification page. Please return to signup.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => router.push("/signup")} 
              className="w-full h-11"
            >
              Return to Signup
            </Button>
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
              isVerified ? "bg-green-100" : "bg-primary/10"
            )}>
              {isVerified ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <Mail className="h-8 w-8 text-primary" />
              )}
            </div>
            
            <CardTitle>
              {isVerified ? "Email Verified!" : "Check Your Email"}
            </CardTitle>
            
            <CardDescription className="mt-2 space-y-2">
              {isVerified ? (
                <p>Your email has been verified successfully!</p>
              ) : (
                <>
                  <p>We've sent a verification link to</p>
                  <p className="font-medium text-primary break-all">{email}</p>
                </>
              )}
              
              {userData?.name && (
                <Badge variant="outline" className="inline-flex items-center gap-1 mt-2">
                  <User className="h-3 w-3" />
                  {userData.name}
                </Badge>
              )}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!isVerified ? (
            <>
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Verification Progress</span>
                  <span className="font-medium">Step 1 of 2</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>

              {/* Instructions */}
              <Alert>
                <div className="space-y-3">
                  <AlertTitle className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Next Steps:
                  </AlertTitle>
                  <AlertDescription className="space-y-2">
                    <ol className="list-decimal list-inside space-y-2 pl-2">
                      <li>Open your email inbox</li>
                      <li>Find the email from <strong>noreply@sendexa.co</strong></li>
                      <li>Click the verification link in the email</li>
                      <li>Return here to continue</li>
                    </ol>
                  </AlertDescription>
                </div>
              </Alert>

              {/* Email Client Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleOpenEmailClient}
                  className="flex items-center gap-2 h-11"
                  disabled={!email}
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Email
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResendVerification}
                  disabled={isLoading || timeLeft > 0 || resendCount >= 3 || !email}
                  className="flex items-center gap-2 h-11"
                >
                  <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                  {isLoading ? "Sending..." : "Resend Email"}
                </Button>
              </div>

              {/* Resend Info */}
              {timeLeft > 0 && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Resend available in {timeLeft}s</span>
                </div>
              )}

              {/* Spam Folder Note */}
              <Alert variant="default" className="bg-amber-50 border-amber-200">
                <HelpCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle>Can't find the email?</AlertTitle>
                <AlertDescription className="text-sm">
                  Check your spam or junk folder. If you still can't find it,{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary"
                    onClick={handleResendVerification}
                    disabled={isLoading || timeLeft > 0 || resendCount >= 3}
                  >
                    click here to resend
                  </Button>
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <>
              {/* Success State */}
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Verification Complete!</AlertTitle>
                <AlertDescription>
                  Your email has been verified successfully. You now have full access to your account.
                </AlertDescription>
              </Alert>

              {/* Redirecting Message */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span>Redirecting to dashboard...</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  If you're not redirected automatically, click the button below
                </p>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <Separator />
          <div className="w-full space-y-3">
            {!isVerified && (
              <Button
                variant="outline"
                onClick={handleContinueWithoutVerification}
                className="w-full h-11"
              >
                Continue Without Verification
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            <Button
              onClick={() => {
                if (isVerified) {
                  router.push("/home");
                } else {
                  // Refresh the page to check verification status
                  window.location.reload();
                }
              }}
              className="w-full h-11"
              disabled={checkingVerification}
            >
              {checkingVerification ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Checking Verification...
                </>
              ) : isVerified ? (
                "Go to Dashboard"
              ) : (
                "I've Verified My Email"
              )}
            </Button>
          </div>

          {/* Support Link */}
          <div className="text-center">
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
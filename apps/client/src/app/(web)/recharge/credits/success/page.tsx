// app/credits/success/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import Link from "next/link";

// Define proper type for invoice
interface Invoice {
  invoiceId: string;
  amount: number;
  date?: string;
}

function CreditPurchaseSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState<"checking" | "success" | "failed">("checking");
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (reference) {
      checkPaymentStatus();
    } else {
      setStatus("failed");
      setErrorMessage("No payment reference found");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(
        `/api/payments/sms/status?clientReference=${reference}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();

      if (result.success) {
        setInvoice(result.invoice);
        setBalance(result.balance || 0);

        if (result.status === "completed") {
          setStatus("success");
        } else if (result.status === "failed" || result.status === "cancelled") {
          setStatus("failed");
          setErrorMessage(result.message || "Payment was not completed");
        } else {
          // Keep checking every 3 seconds if still processing
          setTimeout(checkPaymentStatus, 3000);
        }
      } else {
        setStatus("failed");
        setErrorMessage(result.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Status check error:", error);
      setStatus("failed");
      setErrorMessage("Failed to verify payment status. Please check your internet connection.");
    }
  };

  // Show loading state while checking reference
  if (!reference && status === "checking") {
    return (
      <div className="container max-w-2xl mx-auto py-12">
        <div className="my-8 p-6 border rounded-lg text-center space-y-6 bg-white shadow-sm">
          <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto" />
          <p className="text-lg">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-12">
      <h1 className="text-2xl font-semibold text-center mb-8">
        Payment Status
      </h1>

      <div className="my-8 p-6 border rounded-lg text-center space-y-6 bg-white shadow-sm">
        {status === "checking" && (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto" />
            <p className="text-lg">Verifying your payment...</p>
            <p className="text-sm text-muted-foreground">
              Please wait while we confirm your transaction.
            </p>
            {reference && (
              <p className="text-xs text-muted-foreground">
                Reference: {reference}
              </p>
            )}
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-green-600">
              Payment Successful!
            </h2>
            <p className="text-lg">
              You have successfully purchased SMS credits.
            </p>

            {invoice && (
              <div className="bg-muted p-4 rounded-lg text-left space-y-2">
                <p>
                  <strong>Invoice ID:</strong> {invoice.invoiceId}
                </p>
                <p>
                  <strong>Amount:</strong> GHS {invoice.amount?.toFixed(2)}
                </p>
                <p>
                  <strong>New Balance:</strong>{" "}
                  {balance.toLocaleString()} SMS credits
                </p>
                {invoice.date && (
                  <p>
                    <strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/home">Go to Dashboard</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/credits/buy">Buy More Credits</Link>
              </Button>
            </div>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-red-600">Payment Failed</h2>
            <p className="text-lg">
              {errorMessage || "We couldn't process your payment. Please try again."}
            </p>
            
            {reference && (
              <div className="bg-red-50 p-4 rounded-lg text-left">
                <p className="text-sm">
                  <strong>Reference:</strong> {reference}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  If this seems like an error, please contact support with the reference above.
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild>
                <Link href="/credits/buy">Try Again</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/home">Go to Dashboard</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Loading fallback component
function PaymentStatusFallback() {
  return (
    <div className="container max-w-2xl mx-auto py-12">
      <div className="my-8 p-6 border rounded-lg text-center space-y-6 bg-white shadow-sm">
        <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto" />
        <p className="text-lg">Loading payment status...</p>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function CreditPurchaseSuccess() {
  return (
    <Suspense fallback={<PaymentStatusFallback />}>
      <CreditPurchaseSuccessContent />
    </Suspense>
  );
}
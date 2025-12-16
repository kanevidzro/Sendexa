/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/sms/credits/purchase/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CreditCard,
  Smartphone,
  Shield,
  Check,
  Info,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  supportedCurrencies: string[];
  icon: string;
  isActive: boolean;
  description: string;
}

interface CreditPackage {
  id: string;
  amount: number;
  credits: number;
  pricePerCredit: number;
}

interface PricingTier {
  minCredits: number;
  maxCredits: number;
  pricePerCredit: number;
  description: string;
}

export default function PurchaseCreditsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);

  // Clean packages without bonus - volume discounts are built into pricing tiers
  const defaultPackages: CreditPackage[] = [
    { id: "basic", amount: 50, credits: 1562, pricePerCredit: 0.032 },
    { id: "standard", amount: 100, credits: 3333, pricePerCredit: 0.03 },
    { id: "premium", amount: 200, credits: 7142, pricePerCredit: 0.028 },
    { id: "enterprise", amount: 500, credits: 19230, pricePerCredit: 0.026 },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchPaymentMethods();
      fetchPricingTiers();
    }
  }, [isAuthenticated]);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch("/api/wallet/payment/methods", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch payment methods");
      }

      if (result.success) {
        setPaymentMethods(result.data.paymentMethods);
        // Auto-select first active method
        const firstActive = result.data.paymentMethods.find(
          (method: PaymentMethod) => method.isActive
        );
        if (firstActive) {
          setSelectedMethod(firstActive.id);
        }
      } else {
        throw new Error(result.error || "Failed to fetch payment methods");
      }
    } catch (error: any) {
      console.error("Error fetching payment methods:", error);
      toast.error(error.message || "Failed to fetch payment methods");
    } finally {
      setLoading(false);
    }
  };

  const fetchPricingTiers = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        return;
      }

      const tiers: PricingTier[] = [
        {
          minCredits: 1,
          maxCredits: 2999,
          pricePerCredit: 0.032,
          description: "Standard Tier (1-2,999 credits)",
        },
        {
          minCredits: 3000,
          maxCredits: 10000,
          pricePerCredit: 0.03,
          description: "Bronze Tier (3,000-10,000 credits)",
        },
        {
          minCredits: 10001,
          maxCredits: 80000,
          pricePerCredit: 0.028,
          description: "Silver Tier (10,001-80,000 credits)",
        },
        {
          minCredits: 80001,
          maxCredits: Infinity,
          pricePerCredit: 0.026,
          description: "Gold Tier (80,001+ credits)",
        },
      ];

      setPricingTiers(tiers);
    } catch (error: any) {
      console.error("Error fetching pricing tiers:", error);
    }
  };

  const calculateCustomCredits = (amount: number) => {
    if (amount <= 0) return { credits: 0, pricePerCredit: 0 };

    // Find the appropriate tier for the amount
    let tier = pricingTiers[0];
    for (const t of pricingTiers) {
      const tierCredits = Math.floor(amount / t.pricePerCredit);
      if (tierCredits >= t.minCredits) {
        tier = t;
      }
    }

    if (!tier) tier = pricingTiers[pricingTiers.length - 1];

    const credits = Math.floor(amount / tier.pricePerCredit);
    return {
      credits: Math.min(
        credits,
        tier.maxCredits === Infinity ? credits : tier.maxCredits
      ),
      pricePerCredit: tier.pricePerCredit,
    };
  };

  const handlePurchase = async () => {
    const amount = selectedPackage
      ? defaultPackages.find((pkg) => pkg.id === selectedPackage)?.amount
      : parseFloat(customAmount);

    if (!amount || amount <= 0) {
      toast.error("Please select a package or enter a valid amount");
      return;
    }

    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    try {
      setProcessing(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          paymentMethod: selectedMethod,
          type: "SMS_CREDITS",
          description: `Purchase of ${amount} GHS SMS credits`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to initiate payment");
      }

      if (result.success) {
        // Redirect to payment gateway
        if (result.data.checkoutUrl) {
          window.location.href = result.data.checkoutUrl;
        } else {
          toast.success("Payment initiated successfully");
        }
      } else {
        throw new Error(result.error || "Failed to initiate payment");
      }
    } catch (error: any) {
      console.error("Error initiating payment:", error);
      toast.error(error.message || "Failed to initiate payment");
    } finally {
      setProcessing(false);
    }
  };

  const getMethodIcon = (methodId: string) => {
    switch (methodId) {
      case "hubtel":
        return <Smartphone className="h-5 w-5" />;
      case "paystack":
        return <CreditCard className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const customCredits = customAmount
    ? calculateCustomCredits(parseFloat(customAmount))
    : { credits: 0, pricePerCredit: 0 };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading authentication...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Authentication Required</p>
          <p className="text-muted-foreground">
            Please log in to purchase credits
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Buy SMS Credits</h1>
        <p className="text-muted-foreground">
          Purchase SMS credits for your business. Volume discounts automatically applied.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Credit Packages */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Credit Packages</CardTitle>
              <CardDescription>
                Select a package based on your business needs. Better rates for higher volumes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {defaultPackages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={`relative cursor-pointer transition-all hover:shadow-md ${
                      selectedPackage === pkg.id
                        ? "ring-2 ring-primary border-primary"
                        : "border-2"
                    }`}
                    onClick={() => {
                      setSelectedPackage(pkg.id);
                      setCustomAmount("");
                    }}
                  >
                    <CardContent className="p-6">
                      {/* Rate Badge */}
                      <div className="flex justify-end mb-4">
                        <Badge variant="secondary" className="text-xs">
                          {pkg.pricePerCredit.toFixed(3)}/credit
                        </Badge>
                      </div>

                      {/* Package Info */}
                      <div className="text-center space-y-3">
                        <div className="flex justify-center items-baseline gap-1">
                          <span className="text-3xl font-bold">
                            GHS {pkg.amount}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-2xl font-bold text-primary">
                              {pkg.credits.toLocaleString()}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              credits
                            </span>
                          </div>
                        </div>

                        {selectedPackage === pkg.id && (
                          <div className="flex items-center justify-center text-sm text-primary">
                            <Check className="w-4 h-4 mr-1" />
                            Selected
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="mt-6 p-4 border rounded-lg">
                <Label htmlFor="customAmount" className="text-sm font-medium">
                  Or enter custom amount (GHS)
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="customAmount"
                    type="number"
                    placeholder="Enter amount in GHS"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedPackage("");
                    }}
                    min="1"
                    step="0.01"
                  />
                </div>
                {customAmount && parseFloat(customAmount) > 0 && (
                  <div className="mt-2 text-sm space-y-1">
                    <div className="text-muted-foreground">
                      Estimated credits:{" "}
                      <strong>
                        {customCredits.credits.toLocaleString()}
                      </strong>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Rate: {customCredits.pricePerCredit.toFixed(3)} GHS per credit
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing Tiers Info */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Volume Pricing</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {pricingTiers.map((tier, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-muted-foreground">
                        {tier.minCredits.toLocaleString()}
                        {tier.maxCredits !== Infinity
                          ? `-${tier.maxCredits.toLocaleString()}`
                          : "+"}{" "}
                        credits:
                      </span>
                      <span className="font-medium">
                        {tier.pricePerCredit.toFixed(3)} GHS/credit
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose your preferred payment method</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                <RadioGroup
                  value={selectedMethod}
                  onValueChange={setSelectedMethod}
                  className="space-y-4"
                >
                  {paymentMethods
                    .filter((method) => method.isActive)
                    .map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center space-x-4"
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label
                          htmlFor={method.id}
                          className="flex flex-1 items-center p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                              {getMethodIcon(method.id)}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{method.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {method.description}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {method.supportedCurrencies.map((currency) => (
                              <Badge
                                key={currency}
                                variant="outline"
                                className="text-xs"
                              >
                                {currency}
                              </Badge>
                            ))}
                          </div>
                        </Label>
                      </div>
                    ))}
                </RadioGroup>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selected Package */}
              {selectedPackage && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Package:</span>
                    <span className="font-medium">
                      {
                        defaultPackages.find((p) => p.id === selectedPackage)
                          ?.amount
                      }{" "}
                      GHS
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Credits:</span>
                    <span>
                      {defaultPackages
                        .find((p) => p.id === selectedPackage)
                        ?.credits.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span>Rate:</span>
                    <span>
                      {defaultPackages
                        .find((p) => p.id === selectedPackage)
                        ?.pricePerCredit.toFixed(3)}{" "}
                      GHS/credit
                    </span>
                  </div>
                </div>
              )}

              {/* Custom Amount */}
              {customAmount && parseFloat(customAmount) > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Amount:</span>
                    <span className="font-medium">
                      {parseFloat(customAmount)} GHS
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Estimated Credits:</span>
                    <span>{customCredits.credits.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span>Rate:</span>
                    <span>
                      {customCredits.pricePerCredit.toFixed(3)} GHS/credit
                    </span>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              {selectedMethod && (
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span>Payment Method:</span>
                  <span className="font-medium">
                    {paymentMethods.find((m) => m.id === selectedMethod)?.name}
                  </span>
                </div>
              )}

              {/* Security Notice */}
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Secure Payment</div>
                    <div className="text-muted-foreground">
                      Your payment is processed securely through our trusted
                      payment partners.
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handlePurchase}
                disabled={
                  processing ||
                  (!selectedPackage && !customAmount) ||
                  !selectedMethod
                }
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Payment
                  </>
                )}
              </Button>

              {/* Cost Info */}
              <div className="text-xs text-muted-foreground text-center space-y-1">
                <div>Volume discounts automatically applied</div>
                <div>No hidden fees • Instant activation</div>
              </div>
            </CardContent>
          </Card>

          {/* Support Info */}
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <div className="font-medium">Need help with payment?</div>
                <div>Contact our support team for assistance.</div>
                <Button variant="link" className="p-0 h-auto text-primary">
                  support@sendexa.co
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
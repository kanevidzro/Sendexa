/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/sms/wallet/page.tsx
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
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Loader2,
  CreditCard,
  Wallet,
  Send,
  RefreshCw,
  ArrowRightLeft,
  Smartphone,
  Shield,
  Check,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface WalletData {
  balances: {
    smsBalance: number;
    walletBalance: number;
    currency: string;
  };
}

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  supportedCurrencies: string[];
  icon: string;
  isActive: boolean;
  description: string;
}

interface TopupPackage {
  id: string;
  amount: number;
  bonus?: number;
  description: string;
  popular?: boolean;
}

export default function WalletPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [topupAmount, setTopupAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  // Professional topup packages
  const topupPackages: TopupPackage[] = [
    {
      id: "starter",
      amount: 50,
      description: "Perfect for small businesses",
    },
    {
      id: "growth",
      amount: 100,
      description: "Ideal for growing businesses",
      popular: true,
    },
    {
      id: "premium",
      amount: 200,
      description: "For established businesses",
    },
    {
      id: "enterprise",
      amount: 500,
      description: "Maximum flexibility",
    },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchWalletData();
      fetchPaymentMethods();
    }
  }, [isAuthenticated]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch("/api/wallet/overview", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch wallet data");
      }

      if (result.success) {
        setWalletData(result.data);
      } else {
        throw new Error(result.error || "Failed to fetch wallet data");
      }
    } catch (error: any) {
      console.error("Error fetching wallet data:", error);
      toast.error(error.message || "Failed to fetch wallet data");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        return;
      }

      const response = await fetch("/api/wallet/payment/methods", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setPaymentMethods(result.data.paymentMethods);
        // Auto-select first active method
        const firstActive = result.data.paymentMethods.find(
          (method: PaymentMethod) => method.isActive
        );
        if (firstActive) {
          setSelectedMethod(firstActive.id);
        }
      }
    } catch (error: any) {
      console.error("Error fetching payment methods:", error);
    }
  };

  const handleTopup = async () => {
    const amount = parseFloat(topupAmount);

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
          type: "WALLET_TOPUP",
          description: `Wallet topup of ${amount} GHS`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to initiate topup");
      }

      if (result.success) {
        if (result.data.checkoutUrl) {
          window.location.href = result.data.checkoutUrl;
        } else {
          toast.success("Topup initiated successfully");
          fetchWalletData();
          setTopupAmount("");
        }
      } else {
        throw new Error(result.error || "Failed to initiate topup");
      }
    } catch (error: any) {
      console.error("Error initiating topup:", error);
      toast.error(error.message || "Failed to initiate topup");
    } finally {
      setProcessing(false);
    }
  };

  const handleTransfer = async () => {
    const amount = parseFloat(transferAmount);

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!walletData || walletData.balances.walletBalance < amount) {
      toast.error("Insufficient wallet balance");
      return;
    }

    try {
      setTransferring(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch("/api/credit/transfer/sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          description: "Transfer to SMS account",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to transfer funds");
      }

      if (result.success) {
        toast.success("Funds transferred successfully");
        fetchWalletData();
        setTransferAmount("");
      } else {
        throw new Error(result.error || "Failed to transfer funds");
      }
    } catch (error: any) {
      console.error("Error transferring funds:", error);
      toast.error(error.message || "Failed to transfer funds");
    } finally {
      setTransferring(false);
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

  const formatCurrency = (amount: number, currency: string = "GHS") => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

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
            Please log in to access your wallet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Wallet Management</h1>
        <p className="text-muted-foreground">
          Manage your wallet balance, top up funds, and transfer to SMS credits
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Balance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-semibold">Wallet Balance</CardTitle>
                <Wallet className="h-6 w-6 text-blue-600" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-blue-600">
                      {formatCurrency(walletData?.balances.walletBalance || 0)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Available for transfers and payments
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-semibold">SMS Credits</CardTitle>
                <Send className="h-6 w-6 text-green-600" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-green-600">
                      {walletData?.balances.smsBalance.toLocaleString() || 0}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Available for sending messages
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top Up Packages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Up Packages</CardTitle>
              <CardDescription>
                Choose a package that fits your needs. Instant activation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topupPackages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={`relative cursor-pointer transition-all hover:shadow-md ${
                      topupAmount === pkg.amount.toString()
                        ? "ring-2 ring-primary border-primary"
                        : "border-2"
                    }`}
                    onClick={() => {
                      setTopupAmount(pkg.amount.toString());
                    }}
                  >
                    {pkg.popular && (
                      <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    <CardContent className="p-6">
                      <div className="text-center space-y-3">
                        <div className="flex justify-center items-baseline gap-1">
                          <span className="text-3xl font-bold">
                            {formatCurrency(pkg.amount)}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">
                            {pkg.description}
                          </div>
                        </div>

                        {topupAmount === pkg.amount.toString() && (
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
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(e.target.value)}
                    min="1"
                    step="0.01"
                  />
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
              {paymentMethods.length === 0 ? (
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Top Up Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selected Amount */}
              {topupAmount && parseFloat(topupAmount) > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Amount:</span>
                    <span className="font-medium">
                      {formatCurrency(parseFloat(topupAmount))}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span>Payment Method:</span>
                    <span className="font-medium">
                      {paymentMethods.find((m) => m.id === selectedMethod)?.name || "Not selected"}
                    </span>
                  </div>
                </div>
              )}

              {/* Transfer Section */}
              <div className="pt-4 border-t">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <ArrowRightLeft className="h-4 w-4" />
                    Transfer to SMS
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="transferAmount" className="text-xs">Amount (GHS)</Label>
                    <Input
                      id="transferAmount"
                      type="number"
                      placeholder="Enter amount"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      min="1"
                      step="0.01"
                      max={walletData?.balances.walletBalance}
                      className="h-8 text-sm"
                    />
                    <div className="text-xs text-muted-foreground">
                      Available: {formatCurrency(walletData?.balances.walletBalance || 0)}
                    </div>
                  </div>

                  {transferAmount && parseFloat(transferAmount) > 0 && (
                    <div className="p-2 bg-blue-50 rounded text-xs">
                      <div className="font-medium text-blue-900">
                        Estimated credits:{" "}
                        <Badge variant="secondary" className="ml-1">
                          {Math.floor(parseFloat(transferAmount) / 0.032).toLocaleString()}
                        </Badge>
                      </div>
                      <div className="text-blue-700 mt-1">
                        Rate: 0.032 GHS per credit
                      </div>
                    </div>
                  )}

                  <Button
                    size="sm"
                    className="w-full"
                    onClick={handleTransfer}
                    disabled={
                      transferring ||
                      !transferAmount ||
                      parseFloat(transferAmount) <= 0 ||
                      !walletData ||
                      walletData.balances.walletBalance < parseFloat(transferAmount)
                    }
                  >
                    {transferring ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Transferring...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-3 w-3" />
                        Transfer to SMS
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Security Notice */}
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Secure Payment</div>
                    <div className="text-muted-foreground">
                      Your payment is processed securely through trusted partners.
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Up Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleTopup}
                disabled={
                  processing ||
                  !topupAmount ||
                  parseFloat(topupAmount) <= 0 ||
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
                <div>Instant activation • No hidden fees</div>
                <div>Flexible wallet management</div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Card */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Wallet Benefits</span>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Instant transfers to SMS credits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Use for multiple services</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Better budget control</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Secure payment methods</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Info */}
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <div className="font-medium">Need assistance?</div>
                <div>Our support team is here to help you.</div>
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
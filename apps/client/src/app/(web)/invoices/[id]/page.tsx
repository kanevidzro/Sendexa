/* eslint-disable @typescript-eslint/no-explicit-any */
// app/credits/invoices/view/[id]/page.tsx
"use client";

import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  ChevronLeft,
  Printer,
  ReceiptText,
  RefreshCw,
  CreditCard,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Download,
  Building,
  Mail,
  Globe,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceId: string;
  date: string;
  amount: number;
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED" | "REFUNDED" | "FAILED";
  type: "SMS" | "SMS_CREDITS" | "SUBSCRIPTION" | "CREDIT_TOPUP" | "OTHER";
  description?: string;
  items?: InvoiceItem[];
  paymentMethod?: string;
  transactionId?: string;
  billingAddress?: string;
  businessId: string;
  createdAt: string;
}

interface BusinessProfile {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  website?: string;
  businessType?: string;
  businessSector?: string;
  country: string;
  logo?: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    invoice: Invoice;
  };
}

interface BusinessProfileResponse {
  success: boolean;
  data: {
    business: BusinessProfile;
  };
}

interface PaymentResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    paymentUrl: string;
    reference: string;
    provider: string;
    amount: number;
    invoiceId: string;
    creditCalculation?: {
      credits: number;
      pricePerCredit: number;
      tier: {
        name: string;
        description: string;
      };
    };
  };
}

const getStatusBadge = (status: Invoice["status"]) => {
  const statusConfig = {
    PAID: { variant: "success" as const, label: "Paid", icon: CheckCircle2 },
    PENDING: {
      variant: "secondary" as const,
      label: "Pending",
      icon: RefreshCw,
    },
    OVERDUE: {
      variant: "destructive" as const,
      label: "Overdue",
      icon: AlertTriangle,
    },
    CANCELLED: {
      variant: "outline" as const,
      label: "Cancelled",
      icon: XCircle,
    },
    REFUNDED: {
      variant: "outline" as const,
      label: "Refunded",
      icon: CheckCircle2,
    },
    FAILED: { variant: "destructive" as const, label: "Failed", icon: XCircle },
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className="flex items-center gap-1 font-medium"
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

const getTypeDisplay = (type: Invoice["type"]) => {
  const typeConfig = {
    SMS: "SMS Services",
    SMS_CREDITS: "SMS Credits",
    SUBSCRIPTION: "Subscription",
    CREDIT_TOPUP: "Credit Top-up",
    OTHER: "Other Services",
  };

  return typeConfig[type] || type;
};

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [businessProfile, setBusinessProfile] =
    useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const fetchInvoice = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Please login again");
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/invoice/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return notFound();
        }
        throw new Error("Failed to fetch invoice");
      }

      const data: ApiResponse = await response.json();
      setInvoice(data.data.invoice);

      // Fetch business profile after getting invoice
      await fetchBusinessProfile(token);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast.error("Failed to load invoice details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBusinessProfile = async (token: string) => {
    try {
      const response = await fetch("/api/business/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: BusinessProfileResponse = await response.json();
        if (data.success) {
          setBusinessProfile(data.data.business);
        }
      }
    } catch (error) {
      console.error("Error fetching business profile:", error);
      // Don't show error toast for business profile as it's secondary
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchInvoice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handlePayInvoice = async () => {
    if (!invoice) return;

    try {
      setIsProcessing(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Please login again");
        router.push("/login");
        return;
      }

      // Use the new invoice payment endpoint
      const response = await fetch(`/api/invoice/${invoice.id}/pay`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod: "paystack", // or "hubtel" based on user preference
        }),
      });

      const result: PaymentResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to process payment");
      }

      if (result.data?.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = result.data.paymentUrl;
      } else {
        toast.error("No payment URL received");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteInvoice = async () => {
    if (!invoice) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Please login again");
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/invoice/${invoice.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete invoice");
      }

      toast.success("Invoice deleted successfully");
      router.push("/invoices");
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error("Failed to delete invoice");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById("invoice-print-area");
    const originalContents = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload to restore functionality
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const response = await fetch(`/api/invoice/${params.id}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoice?.invoiceId || params.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Invoice downloaded successfully");
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error("Failed to download invoice");
    }
  };

  const handleRefresh = () => {
    fetchInvoice();
  };

  const canPay = invoice && ["PENDING", "OVERDUE"].includes(invoice.status);
  const canDelete =
    invoice && ["FAILED", "CANCELLED", "PENDING"].includes(invoice.status);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Default items if not provided by API
  const invoiceItems =
    invoice?.items ||
    (invoice
      ? [
          {
            description: invoice.description || getTypeDisplay(invoice.type),
            quantity: 1,
            unitPrice: invoice.amount,
            total: invoice.amount,
          },
        ]
      : []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/invoices">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="border-b">
            <div className="flex justify-between items-start">
              <div>
                <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="h-6 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 2 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardHeader>
            </Card>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invoice) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Process Payment
            </DialogTitle>
            <DialogDescription>
              You are about to pay {formatCurrency(invoice.amount)} for invoice
              #{invoice.invoiceId}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Invoice Total:</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(invoice.amount)}
                </span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              You will be redirected to our secure payment gateway to complete
              the transaction.
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPaymentDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayInvoice}
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Pay Now
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Invoice
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete invoice #{invoice.invoiceId}? This
              action cannot be undone.
              <div className="mt-2 p-3 bg-destructive/10 rounded-lg">
                <div className="font-medium">Invoice Details:</div>
                <div>Amount: {formatCurrency(invoice.amount)}</div>
                <div>Type: {getTypeDisplay(invoice.type)}</div>
                <div>Date: {formatDate(invoice.date)}</div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInvoice}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Invoice
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-between gap-4 print:hidden">
        <Button variant="outline" size="icon" asChild>
          <Link href="/invoices">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex gap-2">
          {canPay && (
            <Button
              onClick={() => setShowPaymentDialog(true)}
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Pay Invoice
            </Button>
          )}
          {canDelete && (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Print Area */}
      <div id="invoice-print-area">
        <Card className="print:shadow-none print:border-none print:break-inside-avoid">
          <CardHeader className="border-b print:border-b-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">
                  Invoice #{invoice.invoiceId}
                </CardTitle>
                <CardDescription className="mt-2">
                  Issued on {formatDate(invoice.date)}
                  {invoice.status === "OVERDUE" && (
                    <Badge variant="destructive" className="ml-2">
                      Payment Overdue
                    </Badge>
                  )}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <ReceiptText className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold">Sendexa LLC</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Status Alert - Hidden in print */}
            <div className="print:hidden">
              {invoice.status === "PENDING" && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Payment Required</span>
                  </div>
                  <p className="text-sm text-amber-700 mt-1">
                    This invoice is pending payment. Please complete the payment
                    to avoid service interruption.
                  </p>
                </div>
              )}

              {invoice.status === "OVERDUE" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Payment Overdue</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    This invoice is overdue. Please make payment immediately to
                    restore your services.
                  </p>
                </div>
              )}

              {invoice.status === "FAILED" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <XCircle className="h-4 w-4" />
                    <span className="font-medium">Payment Failed</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    The payment for this invoice failed. You can delete this
                    invoice or contact support for assistance.
                  </p>
                </div>
              )}

              {invoice.status === "PAID" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-medium">Payment Completed</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    This invoice has been paid successfully. Thank you for your
                    business!
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* From Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  From
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="font-semibold">Sendexa LLC</div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Accra, Ghana
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    billing@sendexa.co
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    www.sendexa.co
                  </div>
                </div>
              </div>

              {/* Bill To Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Bill To</h3>
                <div className="space-y-2 text-sm">
                  {businessProfile ? (
                    <>
                      <div className="font-semibold">
                        {businessProfile.name}
                      </div>
                      {businessProfile.email && (
                        <div className="text-muted-foreground">
                          {businessProfile.email}
                        </div>
                      )}
                      {businessProfile.phone && (
                        <div className="text-muted-foreground">
                          {businessProfile.phone}
                        </div>
                      )}
                      {businessProfile.address && (
                        <div className="text-muted-foreground">
                          {businessProfile.address}
                        </div>
                      )}
                      {businessProfile.businessType && (
                        <div className="text-muted-foreground capitalize">
                          {businessProfile.businessType.toLowerCase()}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-muted-foreground">
                      Loading business information...
                    </div>
                  )}
                </div>
              </div>

              {/* Invoice Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Invoice Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                    <span>{getStatusBadge(invoice.status)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Invoice Date
                    </span>
                    <span className="font-medium">
                      {formatDate(invoice.date)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Due Date
                    </span>
                    <span className="font-medium">
                      {(() => {
                        const invoiceDate = new Date(invoice.date);
                        if (isNaN(invoiceDate.getTime())) {
                          return "Invalid date";
                        }
                        const dueDate = new Date(
                          invoiceDate.getTime() + 7 * 24 * 60 * 60 * 1000
                        );
                        return formatDate(dueDate.toISOString());
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Invoice Type
                    </span>
                    <span className="font-medium">
                      {getTypeDisplay(invoice.type)}
                    </span>
                  </div>
                  {invoice.paymentMethod && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Payment Method
                      </span>
                      <span className="font-medium">
                        {invoice.paymentMethod}
                      </span>
                    </div>
                  )}
                  {invoice.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Transaction ID
                      </span>
                      <span className="font-medium text-xs">
                        {invoice.transactionId}
                      </span>
                    </div>
                  )}
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">
                        Total Amount
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(invoice.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Items Table */}
            <Card>
              <CardHeader className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Description</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {item.description}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50">
                      <TableCell
                        colSpan={3}
                        className="text-right font-semibold text-lg"
                      >
                        Total Amount
                      </TableCell>
                      <TableCell className="text-right font-semibold text-lg">
                        {formatCurrency(invoice.amount)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardHeader>
            </Card>

            {/* Additional Information */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Payment Instructions</h4>
                <p className="text-sm text-muted-foreground">
                  Thank you for your business. This invoice is{" "}
                  {invoice.status === "PAID" ? "paid" : "due upon receipt"}.
                  {!["PAID", "REFUNDED"].includes(invoice.status) &&
                    " Please make payment within 7 days to avoid service interruption."}
                </p>
                {invoice.status === "PAID" && invoice.transactionId && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Transaction ID: {invoice.transactionId}
                  </p>
                )}
              </div>

              {invoice.description && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold mb-2 text-blue-900">
                    Description
                  </h4>
                  <p className="text-sm text-blue-800">{invoice.description}</p>
                </div>
              )}
            </div>

            {/* Invoice Metadata */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <div>Invoice created: {formatDateTime(invoice.createdAt)}</div>
                <div>Invoice ID: {invoice.id}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-print-area,
          #invoice-print-area * {
            visibility: visible;
          }
          #invoice-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
          .print\\:border-b-2 {
            border-bottom-width: 2px !important;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}

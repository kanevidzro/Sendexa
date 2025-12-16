/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { 
  Download, 
  Search, 
  
  Receipt, 
  Eye, 
  RefreshCw,
  FileText,

  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Invoice {
  id: string;
  invoiceId: string;
  date: string;
  amount: number;
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED" | "REFUNDED";
  type: "SMS" | "SMS_CREDITS" | "SUBSCRIPTION" | "CREDIT_TOPUP" | "OTHER";
  description?: string;
  createdAt: string;
}

interface InvoiceStats {
  period: string;
  summary: {
    totalInvoices: number;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    overdueAmount: number;
    paidPercentage: number;
  };
  byType: {
    [key: string]: {
      count: number;
      amount: number;
    };
  };
  statusBreakdown: {
    PENDING: number;
    PAID: number;
    OVERDUE: number;
    CANCELLED: number;
    REFUNDED: number;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface InvoicesResponse {
  success: boolean;
  data: {
    invoices: Invoice[];
    pagination: PaginationInfo;
  };
}

interface InvoiceStatsResponse {
  success: boolean;
  data: InvoiceStats;
}

const getStatusBadge = (status: Invoice["status"]) => {
  const statusConfig = {
    PAID: { variant: "success" as const, label: "Paid", icon: CheckCircle },
    PENDING: { variant: "secondary" as const, label: "Pending", icon: Clock },
    OVERDUE: { variant: "destructive" as const, label: "Overdue", icon: Clock },
    CANCELLED: { variant: "outline" as const, label: "Cancelled", icon: XCircle },
    REFUNDED: { variant: "outline" as const, label: "Refunded", icon: CheckCircle },
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1 font-medium">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

const getTypeBadge = (type: Invoice["type"]) => {
  const typeConfig = {
    SMS: { variant: "default" as const, label: "SMS" },
    SMS_CREDITS: { variant: "secondary" as const, label: "SMS_CREDITS" },
    SUBSCRIPTION: { variant: "outline" as const, label: "Subscription" },
    CREDIT_TOPUP: { variant: "success" as const, label: "Credit Top-up" },
    OTHER: { variant: "outline" as const, label: "Other" }
  };

  const config = typeConfig[type] || typeConfig.OTHER;

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  trend,
  color = "text-gray-900"
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  trend?: { value: number; isPositive: boolean };
  color?: string;
}) => (
  <Card className="transition-all duration-200 hover:shadow-md">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {trend && (
              <Badge 
                variant={trend.isPositive ? "success" : "destructive"} 
                className="text-xs"
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Custom hook for invoice API calls
const useInvoices = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchInvoices = useCallback(async (
    page = 1,
    limit = 10,
    status = "all",
    type = "all",
    search = ""
  ): Promise<InvoicesResponse | null> => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Authentication required");
        return null;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && status !== "all" && { status }),
        ...(type && type !== "all" && { type }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/invoice?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          return null;
        }
        throw new Error(`Failed to fetch invoices: ${response.status}`);
      }

      const result: InvoicesResponse = await response.json();
      
      if (!result.success) {
        throw new Error("Failed to load invoices");
      }

      return result;
    } catch (error: any) {
      console.error("Error fetching invoices:", error);
      toast.error(error.message || "Failed to load invoices");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchInvoiceStats = useCallback(async (period = "30d"): Promise<InvoiceStatsResponse | null> => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Authentication required");
        return null;
      }

      const response = await fetch(`/api/invoice/stats?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          return null;
        }
        throw new Error(`Failed to fetch invoice stats: ${response.status}`);
      }

      const result: InvoiceStatsResponse = await response.json();
      
      if (!result.success) {
        throw new Error("Failed to load invoice statistics");
      }

      return result;
    } catch (error: any) {
      console.error("Error fetching invoice stats:", error);
      toast.error(error.message || "Failed to load invoice statistics");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    fetchInvoices,
    fetchInvoiceStats,
  };
};

export default function InvoicesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { fetchInvoices, fetchInvoiceStats, isLoading: apiLoading } = useInvoices();
  
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("30d");
  
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLoading = authLoading || apiLoading;

  const fetchInvoiceData = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const [invoicesResponse, statsResponse] = await Promise.all([
        fetchInvoices(pagination.page, pagination.limit, statusFilter, typeFilter, searchTerm),
        fetchInvoiceStats(periodFilter)
      ]);

      if (invoicesResponse?.data) {
        setInvoices(invoicesResponse.data.invoices);
        setPagination(invoicesResponse.data.pagination);
      } else {
        setInvoices([]);
        setPagination({
          page: 1,
          limit: 10,
          totalCount: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        });
      }

      if (statsResponse?.data) {
        setStats(statsResponse.data);
      } else {
        setStats(null);
      }
    } catch (error) {
      console.error("Error fetching invoice data:", error);
      // Error handling is already done in the hook
    }
  }, [isAuthenticated, fetchInvoices, fetchInvoiceStats, pagination.page, pagination.limit, statusFilter, typeFilter, searchTerm, periodFilter]);

  // Automatic search with debounce
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      fetchInvoiceData();
    }, 500);
  };

  useEffect(() => {
    fetchInvoiceData();
  }, [fetchInvoiceData]);

  const handleRefresh = () => {
    fetchInvoiceData();
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePeriodFilter = (value: string) => {
    setPeriodFilter(value);
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      let url = `/api/invoice?limit=1000`;
      if (statusFilter !== "all") url += `&status=${statusFilter}`;
      if (typeFilter !== "all") url += `&type=${typeFilter}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const result: InvoicesResponse = await response.json();
      
      if (!result.success) {
        throw new Error("Failed to export invoices");
      }

      const headers = ['Invoice ID', 'Date', 'Type', 'Amount', 'Status', 'Description'];
      const csvData = result.data.invoices.map((invoice: Invoice) => [
        invoice.invoiceId,
        new Date(invoice.date).toLocaleDateString(),
        invoice.type,
        `GHS ${invoice.amount.toFixed(2)}`,
        invoice.status,
        invoice.description || 'N/A'
      ]);

      const csvContent = [headers, ...csvData]
        .map(row => row.join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const urlBlob = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = `invoices-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(urlBlob);

      toast.success("Invoices exported successfully");
    } catch (error: any) {
      console.error("Error exporting invoices:", error);
      toast.error(error.message || "Failed to export invoices");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Authentication Required</p>
          <p className="text-muted-foreground">Please log in to view invoices</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your payment invoices and billing history
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isLoading || invoices.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Invoices"
            value={stats.summary.totalInvoices.toString()}
            subtitle={`Last ${stats.period}`}
            icon={FileText}
            color="text-blue-600"
          />
          <StatCard
            title="Total Amount"
            value={formatCurrency(stats.summary.totalAmount)}
            subtitle="All invoices"
            icon={DollarSign}
            color="text-green-600"
          />
          <StatCard
            title="Paid Amount"
            value={formatCurrency(stats.summary.paidAmount)}
            subtitle={`${stats.summary.paidPercentage.toFixed(1)}% paid`}
            icon={CheckCircle}
            color="text-green-600"
          />
          <StatCard
            title="Pending Amount"
            value={formatCurrency(stats.summary.pendingAmount)}
            subtitle="Awaiting payment"
            icon={Clock}
            color="text-amber-600"
          />
        </div>
      )}

      {/* Status Breakdown */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Status Overview
            </CardTitle>
            <CardDescription>
              Distribution of invoices by status for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(stats.statusBreakdown).map(([status, count]) => (
                <div key={status} className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{count}</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {status.toLowerCase()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice ID or description..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Select
                value={statusFilter}
                onValueChange={handleStatusFilter}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="OVERDUE">Overdue</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={typeFilter}
                onValueChange={handleTypeFilter}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="OTP">OTP</SelectItem>
                  <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
                  <SelectItem value="CREDIT_TOPUP">Credit Top-up</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={periodFilter}
                onValueChange={handlePeriodFilter}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>
            {pagination.totalCount > 0 
              ? `Showing ${invoices.length} of ${pagination.totalCount} invoices`
              : 'No invoices found'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && invoices.length === 0 ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-sm">{invoice.invoiceId}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(invoice.date)}</TableCell>
                    <TableCell>{getTypeBadge(invoice.type)}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(invoice.amount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="h-8 gap-2" asChild>
                        <Link href={`/invoices/${invoice.id}`}>
                          <Eye className="h-3 w-3" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FileText className="h-16 w-16 mb-4 opacity-50" />
                      <p className="text-lg font-semibold mb-2">No invoices found</p>
                      <p className="text-sm max-w-md text-center">
                        {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                          ? "Try adjusting your search criteria or filters to find what you're looking for."
                          : "You don't have any invoices yet. Invoices will appear here once they are generated."
                        }
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {!isLoading && invoices.length > 0 && (
          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <strong>
                {(pagination.page - 1) * pagination.limit + 1}-
                {Math.min(pagination.page * pagination.limit, pagination.totalCount)}
              </strong>{" "}
              of <strong>{pagination.totalCount}</strong> invoices
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev || isLoading}
              >
                Previous
              </Button>
              <div className="text-sm text-muted-foreground mx-2">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext || isLoading}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
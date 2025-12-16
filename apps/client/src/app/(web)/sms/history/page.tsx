/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
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
  Search,
  Download,
  RefreshCw,
  Inbox,
  Eye,
  TrendingUp,
  TrendingDown,
  Clock,
  Send,
  CheckCircle,
  XCircle,
  BarChart3,
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
import { toast } from "sonner";

interface SMSHistory {
  id: string;
  recipient: string;
  message: string;
  status: "SENT" | "DELIVERED" | "FAILED" | "PENDING";
  type: string;
  cost: number;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    type: string;
  };
  template?: {
    id: string;
    name: string;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface SMSHistoryResponse {
  success: boolean;
  data: {
    messages: SMSHistory[];
    pagination: PaginationInfo;
    summary: {
      total: number;
      sent: number;
      delivered: number;
      failed: number;
      totalCost: number;
    };
  };
}

interface StatsComparison {
  total: { current: number; previous: number; change: number };
  delivered: { current: number; previous: number; change: number };
  sent: { current: number; previous: number; change: number };
  failed: { current: number; previous: number; change: number };
  cost: { current: number; previous: number; change: number };
}

const getStatusBadge = (status: SMSHistory["status"]) => {
  const statusConfig = {
    DELIVERED: { 
      variant: "success" as const, 
      label: "DELIVERED",
      icon: CheckCircle,
      color: "text-green-600"
    },
    SENT: { 
      variant: "secondary" as const, 
      label: "SENT",
      icon: Send,
      color: "text-blue-600"
    },
    FAILED: { 
      variant: "destructive" as const, 
      label: "FAILED",
      icon: XCircle,
      color: "text-red-600"
    },
    PENDING: { 
      variant: "outline" as const, 
      label: "PENDING",
      icon: Clock,
      color: "text-amber-600"
    }
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1 font-medium">
      <Icon className={`h-3 w-3 ${config.color}`} />
      {config.label}
    </Badge>
  );
};

const getTypeBadge = (type: string) => {
  const typeConfig: { [key: string]: { variant: "default" | "secondary" | "outline", label: string } } = {
    TRANSACTIONAL: { variant: "default", label: "Transactional" },
    PROMOTIONAL: { variant: "secondary", label: "Promotional" },
    ALERT: { variant: "outline", label: "Alert" }
  };

  const config = typeConfig[type] || { variant: "outline", label: type };

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon,
  color = "text-gray-900"
}: {
  title: string;
  value: number;
  change?: number;
  icon: any;
  color?: string;
}) => (
  <Card className="transition-all duration-200 hover:shadow-md">
    <CardHeader className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value.toLocaleString()}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-xs mt-1 ${
              change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {change > 0 ? <TrendingUp className="h-3 w-3" /> : 
               change < 0 ? <TrendingDown className="h-3 w-3" /> : 
               <BarChart3 className="h-3 w-3" />}
              <span>
                {change > 0 ? '+' : ''}{change.toFixed(1)}% from previous period
              </span>
            </div>
          )}
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </CardHeader>
  </Card>
);

export default function SmsHistoryPage() {
 /// const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [smsHistory, setSmsHistory] = useState<SMSHistory[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [summary, setSummary] = useState({
    total: 0,
    sent: 0,
    delivered: 0,
    failed: 0,
    totalCost: 0
  });
  const [comparisonStats, setComparisonStats] = useState<StatsComparison>({
    total: { current: 0, previous: 0, change: 0 },
    delivered: { current: 0, previous: 0, change: 0 },
    failed: { current: 0, previous: 0, change: 0 },
    cost: { current: 0, previous: 0, change: 0 },
    sent: { current: 0, previous: 0, change: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calculateComparisonStats = useCallback((currentSummary: typeof summary) => {
    // Mock comparison data - in real app, this would come from the API
    const previousPeriodData = {
      total: Math.max(0, currentSummary.total - Math.floor(Math.random() * 10)),
      delivered: Math.max(0, currentSummary.delivered - Math.floor(Math.random() * 5)),
      failed: Math.max(0, currentSummary.failed - Math.floor(Math.random() * 3)),
      totalCost: Math.max(0, currentSummary.totalCost - (Math.random() * 0.5))
    };

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    setComparisonStats({
      total: {
        current: currentSummary.total,
        previous: previousPeriodData.total,
        change: calculateChange(currentSummary.total, previousPeriodData.total)
      },
      delivered: {
        current: currentSummary.delivered,
        previous: previousPeriodData.delivered,
        change: calculateChange(currentSummary.delivered, previousPeriodData.delivered)
      },
      failed: {
        current: currentSummary.failed,
        previous: previousPeriodData.failed,
        change: calculateChange(currentSummary.failed, previousPeriodData.failed)
      },
      cost: {
        current: currentSummary.totalCost,
        previous: previousPeriodData.totalCost,
        change: calculateChange(currentSummary.totalCost, previousPeriodData.totalCost)
      },
      sent: {
        current: currentSummary.sent,
        previous: previousPeriodData.total - previousPeriodData.failed,
        change: calculateChange(currentSummary.sent, previousPeriodData.total - previousPeriodData.failed)
      }
    });
  }, []);

  const fetchSMSHistory = useCallback(async (
    page = 1,
    limit = 20,
    status = "all",
    search = "",
    dateRange = "all"
  ) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Authentication required");
        return;
      }

      let url = `/api/sms/history?page=${page}&limit=${limit}`;
      if (status !== "all") url += `&status=${status}`;
      if (search) url += `&recipient=${encodeURIComponent(search)}`;
      
      if (dateRange !== "all") {
        const now = new Date();
        const startDate = new Date();
        
        switch (dateRange) {
          case "today":
            startDate.setHours(0, 0, 0, 0);
            break;
          case "week":
            startDate.setDate(now.getDate() - 7);
            break;
          case "month":
            startDate.setMonth(now.getMonth() - 1);
            break;
          default:
            break;
        }
        
        url += `&startDate=${startDate.toISOString()}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          return;
        }
        throw new Error(`Failed to fetch SMS history: ${response.status}`);
      }

      const result: SMSHistoryResponse = await response.json();
      
      if (!result.success) {
        throw new Error("Failed to load SMS history");
      }

      setSmsHistory(result.data.messages);
      setPagination(result.data.pagination);
      setSummary(result.data.summary);
      calculateComparisonStats(result.data.summary);
    } catch (error: any) {
      console.error("Error fetching SMS history:", error);
      toast.error(error.message || "Failed to load SMS history");
    } finally {
      setIsLoading(false);
    }
  }, [calculateComparisonStats]);

  // Automatic search with debounce
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      fetchSMSHistory(1, pagination.limit, statusFilter, value, dateFilter);
    }, 500);
  };

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     fetchSMSHistory();
  //   }
  // }, [isAuthenticated, fetchSMSHistory]);

  const handleRefresh = () => {
    fetchSMSHistory(
      pagination.page,
      pagination.limit,
      statusFilter,
      searchTerm,
      dateFilter
    );
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    fetchSMSHistory(1, pagination.limit, value, searchTerm, dateFilter);
  };

  const handleDateFilter = (value: string) => {
    setDateFilter(value);
    fetchSMSHistory(1, pagination.limit, statusFilter, searchTerm, value);
  };

  const handlePageChange = (newPage: number) => {
    fetchSMSHistory(newPage, pagination.limit, statusFilter, searchTerm, dateFilter);
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      let url = `/api/sms/history?limit=1000`;
      if (statusFilter !== "all") url += `&status=${statusFilter}`;
      if (searchTerm) url += `&recipient=${encodeURIComponent(searchTerm)}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const result: SMSHistoryResponse = await response.json();
      
      if (!result.success) {
        throw new Error("Failed to export SMS history");
      }

      const headers = ['ID', 'Recipient', 'Message', 'Status', 'Type', 'Cost', 'Date', 'Sender'];
      const csvData = result.data.messages.map(msg => [
        msg.id,
        msg.recipient,
        `"${msg.message.replace(/"/g, '""')}"`,
        msg.status,
        msg.type,
        msg.cost,
        new Date(msg.createdAt).toLocaleString(),
        msg.sender?.name || 'Exa Test'
      ]);

      const csvContent = [headers, ...csvData]
        .map(row => row.join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const urlBlob = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = `sms-history-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(urlBlob);

      toast.success("SMS history exported successfully");
    } catch (error: any) {
      console.error("Error exporting SMS history:", error);
      toast.error(error.message || "Failed to export SMS history");
    }
  };

  // if (authLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <RefreshCw className="h-8 w-8 animate-spin" />
  //       <span className="ml-2">Loading authentication...</span>
  //     </div>
  //   );
  // }

  // if (!isAuthenticated) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center">
  //         <p className="text-lg font-semibold mb-2">Authentication Required</p>
  //         <p className="text-muted-foreground">Please log in to view SMS history</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SMS History</h1>
          <p className="text-muted-foreground">
            View all sent messages and their delivery status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleExport} disabled={isLoading}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Messages"
          value={summary.total}
          change={comparisonStats.total.change}
          icon={BarChart3}
          color="text-gray-900"
        />
        <StatCard
          title="Delivered"
          value={summary.sent}
          change={comparisonStats.sent.change}
          icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Failed"
          value={summary.failed}
          change={comparisonStats.failed.change}
          icon={XCircle}
          color="text-red-600"
        />
        <StatCard
          title="Total Cost"
          value={summary.totalCost}
          change={comparisonStats.cost.change}
          icon={Download}
          color="text-blue-600"
        />
      </div>

      {/* Comparison Stats */}
      {/* <ComparisonStats stats={comparisonStats} /> */}

      {/* Filters */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by recipient..."
              className="pl-9 w-full md:w-[300px]"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={dateFilter}
              onValueChange={handleDateFilter}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="SENT">Sent</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* SMS History Table */}
      <Card>
        <CardHeader className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipient</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : smsHistory.length > 0 ? (
                smsHistory.map((sms) => (
                  <TableRow key={sms.id}>
                    <TableCell className="font-medium">
                      {sms.recipient}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {sms.message}
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(sms.type)}
                    </TableCell>
                    <TableCell>{getStatusBadge(sms.status)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {sms.sender?.name || "Exa Test"}
                      </Badge>
                    </TableCell>
                    <TableCell>{sms.cost} Credit(s)</TableCell>
                    <TableCell>
                      {new Date(sms.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" className="h-8 gap-2" asChild>
                        <Link href={`/reports/sms/${sms.id}`}>
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Inbox className="h-12 w-12 mb-4 opacity-50" />
                      <p>No SMS history found</p>
                      <p className="text-sm">
                        {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                          ? "Try adjusting your search or filters"
                          : "Send your first message to get started"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardHeader>
        {!isLoading && smsHistory.length > 0 && (
          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <strong>
                {(pagination.page - 1) * pagination.limit + 1}-
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </strong>{" "}
              of <strong>{pagination.total}</strong> messages
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
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
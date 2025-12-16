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
  Download,
  Filter,
  Search,
  ChevronDown,
  RefreshCw,
  Activity,
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
import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface OTPHistory {
  id: string;
  phone: string;
  status: "delivered" | "failed" | "pending" | "SENT" | "DELIVERED" | "FAILED" | "PENDING";
  code: string;
  senderId: string;
  sender?: {
    id: string;
    name: string;
  };
  senderName?: string;
  cost: number;
  channel: string;
  createdAt: string;
  codeStatus: "active" | "expired" | "used" | "blocked" | "ACTIVE" | "EXPIRED" | "USED" | "BLOCKED";
  date?: string;
}

interface OTPSummary {
  totalCost: number;
  totalMessages: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const getStatusBadge = (status: OTPHistory["status"]) => {
  return (
    <Badge variant="status" status={status}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Custom hook for OTP API calls
const useOTP = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchOTPHistory = useCallback(async (
    page = 1,
    limit = 20,
    status = "all",
    codeStatus = "all",
    search = ""
  ) => {
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
        ...(codeStatus && codeStatus !== "all" && { codeStatus }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/otp/history?${params}`, {
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
        throw new Error(`Failed to fetch OTP history: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error("Failed to load OTP history");
      }

      return result;
    } catch (error: any) {
      console.error("Error fetching OTP history:", error);
      toast.error(error.message || "Failed to load OTP history");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    fetchOTPHistory,
  };
};

export default function OtpReportsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { fetchOTPHistory, isLoading: apiLoading } = useOTP();
  
  const [otpHistory, setOtpHistory] = useState<OTPHistory[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [summary, setSummary] = useState<OTPSummary>({ totalCost: 0, totalMessages: 0 });
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [codeStatusFilter, setCodeStatusFilter] = useState("all");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLoading = authLoading || apiLoading;

  const fetchOTPHistoryData = useCallback(async (
    page = 1,
    limit = 10,
    status = "all",
    codeStatus = "all",
    search = ""
  ) => {
    if (!isAuthenticated) return;

    const response = await fetchOTPHistory(page, limit, status, codeStatus, search);
    
    if (response?.data) {
      const transformedHistory = response.data.messages.map((otp: OTPHistory) => ({
        ...otp,
        senderName: otp.sender?.name || otp.senderId || "N/A",
        date: new Date(otp.createdAt).toISOString().split("T")[0],
      }));

      setOtpHistory(transformedHistory);
      setSummary({
        totalCost: response.data.summary.totalCost || 0,
        totalMessages: response.data.summary.total || 0
      });
      setPagination(response.data.pagination);
    } else {
      setOtpHistory([]);
      setSummary({ totalCost: 0, totalMessages: 0 });
      setPagination({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      });
    }
  }, [isAuthenticated, fetchOTPHistory]);

  // Automatic search with debounce
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      fetchOTPHistoryData(1, pagination.limit, statusFilter, codeStatusFilter, value);
    }, 500);
  };

  useEffect(() => {
    fetchOTPHistoryData();
  }, [fetchOTPHistoryData]);

  const handleRefresh = () => {
    fetchOTPHistoryData(pagination.page, pagination.limit, statusFilter, codeStatusFilter, searchTerm);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    fetchOTPHistoryData(1, pagination.limit, value, codeStatusFilter, searchTerm);
  };

  const handleCodeStatusFilter = (value: string) => {
    setCodeStatusFilter(value);
    fetchOTPHistoryData(1, pagination.limit, statusFilter, value, searchTerm);
  };

  const handlePageChange = (newPage: number) => {
    fetchOTPHistoryData(newPage, pagination.limit, statusFilter, codeStatusFilter, searchTerm);
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      let url = `/api/otp/history?limit=1000`;
      if (statusFilter !== "all") url += `&status=${statusFilter}`;
      if (codeStatusFilter !== "all") url += `&codeStatus=${codeStatusFilter}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error("Failed to export OTP history");
      }

      // Export logic here
      const headers = ['ID', 'Phone', 'Code', 'Status', 'Code Status', 'Cost', 'Channel', 'Date', 'Sender'];
      const csvData = result.data.messages.map((msg: OTPHistory) => [
        msg.id,
        msg.phone,
        msg.code,
        msg.status,
        msg.codeStatus,
        msg.cost,
        msg.channel,
        new Date(msg.createdAt).toLocaleString(),
        msg.sender?.name || 'N/A'
      ]);

      const csvContent = [headers, ...csvData]
        .map(row => row.join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const urlBlob = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = `otp-history-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(urlBlob);

      toast.success("OTP history exported successfully");
    } catch (error: any) {
      console.error("Error exporting OTP history:", error);
      toast.error(error.message || "Failed to export OTP history");
    }
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
          <p className="text-muted-foreground">Please log in to view OTP reports</p>
        </div>
      </div>
    );
  }

  if (isLoading && otpHistory.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <Card className="animate-pulse">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
            <div className="h-10 w-[300px] bg-gray-200 rounded"></div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-[150px] bg-gray-200 rounded"></div>
              <div className="h-10 w-[150px] bg-gray-200 rounded"></div>
            </div>
          </CardHeader>
        </Card>

        <Card className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
            <div className="flex gap-2">
              <div className="h-9 w-20 bg-gray-200 rounded"></div>
              <div className="h-9 w-20 bg-gray-200 rounded"></div>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">OTP Reports</h1>
          <p className="text-muted-foreground">
            Detailed OTP verification history and analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={handleExport} disabled={otpHistory.length === 0 || isLoading}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search phone numbers or codes..."
              className="pl-9 w-full md:w-[300px]"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={statusFilter} onValueChange={handleStatusFilter} disabled={isLoading}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="SENT">Sent</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={codeStatusFilter}
              onValueChange={handleCodeStatusFilter}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Code Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Code Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="used">Used</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
                <SelectItem value="USED">Used</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" disabled={isLoading}>
              <Filter className="mr-2 h-4 w-4" />
              Date Range
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phone Number</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Sender ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Code Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otpHistory.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.senderName}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.channel}</Badge>
                  </TableCell>
                  <TableCell>{report.cost}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        report.codeStatus === 'used' || report.codeStatus === 'USED'
                          ? "bg-green-50 text-green-700"
                          : report.codeStatus === 'active' || report.codeStatus === 'ACTIVE'
                            ? "bg-blue-50 text-blue-700"
                            : report.codeStatus === 'expired' || report.codeStatus === 'EXPIRED'
                              ? "bg-orange-50 text-orange-700"
                              : "bg-red-50 text-red-700"
                      }
                    >
                      {report.codeStatus.charAt(0).toUpperCase() + report.codeStatus.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {otpHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Activity className="h-12 w-12 mb-4 opacity-50" />
                      <p>No OTP history found</p>
                      <p className="text-sm">
                        {searchTerm ||
                        statusFilter !== "all" ||
                        codeStatusFilter !== "all"
                          ? "Try adjusting your filters"
                          : "Send your first OTP to get started"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardHeader>

        {otpHistory.length > 0 && (
          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <strong>
                {(pagination.page - 1) * pagination.limit + 1}-
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </strong>{" "}
              of <strong>{pagination.total}</strong> OTP Records
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1 || isLoading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages || isLoading}
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
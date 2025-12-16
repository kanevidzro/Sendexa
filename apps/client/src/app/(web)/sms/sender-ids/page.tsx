/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Loader2, 
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  Info,
  AlertCircle,
  Shield,
  Globe
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

interface SenderId {
  id: string;
  name: string;
  type: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PRE_APPROVED";
  country: string;
  useCase?: string;
  rejectionReason?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
}

interface SenderIdData {
  senderIds: SenderId[];
  defaultSenderId: any;
}

export default function SenderIdPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [senderIdData, setSenderIdData] = useState<SenderIdData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Simplified form state for Africa expansion
  const [senderIdName, setSenderIdName] = useState("");
  const [useCase, setUseCase] = useState("");

  // Fetch sender IDs from API
  const fetchSenderIds = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch("/api/sender-ids", {
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
        throw new Error(`Failed to fetch sender IDs: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || "Failed to load sender IDs");
      }

      setSenderIdData(result.data);
    } catch (error: any) {
      console.error("Error fetching sender IDs:", error);
      toast.error(error.message || "Failed to load sender IDs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSenderIds();
    }
  }, [isAuthenticated]);

  const validateSenderId = (name: string): { isValid: boolean; message?: string } => {
    const trimmed = name.trim();
    
    if (!trimmed) {
      return { isValid: false, message: "Sender ID cannot be empty" };
    }

    // Count characters (excluding spaces for length validation)
    const charCount = trimmed.replace(/\s/g, '').length;
    
    if (charCount < 3) {
      return { isValid: false, message: "Sender ID must be at least 3 characters (excluding spaces)" };
    }

    if (charCount > 11) {
      return { isValid: false, message: "Sender ID cannot exceed 11 characters (excluding spaces)" };
    }

    // Check if it contains only letters and spaces (uppercase, lowercase, and spaces)
    const isValidFormat = /^[a-zA-Z\s]+$/.test(trimmed);
    if (!isValidFormat) {
      return { isValid: false, message: "Sender ID must contain only letters and spaces (no numbers or special characters)" };
    }

    // Check if it contains at least one letter
    const hasLetters = /[a-zA-Z]/.test(trimmed);
    if (!hasLetters) {
      return { isValid: false, message: "Sender ID must contain at least one letter" };
    }

    // Check for consecutive spaces
    if (/\s{2,}/.test(trimmed)) {
      return { isValid: false, message: "Sender ID cannot have consecutive spaces" };
    }

    // Check if starts or ends with space
    if (trimmed.startsWith(' ') || trimmed.endsWith(' ')) {
      return { isValid: false, message: "Sender ID cannot start or end with spaces" };
    }

    return { isValid: true };
  };

  const handleSubmitSenderId = async () => {
    const trimmedName = senderIdName.trim();
    const validation = validateSenderId(trimmedName);
    
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    if (!useCase.trim()) {
      toast.error("Please provide a use case description");
      return;
    }

    // Check if sender ID already exists (case insensitive)
    if (senderIdData?.senderIds.some((sid) => 
      !sid.isDefault && sid.name.toLowerCase() === trimmedName.toLowerCase()
    )) {
      toast.error("This Sender ID is already registered");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch("/api/sender-ids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: trimmedName,
          useCase: useCase.trim()
          // Type and country are set automatically in backend
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create sender ID");
      }

      // Reset form
      setSenderIdName("");
      setUseCase("");
      setIsDialogOpen(false);
      
      toast.success(result.message || "Sender ID submitted for approval");
      
      // Refresh the list
      fetchSenderIds();
    } catch (error: any) {
      console.error("Error creating sender ID:", error);
      toast.error(error.message || "Failed to create sender ID");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (value: string) => {
    // Allow only letters and spaces (uppercase, lowercase, and spaces)
    const cleaned = value.replace(/[^a-zA-Z\s]/g, "");
    setSenderIdName(cleaned);
  };

  const getStatusBadge = (status: SenderId["status"]) => {
    const statusConfig = {
      PENDING: { variant: "secondary" as const, icon: Clock, label: "Pending", color: "text-amber-500" },
      APPROVED: { variant: "success" as const, icon: CheckCircle, label: "Approved", color: "text-green-500" },
      REJECTED: { variant: "destructive" as const, icon: XCircle, label: "Rejected", color: "text-red-500" },
      PRE_APPROVED: { variant: "default" as const, icon: Shield, label: "Pre-Approved", color: "text-blue-500" }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getTypeBadge = (type: string, p0: boolean) => {
    const typeConfig: { [key: string]: { variant: "default" | "secondary" | "outline" | "success", label: string, icon?: any } } = {
      ALPHANUMERIC: { variant: "default", label: "Alphanumeric" },
      SHORT_CODE: { variant: "secondary", label: "Short Code" },
      DEFAULT: { variant: "success", label: "Default", icon: Shield },
      CUSTOM: { variant: "outline", label: "Custom" }
    };

    const config = typeConfig[type] || { variant: "outline" as const, label: type };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {Icon && <Icon className="h-3 w-3" />}
        {config.label}
      </Badge>
    );
  };

  const getCountryBadge = (country: string) => {
    if (country === "AFRICA") {
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700">
          <Globe className="h-3 w-3" />
          Africa Region
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline">
        {country}
      </Badge>
    );
  };

  // All sender IDs including default
  const allSenderIds = senderIdData?.senderIds || [];
  const defaultSenderId = allSenderIds.find(sid => sid.isDefault);
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
          <p className="text-muted-foreground">Please log in to manage sender IDs</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sender IDs</h1>
            <p className="text-muted-foreground">
              Register and manage your SMS sender identifiers
            </p>
          </div>
          <Button disabled>
            <PlusCircle className="mr-2 h-4 w-4" />
            Request Sender ID
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading sender IDs...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sender IDs</h1>
          <p className="text-muted-foreground">
            Manage your SMS sender identifiers across Africa
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Request Sender ID
        </Button>
      </div>

      {/* Default Sender ID Info Card */}
      {defaultSenderId && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Shield className="h-5 w-5" />
              Default Sender ID - Available for All Businesses
            </CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-300">
              Pre-approved sender ID ready for immediate use across Africa without registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium">Sender ID</Label>
                <p className="text-lg font-semibold">{defaultSenderId.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                {getStatusBadge(defaultSenderId.status)}
              </div>
              <div>
                <Label className="text-sm font-medium">Type</Label>
                {getTypeBadge(defaultSenderId.type, true)}
              </div>
              <div>
                <Label className="text-sm font-medium">Region</Label>
                {getCountryBadge(defaultSenderId.country)}
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-md">
              <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                {defaultSenderId.useCase || "Pre-approved for all business communications across Africa"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Sender IDs Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Sender IDs</CardTitle>
          <CardDescription>
            Your default pre-approved sender ID and custom sender IDs
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Use Case</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allSenderIds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Building2 className="h-12 w-12 mb-4 opacity-50" />
                      <p>No sender IDs found</p>
                      <p className="text-sm">Request a sender ID to get started</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                allSenderIds.map((senderId) => (
                  <TableRow key={senderId.id} className={senderId.isDefault ? "bg-blue-50 dark:bg-blue-950/20" : ""}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {senderId.name}
                        {senderId.isDefault && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            Default
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(senderId.type, !!senderId.isDefault)}</TableCell>
                    <TableCell>{getStatusBadge(senderId.status)}</TableCell>
                    <TableCell>
                      {getCountryBadge(senderId.country)}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {senderId.useCase || "Business communications"}
                    </TableCell>
                    <TableCell>
                      {senderId.isDefault ? (
                        "Always Available"
                      ) : (
                        new Date(senderId.createdAt).toLocaleDateString()
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        {allSenderIds.length > 0 && (
          <CardFooter className="border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>1-{allSenderIds.length}</strong> of{" "}
              <strong>{allSenderIds.length}</strong> sender IDs
            </div>
          </CardFooter>
        )}
      </Card>

  

      {/* Request Sender ID Dialog - SIMPLIFIED */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request New Sender ID</DialogTitle>
            <DialogDescription>
              Register a custom alphanumeric sender ID for your business across Africa. Approval typically takes 1-3 business days.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Sender ID Name */}
            <div className="space-y-2">
              <Label htmlFor="sender-id-name">Sender ID Name</Label>
              <Input
                id="sender-id-name"
                placeholder="Enter sender ID (e.g. My Company, MYCOMPANY, mycompany)"
                value={senderIdName}
                onChange={(e) => handleInputChange(e.target.value)}
                maxLength={11}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {senderIdName.replace(/\s/g, '').length}/11 characters (excluding spaces)
                </span>
                {senderIdName.trim() && (
                  <span>
                    Will be saved as: <strong>{senderIdName}</strong>
                  </span>
                )}
              </div>
              <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-md">
                <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>Supports capital letters, small letters, and spaces. No numbers or special characters.</span>
              </div>
            </div>

            {/* Use Case */}
            <div className="space-y-2">
              <Label htmlFor="use-case">Use Case Description</Label>
              <Textarea
                id="use-case"
                placeholder="Describe how you plan to use this sender ID for business communications across Africa..."
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Provide detailed information about your messaging use case to speed up approval.
              </p>
            </div>

            {/* Auto-filled Information */}
            {/* <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
              <Label className="text-sm font-medium">Automatically Set</Label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="outline" className="ml-1">Alphanumeric</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Region:</span>
                  <Badge variant="outline" className="ml-1 flex items-center gap-1 w-fit">
                    <Globe className="h-3 w-3" />
                    Africa
                  </Badge>
                </div>
              </div>
            </div> */}
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false);
                setSenderIdName("");
                setUseCase("");
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitSenderId}
              disabled={isSubmitting || !senderIdName.trim() || !useCase.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit for Approval"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
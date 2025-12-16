/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Copy,
  Plus,
  Eye,
  EyeOff,
  Key,
  MoreVertical,
  ChevronLeft,
  Trash2,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Search,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

type ApiKey = {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  expiresAt: string | null;
  createdAt: string;
  lastUsedAt: string | null;
  isActive: boolean;
  lastActiveAt?: string | null;
};

type CreateApiKeyRequest = {
  name: string;
  permissions: string[];
  expiresInDays?: number | null;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export default function ApiKeysPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [showSecret, setShowSecret] = useState<string | null>(null);
  const [newKeyData, setNewKeyData] = useState({
    name: "",
    permissions: ["sms:send"] as string[],
    expiresInDays: 30 as number | null,
    hasExpiration: true
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [viewKey, setViewKey] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [search, setSearch] = useState("");

  const availablePermissions = [
    'sms:send',
    'sms:read', 
    'otp:send',
    'otp:verify',
    'contacts:read',
    'contacts:write',
    'analytics:read'
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchApiKeys();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchApiKeys = async (page = 1, searchTerm = "") => {
  try {
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    const params = new URLSearchParams({
      page: page.toString(),
      limit: pagination.limit.toString(),
      ...(searchTerm && { search: searchTerm })
    });

    const response = await fetch(`/api/api-keys?${params}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      setApiKeys(result.data.apiKeys || []);
      setPagination(result.data.pagination || {
        page: page,
        limit: pagination.limit,
        total: result.data.apiKeys?.length || 0,
        pages: Math.ceil((result.data.apiKeys?.length || 0) / pagination.limit)
      });
    } else {
      throw new Error(result.error || "Failed to fetch API keys");
    }
  } catch (error: any) {
    console.error("Error fetching API keys:", error);
    toast.error(error.message || "Failed to fetch API keys");
  } finally {
    setIsLoading(false);
  }
};

  const handleCopy = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  const handleCreate = async () => {
    if (!newKeyData.name.trim()) {
      toast.error("API key name is required");
      return;
    }

    if (newKeyData.permissions.length === 0) {
      toast.error("At least one permission is required");
      return;
    }

    try {
      setCreatingLoading(true);
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const requestData: CreateApiKeyRequest = {
        name: newKeyData.name.trim(),
        permissions: newKeyData.permissions,
      };

      // Only include expiresInDays if hasExpiration is true and value is provided
      if (newKeyData.hasExpiration && newKeyData.expiresInDays) {
        requestData.expiresInDays = newKeyData.expiresInDays;
      } else if (!newKeyData.hasExpiration) {
        requestData.expiresInDays = null;
      }

      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create API key");
      }

      if (result.success) {
        await fetchApiKeys();
        toast.success(result.message || `API key "${newKeyData.name}" created successfully`);

        // Show the credentials in a dialog
        setViewKey(result.data.apiKey);
        setShowSecret(result.data.apiKey?.id);

        setIsCreating(false);
        // Reset form
        setNewKeyData({
          name: "",
          permissions: ["sms:send"],
          expiresInDays: 30,
          hasExpiration: true
        });
      } else {
        throw new Error(result.error || "Failed to create API key");
      }
    } catch (error: any) {
      console.error("Error creating API key:", error);
      toast.error(error.message || "Failed to create API key");
    } finally {
      setCreatingLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!keyToDelete) return;

    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(`/api/api-keys/${keyToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete API key");
      }

      if (result.success) {
        await fetchApiKeys();
        toast.success(result.message || "API key deleted successfully");
      } else {
        throw new Error(result.error || "Failed to delete API key");
      }
    } catch (error: any) {
      console.error("Error deleting API key:", error);
      toast.error(error.message || "Failed to delete API key");
    } finally {
      setIsDeleting(false);
      setKeyToDelete(null);
    }
  };

  const handleRegenerateSecret = async (id: string) => {
    try {
      setIsRegenerating(id);
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(`/api/api-keys/${id}/regenerate-secret`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to regenerate secret");
      }

      if (result.success) {
        // Show the new secret in dialog
        setViewKey({
          ...viewKey,
          secret: result.data.secret
        });
        setShowSecret(id);
        toast.success(result.message || "API secret regenerated successfully");
      } else {
        throw new Error(result.error || "Failed to regenerate secret");
      }
    } catch (error: any) {
      console.error("Error regenerating secret:", error);
      toast.error(error.message || "Failed to regenerate secret");
    } finally {
      setIsRegenerating(null);
    }
  };

  const toggleKeyStatus = async (id: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(`/api/api-keys/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update API key");
      }

      if (result.success) {
        await fetchApiKeys();
        toast.success(
          `API key ${isActive ? "activated" : "deactivated"} successfully`
        );
      } else {
        throw new Error(result.error || "Failed to update API key");
      }
    } catch (error: any) {
      console.error("Error updating API key:", error);
      toast.error(error.message || "Failed to update API key");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setTimeout(() => {
      fetchApiKeys(1, e.target.value);
    }, 300);
  };

  const handlePageChange = (newPage: number) => {
    fetchApiKeys(newPage, search);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? "default" : "secondary"}>
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };

  const togglePermission = (permission: string) => {
    setNewKeyData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleExpirationToggle = (checked: boolean) => {
    setNewKeyData(prev => ({
      ...prev,
      hasExpiration: checked,
      expiresInDays: checked ? 30 : null
    }));
  };

  // Skeleton components
  const TableSkeleton = () => (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-40" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-8 w-8 ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

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
          <p className="text-muted-foreground">Please log in to manage API keys</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/settings">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
            <p className="text-muted-foreground">
              Manage your API keys and secrets
            </p>
          </div>
        </div>

        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Create a new API key with specific permissions
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">API Key Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Production Server"
                  value={newKeyData.name}
                  onChange={(e) => setNewKeyData({...newKeyData, name: e.target.value})}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  A descriptive name for your API key.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Permissions *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission}
                        checked={newKeyData.permissions.includes(permission)}
                        onCheckedChange={() => togglePermission(permission)}
                      />
                      <Label htmlFor={permission} className="text-sm font-normal cursor-pointer">
                        {permission}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="expiration"
                    checked={newKeyData.hasExpiration}
                    onCheckedChange={handleExpirationToggle}
                  />
                  <Label htmlFor="expiration" className="cursor-pointer">
                    Set expiration date
                  </Label>
                </div>
                
                {newKeyData.hasExpiration && (
                  <div className="space-y-2 pl-6">
                    <Label htmlFor="expiresInDays">Expires In (Days)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="expiresInDays"
                        type="number"
                        min="1"
                        max="365"
                        value={newKeyData.expiresInDays || ""}
                        onChange={(e) => setNewKeyData({
                          ...newKeyData, 
                          expiresInDays: e.target.value ? parseInt(e.target.value) : null
                        })}
                        className="flex-1"
                      />
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      The API key will automatically expire after this many days
                    </p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!newKeyData.name.trim() || creatingLoading || newKeyData.permissions.length === 0}
              >
                {creatingLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create API Key"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search API keys by name..."
            value={search}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableSkeleton />
              ) : apiKeys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Key className="h-8 w-8" />
                      <p>No API keys found</p>
                      <p className="text-sm">
                        {search ? "Try a different search term" : "Create your first API key to get started"}
                      </p>
                      {!search && (
                        <Button 
                          onClick={() => setIsCreating(true)} 
                          className="mt-2"
                          size="sm"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create API Key
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        {key.name}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                          {key.key}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopy(key.key, "API key copied")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {key.permissions.slice(0, 3).map(permission => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                        {key.permissions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{key.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>{getStatusBadge(key.isActive)}</TableCell>
                    <TableCell>{formatDate(key.createdAt)}</TableCell>
                    <TableCell>{formatDate(key.lastUsedAt ?? key.lastActiveAt ?? null)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setViewKey(key)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                toggleKeyStatus(key.id, !key.isActive)
                              }
                            >
                              {key.isActive ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => handleRegenerateSecret(key.id)}
                              disabled={isRegenerating === key.id}
                            >
                              {isRegenerating === key.id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <RefreshCw className="h-4 w-4 mr-2" />
                              )}
                              Regenerate Secret
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => {
                                setKeyToDelete(key.id);
                                setIsDeleting(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete API Key
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        
        {!isLoading && apiKeys.length > 0 && (
          <div className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)}</strong> of{" "}
              <strong>{pagination.total}</strong> API keys
            </div>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* View API Key Details Dialog */}
      <Dialog
        open={!!viewKey}
        onOpenChange={(open) => {
          if (!open) {
            setViewKey(null);
            setShowSecret(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>API Key Details</DialogTitle>
            <DialogDescription>
              Detailed information about your API key
            </DialogDescription>
          </DialogHeader>
          {viewKey && (
            <div className="space-y-6 py-4">
              {/* Warning for new keys */}
              {viewKey.secret && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">
                        Important: Save Your Credentials
                      </h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p>
                          Your secret key will only be shown this one time. For
                          security reasons, it cannot be retrieved again. Please
                          copy and store it in a secure place.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>API Key Name</Label>
                  <p className="text-sm font-medium">{viewKey.name}</p>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div>{getStatusBadge(viewKey.isActive)}</div>
                </div>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="flex items-center gap-2">
                    <code className="relative rounded bg-muted px-2 py-1 font-mono text-sm flex-1">
                      {viewKey.key}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopy(viewKey.key, "API key copied")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {/* Secret Key Section */}
                <div className="space-y-2">
                  <Label>Secret Key</Label>
                  <div className="flex items-center gap-2">
                    <code className="relative rounded bg-muted px-2 py-1 font-mono text-sm flex-1">
                      {viewKey.secret
                        ? showSecret === viewKey.id
                          ? viewKey.secret
                          : "••••••••••••"
                        : "••••••••••••"}
                    </code>
                    {viewKey.secret ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            setShowSecret(
                              showSecret === viewKey.id ? null : viewKey.id
                            )
                          }
                        >
                          {showSecret === viewKey.id ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            handleCopy(viewKey.secret, "Secret key copied")
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRegenerateSecret(viewKey.id)}
                        disabled={isRegenerating === viewKey.id}
                      >
                        {isRegenerating === viewKey.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        Regenerate Secret
                      </Button>
                    )}
                  </div>
                  {!viewKey.secret && (
                    <p className="text-xs text-muted-foreground">
                      Secret not available. You must regenerate to get a new secret key.
                    </p>
                  )}
                </div>

                {/* Base64 Token Section */}
                <div className="md:col-span-2 space-y-2">
                  <Label>Base64 Token (Ready to Use)</Label>
                  <div className="flex items-center gap-2">
                    <code className="relative rounded bg-muted px-2 py-1 font-mono text-sm break-all flex-1">
                      {viewKey.secret 
                        ? Buffer.from(`${viewKey.key}:${viewKey.secret}`).toString("base64")
                        : "Generate a secret first"}
                    </code>
                    {viewKey.secret && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() =>
                          handleCopy(
                            Buffer.from(`${viewKey.key}:${viewKey.secret}`).toString("base64"),
                            "Base64 token copied"
                          )
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use this token directly in Authorization header: Authorization: Basic [token]
                  </p>
                </div>

                {/* Permissions */}
                {/* <div className="md:col-span-2 space-y-2">
                  <Label>Permissions</Label>
                  <div className="flex flex-wrap gap-2">
                    {viewKey.permissions?.map((permission: string) => (
                      <Badge key={permission} variant="secondary">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div> */}

                {/* Additional Info */}
                {/* <div className="space-y-2">
                  <Label>Created</Label>
                  <p className="text-sm">{formatDate(viewKey.createdAt)}</p>
                </div>
                <div className="space-y-2">
                  <Label>Expires</Label>
                  <p className="text-sm">{viewKey.expiresAt ? formatDate(viewKey.expiresAt) : 'Never'}</p>
                </div>
                <div className="space-y-2">
                  <Label>Last Used</Label>
                  <p className="text-sm">{formatDate(viewKey.lastUsedAt ?? viewKey.lastActiveAt ?? null)}</p>
                </div>
                <div className="space-y-2">
                  <Label>Last Active</Label>
                  <p className="text-sm">{formatDate(viewKey.lastActiveAt)}</p>
                </div> */}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setViewKey(null);
                setShowSecret(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this API key? This action cannot
              be undone and any applications using this key will stop working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete API Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
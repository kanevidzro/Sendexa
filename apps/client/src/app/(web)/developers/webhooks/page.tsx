/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/webhooks/page.tsx
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
  Webhook,
  MoreVertical,
  ChevronLeft,
  Trash2,
  RefreshCw,
  Loader2,
  AlertTriangle,

  Play,

 
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

type Webhook = {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    deliveries: number;
  };
};

type CreateWebhookRequest = {
  name: string;
  url: string;
  events: string[];
  secret?: string;
  isActive?: boolean;
};

export default function WebhooksPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [showSecret, setShowSecret] = useState<string | null>(null);
  const [newWebhookData, setNewWebhookData] = useState({
    name: "",
    url: "",
    events: ["sms.sent"] as string[],
    secret: "",
    isActive: true,
    generateSecret: true
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [webhookToDelete, setWebhookToDelete] = useState<string | null>(null);
  const [viewWebhook, setViewWebhook] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [creatingLoading, setCreatingLoading] = useState(false);

  const availableEvents = [
    { value: 'sms.sent', label: 'SMS Sent' },
    { value: 'sms.delivered', label: 'SMS Delivered' },
    { value: 'sms.failed', label: 'SMS Failed' },
    { value: 'otp.sent', label: 'OTP Sent' },
    { value: 'otp.verified', label: 'OTP Verified' }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchWebhooks();
    }
  }, [isAuthenticated]);

  const fetchWebhooks = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch("/api/webhooks", {
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
        setWebhooks(result.data.webhooks || []);
      } else {
        throw new Error(result.error || "Failed to fetch webhooks");
      }
    } catch (error: any) {
      console.error("Error fetching webhooks:", error);
      toast.error(error.message || "Failed to fetch webhooks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  const handleCreate = async () => {
    if (!newWebhookData.name.trim()) {
      toast.error("Webhook name is required");
      return;
    }

    if (!newWebhookData.url.trim()) {
      toast.error("Webhook URL is required");
      return;
    }

    if (newWebhookData.events.length === 0) {
      toast.error("At least one event is required");
      return;
    }

    try {
      setCreatingLoading(true);
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const requestData: CreateWebhookRequest = {
        name: newWebhookData.name.trim(),
        url: newWebhookData.url.trim(),
        events: newWebhookData.events,
        isActive: newWebhookData.isActive,
      };

      // Only include secret if manually provided
      if (!newWebhookData.generateSecret && newWebhookData.secret) {
        requestData.secret = newWebhookData.secret;
      }

      const response = await fetch("/api/webhooks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create webhook");
      }

      if (result.success) {
        await fetchWebhooks();
        toast.success(result.message || `Webhook "${newWebhookData.name}" created successfully`);

        // Show the secret in a dialog if it was generated
        if (result.data.webhook.secret) {
          setViewWebhook(result.data.webhook);
          setShowSecret(result.data.webhook.id);
        }

        setIsCreating(false);
        // Reset form
        setNewWebhookData({
          name: "",
          url: "",
          events: ["sms.sent"],
          secret: "",
          isActive: true,
          generateSecret: true
        });
      } else {
        throw new Error(result.error || "Failed to create webhook");
      }
    } catch (error: any) {
      console.error("Error creating webhook:", error);
      toast.error(error.message || "Failed to create webhook");
    } finally {
      setCreatingLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!webhookToDelete) return;

    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(`/api/webhooks/${webhookToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete webhook");
      }

      if (result.success) {
        await fetchWebhooks();
        toast.success(result.message || "Webhook deleted successfully");
      } else {
        throw new Error(result.error || "Failed to delete webhook");
      }
    } catch (error: any) {
      console.error("Error deleting webhook:", error);
      toast.error(error.message || "Failed to delete webhook");
    } finally {
      setIsDeleting(false);
      setWebhookToDelete(null);
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

      const response = await fetch(`/api/webhooks/${id}/regenerate-secret`, {
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
        setViewWebhook({
          ...viewWebhook,
          secret: result.data.secret
        });
        setShowSecret(id);
        toast.success(result.message || "Webhook secret regenerated successfully");
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

  const handleTestWebhook = async (id: string) => {
    try {
      setIsTesting(id);
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(`/api/webhooks/${id}/test`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to test webhook");
      }

      if (result.success) {
        toast.success(result.message || "Test webhook triggered successfully");
      } else {
        throw new Error(result.error || "Failed to test webhook");
      }
    } catch (error: any) {
      console.error("Error testing webhook:", error);
      toast.error(error.message || "Failed to test webhook");
    } finally {
      setIsTesting(null);
    }
  };

  const toggleWebhookStatus = async (id: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(`/api/webhooks/${id}`, {
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
        throw new Error(result.error || "Failed to update webhook");
      }

      if (result.success) {
        await fetchWebhooks();
        toast.success(
          `Webhook ${isActive ? "activated" : "deactivated"} successfully`
        );
      } else {
        throw new Error(result.error || "Failed to update webhook");
      }
    } catch (error: any) {
      console.error("Error updating webhook:", error);
      toast.error(error.message || "Failed to update webhook");
    }
  };

  const toggleEvent = (event: string) => {
    setNewWebhookData(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
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

  const getEventBadge = (event: string) => {
    const eventConfig: { [key: string]: { label: string, variant: "default" | "secondary" | "outline" | "destructive" } } = {
      'sms.sent': { label: 'SMS Sent', variant: 'default' },
      'sms.delivered': { label: 'SMS Delivered', variant: 'outline' },
      'sms.failed': { label: 'SMS Failed', variant: 'destructive' },
      'otp.sent': { label: 'OTP Sent', variant: 'secondary' },
      'otp.verified': { label: 'OTP Verified', variant: 'outline' }
    };

    const config = eventConfig[event] || { label: event, variant: 'outline' };
    
    return (
      <Badge key={event} variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
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
            <Skeleton className="h-4 w-64" />
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
          <p className="text-muted-foreground">Please log in to manage webhooks</p>
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
            <h1 className="text-2xl font-bold tracking-tight">Webhooks</h1>
            <p className="text-muted-foreground">
              Manage your webhooks and event notifications
            </p>
          </div>
        </div>

        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Webhook</DialogTitle>
              <DialogDescription>
                Create a new webhook to receive event notifications
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Webhook Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Production Notifications"
                  value={newWebhookData.name}
                  onChange={(e) => setNewWebhookData({...newWebhookData, name: e.target.value})}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  A descriptive name for your webhook.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Webhook URL *</Label>
                <Input
                  id="url"
                  placeholder="https://api.yoursite.com/webhooks"
                  value={newWebhookData.url}
                  onChange={(e) => setNewWebhookData({...newWebhookData, url: e.target.value})}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  The URL where we will send POST requests when events occur.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Events to Listen For *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableEvents.map((event) => (
                    <div key={event.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={event.value}
                        checked={newWebhookData.events.includes(event.value)}
                        onCheckedChange={() => toggleEvent(event.value)}
                      />
                      <Label htmlFor={event.value} className="text-sm font-normal cursor-pointer">
                        {event.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="generateSecret"
                    checked={newWebhookData.generateSecret}
                    onCheckedChange={(checked) => setNewWebhookData({
                      ...newWebhookData,
                      generateSecret: checked,
                      secret: checked ? "" : newWebhookData.secret
                    })}
                  />
                  <Label htmlFor="generateSecret" className="cursor-pointer">
                    Generate secret automatically
                  </Label>
                </div>
                
                {!newWebhookData.generateSecret && (
                  <div className="space-y-2 pl-6">
                    <Label htmlFor="secret">Webhook Secret</Label>
                    <Input
                      id="secret"
                      type="text"
                      placeholder="Enter your custom secret"
                      value={newWebhookData.secret}
                      onChange={(e) => setNewWebhookData({
                        ...newWebhookData, 
                        secret: e.target.value
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Provide your own secret for signing webhook payloads
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={newWebhookData.isActive}
                  onCheckedChange={(checked) => setNewWebhookData({
                    ...newWebhookData,
                    isActive: checked
                  })}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Activate webhook immediately
                </Label>
              </div>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!newWebhookData.name.trim() || !newWebhookData.url.trim() || creatingLoading || newWebhookData.events.length === 0}
              >
                {creatingLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Webhook"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableSkeleton />
              ) : webhooks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Webhook className="h-8 w-8" />
                      <p>No webhooks found</p>
                      <p className="text-sm">
                        Create your first webhook to receive event notifications
                      </p>
                      <Button 
                        onClick={() => setIsCreating(true)} 
                        className="mt-2"
                        size="sm"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Webhook
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Webhook className="h-4 w-4 text-muted-foreground" />
                        {webhook.name}
                      </div>
                    </TableCell>

                    <TableCell>
                      <code className="relative rounded bg-muted px-2 py-1 font-mono text-sm break-all">
                        {webhook.url}
                      </code>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {webhook.events.slice(0, 2).map(event => getEventBadge(event))}
                        {webhook.events.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{webhook.events.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>{getStatusBadge(webhook.isActive)}</TableCell>
                    <TableCell>{formatDate(webhook.createdAt)}</TableCell>
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
                              onClick={() => setViewWebhook(webhook)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleTestWebhook(webhook.id)}
                              disabled={isTesting === webhook.id || !webhook.isActive}
                            >
                              {isTesting === webhook.id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Play className="h-4 w-4 mr-2" />
                              )}
                              Test Webhook
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                toggleWebhookStatus(webhook.id, !webhook.isActive)
                              }
                            >
                              {webhook.isActive ? (
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
                              onClick={() => handleRegenerateSecret(webhook.id)}
                              disabled={isRegenerating === webhook.id}
                            >
                              {isRegenerating === webhook.id ? (
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
                                setWebhookToDelete(webhook.id);
                                setIsDeleting(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Webhook
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
      </Card>

      {/* View Webhook Details Dialog */}
      <Dialog
        open={!!viewWebhook}
        onOpenChange={(open) => {
          if (!open) {
            setViewWebhook(null);
            setShowSecret(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Webhook Details</DialogTitle>
            <DialogDescription>
              Detailed information about your webhook
            </DialogDescription>
          </DialogHeader>
          {viewWebhook && (
            <div className="space-y-6 py-4">
              {/* Warning for new secrets */}
              {viewWebhook.secret && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">
                        Important: Save Your Secret
                      </h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p>
                          Your webhook secret will only be shown this one time. For
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
                  <Label>Webhook Name</Label>
                  <p className="text-sm font-medium">{viewWebhook.name}</p>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div>{getStatusBadge(viewWebhook.isActive)}</div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Webhook URL</Label>
                  <div className="flex items-center gap-2">
                    <code className="relative rounded bg-muted px-2 py-1 font-mono text-sm break-all flex-1">
                      {viewWebhook.url}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopy(viewWebhook.url, "URL copied")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {/* Secret Section */}
                <div className="md:col-span-2 space-y-2">
                  <Label>Webhook Secret</Label>
                  <div className="flex items-center gap-2">
                    <code className="relative rounded bg-muted px-2 py-1 font-mono text-sm flex-1">
                      {viewWebhook.secret
                        ? showSecret === viewWebhook.id
                          ? viewWebhook.secret
                          : "••••••••••••"
                        : "••••••••••••"}
                    </code>
                    {viewWebhook.secret ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            setShowSecret(
                              showSecret === viewWebhook.id ? null : viewWebhook.id
                            )
                          }
                        >
                          {showSecret === viewWebhook.id ? (
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
                            handleCopy(viewWebhook.secret, "Secret copied")
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRegenerateSecret(viewWebhook.id)}
                        disabled={isRegenerating === viewWebhook.id}
                      >
                        {isRegenerating === viewWebhook.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        Regenerate Secret
                      </Button>
                    )}
                  </div>
                  {!viewWebhook.secret && (
                    <p className="text-xs text-muted-foreground">
                      Secret not available. You must regenerate to get a new secret.
                    </p>
                  )}
                </div>

                {/* Events */}
                {/* <div className="md:col-span-2 space-y-2">
                  <Label>Events</Label>
                  <div className="flex flex-wrap gap-2">
                    {viewWebhook.events?.map((event: string) => getEventBadge(event))}
                  </div>
                </div> */}

                {/* Additional Info */}
                {/* <div className="space-y-2">
                  <Label>Created</Label>
                  <p className="text-sm">{formatDate(viewWebhook.createdAt)}</p>
                </div>
                <div className="space-y-2">
                  <Label>Last Updated</Label>
                  <p className="text-sm">{formatDate(viewWebhook.updatedAt)}</p>
                </div>
                <div className="space-y-2">
                  <Label>Total Deliveries</Label>
                  <p className="text-sm">{viewWebhook._count?.deliveries || 0}</p>
                </div> */}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setViewWebhook(null);
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
              Are you sure you want to delete this webhook? This action cannot
              be undone and you will stop receiving event notifications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Webhook
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
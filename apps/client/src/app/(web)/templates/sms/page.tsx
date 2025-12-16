/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  // CardTitle,
  // CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit, 
  Search, 
  Loader2, 
  FileText,
  Info,
  ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
  variables: string[];
  useCase?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    smsMessages: number;
    bulkSends: number;
  };
}


export default function TemplatesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "Marketing", name: "Marketing" },
    { id: "Transactional", name: "Transactional" },
    { id: "OTP", name: "OTP" },
    { id: "Alert", name: "Alert" },
    { id: "Notification", name: "Notification" },
    { id: "Reminder", name: "Reminder" },
    { id: "Welcome", name: "Welcome" },
    { id: "Support", name: "Support" },
  ];

  // Fetch templates from API
  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const queryParams = new URLSearchParams();
      if (selectedCategory !== "all") queryParams.append("category", selectedCategory);
      if (searchTerm) queryParams.append("search", searchTerm);
      queryParams.append("limit", "50");

      const response = await fetch(`/api/templates?${queryParams.toString()}`, {
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
        throw new Error(`Failed to fetch templates: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || "Failed to load templates");
      }

      setTemplates(result.data.templates || []);
    } catch (error: any) {
      console.error("Error fetching templates:", error);
      toast.error(error.message || "Failed to load templates");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTemplates();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, selectedCategory]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        fetchTemplates();
      }
    }, 500);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, isAuthenticated]);

  const handleCreate = () => {
    setCurrentTemplate({
      id: "",
      name: "",
      content: "",
      category: "",
      variables: [],
      useCase: "",
      isApproved: true, // Auto-approved by default
      createdAt: "",
      updatedAt: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (template: Template) => {
    setCurrentTemplate(template);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setTemplateToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!templateToDelete) return;

    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(`/api/templates/${templateToDelete}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete template");
      }

      toast.success(result.message || "Template deleted successfully");
      setIsDeleteDialogOpen(false);
      setTemplateToDelete(null);
      
      // Refresh the list
      fetchTemplates();
    } catch (error: any) {
      console.error("Error deleting template:", error);
      toast.error(error.message || "Failed to delete template");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTemplate) return;

    // Validation
    if (!currentTemplate.name.trim()) {
      toast.error("Template name is required");
      return;
    }

    if (!currentTemplate.content.trim()) {
      toast.error("Template content is required");
      return;
    }

    if (!currentTemplate.category.trim()) {
      toast.error("Category is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const templateData = {
        name: currentTemplate.name.trim(),
        content: currentTemplate.content.trim(),
        category: currentTemplate.category.trim(),
        useCase: currentTemplate.useCase?.trim() || undefined,
      };

      const url = currentTemplate.id ? `/api/templates/${currentTemplate.id}` : "/api/templates";
      const method = currentTemplate.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(templateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to ${currentTemplate.id ? 'update' : 'create'} template`);
      }

      setIsDialogOpen(false);
      setCurrentTemplate(null);
      toast.success(result.message || `Template ${currentTemplate.id ? 'updated' : 'created'} successfully`);
      
      // Refresh the list
      fetchTemplates();
    } catch (error: any) {
      console.error("Error saving template:", error);
      toast.error(error.message || `Failed to ${currentTemplate.id ? 'update' : 'create'} template`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const extractVariables = (content: string) => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      matches.push(match[1]);
    }
    return Array.from(new Set(matches));
  };

  const handleContentChange = (content: string) => {
    if (!currentTemplate) return;
    const variables = extractVariables(content);
    setCurrentTemplate({
      ...currentTemplate,
      content,
      variables,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStatusBadge = (isApproved: boolean) => {
    return (
      <Badge variant="success" className="flex items-center gap-1">
        <ShieldCheck className="h-3 w-3" />
        Auto-Approved
      </Badge>
    );
  };

  const getUsageBadge = (template: Template) => {
    const totalUsage = (template._count?.smsMessages || 0) + (template._count?.bulkSends || 0);
    
    if (totalUsage === 0) {
      return <Badge variant="outline">Unused</Badge>;
    }
    
    return (
      <Badge variant="default">
        Used {totalUsage} time{totalUsage !== 1 ? 's' : ''}
      </Badge>
    );
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
          <p className="text-muted-foreground">Please log in to manage templates</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Message Templates</h1>
            <p className="text-muted-foreground">
              Create and manage your SMS message templates
            </p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading templates...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Auto-Approval Notice */}
      {/* <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <ShieldCheck className="h-5 w-5" />
            Auto-Approval Enabled
          </CardTitle>
          <CardDescription className="text-green-600 dark:text-green-300">
            All templates are automatically approved and ready for immediate use
          </CardDescription>
        </CardHeader>
      </Card> */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Message Templates</h1>
          <p className="text-muted-foreground">
            Create and manage auto-approved SMS templates for your business
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {currentTemplate?.id ? "Edit Template" : "Create New Template"}
                </DialogTitle>
                <DialogDescription>
                  {currentTemplate?.id
                    ? "Update your template. Changes will be available immediately."
                    : "Create a new message template. Templates are auto-approved and ready for use."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={currentTemplate?.name || ""}
                    onChange={(e) =>
                      currentTemplate &&
                      setCurrentTemplate({
                        ...currentTemplate,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g. Welcome Message, OTP Verification"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={currentTemplate?.category || ""}
                    onChange={(e) =>
                      currentTemplate &&
                      setCurrentTemplate({
                        ...currentTemplate,
                        category: e.target.value,
                      })
                    }
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select a category</option>
                    {categories.filter(cat => cat.id !== "all").map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Message Content</Label>
                  <Textarea
                    id="content"
                    value={currentTemplate?.content || ""}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Enter your template content. Use {{variable}} for placeholders."
                    rows={6}
                    className="resize-none font-mono text-sm"
                    required
                    disabled={isSubmitting}
                  />
                  <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-md">
                    <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Wrap variables in double curly braces like {"{{variable}}"}.</span>
                  </div>
                  {currentTemplate?.variables && currentTemplate.variables.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Detected variables:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {currentTemplate.variables.map((variable) => (
                          <Badge
                            key={variable}
                            variant="outline"
                            className="text-xs font-mono"
                          >
                            {"{{" + variable + "}}"}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="use-case">Use Case Description (Optional)</Label>
                  <Textarea
                    id="use-case"
                    value={currentTemplate?.useCase || ""}
                    onChange={(e) =>
                      currentTemplate &&
                      setCurrentTemplate({
                        ...currentTemplate,
                        useCase: e.target.value,
                      })
                    }
                    placeholder="Describe how this template will be used..."
                    rows={2}
                    disabled={isSubmitting}
                  />
                </div> */}

                {/* Auto-approval notice */}
                {/* <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-200 dark:border-green-800">
                  <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-green-700 dark:text-green-300">Auto-Approved</p>
                    <p className="text-green-600 dark:text-green-400 text-xs">
                      This template will be automatically approved and available for immediate use.
                    </p>
                  </div>
                </div> */}
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {currentTemplate?.id ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    currentTemplate?.id ? "Update Template" : "Create Template"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 pb-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates by name or content..."
              className="pl-9 w-full md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex h-10 w-[200px] items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Variables</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.length > 0 ? (
                templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {template.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{template.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(template.isApproved)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {template.variables.map((variable) => (
                          <Badge
                            key={variable}
                            variant="outline"
                            className="text-xs font-mono"
                          >
                            {"{{" + variable + "}}"}
                          </Badge>
                        ))}
                        {template.variables.length === 0 && (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getUsageBadge(template)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(template.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
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
                            onClick={() => handleEdit(template)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(template.id)}
                            disabled={(template._count?.smsMessages || 0) + (template._count?.bulkSends || 0) > 0}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                            {((template._count?.smsMessages || 0) + (template._count?.bulkSends || 0) > 0) && (
                              <span className="ml-1 text-xs text-muted-foreground">
                                (Cannot delete used templates)
                              </span>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground py-8">
                      <FileText className="h-12 w-12 mb-4 opacity-50" />
                      <p>No templates found</p>
                      <p className="text-sm mt-1">
                        {searchTerm || selectedCategory !== "all" 
                          ? "Try adjusting your search or filter criteria" 
                          : "Create your first template to get started"
                        }
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {templates.length > 0 && (
          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>1-{templates.length}</strong> of{" "}
              <strong>{templates.length}</strong> templates
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-green-500" />
              All templates auto-approved
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the template
              and remove it from our servers.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Mail,
  Phone,
  ChevronLeft,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  // Download,
  Calendar,
  Loader2,
  MapPin,
  Globe,
  Search,
  Upload,
  FileUp,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

type Contact = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  countryCode: string;
  network: string;
  dateOfBirth: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
};

type ContactGroup = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  contacts: Contact[];
  _count: {
    contacts: number;
  };
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export default function ContactGroupViewPage() {
  const params = useParams<{ id: string }>();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [group, setGroup] = useState<ContactGroup | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadResults, setUploadResults] = useState<{
    imported: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "GH",
    network: "",
    dateOfBirth: "",
    address: ""
  });

  const fetchGroup = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(`/api/contacts/groups/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch contact group");
      }

      if (result.success) {
        setGroup(result.data.group);
        setContacts(result.data.group.contacts || []);
        setPagination(prev => ({
          ...prev,
          total: result.data.group._count?.contacts || 0,
          pages: Math.ceil((result.data.group._count?.contacts || 0) / prev.limit)
        }));
      } else {
        throw new Error(result.error || "Failed to fetch contact group");
      }
    } catch (error: any) {
      console.error("Error fetching group:", error);
      toast.error(error.message || "Failed to fetch contact group");
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async (page = 1, searchTerm = "") => {
    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        groupId: params.id,
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/contacts?${searchParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch contacts");
      }

      if (result.success) {
        setContacts(result.data.contacts);
        setPagination(result.data.pagination);
      } else {
        throw new Error(result.error || "Failed to fetch contacts");
      }
    } catch (error: any) {
      console.error("Error fetching contacts:", error);
      toast.error(error.message || "Failed to fetch contacts");
    }
  };

  useEffect(() => {
    if (params.id && isAuthenticated) {
      fetchGroup();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, isAuthenticated]);

  const handleAddContact = async () => {
    if (!contactForm.name || !contactForm.phone) {
      toast.error("Name and phone are required");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(`/api/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...contactForm,
          groupId: params.id,
          dateOfBirth: contactForm.dateOfBirth || undefined,
          address: contactForm.address || undefined,
          email: contactForm.email || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add contact");
      }

      if (result.success) {
        toast.success(result.message || "Contact added successfully");
        setIsAddModalOpen(false);
        setContactForm({
          name: "",
          email: "",
          phone: "",
          countryCode: "GH",
          network: "",
          dateOfBirth: "",
          address: ""
        });
        fetchGroup(); // Refresh group and contacts
      } else {
        throw new Error(result.error || "Failed to add contact");
      }
    } catch (error: any) {
      console.error("Error adding contact:", error);
      toast.error(error.message || "Failed to add contact");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditContact = async () => {
    if (!currentContact || !contactForm.name || !contactForm.phone) {
      toast.error("Name and phone are required");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(
        `/api/contacts/${currentContact.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...contactForm,
            groupId: params.id,
            dateOfBirth: contactForm.dateOfBirth || undefined,
            address: contactForm.address || undefined,
            email: contactForm.email || undefined,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update contact");
      }

      if (result.success) {
        toast.success(result.message || "Contact updated successfully");
        setIsEditModalOpen(false);
        setCurrentContact(null);
        fetchGroup(); // Refresh contacts
      } else {
        throw new Error(result.error || "Failed to update contact");
      }
    } catch (error: any) {
      console.error("Error updating contact:", error);
      toast.error(error.message || "Failed to update contact");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!currentContact) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(
        `/api/contacts/${currentContact.id}`,
        {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete contact");
      }

      if (result.success) {
        toast.success(result.message || "Contact deleted successfully");
        setIsDeleteModalOpen(false);
        setCurrentContact(null);
        fetchGroup(); // Refresh group and contacts
      } else {
        throw new Error(result.error || "Failed to delete contact");
      }
    } catch (error: any) {
      console.error("Error deleting contact:", error);
      toast.error(error.message || "Failed to delete contact");
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!uploadFile) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      setUploading(true);
      setUploadResults(null);

      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("groupId", params.id);

      const response = await fetch("/api/contacts/bulk-import", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload contacts");
      }

      if (result.success) {
        toast.success(result.message || "Contacts uploaded successfully");
        setUploadResults(result.data);
        setUploadFile(null);
        
        // Refresh the contacts list
        fetchGroup();
        
        // Close modal after successful upload
        setTimeout(() => {
          setIsBulkUploadModalOpen(false);
          setUploadResults(null);
        }, 3000);
      } else {
        throw new Error(result.error || "Failed to upload contacts");
      }
    } catch (error: any) {
      console.error("Error uploading contacts:", error);
      toast.error(error.message || "Failed to upload contacts");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/)) {
        toast.error("Please upload a CSV or Excel file");
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      setUploadFile(file);
      setUploadResults(null);
    }
  };

  const openEditModal = (contact: Contact) => {
    setCurrentContact(contact);
    setContactForm({
      name: contact.name,
      email: contact.email || "",
      phone: contact.phone,
      countryCode: contact.countryCode,
      network: contact.network,
      dateOfBirth: contact.dateOfBirth || "",
      address: contact.address || ""
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (contact: Contact) => {
    setCurrentContact(contact);
    setIsDeleteModalOpen(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setTimeout(() => {
      fetchContacts(1, e.target.value);
    }, 300);
  };

  const handlePageChange = (newPage: number) => {
    fetchContacts(newPage, search);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getNetworkBadge = (network: string) => {
    const networkColors: { [key: string]: string } = {
      'MTN': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'VODAFONE': 'bg-red-100 text-red-800 border-red-200',
      'AT': 'bg-blue-100 text-blue-800 border-blue-200',
      'AIRTELTIGO': 'bg-purple-100 text-purple-800 border-purple-200',
      'UNKNOWN': 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <Badge variant="outline" className={networkColors[network] || networkColors.UNKNOWN}>
        {network}
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
          <p className="text-muted-foreground">Please log in to view contacts</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <TableHead key={i}>
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5].map((row) => (
                  <TableRow key={row}>
                    {[1, 2, 3, 4, 5, 6, 7].map((cell) => (
                      <TableCell key={cell}>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <Skeleton className="h-4 w-48" />
            <div className="space-x-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!group) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/phonebook/groups">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{group.name}</h1>
          {group.description && (
            <p className="text-muted-foreground">{group.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Contacts
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {group._count.contacts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Created on {formatDate(group.createdAt)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDate(group.updatedAt)}</div>
            <p className="text-xs text-muted-foreground">Last modification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Actions</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {/* <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button> */}
              <Button variant="outline" size="sm" onClick={() => setIsBulkUploadModalOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload
              </Button>
              <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-bold tracking-tight">Contact List</h2>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts by name, phone, or email..."
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
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Network</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No contacts found</p>
                    <p className="text-sm mt-2">
                      {search ? "Try a different search term" : "Add your first contact to this group"}
                    </p>
                    {!search && (
                      <div className="flex gap-2 justify-center mt-4">
                        <Button 
                          onClick={() => setIsAddModalOpen(true)} 
                          size="sm"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Contact
                        </Button>
                        <Button 
                          onClick={() => setIsBulkUploadModalOpen(true)} 
                          variant="outline"
                          size="sm"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Bulk Upload
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {contact.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {contact.email ? (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {contact.email}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {contact.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        {contact.countryCode}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getNetworkBadge(contact.network)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(contact.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openEditModal(contact)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => openDeleteModal(contact)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        {contacts.length > 0 && (
          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)}</strong> of{" "}
              <strong>{pagination.total}</strong> contacts
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
          </CardFooter>
        )}
      </Card>

      {/* Add Contact Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>
              Fill in the details for the new contact
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={contactForm.name}
                onChange={(e) =>
                  setContactForm({ ...contactForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter email address"
                type="email"
                value={contactForm.email}
                onChange={(e) =>
                  setContactForm({ ...contactForm, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                value={contactForm.phone}
                onChange={(e) =>
                  setContactForm({ ...contactForm, phone: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="countryCode">Country Code</Label>
                <Input
                  id="countryCode"
                  placeholder="GH"
                  value={contactForm.countryCode}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, countryCode: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="network">Network</Label>
                <Input
                  id="network"
                  placeholder="Network"
                  value={contactForm.network}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, network: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={contactForm.dateOfBirth}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, dateOfBirth: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  placeholder="Enter address"
                  value={contactForm.address}
                  onChange={(e) => setContactForm({...contactForm, address: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddContact} disabled={submitting || !contactForm.name.trim() || !contactForm.phone.trim()}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>Update the contact details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                placeholder="Enter full name"
                value={contactForm.name}
                onChange={(e) =>
                  setContactForm({ ...contactForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                placeholder="Enter email address"
                type="email"
                value={contactForm.email}
                onChange={(e) =>
                  setContactForm({ ...contactForm, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number *</Label>
              <Input
                id="edit-phone"
                placeholder="Enter phone number"
                value={contactForm.phone}
                onChange={(e) =>
                  setContactForm({ ...contactForm, phone: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-countryCode">Country Code</Label>
                <Input
                  id="edit-countryCode"
                  placeholder="GH"
                  value={contactForm.countryCode}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, countryCode: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-network">Network</Label>
                <Input
                  id="edit-network"
                  placeholder="Network"
                  value={contactForm.network}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, network: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-dateOfBirth">Date of Birth</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="edit-dateOfBirth"
                  type="date"
                  value={contactForm.dateOfBirth}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, dateOfBirth: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="edit-address"
                  placeholder="Enter address"
                  value={contactForm.address}
                  onChange={(e) => setContactForm({...contactForm, address: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditContact} disabled={submitting || !contactForm.name.trim() || !contactForm.phone.trim()}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteContact} disabled={deleting}>
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Modal */}
      <Dialog open={isBulkUploadModalOpen} onOpenChange={setIsBulkUploadModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Upload Contacts</DialogTitle>
            <DialogDescription>
              Upload a CSV or Excel file to import multiple contacts into this group.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {!uploadFile ? (
                <div className="space-y-4">
                  <FileUp className="h-12 w-12 mx-auto text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Drop your file here or click to browse
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports CSV, XLS, XLSX files (max 10MB)
                    </p>
                  </div>
                  <Input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                    id="bulk-upload-file"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('bulk-upload-file')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Select File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileUp className="h-8 w-8 text-blue-500" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {uploadFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUploadFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Upload Results */}
                  {uploadResults && (
                    <div className="space-y-2 text-left">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 font-medium">
                          ✓ {uploadResults.imported} contacts imported
                        </span>
                        {uploadResults.failed > 0 && (
                          <span className="text-red-600 font-medium">
                            ✗ {uploadResults.failed} failed
                          </span>
                        )}
                      </div>
                      
                      {uploadResults.errors && uploadResults.errors.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3 max-h-32 overflow-y-auto">
                          <p className="text-sm font-medium text-red-800 mb-2">Errors:</p>
                          <ul className="text-xs text-red-700 space-y-1">
                            {uploadResults.errors.slice(0, 5).map((error, index) => (
                              <li key={index}>• {error}</li>
                            ))}
                            {uploadResults.errors.length > 5 && (
                              <li className="text-red-600">
                                ... and {uploadResults.errors.length - 5} more errors
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* File Format Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                Expected File Format:
              </h4>
              <div className="text-xs text-blue-700 space-y-1">
                <p>• Required columns: <strong>name</strong>, <strong>phone</strong></p>
                <p>• Optional columns: <strong>email</strong>, <strong>countryCode</strong>, <strong>network</strong>, <strong>dateOfBirth</strong>, <strong>address</strong></p>
                <p>• First row should contain column headers</p>
                <p>• Phone numbers should be in international format (e.g., +233XXXXXXXXX)</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsBulkUploadModalOpen(false);
                setUploadFile(null);
                setUploadResults(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleBulkUpload} 
              disabled={!uploadFile || uploading}
            >
              {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {uploading ? "Uploading..." : "Upload Contacts"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
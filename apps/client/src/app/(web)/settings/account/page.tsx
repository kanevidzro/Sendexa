// app/settings/account/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Building02Icon,
  CreditCardIcon,
  DollarCircleIcon,
   Globe02Icon,
  Mail01Icon,
  SmartPhone01Icon,
  BookBookmark01Icon,
  Settings01Icon,
  ShieldEnergyIcon,
  CloudUploadIcon,
  User03Icon,
  Wallet01Icon,
  Cancel01Icon,
  ZapIcon,
} from '@hugeicons/core-free-icons';

// Validation schema based on your Account model
const accountSchema = z.object({
  // Account Info
  name: z.string().min(1, "Account name is required"),
  description: z.string().optional(),
  
  // Contact
  contactEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  
  // Location
  country: z.string(),
  currency: z.string(),
  
  // Balance Settings
  autoRechargeEnabled: z.boolean().default(false),
  autoRechargeAmount: z.number().min(10).optional(),
  lowBalanceThreshold: z.number().min(0).default(10),
  autoConvertToCredits: z.boolean().default(false),
  
  // Limits
  dailySpendLimit: z.number().min(0).optional(),
  monthlySpendLimit: z.number().min(0).optional(),
  
  // Features
  allowMultipleSenderIds: z.boolean().default(true),
  allowCampaigns: z.boolean().default(true),
  allowAPIKeys: z.boolean().default(true),
  allowTeamMembers: z.boolean().default(true),
  allowWebhooks: z.boolean().default(true),
});

type AccountFormData = z.infer<typeof accountSchema>;

// Mock account data based on your Account model
const mockAccountData = {
  id: "acc_123",
  name: "John's Business",
  description: "My personal business account",
  type: "PERSONAL",
  isPersonal: true,
  status: "ACTIVE",
  verificationStatus: "APPROVED",
  
  // Contact
  contactEmail: "contact@example.com",
  contactPhone: "+233 50 123 4567",
  
  // Location
  country: "GH",
  countryCode: "+233",
  timezone: "Africa/Accra",
  currency: "GHS",
  
  // Personal Account Fields
  personalIdNumber: "GHA-123456789",
  dateOfBirth: new Date("1990-01-01"),
  
  // Business Account Fields (null for personal)
  businessName: null,
  businessType: null,
  
  // Balance System
  walletBalance: 1250.50,
  creditBalance: 500.00,
  lifetimeSpent: 8500.75,
  
  // Settings
  autoRechargeEnabled: true,
  autoRechargeAmount: 100,
  lowBalanceThreshold: 10,
  autoConvertToCredits: false,
  
  // Limits
  dailySmsLimit: 1000,
  monthlySmsLimit: 30000,
  dailySpendLimit: 500,
  monthlySpendLimit: 15000,
  apiRateLimit: 100,
  maxTeamMembers: 5,
  
  // Features
  allowMultipleSenderIds: true,
  allowCampaigns: true,
  allowAPIKeys: true,
  allowTeamMembers: true,
  allowWebhooks: true,
  
  // Verification
  documentsSubmitted: 3,
  documentsApproved: 3,
  kycStatus: "verified",
  amlStatus: "verified",
  
  // Referral
  referralCode: "JOHNDOE123",
  referralCount: 5,
  referralEarnings: 250.00,
  
  // Subscription
  subscriptionPlan: "premium",
  subscriptionStatus: "active",
  
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date(),
};

// Country options
const countryOptions = [
  { value: "GH", label: "Ghana (+233)" },
  { value: "NG", label: "Nigeria (+234)" },
  { value: "KE", label: "Kenya (+254)" },
  { value: "ZA", label: "South Africa (+27)" },
  { value: "US", label: "United States (+1)" },
  { value: "UK", label: "United Kingdom (+44)" },
];

// Currency options
const currencyOptions = [
  { value: "GHS", label: "Ghanaian Cedi (GHS)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" },
  { value: "KES", label: "Kenyan Shilling (KES)" },
  { value: "NGN", label: "Nigerian Naira (NGN)" },
];

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: mockAccountData.name,
      description: mockAccountData.description,
      contactEmail: mockAccountData.contactEmail || "",
      contactPhone: mockAccountData.contactPhone || "",
      country: mockAccountData.country,
      currency: mockAccountData.currency,
      autoRechargeEnabled: mockAccountData.autoRechargeEnabled,
      autoRechargeAmount: mockAccountData.autoRechargeAmount,
      lowBalanceThreshold: mockAccountData.lowBalanceThreshold,
      autoConvertToCredits: mockAccountData.autoConvertToCredits,
      dailySpendLimit: mockAccountData.dailySpendLimit,
      monthlySpendLimit: mockAccountData.monthlySpendLimit,
      allowMultipleSenderIds: mockAccountData.allowMultipleSenderIds,
      allowCampaigns: mockAccountData.allowCampaigns,
      allowAPIKeys: mockAccountData.allowAPIKeys,
      allowTeamMembers: mockAccountData.allowTeamMembers,
      allowWebhooks: mockAccountData.allowWebhooks,
    },
  });

  const onSubmit = async (data: AccountFormData) => {
    console.log('Account update:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { variant: "default" as const, label: "Active" },
      SUSPENDED: { variant: "destructive" as const, label: "Suspended" },
      PENDING_VERIFICATION: { variant: "outline" as const, label: "Pending Verification" },
      VERIFICATION_REQUIRED: { variant: "destructive" as const, label: "Verification Required" },
      CLOSED: { variant: "outline" as const, label: "Closed" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: "outline", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getVerificationBadge = (status: string) => {
    const statusConfig = {
      APPROVED: { variant: "default" as const, label: "Approved" },
      PENDING: { variant: "outline" as const, label: "Pending" },
      REJECTED: { variant: "destructive" as const, label: "Rejected" },
      UNDER_REVIEW: { variant: "outline" as const, label: "Under Review" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: "outline", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information, settings, and preferences
        </p>
      </div>

      {/* Account Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={Building02Icon} className="h-5 w-5" />
            Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Account Status</p>
              <div>{getStatusBadge(mockAccountData.status)}</div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Verification</p>
              <div>{getVerificationBadge(mockAccountData.verificationStatus)}</div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Account Type</p>
              <p className="text-sm">
                {mockAccountData.isPersonal ? "Personal Account" : "Business Account"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Plan</p>
              <Badge variant="outline" className="capitalize">
                {mockAccountData.subscriptionPlan}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={Wallet01Icon} className="h-5 w-5" />
            Balance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 p-4 rounded-lg bg-primary/5 border">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Wallet Balance</p>
                <HugeiconsIcon icon={DollarCircleIcon} className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">
                {mockAccountData.currency} {mockAccountData.walletBalance.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">Available for immediate use</p>
            </div>
            
            <div className="space-y-2 p-4 rounded-lg bg-secondary/5 border">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Credit Balance</p>
                <HugeiconsIcon icon={CreditCardIcon} className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">
                {mockAccountData.currency} {mockAccountData.creditBalance.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">Credits for services</p>
            </div>
            
            <div className="space-y-2 p-4 rounded-lg bg-muted/5 border">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Lifetime Spent</p>
                <HugeiconsIcon icon={DollarCircleIcon} className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">
                {mockAccountData.currency} {mockAccountData.lifetimeSpent.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">Total amount spent</p>
            </div>
          </div>
          
          <div className="mt-6 flex gap-4">
            <Button>Add Funds</Button>
            {/* <Button variant="outline">View Transactions</Button> */}
            <Button variant="outline">Convert to Credits</Button>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="general">
              <HugeiconsIcon icon={Settings01Icon} className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="billing">
              <HugeiconsIcon icon={DollarCircleIcon} className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="limits">
              <HugeiconsIcon icon={ShieldEnergyIcon} className="h-4 w-4 mr-2" />
              Limits
            </TabsTrigger>
            <TabsTrigger value="features">
              <HugeiconsIcon icon={ZapIcon} className="h-4 w-4 mr-2" />
              Features
            </TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Basic information about your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Account Name *
                    {errors.name && (
                      <span className="text-destructive text-xs ml-2">
                        {errors.name.message}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="name"
                    {...register('name')}
                    disabled={!isEditing}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    disabled={!isEditing}
                    placeholder="Brief description of your account"
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="country" className="flex items-center gap-2">
                      <HugeiconsIcon icon={ Globe02Icon} className="h-4 w-4" />
                      Country
                    </Label>
                    <Select 
                      disabled={!isEditing}
                      value={watch('country')}
                      onValueChange={(value) => setValue('country', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryOptions.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency" className="flex items-center gap-2">
                      <HugeiconsIcon icon={DollarCircleIcon} className="h-4 w-4" />
                      Currency
                    </Label>
                    <Select 
                      disabled={!isEditing}
                      value={watch('currency')}
                      onValueChange={(value) => setValue('currency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencyOptions.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="flex items-center gap-2">
                      <HugeiconsIcon icon={Mail01Icon} className="h-4 w-4" />
                      Contact Email
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      {...register('contactEmail')}
                      disabled={!isEditing}
                    />
                    <p className="text-sm text-muted-foreground">
                      For billing and important notifications
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone" className="flex items-center gap-2">
                      <HugeiconsIcon icon={SmartPhone01Icon} className="h-4 w-4" />
                      Contact Phone
                    </Label>
                    <Input
                      id="contactPhone"
                      {...register('contactPhone')}
                      disabled={!isEditing}
                      placeholder="+233 50 123 4567"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information (for personal accounts) */}
            {mockAccountData.isPersonal && (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Your personal details for verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Personal ID Number</Label>
                      <Input
                        value={mockAccountData.personalIdNumber || ''}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input
                        value={mockAccountData.dateOfBirth?.toLocaleDateString() || ''}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Verification Status</p>
                      <p className="text-sm text-muted-foreground">
                        {mockAccountData.documentsApproved} of {mockAccountData.documentsSubmitted} documents approved
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Billing Settings Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Auto-Recharge Settings</CardTitle>
                <CardDescription>
                  Configure automatic balance top-up
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoRechargeEnabled">Enable Auto-Recharge</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically add funds when balance is low
                    </p>
                  </div>
                  <Switch
                    id="autoRechargeEnabled"
                    checked={watch('autoRechargeEnabled')}
                    onCheckedChange={(checked) => setValue('autoRechargeEnabled', checked)}
                    disabled={!isEditing}
                  />
                </div>

                {watch('autoRechargeEnabled') && (
                  <div className="space-y-4 pl-6 border-l-2 border-primary/20">
                    <div className="space-y-2">
                      <Label htmlFor="autoRechargeAmount">Recharge Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-muted-foreground">
                          {watch('currency')}
                        </span>
                        <Input
                          id="autoRechargeAmount"
                          type="number"
                          {...register('autoRechargeAmount', { valueAsNumber: true })}
                          disabled={!isEditing}
                          className="pl-14"
                          min={10}
                          step={10}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Amount to add when balance reaches threshold
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lowBalanceThreshold">Low Balance Threshold</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-muted-foreground">
                          {watch('currency')}
                        </span>
                        <Input
                          id="lowBalanceThreshold"
                          type="number"
                          {...register('lowBalanceThreshold', { valueAsNumber: true })}
                          disabled={!isEditing}
                          className="pl-14"
                          min={0}
                          step={5}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Trigger auto-recharge when balance falls below this amount
                      </p>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoConvertToCredits">Auto-Convert to Credits</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically convert excess funds to service credits
                    </p>
                  </div>
                  <Switch
                    id="autoConvertToCredits"
                    checked={watch('autoConvertToCredits')}
                    onCheckedChange={(checked) => setValue('autoConvertToCredits', checked)}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your payment options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-16 rounded bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">MM</span>
                    </div>
                    <div>
                      <p className="font-medium">Mobile Money</p>
                      <p className="text-sm text-muted-foreground">024 123 4567</p>
                    </div>
                  </div>
                  <Badge variant="outline">Default</Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-16 rounded bg-secondary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">CC</span>
                    </div>
                    <div>
                      <p className="font-medium">Credit Card</p>
                      <p className="text-sm text-muted-foreground">**** **** **** 4242</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Make Default
                  </Button>
                </div>

                <Button variant="outline" className="w-full">
                  <HugeiconsIcon icon={CloudUploadIcon} className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Limits Tab */}
          <TabsContent value="limits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending Limits</CardTitle>
                <CardDescription>
                  Set limits to control your account spending
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dailySpendLimit">Daily Spend Limit</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-muted-foreground">
                        {watch('currency')}
                      </span>
                      <Input
                        id="dailySpendLimit"
                        type="number"
                        {...register('dailySpendLimit', { valueAsNumber: true })}
                        disabled={!isEditing}
                        className="pl-14"
                        min={0}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Maximum amount that can be spent in one day
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlySpendLimit">Monthly Spend Limit</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-muted-foreground">
                        {watch('currency')}
                      </span>
                      <Input
                        id="monthlySpendLimit"
                        type="number"
                        {...register('monthlySpendLimit', { valueAsNumber: true })}
                        disabled={!isEditing}
                        className="pl-14"
                        min={0}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Maximum amount that can be spent in one month
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Usage</p>
                      <p className="text-sm text-muted-foreground">
                        Daily: {mockAccountData.currency} 125.50 / {watch('dailySpendLimit') || 500}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Monthly: {mockAccountData.currency} 1,250.75 / {watch('monthlySpendLimit') || 15000}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Reset Counters
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Message Limits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Daily SMS Limit</Label>
                      <Input
                        value={mockAccountData.dailySmsLimit?.toString() || ''}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-sm text-muted-foreground">
                        Maximum SMS per day: 750 sent
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Monthly SMS Limit</Label>
                      <Input
                        value={mockAccountData.monthlySmsLimit?.toString() || ''}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-sm text-muted-foreground">
                        Maximum SMS per month: 12,500 sent
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Features</CardTitle>
                <CardDescription>
                  Enable or disable account features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allowMultipleSenderIds">Multiple Sender IDs</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow using multiple sender IDs for messages
                      </p>
                    </div>
                    <Switch
                      id="allowMultipleSenderIds"
                      checked={watch('allowMultipleSenderIds')}
                      onCheckedChange={(checked) => setValue('allowMultipleSenderIds', checked)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allowCampaigns">Campaigns</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow creating and sending message campaigns
                      </p>
                    </div>
                    <Switch
                      id="allowCampaigns"
                      checked={watch('allowCampaigns')}
                      onCheckedChange={(checked) => setValue('allowCampaigns', checked)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allowAPIKeys">API Keys</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow generating and using API keys
                      </p>
                    </div>
                    <Switch
                      id="allowAPIKeys"
                      checked={watch('allowAPIKeys')}
                      onCheckedChange={(checked) => setValue('allowAPIKeys', checked)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allowTeamMembers">Team Members</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow adding team members to this account
                      </p>
                    </div>
                    <Switch
                      id="allowTeamMembers"
                      checked={watch('allowTeamMembers')}
                      onCheckedChange={(checked) => setValue('allowTeamMembers', checked)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allowWebhooks">Webhooks</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow configuring webhooks for events
                      </p>
                    </div>
                    <Switch
                      id="allowWebhooks"
                      checked={watch('allowWebhooks')}
                      onCheckedChange={(checked) => setValue('allowWebhooks', checked)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <Separator />

                <div className="p-4 rounded-lg bg-muted/20">
                  <div className="flex items-center gap-3">
                    <HugeiconsIcon icon={User03Icon} className="h-5 w-5 text-primary" />
                    <div className="space-y-1">
                      <p className="font-medium">Team Members</p>
                      <p className="text-sm text-muted-foreground">
                        3 of {mockAccountData.maxTeamMembers} team members added
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Manage Team
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={BookBookmark01Icon} className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto"
            >
              Edit Account Settings
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
// app/settings/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
//import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Camera01Icon,
  Cancel01Icon,
  CheckmarkBadge04Icon,
  CloudUploadIcon,
  Delete02Icon,
  Globe02Icon,
  LanguageSquareIcon,
  Mail01Icon,
  SmartPhone01Icon,
  BookBookmark01Icon,
  ShieldEnergyIcon,
  UserCheckIcon,
} from '@hugeicons/core-free-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
//import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Validation schema based on your User model
const profileSchema = z.object({
  // Basic Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  
  // Profile
  avatarUrl: z.string().url().optional().or(z.literal('')),
  timezone: z.string().default("Africa/Accra"),
  language: z.string().default("en"),
  
  // Security preferences
  twoFactorEnabled: z.boolean().default(false),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Mock user data based on your User model
const mockUserData = {
  id: "user_123",
  email: "john.doe@example.com",
  emailVerified: true,
  emailVerifiedAt: new Date("2024-01-15"),
  phone: "+233 50 123 4567",
  phoneVerified: true,
  firstName: "John",
  lastName: "Doe",
  avatarUrl: "https://github.com/shadcn.png",
  timezone: "Africa/Accra",
  language: "en",
  twoFactorEnabled: true,
  twoFactorSecret: null,
  backupCodes: [],
  lastPasswordChange: new Date("2024-01-01"),
  lastLoginAt: new Date(),
  lastActiveAt: new Date(),
  failedLoginAttempts: 0,
  lockedUntil: null,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date(),
};

// Timezone options
const timezoneOptions = [
  { value: "Africa/Accra", label: "Africa/Accra (GMT+0)" },
  { value: "Africa/Lagos", label: "Africa/Lagos (GMT+1)" },
  { value: "Africa/Nairobi", label: "Africa/Nairobi (GMT+3)" },
  { value: "Europe/London", label: "Europe/London (GMT+0)" },
  { value: "America/New_York", label: "America/New_York (GMT-5)" },
  { value: "Asia/Dubai", label: "Asia/Dubai (GMT+4)" },
];

// Language options
const languageOptions = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
  { value: "ar", label: "Arabic" },
  { value: "pt", label: "Portuguese" },
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(mockUserData.avatarUrl);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: mockUserData.firstName,
      lastName: mockUserData.lastName,
      email: mockUserData.email,
      phone: mockUserData.phone || "",
      avatarUrl: mockUserData.avatarUrl,
      timezone: mockUserData.timezone,
      language: mockUserData.language,
      twoFactorEnabled: mockUserData.twoFactorEnabled,
    },
  });

  const handleAvatarUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      setValue('avatarUrl', url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview('');
    setValue('avatarUrl', '');
  };

  const onSubmit = async (data: ProfileFormData) => {
    console.log('Profile update:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
    setAvatarPreview(mockUserData.avatarUrl);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account preferences
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Profile Picture Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={UserCheckIcon} className="h-5 w-5" />
                Profile Picture
              </CardTitle>
              <CardDescription>
                This will be displayed on your account and in communications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-border">
                    <AvatarImage src={avatarPreview} />
                    <AvatarFallback className="text-lg">
                      {mockUserData.firstName?.[0]}
                      {mockUserData.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2 flex gap-2">
                      <label className="h-8 w-8 rounded-full bg-primary border-2 border-background flex items-center justify-center hover:bg-primary/90 transition-colors cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleAvatarUpload(file);
                          }}
                        />
                        <HugeiconsIcon 
                          icon={isUploading ?CloudUploadIcon : Camera01Icon} 
                          className="h-4 w-4 text-primary-foreground"
                        />
                      </label>
                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="h-8 w-8 rounded-full bg-destructive border-2 border-background flex items-center justify-center hover:bg-destructive/90 transition-colors"
                        >
                          <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4 text-destructive-foreground" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <p className="text-sm text-muted-foreground">
                    Recommended: JPG, PNG, or GIF, at least 400x400 pixels. Max 5MB.
                  </p>
                  {!isEditing && (
                    <Button 
                      type="button" 
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={UserCheckIcon} className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name *
                    {errors.firstName && (
                      <span className="text-destructive text-xs ml-2">
                        {errors.firstName.message}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    disabled={!isEditing}
                    className={errors.firstName ? 'border-destructive' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name *
                    {errors.lastName && (
                      <span className="text-destructive text-xs ml-2">
                        {errors.lastName.message}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    disabled={!isEditing}
                    className={errors.lastName ? 'border-destructive' : ''}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  Email Address *
                  {mockUserData.emailVerified && (
                    <Badge variant="outline" className="text-xs">
                      <HugeiconsIcon icon={CheckmarkBadge04Icon} className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {errors.email && (
                    <span className="text-destructive text-xs ml-2">
                      {errors.email.message}
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <HugeiconsIcon 
                    icon={Mail01Icon} 
                    className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                  />
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    disabled={!isEditing}
                    className={errors.email ? 'border-destructive pl-10' : 'pl-10'}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Your primary email address for account notifications
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  Phone Number
                  {mockUserData.phoneVerified && (
                    <Badge variant="outline" className="text-xs">
                      <HugeiconsIcon icon={CheckmarkBadge04Icon} className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </Label>
                <div className="relative">
                  <HugeiconsIcon 
                    icon={SmartPhone01Icon} 
                    className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                  />
                  <Input
                    id="phone"
                    {...register('phone')}
                    disabled={!isEditing}
                    placeholder="+233 50 123 4567"
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Your phone number for SMS notifications and two-factor authentication
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={Globe02Icon} className="h-5 w-5" />
                Preferences
              </CardTitle>
              <CardDescription>
                Customize your account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="flex items-center gap-2">
                    <HugeiconsIcon icon={Globe02Icon} className="h-4 w-4" />
                    Timezone
                  </Label>
                  <Select 
                    disabled={!isEditing}
                    value={watch('timezone')}
                    onValueChange={(value) => setValue('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezoneOptions.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Set your local timezone for accurate timestamps
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language" className="flex items-center gap-2">
                    <HugeiconsIcon icon={LanguageSquareIcon} className="h-4 w-4" />
                    Language
                  </Label>
                  <Select 
                    disabled={!isEditing}
                    value={watch('language')}
                    onValueChange={(value) => setValue('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Interface language preference
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactorEnabled" className="flex items-center gap-2">
                      <HugeiconsIcon icon={ShieldEnergyIcon} className="h-4 w-4" />
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    id="twoFactorEnabled"
                    checked={watch('twoFactorEnabled')}
                    onCheckedChange={(checked) => setValue('twoFactorEnabled', checked)}
                    disabled={!isEditing}
                  />
                </div>
                {watch('twoFactorEnabled') && (
                  <div className="pl-6 border-l-2 border-primary/20">
                    <p className="text-sm">
                      Two-factor authentication is enabled for your account
                    </p>
                    {isEditing && (
                      <Button type="button" variant="outline" size="sm" className="mt-2">
                        Manage 2FA Settings
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                System information about your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Account Created</p>
                  <p className="text-sm text-muted-foreground">
                    {mockUserData.createdAt.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Last Login</p>
                  <p className="text-sm text-muted-foreground">
                    {mockUserData.lastLoginAt?.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) || 'Never'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Email Verification</p>
                  <p className="text-sm text-muted-foreground">
                    {mockUserData.emailVerified ? 'Verified' : 'Pending'}
                    {mockUserData.emailVerifiedAt && (
                      <span className="block text-xs">
                        on {mockUserData.emailVerifiedAt.toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Phone Verification</p>
                  <p className="text-sm text-muted-foreground">
                    {mockUserData.phoneVerified ? 'Verified' : 'Not verified'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <HugeiconsIcon icon={ Cancel01Icon} className="h-4 w-4 mr-2" />
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
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
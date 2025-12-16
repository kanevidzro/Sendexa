/* eslint-disable @typescript-eslint/no-explicit-any */
// app/settings/security/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HugeiconsIcon } from '@hugeicons/react';
import {
  BookBookmark01Icon,
  Cancel01Icon,
  CheckmarkBadge04Icon,
  ClockIcon,
  ComputerIcon,
  Delete04Icon,
  Tablet01Icon,
  Key01Icon,
  LockPasswordIcon,
  ArrowReloadHorizontalIcon,
  Shield01Icon,
  ShieldEnergyIcon,
  UserShieldIcon,
  ViewIcon,
  ViewOffSlashIcon,
  SmartPhoneIcon,
  Logout01Icon,
} from '@hugeicons/core-free-icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Password validation schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

// Mock security data based on your User model
const mockSecurityData = {
  // 2FA Settings
  twoFactorEnabled: true,
  twoFactorMethod: "authenticator", // "authenticator" | "sms" | "email"
  twoFactorBackupCodes: [
    "ABCD-1234",
    "EFGH-5678",
    "IJKL-9012",
    "MNOP-3456",
    "QRST-7890",
    "UVWX-1234",
    "YZAB-5678",
    "CDEF-9012",
  ],
  
  // Password Info
  lastPasswordChange: new Date("2024-01-15"),
  passwordAge: 45, // days
  
  // Sessions
  activeSessions: [
    {
      id: "sess_1",
      device: "Chrome on Windows",
      location: "Accra, Ghana",
      ip: "192.168.1.100",
      lastActive: new Date("2024-02-20T10:30:00"),
      current: true,
    },
    {
      id: "sess_2",
      device: "Safari on iPhone",
      location: "Kumasi, Ghana",
      ip: "192.168.1.101",
      lastActive: new Date("2024-02-19T15:45:00"),
      current: false,
    },
    {
      id: "sess_3",
      device: "Firefox on Mac",
      location: "Takoradi, Ghana",
      ip: "192.168.1.102",
      lastActive: new Date("2024-02-18T09:15:00"),
      current: false,
    },
  ],
  
  // Security Events
  recentSecurityEvents: [
    {
      id: "event_1",
      action: "Password changed",
      device: "Chrome on Windows",
      location: "Accra, Ghana",
      ip: "192.168.1.100",
      timestamp: new Date("2024-02-15T14:30:00"),
      status: "success",
    },
    {
      id: "event_2",
      action: "2FA enabled",
      device: "Safari on iPhone",
      location: "Kumasi, Ghana",
      ip: "192.168.1.101",
      timestamp: new Date("2024-02-10T11:20:00"),
      status: "success",
    },
    {
      id: "event_3",
      action: "Failed login attempt",
      device: "Unknown",
      location: "Unknown",
      ip: "103.21.244.0",
      timestamp: new Date("2024-02-05T03:45:00"),
      status: "failed",
    },
    {
      id: "event_4",
      action: "New device login",
      device: "Firefox on Mac",
      location: "Takoradi, Ghana",
      ip: "192.168.1.102",
      timestamp: new Date("2024-01-28T16:10:00"),
      status: "success",
    },
  ],
  
  // Login Security
  failedLoginAttempts: 1,
  lockedUntil: null,
  
  // Security Settings
  requireReauthForSensitiveActions: true,
  sessionTimeout: 24, // hours
  loginNotifications: true,
  suspiciousActivityAlerts: true,
};

// 2FA method options
// const twoFAMethods = [
//   { value: "authenticator", label: "Authenticator App", icon: Smartphone01Icon },
//   { value: "sms", label: "SMS", icon:Smartphone01Icon },
//   { value: "email", label: "Email", icon: MailIcon },
// ];

// Session timeout options
const sessionTimeoutOptions = [
  { value: 1, label: "1 hour" },
  { value: 4, label: "4 hours" },
  { value: 8, label: "8 hours" },
  { value: 24, label: "24 hours" },
  { value: 168, label: "7 days" },
  { value: 720, label: "30 days" },
];

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState("authentication");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [isRegeneratingCodes, setIsRegeneratingCodes] = useState(false);
  const [isRevokingAll, setIsRevokingAll] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    console.log('Password change:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    reset();
  };

  const handleRegenerateBackupCodes = async () => {
    setIsRegeneratingCodes(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Backup codes regenerated');
    } catch (error) {
      console.error('Failed to regenerate codes:', error);
    } finally {
      setIsRegeneratingCodes(false);
    }
  };

  const handleRevokeAllSessions = async () => {
    setIsRevokingAll(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('All sessions revoked');
    } catch (error) {
      console.error('Failed to revoke sessions:', error);
    } finally {
      setIsRevokingAll(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    console.log('Revoking session:', sessionId);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Security Settings</h1>
        <p className="text-muted-foreground">
          Manage your account security, authentication, and sessions
        </p>
      </div>

      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${mockSecurityData.twoFactorEnabled ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                <HugeiconsIcon icon={mockSecurityData.twoFactorEnabled ? ShieldEnergyIcon : Shield01Icon} className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium">Two-Factor Auth</p>
                <p className="text-2xl font-bold">
                  {mockSecurityData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {mockSecurityData.twoFactorEnabled ? 'Authenticator app' : 'Add extra security'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <HugeiconsIcon icon={Key01Icon} className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium">Password Age</p>
                <p className="text-2xl font-bold">{mockSecurityData.passwordAge} days</p>
                <p className="text-xs text-muted-foreground">
                  Last changed {formatDate(mockSecurityData.lastPasswordChange)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                <HugeiconsIcon icon={UserShieldIcon} className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium">Active Sessions</p>
                <p className="text-2xl font-bold">{mockSecurityData.activeSessions.length}</p>
                <p className="text-xs text-muted-foreground">
                  {mockSecurityData.activeSessions.filter(s => s.current).length} current device
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="authentication">
            <HugeiconsIcon icon={LockPasswordIcon} className="h-4 w-4 mr-2" />
            Authentication
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <HugeiconsIcon icon={ComputerIcon} className="h-4 w-4 mr-2" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="security-log">
            <HugeiconsIcon icon={Shield01Icon} className="h-4 w-4 mr-2" />
            Security Log
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <HugeiconsIcon icon={UserShieldIcon} className="h-4 w-4 mr-2" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* Authentication Tab */}
        <TabsContent value="authentication" className="space-y-6">
          {/* Password Change Form */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">
                      Current Password
                      {errors.currentPassword && (
                        <span className="text-destructive text-xs ml-2">
                          {errors.currentPassword.message}
                        </span>
                      )}
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        {...register('currentPassword')}
                        className={errors.currentPassword ? 'border-destructive pr-10' : 'pr-10'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-3 text-muted-foreground"
                      >
                        <HugeiconsIcon icon={showCurrentPassword ? ViewOffSlashIcon : ViewIcon} className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">
                      New Password
                      {errors.newPassword && (
                        <span className="text-destructive text-xs ml-2">
                          {errors.newPassword.message}
                        </span>
                      )}
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        {...register('newPassword')}
                        className={errors.newPassword ? 'border-destructive pr-10' : 'pr-10'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3 text-muted-foreground"
                      >
                        <HugeiconsIcon icon={showNewPassword ? ViewOffSlashIcon : ViewIcon} className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className={`text-xs ${watch('newPassword')?.length >= 8 ? 'text-green-600' : 'text-muted-foreground'}`}>
                        • 8+ characters
                      </div>
                      <div className={`text-xs ${/[A-Z]/.test(watch('newPassword') || '') ? 'text-green-600' : 'text-muted-foreground'}`}>
                        • Uppercase letter
                      </div>
                      <div className={`text-xs ${/[a-z]/.test(watch('newPassword') || '') ? 'text-green-600' : 'text-muted-foreground'}`}>
                        • Lowercase letter
                      </div>
                      <div className={`text-xs ${/[0-9]/.test(watch('newPassword') || '') ? 'text-green-600' : 'text-muted-foreground'}`}>
                        • Number
                      </div>
                      <div className={`text-xs ${/[^A-Za-z0-9]/.test(watch('newPassword') || '') ? 'text-green-600' : 'text-muted-foreground'}`}>
                        • Special character
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                      {errors.confirmPassword && (
                        <span className="text-destructive text-xs ml-2">
                          {errors.confirmPassword.message}
                        </span>
                      )}
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        {...register('confirmPassword')}
                        className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-muted-foreground"
                      >
                        <HugeiconsIcon icon={showConfirmPassword ? ViewOffSlashIcon : ViewIcon} className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <HugeiconsIcon icon={BookBookmark01Icon} className="h-4 w-4 mr-2" />
                        Change Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="twoFactorEnabled" className="text-base">
                      Two-Factor Authentication
                    </Label>
                    {mockSecurityData.twoFactorEnabled && (
                      <Badge variant="default">
                        <HugeiconsIcon icon={CheckmarkBadge04Icon} className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Protect your account with an extra verification step
                  </p>
                </div>
                <Switch
                  id="twoFactorEnabled"
                  checked={mockSecurityData.twoFactorEnabled}
                  disabled
                />
              </div>

              {mockSecurityData.twoFactorEnabled && (
                <>
                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Current Method</p>
                        <p className="text-sm text-muted-foreground">
                          {mockSecurityData.twoFactorMethod === 'authenticator' && 'Authenticator App'}
                          {mockSecurityData.twoFactorMethod === 'sms' && 'SMS Verification'}
                          {mockSecurityData.twoFactorMethod === 'email' && 'Email Verification'}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Change Method
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Backup Codes</p>
                          <p className="text-sm text-muted-foreground">
                            {mockSecurityData.twoFactorBackupCodes.length} codes remaining
                          </p>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              {showBackupCodes ? 'Hide Codes' : 'View Codes'}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Backup Codes</DialogTitle>
                              <DialogDescription>
                                Save these codes in a secure place. Each code can only be used once.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-2 p-4 rounded-lg bg-muted">
                              {mockSecurityData.twoFactorBackupCodes.map((code, index) => (
                                <div key={index} className="p-2 bg-background rounded text-center font-mono">
                                  {code}
                                </div>
                              ))}
                            </div>
                            <DialogFooter className="flex-col sm:flex-row gap-2">
                              <Button variant="outline" onClick={() => navigator.clipboard.writeText(mockSecurityData.twoFactorBackupCodes.join('\n'))}>
                                Copy All
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={handleRegenerateBackupCodes}
                                disabled={isRegeneratingCodes}
                              >
                                {isRegeneratingCodes ? (
                                  <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                                    Regenerating...
                                  </>
                                ) : (
                                  <>
                                    <HugeiconsIcon icon={ArrowReloadHorizontalIcon} className="h-4 w-4 mr-2" />
                                    Regenerate Codes
                                  </>
                                )}
                              </Button>
                              <Button>
                                Download Codes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <Separator />

                    <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                      <div className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center flex-shrink-0">
                          !
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-yellow-800">Important Security Notice</p>
                          <p className="text-sm text-yellow-700">
                            If you lose access to your 2FA method and don&apos;t have backup codes, 
                            you may be locked out of your account. Keep your backup codes secure.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>
                    Devices that are currently logged into your account
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <HugeiconsIcon icon={Logout01Icon} className="h-4 w-4 mr-2" />
                      Revoke All
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Revoke All Sessions</DialogTitle>
                      <DialogDescription>
                        This will log you out of all devices except this one. Are you sure?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button 
                        variant="destructive"
                        onClick={handleRevokeAllSessions}
                        disabled={isRevokingAll}
                      >
                        {isRevokingAll ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                            Revoking...
                          </>
                        ) : (
                          'Revoke All Sessions'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSecurityData.activeSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {session.device.includes('iPhone') || session.device.includes('Mobile') ? (
                              <HugeiconsIcon icon={SmartPhoneIcon} className="h-4 w-4 text-muted-foreground" />
                            ) : session.device.includes('Mac') || session.device.includes('Windows') ? (
                              <HugeiconsIcon icon={ComputerIcon} className="h-4 w-4 text-muted-foreground" />
                            ) : session.device.includes('Tablet') ? (
                              <HugeiconsIcon icon={Tablet01Icon} className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <HugeiconsIcon icon={ComputerIcon} className="h-4 w-4 text-muted-foreground" />
                            )}
                            <div>
                              <p className="font-medium">{session.device}</p>
                              {session.current && (
                                <Badge variant="outline" className="text-xs">
                                  Current Session
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{session.location}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <HugeiconsIcon icon={ClockIcon} className="h-3 w-3" />
                            {getTimeAgo(session.lastActive)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{session.ip}</code>
                        </TableCell>
                        <TableCell className="text-right">
                          {!session.current && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRevokeSession(session.id)}
                            >
                              <HugeiconsIcon icon={LockPasswordIcon} className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 p-4 rounded-lg bg-muted/20">
                <div className="flex items-center gap-3">
                  <HugeiconsIcon icon={Shield01Icon} className="h-5 w-5 text-primary" />
                  <div className="space-y-1">
                    <p className="font-medium">Session Security</p>
                    <p className="text-sm text-muted-foreground">
                      Your sessions are encrypted and secure. Revoke any suspicious sessions immediately.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Log Tab */}
        <TabsContent value="security-log" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Activity Log</CardTitle>
              <CardDescription>
                Recent security-related events on your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSecurityData.recentSecurityEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.action}</TableCell>
                        <TableCell>{event.device}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{event.ip}</code>
                        </TableCell>
                        <TableCell>{formatDate(event.timestamp)}</TableCell>
                        <TableCell>
                          <Badge variant={event.status === 'success' ? 'default' : 'destructive'}>
                            {event.status === 'success' ? (
                              <HugeiconsIcon icon={CheckmarkBadge04Icon} className="h-3 w-3 mr-1" />
                            ) : (
                              <HugeiconsIcon icon={Cancel01Icon} className="h-3 w-3 mr-1" />
                            )}
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {mockSecurityData.recentSecurityEvents.length} most recent events
                </p>
                <Button variant="outline" size="sm">
                  View Full Log
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Failed Login Attempts */}
          {mockSecurityData.failedLoginAttempts > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Failed Login Attempts</CardTitle>
                <CardDescription>
                  Unsuccessful attempts to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-destructive/20 text-destructive flex items-center justify-center flex-shrink-0">
                      !
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-destructive">
                        {mockSecurityData.failedLoginAttempts} failed login attempt{mockSecurityData.failedLoginAttempts !== 1 ? 's' : ''} detected
                      </p>
                      <p className="text-sm">
                        The most recent attempt was from IP {mockSecurityData.recentSecurityEvents.find(e => e.action === 'Failed login attempt')?.ip || 'Unknown'}.
                        {mockSecurityData.lockedUntil && (
                          <> Your account is locked until {formatDate(mockSecurityData.lockedUntil)}.</>
                        )}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="destructive" size="sm">
                          Reset Password
                        </Button>
                        <Button variant="outline" size="sm">
                          Report Suspicious Activity
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Advanced Security Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Security Settings</CardTitle>
              <CardDescription>
                Fine-tune your security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireReauth">Require Re-authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Ask for password confirmation for sensitive actions
                    </p>
                  </div>
                  <Switch
                    id="requireReauth"
                    checked={mockSecurityData.requireReauthForSensitiveActions}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout</Label>
                  <Select defaultValue="24">
                    <SelectTrigger id="sessionTimeout">
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessionTimeoutOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out after period of inactivity
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="loginNotifications">Login Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone logs into your account
                    </p>
                  </div>
                  <Switch
                    id="loginNotifications"
                    checked={mockSecurityData.loginNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="suspiciousActivityAlerts">Suspicious Activity Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts for unusual account activity
                    </p>
                  </div>
                  <Switch
                    id="suspiciousActivityAlerts"
                    checked={mockSecurityData.suspiciousActivityAlerts}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Danger Zone</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive">
                          <HugeiconsIcon icon={Delete04Icon} className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Account</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. All your data will be permanently deleted.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                            <p className="text-sm font-medium text-destructive">
                              Warning: This will delete:
                            </p>
                            <ul className="text-sm text-destructive mt-2 space-y-1 list-disc list-inside">
                              <li>All your messages and campaigns</li>
                              <li>Contacts and templates</li>
                              <li>API keys and webhooks</li>
                              <li>Transaction history</li>
                              <li>Account settings</li>
                            </ul>
                          </div>
                          <Input placeholder="Type 'DELETE' to confirm" />
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button variant="destructive" disabled>
                            Delete Account
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

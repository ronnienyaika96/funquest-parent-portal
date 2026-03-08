import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Globe,
  Shield,
  Bell,
  Palette,
  Database,
  Save,
  RotateCcw,
  Lock,
  Users,
  Gamepad2,
  Mail,
} from 'lucide-react';

interface AppSettings {
  siteName: string;
  siteTagline: string;
  supportEmail: string;
  maintenanceMode: boolean;
  registrationOpen: boolean;
  defaultMaxChildren: number;
  defaultGamesPerDay: number;
  requireEmailVerification: boolean;
  enableGoogleAuth: boolean;
  sessionTimeoutMinutes: number;
  enablePushNotifications: boolean;
  enableEmailNotifications: boolean;
  adminEmailAlerts: boolean;
  newUserWelcomeEmail: boolean;
  defaultCurrency: string;
  defaultBillingPeriod: string;
  trialDays: number;
}

const defaultSettings: AppSettings = {
  siteName: 'FunQuest',
  siteTagline: 'Learning through play',
  supportEmail: 'support@funquest.app',
  maintenanceMode: false,
  registrationOpen: true,
  defaultMaxChildren: 2,
  defaultGamesPerDay: 5,
  requireEmailVerification: true,
  enableGoogleAuth: true,
  sessionTimeoutMinutes: 60,
  enablePushNotifications: true,
  enableEmailNotifications: true,
  adminEmailAlerts: true,
  newUserWelcomeEmail: true,
  defaultCurrency: 'USD',
  defaultBillingPeriod: 'monthly',
  trialDays: 7,
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // In future, persist to a Supabase settings table
    toast.success('Settings saved successfully');
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(false);
    toast.info('Settings reset to defaults');
  };

  return (
    <div className="space-y-6">
      {/* Header with Save/Reset */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Admin Settings</h2>
          <p className="text-sm text-muted-foreground">Configure application-wide settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} disabled={!hasChanges}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-1" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* General Settings */}
      <Card className="bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">General</CardTitle>
          </div>
          <CardDescription>Core application settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={e => updateSetting('siteName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteTagline">Tagline</Label>
              <Input
                id="siteTagline"
                value={settings.siteTagline}
                onChange={e => updateSetting('siteTagline', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input
              id="supportEmail"
              type="email"
              value={settings.supportEmail}
              onChange={e => updateSetting('supportEmail', e.target.value)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Maintenance Mode</Label>
              <p className="text-xs text-muted-foreground">Temporarily disable public access</p>
            </div>
            <div className="flex items-center gap-2">
              {settings.maintenanceMode && (
                <Badge variant="destructive" className="text-xs">Active</Badge>
              )}
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={v => updateSetting('maintenanceMode', v)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Open Registration</Label>
              <p className="text-xs text-muted-foreground">Allow new parent accounts</p>
            </div>
            <Switch
              checked={settings.registrationOpen}
              onCheckedChange={v => updateSetting('registrationOpen', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* User & Content Defaults */}
      <Card className="bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">User & Content Defaults</CardTitle>
          </div>
          <CardDescription>Default limits for new accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxChildren">Default Max Child Profiles</Label>
              <Input
                id="maxChildren"
                type="number"
                min={1}
                max={20}
                value={settings.defaultMaxChildren}
                onChange={e => updateSetting('defaultMaxChildren', parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gamesPerDay">Default Games Per Day</Label>
              <Input
                id="gamesPerDay"
                type="number"
                min={1}
                max={100}
                value={settings.defaultGamesPerDay}
                onChange={e => updateSetting('defaultGamesPerDay', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Security</CardTitle>
          </div>
          <CardDescription>Authentication and access control</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Require Email Verification</Label>
              <p className="text-xs text-muted-foreground">Users must verify email before access</p>
            </div>
            <Switch
              checked={settings.requireEmailVerification}
              onCheckedChange={v => updateSetting('requireEmailVerification', v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Google OAuth</Label>
              <p className="text-xs text-muted-foreground">Allow sign in with Google</p>
            </div>
            <Switch
              checked={settings.enableGoogleAuth}
              onCheckedChange={v => updateSetting('enableGoogleAuth', v)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              min={5}
              max={1440}
              value={settings.sessionTimeoutMinutes}
              onChange={e => updateSetting('sessionTimeoutMinutes', parseInt(e.target.value) || 60)}
              className="max-w-[200px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Notifications</CardTitle>
          </div>
          <CardDescription>Email and push notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Push Notifications</Label>
              <p className="text-xs text-muted-foreground">Enable browser push notifications</p>
            </div>
            <Switch
              checked={settings.enablePushNotifications}
              onCheckedChange={v => updateSetting('enablePushNotifications', v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-xs text-muted-foreground">Send transactional emails to users</p>
            </div>
            <Switch
              checked={settings.enableEmailNotifications}
              onCheckedChange={v => updateSetting('enableEmailNotifications', v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Admin Email Alerts</Label>
              <p className="text-xs text-muted-foreground">Receive alerts for signups, errors</p>
            </div>
            <Switch
              checked={settings.adminEmailAlerts}
              onCheckedChange={v => updateSetting('adminEmailAlerts', v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Welcome Email for New Users</Label>
              <p className="text-xs text-muted-foreground">Send welcome email on registration</p>
            </div>
            <Switch
              checked={settings.newUserWelcomeEmail}
              onCheckedChange={v => updateSetting('newUserWelcomeEmail', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Billing Defaults */}
      <Card className="bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Billing Defaults</CardTitle>
          </div>
          <CardDescription>Default billing and subscription settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Default Currency</Label>
              <Select
                value={settings.defaultCurrency}
                onValueChange={v => updateSetting('defaultCurrency', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default Billing Period</Label>
              <Select
                value={settings.defaultBillingPeriod}
                onValueChange={v => updateSetting('defaultBillingPeriod', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trialDays">Free Trial (days)</Label>
              <Input
                id="trialDays"
                type="number"
                min={0}
                max={90}
                value={settings.trialDays}
                onChange={e => updateSetting('trialDays', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

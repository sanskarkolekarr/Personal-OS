'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Settings, Database, Cloud, Bell, Monitor, RefreshCw,
  UserCircle, Save, CheckCircle, AlertCircle, BellRing, BellOff
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/hooks/use-settings';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Tab = 'profile' | 'general' | 'database' | 'notifications';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: UserCircle },
  { id: 'general', label: 'General', icon: Settings },
  { id: 'database', label: 'Database', icon: Database },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const TIMEZONES = [
  'Asia/Kolkata', 'America/New_York', 'America/Los_Angeles', 'America/Chicago',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai',
  'Australia/Sydney', 'Pacific/Auckland',
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const { settings, updateSetting } = useSettings();
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');

  // Local states for inputs
  const [pfpInput, setPfpInput] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [timezone, setTimezone] = useState('Asia/Kolkata');

  // Sync inputs with loaded settings
  useEffect(() => {
    if (settings.profile_picture) setPfpInput(settings.profile_picture);
    if (settings.display_name) setDisplayName(settings.display_name);
    if (settings.timezone) setTimezone(settings.timezone);
  }, [settings.profile_picture, settings.display_name, settings.timezone]);

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  // DB health check
  useEffect(() => {
    async function checkDb() {
      try {
        const { error } = await supabase.from('projects').select('id').limit(1);
        if (error) throw error;
        setDbStatus('connected');
      } catch {
        setDbStatus('error');
      }
    }
    checkDb();
  }, []);

  const handleRequestNotifications = async () => {
    if (!('Notification' in window)) {
      toast.error('Your browser does not support notifications.');
      return;
    }
    const permission = await Notification.requestPermission();
    setNotifPermission(permission);
    if (permission === 'granted') {
      toast.success('Notifications enabled!');
      await updateSetting('notifications_enabled', true);
      // Fire a test notification
      new Notification("Sanskar's OS", {
        body: "You'll now get reminders and alerts here! 🔔",
        icon: '/favicon.ico',
      });
    } else {
      toast.error('Notification permission was denied.');
      await updateSetting('notifications_enabled', false);
    }
  };

  const handleToggleNotification = async (key: string, value: boolean) => {
    // If notifications aren't granted, prompt first
    if (value && notifPermission !== 'granted') {
      await handleRequestNotifications();
      return;
    }
    await updateSetting(key, value);
    toast.success(`Setting updated`);
  };

  const saveProfilePicture = async () => {
    await updateSetting('profile_picture', pfpInput);
    toast.success('Profile picture updated!');
  };

  const saveGeneralSettings = async () => {
    await updateSetting('display_name', displayName);
    await updateSetting('timezone', timezone);
    toast.success('General settings saved!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your app preferences and configuration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-1">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                className={cn('w-full justify-start', activeTab !== tab.id && 'text-muted-foreground')}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-6">

          {/* ─── PROFILE ─────────────────────────────── */}
          {activeTab === 'profile' && (
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-primary" />
                  Profile Configuration
                </CardTitle>
                <CardDescription>Personalize your Sanskar's OS experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Preview */}
                {settings.profile_picture && (
                  <div className="flex items-center gap-4">
                    <img
                      src={settings.profile_picture}
                      alt="Profile"
                      className="h-16 w-16 rounded-full object-cover border-2 border-primary/30"
                      onError={(e: any) => { e.target.style.display = 'none'; }}
                    />
                    <div>
                      <p className="font-medium">{settings.display_name || 'Sanskar'}</p>
                      <p className="text-xs text-muted-foreground">Your profile picture is set</p>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Profile Picture URL</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://example.com/my-photo.jpg"
                      value={pfpInput}
                      onChange={(e) => setPfpInput(e.target.value)}
                    />
                    <Button onClick={saveProfilePicture}>
                      <Save className="h-4 w-4 mr-2" /> Save
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Paste a direct link to an image (e.g. from Imgur or GitHub).</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ─── GENERAL ─────────────────────────────── */}
          {activeTab === 'general' && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  General Settings
                </CardTitle>
                <CardDescription>Configure your personal preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input
                    placeholder="Your name (shown in the app)"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map(tz => (
                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Used for date/time display across the app.</p>
                </div>

                <div className="border-t border-border/50 pt-4">
                  <CardTitle className="text-base flex items-center gap-2 mb-4">
                    <Monitor className="h-4 w-4 text-indigo-400" />
                    Appearance
                  </CardTitle>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">Enable beautiful dark glassmorphism (always on)</p>
                      </div>
                      <Switch checked={true} disabled />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Micro-Animations</Label>
                        <p className="text-sm text-muted-foreground">Smooth transitions and hover effects</p>
                      </div>
                      <Switch
                        checked={settings.animations_enabled !== false}
                        onCheckedChange={(val) => {
                          updateSetting('animations_enabled', val);
                          toast.success(`Animations ${val ? 'enabled' : 'disabled'}!`);
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Compact View</Label>
                        <p className="text-sm text-muted-foreground">Reduce padding and spacing on cards</p>
                      </div>
                      <Switch
                        checked={settings.compact_view === true}
                        onCheckedChange={(val) => {
                          updateSetting('compact_view', val);
                          toast.success(`Compact view ${val ? 'enabled' : 'disabled'}!`);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={saveGeneralSettings} className="w-full">
                  <Save className="h-4 w-4 mr-2" /> Save General Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ─── DATABASE ────────────────────────────── */}
          {activeTab === 'database' && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-primary" />
                  Supabase Connection
                </CardTitle>
                <CardDescription>Your data is synced to Supabase PostgreSQL</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full transition-all ${
                      dbStatus === 'connected'
                        ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                        : dbStatus === 'error'
                        ? 'bg-destructive'
                        : 'bg-amber-500 animate-pulse'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">
                        {dbStatus === 'connected' ? 'Connected & Syncing' : dbStatus === 'error' ? 'Connection Error' : 'Checking...'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-xs">
                        {process.env.NEXT_PUBLIC_SUPABASE_URL || 'No URL configured'}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => { setDbStatus('checking'); window.location.reload(); }}>
                    <RefreshCw className="mr-2 h-3 w-3" /> Retry
                  </Button>
                </div>

                {dbStatus === 'connected' && (
                  <div className="flex items-center gap-2 text-emerald-500 text-sm p-3 bg-emerald-500/10 rounded-lg">
                    <CheckCircle className="h-4 w-4" />
                    <span>All tables healthy. Data is being saved to your Supabase project.</span>
                  </div>
                )}

                {dbStatus === 'error' && (
                  <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <span>Cannot reach Supabase. Check your .env.local file and network connection.</span>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <Label>Anon Key</Label>
                  <Input type="password" value={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''} readOnly className="bg-muted/50 font-mono text-xs" />
                  <p className="text-xs text-muted-foreground">This key is safe to use in the browser as RLS policies protect your data.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ─── NOTIFICATIONS ───────────────────────── */}
          {activeTab === 'notifications' && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications
                </CardTitle>
                <CardDescription>Control how and when you get alerted</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Browser Permission Banner */}
                <div className={cn(
                  "flex items-center justify-between p-4 rounded-lg border",
                  notifPermission === 'granted' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'
                )}>
                  <div className="flex items-center gap-3">
                    {notifPermission === 'granted'
                      ? <BellRing className="h-5 w-5 text-emerald-500" />
                      : <BellOff className="h-5 w-5 text-amber-500" />
                    }
                    <div>
                      <p className="text-sm font-semibold">
                        {notifPermission === 'granted' ? 'Browser notifications are enabled' : 'Browser notifications are not enabled'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notifPermission === 'granted'
                          ? 'You will receive alerts from this app.'
                          : notifPermission === 'denied'
                          ? 'Blocked in browser settings. Reset manually in your browser.'
                          : 'Click to allow push notifications from this app.'}
                      </p>
                    </div>
                  </div>
                  {notifPermission !== 'denied' && (
                    <Button
                      size="sm"
                      variant={notifPermission === 'granted' ? 'outline' : 'default'}
                      onClick={handleRequestNotifications}
                      disabled={notifPermission === 'granted'}
                    >
                      {notifPermission === 'granted' ? 'Enabled ✓' : 'Enable'}
                    </Button>
                  )}
                </div>

                {/* Notification Toggles */}
                <div className="space-y-4">
                  {[
                    {
                      key: 'notify_project_deadlines',
                      label: 'Project Deadline Reminders',
                      desc: 'Get notified 24h before a project deadline',
                    },
                    {
                      key: 'notify_goal_updates',
                      label: 'Goal Progress Updates',
                      desc: 'Weekly summary of your goal progress',
                    },
                    {
                      key: 'notify_daily_checkin',
                      label: 'Daily Check-in Reminder',
                      desc: 'Morning reminder to review your day',
                    },
                    {
                      key: 'notify_task_completion',
                      label: 'Task Completion Celebrations',
                      desc: 'Get a satisfying ping when you complete all tasks in a project',
                    },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                      <div>
                        <Label className="text-sm font-medium cursor-pointer">{item.label}</Label>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={settings[item.key] === true}
                        onCheckedChange={(val) => handleToggleNotification(item.key, val)}
                        disabled={notifPermission === 'denied'}
                      />
                    </div>
                  ))}
                </div>

                {notifPermission === 'denied' && (
                  <p className="text-xs text-destructive text-center">
                    Notifications are blocked at the browser level. Go to your browser settings → Site Settings → Notifications to allow them.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}

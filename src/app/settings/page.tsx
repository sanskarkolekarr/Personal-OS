'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Database, Cloud, Moon, Bell, Monitor, RefreshCw, UserCircle, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/hooks/use-settings';

export default function SettingsPage() {
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const { settings, updateSetting } = useSettings();
  const [pfpInput, setPfpInput] = useState('');

  // Sync local input with settings when loaded
  useEffect(() => {
    if (settings.profile_picture) {
      setPfpInput(settings.profile_picture);
    }
  }, [settings.profile_picture]);

  useEffect(() => {
    async function checkDb() {
      try {
        const { error } = await supabase.from('tasks').select('id').limit(1);
        if (error) throw error;
        setDbStatus('connected');
      } catch (err) {
        console.error('DB Check Error:', err);
        setDbStatus('error');
      }
    }
    checkDb();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your app preferences and database connection.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          <Button variant="secondary" className="w-full justify-start"><UserCircle className="mr-2 h-4 w-4" /> Profile</Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground"><Settings className="mr-2 h-4 w-4" /> General</Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground"><Database className="mr-2 h-4 w-4" /> Database</Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground"><Bell className="mr-2 h-4 w-4" /> Notifications</Button>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" />
                Profile Configuration
              </CardTitle>
              <CardDescription>Personalize your Sanskar's OS experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Profile Picture URL</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="https://example.com/my-photo.jpg" 
                    value={pfpInput} 
                    onChange={(e) => setPfpInput(e.target.value)}
                  />
                  <Button onClick={() => updateSetting('profile_picture', pfpInput)}>
                    <Save className="h-4 w-4 mr-2" /> Save
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Paste a direct link to an image (e.g. from Imgur or GitHub).</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-primary" />
                Supabase Connection
              </CardTitle>
              <CardDescription>Your data is synced to Supabase PostgreSQL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : dbStatus === 'error' ? 'bg-destructive' : 'bg-amber-500 animate-pulse'}`} />
                  <div>
                    <p className="text-sm font-medium">
                      {dbStatus === 'connected' ? 'Connected & Syncing' : dbStatus === 'error' ? 'Connection Error' : 'Checking Connection...'}
                    </p>
                    <p className="text-xs text-muted-foreground">Project URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not configured'}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                  <RefreshCw className="mr-2 h-3 w-3" /> Retry
                </Button>
              </div>

              <div className="space-y-2 pt-2">
                <Label>Anon Key</Label>
                <Input type="password" value={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''} readOnly className="bg-muted/50" />
                <p className="text-xs text-muted-foreground">This key is safe to use in the browser as RLS policies protect your data.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-indigo-500" />
                Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel of Sanskar's OS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable beautiful dark glassmorphism (default)</p>
                </div>
                <Switch checked={true} disabled />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Micro-Animations</Label>
                  <p className="text-sm text-muted-foreground">Smooth transitions and hover effects</p>
                </div>
                <Switch checked={true} disabled />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Search, Plus, Bell, Download, Settings } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { useSettings } from '@/hooks/use-settings';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';

export function Topbar() {
  const { toggleCommandPalette, openQuickAdd } = useAppStore();
  const { settings } = useSettings();
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      toast.success("Sanskar's OS installed!", { description: 'Find it on your home screen.' });
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  return (
    <header className="h-16 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        {/* Search / Command Palette Trigger */}
        <button
          onClick={toggleCommandPalette}
          className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 hover:bg-muted/80 transition-colors border border-border/50 rounded-full px-3 py-2 w-full max-w-[200px] sm:max-w-[280px] md:max-w-[400px]"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline truncate">Search everything...</span>
          <span className="inline sm:hidden truncate text-xs">Search...</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">Ctrl</span>K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-4">

        {/* PWA Install Button — shows only when install is available */}
        {installPrompt && !isInstalled && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleInstall}
            className="hidden sm:flex gap-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground animate-pulse-glow"
          >
            <Download className="h-4 w-4" />
            Install App
          </Button>
        )}

        {/* Quick Add Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Quick Add</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => openQuickAdd('project')}>
              New Project
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openQuickAdd('goal')}>
              New Goal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openQuickAdd('note')}>
              New Note
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openQuickAdd('content')}>
              New Content Idea
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between p-4 pb-2">
              <h4 className="font-semibold text-sm">Notifications</h4>
              <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">2 New</span>
            </div>
            <div className="h-px bg-border/50 my-1" />
            <div className="max-h-[300px] overflow-y-auto">
              <div className="p-3 hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/50 last:border-0">
                <p className="text-sm font-medium mb-1">System Update</p>
                <p className="text-xs text-muted-foreground">PWA offline mode has been successfully activated. You can now use LifeOS without an internet connection.</p>
                <p className="text-[10px] text-muted-foreground mt-2">Just now</p>
              </div>
              <div className="p-3 hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/50 last:border-0">
                <p className="text-sm font-medium mb-1">Welcome to LifeOS!</p>
                <p className="text-xs text-muted-foreground">Your personal operating system is ready. Try adding your first project or goal using the Quick Add menu.</p>
                <p className="text-[10px] text-muted-foreground mt-2">2 hours ago</p>
              </div>
            </div>
            <div className="h-px bg-border/50 my-1" />
            <div className="p-2">
              <Button variant="ghost" className="w-full text-xs text-primary h-8">Mark all as read</Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-border hover:ring-primary/50 transition-all">
              <AvatarImage src={settings?.profile_picture || "https://api.dicebear.com/7.x/notionists/svg?seed=Sanskar"} alt="User" className="object-cover" />
              <AvatarFallback>OS</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start gap-2 p-3">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{settings?.display_name || 'Sanskar'}</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
            <div className="h-px bg-border/50 my-1" />
            <Link href="/settings">
              <DropdownMenuItem className="cursor-pointer py-2">
                <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

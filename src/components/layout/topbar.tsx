'use client';

import { Search, Plus, Bell } from 'lucide-react';
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

export function Topbar() {
  const { toggleCommandPalette, openQuickAdd } = useAppStore();
  const { settings } = useSettings();

  return (
    <header className="h-16 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        {/* Search / Command Palette Trigger */}
        <button
          onClick={toggleCommandPalette}
          className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 hover:bg-muted/80 transition-colors border border-border/50 rounded-full px-4 py-2 w-full max-w-[280px] md:max-w-[400px]"
        >
          <Search className="h-4 w-4" />
          <span>Search everything...</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">Ctrl</span>K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Quick Add Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Quick Add</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => openQuickAdd('task')}>
              New Task
            </DropdownMenuItem>
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

        <Button variant="ghost" size="icon" className="rounded-full relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background"></span>
        </Button>

        <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-border hover:ring-primary/50 transition-all">
          <AvatarImage src={settings?.profile_picture || "https://api.dicebear.com/7.x/notionists/svg?seed=Sanskar"} alt="User" className="object-cover" />
          <AvatarFallback>OS</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

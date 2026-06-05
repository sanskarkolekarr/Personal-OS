'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/app-store';
import { useSearch } from '@/hooks/use-search';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { NAV_ITEMS, KEYBOARD_SHORTCUTS } from '@/lib/constants';
import { Loader2, Plus, Calendar as CalendarIcon, Hash, Target, FolderKanban, BookOpen, Pen, Trophy, Settings } from 'lucide-react';

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen, toggleCommandPalette, openQuickAdd } = useAppStore();
  const { results, loading, search } = useSearch();

  // Handle keyboard shortcut (Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCommandPalette();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggleCommandPalette]);

  const runCommand = (command: () => void) => {
    setCommandPaletteOpen(false);
    command();
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'project': return <FolderKanban className="mr-2 h-4 w-4" />;
      case 'goal': return <Target className="mr-2 h-4 w-4" />;
      case 'note': return <BookOpen className="mr-2 h-4 w-4" />;
      case 'content': return <Pen className="mr-2 h-4 w-4" />;
      case 'achievement': return <Trophy className="mr-2 h-4 w-4" />;
      default: return <Hash className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput 
        placeholder="Type a command or search..." 
        onValueChange={(val) => search(val)}
      />
      <CommandList>
        {loading ? (
          <div className="p-4 flex items-center justify-center text-muted-foreground text-sm">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </div>
        ) : (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        
        {results.length > 0 && (
          <CommandGroup heading="Search Results">
            {results.map((result) => (
              <CommandItem
                key={result.id}
                onSelect={() => runCommand(() => router.push(`${result.href}?id=${result.id}`))}
              >
                {getIconForType(result.type)}
                <div className="flex flex-col">
                  <span>{result.title}</span>
                  <span className="text-xs text-muted-foreground">{result.subtitle}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => openQuickAdd('note'))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Note</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => openQuickAdd('goal'))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Goal</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          {NAV_ITEMS.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => runCommand(() => router.push(item.href))}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

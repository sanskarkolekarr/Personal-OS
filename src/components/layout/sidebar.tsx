'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/stores/app-store';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <motion.aside
      initial={{ width: sidebarCollapsed ? 80 : 280 }}
      animate={{ width: sidebarCollapsed ? 80 : 280 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="hidden md:flex flex-col h-screen border-r border-border/40 bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/60 relative z-20"
    >
      <div className="flex items-center justify-between p-4 h-16 shrink-0">
        <AnimatePresence mode="popLayout">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2 font-bold text-lg tracking-tight"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-lg">
                OS
              </div>
              <span>Sanskar's OS</span>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8 rounded-full", sidebarCollapsed && "mx-auto")}
          onClick={toggleSidebar}
        >
          <motion.div animate={{ rotate: sidebarCollapsed ? 180 : 0 }}>
            <ChevronLeft className="h-4 w-4" />
          </motion.div>
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start h-10',
                    sidebarCollapsed ? 'px-0 justify-center' : 'px-3',
                    isActive && 'bg-secondary/50 font-medium'
                  )}
                  title={sidebarCollapsed ? item.title : undefined}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5',
                      sidebarCollapsed ? 'mr-0' : 'mr-3',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                  {!sidebarCollapsed && <span>{item.title}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-border/40 shrink-0">
        <div className="flex flex-col gap-1">
          <Link href="/settings">
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start h-10',
                sidebarCollapsed ? 'px-0 justify-center' : 'px-3'
              )}
              title={sidebarCollapsed ? 'Settings' : undefined}
            >
              <Settings className={cn("h-5 w-5", sidebarCollapsed ? "mr-0" : "mr-3", "text-muted-foreground")} />
              {!sidebarCollapsed && <span>Settings</span>}
            </Button>
          </Link>
        </div>
      </div>
    </motion.aside>
  );
}

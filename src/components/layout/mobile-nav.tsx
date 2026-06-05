'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Menu, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAppStore } from '@/stores/app-store';
import { ScrollArea } from '@/components/ui/scroll-area';

export function MobileNav() {
  const pathname = usePathname();
  const { mobileNavOpen, setMobileNavOpen, openQuickAdd } = useAppStore();

  const mainItems = NAV_ITEMS.slice(0, 4); // Show top 4 items in bottom bar

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 flex items-center justify-around px-2 pb-0">
        {mainItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground hover:text-foreground">
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span className={cn("text-[10px] font-medium", isActive && "text-primary")}>{item.title}</span>
            </Link>
          );
        })}

        {/* FAB (Floating Action Button) for Quick Add */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg shadow-primary/25 border-4 border-background"
            onClick={() => openQuickAdd('note')}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* More Menu (Sidebar in a Sheet) */}
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger className="flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground hover:text-foreground">
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium">More</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80vw] sm:w-[350px] p-0 flex flex-col bg-sidebar/95 backdrop-blur border-l-border/40">
            <SheetHeader className="p-4 text-left border-b border-border/40 shrink-0">
              <SheetTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center text-white text-sm">
                  OS
                </div>
                Sanskar's OS
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1 px-3 py-4">
              <nav className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileNavOpen(false)}>
                      <Button
                        variant={isActive ? 'secondary' : 'ghost'}
                        className={cn(
                          'w-full justify-start h-12 text-base',
                          isActive && 'bg-secondary/50 font-medium'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'h-5 w-5 mr-3',
                            isActive ? 'text-primary' : 'text-muted-foreground'
                          )}
                        />
                        {item.title}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

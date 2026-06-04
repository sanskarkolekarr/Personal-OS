import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { CommandPalette } from '@/components/layout/command-palette';
import { GlobalDialogs } from '@/components/global-dialogs';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: "Sanskar's OS",
  description: 'Personal Operating System for Student Founders',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="font-sans min-h-screen bg-background text-foreground antialiased flex flex-col"
      >
        <Providers>
          <div className="flex h-screen overflow-hidden">
            {/* Desktop Sidebar */}
            <Sidebar />

            <div className="flex-1 flex flex-col relative w-full">
              {/* Top Navigation */}
              <Topbar />

              {/* Main Content Area */}
              <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6 relative z-0">
                {children}
              </main>

              {/* Mobile Bottom Nav & Sidebar Sheet */}
              <MobileNav />
            </div>
          </div>
          <CommandPalette />
          <GlobalDialogs />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

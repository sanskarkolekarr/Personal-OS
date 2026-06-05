import type { Metadata, Viewport } from 'next';
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
  description: 'Personal Operating System for Student Founders — track projects, goals, knowledge, and content.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: "Sanskar's OS",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    title: "Sanskar's OS",
    description: 'Personal Operating System for Student Founders',
  },
};

export const viewport: Viewport = {
  themeColor: '#22c55e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* PWA icons */}
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icon-144.png" />
        <link rel="apple-touch-icon" sizes="128x128" href="/icon-128.png" />
        {/* Apple splash screen meta */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* SW Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) { console.log('SW registered:', reg.scope); })
                    .catch(function(err) { console.warn('SW registration failed:', err); });
                });
              }
            `,
          }}
        />
      </head>
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

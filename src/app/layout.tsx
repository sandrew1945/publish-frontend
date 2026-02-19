import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' });

export const metadata: Metadata = {
  title: 'Vibe Publish',
  description: 'Vibe Publish Frontend Scaffold',
};

import { ReactQueryProvider } from '@/lib/react-query-provider';
import { AuthProvider } from '@/lib/auth-context';

// ...

import { GlobalLoadingProvider } from '@/providers/global-loading-provider';
import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          outfit.variable
        )}
      >
        <ReactQueryProvider>
          <AuthProvider>
            <NextTopLoader
              color="#2299DD"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px #2299DD,0 0 5px #2299DD"
            />
            <GlobalLoadingProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                <Toaster position="top-center" richColors />
              </ThemeProvider>
            </GlobalLoadingProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import NProgress from 'nprogress';

interface GlobalLoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Reset loading on route change
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  const startLoading = useCallback(() => {
    NProgress.start();
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    NProgress.done();
    setIsLoading(false);
  }, []);

  return (
    <GlobalLoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
      {isLoading && <GlobalLoadingOverlay />}
    </GlobalLoadingContext.Provider>
  );
}

function GlobalLoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200">
      <div className="flex flex-col items-center gap-4 p-6 bg-neutral-900 border border-white/10 rounded-lg shadow-2xl">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-neutral-300">Processing...</p>
      </div>
    </div>
  );
}

export function useGlobalLoading() {
  const context = useContext(GlobalLoadingContext);
  if (context === undefined) {
    throw new Error('useGlobalLoading must be used within a GlobalLoadingProvider');
  }
  return context;
}

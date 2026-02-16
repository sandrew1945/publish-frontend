'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  width: number;
  setWidth: (width: number) => void;
  isResizing: boolean;
  setIsResizing: (isResizing: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SIDEBAR_WIDTH_EXPANDED = 256;
export const SIDEBAR_WIDTH_COLLAPSED = 64;
export const SIDEBAR_MIN_WIDTH = 200;
export const SIDEBAR_MAX_WIDTH = 450;

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  // Initialize with defaults, will be updated from localStorage in useEffect
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidthState] = useState(SIDEBAR_WIDTH_EXPANDED);
  const [isResizing, setIsResizing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebar-collapsed');
    const savedWidth = localStorage.getItem('sidebar-width');

    if (savedCollapsed !== null) {
      setIsCollapsed(savedCollapsed === 'true');
    }

    if (savedWidth !== null) {
      const parsedWidth = parseInt(savedWidth, 10);
      if (
        !isNaN(parsedWidth) &&
        parsedWidth >= SIDEBAR_MIN_WIDTH &&
        parsedWidth <= SIDEBAR_MAX_WIDTH
      ) {
        setWidthState(parsedWidth);
      }
    }
    setIsInitialized(true);
  }, []);

  // Persist state changes
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };

  const setWidth = (newWidth: number) => {
    // Clamp width
    const clampedWidth = Math.max(SIDEBAR_MIN_WIDTH, Math.min(newWidth, SIDEBAR_MAX_WIDTH));
    setWidthState(clampedWidth);
    localStorage.setItem('sidebar-width', String(clampedWidth));
  };

  // Avoid flash of wrong state by rendering nothing until initialized?
  // Or just accept the default for a split second.
  // Better to render with defaults to avoid layout shift, but we might have a small jump if user customized.
  // Given this is client-side only, we can just return children.
  // For a more robust solution, we might usually use cookies, but requirements said localStorage.

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        toggleCollapse,
        width,
        setWidth,
        isResizing,
        setIsResizing,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

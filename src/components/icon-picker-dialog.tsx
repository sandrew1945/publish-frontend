'use client';

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Search, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface IconPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (iconName: string) => void;
}

export function IconPickerDialog({ open, onOpenChange, onSelect }: IconPickerDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Memoize the list of icons to avoid re-calculating on every render
  const iconList = useMemo(() => {
    const icons = Object.keys(LucideIcons)
      .filter((key) => key !== 'createLucideIcon' && key !== 'icons' && isNaN(Number(key))) // Filter out non-icon exports
      .map((key) => ({
        name: key,
        // eslint-disable-next-line
                Icon: (LucideIcons as any)[key] as React.ElementType,
      }));
    return icons;
  }, []);

  const filteredIcons = useMemo(() => {
    if (!searchQuery) return iconList.slice(0, 100); // Show first 100 by default
    const query = searchQuery.toLowerCase();
    return iconList.filter((icon) => icon.name.toLowerCase().includes(query)).slice(0, 100); // Limit to 100 results for performance
  }, [iconList, searchQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Select Icon</DialogTitle>
        </DialogHeader>

        <div className="p-4 border-b bg-muted/30">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search icons..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {filteredIcons.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Search className="h-8 w-8 mb-2 opacity-50" />
              <p>No icons found</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
              {filteredIcons.map(({ name, Icon }) => (
                <button
                  key={name}
                  className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-all group"
                  onClick={() => {
                    onSelect(name);
                    onOpenChange(false);
                  }}
                  title={name}
                >
                  <Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-[10px] text-muted-foreground truncate w-full text-center group-hover:text-foreground">
                    {name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-2 border-t text-xs text-center text-muted-foreground bg-muted/10">
          Showing {filteredIcons.length} icons
        </div>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MenuItem } from '@/config/menu';
import { ChevronRight } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState, useEffect } from 'react';

interface SidebarItemProps {
    item: MenuItem;
    isCollapsed: boolean;
    userRole?: string;
    depth?: number;
}

export function SidebarItem({ item, isCollapsed, userRole, depth = 0 }: SidebarItemProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Check role access
    if (item.roles && userRole && !item.roles.includes(userRole)) {
        return null;
    }

    const hasChildren = item.items && item.items.length > 0;
    const isActive = pathname === item.href;
    const isChildActive = hasChildren && item.items?.some((child) => pathname === child.href);

    // Auto-expand if child is active
    useEffect(() => {
        if (isChildActive) {
            setIsOpen(true);
        }
    }, [isChildActive]);

    // Handle click to toggle
    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    }

    if (hasChildren) {
        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
                <CollapsibleTrigger asChild>
                    <div
                        onClick={!isCollapsed ? handleToggle : undefined}
                        className={cn(
                            'flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer select-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                            isCollapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5',
                            isActive || (isChildActive && !isOpen)
                                ? 'text-white'
                                : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
                        )}
                        title={isCollapsed ? item.title : undefined}
                    >
                        <item.icon className="h-[18px] w-[18px] shrink-0" />
                        {!isCollapsed && (
                            <>
                                <span className="flex-1 overflow-hidden whitespace-nowrap">{item.title}</span>
                                <ChevronRight
                                    className={cn(
                                        'h-4 w-4 shrink-0 transition-transform duration-200',
                                        isOpen && 'rotate-90'
                                    )}
                                />
                            </>
                        )}
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    {!isCollapsed && (
                        <div className="mt-1 space-y-1 pl-4 border-l border-white/10 ml-3">
                            {item.items?.map((child) => (
                                <SidebarItem
                                    key={child.href}
                                    item={child}
                                    isCollapsed={isCollapsed}
                                    userRole={userRole}
                                    depth={depth + 1}
                                />
                            ))}
                        </div>
                    )}
                </CollapsibleContent>
            </Collapsible>
        );
    }

    return (
        <Link
            href={item.href}
            title={isCollapsed ? item.title : undefined}
            className={cn(
                'flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200',
                isCollapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5',
                isActive
                    ? 'gradient-active text-white shadow-lg shadow-blue-500/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
            )}
        >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            {!isCollapsed && <span className="overflow-hidden whitespace-nowrap">{item.title}</span>}
        </Link>
    );
}

'use client';

import { TreeNode } from '@/types/backend-types';
import { Button } from '@/components/button';
import { ChevronRight, ChevronDown, Edit, Trash2, Plus, Folder, File } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

interface MenuTreeProps {
  data: TreeNode[];
  onAdd: (parent: TreeNode) => void;
  onEdit: (item: TreeNode) => void;
  onDelete: (item: TreeNode) => void;
  level?: number;
}

export function MenuTree({ data, onAdd, onEdit, onDelete, level = 0 }: MenuTreeProps) {
  if (!data || data.length === 0) {
    if (level === 0) {
      return (
        <div className="text-muted-foreground p-4 text-center">
          No menu items found. Create one to get started.
        </div>
      );
    }
    return null;
  }

  return (
    <div className="space-y-1">
      {data.map((item) => (
        <MenuTreeItem
          key={item.functionId}
          item={item}
          level={level}
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

interface MenuTreeItemProps {
  item: TreeNode;
  level: number;
  onAdd: (parent: TreeNode) => void;
  onEdit: (item: TreeNode) => void;
  onDelete: (item: TreeNode) => void;
}

function MenuTreeItem({ item, level, onAdd, onEdit, onDelete }: MenuTreeItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  // Dynamically resolve icon
  const IconComponent =
    item.icon && (LucideIcons as any)[item.icon]
      ? (LucideIcons as any)[item.icon]
      : hasChildren
        ? Folder
        : File;

  const handleToggle = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="select-none">
      <div
        className={cn(
          'flex items-center justify-between p-2 rounded-md hover:bg-accent group transition-colors',
          level > 0 && 'ml-4 pl-2 border-l border-border'
        )}
      >
        <div className="flex items-center gap-2 flex-1 cursor-pointer" onClick={handleToggle}>
          <div className="w-4 h-4 flex items-center justify-center text-muted-foreground">
            {hasChildren && (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
          </div>
          <IconComponent size={16} className="text-primary" />
          <span className="font-medium">{item.name}</span>
          <span className="text-xs text-muted-foreground ml-2 font-mono bg-muted px-1 rounded">
            {item.path}
          </span>
          <span className="text-xs text-muted-foreground ml-2">Order: {item.funcOrder}</span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onAdd(item)}
            title="Add Submenu"
          >
            <Plus size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onEdit(item)}
            title="Edit Menu"
          >
            <Edit size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive hover:text-destructive"
            onClick={() => onDelete(item)}
            title="Delete Menu"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      {hasChildren && isOpen && (
        <div className="ml-2 border-l border-border pl-2 mt-1">
          <MenuTree
            data={item.children!}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
            level={level + 1}
          />
        </div>
      )}
    </div>
  );
}

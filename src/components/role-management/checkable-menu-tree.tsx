'use client';

import { TreeNode } from '@/types/backend-types';
import { ChevronRight, ChevronDown, Folder, File } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

interface CheckableMenuTreeProps {
  data: TreeNode[];
  checkedKeys: number[];
  onCheck: (keys: number[]) => void;
  level?: number;
}

// Helper to find all descendant IDs
const getDescendantIds = (node: TreeNode): number[] => {
  let ids: number[] = [node.functionId!];
  if (node.children) {
    node.children.forEach((child) => {
      ids = [...ids, ...getDescendantIds(child)];
    });
  }
  return ids;
};

export function CheckableMenuTree({
  data,
  checkedKeys,
  onCheck,
  level = 0,
}: CheckableMenuTreeProps) {
  if (!data || data.length === 0) {
    if (level === 0) {
      return <div className="text-muted-foreground p-4 text-center">No menu items found.</div>;
    }
    return null;
  }

  const handleItemCheck = (item: TreeNode, checked: boolean) => {
    const descendantIds = getDescendantIds(item);
    let newCheckedKeys = [...checkedKeys];

    if (checked) {
      // Add all descendants that aren't already checked
      descendantIds.forEach((id) => {
        if (!newCheckedKeys.includes(id)) {
          newCheckedKeys.push(id);
        }
      });
    } else {
      // Remove all descendants
      newCheckedKeys = newCheckedKeys.filter((id) => !descendantIds.includes(id));

      // We don't remove ancestors here, consistent with "Child checked -> Parent checked" logic.
    }

    onCheck(newCheckedKeys);
  };

  return (
    <div className="space-y-1">
      {data.map((item) => (
        <CheckableMenuTreeItem
          key={item.functionId}
          item={item}
          level={level}
          checkedKeys={checkedKeys}
          onCheck={onCheck}
          onItemCheck={handleItemCheck}
        />
      ))}
    </div>
  );
}

interface CheckableMenuTreeItemProps {
  item: TreeNode;
  level: number;
  checkedKeys: number[];
  onCheck: (keys: number[]) => void;
  onItemCheck: (item: TreeNode, checked: boolean) => void;
}

function CheckableMenuTreeItem({
  item,
  level,
  checkedKeys,
  onCheck,
  onItemCheck,
}: CheckableMenuTreeItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isChecked = checkedKeys.includes(item.functionId!);

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onItemCheck(item, e.target.checked);
  };

  // Intercept child updates to enforce parent selection
  const handleChildCheck = (newKeys: number[]) => {
    // If any descendant is checked, ensure this item is checked
    const descendantIds = getDescendantIds(item);
    // Remove self from descendant check to look strictly at children
    const strictDescendants = descendantIds.filter((id) => id !== item.functionId);

    const hasCheckedDescendant = strictDescendants.some((id) => newKeys.includes(id));

    if (hasCheckedDescendant && !newKeys.includes(item.functionId!)) {
      onCheck([...newKeys, item.functionId!]);
    } else {
      onCheck(newKeys);
    }
  };

  return (
    <div className="select-none">
      <div
        className={cn(
          'flex items-center p-2 rounded-md hover:bg-neutral-800/50 transition-colors group',
          level > 0 && 'ml-6'
        )}
      >
        <button
          onClick={handleToggle}
          className={cn(
            'p-1 mr-1 rounded-sm text-neutral-400 hover:text-white transition-colors',
            !hasChildren && 'invisible'
          )}
        >
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        <label className="flex items-center gap-3 cursor-pointer flex-1">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-primary focus:ring-primary focus:ring-offset-neutral-900"
          />

          <IconComponent size={16} className="text-neutral-400" />

          <span className={cn('text-sm font-medium text-neutral-300', isChecked && 'text-white')}>
            {item.name}
          </span>

          {item.path && (
            <span className="text-xs text-neutral-500 font-mono hidden group-hover:inline-block ml-2">
              {item.path}
            </span>
          )}
        </label>
      </div>

      {hasChildren && isOpen && (
        <div className="mt-1">
          <CheckableMenuTree
            data={item.children!}
            checkedKeys={checkedKeys}
            onCheck={handleChildCheck}
            level={level + 1}
          />
        </div>
      )}
    </div>
  );
}

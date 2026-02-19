import { TreeNode } from '@/types/backend-types';
import { MenuItem } from '@/config/menu';
import * as LucideIcons from 'lucide-react';
import { File, Folder, HelpCircle } from 'lucide-react';

// Helper to resolve icon dynamically
function getIconComponent(iconName: string | undefined): any {
  if (!iconName) return null;

  // 1. Try exact match
  if ((LucideIcons as any)[iconName]) {
    return (LucideIcons as any)[iconName];
  }

  // 2. Try converting kebab-case or snake_case (e.g. "layout-dashboard", "user_management") to PascalCase ("LayoutDashboard")
  const pascalCase = iconName
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');

  if ((LucideIcons as any)[pascalCase]) {
    return (LucideIcons as any)[pascalCase];
  }

  // 3. Try case-insensitive search explicitly for likely matches
  // This iteration is a bit safer than doing it for every single icon if we assume standard casing
  // But let's do a find for robustness
  const lowerName = iconName.toLowerCase().replace(/[-_]/g, '');
  const foundKey = Object.keys(LucideIcons).find((key) => key.toLowerCase() === lowerName);

  if (foundKey) {
    return (LucideIcons as any)[foundKey];
  }

  return null;
}

export function mapTreeNodeToMenuItem(node: TreeNode): MenuItem {
  const hasChildren = node.children && node.children.length > 0;

  // Resolve icon
  // Default to Folder/File if no icon specified
  let IconComponent: any = hasChildren ? Folder : File;

  const iconName = node.meta?.icon || node.icon;
  if (iconName) {
    const resolved = getIconComponent(iconName);
    if (resolved) {
      IconComponent = resolved;
    } else {
      // Only log if we have an icon name but couldn't resolve it, to help debugging
      console.warn(`[MenuUtils] Could not resolve icon: "${iconName}"`);
    }
  }

  return {
    id: node.functionId?.toString(),
    title: node.name || 'Untitled',
    href: node.path || '#',
    icon: IconComponent,
    items: node.children?.map(mapTreeNodeToMenuItem),
    // We don't map roles here as backend filters it or we don't have role info in TreeNode
  };
}

export function buildMenuTree(nodes: TreeNode[]): MenuItem[] {
  return nodes.map(mapTreeNodeToMenuItem);
}

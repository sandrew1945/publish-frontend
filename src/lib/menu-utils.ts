import { TreeNode } from '@/types/backend-types';
import { MenuItem } from '@/config/menu';
import * as LucideIcons from 'lucide-react';
import { File, Folder } from 'lucide-react';

export function mapTreeNodeToMenuItem(node: TreeNode): MenuItem {
  const hasChildren = node.children && node.children.length > 0;

  // Resolve icon
  let IconComponent: any = hasChildren ? Folder : File;
  if (node.icon && (LucideIcons as any)[node.icon]) {
    IconComponent = (LucideIcons as any)[node.icon];
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

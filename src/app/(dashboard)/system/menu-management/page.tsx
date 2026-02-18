'use client';

import { useState } from 'react';
import { useMenuTree } from '@/hooks/use-menu';
import { Button } from '@/components/button';
import { Plus, RefreshCw } from 'lucide-react';
import { MenuTree } from '@/components/menu/menu-tree';
import { MenuFormDialog } from '@/components/menu/menu-form-dialog';
import { MenuDeleteDialog } from '@/components/menu/menu-delete-dialog';
import { TreeNode } from '@/types/backend-types';

export default function MenuManagementPage() {
  const { data: menuTree, isLoading, error, refetch } = useMenuTree();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedParent, setSelectedParent] = useState<TreeNode | null>(null);
  const [selectedItem, setSelectedItem] = useState<TreeNode | null>(null);

  const handleAdd = (parent: TreeNode | null) => {
    setSelectedParent(parent);
    setSelectedItem(null);
    setIsCreateOpen(true);
  };

  const handleEdit = (item: TreeNode) => {
    setSelectedItem(item);
    setSelectedParent(null);
    setIsEditOpen(true);
  };

  const handleDelete = (item: TreeNode) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  if (isLoading)
    return <div className="p-8 text-center text-muted-foreground">Loading menu structure...</div>;
  if (error)
    return (
      <div className="p-8 text-center text-destructive">
        Error loading menu.
        <Button variant="outline" size="sm" onClick={() => refetch()} className="ml-2">
          Retry
        </Button>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground mt-2">
            Configure system menu structure, paths, and icons.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => refetch()} title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => handleAdd(null)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Root Menu
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <MenuTree
            data={menuTree || []}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <MenuFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        parent={selectedParent}
        editItem={null}
      />

      <MenuFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        parent={null}
        editItem={selectedItem}
      />

      <MenuDeleteDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} item={selectedItem} />
    </div>
  );
}

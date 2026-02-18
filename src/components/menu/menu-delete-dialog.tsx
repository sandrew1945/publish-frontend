'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/button';
import { TreeNode } from '@/types/backend-types';
import { useDeleteMenu } from '@/hooks/use-menu';

interface MenuDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: TreeNode | null;
}

export function MenuDeleteDialog({ open, onOpenChange, item }: MenuDeleteDialogProps) {
  const deleteMutation = useDeleteMenu();

  const handleDelete = () => {
    if (item && item.functionId) {
      deleteMutation.mutate(item.functionId, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Menu</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{item?.name}&quot;? This action cannot be undone.
            {item?.children && item.children.length > 0 && (
              <div className="text-destructive mt-2 font-semibold">
                Warning: This menu has sub-items which may also be deleted or become orphaned.
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

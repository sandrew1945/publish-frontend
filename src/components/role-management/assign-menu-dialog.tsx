import { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/button';
import { menuService } from '@/services/menu-service';
import { roleManagementService } from '@/services/role-management-service';
import { TreeNode } from '@/types/backend-types';
import { CheckableMenuTree } from './checkable-menu-tree';
import { toast } from 'sonner';

interface AssignMenuDialogProps {
  open: boolean;
  roleId?: number;
  roleName?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AssignMenuDialog({
  open,
  roleId,
  roleName,
  onClose,
  onSuccess,
}: AssignMenuDialogProps) {
  const [menuTree, setMenuTree] = useState<TreeNode[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch data when dialog opens
  useEffect(() => {
    if (open && roleId) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const [treeData, checkedData] = await Promise.all([
            menuService.getMenuTree(),
            roleManagementService.getCheckedPremission(roleId),
          ]);
          setMenuTree(treeData);
          setCheckedKeys(checkedData);
        } catch (error) {
          console.error('Failed to fetch menu data:', error);
          toast.error('Failed to load menu data');
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      // Reset state when closed
      setMenuTree([]);
      setCheckedKeys([]);
    }
  }, [open, roleId]);

  // Prevent scrolling when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  const handleSave = async () => {
    if (!roleId) return;

    try {
      setIsSaving(true);
      await roleManagementService.saveSelectedFunc(roleId, checkedKeys);
      toast.success('Menu assignments updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save menu assignments:', error);
      toast.error('Failed to save menu assignments');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-lg shadow-xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div>
            <h2 className="text-lg font-semibold text-white">Assign Menus</h2>
            {roleName && (
              <p className="text-sm text-neutral-400">
                Role: <span className="text-white">{roleName}</span>
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isSaving}>
            <X className="w-5 h-5 text-neutral-400" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="border border-white/10 rounded-md p-4 bg-neutral-950/50">
              <CheckableMenuTree
                data={menuTree}
                checkedKeys={checkedKeys}
                onCheck={setCheckedKeys}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-white/10 gap-3 bg-white/5">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px]"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

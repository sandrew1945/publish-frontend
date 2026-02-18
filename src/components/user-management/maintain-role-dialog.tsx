import { useState } from 'react';
import { X, Loader2, Shield, Plus, Trash2 } from 'lucide-react';
import { User } from '@/services/user-management-service';
import { Button } from '@/components/button';
import {
  useUserRoles,
  useUnassignedRoles,
  useAssignRole,
  useRemoveRole,
} from '@/hooks/use-user-management';

interface MaintainRoleDialogProps {
  open: boolean;
  user: User | undefined;
  onClose: () => void;
}

export function MaintainRoleDialog({ open, user, onClose }: MaintainRoleDialogProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<number | ''>('');

  // Queries
  const { data: userRoles, isLoading: isLoadingRoles } = useUserRoles(
    open && user ? user.userId : undefined
  );
  const { data: unassignedRoles, isLoading: isLoadingUnassigned } = useUnassignedRoles(
    open && user ? user.userId : undefined
  );

  // Mutations
  const assignRole = useAssignRole();
  const removeRole = useRemoveRole();

  if (!open || !user) return null;

  const handleAddRole = async () => {
    if (!selectedRoleId || !user.userId) return;
    try {
      await assignRole.mutateAsync({
        userId: user.userId,
        roleIds: [Number(selectedRoleId)],
      });
      setSelectedRoleId(''); // Reset selection
    } catch (error) {
      console.error('Failed to assign role:', error);
    }
  };

  const handleRemoveRole = async (roleId: number) => {
    if (!user.userId) return;
    try {
      await removeRole.mutateAsync({
        userId: user.userId,
        roleId,
      });
    } catch (error) {
      console.error('Failed to remove role:', error);
    }
  };

  const isActionLoading = assignRole.isPending || removeRole.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-lg shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-full">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Maintain Roles</h2>
              <p className="text-sm text-neutral-400">
                Manage roles for <span className="text-white font-medium">{user.userName}</span>
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-neutral-400" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Add Role Section */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              Add New Role
            </h3>
            <div className="flex gap-3">
              <select
                className="flex-1 h-10 rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(Number(e.target.value))}
                disabled={isLoadingUnassigned || isActionLoading}
              >
                <option value="">Select a role to add...</option>
                {unassignedRoles?.map((role) => (
                  <option key={role.roleId} value={role.roleId}>
                    {role.roleName}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleAddRole}
                disabled={!selectedRoleId || isActionLoading}
                className="shrink-0"
              >
                {assignRole.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Role'}
              </Button>
            </div>
          </div>

          {/* Current Roles List */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
              Assigned Roles ({userRoles?.length || 0})
            </h3>

            {isLoadingRoles ? (
              <div className="flex items-center justify-center py-8 text-neutral-500">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Loading roles...
              </div>
            ) : userRoles && userRoles.length > 0 ? (
              <div className="space-y-2">
                {userRoles.map((role) => (
                  <div
                    key={role.roleId}
                    className="flex items-center justify-between p-3 rounded-md bg-white/5 border border-white/5 group hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm font-medium text-white">{role.roleName}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                      onClick={() => handleRemoveRole(role.roleId)}
                      disabled={isActionLoading}
                      title="Remove Role"
                    >
                      {removeRole.isPending && removeRole.variables?.roleId === role.roleId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500 bg-white/5 rounded-lg border border-dashed border-white/10">
                No roles assigned to this user.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-white/10 bg-white/5">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

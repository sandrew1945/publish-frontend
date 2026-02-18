import { Edit2, Trash2 } from 'lucide-react';
import { Role } from '@/services/role-management-service';
import { RoleStatusBadge } from './role-status-badge';
import { Button } from '@/components/button';

interface RoleTableProps {
  roles: Role[];
  isLoading?: boolean;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export function RoleTable({ roles, isLoading, onEdit, onDelete }: RoleTableProps) {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-neutral-400">
        Loading roles...
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="w-full h-32 flex items-center justify-center text-neutral-500 border border-dashed border-white/10 rounded-lg">
        No roles found.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 overflow-hidden bg-white/5 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-neutral-400 uppercase font-medium border-b border-white/10">
            <tr>
              <th className="px-4 py-3 w-[150px]">Role Code</th>
              <th className="px-4 py-3">Role Name</th>
              <th className="px-4 py-3 hidden md:table-cell">Create Time</th>

              <th className="px-4 py-3 w-[120px]">Status</th>
              <th className="px-4 py-3 w-[100px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {roles.map((role) => (
              <tr key={role.roleId} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-medium text-white">{role.roleCode}</td>
                <td className="px-4 py-3 text-neutral-300">{role.roleName}</td>
                <td className="px-4 py-3 text-neutral-400 hidden md:table-cell">
                  {role.createDate ? new Date(role.createDate).toLocaleString() : '-'}
                </td>

                <td className="px-4 py-3">
                  <RoleStatusBadge status={role.roleStatus} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-white/10"
                      onClick={() => onEdit(role)}
                      title="Edit Role"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-neutral-400 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => onDelete(role)}
                      title="Delete Role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

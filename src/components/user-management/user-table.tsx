import { Edit2, Trash2, Shield } from 'lucide-react';
import { User } from '@/services/user-management-service';
import { SystemCodeTypes, getCodeDesc } from '@/config/fixcode';
import { UserStatusBadge } from './user-status-badge';
import { Button } from '@/components/button';

interface UserTableProps {
  users: User[];
  isLoading?: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onMaintainRole: (user: User) => void;
}

export function UserTable({ users, isLoading, onEdit, onDelete, onMaintainRole }: UserTableProps) {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-neutral-400">
        Loading users...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="w-full h-32 flex items-center justify-center text-neutral-500 border border-dashed border-white/10 rounded-lg">
        No users found.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 overflow-hidden bg-white/5 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-neutral-400 uppercase font-medium border-b border-white/10">
            <tr>
              <th className="px-4 py-3 w-[120px]">User Code</th>
              <th className="px-4 py-3">User Name</th>
              <th className="px-4 py-3 w-[80px]">Sex</th>
              <th className="px-4 py-3">Phone / Mobile</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Roles</th>
              <th className="px-4 py-3 w-[140px]">Status</th>
              <th className="px-4 py-3 w-[120px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.userId} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-medium text-white">{user.userCode}</td>
                <td className="px-4 py-3 text-neutral-300">{user.userName}</td>
                <td className="px-4 py-3 text-neutral-300">
                  {user.sex ? getCodeDesc(SystemCodeTypes.SEX, user.sex) : '-'}
                </td>
                <td className="px-4 py-3 text-neutral-300">
                  <div className="flex flex-col">
                    <span>{user.mobile}</span>
                    {user.phone && <span className="text-xs text-neutral-500">{user.phone}</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-300">{user.email || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {user.roleName ? (
                      user.roleName.split(',').map((name, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap"
                        >
                          {name.trim()}
                        </span>
                      ))
                    ) : user.roleList && user.roleList.length > 0 ? (
                      user.roleList.map((role) => (
                        <span
                          key={role.roleId}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap"
                        >
                          {role.roleName}
                        </span>
                      ))
                    ) : (
                      <span className="text-neutral-500">-</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <UserStatusBadge status={user.userStatus} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-neutral-400 hover:text-blue-400 hover:bg-blue-500/10"
                      onClick={() => onMaintainRole(user)}
                      title="Maintain Roles"
                    >
                      <Shield className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-white/10"
                      onClick={() => onEdit(user)}
                      title="Edit User"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-neutral-400 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => onDelete(user)}
                      title="Delete User"
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

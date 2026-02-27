import { useState } from 'react';
import { Settings, Pencil, Trash2, Folder } from 'lucide-react';
import { RepoDTO } from '@/types/backend-types';
import { SystemStatus } from '@/config/fixcode';
import { Button } from '@/components/button';
import { User } from '@/services/user-management-service';

interface RepositoryTableProps {
  data: RepoDTO[];
  users: User[];
  onEdit: (repo: RepoDTO) => void;
  onDelete: (repo: RepoDTO) => void;
}

const getInitials = (name?: string) => {
  if (!name) return '?';
  return name.slice(0, 2).toUpperCase();
};

const Avatar = ({
  name,
  className = '',
  style,
}: {
  name?: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const initials = getInitials(name);
  const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-amber-600', 'bg-purple-600', 'bg-rose-600'];
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
  return (
    <div
      className={`flex items-center justify-center text-white font-medium rounded-full shrink-0 ${colors[colorIndex]} ${className}`}
      title={name}
      style={style}
    >
      {initials}
    </div>
  );
};

const AvatarStack = ({ names }: { names: string[] }) => {
  if (!names.length)
    return <span className="text-neutral-500 italic text-sm">No collaborators</span>;
  const max = 3;
  const show = names.slice(0, max);
  const extra = names.length - max;
  return (
    <div className="flex items-center -space-x-2">
      {show.map((name, i) => (
        <Avatar
          key={i}
          name={name}
          className="w-7 h-7 text-[10px] ring-2 ring-[#0d1117]"
          style={{ zIndex: 10 - i }}
        />
      ))}
      {extra > 0 && (
        <div
          className="flex items-center justify-center w-7 h-7 rounded-full ring-2 ring-[#0d1117] bg-white/10 text-neutral-400 text-[10px] font-medium inline-block relative"
          style={{ zIndex: 0 }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
};

export function RepositoryTable({ data, users, onEdit, onDelete }: RepositoryTableProps) {
  const getCollaboratorNames = (ids: number[] | undefined): string[] => {
    if (!ids || ids.length === 0) return [];
    return ids
      .map((id) => {
        const u = users.find((u) => u.userId === id);
        return u ? u.userName || u.userCode || `User ${id}` : `User ${id}`;
      })
      .filter((name): name is string => Boolean(name));
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-[11px] text-neutral-400 uppercase tracking-widest border-b border-white/10 bg-[#14181d] sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 font-semibold w-[20%]">Repository Name</th>
              <th className="px-6 py-4 font-semibold w-[25%]">Description</th>
              <th className="px-6 py-4 font-semibold w-[15%]">Owner</th>
              <th className="px-6 py-4 font-semibold w-[15%]">Collaborators</th>
              <th className="px-6 py-4 font-semibold w-[10%] text-center">Status</th>
              <th className="px-6 py-4 font-semibold text-right w-[15%]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500 bg-[#0d1117]">
                  No repositories found
                </td>
              </tr>
            ) : (
              data.map((repo) => {
                const collobarators = getCollaboratorNames(repo.collaboratorIds);

                return (
                  <tr
                    key={repo.repoId}
                    className="hover:bg-white/[0.02] transition-colors group bg-[#0d1117]"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-white text-sm">{repo.repoName}</div>
                    </td>
                    <td className="px-6 py-4 max-w-[250px]">
                      <div className="text-neutral-400 text-sm truncate" title={repo.repoDesc}>
                        {repo.repoDesc || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={repo.creatorName || `User ${repo.createBy || '?'}`}
                          className="w-8 h-8 text-xs ring-1 ring-white/10"
                        />
                        <span className="text-sm text-neutral-300">
                          {repo.creatorName || `User ${repo.createBy || 'Unknown'}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <AvatarStack names={collobarators} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                          repo.status === SystemStatus.ACTIVE
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${repo.status === SystemStatus.ACTIVE ? 'bg-emerald-500' : 'bg-neutral-500'}`}
                        ></span>
                        {repo.status === SystemStatus.ACTIVE ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View/Manage"
                          className="w-8 h-8 text-neutral-400 bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white rounded-md"
                        >
                          <Folder className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(repo)}
                          title="Edit"
                          className="w-8 h-8 text-neutral-400 bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white rounded-md"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(repo)}
                          title="Delete"
                          className="w-8 h-8 text-neutral-400 bg-white/5 border border-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/20 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

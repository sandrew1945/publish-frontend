'use client';

import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, Folder, X } from 'lucide-react';
import { toast } from 'sonner';

import { RepositoryFilter } from '@/services/repository-service';
import { RepoDTO } from '@/types/backend-types';
import { SystemStatus, getCodesByType, SystemCodeTypes } from '@/config/fixcode';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { PaginationTable, type ColumnDef } from '@/components/common/pagination-table';
import { RepositoryFormDialog } from '@/components/repository-management/repository-form-dialog';
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';

import {
  useRepositoryList,
  useCreateRepository,
  useUpdateRepository,
  useDeleteRepository,
  useUserListForSelect,
} from '@/hooks/use-repository';

// ─── Avatar helpers (moved from repository-table.tsx) ────────────────────────

const getInitials = (name?: string) => {
  if (!name) return '?';
  return name.slice(0, 2).toUpperCase();
};

const AVATAR_COLORS = [
  'bg-blue-600',
  'bg-emerald-600',
  'bg-amber-600',
  'bg-purple-600',
  'bg-rose-600',
] as const;

function Avatar({
  name,
  className = '',
  style,
}: {
  name?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const initials = getInitials(name);
  const colorIndex = name ? name.charCodeAt(0) % AVATAR_COLORS.length : 0;
  return (
    <div
      className={`flex items-center justify-center text-white font-medium rounded-full shrink-0 ${AVATAR_COLORS[colorIndex]} ${className}`}
      title={name}
      style={style}
    >
      {initials}
    </div>
  );
}

function AvatarStack({ names }: { names: string[] }) {
  if (!names.length)
    return <span className="text-neutral-500 italic text-sm">No collaborators</span>;
  const MAX_SHOW = 3;
  const show = names.slice(0, MAX_SHOW);
  const extra = names.length - MAX_SHOW;
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
          className="flex items-center justify-center w-7 h-7 rounded-full ring-2 ring-[#0d1117] bg-white/10 text-neutral-400 text-[10px] font-medium"
          style={{ zIndex: 0 }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RepositoryManagementPage() {
  // Pagination & Filter State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState<RepositoryFilter>({ status: undefined, ownerId: undefined });
  const [searchInput, setSearchInput] = useState('');

  // Form Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedRepo, setSelectedRepo] = useState<RepoDTO | undefined>();

  // Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [repoToDelete, setRepoToDelete] = useState<RepoDTO | undefined>();

  // ─── React Query hooks ────────────────────────────────────────────────────
  const { data, isLoading, refetch } = useRepositoryList(filter, { page, pageSize });
  const { data: users = [] } = useUserListForSelect();
  const createRepository = useCreateRepository();
  const updateRepository = useUpdateRepository();
  const deleteRepository = useDeleteRepository();

  const records = data?.records ?? [];
  const total = data?.totalRecords ?? 0;

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setFilter((prev) => ({ ...prev, repoName: searchInput || undefined }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    setPage(1);
    setFilter((prev) => ({ ...prev, status: value }));
  };

  const handleOwnerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    setPage(1);
    setFilter((prev) => ({ ...prev, ownerId: value }));
  };

  const handleCreate = () => {
    setDialogMode('create');
    setSelectedRepo(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (repo: RepoDTO) => {
    setDialogMode('edit');
    setSelectedRepo(repo);
    setIsDialogOpen(true);
  };

  const handleDelete = (repo: RepoDTO) => {
    setRepoToDelete(repo);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!repoToDelete?.repoId) return;
    try {
      await deleteRepository.mutateAsync(repoToDelete.repoId);
      toast.success('Repository deleted successfully');
      setIsDeleteDialogOpen(false);
      setRepoToDelete(undefined);
    } catch (error) {
      console.error('Failed to delete repository:', error);
      toast.error('Failed to delete repository');
    }
  };

  const handleFormSubmit = async (repo: RepoDTO) => {
    try {
      if (dialogMode === 'create') {
        await createRepository.mutateAsync(repo);
        toast.success('Repository created successfully');
      } else {
        await updateRepository.mutateAsync(repo);
        toast.success('Repository updated successfully');
      }
    } catch (error) {
      console.error('Form submission failed:', error);
      throw error;
    }
  };

  const statusOptions = getCodesByType(SystemCodeTypes.STATUS);

  // ─── Column definitions ─────────────────────────────────────────────────────

  const columns: ColumnDef<RepoDTO>[] = [
    {
      name: 'repoName',
      label: 'Repository Name',
      field: 'repoName',
      width: '20%',
      type: 'data',
    },
    {
      name: 'repoDesc',
      label: 'Description',
      field: 'repoDesc',
      width: '25%',
      type: 'data',
    },
    {
      name: 'owner',
      label: 'Owner',
      field: 'creatorName',
      width: '15%',
      type: 'slot',
      render: (repo) => (
        <div className="flex items-center gap-3">
          <Avatar
            name={(repo.creatorName as string) || `User ${repo.createBy || '?'}`}
            className="w-8 h-8 text-xs ring-1 ring-white/10"
          />
          <span className="text-sm text-neutral-300">
            {(repo.creatorName as string) || `User ${repo.createBy || 'Unknown'}`}
          </span>
        </div>
      ),
    },
    {
      name: 'collaborators',
      label: 'Collaborators',
      field: 'collaboratorNames',
      width: '15%',
      type: 'slot',
      // NOTE: collaboratorNames is already returned by the API as a comma-separated string
      render: (repo) => {
        const names = repo.collaboratorNames
          ? repo.collaboratorNames
              .split(',')
              .map((n) => n.trim())
              .filter(Boolean)
          : [];
        return <AvatarStack names={names} />;
      },
    },
    {
      name: 'status',
      label: 'Status',
      field: 'status',
      width: '10%',
      align: 'center',
      type: 'slot',
      render: (repo) => {
        const isActive = repo.status === SystemStatus.ACTIVE;
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${
              isActive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? 'bg-emerald-500' : 'bg-neutral-500'}`}
            />
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
    },
    {
      name: 'actions',
      label: 'Actions',
      field: 'repoId',
      width: '15%',
      align: 'right',
      type: 'slot',
      render: (repo) => (
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
            onClick={() => handleEdit(repo as RepoDTO)}
            title="Edit"
            className="w-8 h-8 text-neutral-400 bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white rounded-md"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(repo as RepoDTO)}
            title="Delete"
            className="w-8 h-8 text-neutral-400 bg-white/5 border border-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/20 rounded-md"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">API Repositories</h1>
          <p className="text-neutral-400">Manage and organize your API collections and services.</p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Repository
        </Button>
      </div>

      {/* Filters */}
      <form
        onSubmit={handleSearch}
        className="flex flex-wrap items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm"
      >
        <div className="flex-1 min-w-[300px]">
          <Input
            placeholder="Search repositories..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-black/20 border-white/10 focus:ring-primary/50"
          />
        </div>

        <div className="w-[180px]">
          <select
            value={filter.ownerId || ''}
            onChange={handleOwnerChange}
            className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <option value="" className="bg-neutral-900 text-white">
              All Owners
            </option>
            {users.map((u) => (
              <option key={u.userId} value={u.userId} className="bg-neutral-900 text-white">
                {u.userName || u.userCode}
              </option>
            ))}
          </select>
        </div>

        <div className="w-[180px]">
          <select
            value={filter.status || ''}
            onChange={handleStatusChange}
            className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <option value="" className="bg-neutral-900 text-white">
              All Status
            </option>
            {statusOptions.map((opt) => (
              <option key={opt.code} value={opt.code} className="bg-neutral-900 text-white">
                {opt.code_desc}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" variant="default" className="w-[100px]">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSearchInput('');
              setFilter({ status: undefined, ownerId: undefined });
              setPage(1);
            }}
            className="w-[100px] border-white/10 text-white hover:bg-white/10 hover:text-white"
          >
            <X className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </form>

      {/* PaginationTable replaces RepositoryTable + inline pagination */}
      <PaginationTable<RepoDTO>
        data={records}
        columns={columns}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        query={() => refetch()}
        rowKey={(repo) => repo.repoId ?? 0}
        emptyText="No repositories found"
      />

      <RepositoryFormDialog
        open={isDialogOpen}
        mode={dialogMode}
        initialData={selectedRepo}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Repository?"
        description={
          repoToDelete ? (
            <>
              Are you sure you want to delete repository{' '}
              <span className="text-white font-medium">{repoToDelete.repoName}</span>? This action
              cannot be undone immediately.
            </>
          ) : null
        }
        confirmLabel="Delete Repository"
        isDeleting={deleteRepository.isPending}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setRepoToDelete(undefined);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

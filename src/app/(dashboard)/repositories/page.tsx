'use client';

import { useState, useCallback, useEffect } from 'react';
import { Plus, Search, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';

import { repositoryService, RepositoryFilter } from '@/services/repository-service';
import { userManagementService, User } from '@/services/user-management-service';
import { RepoDTO } from '@/types/backend-types';
import { SystemStatus, getCodesByType, SystemCodeTypes } from '@/config/fixcode';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { RepositoryTable } from '@/components/repository-management/repository-table';
import { RepositoryFormDialog } from '@/components/repository-management/repository-form-dialog';
import { RepositoryDeleteDialog } from '@/components/repository-management/repository-delete-dialog';

export default function RepositoryManagementPage() {
  const [data, setData] = useState<RepoDTO[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

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
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await userManagementService.getUsers({}, { page: 1, pageSize: 1000 });
      setUsers(res.records || []);
    } catch (e) {
      console.error('Failed to fetch users', e);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await repositoryService.getRepositories(filter, { page, pageSize });
      setData(res.records || []);
      setTotal(res.totalRecords || 0);
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
      toast.error('Failed to load repositories');
    } finally {
      setLoading(false);
    }
  }, [filter, page, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setFilter((prev) => ({ ...prev, repoName: searchInput || undefined }));
  };

  const handleReset = () => {
    setSearchInput('');
    setPage(1);
    setFilter({ status: undefined, ownerId: undefined, repoName: undefined });
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
    if (!repoToDelete) return;
    try {
      setIsDeleting(true);
      await repositoryService.deleteRepository(repoToDelete.repoId!);
      toast.success('Repository deleted successfully');
      setIsDeleteDialogOpen(false);
      setRepoToDelete(undefined);
      fetchData();
    } catch (error) {
      console.error('Failed to delete repository:', error);
      toast.error('Failed to delete repository');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (repo: RepoDTO) => {
    try {
      if (dialogMode === 'create') {
        await repositoryService.createRepository(repo);
        toast.success('Repository created successfully');
      } else {
        await repositoryService.updateRepository(repo);
        toast.success('Repository updated successfully');
      }
      fetchData();
    } catch (error) {
      console.error('Form submission failed:', error);
      throw error;
    }
  };

  const statusOptions = getCodesByType(SystemCodeTypes.STATUS);

  return (
    <div className="flex flex-col h-full bg-[#0d1117] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">API Repositories</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Manage and organize your API collections and services.
          </p>
        </div>
        <Button onClick={handleCreate} className="bg-blue-600 text-white hover:bg-blue-700 border-transparent">
          <Plus className="w-4 h-4 mr-2" />
          Create Repository
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col gap-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 bg-[#14181d] p-4 rounded-lg border border-white/10">
          <form onSubmit={handleSearch} className="flex flex-1 min-w-[300px] gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <Input
                placeholder="Search repositories..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 bg-[#0d1117] border-white/10 text-white w-full h-10"
              />
            </div>

            <select
              value={filter.ownerId || ''}
              onChange={handleOwnerChange}
              className="h-10 min-w-[160px] rounded-md border border-white/10 bg-[#0d1117] px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
            >
              <option value="">All Owners</option>
              {users.map((u) => (
                <option key={u.userId} value={u.userId}>
                  {u.userName || u.userCode}
                </option>
              ))}
            </select>

            <select
              value={filter.status || ''}
              onChange={handleStatusChange}
              className="h-10 min-w-[160px] rounded-md border border-white/10 bg-[#0d1117] px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
            >
              <option value="">All Status</option>
              {statusOptions.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.code_desc}
                </option>
              ))}
            </select>
            <Button
              type="submit"
              className="px-6 h-10 bg-blue-600 hover:bg-blue-700 text-white border-transparent"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>
        </div>

        {/* Table & Pagination */}
        <div className="flex-1 bg-[#0d1117] rounded-lg border border-white/10 flex flex-col">
          <div className="flex-1 overflow-auto rounded-t-lg">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <RefreshCw className="w-6 h-6 animate-spin text-neutral-500" />
              </div>
            ) : (
              <RepositoryTable
                data={data}
                users={users}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#14181d] rounded-b-lg">
            <div className="flex items-center text-sm text-neutral-400 gap-2">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-[#0d1117] border border-white/10 rounded-md px-2 py-1 h-8 text-white focus:outline-none focus:border-white/20"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>per page</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-8 border-white/10 bg-transparent text-neutral-400 hover:text-white hover:bg-white/5 disabled:opacity-50"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(Math.max(1, Math.ceil(total / pageSize)))].map((_, i) => {
                  const pageNum = i + 1;
                  // Show current, first, last, and pages around current (simple ellipsis logic omitted for brevity, showing all if few or truncating if many but we only need basic for now based on total)
                  const isCurrent = page === pageNum;
                  return (
                    <Button
                      key={i}
                      variant={isCurrent ? 'default' : 'ghost'}
                      size="sm"
                      className={`min-w-8 h-8 px-2 rounded-md ${isCurrent ? 'bg-blue-600 text-white hover:bg-blue-700 border-transparent' : 'text-neutral-400 bg-transparent hover:text-white hover:bg-white/10'}`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= Math.ceil(total / pageSize) || total === 0}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 border-white/10 bg-transparent text-neutral-400 hover:text-white hover:bg-white/5 disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      <RepositoryFormDialog
        open={isDialogOpen}
        mode={dialogMode}
        initialData={selectedRepo}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <RepositoryDeleteDialog
        open={isDeleteDialogOpen}
        repo={repoToDelete}
        isDeleting={isDeleting}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setRepoToDelete(undefined);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/button';
import { UserFilterBar } from './user-filter-bar';
import { UserTable } from './user-table';
import { UserFormDialog } from './user-form-dialog';
import { UserDeleteDialog } from './user-delete-dialog';
import { MaintainRoleDialog } from './maintain-role-dialog';
import {
  useUserList,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '@/hooks/use-user-management';
import { User, UserFilter } from '@/services/user-management-service';

import { useGlobalLoading } from '@/providers/global-loading-provider';

export function UserListPage() {
  // State
  const [filter, setFilter] = useState<UserFilter>({});
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | undefined>(undefined);

  const [isMaintainRoleOpen, setIsMaintainRoleOpen] = useState(false);

  // Global Loading
  const { startLoading, stopLoading } = useGlobalLoading();

  // Queries & Mutations
  const { data, isLoading, isError, refetch } = useUserList(filter, { page, pageSize });
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  // Handlers
  const handleSearch = async (newFilter: UserFilter) => {
    setFilter(newFilter);
    setPage(1); // Reset to first page on new search
    // Force query even if filter is same
    startLoading();
    try {
      await refetch();
    } finally {
      stopLoading();
    }
  };

  const handleCreate = () => {
    setSelectedUser(undefined);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };

  const handleMaintainRole = (user: User) => {
    setSelectedUser(user);
    setIsMaintainRoleOpen(true);
  };

  const handleFormSubmit = async (user: User) => {
    startLoading();
    try {
      if (formMode === 'create') {
        await createUser.mutateAsync(user);
      } else {
        await updateUser.mutateAsync(user);
      }
      setIsFormOpen(false);
    } finally {
      stopLoading();
    }
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete && userToDelete.userId) {
      startLoading();
      try {
        await deleteUser.mutateAsync(userToDelete.userId);
        setIsDeleteOpen(false);
        setUserToDelete(undefined);
        // If we deleted the last item on the page, go back one page
        if (data?.records.length === 1 && page > 1) {
          setPage(page - 1);
        }
      } finally {
        stopLoading();
      }
    }
  };

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
          <p className="text-neutral-400">Manage system users, permissions, and access controls.</p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <UserFilterBar onSearch={handleSearch} isLoading={isLoading} />

      {/* Table */}
      <UserTable
        users={data?.records || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onMaintainRole={handleMaintainRole}
      />

      {/* Pagination */}
      {data && data.total > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-neutral-400">
            Showing <span className="font-medium text-white">{(page - 1) * pageSize + 1}</span> to{' '}
            <span className="font-medium text-white">{Math.min(page * pageSize, data.total)}</span>{' '}
            of <span className="font-medium text-white">{data.total}</span> users
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {/* Simple page indicator */}
              <span className="text-sm text-white px-2">
                Page {page} of {totalPages || 1}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isLoading}
              className="border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <UserFormDialog
        open={isFormOpen}
        mode={formMode}
        initialData={selectedUser}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <UserDeleteDialog
        open={isDeleteOpen}
        user={userToDelete}
        isDeleting={deleteUser.isPending}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      <MaintainRoleDialog
        open={isMaintainRoleOpen}
        user={selectedUser}
        onClose={() => {
          setIsMaintainRoleOpen(false);
          setSelectedUser(undefined);
        }}
      />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/button';
import { UserFilterBar } from './user-filter-bar';
import { UserFormDialog } from './user-form-dialog';
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { MaintainRoleDialog } from './maintain-role-dialog';
import { PaginationTable, type ColumnDef } from '@/components/common/pagination-table';
import { UserStatusBadge } from './user-status-badge';
import { SystemCodeTypes, getCodeDesc } from '@/config/fixcode';
import { Edit2, Shield, Trash2 } from 'lucide-react';
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

  const columns: ColumnDef<User>[] = React.useMemo(
    () => [
      {
        type: 'data',
        name: 'userCode',
        label: 'User Code',
        field: 'userCode',
      },
      {
        type: 'data',
        name: 'userName',
        label: 'User Name',
        field: 'userName',
      },
      {
        type: 'fixcode',
        name: 'sex',
        label: 'Sex',
        field: 'sex',
        codeTypeId: SystemCodeTypes.SEX,
      },
      {
        type: 'slot',
        name: 'contact',
        label: 'Phone / Mobile',
        field: 'mobile',
        render: (user) => (
          <div className="flex flex-col">
            <span>{user.mobile}</span>
            {user.phone && <span className="text-xs text-neutral-500">{user.phone}</span>}
          </div>
        ),
      },
      {
        type: 'data',
        name: 'email',
        label: 'Email',
        field: 'email',
      },
      {
        type: 'slot',
        name: 'roles',
        label: 'Roles',
        field: 'roleName',
        render: (user) => (
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
        ),
      },
      {
        type: 'slot',
        name: 'status',
        label: 'Status',
        field: 'userStatus',
        render: (user) => <UserStatusBadge status={user.userStatus} />,
      },
      {
        type: 'slot',
        name: 'actions',
        label: 'Actions',
        width: '15%',
        align: 'right',
        field: '',
        render: (user) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-neutral-400 bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white rounded-md"
              onClick={() => handleMaintainRole(user)}
              title="Maintain Roles"
            >
              <Shield className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-neutral-400 bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white rounded-md"
              onClick={() => handleEdit(user)}
              title="Edit User"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-neutral-400 bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white rounded-md"
              onClick={() => handleDeleteClick(user)}
              title="Delete User"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

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
      <PaginationTable
        columns={columns}
        data={data?.records || []}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        total={data?.total || 0}
        onPageChange={setPage}
        onPageSizeChange={() => { }} // Not supported in this UI
      />

      {/* Dialogs */}
      <UserFormDialog
        open={isFormOpen}
        mode={formMode}
        initialData={selectedUser}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        open={isDeleteOpen}
        title="Delete User?"
        description={
          userToDelete ? (
            <>
              Are you sure you want to delete user{' '}
              <span className="text-white font-medium">{userToDelete.userName}</span> (
              {userToDelete.userCode})? This action cannot be undone immediately, though the user is
              soft-deleted.
            </>
          ) : null
        }
        confirmLabel="Delete User"
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

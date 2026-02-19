'use client';

import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/button';
import { RoleFilterBar } from './role-filter-bar';
import { RoleTable } from './role-table';
import { RoleFormDialog } from './role-form-dialog';
import { RoleDeleteDialog } from './role-delete-dialog';
import { AssignMenuDialog } from './assign-menu-dialog';
import {
  useRoleList,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from '@/hooks/use-role-management';
import { Role, RoleFilter } from '@/services/role-management-service';
import { useGlobalLoading } from '@/providers/global-loading-provider';

export function RoleListPage() {
  // State
  const [filter, setFilter] = useState<RoleFilter>({});
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | undefined>(undefined);

  const [isAssignMenuOpen, setIsAssignMenuOpen] = useState(false);
  const [roleToAssign, setRoleToAssign] = useState<Role | undefined>(undefined);

  // Global Loading
  const { startLoading, stopLoading } = useGlobalLoading();

  // Queries & Mutations
  const { data, isLoading, refetch } = useRoleList(filter, { page, pageSize });
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  // Handlers
  const handleSearch = async (newFilter: RoleFilter) => {
    setFilter(newFilter);
    setPage(1); // Reset to first page on new search
    startLoading();
    try {
      await refetch();
    } finally {
      stopLoading();
    }
  };

  const handleCreate = () => {
    setSelectedRole(undefined);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleAssignMenu = (role: Role) => {
    setRoleToAssign(role);
    setIsAssignMenuOpen(true);
  };

  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (role: Role) => {
    startLoading();
    try {
      if (formMode === 'create') {
        await createRole.mutateAsync(role);
      } else {
        await updateRole.mutateAsync(role);
      }
      setIsFormOpen(false);
    } finally {
      stopLoading();
    }
  };

  const handleDeleteConfirm = async () => {
    if (roleToDelete && roleToDelete.roleId) {
      startLoading();
      try {
        await deleteRole.mutateAsync(roleToDelete.roleId);
        setIsDeleteOpen(false);
        setRoleToDelete(undefined);
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Role Management</h1>
          <p className="text-neutral-400">Manage system roles and permissions.</p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Role
        </Button>
      </div>

      {/* Filters */}
      <RoleFilterBar onSearch={handleSearch} isLoading={isLoading} />

      {/* Table */}
      <RoleTable
        roles={data?.records || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onAssignMenu={handleAssignMenu}
      />

      {/* Pagination */}
      {data && data.total > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-neutral-400">
            Showing <span className="font-medium text-white">{(page - 1) * pageSize + 1}</span> to{' '}
            <span className="font-medium text-white">{Math.min(page * pageSize, data.total)}</span>{' '}
            of <span className="font-medium text-white">{data.total}</span> roles
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
      <RoleFormDialog
        open={isFormOpen}
        mode={formMode}
        initialData={selectedRole}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <RoleDeleteDialog
        open={isDeleteOpen}
        role={roleToDelete}
        isDeleting={deleteRole.isPending}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      <AssignMenuDialog
        open={isAssignMenuOpen}
        roleId={roleToAssign?.roleId}
        roleName={roleToAssign?.roleName}
        onClose={() => setIsAssignMenuOpen(false)}
        onSuccess={() => {
          // Optional: refresh data if needed, though menu assignment specific to role usually doesn't affect list
        }}
      />
    </div>
  );
}

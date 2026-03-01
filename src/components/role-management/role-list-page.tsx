'use client';

import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/button';
import { RoleFilterBar } from './role-filter-bar';
import { RoleFormDialog } from './role-form-dialog';
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { AssignMenuDialog } from './assign-menu-dialog';
import { PaginationTable, type ColumnDef } from '@/components/common/pagination-table';
import { RoleStatusBadge } from './role-status-badge';
import { Edit2, Shield, Trash2 } from 'lucide-react';
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

  const columns = React.useMemo<ColumnDef<Role>[]>(
    () => [
      {
        type: 'data',
        name: 'roleCode',
        label: 'Role Code',
        field: 'roleCode',
      },
      {
        type: 'data',
        name: 'roleName',
        label: 'Role Name',
        field: 'roleName',
      },
      {
        type: 'time',
        name: 'createDate',
        label: 'Create Time',
        field: 'createDate',
      },
      {
        type: 'slot',
        name: 'status',
        label: 'Status',
        field: 'roleStatus',
        render: (role) => <RoleStatusBadge status={role.roleStatus} />,
      },
      {
        type: 'slot',
        name: 'actions',
        label: 'Actions',
        width: '15%',
        align: 'right',
        field: '',
        render: (role) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-neutral-400 bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white rounded-md"
              onClick={() => handleAssignMenu(role)}
              title="Assign Menu"
            >
              <Shield className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-neutral-400 bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white rounded-md"
              onClick={() => handleEdit(role)}
              title="Edit Role"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-neutral-400 bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white rounded-md"
              onClick={() => handleDeleteClick(role)}
              title="Delete Role"
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
      <RoleFormDialog
        open={isFormOpen}
        mode={formMode}
        initialData={selectedRole}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        open={isDeleteOpen}
        title="Delete Role?"
        description={
          roleToDelete ? (
            <>
              Are you sure you want to delete role{' '}
              <span className="text-white font-medium">{roleToDelete.roleName}</span> (
              {roleToDelete.roleCode})? This action cannot be undone immediately.
            </>
          ) : null
        }
        confirmLabel="Delete Role"
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

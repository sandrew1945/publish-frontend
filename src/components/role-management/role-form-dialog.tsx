'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import { Role } from '@/services/role-management-service';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { SystemCodeTypes, SystemStatus, getCodesByType } from '@/config/fixcode';
import { useValidateRoleCode, roleFormSchema, RoleFormValues } from '@/hooks/use-role-management';

interface RoleFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialData?: Role;
  onClose: () => void;
  onSubmit: (role: Role) => Promise<void>;
}

export function RoleFormDialog({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: RoleFormDialogProps) {
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      roleCode: '',
      roleName: '',
      roleStatus: SystemStatus.ACTIVE,
    },
  });

  // NOTE: Async uniqueness check — runs via debounced query in the hook
  const { data: isCodeValid, isLoading: checkingCode } = useValidateRoleCode(
    form.watch('roleCode') || ''
  );

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        form.reset({
          roleCode: initialData.roleCode ?? '',
          roleName: initialData.roleName ?? '',
          roleStatus: initialData.roleStatus ?? SystemStatus.ACTIVE,
        });
      } else {
        form.reset({
          roleCode: '',
          roleName: '',
          roleStatus: SystemStatus.ACTIVE,
        });
      }
    }
  }, [open, mode, initialData, form]);

  // Prevent scrolling when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  const handleFormSubmit = async (data: RoleFormValues) => {
    // Async uniqueness validation for create mode
    if (mode === 'create' && isCodeValid === false) {
      form.setError('roleCode', { message: 'Role Code already exists' });
      return;
    }

    try {
      // NOTE: Spread initialData to preserve fields not in the form schema
      // (e.g. roleId, createBy, createDate) that the backend expects
      const rolePayload: Role = {
        ...(initialData ?? {}),
        roleCode: data.roleCode,
        roleName: data.roleName,
        roleStatus: data.roleStatus,
      };
      await onSubmit(rolePayload);
      onClose();
    } catch (error) {
      console.error('Failed to submit role:', error);
    }
  };

  const statusOptions = getCodesByType(SystemCodeTypes.STATUS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-lg shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            {mode === 'create' ? 'Create New Role' : 'Edit Role'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-neutral-400" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form id="role-form" onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Role Code <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Input
                  {...form.register('roleCode')}
                  disabled={mode === 'edit'}
                  className={`${form.formState.errors.roleCode ? 'border-red-500/50' : ''}`}
                />
                {checkingCode && (
                  <div className="absolute right-3 top-2.5">
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                  </div>
                )}
              </div>
              {form.formState.errors.roleCode && (
                <p className="text-xs text-red-400">{form.formState.errors.roleCode.message}</p>
              )}
              {mode === 'create' &&
                form.watch('roleCode') &&
                isCodeValid === false &&
                !form.formState.errors.roleCode && (
                  <p className="text-xs text-red-400">Role Code already exists</p>
                )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Role Name <span className="text-red-400">*</span>
              </label>
              <Input
                {...form.register('roleName')}
                className={form.formState.errors.roleName ? 'border-red-500/50' : ''}
              />
              {form.formState.errors.roleName && (
                <p className="text-xs text-red-400">{form.formState.errors.roleName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Status <span className="text-red-400">*</span>
              </label>
              <select
                {...form.register('roleStatus', { valueAsNumber: true })}
                className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.code} value={opt.code} className="bg-neutral-900">
                    {opt.code_desc}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-white/10 gap-3 bg-white/5">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={form.formState.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            form="role-form"
            type="submit"
            variant="default"
            disabled={form.formState.isSubmitting || (mode === 'create' && isCodeValid === false)}
          >
            {form.formState.isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {mode === 'create' ? 'Create Role' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

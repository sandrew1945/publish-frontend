'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import { User } from '@/services/user-management-service';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { SystemCodeTypes, SystemSex, SystemEmployeeStatus, getCodesByType } from '@/config/fixcode';
import { useValidateUserCode, userFormSchema, UserFormValues } from '@/hooks/use-user-management';

interface UserFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialData?: User;
  onClose: () => void;
  onSubmit: (user: User) => Promise<void>;
}

export function UserFormDialog({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: UserFormDialogProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      userCode: '',
      userName: '',
      password: '',
      sex: SystemSex.UNKNOWN,
      mobile: '',
      phone: '',
      email: '',
      userStatus: SystemEmployeeStatus.ON_JOB,
    },
  });

  // NOTE: Async uniqueness check — runs via debounced query in the hook
  const { data: isCodeValid, isLoading: checkingCode } = useValidateUserCode(
    form.watch('userCode') || ''
  );

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        form.reset({
          userCode: initialData.userCode ?? '',
          userName: initialData.userName ?? '',
          password: '',
          sex: initialData.sex ?? SystemSex.UNKNOWN,
          mobile: initialData.mobile ?? '',
          phone: initialData.phone ?? '',
          email: initialData.email ?? '',
          userStatus: initialData.userStatus ?? SystemEmployeeStatus.ON_JOB,
        });
      } else {
        form.reset({
          userCode: '',
          userName: '',
          password: '',
          sex: SystemSex.UNKNOWN,
          mobile: '',
          phone: '',
          email: '',
          userStatus: SystemEmployeeStatus.ON_JOB,
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

  const handleFormSubmit = async (data: UserFormValues) => {
    // Mode-aware password validation: required for create, optional for edit
    if (mode === 'create' && !data.password?.trim()) {
      form.setError('password', { message: 'Initial Password is required' });
      return;
    }

    // Async uniqueness validation for create mode
    if (mode === 'create' && isCodeValid === false) {
      form.setError('userCode', { message: 'User Code already exists' });
      return;
    }

    try {
      // NOTE: Spread initialData to preserve fields not in the form schema
      // (e.g. userId, avatar, userType) that the backend expects
      const userPayload: User = {
        ...(initialData ?? {}),
        userCode: data.userCode,
        userName: data.userName,
        sex: data.sex,
        mobile: data.mobile,
        phone: data.phone,
        email: data.email || undefined,
        userStatus: data.userStatus,
        ...(data.password ? { password: data.password } : {}),
      };
      await onSubmit(userPayload);
      onClose();
    } catch (error) {
      console.error('Failed to submit user:', error);
    }
  };

  const sexOptions = getCodesByType(SystemCodeTypes.SEX);
  const statusOptions = getCodesByType(SystemCodeTypes.EMPLOYEE_STATUS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-lg shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            {mode === 'create' ? 'Create New User' : 'Edit User'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-neutral-400" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form id="user-form" onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Row 1: Code & Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">
                  User Code <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...form.register('userCode')}
                    disabled={mode === 'edit'}
                    className={`${form.formState.errors.userCode ? 'border-red-500/50' : ''}`}
                  />
                  {checkingCode && (
                    <div className="absolute right-3 top-2.5">
                      <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                    </div>
                  )}
                </div>
                {form.formState.errors.userCode && (
                  <p className="text-xs text-red-400">{form.formState.errors.userCode.message}</p>
                )}
                {mode === 'create' &&
                  form.watch('userCode') &&
                  isCodeValid === false &&
                  !form.formState.errors.userCode && (
                    <p className="text-xs text-red-400">User Code already exists</p>
                  )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">
                  User Name <span className="text-red-400">*</span>
                </label>
                <Input
                  {...form.register('userName')}
                  className={form.formState.errors.userName ? 'border-red-500/50' : ''}
                />
                {form.formState.errors.userName && (
                  <p className="text-xs text-red-400">{form.formState.errors.userName.message}</p>
                )}
              </div>
            </div>

            {/* Row 2: Sex & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Sex</label>
                <select
                  {...form.register('sex', { valueAsNumber: true })}
                  className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  {sexOptions.map((opt) => (
                    <option key={opt.code} value={opt.code} className="bg-neutral-900">
                      {opt.code_desc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">
                  Status <span className="text-red-400">*</span>
                </label>
                <select
                  {...form.register('userStatus', { valueAsNumber: true })}
                  className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.code} value={opt.code} className="bg-neutral-900">
                      {opt.code_desc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Mobile</label>
                <Input {...form.register('mobile')} placeholder="Mobile number" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Phone</label>
                <Input {...form.register('phone')} placeholder="Telephone" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Email</label>
              <Input
                type="email"
                {...form.register('email')}
                placeholder="email@example.com"
                className={form.formState.errors.email ? 'border-red-500/50' : ''}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                {mode === 'create' ? 'Initial Password' : 'Password'}
                {mode === 'create' && <span className="text-red-400">*</span>}
              </label>
              <Input
                type="password"
                {...form.register('password')}
                placeholder={
                  mode === 'create'
                    ? 'Enter initial password'
                    : 'Leave empty to keep current password'
                }
                className={form.formState.errors.password ? 'border-red-500/50' : ''}
              />
              {form.formState.errors.password && (
                <p className="text-xs text-red-400">{form.formState.errors.password.message}</p>
              )}
              {mode === 'edit' && (
                <p className="text-xs text-neutral-500">
                  Leave empty if you don&apos;t want to change the password
                </p>
              )}
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
            form="user-form"
            type="submit"
            variant="default"
            disabled={form.formState.isSubmitting || (mode === 'create' && isCodeValid === false)}
          >
            {form.formState.isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {mode === 'create' ? 'Create User' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

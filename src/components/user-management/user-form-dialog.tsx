import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { User } from '@/services/user-management-service';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { SystemCodeTypes, SystemStatus, SystemSex, SystemEmployeeStatus, getCodesByType } from '@/config/fixcode';
import { useValidateUserCode } from '@/hooks/use-user-management';

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
  const [formData, setFormData] = useState<Partial<User>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Code validation hook
  const { data: isCodeValid, isLoading: checkingCode } = useValidateUserCode(
    formData.userCode || ''
  );

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setFormData({ ...initialData });
      } else {
        setFormData({
          userStatus: SystemEmployeeStatus.ON_JOB, // Default On Job
          sex: SystemSex.UNKNOWN, // Default Unknown
        });
      }
      setErrors({});
    }
  }, [open, mode, initialData]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.userCode?.trim()) newErrors.userCode = 'User Code is required';
    if (!formData.userName?.trim()) newErrors.userName = 'User Name is required';
    if (formData.userStatus === undefined) newErrors.userStatus = 'Status is required';

    // Password validation: required for create, optional for edit
    if (mode === 'create' && !formData.password?.trim()) {
      newErrors.password = 'Initial Password is required';
    }

    // Check uniqueness for Create mode
    if (mode === 'create' && formData.userCode && isCodeValid === false) {
      newErrors.userCode = 'User Code already exists';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData as User);
      onClose();
    } catch (error) {
      console.error('Failed to submit user:', error);
      // Ideally show toast error here
    } finally {
      setIsSubmitting(false);
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
          <form id="user-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Code & Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">
                  User Code <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Input
                    value={formData.userCode || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, userCode: e.target.value });
                      setErrors({ ...errors, userCode: '' });
                    }}
                    disabled={mode === 'edit'}
                    className={`${errors.userCode ? 'border-red-500/50' : ''}`}
                  />
                  {checkingCode && (
                    <div className="absolute right-3 top-2.5">
                      <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                    </div>
                  )}
                </div>
                {errors.userCode && <p className="text-xs text-red-400">{errors.userCode}</p>}
                {mode === 'create' &&
                  formData.userCode &&
                  isCodeValid === false &&
                  !errors.userCode && (
                    <p className="text-xs text-red-400">User Code already exists</p>
                  )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">
                  User Name <span className="text-red-400">*</span>
                </label>
                <Input
                  value={formData.userName || ''}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className={errors.userName ? 'border-red-500/50' : ''}
                />
                {errors.userName && <p className="text-xs text-red-400">{errors.userName}</p>}
              </div>
            </div>

            {/* Row 2: Sex & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Sex</label>
                <select
                  value={formData.sex}
                  onChange={(e) => setFormData({ ...formData, sex: Number(e.target.value) })}
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
                  value={formData.userStatus}
                  onChange={(e) => setFormData({ ...formData, userStatus: Number(e.target.value) })}
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
                <Input
                  value={formData.mobile || ''}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="Mobile number"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Phone</label>
                <Input
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Telephone"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Email</label>
              <Input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                {mode === 'create' ? 'Initial Password' : 'Password'}
                {mode === 'create' && <span className="text-red-400">*</span>}
              </label>
              <Input
                type="password"
                value={formData.password || ''}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setErrors({ ...errors, password: '' });
                }}
                placeholder={mode === 'create' ? 'Enter initial password' : 'Leave empty to keep current password'}
                className={errors.password ? 'border-red-500/50' : ''}
              />
              {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
              {mode === 'edit' && (
                <p className="text-xs text-neutral-500">Leave empty if you don't want to change the password</p>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-white/10 gap-3 bg-white/5">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            form="user-form"
            type="submit"
            variant="default"
            disabled={isSubmitting || (mode === 'create' && isCodeValid === false)}
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {mode === 'create' ? 'Create User' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

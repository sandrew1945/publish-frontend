import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Role } from '@/services/role-management-service';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { SystemCodeTypes, SystemStatus, getCodesByType } from '@/config/fixcode';
import { useValidateRoleCode } from '@/hooks/use-role-management';

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
  const [formData, setFormData] = useState<Partial<Role>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Code validation hook
  const { data: isCodeValid, isLoading: checkingCode } = useValidateRoleCode(
    formData.roleCode || ''
  );

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setFormData({ ...initialData });
      } else {
        setFormData({
          roleStatus: SystemStatus.ACTIVE, // Default Active
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
    if (!formData.roleCode?.trim()) newErrors.roleCode = 'Role Code is required';
    if (!formData.roleName?.trim()) newErrors.roleName = 'Role Name is required';
    if (formData.roleStatus === undefined) newErrors.roleStatus = 'Status is required';

    // Check uniqueness for Create mode
    if (mode === 'create' && formData.roleCode && isCodeValid === false) {
      newErrors.roleCode = 'Role Code already exists';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData as Role);
      onClose();
    } catch (error) {
      console.error('Failed to submit role:', error);
    } finally {
      setIsSubmitting(false);
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
          <form id="role-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Role Code <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Input
                  value={formData.roleCode || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, roleCode: e.target.value });
                    setErrors({ ...errors, roleCode: '' });
                  }}
                  disabled={mode === 'edit'}
                  className={`${errors.roleCode ? 'border-red-500/50' : ''}`}
                />
                {checkingCode && (
                  <div className="absolute right-3 top-2.5">
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                  </div>
                )}
              </div>
              {errors.roleCode && <p className="text-xs text-red-400">{errors.roleCode}</p>}
              {mode === 'create' &&
                formData.roleCode &&
                isCodeValid === false &&
                !errors.roleCode && (
                  <p className="text-xs text-red-400">Role Code already exists</p>
                )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Role Name <span className="text-red-400">*</span>
              </label>
              <Input
                value={formData.roleName || ''}
                onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                className={errors.roleName ? 'border-red-500/50' : ''}
              />
              {errors.roleName && <p className="text-xs text-red-400">{errors.roleName}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Status <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.roleStatus}
                onChange={(e) => setFormData({ ...formData, roleStatus: Number(e.target.value) })}
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
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            form="role-form"
            type="submit"
            variant="default"
            disabled={isSubmitting || (mode === 'create' && isCodeValid === false)}
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {mode === 'create' ? 'Create Role' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

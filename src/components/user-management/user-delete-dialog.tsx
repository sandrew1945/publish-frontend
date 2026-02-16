import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/button';
import { User } from '@/services/user-management-service';

interface UserDeleteDialogProps {
  open: boolean;
  user?: User;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function UserDeleteDialog({
  open,
  user,
  isDeleting,
  onClose,
  onConfirm,
}: UserDeleteDialogProps) {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 text-center space-y-4">
          <div className="bg-red-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>

          <h3 className="text-lg font-semibold text-white">Delete User?</h3>

          <p className="text-sm text-neutral-400">
            Are you sure you want to delete user{' '}
            <span className="text-white font-medium">{user.userName}</span> ({user.userCode})? This
            action cannot be undone immediately, though the user is soft-deleted.
          </p>
        </div>

        <div className="flex items-center justify-end px-6 py-4 bg-white/5 border-t border-white/10 gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Delete User
          </Button>
        </div>
      </div>
    </div>
  );
}

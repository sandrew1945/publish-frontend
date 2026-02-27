import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/button';

interface DeleteConfirmDialogProps {
    /** Controls whether the dialog is visible. */
    open: boolean;
    /** Dialog heading, e.g. "Delete User?" */
    title: string;
    /**
     * Descriptive message shown below the heading.
     * Accepts ReactNode so callers can embed highlighted names or warnings.
     */
    description: React.ReactNode;
    /** Shows a spinner and disables both buttons while the delete request is in-flight. */
    isDeleting: boolean;
    /** Label for the confirm button. Defaults to "Delete". */
    confirmLabel?: string;
    /** Called when the user clicks Cancel or when the overlay is dismissed. */
    onClose: () => void;
    /** Called when the user confirms the deletion. */
    onConfirm: () => void | Promise<void>;
}

/**
 * Shared delete confirmation dialog used across all management pages.
 * Keeps the destructive action pattern consistent throughout the app.
 */
export function DeleteConfirmDialog({
    open,
    title,
    description,
    isDeleting,
    confirmLabel = 'Delete',
    onClose,
    onConfirm,
}: DeleteConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-lg shadow-xl overflow-hidden">
                {/* Icon + title + description */}
                <div className="p-6 text-center space-y-4">
                    <div className="bg-red-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>

                    <h3 className="text-lg font-semibold text-white">{title}</h3>

                    <p className="text-sm text-neutral-400">{description}</p>
                </div>

                {/* Action buttons */}
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
                        {isDeleting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}

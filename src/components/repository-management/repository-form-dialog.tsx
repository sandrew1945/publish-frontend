'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Check } from 'lucide-react';
import { RepoDTO } from '@/types/backend-types';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { SystemStatus } from '@/config/fixcode';
import {
  useUserListForSelect,
  useValidateRepoName,
  repoFormSchema,
  RepoFormValues,
} from '@/hooks/use-repository';

interface RepositoryFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialData?: RepoDTO;
  onClose: () => void;
  onSubmit: (repo: RepoDTO) => Promise<void>;
}

export function RepositoryFormDialog({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: RepositoryFormDialogProps) {
  const form = useForm<RepoFormValues>({
    resolver: zodResolver(repoFormSchema),
    defaultValues: {
      repoName: '',
      repoDesc: '',
      status: SystemStatus.ACTIVE,
      collaboratorIds: [],
    },
  });

  // Collaborators UI state (not form validation concern)
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ─── React Query hooks ──────────────────────────────────────────────────
  const { data: users = [] } = useUserListForSelect();

  // NOTE: useValidateRepoName handles debouncing internally;
  // in edit mode, unchanged names are skipped automatically.
  const { data: isNameValid, isFetching: checkingName } = useValidateRepoName(
    form.watch('repoName') || '',
    mode,
    initialData?.repoName
  );

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Form Reset
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        form.reset({
          repoName: initialData.repoName ?? '',
          repoDesc: initialData.repoDesc ?? '',
          status: initialData.status ?? SystemStatus.ACTIVE,
          collaboratorIds: initialData.collaboratorIds ?? [],
        });
      } else {
        form.reset({
          repoName: '',
          repoDesc: '',
          status: SystemStatus.ACTIVE,
          collaboratorIds: [],
        });
      }
      setSearchTerm('');
    }
  }, [open, mode, initialData, form]);

  if (!open) return null;

  const handleFormSubmit = async (data: RepoFormValues) => {
    // Async uniqueness validation
    if (mode === 'create' && isNameValid === false) {
      form.setError('repoName', { message: 'Repository Name already exists' });
      return;
    }

    try {
      // NOTE: Spread initialData to preserve fields not in the form schema
      // (e.g. repoId, createBy, createDate) that the backend expects
      const repoPayload: RepoDTO = {
        ...(initialData ?? {}),
        repoName: data.repoName,
        repoDesc: data.repoDesc,
        status: data.status,
        collaboratorIds: data.collaboratorIds,
      };
      await onSubmit(repoPayload);
      onClose();
    } catch (error) {
      console.error('Failed to submit repository:', error);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  const toggleCollaborator = (userId: number) => {
    const current = form.getValues('collaboratorIds') ?? [];
    const updated = current.includes(userId)
      ? current.filter((id) => id !== userId)
      : [...current, userId];
    form.setValue('collaboratorIds', updated);
  };

  const removeCollaborator = (userId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = form.getValues('collaboratorIds') ?? [];
    form.setValue(
      'collaboratorIds',
      current.filter((id) => id !== userId)
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.userCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const watchedCollaboratorIds = form.watch('collaboratorIds') ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#1c2128] border border-white/10 rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            {mode === 'create' ? 'Create New Repository' : 'Edit Repository'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-white/5 disabled:opacity-50 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <form id="repo-form" onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Repository Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-200">
                Repository Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Input
                  {...form.register('repoName')}
                  className={`bg-[#22272e] border-white/10 text-white placeholder:text-neutral-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${form.formState.errors.repoName ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="e.g., backend-api-v2"
                />
                {checkingName && (
                  <div className="absolute right-3 top-2.5">
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                  </div>
                )}
              </div>
              <p className="text-xs text-neutral-400">
                Great repository names are short and memorable.
              </p>
              {form.formState.errors.repoName && (
                <p className="text-xs text-red-400">{form.formState.errors.repoName.message}</p>
              )}
              {mode === 'create' &&
                form.watch('repoName') &&
                isNameValid === false &&
                !form.formState.errors.repoName &&
                !checkingName && (
                  <p className="text-xs text-red-400">Repository Name already exists</p>
                )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-200">Description</label>
              <textarea
                {...form.register('repoDesc')}
                className="flex w-full rounded-md border border-white/10 bg-[#22272e] px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-y"
                placeholder="Enter a brief description of the project..."
              />
            </div>

            {/* Collaborators */}
            <div className="space-y-1.5 relative" ref={dropdownRef}>
              <label className="text-sm font-medium text-neutral-200">Collaborators</label>
              <div
                className={`min-h-[40px] w-full rounded-md border border-white/10 bg-[#22272e] px-2 py-1.5 flex flex-wrap gap-2 items-center cursor-text transition-colors ${isDropdownOpen ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}
                onClick={() => setIsDropdownOpen(true)}
              >
                {watchedCollaboratorIds.map((id) => {
                  const user = users.find((u) => u.userId === id);
                  if (!user) return null;

                  return (
                    <div
                      key={id}
                      className="flex items-center gap-1.5 bg-[#2d333b] border border-white/5 rounded-full pl-1.5 pr-1 py-0.5 text-xs text-neutral-200"
                    >
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[8px] font-bold text-white uppercase">
                        {getInitials(user.userName || user.userCode || '')}
                      </div>
                      <span className="truncate max-w-[100px] font-medium">{user.userName}</span>
                      <button
                        type="button"
                        onClick={(e) => removeCollaborator(id, e)}
                        className="p-0.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm text-white placeholder-neutral-500 py-0.5 px-1"
                  placeholder={watchedCollaboratorIds.length === 0 ? 'Search users...' : ''}
                />
              </div>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute top-[100%] left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-[#2d333b] border border-white/10 rounded-md shadow-2xl z-10 p-1 custom-scrollbar">
                  {filteredUsers.length === 0 ? (
                    <div className="py-3 px-3 text-sm text-neutral-400 text-center">
                      No users found
                    </div>
                  ) : (
                    filteredUsers.map((user) => {
                      if (!user.userId) return null;
                      const isSelected = watchedCollaboratorIds.includes(user.userId);

                      return (
                        <div
                          key={user.userId}
                          onClick={() => toggleCollaborator(user.userId!)}
                          className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-white/5 rounded-sm transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm">
                              {getInitials(user.userName || user.userCode || '')}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-white">
                                {user.userName}
                              </span>
                              <span className="text-xs text-neutral-400">{user.userCode}</span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Status Switch */}
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-neutral-200">Status</label>
              <div className="flex items-center gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    const currentStatus = form.getValues('status');
                    form.setValue(
                      'status',
                      currentStatus === SystemStatus.ACTIVE
                        ? SystemStatus.INACTIVE
                        : SystemStatus.ACTIVE
                    );
                  }}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1c2128] ${
                    form.watch('status') === SystemStatus.ACTIVE ? 'bg-blue-500' : 'bg-neutral-600'
                  }`}
                >
                  <span className="sr-only">Toggle status</span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      form.watch('status') === SystemStatus.ACTIVE
                        ? 'translate-x-4'
                        : 'translate-x-0'
                    }`}
                  />
                </button>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">
                    {form.watch('status') === SystemStatus.ACTIVE ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs text-neutral-400">
                    Inactive repositories are hidden from public view.
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-white/10 gap-3 bg-[#1c2128] rounded-b-lg">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={form.formState.isSubmitting}
            className="text-neutral-300 hover:text-white hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            form="repo-form"
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-lg shadow-blue-500/20 px-6"
            disabled={
              form.formState.isSubmitting ||
              (mode === 'create' && isNameValid === false) ||
              !form.watch('repoName')
            }
          >
            {form.formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {mode === 'create' ? 'Create Repository' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

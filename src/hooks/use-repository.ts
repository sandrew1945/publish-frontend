import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { repositoryService, RepositoryFilter, PageParams } from '@/services/repository-service';
import { userManagementService } from '@/services/user-management-service';
import { RepoDTO } from '@/types/backend-types';
import { USER_QUERY_KEYS } from '@/hooks/use-user-management';

// ─── Zod Schema ───────────────────────────────────────────────────────────────

export const repoFormSchema = z.object({
  repoName: z.string().min(1, 'Repository Name is required'),
  repoDesc: z.string().optional(),
  status: z.number(),
  collaboratorIds: z.array(z.number()).optional(),
});

export type RepoFormValues = z.infer<typeof repoFormSchema>;

// ─── Query Key Factory ────────────────────────────────────────────────────────

export const REPOSITORY_QUERY_KEYS = {
  all: ['repositories'] as const,
  lists: () => [...REPOSITORY_QUERY_KEYS.all, 'list'] as const,
  list: (filter: RepositoryFilter, pageParams: PageParams) =>
    [...REPOSITORY_QUERY_KEYS.lists(), { filter, pageParams }] as const,
  validation: (name: string) => [...REPOSITORY_QUERY_KEYS.all, 'validate', name] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Fetch paginated repository list with React Query caching.
 * Uses placeholderData to keep previous page data visible during page transitions.
 */
export function useRepositoryList(filter: RepositoryFilter, pageParams: PageParams) {
  return useQuery({
    queryKey: REPOSITORY_QUERY_KEYS.list(filter, pageParams),
    queryFn: () => repositoryService.getRepositories(filter, pageParams),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Fetch all active users for collaborator selection dropdowns.
 * Reuses the USER_QUERY_KEYS.userList key so it shares cache with any other
 * component that needs the full non-paginated user list.
 */
export function useUserListForSelect() {
  return useQuery({
    queryKey: USER_QUERY_KEYS.userList(),
    queryFn: () => userManagementService.getUserList(),
  });
}

/**
 * Debounced repository name validation query.
 * Skips validation when: name is too short, or in edit mode and name hasn't changed.
 * @param repoName - Current input value
 * @param mode - 'create' or 'edit'
 * @param originalName - The original name in edit mode (to skip unchanged validation)
 */
export function useValidateRepoName(
  repoName: string,
  mode: 'create' | 'edit',
  originalName?: string
) {
  const [debouncedName, setDebouncedName] = useState(repoName);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedName(repoName);
    }, 500);
    return () => clearTimeout(handler);
  }, [repoName]);

  // NOTE: Skip validation if name is unchanged during edit, or too short to be meaningful
  const isUnchangedInEditMode = mode === 'edit' && debouncedName === originalName;
  const isTooShort = !debouncedName || debouncedName.length < 3;

  return useQuery({
    queryKey: REPOSITORY_QUERY_KEYS.validation(debouncedName),
    queryFn: () => repositoryService.validateRepoName(debouncedName),
    enabled: !isTooShort && !isUnchangedInEditMode,
    retry: false,
    staleTime: 1000 * 60,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateRepository() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (repo: RepoDTO) => repositoryService.createRepository(repo),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REPOSITORY_QUERY_KEYS.lists(),
      });
    },
  });
}

export function useUpdateRepository() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (repo: RepoDTO) => repositoryService.updateRepository(repo),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REPOSITORY_QUERY_KEYS.lists(),
      });
    },
  });
}

export function useDeleteRepository() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (repoId: number) => repositoryService.deleteRepository(repoId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REPOSITORY_QUERY_KEYS.lists(),
      });
    },
  });
}

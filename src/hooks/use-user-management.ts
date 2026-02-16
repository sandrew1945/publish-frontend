import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  userManagementService,
  UserFilter,
  PageParams,
  User,
} from '@/services/user-management-service';

export const USER_QUERY_KEYS = {
  all: ['users'] as const,
  lists: () => [...USER_QUERY_KEYS.all, 'list'] as const,
  list: (filter: UserFilter, pageParams: PageParams) =>
    [...USER_QUERY_KEYS.lists(), { filter, pageParams }] as const,
  details: () => [...USER_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...USER_QUERY_KEYS.details(), id] as const,
  validation: (code: string) => [...USER_QUERY_KEYS.all, 'validate', code] as const,
};

export function useUserList(filter: UserFilter, pageParams: PageParams) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.list(filter, pageParams),
    queryFn: () => userManagementService.getUsers(filter, pageParams),
    placeholderData: (previousData) => previousData, // keepPreviousData logic in v5
  });
}

export function useUserDetail(userId: number) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(userId),
    queryFn: () => userManagementService.getUserById(userId),
    enabled: !!userId,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: User) => userManagementService.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: User) => userManagementService.updateUser(user),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      if (variables.userId) {
        queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.detail(variables.userId) });
      }
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => userManagementService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
    },
  });
}

export function useValidateUserCode(userCode: string) {
  const [debouncedCode, setDebouncedCode] = useState(userCode);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCode(userCode);
    }, 500);
    return () => clearTimeout(handler);
  }, [userCode]);

  return useQuery({
    queryKey: USER_QUERY_KEYS.validation(debouncedCode),
    queryFn: () => userManagementService.validateUserCode(debouncedCode),
    enabled: !!debouncedCode && debouncedCode.trim().length >= 3,
    retry: false,
    staleTime: 1000 * 60, // Cache validation result for 1 min
  });
}

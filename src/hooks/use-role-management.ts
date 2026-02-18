import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  roleManagementService,
  RoleFilter,
  PageParams,
  Role,
} from '@/services/role-management-service';

export const ROLE_QUERY_KEYS = {
  all: ['roles'] as const,
  lists: () => [...ROLE_QUERY_KEYS.all, 'list'] as const,
  list: (filter: RoleFilter, pageParams: PageParams) =>
    [...ROLE_QUERY_KEYS.lists(), { filter, pageParams }] as const,
  details: () => [...ROLE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...ROLE_QUERY_KEYS.details(), id] as const,
  validation: (code: string) => [...ROLE_QUERY_KEYS.all, 'validate', code] as const,
};

export function useRoleList(filter: RoleFilter, pageParams: PageParams) {
  return useQuery({
    queryKey: ROLE_QUERY_KEYS.list(filter, pageParams),
    queryFn: () => roleManagementService.getRoles(filter, pageParams),
    placeholderData: (previousData) => previousData,
  });
}

export function useRoleDetail(roleId: number) {
  return useQuery({
    queryKey: ROLE_QUERY_KEYS.detail(roleId),
    queryFn: () => roleManagementService.getRoleById(roleId),
    enabled: !!roleId,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (role: Role) => roleManagementService.createRole(role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.lists() });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (role: Role) => roleManagementService.updateRole(role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.lists() });
      if (variables.roleId) {
        queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.detail(variables.roleId) });
      }
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roleId: number) => roleManagementService.deleteRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.lists() });
    },
  });
}

export function useValidateRoleCode(roleCode: string) {
  const [debouncedCode, setDebouncedCode] = useState(roleCode);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCode(roleCode);
    }, 500);
    return () => clearTimeout(handler);
  }, [roleCode]);

  return useQuery({
    queryKey: ROLE_QUERY_KEYS.validation(debouncedCode),
    queryFn: () => roleManagementService.validateRoleCode(debouncedCode),
    enabled: !!debouncedCode && debouncedCode.trim().length >= 3,
    retry: false,
    staleTime: 1000 * 60, // Cache validation result for 1 min
  });
}

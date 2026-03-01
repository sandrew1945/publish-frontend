import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService } from '@/services/menu-service';
import { TreeNode } from '@/types/backend-types';
import { z } from 'zod';

// NOTE: No .default() — Zod v4 default causes input/output type divergence
// which breaks @hookform/resolvers type inference. Defaults are set in useForm.
export const menuFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  path: z.string().min(1, 'Path is required'),
  icon: z.string().optional(),
  funcOrder: z.number().min(0),
  parentId: z.number().nullable(), // null for root
});

export type MenuFormValues = z.infer<typeof menuFormSchema>;

export const useMenuTree = () => {
  return useQuery({
    queryKey: ['menu-tree'],
    queryFn: menuService.getMenuTree,
  });
};

export const useUserMenu = (roleId?: number) => {
  return useQuery({
    queryKey: ['menu-user', roleId],
    queryFn: () => (roleId ? menuService.getMenuByRole(roleId) : Promise.resolve([])),
    enabled: !!roleId,
  });
};

export const useCreateMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { menu: TreeNode; parentId: number }) =>
      menuService.createMenu(data.menu, data.parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-tree'] });
      queryClient.invalidateQueries({ queryKey: ['menu-user'] });
    },
  });
};

export const useUpdateMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (menu: TreeNode) => menuService.updateMenu(menu),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-tree'] });
      queryClient.invalidateQueries({ queryKey: ['menu-user'] });
    },
  });
};

export const useDeleteMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (functionId: number) => menuService.deleteMenu(functionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-tree'] });
      queryClient.invalidateQueries({ queryKey: ['menu-user'] });
    },
  });
};

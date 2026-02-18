import { backendApi } from '@/lib/api-client';
import { TreeNode } from '@/types/backend-types';

export const menuService = {
  /**
   * Fetch the full menu tree (Admin/Management)
   */
  async getMenuTree(): Promise<TreeNode[]> {
    const response = await backendApi.menumanager.getMenuTree();
    return (response.data.data as unknown as TreeNode[]) || [];
  },

  /**
   * Fetch menu by role ID (for Sidebar navigation)
   */
  async getMenuByRole(roleId: number): Promise<TreeNode[]> {
    const response = await backendApi.getMenuByRole.getMenuByRole({ roleId });
    return (response.data.data as unknown as TreeNode[]) || [];
  },

  /**
   * Create a new menu item
   */
  async createMenu(menu: TreeNode, parentId: number): Promise<void> {
    await backendApi.menumanager.createMenu({
      treeNode: menu,
      fatherId: parentId,
    });
  },

  /**
   * Update an existing menu item
   */
  async updateMenu(menu: TreeNode): Promise<void> {
    await backendApi.menumanager.updateMenu({ treeNode: menu });
  },

  /**
   * Delete a menu item
   */
  async deleteMenu(functionId: number): Promise<void> {
    await backendApi.menumanager.deleteMenu({ functionId });
  },
};

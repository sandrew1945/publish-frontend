import { backendApi } from '@/lib/api-client';
import { TmRolePO } from '@/lib/api';

export type Role = TmRolePO;

export interface RoleFilter {
  roleCode?: string;
  roleName?: string;
  roleStatus?: number;
}

export interface PageParams {
  page: number;
  pageSize: number;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export const roleManagementService = {
  /**
   * Fetch paginated list of roles
   */
  async getRoles(filter: RoleFilter, pageParams: PageParams): Promise<PageResult<Role>> {
    const response = await backendApi.rolemanager.userManagerPageQuery1({
      ...filter,
      curPage: pageParams.page,
      limit: pageParams.pageSize,
    });

    return response.data.data as unknown as PageResult<Role>;
  },

  /**
   * Get role detail by ID
   */
  async getRoleById(roleId: number): Promise<Role> {
    const response = await backendApi.rolemanager.getRoleInfoById({ roleId });
    return response.data.data as unknown as Role;
  },

  /**
   * Create a new role
   */
  async createRole(role: Role): Promise<void> {
    await backendApi.rolemanager.createRole(role);
  },

  /**
   * Update an existing role
   */
  async updateRole(role: Role): Promise<void> {
    const { roleId, roleName, roleStatus, roleType } = role;
    if (roleId === undefined) {
      throw new Error('Role ID is required for update');
    }
    await backendApi.rolemanager.updateRole({
      roleId,
      roleName,
      roleStatus,
      roleType,
    });
  },

  /**
   * Delete a role (logic delete)
   */
  async deleteRole(roleId: number): Promise<void> {
    if (roleId === undefined || roleId === null) {
      throw new Error('Role ID is required for deletion');
    }
    await backendApi.rolemanager.deleteRole({ roleId });
  },

  /**
   * Validate role code uniqueness
   */
  async validateRoleCode(roleCode: string): Promise<boolean> {
    const response = await backendApi.rolemanager.roleValidate({ roleCode });
    // Assuming true means valid (does not exist) based on user-management pattern
    return response.data.result === true;
  },
};

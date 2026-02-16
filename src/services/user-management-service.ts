import { backendApi } from '@/lib/api-client';
import { UserManagerDTO, JsonResult } from '@/lib/api';

export type User = UserManagerDTO;

export interface UserFilter {
  userCode?: string;
  userName?: string;
  userStatus?: number;
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

export const userManagementService = {
  /**
   * Fetch paginated list of users
   */
  async getUsers(filter: UserFilter, pageParams: PageParams): Promise<PageResult<User>> {
    const response = await backendApi.usermanager.userManagerPageQuery({
      ...filter,
      curPage: pageParams.page,
      limit: pageParams.pageSize,
    });

    // Cast the untyped data object to PageResult
    // If the API returns a different structure, we'll need to adjust this
    return response.data.data as unknown as PageResult<User>;
  },

  /**
   * Get user detail by ID
   */
  async getUserById(userId: number): Promise<User> {
    const response = await backendApi.usermanager.getUserInfoById({ userId });
    return response.data.data as unknown as User;
  },

  /**
   * Create a new user (using JSON body endpoint)
   */
  async createUser(user: User): Promise<void> {
    await backendApi.usermanager.createUserInfoForJsonBody(user);
  },

  /**
   * Update an existing user
   */
  async updateUser(user: User): Promise<void> {
    // The Update API uses a query parameter object which the client stringifies
    await backendApi.usermanager.updateUserInfo(user);
  },

  /**
   * Delete a user (soft delete)
   */
  async deleteUser(userId: number): Promise<void> {
    await backendApi.usermanager.deleteUserInfo({ userId });
  },

  /**
   * Validate user code uniqueness
   */
  async validateUserCode(userCode: string): Promise<boolean> {
    const response = await backendApi.usermanager.userValidate({ userCode });
    // result: true means valid (does not exist), result: false means invalid (exists)
    // Or maybe result: true means success?
    // Usually validate endpoints return true if valid (available).
    // Let's assume response.data.result indicates validity.
    return response.data.result === true;
  },
};

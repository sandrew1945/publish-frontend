/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import { HttpClient, ApiConfig } from './http-client';
import { UserManagerApi } from '@/api/user';
import { RoleManagerApi } from '@/api/role';
import { MenuManagerApi } from '@/api/menu';
import { AuthApi } from '@/api/auth';
import { Repository } from '@/api/repository';

// Re-export types for backward compatibility
export * from '@/types/backend-types';
export * from './http-client';

/**
 * @title Vibe Publish API
 * @version 1.0
 * @baseUrl http://localhost:8080
 *
 * Backend API documentation for the Vibe Publish system. Use the Authorize button to set your Shiro session token (sid) for authenticated requests.
 */
export class Api<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  public usermanager: UserManagerApi<SecurityDataType>;
  public rolemanager: RoleManagerApi<SecurityDataType>;
  public menumanager: MenuManagerApi<SecurityDataType>;
  public repository: Repository<SecurityDataType>;

  // Auth endpoints (grouped as in original file)
  public setCurrentlyRole: { setCurrentlyRole: AuthApi<SecurityDataType>['setCurrentlyRole'] };
  public logout: { logout: AuthApi<SecurityDataType>['logout'] };
  public login: { login: AuthApi<SecurityDataType>['login'] };
  public validateToken: { validateToken: AuthApi<SecurityDataType>['validateToken'] };
  public userInfo: { userInfo: AuthApi<SecurityDataType>['userInfo'] };
  public security: { getLoginUserInfo: AuthApi<SecurityDataType>['getLoginUserInfo'] };
  public getMenuByRole: { getMenuByRole: AuthApi<SecurityDataType>['getMenuByRole'] };

  private auth: AuthApi<SecurityDataType>;

  constructor(config?: ApiConfig<SecurityDataType>) {
    super(config);

    // Initialize domain modules with this HttpClient instance
    this.usermanager = new UserManagerApi(this);
    this.rolemanager = new RoleManagerApi(this);
    this.menumanager = new MenuManagerApi(this);
    this.repository = new Repository(this);
    this.auth = new AuthApi(this);

    // Map auth endpoints to match original structure
    this.setCurrentlyRole = { setCurrentlyRole: this.auth.setCurrentlyRole };
    this.logout = { logout: this.auth.logout };
    this.login = { login: this.auth.login };
    this.validateToken = { validateToken: this.auth.validateToken };
    this.userInfo = { userInfo: this.auth.userInfo };
    this.security = { getLoginUserInfo: this.auth.getLoginUserInfo };
    this.getMenuByRole = { getMenuByRole: this.auth.getMenuByRole };
  }
}

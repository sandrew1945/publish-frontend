/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import { HttpClient, RequestParams } from '@/lib/http-client';
import { JsonResult, JsonResultRoleBean, AclUserBean } from '@/types/backend-types';

export class AuthApi<SecurityDataType = unknown> {
    http: HttpClient<SecurityDataType>;

    constructor(http: HttpClient<SecurityDataType>) {
        this.http = http;
    }

    /**
     * @description Switch the user's currently active role in the session
     *
     * @tags Login
     * @name SetCurrentlyRole
     * @summary Set active role
     * @request POST:/setCurrentlyRole
     * @secure
     */
    setCurrentlyRole = (
        query: {
            /** @format int32 */
            roleId: number;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResultRoleBean, any>({
            path: `/setCurrentlyRole`,
            method: 'POST',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Invalidate the current Shiro session and log the user out
     *
     * @tags Login
     * @name Logout
     * @summary Logout
     * @request POST:/logout
     * @secure
     */
    logout = (params: RequestParams = {}) =>
        this.http.request<JsonResult, any>({
            path: `/logout`,
            method: 'POST',
            secure: true,
            ...params,
        });

    /**
     * @description Authenticate with username and password, returns session token
     *
     * @tags Login
     * @name Login
     * @summary User login
     * @request POST:/login
     * @secure
     */
    login = (
        query: {
            userCode: string;
            password: string;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/login`,
            method: 'POST',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Check whether a Shiro session token is still valid
     *
     * @tags Login
     * @name ValidateToken
     * @summary Validate session token
     * @request GET:/validateToken
     * @secure
     */
    validateToken = (
        query: {
            token: string;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/validateToken`,
            method: 'GET',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Retrieve the currently logged-in user's profile and role list
     *
     * @tags Login
     * @name UserInfo
     * @summary Get current user info
     * @request GET:/userInfo
     * @secure
     */
    userInfo = (params: RequestParams = {}) =>
        this.http.request<JsonResult, any>({
            path: `/userInfo`,
            method: 'GET',
            secure: true,
            ...params,
        });

    /**
     * @description Retrieve the currently authenticated user's information from the session
     *
     * @tags Security
     * @name GetLoginUserInfo
     * @summary Get login user
     * @request GET:/security/getLoginUser
     * @secure
     */
    getLoginUserInfo = (params: RequestParams = {}) =>
        this.http.request<AclUserBean, any>({
            path: `/security/getLoginUser`,
            method: 'GET',
            secure: true,
            ...params,
        });

    /**
     * @description Retrieve the menu tree for the specified role
     *
     * @tags Login
     * @name GetMenuByRole
     * @summary Get menus by role
     * @request GET:/getMenuByRole
     * @secure
     */
    getMenuByRole = (
        query: {
            /** @format int32 */
            roleId: number;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/getMenuByRole`,
            method: 'GET',
            query: query,
            secure: true,
            ...params,
        });
}

/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import { HttpClient, RequestParams, ContentType } from '@/lib/http-client';
import {
    JsonResult,
    UserManagerDTO,
    JsonResultListUserInfoVO,
} from '@/types/backend-types';

export class UserManagerApi<SecurityDataType = unknown> {
    http: HttpClient<SecurityDataType>;

    constructor(http: HttpClient<SecurityDataType>) {
        this.http = http;
    }

    /**
     * @description Query users with optional filters for code, name, and status
     *
     * @tags User Management
     * @name UserManagerPageQuery
     * @summary Paginated user query
     * @request POST:/usermanager/userManagerPageQuery
     * @secure
     */
    userManagerPageQuery = (
        query: {
            userCode?: string;
            userName?: string;
            /** @format int32 */
            userStatus?: number;
            /** @format int32 */
            limit: number;
            /** @format int32 */
            curPage: number;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/usermanager/userManagerPageQuery`,
            method: 'POST',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Update an existing user's information
     *
     * @tags User Management
     * @name UpdateUserInfo
     * @summary Update user
     * @request POST:/usermanager/updateUserInfo
     * @secure
     */
    updateUserInfo = (
        query: UserManagerDTO,
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/usermanager/updateUserInfo`,
            method: 'POST',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Change a user's password after verifying the original password
     *
     * @tags User Management
     * @name UpdatePassword
     * @summary Update password
     * @request POST:/usermanager/updatePassword
     * @secure
     */
    updatePassword = (
        query: {
            /** @format int32 */
            userId: number;
            originPwd: string;
            newPwd: string;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/usermanager/updatePassword`,
            method: 'POST',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Get roles not yet assigned to a user, with optional name filter
     *
     * @tags User Management
     * @name QueryUnRelationRoles
     * @summary Query unassigned roles
     * @request POST:/usermanager/queryUnRelationRoles
     * @secure
     */
    queryUnRelationRoles = (
        query: {
            /** @format int32 */
            userId: number;
            roleName: string;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/usermanager/queryUnRelationRoles`,
            method: 'POST',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Soft-delete a user by user ID via form parameter
     *
     * @tags User Management
     * @name DeleteUserInfo
     * @summary Delete user (form)
     * @request POST:/usermanager/deleteUserInfo
     * @secure
     */
    deleteUserInfo = (
        query: {
            /** @format int32 */
            userId: number;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/usermanager/deleteUserInfo`,
            method: 'POST',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Remove a role from a user
     *
     * @tags User Management
     * @name DeleteRoleRelation
     * @summary Remove role assignment
     * @request POST:/usermanager/deleteRoleRelation
     * @secure
     */
    deleteRoleRelation = (
        query: {
            /** @format int32 */
            userId: number;
            /** @format int32 */
            roleId: number;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/usermanager/deleteRoleRelation`,
            method: 'POST',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Create a new user using form-encoded parameters
     *
     * @tags User Management
     * @name CreateUserInfo
     * @summary Create user (form)
     * @request POST:/usermanager/createUserInfo
     * @secure
     */
    createUserInfo = (
        query: {
            user: UserManagerDTO;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/usermanager/createUserInfo`,
            method: 'POST',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Create a new user using a JSON request body
     *
     * @tags User Management
     * @name CreateUserInfoForJsonBody
     * @summary Create user (JSON)
     * @request POST:/usermanager/createUserInfoForJsonBody
     * @secure
     */
    createUserInfoForJsonBody = (data: UserManagerDTO, params: RequestParams = {}) =>
        this.http.request<JsonResult, any>({
            path: `/usermanager/createUserInfoForJsonBody`,
            method: 'POST',
            body: data,
            secure: true,
            type: ContentType.Json,
            ...params,
        });

    /**
     * @description Assign one or more roles to a user by comma-separated role IDs
     *
     * @tags User Management
     * @name CreateRelation
     * @summary Assign roles to user
     * @request POST:/usermanager/createRelation
     * @secure
     */
    createRelation = (
        query: {
            /** @format int32 */
            userId: number;
            rolesStr: string;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<void, any>({
            path: `/usermanager/createRelation`,
            method: 'POST',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Check whether a user code already exists
     *
     * @tags User Management
     * @name UserValidate
     * @summary Validate user code
     * @request GET:/usermanager/userValidate
     * @secure
     */
    userValidate = (
        query: {
            userCode: string;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/usermanager/userValidate`,
            method: 'GET',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Get the list of roles assigned to a user
     *
     * @tags User Management
     * @name QueryRelationRoles
     * @summary Query assigned roles
     * @request GET:/usermanager/queryRelationRoles
     * @secure
     */
    queryRelationRoles = (
        query: {
            /** @format int32 */
            userId: number;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/usermanager/queryRelationRoles`,
            method: 'GET',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description List all active (available) users
     *
     * @tags User Management
     * @name GetUserList
     * @summary Get all users
     * @request GET:/usermanager/getUserList
     * @secure
     */
    getUserList = (params: RequestParams = {}) =>
        this.http.request<JsonResult, any>({
            path: `/usermanager/getUserList`,
            method: 'GET',
            secure: true,
            ...params,
        });

    /**
     * @description Retrieve users filtered by role type
     *
     * @tags User Management
     * @name GetUserListByRoleType
     * @summary Get users by role type
     * @request GET:/usermanager/getUserListByRoleType
     * @secure
     */
    getUserListByRoleType = (
        query?: {
            /** @format int32 */
            roleType?: number;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResultListUserInfoVO, any>({
            path: `/usermanager/getUserListByRoleType`,
            method: 'GET',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Retrieve detailed user information by user ID
     *
     * @tags User Management
     * @name GetUserInfoById
     * @summary Get user by ID
     * @request GET:/usermanager/getUserInfoById
     * @secure
     */
    getUserInfoById = (
        query: {
            /** @format int32 */
            userId: number;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/usermanager/getUserInfoById`,
            method: 'GET',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Soft-delete a user by user ID via path variable
     *
     * @tags User Management
     * @name DeleteUserInfoByPathVariable
     * @summary Delete user (REST)
     * @request DELETE:/usermanager/deleteUserInfo/{userId}
     * @secure
     */
    deleteUserInfoByPathVariable = (userId: number, params: RequestParams = {}) =>
        this.http.request<JsonResult, any>({
            path: `/usermanager/deleteUserInfo/${userId}`,
            method: 'DELETE',
            secure: true,
            ...params,
        });
}

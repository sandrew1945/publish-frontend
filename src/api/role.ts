/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import { HttpClient, RequestParams, ContentType } from '@/lib/http-client';
import {
    JsonResult,
    JsonResultRoleBean,
    TmRolePO,
    FunctionsParam,
} from '@/types/backend-types';

export class RoleManagerApi<SecurityDataType = unknown> {
    http: HttpClient<SecurityDataType>;

    constructor(http: HttpClient<SecurityDataType>) {
        this.http = http;
    }

    /**
     * @description Update an existing role's information
     *
     * @tags Role Management
     * @name UpdateRole
     * @summary Update role
     * @request POST:/rolemanager/updateRole
     * @secure
     */
    updateRole = (
        query: {
            role: TmRolePO;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/rolemanager/updateRole`,
            method: 'POST',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Save the permission (function) assignments for a role
     *
     * @tags Role Management
     * @name SaveSelectedFunc
     * @summary Save role permissions
     * @request POST:/rolemanager/saveSelectedFunc
     * @secure
     */
    saveSelectedFunc = (data: FunctionsParam, params: RequestParams = {}) =>
        this.http.request<JsonResult, any>({
            path: `/rolemanager/saveSelectedFunc`,
            method: 'POST',
            body: data,
            secure: true,
            type: ContentType.Json,
            ...params,
        });

    /**
     * @description Query roles with optional filters for code, name, and status
     *
     * @tags Role Management
     * @name UserManagerPageQuery1
     * @summary Paginated role query
     * @request POST:/rolemanager/roleManagerPageQuery
     * @secure
     */
    userManagerPageQuery1 = (
        query: {
            roleCode?: string;
            roleName?: string;
            /** @format int32 */
            roleStatus?: number;
            /** @format int32 */
            limit: number;
            /** @format int32 */
            curPage: number;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/rolemanager/roleManagerPageQuery`,
            method: 'POST',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Delete a role if it is not assigned to any user
     *
     * @tags Role Management
     * @name DeleteRole
     * @summary Delete role
     * @request POST:/rolemanager/deleteRole
     * @secure
     */
    deleteRole = (
        query: {
            /** @format int32 */
            roleId: number;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/rolemanager/deleteRole`,
            method: 'POST',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Create a new role
     *
     * @tags Role Management
     * @name CreateRole
     * @summary Create role
     * @request POST:/rolemanager/createRole
     * @secure
     */
    createRole = (
        query: {
            user: TmRolePO;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/rolemanager/createRole`,
            method: 'POST',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Check whether a role code already exists
     *
     * @tags Role Management
     * @name RoleValidate
     * @summary Validate role code
     * @request GET:/rolemanager/roleValidate
     * @secure
     */
    roleValidate = (
        query: {
            roleCode: string;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/rolemanager/roleValidate`,
            method: 'GET',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Retrieve role details by role ID
     *
     * @tags Role Management
     * @name GetRoleInfoById
     * @summary Get role by ID
     * @request GET:/rolemanager/getRoleInfoById
     * @secure
     */
    getRoleInfoById = (
        query: {
            /** @format int32 */
            roleId: number;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/rolemanager/getRoleInfoById`,
            method: 'GET',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Retrieve the list of permissions already assigned to a role
     *
     * @tags Role Management
     * @name GetCheckedPremission
     * @summary Get checked permissions
     * @request GET:/rolemanager/getCheckedPremission
     * @secure
     */
    getCheckedPremission = (
        query: {
            /** @format int32 */
            roleId: number;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/rolemanager/getCheckedPremission`,
            method: 'GET',
            query: query,
            secure: true,
            ...params,
        });
}

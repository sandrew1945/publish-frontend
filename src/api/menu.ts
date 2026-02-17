/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import { HttpClient, RequestParams } from '@/lib/http-client';
import { JsonResult, TreeNode } from '@/types/backend-types';

export class MenuManagerApi<SecurityDataType = unknown> {
    http: HttpClient<SecurityDataType>;

    constructor(http: HttpClient<SecurityDataType>) {
        this.http = http;
    }

    /**
     * @description Update an existing menu item
     *
     * @tags Menu Management
     * @name UpdateMenu
     * @summary Update menu
     * @request POST:/menumanager/updateMenu
     * @secure
     */
    updateMenu = (
        query: {
            treeNode: TreeNode;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/menumanager/updateMenu`,
            method: 'POST',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Delete a menu item by its function ID
     *
     * @tags Menu Management
     * @name DeleteMenu
     * @summary Delete menu
     * @request POST:/menumanager/deleteMenu
     * @secure
     */
    deleteMenu = (
        query: {
            /** @format int32 */
            functionId: number;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/menumanager/deleteMenu`,
            method: 'POST',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Create a new menu item under the specified parent
     *
     * @tags Menu Management
     * @name CreateMenu
     * @summary Create menu
     * @request POST:/menumanager/createMenu
     * @secure
     */
    createMenu = (
        query: {
            treeNode: TreeNode;
            /** @format int32 */
            fatherId: number;
        },
        params: RequestParams = {}
    ) =>
        this.http.request<JsonResult, any>({
            path: `/menumanager/createMenu`,
            method: 'POST',
            query: query,
            secure: true,
            ...params,
        });

    /**
     * @description Retrieve the full hierarchical menu tree
     *
     * @tags Menu Management
     * @name GetMenuTree
     * @summary Get menu tree
     * @request GET:/menumanager/getMenuTree
     * @secure
     */
    getMenuTree = (params: RequestParams = {}) =>
        this.http.request<JsonResult, any>({
            path: `/menumanager/getMenuTree`,
            method: 'GET',
            secure: true,
            ...params,
        });
}

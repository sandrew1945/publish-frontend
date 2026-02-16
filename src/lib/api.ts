/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface JsonResult {
  result?: boolean;
  msg?: string;
  data?: object;
}

export interface UserManagerDTO {
  /** @format int32 */
  userId?: number;
  userCode?: string;
  userName?: string;
  password?: string;
  /** @format int32 */
  sex?: number;
  phone?: string;
  mobile?: string;
  email?: string;
  /** @format date */
  birthday?: string;
  avatar?: string;
  /** @format int32 */
  userType?: number;
  /** @format int32 */
  userStatus?: number;
  emailToken?: string;
}

export interface JsonResultRoleBean {
  result?: boolean;
  msg?: string;
  data?: object;
}

export interface TmRolePO {
  /** @format int32 */
  roleId?: number;
  roleCode?: string;
  roleName?: string;
  /** @format int32 */
  roleType?: number;
  /** @format int32 */
  roleStatus?: number;
  /** @format int32 */
  isDelete?: number;
  /** @format int32 */
  createBy?: number;
  /** @format date-time */
  createDate?: string;
  /** @format int32 */
  updateBy?: number;
  /** @format date-time */
  updateDate?: string;
}

export interface FunctionsParam {
  /** @format int32 */
  roleId?: number;
  functionIds?: number[];
}

export interface TreeNode {
  /** @format int32 */
  functionId?: number;
  path?: string;
  name?: string;
  icon?: string;
  /** @format int32 */
  funcOrder?: number;
  children?: TreeNode[];
}

export interface JsonResultListUserInfoVO {
  result?: boolean;
  msg?: string;
  data?: object;
}

export interface AclUserBean {
  /** @format int32 */
  userId?: number;
  userCode?: string;
  userName?: string;
  locale?: {
    script?: string;
    country?: string;
    variant?: string;
    /** @uniqueItems true */
    unicodeLocaleAttributes?: string[];
    /** @uniqueItems true */
    unicodeLocaleKeys?: string[];
    displayLanguage?: string;
    displayScript?: string;
    displayCountry?: string;
    displayVariant?: string;
    displayName?: string;
    /** @uniqueItems true */
    extensionKeys?: string[];
    iso3Language?: string;
    iso3Country?: string;
    language?: string;
  };
  roleList?: object[];
  /** @format int32 */
  roleId?: number;
  roleName?: string;
  roleCode?: string;
  /** @format int32 */
  roleType?: number;
  /** @format int32 */
  companyId?: number;
  /** @format int32 */
  sex?: number;
  /** @format int32 */
  userType?: number;
  phone?: string;
  mobile?: string;
  email?: string;
  avatarPath?: string;
  userStatus?: string;
  token?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from 'axios';
import axios from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<
  AxiosRequestConfig,
  'data' | 'params' | 'url' | 'responseType'
> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<
  AxiosRequestConfig,
  'data' | 'cancelToken'
> {
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = 'application/json',
  JsonApi = 'application/vnd.api+json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || 'http://localhost:8080',
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { 'Content-Type': type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Vibe Publish API
 * @version 1.0
 * @baseUrl http://localhost:8080
 *
 * Backend API documentation for the Vibe Publish system. Use the Authorize button to set your Shiro session token (sid) for authenticated requests.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  usermanager = {
    /**
     * @description Query users with optional filters for code, name, and status
     *
     * @tags User Management
     * @name UserManagerPageQuery
     * @summary Paginated user query
     * @request POST:/usermanager/userManagerPageQuery
     * @secure
     */
    userManagerPageQuery: (
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
      this.request<JsonResult, any>({
        path: `/usermanager/userManagerPageQuery`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Update an existing user's information
     *
     * @tags User Management
     * @name UpdateUserInfo
     * @summary Update user
     * @request POST:/usermanager/updateUserInfo
     * @secure
     */
    updateUserInfo: (
      query: {
        user: UserManagerDTO;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResult, any>({
        path: `/usermanager/updateUserInfo`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Change a user's password after verifying the original password
     *
     * @tags User Management
     * @name UpdatePassword
     * @summary Update password
     * @request POST:/usermanager/updatePassword
     * @secure
     */
    updatePassword: (
      query: {
        /** @format int32 */
        userId: number;
        originPwd: string;
        newPwd: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResult, any>({
        path: `/usermanager/updatePassword`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Get roles not yet assigned to a user, with optional name filter
     *
     * @tags User Management
     * @name QueryUnRelationRoles
     * @summary Query unassigned roles
     * @request POST:/usermanager/queryUnRelationRoles
     * @secure
     */
    queryUnRelationRoles: (
      query: {
        /** @format int32 */
        userId: number;
        roleName: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResult, any>({
        path: `/usermanager/queryUnRelationRoles`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Soft-delete a user by user ID via form parameter
     *
     * @tags User Management
     * @name DeleteUserInfo
     * @summary Delete user (form)
     * @request POST:/usermanager/deleteUserInfo
     * @secure
     */
    deleteUserInfo: (
      query: {
        /** @format int32 */
        userId: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResult, any>({
        path: `/usermanager/deleteUserInfo`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Remove a role from a user
     *
     * @tags User Management
     * @name DeleteRoleRelation
     * @summary Remove role assignment
     * @request POST:/usermanager/deleteRoleRelation
     * @secure
     */
    deleteRoleRelation: (
      query: {
        /** @format int32 */
        userId: number;
        /** @format int32 */
        roleId: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResult, any>({
        path: `/usermanager/deleteRoleRelation`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Create a new user using form-encoded parameters
     *
     * @tags User Management
     * @name CreateUserInfo
     * @summary Create user (form)
     * @request POST:/usermanager/createUserInfo
     * @secure
     */
    createUserInfo: (
      query: {
        user: UserManagerDTO;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResult, any>({
        path: `/usermanager/createUserInfo`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Create a new user using a JSON request body
     *
     * @tags User Management
     * @name CreateUserInfoForJsonBody
     * @summary Create user (JSON)
     * @request POST:/usermanager/createUserInfoForJsonBody
     * @secure
     */
    createUserInfoForJsonBody: (data: UserManagerDTO, params: RequestParams = {}) =>
      this.request<JsonResult, any>({
        path: `/usermanager/createUserInfoForJsonBody`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Assign one or more roles to a user by comma-separated role IDs
     *
     * @tags User Management
     * @name CreateRelation
     * @summary Assign roles to user
     * @request POST:/usermanager/createRelation
     * @secure
     */
    createRelation: (
      query: {
        /** @format int32 */
        userId: number;
        rolesStr: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/usermanager/createRelation`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Check whether a user code already exists
     *
     * @tags User Management
     * @name UserValidate
     * @summary Validate user code
     * @request GET:/usermanager/userValidate
     * @secure
     */
    userValidate: (
      query: {
        userCode: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResult, any>({
        path: `/usermanager/userValidate`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Get the list of roles assigned to a user
     *
     * @tags User Management
     * @name QueryRelationRoles
     * @summary Query assigned roles
     * @request GET:/usermanager/queryRelationRoles
     * @secure
     */
    queryRelationRoles: (
      query: {
        /** @format int32 */
        userId: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResult, any>({
        path: `/usermanager/queryRelationRoles`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description List all active (available) users
     *
     * @tags User Management
     * @name GetUserList
     * @summary Get all users
     * @request GET:/usermanager/getUserList
     * @secure
     */
    getUserList: (params: RequestParams = {}) =>
      this.request<JsonResult, any>({
        path: `/usermanager/getUserList`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description Retrieve users filtered by role type
     *
     * @tags User Management
     * @name GetUserListByRoleType
     * @summary Get users by role type
     * @request GET:/usermanager/getUserListByRoleType
     * @secure
     */
    getUserListByRoleType: (
      query?: {
        /** @format int32 */
        roleType?: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResultListUserInfoVO, any>({
        path: `/usermanager/getUserListByRoleType`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Retrieve detailed user information by user ID
     *
     * @tags User Management
     * @name GetUserInfoById
     * @summary Get user by ID
     * @request GET:/usermanager/getUserInfoById
     * @secure
     */
    getUserInfoById: (
      query: {
        /** @format int32 */
        userId: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResult, any>({
        path: `/usermanager/getUserInfoById`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Soft-delete a user by user ID via path variable
     *
     * @tags User Management
     * @name DeleteUserInfoByPathVariable
     * @summary Delete user (REST)
     * @request DELETE:/usermanager/deleteUserInfo/{userId}
     * @secure
     */
    deleteUserInfoByPathVariable: (userId: number, params: RequestParams = {}) =>
      this.request<JsonResult, any>({
        path: `/usermanager/deleteUserInfo/${userId}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),
  };
  setCurrentlyRole = {
    /**
     * @description Switch the user's currently active role in the session
     *
     * @tags Login
     * @name SetCurrentlyRole
     * @summary Set active role
     * @request POST:/setCurrentlyRole
     * @secure
     */
    setCurrentlyRole: (
      query: {
        /** @format int32 */
        roleId: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResultRoleBean, any>({
        path: `/setCurrentlyRole`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),
  };
  rolemanager = {
    /**
     * @description Update an existing role's information
     *
     * @tags Role Management
     * @name UpdateRole
     * @summary Update role
     * @request POST:/rolemanager/updateRole
     * @secure
     */
    updateRole: (
      query: {
        role: TmRolePO;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResult, any>({
        path: `/rolemanager/updateRole`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Save the permission (function) assignments for a role
     *
     * @tags Role Management
     * @name SaveSelectedFunc
     * @summary Save role permissions
     * @request POST:/rolemanager/saveSelectedFunc
     * @secure
     */
    saveSelectedFunc: (data: FunctionsParam, params: RequestParams = {}) =>
      this.request<JsonResult, any>({
        path: `/rolemanager/saveSelectedFunc`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Query roles with optional filters for code, name, and status
     *
     * @tags Role Management
     * @name UserManagerPageQuery1
     * @summary Paginated role query
     * @request POST:/rolemanager/roleManagerPageQuery
     * @secure
     */
    userManagerPageQuery1: (
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
      this.request<JsonResult, any>({
        path: `/rolemanager/roleManagerPageQuery`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Delete a role if it is not assigned to any user
     *
     * @tags Role Management
     * @name DeleteRole
     * @summary Delete role
     * @request POST:/rolemanager/deleteRole
     * @secure
     */
    deleteRole: (
      query: {
        /** @format int32 */
        roleId: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResult, any>({
        path: `/rolemanager/deleteRole`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Create a new role
     *
     * @tags Role Management
     * @name CreateRole
     * @summary Create role
     * @request POST:/rolemanager/createRole
     * @secure
     */
    createRole: (
      query: {
        user: TmRolePO;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResult, any>({
        path: `/rolemanager/createRole`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Check whether a role code already exists
     *
     * @tags Role Management
     * @name RoleValidate
     * @summary Validate role code
     * @request GET:/rolemanager/roleValidate
     * @secure
     */
    roleValidate: (
      query: {
        roleCode: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResult, any>({
        path: `/rolemanager/roleValidate`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Retrieve role details by role ID
     *
     * @tags Role Management
     * @name GetRoleInfoById
     * @summary Get role by ID
     * @request GET:/rolemanager/getRoleInfoById
     * @secure
     */
    getRoleInfoById: (
      query: {
        /** @format int32 */
        roleId: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResult, any>({
        path: `/rolemanager/getRoleInfoById`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Retrieve the list of permissions already assigned to a role
     *
     * @tags Role Management
     * @name GetCheckedPremission
     * @summary Get checked permissions
     * @request GET:/rolemanager/getCheckedPremission
     * @secure
     */
    getCheckedPremission: (
      query: {
        /** @format int32 */
        roleId: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResult, any>({
        path: `/rolemanager/getCheckedPremission`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),
  };
  menumanager = {
    /**
     * @description Update an existing menu item
     *
     * @tags Menu Management
     * @name UpdateMenu
     * @summary Update menu
     * @request POST:/menumanager/updateMenu
     * @secure
     */
    updateMenu: (
      query: {
        treeNode: TreeNode;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResult, any>({
        path: `/menumanager/updateMenu`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Delete a menu item by its function ID
     *
     * @tags Menu Management
     * @name DeleteMenu
     * @summary Delete menu
     * @request POST:/menumanager/deleteMenu
     * @secure
     */
    deleteMenu: (
      query: {
        /** @format int32 */
        functionId: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResult, any>({
        path: `/menumanager/deleteMenu`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Create a new menu item under the specified parent
     *
     * @tags Menu Management
     * @name CreateMenu
     * @summary Create menu
     * @request POST:/menumanager/createMenu
     * @secure
     */
    createMenu: (
      query: {
        treeNode: TreeNode;
        /** @format int32 */
        fatherId: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResult, any>({
        path: `/menumanager/createMenu`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Retrieve the full hierarchical menu tree
     *
     * @tags Menu Management
     * @name GetMenuTree
     * @summary Get menu tree
     * @request GET:/menumanager/getMenuTree
     * @secure
     */
    getMenuTree: (params: RequestParams = {}) =>
      this.request<JsonResult, any>({
        path: `/menumanager/getMenuTree`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  };
  logout = {
    /**
     * @description Invalidate the current Shiro session and log the user out
     *
     * @tags Login
     * @name Logout
     * @summary Logout
     * @request POST:/logout
     * @secure
     */
    logout: (params: RequestParams = {}) =>
      this.request<JsonResult, any>({
        path: `/logout`,
        method: 'POST',
        secure: true,
        ...params,
      }),
  };
  login = {
    /**
     * @description Authenticate with username and password, returns session token
     *
     * @tags Login
     * @name Login
     * @summary User login
     * @request POST:/login
     * @secure
     */
    login: (
      query: {
        userCode: string;
        password: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResult, any>({
        path: `/login`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),
  };
  validateToken = {
    /**
     * @description Check whether a Shiro session token is still valid
     *
     * @tags Login
     * @name ValidateToken
     * @summary Validate session token
     * @request GET:/validateToken
     * @secure
     */
    validateToken: (
      query: {
        token: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResult, any>({
        path: `/validateToken`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),
  };
  userInfo = {
    /**
     * @description Retrieve the currently logged-in user's profile and role list
     *
     * @tags Login
     * @name UserInfo
     * @summary Get current user info
     * @request GET:/userInfo
     * @secure
     */
    userInfo: (params: RequestParams = {}) =>
      this.request<JsonResult, any>({
        path: `/userInfo`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  };
  security = {
    /**
     * @description Retrieve the currently authenticated user's information from the session
     *
     * @tags Security
     * @name GetLoginUserInfo
     * @summary Get login user
     * @request GET:/security/getLoginUser
     * @secure
     */
    getLoginUserInfo: (params: RequestParams = {}) =>
      this.request<AclUserBean, any>({
        path: `/security/getLoginUser`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  };
  getMenuByRole = {
    /**
     * @description Retrieve the menu tree for the specified role
     *
     * @tags Login
     * @name GetMenuByRole
     * @summary Get menus by role
     * @request GET:/getMenuByRole
     * @secure
     */
    getMenuByRole: (
      query: {
        /** @format int32 */
        roleId: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<JsonResult, any>({
        path: `/getMenuByRole`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),
  };
}

/* eslint-disable */
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

import {
  ApiDTO,
  ApiTestDTO,
  JsonResult,
  ModuleDTO,
  ParamDTO,
  RepoDTO,
} from '@/types/backend-types';
import { ContentType, RequestParams } from '@/lib/http-client';
import { HttpClient } from '@/lib/http-client';

export class Repository<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }
  /**
   * No description
   *
   * @tags Repository Management
   * @name UpdateRepo
   * @summary Update repository info and collaborators
   * @request POST:/repository/updateRepo
   * @secure
   */
  updateRepo = (data: RepoDTO, params: RequestParams = {}) =>
    this.http.request<JsonResult, any>({
      path: `/repository/updateRepo`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Repository Management
   * @name TestApi
   * @summary Execute a live HTTP test against a testable endpoint
   * @request POST:/repository/testApi
   * @secure
   */
  testApi = (data: ApiTestDTO, params: RequestParams = {}) =>
    this.http.request<JsonResult, any>({
      path: `/repository/testApi`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Repository Management
   * @name SaveParams
   * @summary Save (replace) all parameters for an endpoint
   * @request POST:/repository/saveParams
   * @secure
   */
  saveParams = (
    query: {
      /** @format int32 */
      apiId: number;
    },
    data: ParamDTO[],
    params: RequestParams = {}
  ) =>
    this.http.request<JsonResult, any>({
      path: `/repository/saveParams`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Repository Management
   * @name RepoPageQuery
   * @summary Paginated repository query
   * @request POST:/repository/repoPageQuery
   * @secure
   */
  repoPageQuery = (
    query: {
      repoName?: string;
      /** @format int32 */
      status?: number;
      /** @format int32 */
      limit: number;
      /** @format int32 */
      curPage: number;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<JsonResult, any>({
      path: `/repository/repoPageQuery`,
      method: 'POST',
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Repository Management
   * @name ModulePageQuery
   * @summary Paginated module query under a repository
   * @request POST:/repository/modulePageQuery
   * @secure
   */
  modulePageQuery = (
    query: {
      /** @format int32 */
      repoId?: number;
      moduleName?: string;
      /** @format int32 */
      limit: number;
      /** @format int32 */
      curPage: number;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<JsonResult, any>({
      path: `/repository/modulePageQuery`,
      method: 'POST',
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Repository Management
   * @name DeleteRepo
   * @summary Delete repository (logic delete)
   * @request POST:/repository/deleteRepo
   * @secure
   */
  deleteRepo = (
    query: {
      /** @format int32 */
      repoId: number;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<JsonResult, any>({
      path: `/repository/deleteRepo`,
      method: 'POST',
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Repository Management
   * @name DeleteModule
   * @summary Delete module (logic delete)
   * @request POST:/repository/deleteModule
   * @secure
   */
  deleteModule = (
    query: {
      /** @format int32 */
      moduleId: number;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<JsonResult, any>({
      path: `/repository/deleteModule`,
      method: 'POST',
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Repository Management
   * @name DeleteApi
   * @summary Delete endpoint (logic delete)
   * @request POST:/repository/deleteApi
   * @secure
   */
  deleteApi = (
    query: {
      /** @format int32 */
      apiId: number;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<JsonResult, any>({
      path: `/repository/deleteApi`,
      method: 'POST',
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Repository Management
   * @name CreateRepo
   * @summary Create a new repository
   * @request POST:/repository/createRepo
   * @secure
   */
  createRepo = (data: RepoDTO, params: RequestParams = {}) =>
    this.http.request<JsonResult, any>({
      path: `/repository/createRepo`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Repository Management
   * @name CreateModule
   * @summary Create a new module under a repository
   * @request POST:/repository/createModule
   * @secure
   */
  createModule = (data: ModuleDTO, params: RequestParams = {}) =>
    this.http.request<JsonResult, any>({
      path: `/repository/createModule`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Repository Management
   * @name CreateApi
   * @summary Create a new endpoint under a module
   * @request POST:/repository/createApi
   * @secure
   */
  createApi = (data: ApiDTO, params: RequestParams = {}) =>
    this.http.request<JsonResult, any>({
      path: `/repository/createApi`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Repository Management
   * @name ApiPageQuery
   * @summary Paginated endpoint query under a module
   * @request POST:/repository/apiPageQuery
   * @secure
   */
  apiPageQuery = (
    query: {
      /** @format int32 */
      moduleId?: number;
      apiName?: string;
      /** @format int32 */
      limit: number;
      /** @format int32 */
      curPage: number;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<JsonResult, any>({
      path: `/repository/apiPageQuery`,
      method: 'POST',
      query: query,
      secure: true,
      ...params,
    });
}

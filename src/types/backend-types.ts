/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

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
  meta?: {
    icon?: string;
    title?: string;
  };
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

export interface RepoDTO {
  /** @format int32 */
  repoId?: number;
  repoName?: string;
  repoDesc?: string;
  /** @format int32 */
  status?: number;
  /** @format int32 */
  collaboratorIds?: number[];
  collaboratorIdsString?: string;
  collaboratorNames?: string;
  createBy?: number;
  creatorName?: string;
  createDate?: string;
}

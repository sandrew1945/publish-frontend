export interface AuthUser {
  userId: number;
  userCode: string;
  userName: string;
  roleId?: number;
  roleName?: string;
  roleCode?: string;
  token?: string;
  avatarPath?: string;
  roleList?: any[]; // Using any[] for now as it matches backend type loose definition, or could use TmRolePO[]
}

export interface LoginCredentials {
  userCode: string;
  password: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginResponse {
  result: boolean;
  msg: string;
  data: any;
}

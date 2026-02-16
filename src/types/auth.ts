export interface AuthUser {
  userId: number;
  userCode: string;
  userName: string;
  roleName?: string;
  roleCode?: string;
  token?: string;
  avatarPath?: string;
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

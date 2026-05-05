export interface UserRegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface UserRegisterResponse {
  id: number;
  email: string;
  name: string;
  role: "customer" | "admin";
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
}

export interface TokenRefreshRequest {
  refresh_token: string;
}

export interface TokenRefreshResponse {
  access_token: string;
  token_type: "bearer";
}

export interface UserProfileResponse {
  id: number;
  email: string;
  name: string;
  role: "customer" | "admin";
}
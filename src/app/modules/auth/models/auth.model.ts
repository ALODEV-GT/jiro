export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  firstName: null;
  lastName: string;
  email: string;
  token: string;
  role: string;
  permissions: string[];
}


export interface SignupRequest {
  firstName: string;
  lastName: string;
  dpi: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  id: string;
}
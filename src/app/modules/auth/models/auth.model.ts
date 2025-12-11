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

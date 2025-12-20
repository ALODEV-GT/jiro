export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  firstName: string;
  lastName: string;
  dpi: string;
  email: string;
  token: string;
  role: string;
  permissions: string[];
  color: string;
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

export interface ConfirmationRequest {
  email: string;
  code: string;
}

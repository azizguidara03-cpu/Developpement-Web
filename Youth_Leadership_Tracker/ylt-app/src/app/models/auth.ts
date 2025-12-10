export interface User {
  id: number;
  fullName: string;
  email: string;
  department: string;
  role: string;
  profileImageUrl?: string;
  bio?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

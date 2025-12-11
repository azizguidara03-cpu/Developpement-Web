// User role types for RBAC
export type UserRole = 'admin' | 'vp' | 'tl' | 'member';

// Department options
export const DEPARTMENTS = [
  'IGV',
  'IGT', 
  'OGV',
  'OGT',
  'Talent Management',
  'Finance',
  'Business Development',
  'Marketing',
  'Information Management'
] as const;

// Experience role options
export const EXPERIENCE_ROLES = [
  'Team Member',
  'Team Leader',
  'Vice President',
  'Local Committee President',
  'OC Member',
  'OC Vice President',
  'OC President',
  'Local Support Team',
  'Entity Support Team'
] as const;

export interface User {
  id: number;
  fullName: string;
  email: string;
  department: string;
  userRole: UserRole;
  profileImageUrl?: string;
  bio?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}


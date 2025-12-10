export interface Member {
  id: number;
  fullName: string;
  email: string;
  department: string; // TM, OGX, ICX, ER, etc
  age?: number;
  skills: string[]; // Soft skills (teamwork, communication, etc)
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberFormData {
  fullName: string;
  email: string;
  department: string;
  age?: number;
  skills: string[];
}

export interface Experience {
  id: number;
  role: string; // TL, OC, VP, EST, etc
  department: string; // TM, OGX, ICX, ER
  description: string; // Mission details
  description_fr?: string;
  description_es?: string;
  startDate: Date;
  endDate: Date;
  skillsGained: string[]; // Skills developed
  memberId: number; // Link to member
  createdAt: Date;
  updatedAt: Date;
}

export interface ExperienceFormData {
  role: string;
  description: string;
  description_fr?: string;
  description_es?: string;
  skillsGained: string[];
  department: string; // e.g., 'Marketing', 'Finance';
  startDate: Date;
  endDate: Date;
  memberId: number;
}

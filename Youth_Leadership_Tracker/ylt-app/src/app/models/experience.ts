export interface Experience {
  id: number;
  role: string; // TL, OC, VP, EST, etc
  department: string; // TM, OGX, ICX, ER
  description: string; // Mission details
  startDate: Date;
  endDate: Date;
  skillsGained: string[]; // Skills developed
  memberId: number; // Link to member
  createdAt: Date;
  updatedAt: Date;
}

export interface ExperienceFormData {
  role: string;
  department: string;
  description: string;
  startDate: Date;
  endDate: Date;
  skillsGained: string[];
  memberId: number;
}

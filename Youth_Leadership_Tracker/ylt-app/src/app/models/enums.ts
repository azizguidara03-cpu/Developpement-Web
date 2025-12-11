export enum Skills {
  TEAMWORK = 'Teamwork',
  COMMUNICATION = 'Communication',
  LEADERSHIP = 'Leadership',
  ADAPTABILITY = 'Adaptability',
  PROBLEM_SOLVING = 'Problem Solving',
  TIME_MANAGEMENT = 'Time Management',
  CREATIVITY = 'Creativity',
  PROJECT_MANAGEMENT = 'Project Management',
  DECISION_MAKING = 'Decision Making',
  STRATEGIC_THINKING = 'Strategic Thinking'
}

// Updated AIESEC Departments
export const DEPARTMENTS = [
  'IGV',                    // Incoming Global Volunteer
  'IGT',                    // Incoming Global Talent
  'OGV',                    // Outgoing Global Volunteer
  'OGT',                    // Outgoing Global Talent
  'Talent Management',      // HR/Talent Management
  'Finance',                // Finance Department
  'Business Development',   // BD Department
  'Marketing',              // Marketing & Communications
  'Information Management'  // IT/IM Department
];

// Department labels for display
export const DEPARTMENT_LABELS: { [key: string]: string } = {
  'IGV': 'IGV (Incoming Global Volunteer)',
  'IGT': 'IGT (Incoming Global Talent)',
  'OGV': 'OGV (Outgoing Global Volunteer)',
  'OGT': 'OGT (Outgoing Global Talent)',
  'Talent Management': 'Talent Management',
  'Finance': 'Finance',
  'Business Development': 'Business Development',
  'Marketing': 'Marketing',
  'Information Management': 'Information Management'
};

// Experience Roles (positions a member can hold)
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
];

// Kept for backward compatibility - maps to EXPERIENCE_ROLES
export const ROLE_TYPES = EXPERIENCE_ROLES;

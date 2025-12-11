import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Experience, ExperienceFormData } from '../models/experience';

@Injectable({
  providedIn: 'root'
})
export class ExperiencesService {
  private experiencesSubject = new BehaviorSubject<Experience[]>(this.getExperiencesFromStorage());
  public experiences$ = this.experiencesSubject.asObservable();

  // Diverse mock experiences with new roles and departments
  private mockExperiences: Experience[] = [
    // Active experiences (end date in future or null)
    {
      id: 1,
      role: 'Vice President',
      department: 'OGV',
      description: 'Leading the OGV department strategic initiatives and team management',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2025-05-31'),
      skillsGained: ['Leadership', 'Strategic Thinking', 'Decision Making'],
      memberId: 1,
      createdAt: new Date('2024-06-01'),
      updatedAt: new Date('2024-06-01')
    },
    {
      id: 2,
      role: 'Team Leader',
      department: 'IGV',
      description: 'Managing incoming volunteer programs and team coordination',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2025-06-30'),
      skillsGained: ['Leadership', 'Communication', 'Project Management'],
      memberId: 4,
      createdAt: new Date('2024-07-01'),
      updatedAt: new Date('2024-07-01')
    },
    {
      id: 3,
      role: 'Local Committee President',
      department: 'Talent Management',
      description: 'Overall leadership of the local committee operations',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      skillsGained: ['Leadership', 'Strategic Thinking', 'Communication', 'Decision Making'],
      memberId: 6,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 4,
      role: 'Team Member',
      department: 'Marketing',
      description: 'Supporting marketing campaigns and social media management',
      startDate: new Date('2024-09-01'),
      endDate: null as any,
      skillsGained: ['Creativity', 'Communication', 'Adaptability'],
      memberId: 7,
      createdAt: new Date('2024-09-01'),
      updatedAt: new Date('2024-09-01')
    },
    {
      id: 5,
      role: 'OC Member',
      department: 'OGV',
      description: 'Organizing outgoing volunteer exchange events',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2025-07-31'),
      skillsGained: ['Project Management', 'Teamwork', 'Problem Solving'],
      memberId: 2,
      createdAt: new Date('2024-08-01'),
      updatedAt: new Date('2024-08-01')
    },
    // Completed experiences (end date in past)
    {
      id: 6,
      role: 'Team Leader',
      department: 'OGV',
      description: 'Led outgoing volunteer recruitment campaigns',
      startDate: new Date('2023-09-01'),
      endDate: new Date('2024-05-30'),
      skillsGained: ['Leadership', 'Communication', 'Time Management'],
      memberId: 3,
      createdAt: new Date('2023-09-01'),
      updatedAt: new Date('2024-05-30')
    },
    {
      id: 7,
      role: 'Team Member',
      department: 'IGV',
      description: 'Participated in incoming volunteer hosting program',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-15'),
      skillsGained: ['Teamwork', 'Adaptability', 'Communication'],
      memberId: 5,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-06-15')
    },
    {
      id: 8,
      role: 'OC Vice President',
      department: 'IGT',
      description: 'Deputy leadership for incoming talent program',
      startDate: new Date('2023-06-01'),
      endDate: new Date('2024-05-31'),
      skillsGained: ['Leadership', 'Strategic Thinking', 'Project Management'],
      memberId: 9,
      createdAt: new Date('2023-06-01'),
      updatedAt: new Date('2024-05-31')
    },
    {
      id: 9,
      role: 'Team Member',
      department: 'Finance',
      description: 'Budget management and financial reporting support',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-08-31'),
      skillsGained: ['Problem Solving', 'Decision Making', 'Time Management'],
      memberId: 8,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-08-31')
    },
    {
      id: 10,
      role: 'Local Support Team',
      department: 'Information Management',
      description: 'Technical support and system administration',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-09-30'),
      skillsGained: ['Problem Solving', 'Creativity', 'Adaptability'],
      memberId: 10,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-09-30')
    },
    {
      id: 11,
      role: 'OC President',
      department: 'OGV',
      description: 'Presided over major OGV organizing committee',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      skillsGained: ['Leadership', 'Strategic Thinking', 'Decision Making', 'Communication'],
      memberId: 1,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-12-31')
    },
    {
      id: 12,
      role: 'Team Leader',
      department: 'Marketing',
      description: 'Led social media and content creation team',
      startDate: new Date('2023-07-01'),
      endDate: new Date('2024-06-30'),
      skillsGained: ['Creativity', 'Leadership', 'Communication'],
      memberId: 7,
      createdAt: new Date('2023-07-01'),
      updatedAt: new Date('2024-06-30')
    },
    {
      id: 13,
      role: 'Entity Support Team',
      department: 'Talent Management',
      description: 'National level talent management support',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      skillsGained: ['Strategic Thinking', 'Teamwork', 'Adaptability'],
      memberId: 6,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-06-30')
    },
    {
      id: 14,
      role: 'Team Member',
      department: 'OGV',
      description: 'Volunteer recruitment and selection process',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-10-31'),
      skillsGained: ['Communication', 'Teamwork', 'Problem Solving'],
      memberId: 2,
      createdAt: new Date('2024-04-01'),
      updatedAt: new Date('2024-10-31')
    },
    {
      id: 15,
      role: 'Vice President',
      department: 'IGV',
      description: 'Strategic leadership for incoming volunteer operations',
      startDate: new Date('2023-06-01'),
      endDate: new Date('2024-05-31'),
      skillsGained: ['Leadership', 'Strategic Thinking', 'Project Management'],
      memberId: 4,
      createdAt: new Date('2023-06-01'),
      updatedAt: new Date('2024-05-31')
    }
  ];

  constructor() {
    this.initializeExperiences();
  }

  private initializeExperiences(): void {
    const storedExperiences = this.getExperiencesFromStorage();
    if (storedExperiences.length === 0) {
      this.experiencesSubject.next(this.mockExperiences);
      this.saveExperiencesToStorage(this.mockExperiences);
    }
  }

  private getExperiencesFromStorage(): Experience[] {
    const stored = localStorage.getItem('ylt_experiences');
    return stored ? JSON.parse(stored) : [];
  }

  private saveExperiencesToStorage(experiences: Experience[]): void {
    localStorage.setItem('ylt_experiences', JSON.stringify(experiences));
  }

  getAllExperiences(): Observable<Experience[]> {
    return this.experiences$;
  }

  getExperienceById(id: number | string): Observable<Experience | undefined> {
    const experiences = this.experiencesSubject.value;
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    const found = experiences.find(e => e.id === numId || e.id === id);
    return of(found);
  }

  getExperiencesByMemberId(memberId: number): Observable<Experience[]> {
    const experiences = this.experiencesSubject.value;
    return of(experiences.filter(e => e.memberId === memberId));
  }

  createExperience(formData: ExperienceFormData): Observable<Experience> {
    return new Observable(observer => {
      setTimeout(() => {
        const experiences = this.experiencesSubject.value;
        const newId = Math.max(...experiences.map(e => e.id), 0) + 1;

        const newExperience: Experience = {
          id: newId,
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        experiences.push(newExperience);
        this.experiencesSubject.next([...experiences]);
        this.saveExperiencesToStorage(experiences);

        observer.next(newExperience);
        observer.complete();
      }, 300);
    });
  }

  updateExperience(id: number, formData: ExperienceFormData): Observable<Experience | null> {
    return new Observable(observer => {
      setTimeout(() => {
        const experiences = this.experiencesSubject.value;
        const index = experiences.findIndex(e => e.id === id);

        if (index !== -1) {
          experiences[index] = {
            ...experiences[index],
            ...formData,
            updatedAt: new Date()
          };
          this.experiencesSubject.next([...experiences]);
          this.saveExperiencesToStorage(experiences);
          observer.next(experiences[index]);
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 300);
    });
  }

  deleteExperience(id: number): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const experiences = this.experiencesSubject.value;
        const index = experiences.findIndex(e => e.id === id);

        if (index !== -1) {
          experiences.splice(index, 1);
          this.experiencesSubject.next([...experiences]);
          this.saveExperiencesToStorage(experiences);
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 300);
    });
  }

  searchExperiences(query: string): Observable<Experience[]> {
    const experiences = this.experiencesSubject.value;
    const lowerQuery = query.toLowerCase();
    return of(experiences.filter(e =>
      e.role.toLowerCase().includes(lowerQuery) ||
      e.department.toLowerCase().includes(lowerQuery) ||
      e.description.toLowerCase().includes(lowerQuery)
    ));
  }

  getExperiencesByRole(role: string): Observable<Experience[]> {
    const experiences = this.experiencesSubject.value;
    return of(experiences.filter(e => e.role === role));
  }

  getExperiencesByDepartment(department: string): Observable<Experience[]> {
    const experiences = this.experiencesSubject.value;
    return of(experiences.filter(e => e.department === department));
  }

  getActiveExperiences(): Observable<Experience[]> {
    const experiences = this.experiencesSubject.value;
    const now = new Date();
    return of(experiences.filter(e => 
      new Date(e.startDate) <= now && (!e.endDate || new Date(e.endDate) >= now)
    ));
  }

  getCompletedExperiences(): Observable<Experience[]> {
    const experiences = this.experiencesSubject.value;
    const now = new Date();
    return of(experiences.filter(e => e.endDate && new Date(e.endDate) < now));
  }

  // Reset to mock data (useful for testing)
  resetToMockData(): void {
    this.experiencesSubject.next(this.mockExperiences);
    this.saveExperiencesToStorage(this.mockExperiences);
  }
}

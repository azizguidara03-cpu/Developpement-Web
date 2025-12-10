import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Experience, ExperienceFormData } from '../models/experience';

@Injectable({
  providedIn: 'root'
})
export class ExperiencesService {
  private experiencesSubject = new BehaviorSubject<Experience[]>(this.getExperiencesFromStorage());
  public experiences$ = this.experiencesSubject.asObservable();

  private mockExperiences: Experience[] = [
    {
      id: 1,
      role: 'Team Leader',
      department: 'TM',
      description: 'Led a team of 5 members in a community development project',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-03-30'),
      skillsGained: ['Leadership', 'Communication', 'Team Management'],
      memberId: 1,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 2,
      role: 'Organizational Committee',
      department: 'OGX',
      description: 'Organized internal events and team building activities',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-04-15'),
      skillsGained: ['Project Management', 'Creativity', 'Adaptability'],
      memberId: 2,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01')
    },
    {
      id: 3,
      role: 'Vice President',
      department: 'ICX',
      description: 'Strategic planning and international cooperation initiatives',
      startDate: new Date('2023-11-01'),
      endDate: new Date('2024-10-31'),
      skillsGained: ['Strategic Thinking', 'Leadership', 'Decision Making'],
      memberId: 1,
      createdAt: new Date('2023-11-01'),
      updatedAt: new Date('2023-11-01')
    },
    {
      id: 4,
      role: 'Team Member',
      department: 'OGX',
      description: 'Participated in organizational development programs',
      startDate: new Date('2024-01-10'),
      endDate: null as any,
      skillsGained: ['Teamwork', 'Communication', 'Problem Solving'],
      memberId: 3,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: 5,
      role: 'Team Leader',
      department: 'ICX',
      description: 'Managed international exchange program',
      startDate: new Date('2024-02-15'),
      endDate: new Date('2024-05-30'),
      skillsGained: ['Leadership', 'Adaptability', 'Communication'],
      memberId: 4,
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15')
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
}

import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Member, MemberFormData } from '../models/member';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private authService = inject(AuthService);

  // Diverse mock members with new AIESEC departments
  private mockMembers: Member[] = [
    {
      id: 1,
      fullName: 'Ahmed Ben Ali',
      email: 'ahmed@aiesec.org',
      department: 'OGV',
      age: 23,
      skills: ['Leadership', 'Communication', 'Strategic Thinking'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 2,
      fullName: 'Fatima Zahra',
      email: 'fatima@aiesec.org',
      department: 'OGV',
      age: 22,
      skills: ['Teamwork', 'Project Management', 'Creativity'],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: 3,
      fullName: 'Omar Khaled',
      email: 'omar@aiesec.org',
      department: 'OGV',
      age: 24,
      skills: ['Leadership', 'Decision Making', 'Communication'],
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01')
    },
    {
      id: 4,
      fullName: 'Noor Hassan',
      email: 'noor@aiesec.org',
      department: 'IGV',
      age: 21,
      skills: ['Adaptability', 'Teamwork', 'Problem Solving'],
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10')
    },
    {
      id: 5,
      fullName: 'Sara Mohamed',
      email: 'sara@aiesec.org',
      department: 'IGV',
      age: 23,
      skills: ['Communication', 'Creativity', 'Leadership'],
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15')
    },
    {
      id: 6,
      fullName: 'Youssef Mansour',
      email: 'youssef@aiesec.org',
      department: 'Talent Management',
      age: 25,
      skills: ['Leadership', 'Time Management', 'Strategic Thinking'],
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-02-20')
    },
    {
      id: 7,
      fullName: 'Leila Bouazizi',
      email: 'leila@aiesec.org',
      department: 'Marketing',
      age: 22,
      skills: ['Creativity', 'Communication', 'Adaptability'],
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-01')
    },
    {
      id: 8,
      fullName: 'Karim El Fassi',
      email: 'karim@aiesec.org',
      department: 'Finance',
      age: 24,
      skills: ['Decision Making', 'Problem Solving', 'Time Management'],
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-03-10')
    },
    {
      id: 9,
      fullName: 'Amina Trabelsi',
      email: 'amina@aiesec.org',
      department: 'IGT',
      age: 23,
      skills: ['Project Management', 'Teamwork', 'Leadership'],
      createdAt: new Date('2024-03-15'),
      updatedAt: new Date('2024-03-15')
    },
    {
      id: 10,
      fullName: 'Mehdi Gharbi',
      email: 'mehdi@aiesec.org',
      department: 'Information Management',
      age: 26,
      skills: ['Problem Solving', 'Strategic Thinking', 'Creativity'],
      createdAt: new Date('2024-03-20'),
      updatedAt: new Date('2024-03-20')
    }
  ];

  private membersSubject: BehaviorSubject<Member[]>;
  public members$: Observable<Member[]>;

  constructor() {
    // Initialize subject in constructor to ensure mockMembers is available
    this.membersSubject = new BehaviorSubject<Member[]>([]);
    this.members$ = this.membersSubject.asObservable();
    
    // Defer initialization to ensure everything is ready
    this.initializeMembers();
    this.setupStorageListener();
  }

  private initializeMembers(): void {
    const storedMembers = this.getMembersFromStorage();
    this.membersSubject.next(storedMembers);
    
    if (storedMembers.length === 0) {
      // If storage returned empty (and caused fallback to mock), we should save it?
      // actually getMembersFromStorage already returns mock if empty/error
      // so we just need to ensure consistent state
    }
  }

  // Listen for localStorage changes from other tabs or direct modifications
  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === 'ylt_members') {
        try {
          // Check for undefined string explicitly
          if (event.newValue === 'undefined') {
            return;
          }
          const newMembers = event.newValue ? JSON.parse(event.newValue) : [];
          this.membersSubject.next(newMembers);
        } catch (e) {
          console.error('Error parsing members from storage listener', e);
        }
      }
    });
  }

  // Method to force refresh from localStorage (useful for same-tab sync)
  refreshFromStorage(): void {
    const members = this.getMembersFromStorage();
    this.membersSubject.next(members);
  }

  private getMembersFromStorage(): Member[] {
    try {
      const stored = localStorage.getItem('ylt_members');
      if (stored && stored !== 'undefined') {
        // Parse stored data and convert date strings back to Date objects
        const members = JSON.parse(stored);
        return members.map((m: any) => ({
          ...m,
          createdAt: new Date(m.createdAt),
          updatedAt: new Date(m.updatedAt)
        }));
      } else {
        // No stored data or it's undefined - initialize with mock data and save to storage
        this.saveMembersToStorage(this.mockMembers);
        return [...this.mockMembers];
      }
    } catch (e) {
      console.error('Error parsing members from storage', e);
      // Fallback to mock data on error
      return [...this.mockMembers];
    }
  }

  private saveMembersToStorage(members: Member[]): void {
    localStorage.setItem('ylt_members', JSON.stringify(members));
  }

  getAllMembers(): Observable<Member[]> {
    return this.members$;
  }

  getMemberById(id: number | string): Observable<Member | undefined> {
    const members = this.membersSubject.value;
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    const found = members.find(m => m.id === numId || m.id === id);
    return of(found);
  }

  createMember(formData: MemberFormData): Observable<Member> {
    return new Observable(observer => {
      setTimeout(() => {
        const members = this.membersSubject.value;
        const newId = Math.max(...members.map(m => m.id), 0) + 1;
        
        const newMember: Member = {
          id: newId,
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        members.push(newMember);
        this.membersSubject.next([...members]);
        this.saveMembersToStorage(members);

        observer.next(newMember);
        observer.complete();
      }, 300);
    });
  }

  updateMember(id: number, formData: MemberFormData): Observable<Member | null> {
    return new Observable(observer => {
      setTimeout(() => {
        const members = this.membersSubject.value;
        const index = members.findIndex(m => m.id == id || m.id === parseInt(id.toString()));

        if (index !== -1) {
          members[index] = {
            ...members[index],
            ...formData,
            updatedAt: new Date()
          };
          this.membersSubject.next([...members]);
          this.saveMembersToStorage(members);

          // SYNC WITH AUTH SERVICE
          // Ensure login credentials (email) and user details are updated
          this.authService.syncMemberUpdate(id, {
            email: formData.email,
            fullName: formData.fullName,
            department: formData.department
          });

          observer.next(members[index]);
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 300);
    });
  }

  deleteMember(id: number): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const members = this.membersSubject.value;
        // Use loose equality (==) to handle string/number mismatch, or explicit check
        const idToCheck = typeof id === 'string' ? parseInt(id, 10) : id;
        
        // Check if member exists first
        const exists = members.some(m => m.id === idToCheck || m.id == id);

        if (exists) {
          // Immutable update: create new array via filter
          const updatedMembers = members.filter(m => m.id !== idToCheck && m.id != id);
          
          this.membersSubject.next(updatedMembers);
          this.saveMembersToStorage(updatedMembers);
          observer.next(true);
        } else {
          console.warn(`Member with id ${id} not found for deletion`);
          observer.next(false);
        }
        observer.complete();
      }, 300);
    });
  }

  searchMembers(query: string): Observable<Member[]> {
    const members = this.membersSubject.value;
    const lowerQuery = query.toLowerCase();
    return of(members.filter(m =>
      m.fullName.toLowerCase().includes(lowerQuery) ||
      m.email.toLowerCase().includes(lowerQuery) ||
      m.department.toLowerCase().includes(lowerQuery)
    ));
  }

  getMembersByDepartment(department: string): Observable<Member[]> {
    const members = this.membersSubject.value;
    return of(members.filter(m => m.department === department));
  }

  // Reset to mock data (useful for testing)
  resetToMockData(): void {
    this.membersSubject.next(this.mockMembers);
    this.saveMembersToStorage(this.mockMembers);
  }
}

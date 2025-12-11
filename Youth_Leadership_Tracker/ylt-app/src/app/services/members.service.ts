import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Member, MemberFormData } from '../models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private membersSubject = new BehaviorSubject<Member[]>(this.getMembersFromStorage());
  public members$ = this.membersSubject.asObservable();

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

  constructor() {
    this.initializeMembers();
  }

  private initializeMembers(): void {
    const storedMembers = this.getMembersFromStorage();
    if (storedMembers.length === 0) {
      this.membersSubject.next(this.mockMembers);
      this.saveMembersToStorage(this.mockMembers);
    }
  }

  private getMembersFromStorage(): Member[] {
    const stored = localStorage.getItem('ylt_members');
    return stored ? JSON.parse(stored) : [];
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
        const index = members.findIndex(m => m.id == id || m.id === parseInt(id.toString()));

        if (index !== -1) {
          members.splice(index, 1);
          this.membersSubject.next([...members]);
          this.saveMembersToStorage(members);
          observer.next(true);
        } else {
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

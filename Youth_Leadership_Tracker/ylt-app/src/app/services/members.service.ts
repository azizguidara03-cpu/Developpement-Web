import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Member, MemberFormData } from '../models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private membersSubject = new BehaviorSubject<Member[]>(this.getMembersFromStorage());
  public members$ = this.membersSubject.asObservable();

  private mockMembers: Member[] = [
    {
      id: 1,
      fullName: 'Ahmed Ben Ali',
      email: 'ahmed@aiesec.org',
      department: 'VP',
      age: 23,
      skills: ['Leadership', 'Communication', 'Strategic Thinking'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 2,
      fullName: 'Fatima Zahra',
      email: 'fatima@aiesec.org',
      department: 'OC',
      age: 22,
      skills: ['Teamwork', 'Project Management', 'Creativity'],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: 3,
      fullName: 'Omar Khaled',
      email: 'omar@aiesec.org',
      department: 'TL',
      age: 24,
      skills: ['Leadership', 'Decision Making', 'Communication'],
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01')
    },
    {
      id: 4,
      fullName: 'Noor Hassan',
      email: 'noor@aiesec.org',
      department: 'OGX',
      age: 21,
      skills: ['Adaptability', 'Teamwork', 'Problem Solving'],
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10')
    },
    {
      id: 5,
      fullName: 'Sara Mohamed',
      email: 'sara@aiesec.org',
      department: 'ICX',
      age: 23,
      skills: ['Communication', 'Creativity', 'Leadership'],
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15')
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
}

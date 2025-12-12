import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, AuthResponse, UserRole, DEPARTMENTS } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal-based current user for reactive access
  private _currentUser = signal<User | null>(this.getUserFromStorage());
  public currentUser = this._currentUser.asReadonly();
  
  // Computed signal for checking authentication
  public isLoggedIn = computed(() => this._currentUser() !== null);

  // BehaviorSubjects for observable-based access (backwards compatibility)
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('ylt_token') && !!localStorage.getItem('ylt_user'));
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private loginAttemptsSubject = new BehaviorSubject<number>(0);
  private lockoutTimeSubject = new BehaviorSubject<number>(0);
  private readonly MAX_ATTEMPTS = 3;
  private readonly LOCKOUT_DURATION = 100 * 1000; // 100 seconds

  // Mock users database with roles
  // IMPORTANT: User IDs should match Member IDs for experiences to link correctly
  private mockUsers = [
    {
      id: 100, // Admin - separate from members
      fullName: 'Admin User',
      email: 'admin@aiesec.org',
      password: 'password123',
      department: 'Information Management',
      userRole: 'admin' as UserRole
    },
    {
      id: 1, // Matches member "Ahmed Ben Ali" (id=1)
      fullName: 'Ahmed Ben Ali',
      email: 'ahmed@aiesec.org',
      password: 'password123',
      department: 'OGV',
      userRole: 'vp' as UserRole
    },
    {
      id: 2, // Matches member "Fatima Zahra" (id=2)
      fullName: 'Fatima Zahra',
      email: 'fatima@aiesec.org',
      password: 'password123',
      department: 'OGV',
      userRole: 'tl' as UserRole
    },
    {
      id: 3,
      fullName: 'Omar Khaled',
      email: 'omar@aiesec.org',
      password: 'password123',
      department: 'OGV',
      userRole: 'member' as UserRole
    },
    {
      id: 4, // Matches member "Noor Hassan" (id=4)
      fullName: 'Noor Hassan',
      email: 'noor@aiesec.org',
      password: 'password123',
      department: 'IGV',
      userRole: 'member' as UserRole
    },
    {
      id: 5,
      fullName: 'Sara Mohamed',
      email: 'sara@aiesec.org',
      password: 'password123',
      department: 'IGV',
      userRole: 'member' as UserRole
    },
    {
      id: 6,
      fullName: 'Youssef Mansour',
      email: 'youssef@aiesec.org',
      password: 'password123',
      department: 'Talent Management',
      userRole: 'tl' as UserRole
    },
    {
      id: 7,
      fullName: 'Leila Bouazizi',
      email: 'leila@aiesec.org',
      password: 'password123',
      department: 'Marketing',
      userRole: 'member' as UserRole
    },
    {
      id: 8,
      fullName: 'Karim El Fassi',
      email: 'karim@aiesec.org',
      password: 'password123',
      department: 'Finance',
      userRole: 'vp' as UserRole
    },
    {
      id: 9,
      fullName: 'Amina Trabelsi',
      email: 'amina@aiesec.org',
      password: 'password123',
      department: 'IGT',
      userRole: 'member' as UserRole
    },
    {
      id: 10,
      fullName: 'Mehdi Gharbi',
      email: 'mehdi@aiesec.org',
      password: 'password123',
      department: 'Information Management',
      userRole: 'tl' as UserRole
    }
  ];

  constructor() {
    this.checkLockoutStatus();
  }

  /**
   * Check if current user has a specific role
   */
  hasRole(role: UserRole): boolean {
    const user = this._currentUser();
    return user?.userRole === role;
  }

  /**
   * Check if current user has any of the specified roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const user = this._currentUser();
    if (!user) return false;
    return roles.includes(user.userRole);
  }

  /**
   * Get current user's role
   */
  getUserRole(): UserRole | null {
    return this._currentUser()?.userRole ?? null;
  }

  /**
   * Check if user can access admin features
   */
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  /**
   * Check if user can edit experiences (admin, vp, tl)
   */
  canEditExperiences(): boolean {
    return this.hasAnyRole(['admin', 'vp', 'tl']);
  }

  /**
   * Check if user can manage members (admin only)
   */
  canManageMembers(): boolean {
    return this.hasRole('admin');
  }

  /**
   * Register a new user with specific role and password
   */
  registerUser(user: User, password: string): Observable<User> {
    return new Observable(observer => {
      setTimeout(() => {
        const users = this.getRegisteredUsersRaw();
        
        // check if email already exists
        const emailExists = users.some((u: any) => u.email === user.email) || 
                            this.mockUsers.some(u => u.email === user.email);
        
        if (emailExists) {
          observer.error('Email already exists');
          return;
        }

        const newUser = {
          ...user,
          password, // In a real app, this should be hashed
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('ylt_users', JSON.stringify(users));
        
        observer.next(user);
        observer.complete();
      }, 500);
    });
  }

  /**
   * Get user by ID (checks both mock and registered users)
   */
  getUserById(id: number): Observable<User | null> {
    return new Observable(observer => {
      setTimeout(() => {
        const idNum = typeof id === 'string' ? parseInt(id) : id;
        
        // Check mock users
        const mockUser = this.mockUsers.find(u => u.id === idNum);
        if (mockUser) {
          observer.next({
            id: mockUser.id,
            fullName: mockUser.fullName,
            email: mockUser.email,
            department: mockUser.department,
            userRole: mockUser.userRole
          });
          observer.complete();
          return;
        }
        
        // Check registered users
        const users = this.getRegisteredUsersRaw();
        const user = users.find((u: any) => u.id === idNum);
        
        if (user) {
          observer.next({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            department: user.department,
            userRole: user.userRole
          });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 300);
    });
  }

  /**
   * Update current user's profile (name, email, department, bio)
   * Used by Profile page for user self-edits
   */
  /**
   * Update current user's profile (name, email, department, bio)
   * Used by Profile page for user self-edits
   */
  updateProfile(updatedUser: User): void {
    // Update localStorage for current session
    localStorage.setItem('ylt_user', JSON.stringify(updatedUser));
    
    // Update the signal
    this._currentUser.set(updatedUser);
    
    // Update the BehaviorSubject for observable-based subscribers
    this.currentUserSubject.next(updatedUser);
    
    // Update in the registered users list (persistence)
    const users = this.getRegisteredUsersRaw();
    const index = users.findIndex((u: any) => u.id === updatedUser.id);
    
    if (index !== -1) {
      // Update existing registered user
      users[index] = {
        ...users[index],
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        department: updatedUser.department,
        bio: updatedUser.bio
      };
      localStorage.setItem('ylt_users', JSON.stringify(users));
    } else {
      // User not in storage yet (is a Mock User being edited)
      // We must add them to storage to persist changes
      const mockUser = this.mockUsers.find(u => u.id === updatedUser.id);
      if (mockUser) {
         const newUserEntry = {
             ...mockUser, // keep original password/id
             ...updatedUser, // override editable fields
             userRole: updatedUser.userRole // ensure role is kept
         };
         users.push(newUserEntry);
         localStorage.setItem('ylt_users', JSON.stringify(users));
      }
    }
  }

  /**
   * Update user details (role and/or password)
   */
  updateUser(id: number, updates: { userRole?: UserRole, password?: string }): Observable<User | null> {
    return new Observable(observer => {
      setTimeout(() => {
        const idNum = typeof id === 'string' ? parseInt(id) : id;
        const users = this.getRegisteredUsersRaw();
        let index = users.findIndex((u: any) => u.id === idNum);
        
        // If not in storage (Mock User), prompt it to storage first
        if (index === -1) {
           const mockUser = this.mockUsers.find(u => u.id === idNum);
           if (mockUser) {
             users.push({ ...mockUser });
             index = users.length - 1;
           }
        }
        
        if (index !== -1) {
          users[index] = {
            ...users[index],
            ...updates,
            updatedAt: new Date().toISOString()
          };
          
          // Don't update password if it's empty/undefined
          if (!updates.password) {
             // ensure we don't accidentally set password to undefined if it existed
             // spread handles this automatically if updates.password is missing from the object, 
             // but if it's explicitly undefined/empty string we might want to be careful.
             // The calling code usually constructs the object.
          }

          localStorage.setItem('ylt_users', JSON.stringify(users));
          
          const updatedUser: User = {
             id: users[index].id,
             fullName: users[index].fullName,
             email: users[index].email,
             department: users[index].department,
             userRole: users[index].userRole,
             bio: users[index].bio
          };
          
          observer.next(updatedUser);
        } else {
           observer.next(null); 
        }
        observer.complete();
      }, 500);
    });
  }

  /**
   * Sync member details updates (email, name, etc) to user storage
   * Ensures login works with new email if changed by Admin
   */
  syncMemberUpdate(id: number, updates: { email?: string, fullName?: string, department?: string }): void {
    const users = this.getRegisteredUsersRaw();
    // handle string/number id mismatch
    const idNum = typeof id === 'string' ? parseInt(id, 10) : id;
    const index = users.findIndex((u: any) => u.id === idNum);

    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem('ylt_users', JSON.stringify(users));
      
      // Update current user if it matches the one being edited
      const currentUser = this._currentUser();
      if (currentUser && currentUser.id === idNum) {
          const updated = { ...currentUser, ...updates };
          this._currentUser.set(updated);
          this.currentUserSubject.next(updated);
          localStorage.setItem('ylt_user', JSON.stringify(updated));
      }
    } else {
        // If not in ylt_users, it might be a mock user being edited for the first time
        // We should "promote" it to ylt_users so the login works with new credentials
        const mockUser = this.mockUsers.find(u => u.id === idNum);
        if (mockUser) {
            const newUserEntry = {
                ...mockUser,
                ...updates,
                // ensure we keep the password if not provided
                password: mockUser.password 
            };
            users.push(newUserEntry);
            localStorage.setItem('ylt_users', JSON.stringify(users));
        }
    }
  }



  login(email: string, password: string): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        // Check if account is locked
        const lockoutTime = localStorage.getItem('ylt_lockout_time');
        if (lockoutTime) {
          const lockoutExpiry = parseInt(lockoutTime);
          if (Date.now() < lockoutExpiry) {
            observer.next({
              success: false,
              message: `Account locked. Try again in ${Math.ceil((lockoutExpiry - Date.now()) / 1000)} seconds`
            });
            observer.complete();
            return;
          } else {
            localStorage.removeItem('ylt_lockout_time');
            localStorage.removeItem('ylt_login_attempts');
          }
        }

        // Get all users (mock + registered)
        // MERGE STRATEGY: Registered users from storage override mock users
        const userMap = new Map<number, any>();
        this.mockUsers.forEach(u => userMap.set(u.id, u));
        
        const storedUsers = this.getRegisteredUsersRaw();
        storedUsers.forEach(u => userMap.set(u.id, u));
        
        const allUsers = Array.from(userMap.values());

        // Verify credentials
        const user = allUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          // Reset attempts on successful login
          localStorage.removeItem('ylt_login_attempts');
          localStorage.removeItem('ylt_lockout_time');
          
          const token = this.generateToken();
          const currentUser: User = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            department: user.department,
            userRole: (user.userRole as UserRole) || 'member',
            bio: user.bio, // Preserve bio
            profileImageUrl: user.profileImageUrl // Preserve image if any
          };

          localStorage.setItem('ylt_token', token);
          localStorage.setItem('ylt_user', JSON.stringify(currentUser));

          // Update both signal and BehaviorSubject
          this._currentUser.set(currentUser);
          this.currentUserSubject.next(currentUser);
          this.isAuthenticatedSubject.next(true);

          observer.next({
            success: true,
            message: 'Login successful',
            token,
            user: currentUser
          });
        } else {
          // Increment failed attempts
          const attempts = parseInt(localStorage.getItem('ylt_login_attempts') || '0') + 1;
          localStorage.setItem('ylt_login_attempts', attempts.toString());
          this.loginAttemptsSubject.next(attempts);

          if (attempts >= this.MAX_ATTEMPTS) {
            const lockoutExpiry = Date.now() + this.LOCKOUT_DURATION;
            localStorage.setItem('ylt_lockout_time', lockoutExpiry.toString());
            this.lockoutTimeSubject.next(lockoutExpiry);
            
            observer.next({
              success: false,
              message: 'Account locked after 3 failed attempts. Try again in 100 seconds'
            });
          } else {
            observer.next({
              success: false,
              message: `Invalid credentials. ${this.MAX_ATTEMPTS - attempts} attempts remaining`
            });
          }
        }
        observer.complete();
      }, 500);
    });
  }

  logout(): void {
    localStorage.removeItem('ylt_token');
    localStorage.removeItem('ylt_user');
    this._currentUser.set(null);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('ylt_token');
  }

  getCurrentUser(): User | null {
    return this._currentUser();
  }

  private generateToken(): string {
    return btoa(JSON.stringify({
      user: this._currentUser()?.id,
      timestamp: Date.now(),
      random: Math.random()
    }));
  }

  private getUserFromStorage(): User | null {
    try {
      const userStr = localStorage.getItem('ylt_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.error('Error parsing user from storage', e);
      return null;
    }
  }

  private checkLockoutStatus(): void {
    const lockoutTime = localStorage.getItem('ylt_lockout_time');
    if (lockoutTime) {
      const lockoutExpiry = parseInt(lockoutTime, 10);
      if (Date.now() < lockoutExpiry) {
        this.lockoutTimeSubject.next(lockoutExpiry);
      }
    }
  }

  getLoginAttempts(): number {
    const attempts = localStorage.getItem('ylt_login_attempts');
    return attempts ? parseInt(attempts, 10) : 0;
  }

  private getRegisteredUsers(): any[] {
    return this.getRegisteredUsersRaw().map((u: any) => ({
      ...u,
      userRole: u.userRole || 'member'
    }));
  }

  // Helper to get raw users array from storage (including passwords)
  private getRegisteredUsersRaw(): any[] {
    try {
      const usersStr = localStorage.getItem('ylt_users');
      return usersStr ? JSON.parse(usersStr) : [];
    } catch (e) {
      console.error('Error parsing registered users', e);
      return [];
    }
  }

  getLockoutTime$(): Observable<number> {
    return this.lockoutTimeSubject.asObservable();
  }
}

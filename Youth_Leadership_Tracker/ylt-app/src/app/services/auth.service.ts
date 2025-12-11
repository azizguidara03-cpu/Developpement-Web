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
  private readonly LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes

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
   * Update user details (role and/or password)
   */
  updateUser(id: number, updates: { userRole?: UserRole, password?: string }): Observable<User | null> {
    return new Observable(observer => {
      setTimeout(() => {
        const idNum = typeof id === 'string' ? parseInt(id) : id;
        const users = this.getRegisteredUsersRaw();
        const index = users.findIndex((u: any) => u.id === idNum);
        
        if (index !== -1) {
          users[index] = {
            ...users[index],
            ...updates,
            updatedAt: new Date().toISOString()
          };
          
          // Don't update password if it's empty/undefined
          if (!updates.password) {
             delete (users[index] as any).password_update_temp; // Just ensuring no side effects
             // Revert to old password implicitly by spreading ...users[index] first, 
             // but updates only contains what we send. 
             // Actually, if password IS passed, it updates. If not, it doesn't.
             // We need to be careful not to overwrite password with undefined if it wasn't passed.
             // The spread `...updates` handles this IF `updates` only contains keys we want to change.
          }

          localStorage.setItem('ylt_users', JSON.stringify(users));
          
          const updatedUser: User = {
             id: users[index].id,
             fullName: users[index].fullName,
             email: users[index].email,
             department: users[index].department,
             userRole: users[index].userRole
          };
          
          observer.next(updatedUser);
        } else {
          // Check if it's a mock user (cannot edit mock users persistently in this simple setup except in memory/session?)
          // For now, let's say we can't edit mock users or we just return success without persistent change
          // OR we could "promote" mock user to localStorage user.
          // Let's just return null for mock users for now to keep it simple, or maybe pretend success.
          // Better: Check mock users.
          const mockIndex = this.mockUsers.findIndex(u => u.id === idNum);
          if (mockIndex !== -1) {
             // We can't easily persist changes to hardcoded mockUsers without copying them to localStorage scheme.
             // For strict correctness in this mock env:
             observer.error('Cannot edit default system accounts.');
          } else {
             observer.next(null); 
          }
        }
        observer.complete();
      }, 500);
    });
  }

  // Helper to get raw users array from storage (including passwords)
  private getRegisteredUsersRaw(): any[] {
    const usersStr = localStorage.getItem('ylt_users');
    return usersStr ? JSON.parse(usersStr) : [];
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
        const allUsers = [
          ...this.mockUsers,
          ...this.getRegisteredUsers()
        ];

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
            userRole: (user.userRole as UserRole) || 'member'
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
              message: 'Account locked after 3 failed attempts. Try again in 5 minutes'
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
    const userStr = localStorage.getItem('ylt_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private checkLockoutStatus(): void {
    const lockoutTime = localStorage.getItem('ylt_lockout_time');
    if (lockoutTime) {
      const lockoutExpiry = parseInt(lockoutTime);
      if (Date.now() < lockoutExpiry) {
        this.lockoutTimeSubject.next(lockoutExpiry);
      }
    }
  }

  getLoginAttempts(): number {
    return parseInt(localStorage.getItem('ylt_login_attempts') || '0');
  }

  private getRegisteredUsers(): any[] {
    const usersStr = localStorage.getItem('ylt_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    // Ensure all registered users have a default role
    return users.map((u: any) => ({
      ...u,
      userRole: u.userRole || 'member'
    }));
  }

  getLockoutTime$(): Observable<number> {
    return this.lockoutTimeSubject.asObservable();
  }
}

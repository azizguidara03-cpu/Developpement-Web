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
  private mockUsers = [
    {
      id: 1,
      fullName: 'Admin User',
      email: 'admin@aiesec.org',
      password: 'password123',
      department: 'Information Management',
      userRole: 'admin' as UserRole
    },
    {
      id: 2,
      fullName: 'Ahmed VP',
      email: 'ahmed@aiesec.org',
      password: 'password123',
      department: 'OGV',
      userRole: 'vp' as UserRole
    },
    {
      id: 3,
      fullName: 'Fatima TL',
      email: 'fatima@aiesec.org',
      password: 'password123',
      department: 'IGT',
      userRole: 'tl' as UserRole
    },
    {
      id: 4,
      fullName: 'Ali Member',
      email: 'ali@aiesec.org',
      password: 'password123',
      department: 'Marketing',
      userRole: 'member' as UserRole
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

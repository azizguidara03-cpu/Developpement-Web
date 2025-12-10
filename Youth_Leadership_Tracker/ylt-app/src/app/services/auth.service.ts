import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, AuthResponse } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('ylt_token') && !!localStorage.getItem('ylt_user'));
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private loginAttemptsSubject = new BehaviorSubject<number>(0);
  private lockoutTimeSubject = new BehaviorSubject<number>(0);
  private readonly MAX_ATTEMPTS = 3;
  private readonly LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes

  // Mock users database
  private mockUsers = [
    {
      id: 1,
      fullName: 'Ahmed Ben Ali',
      email: 'ahmed@aiesec.org',
      password: 'password123',
      department: 'VP',
      role: 'Vice President'
    },
    {
      id: 2,
      fullName: 'Fatima Zahra',
      email: 'fatima@aiesec.org',
      password: 'password123',
      department: 'OC',
      role: 'Organizational Committee'
    }
  ];

  constructor() {
    this.checkLockoutStatus();
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
          localStorage.setItem('ylt_token', token);
          localStorage.setItem('ylt_user', JSON.stringify({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            department: user.department,
            role: user.role || 'Team Member'
          }));

          const currentUser: User = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            department: user.department,
            role: user.role || 'Team Member'
          };

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
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    // Return the current value from BehaviorSubject instead of checking localStorage
    return this.isAuthenticatedSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('ylt_token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private generateToken(): string {
    return btoa(JSON.stringify({
      user: this.currentUserSubject.value?.id,
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
    return usersStr ? JSON.parse(usersStr) : [];
  }

  getLockoutTime$(): Observable<number> {
    return this.lockoutTimeSubject.asObservable();
  }
}

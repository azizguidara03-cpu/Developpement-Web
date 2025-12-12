import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md transition-colors duration-300">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-4">
            <span class="text-white font-bold text-2xl">YLT</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Youth Leadership Tracker</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">AIESEC Local Committee Management</p>
        </div>

        <!-- Alert Messages -->
        <div *ngIf="errorMessage" class="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded">
          <p class="text-red-700 dark:text-red-400 font-medium">{{ errorMessage }}</p>
        </div>

        <div *ngIf="successMessage" class="mb-4 p-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 rounded">
          <p class="text-green-700 dark:text-green-400 font-medium">{{ successMessage }}</p>
        </div>

        <!-- Login Form -->
        <form #loginForm="ngForm" (ngSubmit)="onLogin(loginForm)" [ngClass]="{'opacity-50 pointer-events-none': isAccountLocked}">
          <!-- Email Field -->
          <div class="mb-5">
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              #emailInput="ngModel"
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              email
              class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition"
              placeholder="your.email@aiesec.org"
              [disabled]="isAccountLocked"
            />
            <p *ngIf="emailInput.invalid && emailInput.touched" class="text-red-500 dark:text-red-400 text-sm mt-1">
              Please enter a valid email address
            </p>
          </div>

          <!-- Password Field -->
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              #passwordInput="ngModel"
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              minlength="6"
              class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition"
              placeholder="••••••••"
              [disabled]="isAccountLocked"
            />
            <p *ngIf="passwordInput.invalid && passwordInput.touched" class="text-red-500 dark:text-red-400 text-sm mt-1">
              Password must be at least 6 characters
            </p>
          </div>

          <!-- Attempt Counter -->
          <div *ngIf="!isAccountLocked && loginAttempts > 0" class="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded">
            <p class="text-yellow-700 dark:text-yellow-400 text-sm font-medium">
              {{ 3 - loginAttempts }} attempt{{ (3 - loginAttempts) !== 1 ? 's' : '' }} remaining
            </p>
          </div>

          <!-- Lockout Timer -->
          <div *ngIf="isAccountLocked" class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded">
            <p class="text-red-700 dark:text-red-400 text-sm font-medium">
              Account locked. Try again in {{ lockoutCountdown }}s
            </p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="isLoading || isAccountLocked || !loginForm.valid"
            class="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span *ngIf="!isLoading">Sign In</span>
            <span *ngIf="isLoading">Signing in...</span>
          </button>
        </form>

        <!-- Sign Up Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Don't have an account?
            <a routerLink="/signup" class="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition">
              Create one here
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class LoginComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  loginAttempts = 0;
  isAccountLocked = false;
  lockoutCountdown = 0;

  private countdownInterval: any = null;

  ngOnInit(): void {
    this.checkLockoutStatusOnLoad();
  }

  private checkLockoutStatusOnLoad(): void {
    const lockoutTime = localStorage.getItem('ylt_lockout_time');
    if (lockoutTime) {
      const lockoutExpiry = parseInt(lockoutTime, 10);
      const remaining = Math.ceil((lockoutExpiry - Date.now()) / 1000);
      
      if (remaining > 0) {
        this.isAccountLocked = true;
        this.lockoutCountdown = remaining;
        this.startCountdown(lockoutExpiry);
      } else {
        localStorage.removeItem('ylt_lockout_time');
        localStorage.removeItem('ylt_login_attempts');
        this.isAccountLocked = false;
        this.loginAttempts = 0;
      }
    } else {
      this.loginAttempts = parseInt(localStorage.getItem('ylt_login_attempts') || '0', 10);
    }
    this.cdr.detectChanges();
  }

  onLogin(form: NgForm): void {
    if (form.invalid || this.isAccountLocked || this.isLoading) {
      return;
    }

    // Set loading state
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    // Subscribe to login
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        // ALWAYS reset loading state first
        this.isLoading = false;

        if (response.success) {
          this.successMessage = 'Login successful! Redirecting...';
          this.loginAttempts = 0;
          this.cdr.detectChanges();
          
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        } else {
          this.errorMessage = response.message;
          
          // Read attempts directly from localStorage
          this.loginAttempts = parseInt(localStorage.getItem('ylt_login_attempts') || '0', 10);
          
          // Check if account just got locked
          const lockoutTime = localStorage.getItem('ylt_lockout_time');
          if (lockoutTime) {
            const lockoutExpiry = parseInt(lockoutTime, 10);
            const remaining = Math.ceil((lockoutExpiry - Date.now()) / 1000);
            
            if (remaining > 0) {
              this.isAccountLocked = true;
              this.lockoutCountdown = remaining;
              this.startCountdown(lockoutExpiry);
            }
          }

          this.password = '';
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred during login. Please try again.';
        this.password = '';
        this.cdr.detectChanges();
      },
      complete: () => {
        // Ensure loading is reset even if complete fires before next
        if (this.isLoading) {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      }
    });
  }

  private startCountdown(lockoutExpiry: number): void {
    // Clear any existing interval
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }

    // Immediately set the countdown value
    this.lockoutCountdown = Math.max(0, Math.ceil((lockoutExpiry - Date.now()) / 1000));
    this.cdr.detectChanges();

    // Update every second
    this.countdownInterval = setInterval(() => {
      const remaining = Math.ceil((lockoutExpiry - Date.now()) / 1000);
      
      if (remaining <= 0) {
        // Lockout expired
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
        
        // Clear lockout state from storage
        localStorage.removeItem('ylt_lockout_time');
        localStorage.removeItem('ylt_login_attempts');
        
        // Reset component state
        this.isAccountLocked = false;
        this.loginAttempts = 0;
        this.lockoutCountdown = 0;
        this.errorMessage = '';
        this.successMessage = 'Account unlocked! You can try again.';
        this.cdr.detectChanges();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      } else {
        this.lockoutCountdown = remaining;
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }
}

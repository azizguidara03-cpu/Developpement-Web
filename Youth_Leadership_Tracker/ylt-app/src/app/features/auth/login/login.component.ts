import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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

        <!-- Demo Credentials -->
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-3">Demo Credentials:</p>
          <div class="space-y-2 text-sm">
            <p class="text-gray-700 dark:text-gray-300"><span class="font-semibold">Email:</span> ahmed@aiesec.org</p>
            <p class="text-gray-700 dark:text-gray-300"><span class="font-semibold">Password:</span> password123</p>
            <p class="text-gray-700 dark:text-gray-300"><span class="font-semibold">Email:</span> fatima@aiesec.org</p>
            <p class="text-gray-700 dark:text-gray-300"><span class="font-semibold">Password:</span> password123</p>
          </div>
        </div>

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

  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  loginAttempts = 0;
  isAccountLocked = false;
  lockoutCountdown = 0;

  private destroy$ = new Subject<void>();
  private countdownInterval: any;

  ngOnInit(): void {
    this.loginAttempts = this.authService.getLoginAttempts();
    this.checkLockoutStatus();
  }

  onLogin(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.email, this.password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;

          if (response.success) {
            this.successMessage = 'Login successful! Redirecting...';
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 1000);
          } else {
            this.errorMessage = response.message;
            this.loginAttempts = this.authService.getLoginAttempts();

            if (this.errorMessage.includes('locked')) {
              this.isAccountLocked = true;
              this.checkLockoutStatus();
            }

            this.password = '';
          }
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'An error occurred during login. Please try again.';
        }
      });
  }

  private checkLockoutStatus(): void {
    this.authService.getLockoutTime$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((lockoutTime) => {
        if (lockoutTime > 0) {
          this.isAccountLocked = true;
          this.startCountdown(lockoutTime);
        }
      });
  }

  private startCountdown(lockoutTime: number): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.countdownInterval = setInterval(() => {
      const remaining = Math.ceil((lockoutTime - Date.now()) / 1000);
      
      if (remaining <= 0) {
        clearInterval(this.countdownInterval);
        this.isAccountLocked = false;
        this.loginAttempts = 0;
        this.lockoutCountdown = 0;
        this.errorMessage = 'Account unlocked. You can try again.';
      } else {
        this.lockoutCountdown = remaining;
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}

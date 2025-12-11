import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MembersService } from '../../../services/members.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 transition-colors duration-300">
      <div class="max-w-md mx-auto">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
            YLT
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Youth Leadership Tracker</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Create your account</p>
        </div>

        <!-- Sign Up Form -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors duration-300">
          <!-- Error Message -->
          <div *ngIf="errorMessage" class="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded-lg">
            <p class="text-red-700 dark:text-red-400 font-medium text-sm">{{ errorMessage }}</p>
          </div>

          <!-- Success Message -->
          <div *ngIf="successMessage" class="mb-4 p-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 rounded-lg">
            <p class="text-green-700 dark:text-green-400 font-medium text-sm">{{ successMessage }}</p>
          </div>

          <form (ngSubmit)="signup()" #signupForm="ngForm">
            <!-- Full Name -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                [(ngModel)]="signupData.fullName"
                #fullName="ngModel"
                required
                class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition"
                placeholder="Enter your full name"
              />
              <p *ngIf="fullName.invalid && (fullName.dirty || fullName.touched)" class="text-red-500 dark:text-red-400 text-sm mt-1">
                Full name is required
              </p>
            </div>

            <!-- Email -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                [(ngModel)]="signupData.email"
                #email="ngModel"
                required
                email
                class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition"
                placeholder="Enter your email"
              />
              <p *ngIf="email.invalid && (email.dirty || email.touched)" class="text-red-500 dark:text-red-400 text-sm mt-1">
                {{ email.errors?.['required'] ? 'Email is required' : 'Please enter a valid email' }}
              </p>
            </div>

            <!-- Password -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                [(ngModel)]="signupData.password"
                #password="ngModel"
                required
                minlength="6"
                class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition"
                placeholder="Enter your password (min 6 characters)"
              />
              <p *ngIf="password.invalid && (password.dirty || password.touched)" class="text-red-500 dark:text-red-400 text-sm mt-1">
                {{ password.errors?.['required'] ? 'Password is required' : 'Password must be at least 6 characters' }}
              </p>
            </div>

            <!-- Confirm Password -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                [(ngModel)]="signupData.confirmPassword"
                #confirmPassword="ngModel"
                required
                class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition"
                placeholder="Confirm your password"
              />
              <p *ngIf="confirmPassword.invalid && (confirmPassword.dirty || confirmPassword.touched)" class="text-red-500 dark:text-red-400 text-sm mt-1">
                {{ confirmPassword.errors?.['required'] ? 'Confirmation is required' : '' }}
              </p>
              <p *ngIf="signupData.password && signupData.confirmPassword && signupData.password !== signupData.confirmPassword" class="text-red-500 dark:text-red-400 text-sm mt-1">
                Passwords do not match
              </p>
            </div>

            <!-- Department -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
              <select
                name="department"
                [(ngModel)]="signupData.department"
                #department="ngModel"
                required
                class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition"
              >
                <option value="">Select a department</option>
                <option value="IGV">IGV (Incoming Global Volunteer)</option>
                <option value="IGT">IGT (Incoming Global Talent)</option>
                <option value="OGV">OGV (Outgoing Global Volunteer)</option>
                <option value="OGT">OGT (Outgoing Global Talent)</option>
                <option value="Talent Management">Talent Management</option>
                <option value="Finance">Finance</option>
                <option value="Business Development">Business Development</option>
                <option value="Marketing">Marketing</option>
                <option value="Information Management">Information Management</option>
              </select>
              <p *ngIf="department.invalid && (department.dirty || department.touched)" class="text-red-500 dark:text-red-400 text-sm mt-1">
                Department is required
              </p>
            </div>

            <!-- Sign Up Button -->
            <button
              type="submit"
              [disabled]="!signupForm.valid || isLoading"
              class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? 'Creating Account...' : 'Create Account' }}
            </button>
          </form>

          <!-- Login Link -->
          <div class="mt-6 text-center">
            <p class="text-gray-600 dark:text-gray-400">
              Already have an account?
              <a routerLink="/login" class="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition">
                Sign in here
              </a>
            </p>
          </div>
        </div>

        <!-- Info Box -->
        <div class="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Demo Credentials</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Or use these existing accounts:</p>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2">
              <span class="text-gray-600 dark:text-gray-400"><strong>Email:</strong> ahmed@aiesec.org</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-600 dark:text-gray-400"><strong>Password:</strong> password123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class SignupComponent implements OnInit {
  private authService = inject(AuthService);
  private membersService = inject(MembersService);
  private router = inject(Router);

  signupData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: ''
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    // Redirect to dashboard if already logged in
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  signup(): void {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validate passwords match
    if (this.signupData.password !== this.signupData.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    // Validate password length
    if (this.signupData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.isLoading = true;

    // Simulate signup process
    setTimeout(() => {
      // Check if email already exists
      const existingUsers = localStorage.getItem('ylt_users');
      let users = existingUsers ? JSON.parse(existingUsers) : [];

      const emailExists = users.some((u: any) => u.email === this.signupData.email);
      if (emailExists) {
        this.errorMessage = 'This email is already registered. Please use a different email or login.';
        this.isLoading = false;
        return;
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        fullName: this.signupData.fullName,
        email: this.signupData.email,
        password: this.signupData.password,
        department: this.signupData.department,
        role: 'Team Member',
        createdAt: new Date().toISOString()
      };

      // Save to users list
      users.push(newUser);
      localStorage.setItem('ylt_users', JSON.stringify(users));

      // Also add user to members list
      this.addUserToMembers(newUser);

      // Automatically log in the user using auth service login method
      this.authService.login(this.signupData.email, this.signupData.password)
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.successMessage = 'Account created and logged in successfully!';
              setTimeout(() => {
                this.isLoading = false;
                this.router.navigate(['/dashboard']);
              }, 1000);
            }
          },
          error: () => {
            this.errorMessage = 'Error during login. Please login manually.';
            this.isLoading = false;
          }
        });
    }, 1000);
  }

  private addUserToMembers(user: any): void {
    const membersStr = localStorage.getItem('ylt_members');
    const members = membersStr ? JSON.parse(membersStr) : [];

    // Check if member already exists
    const memberExists = members.some((m: any) => m.email === user.email);
    if (memberExists) {
      return;
    }

    // Create member object
    const newMember = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      department: user.department,
      age: null,
      skills: [],
      createdAt: user.createdAt,
      updatedAt: user.createdAt
    };

    members.push(newMember);
    localStorage.setItem('ylt_members', JSON.stringify(members));
  }
}

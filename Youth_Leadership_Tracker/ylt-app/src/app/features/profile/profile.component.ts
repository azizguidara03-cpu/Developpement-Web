import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-4xl mx-auto px-4 py-6">
          <h1 class="text-3xl font-bold text-gray-900">User Profile</h1>
          <p class="text-gray-600 mt-2">Manage your account information</p>
        </div>
      </div>

      <!-- Main Content -->
      <div *ngIf="currentUser" class="max-w-4xl mx-auto px-4 py-8">
        <!-- Alert Messages -->
        <div *ngIf="successMessage" class="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
          <p class="text-green-700 font-medium">{{ successMessage }}</p>
        </div>

        <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <p class="text-red-700 font-medium">{{ errorMessage }}</p>
        </div>

        <!-- Profile Card -->
        <div class="bg-white rounded-lg shadow-md p-8 mb-8">
          <!-- Avatar and Basic Info -->
          <div class="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
              {{ currentUser.fullName.charAt(0) }}{{ currentUser.fullName.split(' ')[1]?.charAt(0) }}
            </div>
            <div class="flex-1">
              <h2 class="text-3xl font-bold text-gray-900">{{ currentUser.fullName }}</h2>
              <p class="text-gray-600 mt-1">{{ currentUser.email }}</p>
              <div class="flex gap-4 mt-4">
                <span class="px-3 py-1 bg-blue-100 text-blue-800 font-semibold text-sm rounded-full">
                  {{ currentUser.department }}
                </span>
                <span class="px-3 py-1 bg-indigo-100 text-indigo-800 font-semibold text-sm rounded-full">
                  {{ currentUser.role }}
                </span>
              </div>
            </div>
          </div>

          <!-- Profile Information -->
          <div class="mb-8">
            <h3 class="text-lg font-bold text-gray-900 mb-6">Account Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Full Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  [(ngModel)]="editedUser.fullName"
                  [disabled]="!isEditMode"
                  class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg disabled:bg-gray-50 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  [(ngModel)]="editedUser.email"
                  [disabled]="!isEditMode"
                  class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg disabled:bg-gray-50 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <!-- Department -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  [(ngModel)]="editedUser.department"
                  [disabled]="!isEditMode"
                  class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg disabled:bg-gray-50 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <!-- Role -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  [(ngModel)]="editedUser.role"
                  [disabled]="!isEditMode"
                  class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg disabled:bg-gray-50 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>
          </div>

          <!-- Bio Section -->
          <div class="mb-8">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Bio</h3>
            <textarea
              [(ngModel)]="editedUser.bio"
              [disabled]="!isEditMode"
              rows="4"
              class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg disabled:bg-gray-50 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500 transition"
              placeholder="Add a short bio about yourself..."
            ></textarea>
          </div>

          <!-- Edit/Save Buttons -->
          <div class="flex gap-4 pt-8 border-t border-gray-200">
            <button
              *ngIf="!isEditMode"
              (click)="startEdit()"
              class="flex-1 px-6 py-3 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition"
            >
              Edit Profile
            </button>
            <button
              *ngIf="isEditMode"
              (click)="saveProfile()"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50"
              [disabled]="isSaving"
            >
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </button>
            <button
              *ngIf="isEditMode"
              (click)="cancelEdit()"
              class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>

        <!-- Security Section -->
        <div class="bg-white rounded-lg shadow-md p-8 mb-8">
          <h3 class="text-lg font-bold text-gray-900 mb-6">Security</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="font-semibold text-gray-900">Password</p>
                <p class="text-gray-600 text-sm">Last changed 3 months ago</p>
              </div>
              <button
                disabled
                class="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg cursor-not-allowed opacity-50"
              >
                Change Password
              </button>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="font-semibold text-gray-900">Two-Factor Authentication</p>
                <p class="text-gray-600 text-sm">Not enabled</p>
              </div>
              <button
                disabled
                class="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg cursor-not-allowed opacity-50"
              >
                Enable
              </button>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- View Statistics -->
          <a
            routerLink="/dashboard"
            class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6 hover:shadow-2xl hover:scale-105 hover:from-blue-600 hover:to-blue-700 transition duration-300 cursor-pointer block"
          >
            <svg class="w-8 h-8 mb-3 opacity-80 group-hover:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <h3 class="text-xl font-bold mb-2">Dashboard</h3>
            <p class="text-blue-100 mb-4">View statistics and analytics</p>
            <span class="inline-block px-4 py-2 bg-blue-400 rounded-lg text-sm font-semibold hover:bg-blue-300 transition">View →</span>
          </a>

          <!-- Logout -->
          <button
            (click)="logout()"
            class="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow-md p-6 hover:shadow-2xl hover:scale-105 hover:from-red-600 hover:to-red-700 transition duration-300 cursor-pointer block text-left hover:font-bold"
          >
            <svg class="w-8 h-8 mb-3 opacity-80 hover:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <h3 class="text-xl font-bold mb-2">Logout</h3>
            <p class="text-red-100 mb-4">Sign out from your account</p>
            <span class="inline-block px-4 py-2 bg-red-400 rounded-lg text-sm font-semibold hover:bg-red-300 transition">Logout →</span>
          </button>
        </div>
      </div>

      <!-- Not Found -->
      <div *ngIf="!currentUser && !isLoading" class="max-w-4xl mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Not logged in</h2>
          <p class="text-gray-600 mb-4">Please log in to view your profile.</p>
          <a
            routerLink="/login"
            class="inline-block px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Go to Login
          </a>
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
export class ProfileComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser: User | null = null;
  editedUser: Partial<User> = {};
  isEditMode = false;
  isSaving = false;
  isLoading = true;
  successMessage = '';
  errorMessage = '';

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
        this.editedUser = { ...user };
        this.isLoading = false;
      });
  }

  startEdit(): void {
    this.isEditMode = true;
    this.editedUser = { ...this.currentUser };
  }

  saveProfile(): void {
    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    setTimeout(() => {
      // Simulate save to localStorage
      if (this.currentUser) {
        const updatedUser = {
          ...this.currentUser,
          ...this.editedUser
        };

        localStorage.setItem('ylt_user', JSON.stringify(updatedUser));
        this.currentUser = updatedUser;

        this.isSaving = false;
        this.isEditMode = false;
        this.successMessage = 'Profile updated successfully!';

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      }
    }, 500);
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editedUser = { ...this.currentUser };
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

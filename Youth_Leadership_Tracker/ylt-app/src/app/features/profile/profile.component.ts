import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { User } from '../../models/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div class="max-w-4xl mx-auto px-4 py-6">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ 'user_profile' | translate }}</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">{{ 'manage_account_info' | translate }}</p>
        </div>
      </div>

      <!-- Main Content -->
      <div *ngIf="currentUser" class="max-w-4xl mx-auto px-4 py-8">
        <!-- Alert Messages -->
        <div *ngIf="successMessage" class="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 rounded-lg">
          <p class="text-green-700 dark:text-green-400 font-medium">{{ successMessage }}</p>
        </div>

        <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded-lg">
          <p class="text-red-700 dark:text-red-400 font-medium">{{ errorMessage }}</p>
        </div>

        <!-- Profile Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8 transition-colors duration-300">
          <!-- Avatar and Basic Info -->
          <div class="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
              {{ currentUser.fullName.charAt(0) }}{{ currentUser.fullName.split(' ')[1]?.charAt(0) }}
            </div>
            <div class="flex-1">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white">{{ currentUser.fullName }}</h2>
              <p class="text-gray-600 dark:text-gray-400 mt-1">{{ currentUser.email }}</p>
              <div class="flex gap-4 mt-4">
                <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-semibold text-sm rounded-full">
                  {{ currentUser.department | translate }}
                </span>
                <span class="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 font-semibold text-sm rounded-full uppercase">
                  {{ currentUser.userRole | translate }}
                </span>
              </div>
            </div>
          </div>

          <!-- Profile Information -->
          <div class="mb-8">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">{{ 'account_information' | translate }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Full Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ 'full_name' | translate }}</label>
                <input
                  type="text"
                  [value]="currentUser.fullName"
                  disabled
                  class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg cursor-not-allowed"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ 'email' | translate }}</label>
                <input
                  type="email"
                  [value]="currentUser.email"
                  disabled
                  class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg cursor-not-allowed"
                />
              </div>

              <!-- Department -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ 'department' | translate }}</label>
                <input
                  type="text"
                  [value]="currentUser.department | translate"
                  disabled
                  class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg cursor-not-allowed"
                />
              </div>

              <!-- Role (Read-only) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ 'role' | translate }}</label>
                <input
                  type="text"
                  [value]="(editedUser.userRole?.toUpperCase() || '') | translate"
                  disabled
                  class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg cursor-not-allowed"
                />

              </div>
            </div>
          </div>

          <!-- Bio Section -->
          <div class="mb-8">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">{{ 'bio' | translate }}</h3>
            <textarea
              [(ngModel)]="editedUser.bio"
              [disabled]="!isEditMode"
              rows="4"
              class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg disabled:bg-gray-50 dark:disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500 transition"
              [placeholder]="'bio_placeholder' | translate"
            ></textarea>
          </div>

          <!-- Edit/Save Buttons -->
          <div class="flex gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              *ngIf="!isEditMode"
              (click)="startEdit()"
              class="flex-1 px-6 py-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
            >
              {{ 'edit_profile' | translate }}
            </button>
            <button
              *ngIf="isEditMode"
              (click)="saveProfile()"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50"
              [disabled]="isSaving"
            >
              {{ isSaving ? ('saving' | translate) : ('save_changes' | translate) }}
            </button>
            <button
              *ngIf="isEditMode"
              (click)="cancelEdit()"
              class="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {{ 'cancel' | translate }}
            </button>
          </div>
        </div>

        <!-- Security Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8 transition-colors duration-300">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">{{ 'security' | translate }}</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">{{ 'password' | translate }}</p>
                <p class="text-gray-600 dark:text-gray-400 text-sm">{{ 'password_last_changed' | translate }}</p>
              </div>
              <button
                disabled
                class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-400 font-semibold rounded-lg cursor-not-allowed opacity-50"
              >
                {{ 'change_password' | translate }}
              </button>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">{{ 'two_factor_auth' | translate }}</p>
                <p class="text-gray-600 dark:text-gray-400 text-sm">{{ 'not_enabled' | translate }}</p>
              </div>
              <button
                disabled
                class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-400 font-semibold rounded-lg cursor-not-allowed opacity-50"
              >
                {{ 'enable' | translate }}
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
            <h3 class="text-xl font-bold mb-2">{{ 'dashboard' | translate }}</h3>
            <p class="text-blue-100 mb-4">{{ 'view_statistics_desc' | translate }}</p>
            <span class="inline-block px-4 py-2 bg-blue-400 rounded-lg text-sm font-semibold hover:bg-blue-300 transition">{{ 'view_details' | translate }} →</span>
          </a>

          <!-- Logout -->
          <button
            (click)="logout()"
            class="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow-md p-6 hover:shadow-2xl hover:scale-105 hover:from-red-600 hover:to-red-700 transition duration-300 cursor-pointer block text-left hover:font-bold"
          >
            <svg class="w-8 h-8 mb-3 opacity-80 hover:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <h3 class="text-xl font-bold mb-2">{{ 'logout' | translate }}</h3>
            <p class="text-red-100 mb-4">{{ 'sign_out_desc' | translate }}</p>
            <span class="inline-block px-4 py-2 bg-red-400 rounded-lg text-sm font-semibold hover:bg-red-300 transition">{{ 'logout' | translate }} →</span>
          </button>
        </div>
      </div>

      <!-- Not Found -->
      <div *ngIf="!currentUser && !isLoading" class="max-w-4xl mx-auto px-4 py-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center transition-colors duration-300">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ 'not_logged_in' | translate }}</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ 'login_prompt' | translate }}</p>
          <a
            routerLink="/login"
            class="inline-block px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            {{ 'go_to_login' | translate }}
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
  languageService = inject(LanguageService);

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
    if (!this.currentUser) return;
    
    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Create updated user object
    const updatedUser: User = {
      ...this.currentUser,
      fullName: this.editedUser.fullName || this.currentUser.fullName,
      email: this.editedUser.email || this.currentUser.email,
      department: this.editedUser.department || this.currentUser.department,
      bio: this.editedUser.bio
    };

    // Update in localStorage and AuthService
    this.authService.updateProfile(updatedUser);
    
    // Update local state immediately
    this.currentUser = updatedUser;
    this.editedUser = { ...updatedUser };
    
    // Exit edit mode and show success
    this.isSaving = false;
    this.isEditMode = false;
    this.successMessage = this.languageService.translate('profile_updated_success');

    // Clear success message after 3 seconds
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
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

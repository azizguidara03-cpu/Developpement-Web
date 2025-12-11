import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MembersService } from '../../../services/members.service';
import { Member, MemberFormData } from '../../../models/member';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Skills, DEPARTMENTS, DEPARTMENT_LABELS } from '../../../models/enums';
import { AuthService } from '../../../services/auth.service';
import { User, UserRole } from '../../../models/auth';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-member-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-4xl mx-auto px-4 py-6">
          <div class="flex items-center gap-3 mb-2">
            <a routerLink="/members" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
              ← Back to Members
            </a>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ isEditMode ? 'Edit Member' : 'Create New Member' }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            {{ isEditMode ? 'Update member information' : 'Add a new member to your committee' }}
          </p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-4xl mx-auto px-4 py-8">
        <!-- Alert Messages -->
        <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded-lg">
          <p class="text-red-700 dark:text-red-400 font-medium">{{ errorMessage }}</p>
        </div>

        <div *ngIf="successMessage" class="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 rounded-lg">
          <p class="text-green-700 dark:text-green-400 font-medium">{{ successMessage }}</p>
        </div>

        <!-- Form -->
        <form [formGroup]="memberForm" (ngSubmit)="onSubmit()" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Full Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                formControlName="fullName"
                class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                placeholder="Enter full name"
              />
              <p *ngIf="isFieldInvalid('fullName')" class="text-red-500 dark:text-red-400 text-sm mt-1">
                Full name is required
              </p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                type="email"
                formControlName="email"
                class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                placeholder="your.email@aiesec.org"
              />
              <p *ngIf="isFieldInvalid('email')" class="text-red-500 dark:text-red-400 text-sm mt-1">
                Valid email is required
              </p>
            </div>

            <!-- Department -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department <span class="text-red-500">*</span>
              </label>
              <select
                formControlName="department"
                class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
              >
                <option value="">Select Department</option>
                <option *ngFor="let dept of departments" [value]="dept">
                  {{ getDepartmentLabel(dept) }}
                </option>
              </select>
              <p *ngIf="isFieldInvalid('department')" class="text-red-500 dark:text-red-400 text-sm mt-1">
                Department is required
              </p>
            </div>

            <!-- Age -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Age</label>
              <input
                type="number"
                formControlName="age"
                min="18"
                max="65"
                class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                placeholder="Optional"
              />
            </div>
          </div>

          <!-- User Account Setup (Always visible for admin to manage access) -->
          <div *ngIf="!isLoading" class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {{ isEditMode ? 'Manage Access' : 'User Account Access' }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Role -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  System Role <span class="text-red-500">*</span>
                </label>
                <select
                  formControlName="role"
                  class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                >
                  <option value="member">Member</option>
                  <option value="tl">Team Leader</option>
                  <option value="vp">Vice President</option>
                  <option value="admin">Admin</option>
                </select>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Determines what they can access in the system</p>
              </div>

              <!-- Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Login Password <span class="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  formControlName="password"
                  class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                  [placeholder]="isEditMode ? 'Leave blank to keep current password' : 'Set login password'"
                />
                <p *ngIf="isFieldInvalid('password')" class="text-red-500 dark:text-red-400 text-sm mt-1">
                  Password (min 6 chars) is required for new accounts
                </p>
              </div>
            </div>
          </div>

          <!-- Skills Selection -->
          <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Skills <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              @for (skill of skillsList; track skill) {
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    [id]="'skill-' + skill"
                    (change)="toggleSkill(skill)"
                    [checked]="memberForm.get('skills')?.value.includes(skill)"
                    class="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label [for]="'skill-' + skill" class="ml-3 text-gray-700 dark:text-gray-300 cursor-pointer">
                    {{ skill }}
                  </label>
                </div>
              }
            </div>
            <p *ngIf="isFieldInvalid('skills')" class="text-red-500 dark:text-red-400 text-sm mt-2">
              Select at least one skill
            </p>
          </div>

          <!-- Selected Skills Display -->
          <div *ngIf="memberForm.get('skills')?.value.length > 0" class="mt-4">
            <div class="flex flex-wrap gap-2">
              @for (skill of memberForm.get('skills')?.value; track skill) {
                <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-sm font-semibold rounded-full">
                  {{ skill }}
                </span>
              }
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="flex gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              [disabled]="isLoading || !memberForm.valid"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="!isLoading">
                {{ isEditMode ? 'Update Member' : 'Create Member' }}
              </span>
              <span *ngIf="isLoading">Processing...</span>
            </button>
            <a
              routerLink="/members"
              class="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-center"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class MemberFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private membersService = inject(MembersService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  memberForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  memberId: number | null = null;

  departments = DEPARTMENTS;
  skillsList = Object.values(Skills);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm(): void {
    const baseForm = {
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      age: [null],
      skills: [[], Validators.required],
      role: ['member', Validators.required],
      password: ['', this.isEditMode ? [Validators.minLength(6)] : [Validators.required, Validators.minLength(6)]]
    };

    this.memberForm = this.fb.group(baseForm);
  }

  private checkEditMode(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params['id']) {
          this.isEditMode = true;
          this.memberId = params['id'];
          this.loadMemberData();
        }
      });
  }

  private loadMemberData(): void {
    if (this.memberId) {
      this.membersService.getMemberById(this.memberId)
        .pipe(
          takeUntil(this.destroy$),
          switchMap(member => {
            if (!member) return of(null);
            // Also fetch user data to get the role
            return this.authService.getUserById(member.id).pipe(
              switchMap(user => of({ member, user }))
            );
          })
        )
        .subscribe((data) => {
          if (data && data.member) {
            this.memberForm.patchValue({
              fullName: data.member.fullName,
              email: data.member.email,
              department: data.member.department,
              age: data.member.age,
              skills: data.member.skills,
              role: data.user?.userRole || 'member', // Default to member if no user found
              password: '' // Always empty/blank initially
            });
            
            // Adjust password validation for edit mode
            this.memberForm.get('password')?.removeValidators(Validators.required);
            this.memberForm.get('password')?.updateValueAndValidity();
            
          } else {
            this.errorMessage = 'Member not found';
            setTimeout(() => this.router.navigate(['/members']), 2000);
          }
        });
    }
  }

  onSubmit(): void {
    if (!this.memberForm.valid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData: MemberFormData = {
      fullName: this.memberForm.value.fullName,
      email: this.memberForm.value.email,
      department: this.memberForm.value.department,
      age: this.memberForm.value.age,
      skills: this.memberForm.value.skills
    };

    let operation$;

    if (this.isEditMode) {
      // Update Member AND User
      operation$ = this.membersService.updateMember(this.memberId!, formData).pipe(
        switchMap((updatedMember) => {
          if (!updatedMember) return of(null);
          
          // Only update user if role changed or password provided
          const updates: any = {
             userRole: this.memberForm.value.role as UserRole
          };
          
          if (this.memberForm.value.password) {
             updates.password = this.memberForm.value.password;
          }
          
          return this.authService.updateUser(this.memberId!, updates).pipe(
             switchMap(() => of(updatedMember)),
             // Catch error if updating default accounts fails, but still return success for member update
             // or let it fail? Let's catch and just warn if needed, or propagate error.
             // For now, let's propagate.
          );
        })
      );
    } else {
      // Create member AND register user
      operation$ = this.membersService.createMember(formData).pipe(
        switchMap((newMember) => {
          const newUser: User = {
            id: newMember.id,
            fullName: newMember.fullName,
            email: newMember.email,
            department: newMember.department,
            userRole: this.memberForm.value.role as UserRole
          };
          return this.authService.registerUser(newUser, this.memberForm.value.password).pipe(
            switchMap(() => of(newMember)) // Return the member to keep consistent with update flow
          );
        })
      );
    }

    operation$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          if (result) {
            this.successMessage = this.isEditMode
              ? 'Member updated successfully! Redirecting...'
              : 'Member and User access created successfully! Redirecting...';
            setTimeout(() => {
              this.router.navigate(['/members', result.id]);
            }, 1500);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = typeof err === 'string' ? err : 'An error occurred. Please try again.';
        }
      });
  }

  toggleSkill(skill: string): void {
    const skills = this.memberForm.get('skills')?.value || [];
    const index = skills.indexOf(skill);

    if (index > -1) {
      skills.splice(index, 1);
    } else {
      skills.push(skill);
    }

    this.memberForm.get('skills')?.setValue(skills);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.memberForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getDepartmentLabel(dept: string): string {
    return DEPARTMENT_LABELS[dept] || dept;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

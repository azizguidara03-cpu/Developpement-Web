import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MembersService } from '../../../services/members.service';
import { Member, MemberFormData } from '../../../models/member';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Skills, DEPARTMENTS } from '../../../models/enums';

@Component({
  selector: 'app-member-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-4xl mx-auto px-4 py-6">
          <div class="flex items-center gap-3 mb-2">
            <a routerLink="/members" class="text-blue-600 hover:text-blue-700 font-semibold">
              ← Back to Members
            </a>
          </div>
          <h1 class="text-3xl font-bold text-gray-900">
            {{ isEditMode ? 'Edit Member' : 'Create New Member' }}
          </h1>
          <p class="text-gray-600 mt-2">
            {{ isEditMode ? 'Update member information' : 'Add a new member to your committee' }}
          </p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-4xl mx-auto px-4 py-8">
        <!-- Alert Messages -->
        <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <p class="text-red-700 font-medium">{{ errorMessage }}</p>
        </div>

        <div *ngIf="successMessage" class="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
          <p class="text-green-700 font-medium">{{ successMessage }}</p>
        </div>

        <!-- Form -->
        <form [formGroup]="memberForm" (ngSubmit)="onSubmit()" class="bg-white rounded-lg shadow-md p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Full Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                formControlName="fullName"
                class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                placeholder="Enter full name"
              />
              <p *ngIf="isFieldInvalid('fullName')" class="text-red-500 text-sm mt-1">
                Full name is required
              </p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                type="email"
                formControlName="email"
                class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                placeholder="your.email@aiesec.org"
              />
              <p *ngIf="isFieldInvalid('email')" class="text-red-500 text-sm mt-1">
                Valid email is required
              </p>
            </div>

            <!-- Department -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Department <span class="text-red-500">*</span>
              </label>
              <select
                formControlName="department"
                class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
              >
                <option value="">Select Department</option>
                <option *ngFor="let dept of departments" [value]="dept">
                  {{ getDepartmentLabel(dept) }}
                </option>
              </select>
              <p *ngIf="isFieldInvalid('department')" class="text-red-500 text-sm mt-1">
                Department is required
              </p>
            </div>

            <!-- Age -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                formControlName="age"
                min="18"
                max="65"
                class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                placeholder="Optional"
              />
            </div>
          </div>

          <!-- Skills Selection -->
          <div class="mt-8 pt-8 border-t border-gray-200">
            <label class="block text-sm font-medium text-gray-700 mb-4">
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
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label [for]="'skill-' + skill" class="ml-3 text-gray-700 cursor-pointer">
                    {{ skill }}
                  </label>
                </div>
              }
            </div>
            <p *ngIf="isFieldInvalid('skills')" class="text-red-500 text-sm mt-2">
              Select at least one skill
            </p>
          </div>

          <!-- Selected Skills Display -->
          <div *ngIf="memberForm.get('skills')?.value.length > 0" class="mt-4">
            <div class="flex flex-wrap gap-2">
              @for (skill of memberForm.get('skills')?.value; track skill) {
                <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                  {{ skill }}
                </span>
              }
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="flex gap-4 mt-8 pt-8 border-t border-gray-200">
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
              class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition text-center"
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
    this.memberForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      age: [null],
      skills: [[], Validators.required]
    });
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
        .pipe(takeUntil(this.destroy$))
        .subscribe((member) => {
          if (member) {
            this.memberForm.patchValue({
              fullName: member.fullName,
              email: member.email,
              department: member.department,
              age: member.age,
              skills: member.skills
            });
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

    const formData: MemberFormData = this.memberForm.value;

    const operation$ = this.isEditMode
      ? this.membersService.updateMember(this.memberId!, formData)
      : this.membersService.createMember(formData);

    operation$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          if (result) {
            this.successMessage = this.isEditMode
              ? 'Member updated successfully! Redirecting...'
              : 'Member created successfully! Redirecting...';
            setTimeout(() => {
              this.router.navigate(['/members', result.id]);
            }, 1500);
          }
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'An error occurred. Please try again.';
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
    const labels: { [key: string]: string } = {
      'TM': 'Team Member',
      'TL': 'Team Leader',
      'OGX': 'Organizational',
      'ICX': 'International Cooperation',
      'ER': 'Experience Research',
      'VP': 'Vice President',
      'OC': 'Organizational Committee',
      'EST': 'External'
    };
    return labels[dept] || dept;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

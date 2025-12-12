import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ExperiencesService } from '../../../services/experiences.service';
import { MembersService } from '../../../services/members.service';
import { LanguageService } from '../../../services/language.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { Experience, ExperienceFormData } from '../../../models/experience';
import { Member } from '../../../models/member';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Skills } from '../../../models/enums';

@Component({
  selector: 'app-experience-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-4xl mx-auto px-4 py-6">
          <div class="flex items-center gap-3 mb-2">
            <a routerLink="/experiences" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
              ← {{ 'back_to_experiences' | translate }}
            </a>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ (isEditMode ? 'edit_experience' : 'create_new_experience') | translate }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            {{ (isEditMode ? 'update_experience_desc' : 'add_new_experience_desc') | translate }}
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
        <form [formGroup]="experienceForm" (ngSubmit)="onSubmit()" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Member Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'member' | translate }} <span class="text-red-500">*</span>
              </label>
              <select
                formControlName="memberId"
                class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
              >
                <option value="">{{ 'select_member' | translate }}</option>
                @for (member of members; track member.id) {
                  <option [value]="member.id">{{ member.fullName }}</option>
                }
              </select>
              <p *ngIf="isFieldInvalid('memberId')" class="text-red-500 dark:text-red-400 text-sm mt-1">
                {{ 'member' | translate }} {{ 'required_field' | translate }}
              </p>
            </div>

            <!-- Role -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'role' | translate }} <span class="text-red-500">*</span>
              </label>
              <select
                formControlName="role"
                class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
              >
                <option value="">{{ 'select_role' | translate }}</option>
                <option value="Team Member">{{ 'team_member' | translate }}</option>
                <option value="Team Leader">{{ 'team_leader' | translate }}</option>
                <option value="Vice President">{{ 'vice_president' | translate }}</option>
                <option value="Local Committee President">{{ 'local_committee_president' | translate }}</option>
                <option value="OC Member">{{ 'oc_member' | translate }}</option>
                <option value="OC Vice President">{{ 'oc_vice_president' | translate }}</option>
                <option value="OC President">{{ 'oc_president' | translate }}</option>
                <option value="Local Support Team">{{ 'local_support_team' | translate }}</option>
                <option value="Entity Support Team">{{ 'entity_support_team' | translate }}</option>
              </select>
              <p *ngIf="isFieldInvalid('role')" class="text-red-500 dark:text-red-400 text-sm mt-1">
                {{ 'role' | translate }} {{ 'required_field' | translate }}
              </p>
            </div>

            <!-- Department -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'department' | translate }} <span class="text-red-500">*</span>
              </label>
              <select
                formControlName="department"
                class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
              >
                <option value="">{{ 'select_department' | translate }}</option>
                <option value="IGV">{{ 'IGV' | translate }}</option>
                <option value="IGT">{{ 'IGT' | translate }}</option>
                <option value="OGV">{{ 'OGV' | translate }}</option>
                <option value="OGT">{{ 'OGT' | translate }}</option>
                <option value="Talent Management">{{ 'tm' | translate }}</option>
                <option value="Finance">{{ 'finance' | translate }}</option>
                <option value="Business Development">{{ 'bd' | translate }}</option>
                <option value="Marketing">{{ 'marketing' | translate }}</option>
                <option value="Information Management">{{ 'im' | translate }}</option>
              </select>
              <p *ngIf="isFieldInvalid('department')" class="text-red-500 dark:text-red-400 text-sm mt-1">
                {{ 'department' | translate }} {{ 'required_field' | translate }}
              </p>
            </div>

            <!-- Start Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'start_date' | translate }} <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                formControlName="startDate"
                class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
              />
              <p *ngIf="isFieldInvalid('startDate')" class="text-red-500 dark:text-red-400 text-sm mt-1">
                {{ 'start_date' | translate }} {{ 'required_field' | translate }}
              </p>
            </div>

            <!-- End Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'end_date_optional' | translate }}
              </label>
              <input
                type="date"
                formControlName="endDate"
                class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
              />
            </div>
          </div>

          <!-- Description (English) -->
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ 'description' | translate }} (English) <span class="text-red-500">*</span>
            </label>
            <textarea
              formControlName="description"
              rows="4"
              class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
              [placeholder]="'describe_experience_en' | translate"
            ></textarea>
            <p *ngIf="isFieldInvalid('description')" class="text-red-500 dark:text-red-400 text-sm mt-1">
              {{ 'description' | translate }} {{ 'required_field' | translate }}
            </p>
          </div>

          <!-- Description (French) -->
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ 'describe_experience_fr' | translate }}
            </label>
            <textarea
              formControlName="description_fr"
              rows="4"
              class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
              [placeholder]="'describe_experience_fr_placeholder' | translate"
            ></textarea>
          </div>

          <!-- Description (Spanish) -->
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ 'describe_experience_es' | translate }}
            </label>
            <textarea
              formControlName="description_es"
              rows="4"
              class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
              [placeholder]="'describe_experience_es_placeholder' | translate"
            ></textarea>
          </div>

          <!-- Skills Selection -->
          <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              {{ 'skills_gained' | translate }} <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              @for (skill of skillsList; track skill) {
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    [id]="'skill-' + skill"
                    (change)="toggleSkill(skill)"
                    [checked]="experienceForm.get('skillsGained')?.value.includes(skill)"
                    class="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label [for]="'skill-' + skill" class="ml-3 text-gray-700 dark:text-gray-300 cursor-pointer">
                    {{ skill | translate }}
                  </label>
                </div>
              }
            </div>
            <p *ngIf="isFieldInvalid('skillsGained')" class="text-red-500 dark:text-red-400 text-sm mt-2">
              {{ 'select_at_least_one_skill' | translate }}
            </p>
          </div>

          <!-- Selected Skills Display -->
          <div *ngIf="experienceForm.get('skillsGained')?.value.length > 0" class="mt-4">
            <div class="flex flex-wrap gap-2">
              @for (skill of experienceForm.get('skillsGained')?.value; track skill) {
                <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-sm font-semibold rounded-full">
                  {{ skill | translate }}
                </span>
              }
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="flex gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              [disabled]="isLoading || !experienceForm.valid"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="!isLoading">
                {{ (isEditMode ? 'update_experience' : 'create_experience') | translate }}
              </span>
              <span *ngIf="isLoading">{{ 'processing' | translate }}</span>
            </button>
            <a
              routerLink="/experiences"
              class="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-center"
            >
              {{ 'cancel' | translate }}
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
export class ExperienceFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private experiencesService = inject(ExperiencesService);
  private membersService = inject(MembersService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  languageService = inject(LanguageService);

  experienceForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  experienceId: number | null = null;

  members: Member[] = [];
  skillsList = Object.values(Skills);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadMembers();
    this.initializeForm();
    this.checkEditMode();
  }

  private loadMembers(): void {
    this.membersService.getAllMembers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((members) => {
        this.members = members;
      });
  }

  private initializeForm(): void {
    this.experienceForm = this.fb.group({
      memberId: [null, Validators.required],
      role: ['', Validators.required],
      department: ['', Validators.required],
      description: ['', Validators.required],
      description_fr: [''],
      description_es: [''],
      startDate: ['', Validators.required],
      endDate: [null],
      skillsGained: [[], Validators.required]
    });
  }

  private checkEditMode(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params['id']) {
          this.isEditMode = true;
          this.experienceId = params['id'];
          this.loadExperienceData();
        } else {
          // Pre-fill memberId from query params if available
          this.activatedRoute.queryParams
            .pipe(takeUntil(this.destroy$))
            .subscribe((queryParams) => {
              if (queryParams['memberId']) {
                this.experienceForm.patchValue({
                  memberId: parseInt(queryParams['memberId'])
                });
              }
            });
        }
      });
  }

  private loadExperienceData(): void {
    if (this.experienceId) {
      this.experiencesService.getExperienceById(this.experienceId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((experience) => {
          if (experience) {
            const endDate = experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : null;
            this.experienceForm.patchValue({
              memberId: experience.memberId,
              role: experience.role,
              department: experience.department,
              description: experience.description,
              description_fr: (experience as any).description_fr || '',
              description_es: (experience as any).description_es || '',
              startDate: new Date(experience.startDate).toISOString().split('T')[0],
              endDate: endDate,
              skillsGained: experience.skillsGained
            });
          } else {
            this.errorMessage = 'Experience not found';
            setTimeout(() => this.router.navigate(['/experiences']), 2000);
          }
        });
    }
  }

  onSubmit(): void {
    if (!this.experienceForm.valid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.experienceForm.value;
    const formData: ExperienceFormData = {
      ...formValue,
      startDate: new Date(formValue.startDate),
      endDate: formValue.endDate ? new Date(formValue.endDate) : null,
      memberId: parseInt(formValue.memberId)
    };

    const operation$ = this.isEditMode
      ? this.experiencesService.updateExperience(this.experienceId!, formData)
      : this.experiencesService.createExperience(formData);

    operation$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          if (result) {
            this.successMessage = this.isEditMode
              ? 'Experience updated successfully! Redirecting...'
              : 'Experience created successfully! Redirecting...';
            setTimeout(() => {
              this.router.navigate(['/experiences', result.id]);
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
    const skills = this.experienceForm.get('skillsGained')?.value || [];
    const index = skills.indexOf(skill);

    if (index > -1) {
      skills.splice(index, 1);
    } else {
      skills.push(skill);
    }

    this.experienceForm.get('skillsGained')?.setValue(skills);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.experienceForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

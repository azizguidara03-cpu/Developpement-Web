import { Component, OnInit, OnDestroy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ExperiencesService } from '../../../services/experiences.service';
import { MembersService } from '../../../services/members.service';
import { AuthService } from '../../../services/auth.service';
import { LanguageService } from '../../../services/language.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { Experience } from '../../../models/experience';
import { Member } from '../../../models/member';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-experience-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div class="max-w-4xl mx-auto px-4 py-6">
          <a routerLink="/experiences" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold mb-2 inline-block transition-colors">
            ← {{ 'back' | translate }}
          </a>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ 'experience_details' | translate }}</h1>
        </div>
      </div>

      <!-- Main Content -->
      <div *ngIf="experience" class="max-w-4xl mx-auto px-4 py-8">
        <!-- Experience Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8 border-l-4 border-blue-500 transition-colors duration-300">
          <div class="flex items-start justify-between mb-6">
            <div>
              <div class="flex items-center gap-3 mb-3">
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white">{{ experience.role | translate }}</h2>
                <span [ngClass]="getStatusBadgeClass()" class="px-4 py-2 text-sm font-semibold rounded-full">
                  {{ getExperienceStatus() | translate }}
                </span>
              </div>
              <p class="text-gray-700 dark:text-gray-300 text-lg">{{ currentDescription() }}</p>
            </div>
            <div *ngIf="canEditExperiences()" class="flex gap-2">
              <a
                [routerLink]="['/experiences', experience.id, 'edit']"
                class="px-6 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition"
              >
                {{ 'edit' | translate }}
              </a>
              <button
                (click)="deleteExperience()"
                class="px-6 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition"
              >
                {{ 'delete' | translate }}
              </button>
            </div>
          </div>

          <!-- Key Information Grid -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <!-- Member -->
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ 'members' | translate }}</label>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ memberName }}</p>
              <a
                *ngIf="member"
                [routerLink]="['/members', member.id]"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm mt-1 inline-block transition-colors"
              >
                {{ 'view_details' | translate }} →
              </a>
            </div>

            <!-- Role -->
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ 'role' | translate }}</label>
              <span class="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-semibold rounded-full text-sm">
                {{ experience.role | translate }}
              </span>
            </div>

            <!-- Department -->
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ 'department' | translate }}</label>
              <span class="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 font-semibold rounded-full text-sm">
                {{ experience.department | translate }}
              </span>
            </div>

            <!-- Duration -->
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ 'avg_duration' | translate }}</label>
              <p class="text-sm text-gray-900 dark:text-white">
                {{ getDuration() }}
              </p>
            </div>
          </div>

          <!-- Dates -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ 'start_date' | translate }}</label>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ experience.startDate | date: 'MMMM dd, yyyy' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ 'end_date' | translate }}</label>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ experience.endDate ? (experience.endDate | date: 'MMMM dd, yyyy') : ('current' | translate) }}
              </p>
            </div>
          </div>

          <!-- Description -->
          <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">{{ 'description' | translate }}</h3>
            <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ currentDescription() }}</p>
          </div>

          <!-- Skills Gained -->
          <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">{{ 'skills_gained' | translate }}</h3>
            <div class="flex flex-wrap gap-3">
              @for (skill of experience.skillsGained; track skill) {
                <span class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium transition-colors">
                  {{ skill | translate }}
                </span>
              }
            </div>
          </div>

          <!-- Metadata -->
          <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex gap-6 text-sm text-gray-600 dark:text-gray-400">
            <span>{{ 'created' | translate }}: {{ experience.createdAt | date: 'MMM dd, yyyy HH:mm' }}</span>
            <span>{{ 'last_updated' | translate }}: {{ experience.updatedAt | date: 'MMM dd, yyyy HH:mm' }}</span>
          </div>
        </div>

        <!-- Related Member Info -->
        <div *ngIf="member" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">{{ 'member_info' | translate }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ 'full_name' | translate }}</label>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ member.fullName }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ 'email' | translate }}</label>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ member.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ 'department' | translate }}</label>
              <span class="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-semibold rounded-full text-sm">
                {{ member.department | translate }}
              </span>
            </div>
            <div *ngIf="member.age">
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ 'age' | translate }}</label>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ member.age }}</p>
            </div>
          </div>

          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ 'skills' | translate }}</label>
            <div class="flex flex-wrap gap-2">
              @for (skill of member.skills; track skill) {
                <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full transition-colors">
                  {{ skill | translate }}
                </span>
              }
            </div>
          </div>

          <a
            [routerLink]="['/members', member.id]"
            class="inline-block mt-6 px-6 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
          >
            {{ 'view_details' | translate }}
          </a>
        </div>
      </div>

      <!-- Not Found -->
      <div *ngIf="!experience && !isLoading" class="max-w-4xl mx-auto px-4 py-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center transition-colors duration-300">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Experience not found</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4">The experience you're looking for doesn't exist.</p>
          <a
            routerLink="/experiences"
            class="inline-block px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            {{ 'back' | translate }}
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
export class ExperienceDetailComponent implements OnInit, OnDestroy {
  private experiencesService = inject(ExperiencesService);
  private membersService = inject(MembersService);
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);
  public languageService = inject(LanguageService); // Public for access in template if needed, or just use computed

  experience: Experience | null = null;
  member: Member | null = null;
  memberName = 'Unknown';
  isLoading = true;

  // Role-based access: admin, vp, tl can edit experiences
  canEditExperiences = computed(() => this.authService.hasAnyRole(['admin', 'vp', 'tl']));

  // Helper signal to get the description in the current language
  currentDescription = computed(() => {
    const lang = this.languageService.currentLang();
    const exp = this.experience;
    if (!exp) return '';

    if (lang === 'fr' && exp.description_fr) return exp.description_fr;
    if (lang === 'es' && exp.description_es) return exp.description_es;
    return exp.description;
  });

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadExperience();
  }

  private loadExperience(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const experienceId = params['id'];
        
        this.experiencesService.getExperienceById(experienceId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((experience) => {
            this.experience = experience || null;
            this.isLoading = false;

            if (experience) {
              this.loadMember(experience.memberId);
            }
          });
      });
  }

  private loadMember(memberId: number): void {
    this.membersService.getMemberById(memberId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((member) => {
        this.member = member || null;
        this.memberName = member?.fullName || 'Unknown';
      });
  }

  getExperienceStatus(): string {
    if (!this.experience) return '';
    
    const now = new Date();
    if (new Date(this.experience.startDate) > now) {
      return 'upcoming';
    } else if (!this.experience.endDate || new Date(this.experience.endDate) >= now) {
      return 'active';
    } else {
      return 'completed';
    }
  }

  getStatusBadgeClass(): string {
    const status = this.getExperienceStatus();
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getDuration(): string {
    if (!this.experience) return '';

    const start = new Date(this.experience.startDate);
    const end = this.experience.endDate ? new Date(this.experience.endDate) : new Date();

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));

    if (diffMonths < 1) {
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    } else if (diffMonths === 1) {
      return '1 month';
    } else {
      return `${diffMonths} months`;
    }
  }

  deleteExperience(): void {
    if (this.experience && confirm('Are you sure you want to delete this experience? This action cannot be undone.')) {
      this.experiencesService.deleteExperience(this.experience.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          window.location.href = '/experiences';
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

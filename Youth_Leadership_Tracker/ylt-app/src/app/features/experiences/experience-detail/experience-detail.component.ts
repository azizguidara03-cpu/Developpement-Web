import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ExperiencesService } from '../../../services/experiences.service';
import { MembersService } from '../../../services/members.service';
import { Experience } from '../../../models/experience';
import { Member } from '../../../models/member';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-experience-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-4xl mx-auto px-4 py-6">
          <a routerLink="/experiences" class="text-blue-600 hover:text-blue-700 font-semibold mb-2 inline-block">
            ← Back to Experiences
          </a>
          <h1 class="text-3xl font-bold text-gray-900">Experience Details</h1>
        </div>
      </div>

      <!-- Main Content -->
      <div *ngIf="experience" class="max-w-4xl mx-auto px-4 py-8">
        <!-- Experience Card -->
        <div class="bg-white rounded-lg shadow-md p-8 mb-8 border-l-4 border-blue-500">
          <div class="flex items-start justify-between mb-6">
            <div>
              <div class="flex items-center gap-3 mb-3">
                <h2 class="text-3xl font-bold text-gray-900">{{ experience.role }}</h2>
                <span [ngClass]="getStatusBadgeClass()" class="px-4 py-2 text-sm font-semibold rounded-full">
                  {{ getExperienceStatus() }}
                </span>
              </div>
              <p class="text-gray-700 text-lg">{{ experience.description }}</p>
            </div>
            <div class="flex gap-2">
              <a
                [routerLink]="['/experiences', experience.id, 'edit']"
                class="px-6 py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition"
              >
                Edit
              </a>
              <button
                (click)="deleteExperience()"
                class="px-6 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition"
              >
                Delete
              </button>
            </div>
          </div>

          <!-- Key Information Grid -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-200">
            <!-- Member -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">Member</label>
              <p class="text-lg font-semibold text-gray-900">{{ memberName }}</p>
              <a
                *ngIf="member"
                [routerLink]="['/members', member.id]"
                class="text-blue-600 hover:text-blue-700 text-sm mt-1 inline-block"
              >
                View Profile →
              </a>
            </div>

            <!-- Role -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">Role</label>
              <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm">
                {{ experience.role }}
              </span>
            </div>

            <!-- Department -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">Department</label>
              <span class="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 font-semibold rounded-full text-sm">
                {{ experience.department }}
              </span>
            </div>

            <!-- Duration -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">Duration</label>
              <p class="text-sm text-gray-900">
                {{ getDuration() }}
              </p>
            </div>
          </div>

          <!-- Dates -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">Start Date</label>
              <p class="text-lg font-semibold text-gray-900">{{ experience.startDate | date: 'MMMM dd, yyyy' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">End Date</label>
              <p class="text-lg font-semibold text-gray-900">
                {{ experience.endDate ? (experience.endDate | date: 'MMMM dd, yyyy') : 'Ongoing' }}
              </p>
            </div>
          </div>

          <!-- Description -->
          <div class="mt-8 pt-8 border-t border-gray-200">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Description</h3>
            <p class="text-gray-700 whitespace-pre-wrap">{{ experience.description }}</p>
          </div>

          <!-- Skills Gained -->
          <div class="mt-8 pt-8 border-t border-gray-200">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Skills Gained</h3>
            <div class="flex flex-wrap gap-3">
              @for (skill of experience.skillsGained; track skill) {
                <span class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium">
                  {{ skill }}
                </span>
              }
            </div>
          </div>

          <!-- Metadata -->
          <div class="mt-8 pt-8 border-t border-gray-200 flex gap-6 text-sm text-gray-600">
            <span>Created: {{ experience.createdAt | date: 'MMM dd, yyyy HH:mm' }}</span>
            <span>Last Updated: {{ experience.updatedAt | date: 'MMM dd, yyyy HH:mm' }}</span>
          </div>
        </div>

        <!-- Related Member Info -->
        <div *ngIf="member" class="bg-white rounded-lg shadow-md p-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">Member Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
              <p class="text-lg font-semibold text-gray-900">{{ member.fullName }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">Email</label>
              <p class="text-lg font-semibold text-gray-900">{{ member.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">Department</label>
              <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm">
                {{ member.department }}
              </span>
            </div>
            <div *ngIf="member.age">
              <label class="block text-sm font-medium text-gray-600 mb-2">Age</label>
              <p class="text-lg font-semibold text-gray-900">{{ member.age }}</p>
            </div>
          </div>

          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-600 mb-2">Skills</label>
            <div class="flex flex-wrap gap-2">
              @for (skill of member.skills; track skill) {
                <span class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {{ skill }}
                </span>
              }
            </div>
          </div>

          <a
            [routerLink]="['/members', member.id]"
            class="inline-block mt-6 px-6 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition"
          >
            View Full Member Profile
          </a>
        </div>
      </div>

      <!-- Not Found -->
      <div *ngIf="!experience && !isLoading" class="max-w-4xl mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Experience not found</h2>
          <p class="text-gray-600 mb-4">The experience you're looking for doesn't exist.</p>
          <a
            routerLink="/experiences"
            class="inline-block px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Back to Experiences
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

  experience: Experience | null = null;
  member: Member | null = null;
  memberName = 'Unknown';
  isLoading = true;

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
      return 'Upcoming';
    } else if (!this.experience.endDate || new Date(this.experience.endDate) >= now) {
      return 'Active';
    } else {
      return 'Completed';
    }
  }

  getStatusBadgeClass(): string {
    const status = this.getExperienceStatus();
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Upcoming':
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

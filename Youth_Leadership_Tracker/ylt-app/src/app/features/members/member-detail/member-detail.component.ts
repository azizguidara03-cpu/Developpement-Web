import { Component, OnInit, OnDestroy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MembersService } from '../../../services/members.service';
import { ExperiencesService } from '../../../services/experiences.service';
import { AuthService } from '../../../services/auth.service';
import { Member } from '../../../models/member';
import { Experience } from '../../../models/experience';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div class="max-w-4xl mx-auto px-4 py-6">
          <a routerLink="/members" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold mb-2 inline-block transition-colors">
            ← Back to Members
          </a>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Member Details</h1>
        </div>
      </div>

      <!-- Main Content -->
      <div *ngIf="member" class="max-w-4xl mx-auto px-4 py-8">
        <!-- Member Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8 transition-colors duration-300">
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-start gap-6">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                {{ member.fullName.charAt(0) }}{{ member.fullName.split(' ')[1]?.charAt(0) }}
              </div>
              <div>
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white">{{ member.fullName }}</h2>
                <p class="text-gray-600 dark:text-gray-400 mt-1">{{ member.email }}</p>
              </div>
            </div>
            <div *ngIf="canManageMembers()" class="flex gap-2">
              <a
                [routerLink]="['/members', member.id, 'edit']"
                class="px-6 py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition"
              >
                Edit
              </a>
              <button
                (click)="deleteMember()"
                class="px-6 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition"
              >
                Delete
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <!-- Department -->
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Department</label>
              <div class="flex items-center gap-2">
                <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold rounded-full text-sm">
                  {{ member.department }}
                </span>
              </div>
            </div>

            <!-- Age -->
            <div *ngIf="member.age">
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Age</label>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ member.age }} years old</p>
            </div>

            <!-- Joined Date -->
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Joined</label>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ member.createdAt | date: 'MMM dd, yyyy' }}</p>
            </div>
          </div>

          <!-- Skills -->
          <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Skills</h3>
            <div class="flex flex-wrap gap-3">
              @for (skill of member.skills; track skill) {
                <span class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium transition-colors">
                  {{ skill }}
                </span>
              }
            </div>
          </div>
        </div>

        <!-- Member Experiences -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Leadership Experiences</h3>
            <a
              routerLink="/experiences/create"
              [queryParams]="{ memberId: member.id }"
              class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            >
              + Add Experience
            </a>
          </div>

          <div *ngIf="memberExperiences.length === 0" class="text-center py-8">
            <p class="text-gray-600 dark:text-gray-400">No experiences yet</p>
          </div>

          <div *ngIf="memberExperiences.length > 0" class="space-y-4">
            @for (experience of memberExperiences; track experience.id) {
              <div class="border-l-4 border-blue-500 p-4 bg-gray-50 dark:bg-gray-700/50 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition border-y border-r border-gray-200 dark:border-gray-600">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h4 class="text-lg font-bold text-gray-900 dark:text-white">{{ experience.role }}</h4>
                    <p class="text-gray-600 dark:text-gray-300 mt-1">{{ experience.description }}</p>
                    <div class="flex items-center gap-4 mt-3">
                      <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-sm font-semibold rounded-full">
                        {{ experience.department }}
                      </span>
                      <span class="text-sm text-gray-600 dark:text-gray-400">
                        {{ experience.startDate | date: 'MMM dd, yyyy' }} - {{ experience.endDate ? (experience.endDate | date: 'MMM dd, yyyy') : 'Ongoing' }}
                      </span>
                    </div>
                  </div>
                  <a
                    [routerLink]="['/experiences', experience.id]"
                    class="px-3 py-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                  >
                    View →
                  </a>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Not Found -->
      <div *ngIf="!member && !isLoading" class="max-w-4xl mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Member not found</h2>
          <p class="text-gray-600 mb-4">The member you're looking for doesn't exist.</p>
          <a
            routerLink="/members"
            class="inline-block px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Back to Members
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
export class MemberDetailComponent implements OnInit, OnDestroy {
  private membersService = inject(MembersService);
  private experiencesService = inject(ExperiencesService);
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);

  member: Member | null = null;
  memberExperiences: Experience[] = [];

  // Role-based access: only admin can manage members
  canManageMembers = computed(() => this.authService.hasRole('admin'));
  isLoading = true;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadMember();
  }

  private loadMember(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const memberId = params['id'];
        
        this.membersService.getMemberById(memberId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((member) => {
            this.member = member || null;
            this.isLoading = false;

            if (member) {
              this.loadMemberExperiences(member.id);
            }
          });
      });
  }

  private loadMemberExperiences(memberId: number): void {
    this.experiencesService.getExperiencesByMemberId(memberId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((experiences) => {
        this.memberExperiences = experiences;
      });
  }

  deleteMember(): void {
    if (this.member && confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      this.membersService.deleteMember(this.member.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          window.location.href = '/members';
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

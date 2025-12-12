import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService, DashboardStats, ChartData, TimelineItem } from '../../services/dashboard.service';
import { GamificationService, Badge } from '../../services/gamification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-gray-800 dark:to-gray-900 text-white shadow-lg transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 py-8">
          <h1 class="text-4xl font-bold mb-2">{{ 'dashboard' | translate }}</h1>
          <p class="text-blue-100 dark:text-gray-400">{{ 'dashboard_subtitle' | translate }}</p>
        </div>
      </div>

      <!-- Main Content -->
      <div *ngIf="stats" class="max-w-7xl mx-auto px-4 py-8">
        

        <!-- Leadership Score Section -->
        <div class="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 mb-8 text-white">
          <div class="flex flex-col md:flex-row md:items-center gap-6">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-3xl">🏆</span>
                <h2 class="text-2xl font-bold">{{ stats.leadershipScore.level | translate }}</h2>
              </div>
              <p class="text-white/90 text-lg mb-4">
                <span class="font-semibold">{{ stats.currentUserName }}</span> {{ stats.leadershipScore.message | translate }}
              </p>
              
              <!-- Progress Bar -->
              <div class="relative">
                <div class="flex justify-between text-sm text-white/80 mb-2">
                  <span>{{ 'leadership_growth' | translate }}</span>
                  <span class="font-bold">{{ stats.leadershipScore.score }}%</span>
                </div>
                <div class="h-4 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                    [style.width.%]="stats.leadershipScore.score"
                  ></div>
                </div>
              </div>
            </div>
            
            <!-- Score Breakdown -->
            <div class="grid grid-cols-3 gap-4 md:w-72">
              <div class="text-center bg-white/20 rounded-xl p-3">
                <p class="text-2xl font-bold">{{ stats.leadershipScore.experiencePoints }}</p>
                <p class="text-xs text-white/80">{{ 'experiences' | translate }}</p>
              </div>
              <div class="text-center bg-white/20 rounded-xl p-3">
                <p class="text-2xl font-bold">{{ stats.leadershipScore.rolePoints }}</p>
                <p class="text-xs text-white/80">{{ 'role_diversity' | translate }}</p>
              </div>
              <div class="text-center bg-white/20 rounded-xl p-3">
                <p class="text-2xl font-bold">{{ stats.leadershipScore.skillPoints }}</p>
                <p class="text-xs text-white/80">{{ 'skills' | translate }}</p>
              </div>
            </div>
          </div>
        </div>
                <!-- Achievements / Badges Section -->
        <div *ngIf="earnedBadges.length > 0" class="mb-8">
          <div class="flex items-center gap-2 mb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ 'achievements' | translate }}</h2>
            <span class="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 text-xs font-bold rounded-full uppercase tracking-wider">
              {{ earnedBadges.length }} {{ 'earned' | translate }}
            </span>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            @for (badge of earnedBadges; track badge.id) {
              <div class="relative group">
                <div [class]="'flex flex-col items-center justify-center p-4 rounded-xl border-2 border-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-help ' + badge.colorClass">
                  <span class="text-3xl mb-2">{{ badge.icon }}</span>
                  <span class="text-xs font-bold text-center leading-tight">{{ badge.label | translate }}</span>
                </div>
                
                <!-- Tooltip -->
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  <div class="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg py-2 px-3 text-center shadow-xl">
                    <p class="font-bold mb-1">{{ badge.label | translate }}</p>
                    <p>{{ badge.description | translate }}</p>
                    <div class="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                  </div>
                </div>
              </div>
            }
            
            <!-- Empty slots for unearned (optional, or just show earned) -->
             <div *ngIf="earnedBadges.length === 0" class="col-span-full p-8 text-center bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400">
               {{ 'no_badges_yet' | translate }}
             </div>
          </div>
        </div>

        <!-- Personal Activity Timeline -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">📅 {{ 'activity_timeline' | translate }}</h2>
          <div class="space-y-4 max-h-80 overflow-y-auto pr-2">
            @for (item of stats.timeline.slice(0, 6); track item.id) {
              <div 
                class="relative pl-6 pb-4 border-l-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-r-lg p-2 -ml-2 transition"
                [class.border-green-400]="item.status === 'active'"
                [class.border-gray-300]="item.status === 'completed'"
                [class.border-blue-400]="item.status === 'upcoming'"
                [class.dark:border-green-500]="item.status === 'active'"
                [class.dark:border-gray-600]="item.status === 'completed'"
                [class.dark:border-blue-500]="item.status === 'upcoming'"
                (click)="openTimelineModal(item)"
              >
                <!-- Dot -->
                <div 
                  class="absolute left-[-9px] top-2 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px]"
                  [style.background-color]="item.color"
                >
                </div>
                
                <!-- Content -->
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-lg">{{ item.icon }}</span>
                    <span 
                      class="px-2 py-0.5 text-xs font-medium rounded-full"
                      [class.bg-green-100]="item.status === 'active'"
                      [class.text-green-700]="item.status === 'active'"
                      [class.bg-gray-100]="item.status === 'completed'"
                      [class.text-gray-700]="item.status === 'completed'"
                      [class.bg-blue-100]="item.status === 'upcoming'"
                      [class.text-blue-700]="item.status === 'upcoming'"
                      [class.dark:bg-green-900]="item.status === 'active'"
                      [class.dark:text-green-300]="item.status === 'active'"
                      [class.dark:bg-gray-700]="item.status === 'completed'"
                      [class.dark:text-gray-300]="item.status === 'completed'"
                      [class.dark:bg-blue-900]="item.status === 'upcoming'"
                      [class.dark:text-blue-300]="item.status === 'upcoming'"
                    >
                      {{ item.status | translate }}
                    </span>
                  </div>
                  <h4 class="font-semibold text-gray-900 dark:text-white text-sm">{{ item.title }}</h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.department }} • {{ item.date | date:'MMM yyyy' }}</p>
                </div>
              </div>
            }
          </div>
          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <a routerLink="/experiences" class="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
              {{ 'view_all_experiences' | translate }} →
            </a>
          </div>
        </div>

        <!-- ======================= ORGANIZATION OVERVIEW ======================= -->
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ 'organization_overview' | translate }}</h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm">{{ 'org_overview_subtitle' | translate }}</p>
        </div>

        <!-- Key Metrics Row -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 border-blue-500">
            <p class="text-gray-500 dark:text-gray-400 text-sm">{{ 'members' | translate }}</p>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalMembers }}</h3>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 border-indigo-500">
            <p class="text-gray-500 dark:text-gray-400 text-sm">{{ 'experiences' | translate }}</p>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalExperiences }}</h3>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 border-green-500">
            <p class="text-gray-500 dark:text-gray-400 text-sm">{{ 'active' | translate }}</p>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.activeExperiences }}</h3>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 border-amber-500">
            <p class="text-gray-500 dark:text-gray-400 text-sm">{{ 'completed' | translate }}</p>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.completedExperiences }}</h3>
          </div>
        </div>

        <!-- Additional Statistics Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <!-- Average Duration -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-lg transition">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">{{ 'average_duration' | translate }}</p>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ stats.averageExperienceDuration }} {{ 'days' | translate }}</h3>
                <p class="text-xs text-gray-400 dark:text-gray-500">{{ 'per_leadership_experience' | translate }}</p>
              </div>
            </div>
          </div>

          <!-- Most Common Role -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-lg transition">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center">
                <svg class="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">{{ 'most_common_role' | translate }}</p>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ stats.mostCommonRole }}</h3>
                <p class="text-xs text-gray-400 dark:text-gray-500">{{ 'top_leadership_position' | translate }}</p>
              </div>
            </div>
          </div>

          <!-- Most Represented Department -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-lg transition">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                <svg class="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">{{ 'top_dept' | translate }}</p>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ stats.mostRepresentedDepartment }}</h3>
                <p class="text-xs text-gray-400 dark:text-gray-500">{{ 'most_represented' | translate }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- Members by Department Chart -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">{{ 'members_by_dept' | translate }}</h2>
            <div class="flex items-center gap-4">
              <div class="relative w-32 h-32 flex-shrink-0">
                <svg viewBox="0 0 100 100" class="w-full h-full transform -rotate-90">
                  @for (segment of memberDeptSegments; track segment.name) {
                    <circle cx="50" cy="50" r="40" [attr.stroke]="segment.color" stroke-width="20" fill="transparent"
                      [attr.stroke-dasharray]="segment.dashArray" [attr.stroke-dashoffset]="segment.dashOffset"/>
                  }
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <p class="text-xl font-bold text-gray-900 dark:text-white">{{ stats.totalMembers }}</p>
                </div>
              </div>
              <div class="flex-1 space-y-1 text-sm">
                @for (item of stats.membersByDepartmentChart.slice(0, 5); track item.name) {
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full" [style.background-color]="item.color"></div>
                    <span class="text-gray-600 dark:text-gray-300 truncate">{{ item.name }}</span>
                    <span class="font-bold text-gray-900 dark:text-white ml-auto">{{ item.value }}</span>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Experiences by Role Chart -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">{{ 'experiences_by_role' | translate }}</h2>
            <div class="flex items-center gap-4">
              <div class="relative w-32 h-32 flex-shrink-0">
                <svg viewBox="0 0 100 100" class="w-full h-full transform -rotate-90">
                  @for (segment of roleSegments; track segment.name) {
                    <circle cx="50" cy="50" r="40" [attr.stroke]="segment.color" stroke-width="20" fill="transparent"
                      [attr.stroke-dasharray]="segment.dashArray" [attr.stroke-dashoffset]="segment.dashOffset"/>
                  }
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <p class="text-xl font-bold text-gray-900 dark:text-white">{{ stats.totalExperiences }}</p>
                </div>
              </div>
              <div class="flex-1 space-y-1 text-sm max-h-32 overflow-y-auto">
                @for (item of stats.experiencesByRoleChart.slice(0, 5); track item.name) {
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full flex-shrink-0" [style.background-color]="item.color"></div>
                    <span class="text-gray-600 dark:text-gray-300 truncate">{{ item.name }}</span>
                    <span class="font-bold text-gray-900 dark:text-white ml-auto">{{ item.value }}</span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Top Skills -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">{{ 'top_5_skills' | translate }}</h2>
          <div class="grid grid-cols-5 gap-3">
            @for (skill of stats.topSkills; track skill.skill; let i = $index) {
              <div class="text-center">
                <div class="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold" [ngClass]="getSkillBgClass(i)">
                  {{ i + 1 }}
                </div>
                <p class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{{ skill.skill }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ skill.count }}x</p>
              </div>
            }
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a routerLink="/members" class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-5 hover:shadow-lg hover:scale-[1.02] transition-all">
            <h3 class="text-lg font-bold mb-1">{{ 'members' | translate }}</h3>
            <p class="text-blue-100 text-sm">{{ 'manage_committee_members' | translate }}</p>
          </a>
          <a routerLink="/experiences" class="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl p-5 hover:shadow-lg hover:scale-[1.02] transition-all">
            <h3 class="text-lg font-bold mb-1">{{ 'experiences' | translate }}</h3>
            <p class="text-indigo-100 text-sm">{{ 'track_leadership_journeys' | translate }}</p>
          </a>
          <a routerLink="/profile" class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-5 hover:shadow-lg hover:scale-[1.02] transition-all">
            <h3 class="text-lg font-bold mb-1">{{ 'profile' | translate }}</h3>
            <p class="text-purple-100 text-sm">{{ 'your_personal_settings' | translate }}</p>
          </a>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="!stats" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <div class="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 rounded-full animate-spin"></div>
          <p class="text-gray-600 dark:text-gray-400 mt-4">{{ 'loading_dashboard' | translate }}</p>
        </div>
      </div>

      <!-- Timeline Detail Modal -->
      <div *ngIf="selectedTimelineItem" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" (click)="closeTimelineModal()">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <!-- Modal Header -->
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-3xl">{{ selectedTimelineItem.icon }}</span>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedTimelineItem.title }}</h3>
                  <p class="text-gray-500 dark:text-gray-400">{{ selectedTimelineItem.department }}</p>
                </div>
              </div>
              <button (click)="closeTimelineModal()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Modal Body -->
          <div class="p-6 space-y-4">
            <!-- Status Badge -->
            <div>
              <span 
                class="px-3 py-1 text-sm font-semibold rounded-full"
                [class.bg-green-100]="selectedTimelineItem.status === 'active'"
                [class.text-green-700]="selectedTimelineItem.status === 'active'"
                [class.bg-gray-100]="selectedTimelineItem.status === 'completed'"
                [class.text-gray-700]="selectedTimelineItem.status === 'completed'"
                [class.bg-blue-100]="selectedTimelineItem.status === 'upcoming'"
                [class.text-blue-700]="selectedTimelineItem.status === 'upcoming'"
                [class.dark:bg-green-900]="selectedTimelineItem.status === 'active'"
                [class.dark:text-green-300]="selectedTimelineItem.status === 'active'"
                [class.dark:bg-gray-700]="selectedTimelineItem.status === 'completed'"
                [class.dark:text-gray-300]="selectedTimelineItem.status === 'completed'"
                [class.dark:bg-blue-900]="selectedTimelineItem.status === 'upcoming'"
                [class.dark:text-blue-300]="selectedTimelineItem.status === 'upcoming'"
              >
                {{ selectedTimelineItem.status | titlecase }}
              </span>
            </div>

            <!-- Date -->
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Start Date</h4>
              <p class="text-gray-900 dark:text-white">{{ selectedTimelineItem.date | date:'MMMM d, yyyy' }}</p>
            </div>

            <!-- Description -->
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h4>
              <p class="text-gray-900 dark:text-white">{{ selectedTimelineItem.description }}</p>
            </div>

            <!-- Skills Gained -->
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Skills Gained</h4>
              <div class="flex flex-wrap gap-2">
                @for (skill of selectedTimelineItem.skillsGained; track skill) {
                  <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded-full">
                    {{ skill }}
                  </span>
                }
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-2xl">
            <a 
              [routerLink]="['/experiences', selectedTimelineItem.id]" 
              class="block w-full text-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              (click)="closeTimelineModal()"
            >
              View Full Details
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .animate-spin { animation: spin 1s linear infinite; }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private dashboardService = inject(DashboardService);
  private gamificationService = inject(GamificationService);

  earnedBadges: Badge[] = [];

  stats: DashboardStats | null = null;
  memberDeptSegments: PieSegment[] = [];
  roleSegments: PieSegment[] = [];
  selectedTimelineItem: TimelineItem | null = null;

  private destroy$ = new Subject<void>();
  private storageListener: ((event: StorageEvent) => void) | null = null;

  ngOnInit(): void {
    this.loadDashboardStats();
    this.setupStorageListener();
  }

  private loadDashboardStats(): void {
    this.dashboardService.getDashboardStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe((stats) => {
        this.stats = stats;
        if (stats) {
          this.memberDeptSegments = this.calculatePieSegments(stats.membersByDepartmentChart, stats.totalMembers);
          this.roleSegments = this.calculatePieSegments(stats.experiencesByRoleChart, stats.totalExperiences);
          // Calculate badges
          this.calculateBadges();
        }
      });
  }

  private calculateBadges(): void {
    try {
      const userStr = localStorage.getItem('ylt_user');
      const user = (userStr && userStr !== 'undefined') ? JSON.parse(userStr) : {};
      
      if (!user.id) return;

      // We need the member ID associated with this user
      // The members mock data is in 'ylt_members'
      const membersStr = localStorage.getItem('ylt_members');
      const allMembers = (membersStr && membersStr !== 'undefined') ? JSON.parse(membersStr) : [];
      
      // Find member by matching email or just assuming ID mapping if 1:1. 
      // Current setup: User ID 1 == Member ID 1.
      const member = allMembers.find((m: any) => m.id === user.id);
      
      if (member) {
        const experiencesStr = localStorage.getItem('ylt_experiences');
        const allExperiences = (experiencesStr && experiencesStr !== 'undefined') ? JSON.parse(experiencesStr) : [];
        const memberExperiences = allExperiences.filter((e: any) => e.memberId === member.id);
        this.earnedBadges = this.gamificationService.getBadgesForMember(member, memberExperiences);
      }
    } catch (e) {
      console.error('Error calculating badges', e);
    }
  }

  // Listen for localStorage changes from other tabs or DevTools edits
  private setupStorageListener(): void {
    this.storageListener = (event: StorageEvent) => {
      if (event.key === 'ylt_members' || event.key === 'ylt_experiences') {
        // Reload dashboard stats when localStorage changes externally
        this.loadDashboardStats();
      }
    };
    window.addEventListener('storage', this.storageListener);
  }

  private calculatePieSegments(data: ChartData[], total: number): PieSegment[] {
    if (total === 0) return [];
    const circumference = 2 * Math.PI * 40;
    let currentOffset = 0;
    return data.map(item => {
      const percentage = item.value / total;
      const segmentLength = circumference * percentage;
      const segment: PieSegment = {
        name: item.name,
        color: item.color,
        dashArray: `${segmentLength} ${circumference - segmentLength}`,
        dashOffset: -currentOffset
      };
      currentOffset += segmentLength;
      return segment;
    });
  }

  openTimelineModal(item: TimelineItem): void {
    this.selectedTimelineItem = item;
  }

  closeTimelineModal(): void {
    this.selectedTimelineItem = null;
  }

  getSkillBgClass(index: number): string {
    const classes = ['bg-yellow-500', 'bg-gray-400', 'bg-amber-600', 'bg-blue-500', 'bg-indigo-500'];
    return classes[index] || 'bg-gray-500';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // Clean up storage listener
    if (this.storageListener) {
      window.removeEventListener('storage', this.storageListener);
    }
  }
}

interface PieSegment {
  name: string;
  color: string;
  dashArray: string;
  dashOffset: number;
}

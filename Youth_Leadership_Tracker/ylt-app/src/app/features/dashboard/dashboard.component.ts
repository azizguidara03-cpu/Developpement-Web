import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService, DashboardStats } from '../../services/dashboard.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-8">
          <h1 class="text-4xl font-bold mb-2">Dashboard</h1>
          <p class="text-blue-100">Youth Leadership Tracker Analytics & Statistics</p>
        </div>
      </div>

      <!-- Main Content -->
      <div *ngIf="stats" class="max-w-7xl mx-auto px-4 py-8">
        <!-- Key Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Total Members -->
          <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-t-4 border-blue-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-medium">Total Members</p>
                <h3 class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalMembers }}</h3>
              </div>
              <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Total Experiences -->
          <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-t-4 border-indigo-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-medium">Total Experiences</p>
                <h3 class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalExperiences }}</h3>
              </div>
              <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Active Experiences -->
          <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-t-4 border-green-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-medium">Active Experiences</p>
                <h3 class="text-3xl font-bold text-gray-900 mt-2">{{ stats.activeExperiences }}</h3>
              </div>
              <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Completed Experiences -->
          <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-t-4 border-amber-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-medium">Completed Experiences</p>
                <h3 class="text-3xl font-bold text-gray-900 mt-2">{{ stats.completedExperiences }}</h3>
              </div>
              <div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts and Analysis Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Top Skills -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Top Skills Developed</h2>
            <div class="space-y-4">
              @for (skill of stats.topSkills; track skill.skill) {
                <div>
                  <div class="flex justify-between mb-2">
                    <span class="text-gray-700 font-medium">{{ skill.skill }}</span>
                    <span class="text-gray-600 text-sm">{{ skill.count }} times</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-blue-500 h-2 rounded-full transition-all"
                      [style.width.%]="getSkillPercentage(skill.count)"
                    ></div>
                  </div>
                </div>
              }
              <div *ngIf="stats.topSkills.length === 0" class="text-center py-8">
                <p class="text-gray-600">No skills data available yet</p>
              </div>
            </div>
          </div>

          <!-- Members by Department -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Members by Department</h2>
            <div class="space-y-4">
              @for (dept of getDepartmentEntries(); track dept[0]) {
                <div class="flex items-center justify-between">
                  <span class="text-gray-700 font-medium">{{ getDepartmentLabel(dept[0]) }}</span>
                  <div class="flex items-center gap-3">
                    <div class="w-48 bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-indigo-500 h-2 rounded-full transition-all"
                        [style.width.%]="getPercentage(dept[1], stats.totalMembers)"
                      ></div>
                    </div>
                    <span class="text-gray-600 text-sm font-semibold w-12">{{ dept[1] }}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Experiences by Role -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Experiences by Leadership Role</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (role of getRoleEntries(); track role[0]) {
              <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border-l-4 border-blue-500">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-600 text-sm font-medium">{{ role[0] }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">{{ role[1] }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-gray-600 text-sm">
                      {{ getPercentage(role[1], stats.totalExperiences) }}%
                    </p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Members Quick Action -->
          <a
            routerLink="/members"
            class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6 hover:shadow-lg transition block"
          >
            <svg class="w-8 h-8 mb-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10h.01M11 10h.01M7 10h.01M5 20a2 2 0 012-2h10a2 2 0 012 2"/>
            </svg>
            <h3 class="text-xl font-bold mb-2">Members</h3>
            <p class="text-blue-100 mb-4">Manage all committee members</p>
            <span class="inline-block px-4 py-2 bg-blue-400 rounded-lg text-sm font-semibold">View All →</span>
          </a>

          <!-- Experiences Quick Action -->
          <a
            routerLink="/experiences"
            class="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg shadow-md p-6 hover:shadow-lg transition block"
          >
            <svg class="w-8 h-8 mb-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <h3 class="text-xl font-bold mb-2">Experiences</h3>
            <p class="text-indigo-100 mb-4">Track leadership experiences</p>
            <span class="inline-block px-4 py-2 bg-indigo-400 rounded-lg text-sm font-semibold">View All →</span>
          </a>

          <!-- Profile Quick Action -->
          <a
            routerLink="/profile"
            class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-md p-6 hover:shadow-lg transition block"
          >
            <svg class="w-8 h-8 mb-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <h3 class="text-xl font-bold mb-2">Profile</h3>
            <p class="text-purple-100 mb-4">View your user profile</p>
            <span class="inline-block px-4 py-2 bg-purple-400 rounded-lg text-sm font-semibold">Edit →</span>
          </a>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="!stats" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <div class="inline-block">
            <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p class="text-gray-600 mt-4">Loading dashboard data...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private dashboardService = inject(DashboardService);

  stats: DashboardStats | null = null;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  private loadDashboardStats(): void {
    this.dashboardService.getDashboardStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe((stats) => {
        this.stats = stats;
      });
  }

  getSkillPercentage(count: number): number {
    if (!this.stats || this.stats.topSkills.length === 0) return 0;
    const maxCount = this.stats.topSkills[0]?.count || 1;
    return (count / maxCount) * 100;
  }

  getPercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  getDepartmentEntries(): [string, number][] {
    if (!this.stats) return [];
    return Object.entries(this.stats.membersByDepartment);
  }

  getRoleEntries(): [string, number][] {
    if (!this.stats) return [];
    return Object.entries(this.stats.experiencesByRole);
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

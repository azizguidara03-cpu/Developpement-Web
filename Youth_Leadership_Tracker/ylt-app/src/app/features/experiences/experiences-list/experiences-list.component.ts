import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ExperiencesService } from '../../../services/experiences.service';
import { MembersService } from '../../../services/members.service';
import { AuthService } from '../../../services/auth.service';
import { Experience } from '../../../models/experience';
import { Member } from '../../../models/member';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';import { TranslatePipe } from '../../../pipes/translate.pipe';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-experiences-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 py-6">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ 'leadership_experiences' | translate }}</h1>
              <p class="text-gray-600 dark:text-gray-400 mt-2">{{ 'manage_experiences_desc' | translate }}</p>
            </div>
            <a 
              *ngIf="canEditExperiences"
              routerLink="/experiences/create"
              class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
            >
              + {{ 'add_experience' | translate }}
            </a>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Search and Filter Bar -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 transition-colors duration-300">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ 'search' | translate }}</label>
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (input)="onSearch()"
                [placeholder]="'search_placeholder_experiences' | translate"
                class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <!-- Filter by Role -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ 'role' | translate }}</label>
              <select
                [(ngModel)]="selectedRole"
                (change)="onFilterChange()"
                class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition"
              >
                <option value="">{{ 'all_roles' | translate }}</option>
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
            </div>

            <!-- Filter by Department -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ 'department' | translate }}</label>
              <select
                [(ngModel)]="selectedDepartment"
                (change)="onFilterChange()"
                class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition"
              >
                <option value="">{{ 'all_departments' | translate }}</option>
                <option value="IGV">{{ 'IGV' | translate }}</option>
                <option value="IGT">{{ 'IGT' | translate }}</option>
                <option value="OGV">{{ 'OGV' | translate }}</option>
                <option value="OGT">{{ 'OGT' | translate }}</option>
                <option value="Talent Management">{{ 'Talent Management' | translate }}</option>
                <option value="Finance">{{ 'Finance' | translate }}</option>
                <option value="Business Development">{{ 'Business Development' | translate }}</option>
                <option value="Marketing">{{ 'Marketing' | translate }}</option>
                <option value="Information Management">{{ 'Information Management' | translate }}</option>
              </select>
            </div>

            <!-- Filter by Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ 'status' | translate }}</label>
              <select
                [(ngModel)]="selectedStatus"
                (change)="onFilterChange()"
                class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition"
              >
                <option value="">{{ 'all_status' | translate }}</option>
                <option value="active">{{ 'active' | translate }}</option>
                <option value="completed">{{ 'completed' | translate }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Results Count -->
        <div class="mb-4 text-gray-700 dark:text-gray-300">
          {{ 'showing' | translate }} <span class="font-semibold">{{ filteredExperiences.length }}</span> {{ 'of' | translate }} <span class="font-semibold">{{ allExperiences.length }}</span> {{ 'experiences' | translate | lowercase }}
        </div>

        <!-- Experiences List -->
        <div class="space-y-4">
          @for (experience of paginatedExperiences; track experience.id) {
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-4 border-blue-500">
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ experience.role | translate }}</h3>
                    <span [ngClass]="getStatusBadgeClass(experience)" class="px-3 py-1 text-xs font-semibold rounded-full">
                      {{ getExperienceStatus(experience) | translate }}
                    </span>
                  </div>
                  <p class="text-gray-700 dark:text-gray-300">{{ getCurrentDescription(experience) }}</p>
                </div>
              </div>

              <!-- Experience Details -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-y border-gray-200 dark:border-gray-700">
                <div>
                  <label class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ 'members' | translate }}</label>
                  <p class="text-gray-900 dark:text-white font-semibold">{{ getMemberName(experience.memberId) }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ 'department' | translate }}</label>
                  <span class="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-sm font-semibold rounded-full">
                    {{ experience.department | translate }}
                  </span>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ 'start_date' | translate }}</label>
                  <p class="text-gray-900 dark:text-white">{{ experience.startDate | date: 'MMM dd, yyyy' }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ 'end_date' | translate }}</label>
                  <p class="text-gray-900 dark:text-white">{{ experience.endDate ? (experience.endDate | date: 'MMM dd, yyyy') : ('current' | translate) }}</p>
                </div>
              </div>

              <!-- Skills -->
              <div class="mb-4">
                <label class="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-2">{{ 'skills_gained' | translate }}</label>
                <div class="flex flex-wrap gap-2">
                  @for (skill of experience.skillsGained; track skill) {
                    <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                      {{ skill | translate }}
                    </span>
                  }
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <a
                  [routerLink]="['/experiences', experience.id]"
                  class="flex-1 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition text-center"
                >
                  {{ 'view_details' | translate }}
                </a>
                <a
                  *ngIf="canEditExperiences"
                  [routerLink]="['/experiences', experience.id, 'edit']"
                  class="flex-1 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition text-center"
                >
                  {{ 'edit' | translate }}
                </a>
                <button
                  *ngIf="canEditExperiences"
                  (click)="deleteExperience(experience.id)"
                  class="flex-1 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition"
                >
                  {{ 'delete' | translate }}
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredExperiences.length === 0" class="text-center py-12">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ 'no_experiences_found' | translate }}</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ 'try_adjusting' | translate }}</p>
          <a 
            routerLink="/experiences/create"
            class="inline-block px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            {{ 'create_first_experience' | translate }}
          </a>
        </div>

        <!-- Pagination -->
        <div *ngIf="filteredExperiences.length > itemsPerPage" class="flex justify-center items-center gap-2 mt-8">
          <button
            (click)="previousPage()"
            [disabled]="currentPage === 1"
            class="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {{ 'previous' | translate }}
          </button>
          
          @for (page of getPageNumbers(); track page) {
            <button
              (click)="goToPage(page)"
              [class.bg-blue-500]="currentPage === page"
              [class.text-white]="currentPage === page"
              [class.border-blue-500]="currentPage === page"
              class="px-3 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {{ page }}
            </button>
          }
          
          <button
            (click)="nextPage()"
            [disabled]="currentPage >= getTotalPages()"
            class="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {{ 'next' | translate }}
          </button>
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
export class ExperiencesListComponent implements OnInit, OnDestroy {
  private experiencesService = inject(ExperiencesService);
  private membersService = inject(MembersService);
  private authService = inject(AuthService);
  public languageService = inject(LanguageService); // Added

  // Role-based access control
  canEditExperiences = this.authService.canEditExperiences();

  allExperiences: Experience[] = [];
  filteredExperiences: Experience[] = [];
  paginatedExperiences: Experience[] = [];
  memberMap: Map<number, string> = new Map();

  searchQuery = '';
  selectedRole = '';
  selectedDepartment = '';
  selectedStatus = '';

  currentPage = 1;
  itemsPerPage = 5;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadExperiences();
    this.loadMembers();
  }

  private loadExperiences(): void {
    this.experiencesService.getAllExperiences()
      .pipe(takeUntil(this.destroy$))
      .subscribe((experiences) => {
        this.allExperiences = experiences;
        this.applyFiltersAndSort();
      });
  }

  private loadMembers(): void {
    this.membersService.getAllMembers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((members) => {
        members.forEach(member => {
          this.memberMap.set(member.id, member.fullName);
        });
      });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  private applyFiltersAndSort(): void {
    let filtered = [...this.allExperiences];

    // Apply search (including member name)
    if (this.searchQuery.trim()) {
      const lowerQuery = this.searchQuery.toLowerCase();
      filtered = filtered.filter(exp => {
        // Search in role, department, description
        const matchesRole = exp.role.toLowerCase().includes(lowerQuery);
        const matchesDept = exp.department.toLowerCase().includes(lowerQuery);
        const matchesDesc = exp.description.toLowerCase().includes(lowerQuery);
        
        // Search in member name
        const memberName = this.memberMap.get(exp.memberId) || '';
        const matchesMember = memberName.toLowerCase().includes(lowerQuery);
        
        return matchesRole || matchesDept || matchesDesc || matchesMember;
      });
    }
    
    this.applyRoleFilter(filtered);
  }

  private applyRoleFilter(experiences: Experience[]): void {
    let filtered = experiences;

    if (this.selectedRole) {
      filtered = filtered.filter(e => e.role === this.selectedRole);
    }

    this.applyDepartmentFilter(filtered);
  }

  private applyDepartmentFilter(experiences: Experience[]): void {
    let filtered = experiences;

    if (this.selectedDepartment) {
      filtered = filtered.filter(e => e.department === this.selectedDepartment);
    }

    this.applyStatusFilter(filtered);
  }

  private applyStatusFilter(experiences: Experience[]): void {
    let filtered = experiences;

    if (this.selectedStatus) {
      const now = new Date();
      if (this.selectedStatus === 'active') {
        filtered = filtered.filter(e =>
          new Date(e.startDate) <= now && (!e.endDate || new Date(e.endDate) >= now)
        );
      } else if (this.selectedStatus === 'completed') {
        filtered = filtered.filter(e => e.endDate && new Date(e.endDate) < now);
      }
    }

    this.filteredExperiences = filtered;
    this.updatePagination();
  }

  private updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedExperiences = this.filteredExperiences.slice(start, end);
  }

  deleteExperience(id: number): void {
    if (confirm('Are you sure you want to delete this experience?')) {
      this.experiencesService.deleteExperience(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((success) => {
          if (success) {
            this.loadExperiences();
          }
        });
    }
  }

  getMemberName(memberId: number): string {
    return this.memberMap.get(memberId) || 'Unknown';
  }

  getCurrentDescription(exp: Experience): string {
    const lang = this.languageService.currentLang();
    if (lang === 'fr' && exp.description_fr) return exp.description_fr;
    if (lang === 'es' && exp.description_es) return exp.description_es;
    return exp.description;
  }

  getExperienceStatus(experience: Experience): string {
    const now = new Date();
    if (new Date(experience.startDate) > now) {
      return 'upcoming';
    } else if (!experience.endDate || new Date(experience.endDate) >= now) {
      return 'active';
    } else {
      return 'completed';
    }
  }

  getStatusBadgeClass(experience: Experience): string {
    const status = this.getExperienceStatus(experience);
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

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredExperiences.length / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    const total = this.getTotalPages();
    const pages = [];
    const maxPages = 5;
    
    if (total <= maxPages) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(total, start + maxPages - 1);
      
      if (end - start < maxPages - 1) {
        start = Math.max(1, end - maxPages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

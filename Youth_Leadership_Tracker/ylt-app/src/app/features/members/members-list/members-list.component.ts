import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MembersService } from '../../../services/members.service';
import { AuthService } from '../../../services/auth.service';
import { Member } from '../../../models/member';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 py-6">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Members Management</h1>
              <p class="text-gray-600 dark:text-gray-400 mt-2">Manage your AIESEC local committee members</p>
            </div>
            <a 
              *ngIf="canManageMembers"
              routerLink="/members/create"
              class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
            >
              + Add New Member
            </a>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Search and Filter Bar -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 transition-colors duration-300">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (input)="onSearch()"
                placeholder="Search by name, email..."
                class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <!-- Filter by Department -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
              <select
                [(ngModel)]="selectedDepartment"
                (change)="onFilterChange()"
                class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition"
              >
                <option value="">All Departments</option>
                <option value="IGV">IGV</option>
                <option value="IGT">IGT</option>
                <option value="OGV">OGV</option>
                <option value="OGT">OGT</option>
                <option value="Talent Management">Talent Management</option>
                <option value="Finance">Finance</option>
                <option value="Business Development">Business Development</option>
                <option value="Marketing">Marketing</option>
                <option value="Information Management">Information Management</option>
              </select>
            </div>

            <!-- Sort -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
              <select
                [(ngModel)]="sortBy"
                (change)="onSort()"
                class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition"
              >
                <option value="name">Name (A-Z)</option>
                <option value="email">Email</option>
                <option value="department">Department</option>
                <option value="date">Latest First</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Results Count -->
        <div class="mb-4 text-gray-700 dark:text-gray-300">
          Showing <span class="font-semibold">{{ filteredMembers.length }}</span> of <span class="font-semibold">{{ allMembers.length }}</span> members
        </div>

        <!-- Members Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (member of paginatedMembers; track member.id) {
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition p-6">
              <!-- Member Header -->
              <div class="mb-4">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold mb-3">
                  {{ member.fullName.charAt(0) }}{{ member.fullName.split(' ')[1]?.charAt(0) }}
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ member.fullName }}</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">{{ member.email }}</p>
              </div>

              <!-- Member Info -->
              <div class="space-y-3 mb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-400 text-sm">Department:</span>
                  <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-sm font-semibold rounded-full">
                    {{ member.department }}
                  </span>
                </div>
                <div *ngIf="member.age" class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-400 text-sm">Age:</span>
                  <span class="font-semibold text-gray-900 dark:text-white">{{ member.age }}</span>
                </div>
              </div>

              <!-- Skills -->
              <div class="mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Skills</label>
                <div class="flex flex-wrap gap-2">
                  @for (skill of member.skills; track skill) {
                    <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                      {{ skill }}
                    </span>
                  }
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <a
                  [routerLink]="['/members', member.id]"
                  class="flex-1 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition text-center"
                >
                  View
                </a>
                <a
                  *ngIf="canManageMembers"
                  [routerLink]="['/members', member.id, 'edit']"
                  class="flex-1 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition text-center"
                >
                  Edit
                </a>
                <button
                  *ngIf="canManageMembers"
                  (click)="deleteMember(member.id)"
                  class="flex-1 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredMembers.length === 0" class="text-center py-12">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10h.01M11 10h.01M7 10h.01M9 20h6"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No members found</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search or filters</p>
          <a 
            routerLink="/members/create"
            class="inline-block px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Create First Member
          </a>
        </div>

        <!-- Pagination -->
        <div *ngIf="filteredMembers.length > itemsPerPage" class="flex justify-center items-center gap-2 mt-8">
          <button
            (click)="previousPage()"
            [disabled]="currentPage === 1"
            class="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Previous
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
            Next
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
export class MembersListComponent implements OnInit, OnDestroy {
  private membersService = inject(MembersService);
  private authService = inject(AuthService);

  // Role-based access control
  canManageMembers = this.authService.canManageMembers();

  allMembers: Member[] = [];
  filteredMembers: Member[] = [];
  paginatedMembers: Member[] = [];

  searchQuery = '';
  selectedDepartment = '';
  sortBy = 'name';

  currentPage = 1;
  itemsPerPage = 6;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadMembers();
  }

  private loadMembers(): void {
    this.membersService.getAllMembers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((members) => {
        this.allMembers = members;
        this.applyFiltersAndSort();
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

  onSort(): void {
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  private applyFiltersAndSort(): void {
    let filtered = [...this.allMembers];

    // Apply search
    if (this.searchQuery.trim()) {
      this.membersService.searchMembers(this.searchQuery)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result) => {
          filtered = result;
          this.applyDepartmentFilter(filtered);
        });
    } else {
      this.applyDepartmentFilter(filtered);
    }
  }

  private applyDepartmentFilter(members: Member[]): void {
    let filtered = members;

    // Apply department filter
    if (this.selectedDepartment) {
      filtered = filtered.filter(m => m.department === this.selectedDepartment);
    }

    // Apply sorting
    switch (this.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      case 'email':
        filtered.sort((a, b) => a.email.localeCompare(b.email));
        break;
      case 'department':
        filtered.sort((a, b) => a.department.localeCompare(b.department));
        break;
      case 'date':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    this.filteredMembers = filtered;
    this.updatePagination();
  }

  private updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedMembers = this.filteredMembers.slice(start, end);
  }

  deleteMember(id: number): void {
    if (confirm('Are you sure you want to delete this member?')) {
      this.membersService.deleteMember(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((success) => {
          if (success) {
            this.loadMembers();
          }
        });
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
    return Math.ceil(this.filteredMembers.length / this.itemsPerPage);
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

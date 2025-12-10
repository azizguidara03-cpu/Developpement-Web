import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Navigation Bar (only show when authenticated) -->
      <nav *ngIf="isAuthenticated$ | async" class="bg-white shadow-md border-b-2 border-blue-500">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex justify-between items-center">
            <!-- Logo -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                YLT
              </div>
              <h1 class="text-xl font-bold text-gray-900">Youth Leadership Tracker</h1>
            </div>

            <!-- Navigation Links -->
            <div class="flex gap-6">
              <a
                routerLink="/dashboard"
                routerLinkActive="border-b-2 border-blue-500 text-blue-600"
                class="text-gray-700 hover:text-blue-600 font-semibold py-2 transition"
              >
                Dashboard
              </a>
              <a
                routerLink="/members"
                routerLinkActive="border-b-2 border-blue-500 text-blue-600"
                class="text-gray-700 hover:text-blue-600 font-semibold py-2 transition"
              >
                Members
              </a>
              <a
                routerLink="/experiences"
                routerLinkActive="border-b-2 border-blue-500 text-blue-600"
                class="text-gray-700 hover:text-blue-600 font-semibold py-2 transition"
              >
                Experiences
              </a>
              <a
                routerLink="/profile"
                routerLinkActive="border-b-2 border-blue-500 text-blue-600"
                class="text-gray-700 hover:text-blue-600 font-semibold py-2 transition"
              >
                Profile
              </a>
              <button
                (click)="logout()"
                class="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer (only show when authenticated) -->
      <footer *ngIf="isAuthenticated$ | async" class="bg-gray-900 text-gray-300 py-8 border-t-2 border-blue-500">
        <div class="max-w-7xl mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 class="font-bold text-white mb-4">About</h4>
              <p class="text-sm">Youth Leadership Tracker - AIESEC Local Committee Management System</p>
            </div>
            <div>
              <h4 class="font-bold text-white mb-4">Features</h4>
              <ul class="space-y-2 text-sm">
                <li><a routerLink="/members" class="hover:text-white transition">Member Management</a></li>
                <li><a routerLink="/experiences" class="hover:text-white transition">Experience Tracking</a></li>
                <li><a routerLink="/dashboard" class="hover:text-white transition">Analytics Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-bold text-white mb-4">Support</h4>
              <ul class="space-y-2 text-sm">
                <li><a routerLink="/documentation" class="hover:text-white transition">Documentation</a></li>
                <li><a routerLink="/contact" class="hover:text-white transition">Contact</a></li>
                <li><a routerLink="/faq" class="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-bold text-white mb-4">Version</h4>
              <p class="text-sm">v1.0.0 - Angular 20+</p>
            </div>
          </div>
          <div class="text-center text-sm border-t border-gray-700 pt-4">
            <p>&copy; 2024 Youth Leadership Tracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class App implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated$ = this.authService.isAuthenticated$;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Check authentication status on init
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    // Scroll to top on navigation
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        window.scrollTo(0, 0);
      });
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

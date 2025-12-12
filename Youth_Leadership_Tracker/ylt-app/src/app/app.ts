import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { LanguageService, Language } from './services/language.service';
import { TranslatePipe } from './pipes/translate.pipe';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TranslatePipe],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <!-- Navigation Bar (only show when authenticated) -->
      <nav *ngIf="isAuthenticated$ | async" class="bg-white dark:bg-gray-800 shadow-md border-b-2 border-blue-500 dark:border-blue-400 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex justify-between items-center">
            <!-- Logo -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                YLT
              </div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ 'app_title' | translate }}</h1>
            </div>

            <!-- Navigation Links -->
            <div class="flex gap-6 items-center">
              <a
                routerLink="/dashboard"
                routerLinkActive="border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold py-2 transition"
              >
                {{ 'dashboard' | translate }}
              </a>
              <a
                routerLink="/members"
                routerLinkActive="border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold py-2 transition"
              >
                {{ 'members' | translate }}
              </a>
              <a
                routerLink="/experiences"
                routerLinkActive="border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold py-2 transition"
              >
                {{ 'experiences' | translate }}
              </a>
              <a
                routerLink="/profile"
                routerLinkActive="border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold py-2 transition"
              >
                {{ 'profile' | translate }}
              </a>
              
              <!-- User Role Badge -->
              <div *ngIf="currentUser$ | async as user" class="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                <span class="text-sm text-gray-600 dark:text-gray-300">{{ user.fullName }}</span>
                <span [ngClass]="getRoleBadgeClass(user.userRole)" class="px-2 py-0.5 text-xs font-bold rounded-full uppercase">
                  {{ user.userRole }}
                </span>
              </div>
              
              <!-- Language Switcher -->
              <div class="relative">
                <button
                  (click)="toggleLanguageDropdown()"
                  class="flex items-center gap-1 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  aria-label="Change language"
                >
                  <span class="font-bold text-sm">{{ languageService.currentLang() | uppercase }}</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div *ngIf="languageDropdownOpen" class="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  <button (click)="changeLanguage('en')" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200" [class.font-bold]="languageService.currentLang() === 'en'">English</button>
                  <button (click)="changeLanguage('fr')" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200" [class.font-bold]="languageService.currentLang() === 'fr'">Français</button>
                  <button (click)="changeLanguage('es')" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200" [class.font-bold]="languageService.currentLang() === 'es'">Español</button>
                </div>
              </div>

              <!-- Theme Toggle Button -->
              <button
                (click)="toggleTheme()"
                class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                [attr.aria-label]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
                title="Toggle theme"
              >
                <!-- Sun Icon (shown in dark mode) -->
                <svg *ngIf="themeService.isDark()" class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
                </svg>
                <!-- Moon Icon (shown in light mode) -->
                <svg *ngIf="!themeService.isDark()" class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                </svg>
              </button>
              
              <button
                (click)="logout()"
                class="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
              >
                {{ 'logout' | translate }}
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
      <footer *ngIf="isAuthenticated$ | async" class="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 py-8 border-t-2 border-blue-500 dark:border-blue-400 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 class="font-bold text-white mb-4">{{ 'about' | translate }}</h4>
              <p class="text-sm">{{ 'app_description' | translate }}</p>
            </div>
            <div>
              <h4 class="font-bold text-white mb-4">{{ 'features' | translate }}</h4>
              <ul class="space-y-2 text-sm">
                <li><a routerLink="/members" class="hover:text-white transition">{{ 'members_management' | translate }}</a></li>
                <li><a routerLink="/experiences" class="hover:text-white transition">{{ 'leadership_experiences' | translate }}</a></li>
                <li><a routerLink="/dashboard" class="hover:text-white transition">{{ 'dashboard' | translate }}</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-bold text-white mb-4">{{ 'support' | translate }}</h4>
              <ul class="space-y-2 text-sm">
                <li><a routerLink="/documentation" class="hover:text-white transition">{{ 'documentation' | translate }}</a></li>
                <li><a routerLink="/contact" class="hover:text-white transition">{{ 'contact' | translate }}</a></li>
                <li><a routerLink="/faq" class="hover:text-white transition">{{ 'faq' | translate }}</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-bold text-white mb-4">{{ 'version' | translate }}</h4>
              <p class="text-sm">v1.0.0 - Angular 20+</p>
            </div>
          </div>
          <div class="text-center text-sm border-t border-gray-700 pt-4">
            <p>&copy; 2024 Youth Leadership Tracker. {{ 'rights_reserved' | translate }}</p>
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
  themeService = inject(ThemeService);
  languageService = inject(LanguageService);

  isAuthenticated$ = this.authService.isAuthenticated$;
  currentUser$ = this.authService.currentUser$;
  private destroy$ = new Subject<void>();
  languageDropdownOpen = false;

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

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleLanguageDropdown(): void {
    this.languageDropdownOpen = !this.languageDropdownOpen;
  }

  changeLanguage(lang: Language): void {
    this.languageService.setLanguage(lang);
    this.languageDropdownOpen = false;
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  getRoleBadgeClass(role: string): string {
    const classes: { [key: string]: string } = {
      'admin': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'vp': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'tl': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'member': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };
    return classes[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


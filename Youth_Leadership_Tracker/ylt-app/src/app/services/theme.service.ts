import { Injectable, signal, WritableSignal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Theme types supported by the application.
 */
export type Theme = 'light' | 'dark';

/**
 * ThemeService manages the application theme state, persists to localStorage,
 * and applies the dark class to the document root element.
 * 
 * Uses Angular 20+ signals for reactive state management.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'theme';
  
  /**
   * Current theme signal - reactive state that components can read.
   */
  readonly currentTheme: WritableSignal<Theme> = signal<Theme>('light');

  constructor() {
    // Initialize theme from localStorage on startup
    if (isPlatformBrowser(this.platformId)) {
      const storedTheme = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
      const initialTheme: Theme = storedTheme === 'dark' ? 'dark' : 'light';
      this.currentTheme.set(initialTheme);
      this.applyThemeToDocument(initialTheme);
    }

    // Effect to sync theme changes to localStorage and DOM
    effect(() => {
      const theme = this.currentTheme();
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.STORAGE_KEY, theme);
        this.applyThemeToDocument(theme);
      }
    });
  }

  /**
   * Toggle between light and dark themes.
   */
  toggleTheme(): void {
    const newTheme: Theme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.currentTheme.set(newTheme);
  }

  /**
   * Set a specific theme.
   * @param theme - The theme to apply ('light' or 'dark')
   */
  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }

  /**
   * Get the current theme value.
   */
  getTheme(): Theme {
    return this.currentTheme();
  }

  /**
   * Check if dark mode is currently active.
   */
  isDark(): boolean {
    return this.currentTheme() === 'dark';
  }

  /**
   * Apply the theme class to the document root element.
   */
  private applyThemeToDocument(theme: Theme): void {
    if (isPlatformBrowser(this.platformId)) {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }
}

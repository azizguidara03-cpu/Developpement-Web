import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../services/language.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 transition-colors duration-300">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 transition-colors duration-300">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">📚 {{ 'documentation_title' | translate }}</h1>
          <p class="text-xl text-gray-600 dark:text-gray-400">{{ 'ylt_user_guide' | translate }}</p>
        </div>

        <!-- Documentation Sections -->
        <div class="space-y-6">
          <!-- Getting Started -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300">
            <h2 class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">🚀 {{ 'doc_getting_started' | translate }}</h2>
            <div class="space-y-4 text-gray-700 dark:text-gray-300">
              <p>{{ 'doc_login' | translate }}</p>
              <p>{{ 'doc_dashboard_desc' | translate }}</p>
              <p>{{ 'doc_members_desc' | translate }}</p>
              <p>{{ 'doc_experiences_desc' | translate }}</p>
              <p>{{ 'doc_profile_desc' | translate }}</p>
            </div>
          </div>

          <!-- Members Section -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300">
            <h2 class="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">👥 {{ 'doc_members_management' | translate }}</h2>
            <div class="space-y-4 text-gray-700 dark:text-gray-300">
              <p>{{ 'doc_view_members' | translate }}</p>
              <p>{{ 'doc_search' | translate }}</p>
              <p>{{ 'doc_filter' | translate }}</p>
              <p>{{ 'doc_sort' | translate }}</p>
              <p>{{ 'doc_create' | translate }}</p>
              <p>{{ 'doc_edit_member' | translate }}</p>
              <p>{{ 'doc_delete' | translate }}</p>
            </div>
          </div>

          <!-- Experiences Section -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300">
            <h2 class="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">🏆 {{ 'doc_experiences_tracking' | translate }}</h2>
            <div class="space-y-4 text-gray-700 dark:text-gray-300">
              <p>{{ 'doc_view_experiences' | translate }}</p>
              <p>{{ 'doc_track_progress' | translate }}</p>
              <p>{{ 'doc_advanced_filters' | translate }}</p>
              <p>{{ 'doc_skills_gained' | translate }}</p>
              <p>{{ 'doc_duration_tracking' | translate }}</p>
              <p>{{ 'doc_create_experience' | translate }}</p>
              <p>{{ 'doc_status_badges' | translate }}</p>
            </div>
          </div>

          <!-- Dashboard Section -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300">
            <h2 class="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">📊 {{ 'doc_analytics' | translate }}</h2>
            <div class="space-y-4 text-gray-700 dark:text-gray-300">
              <p>{{ 'doc_key_metrics' | translate }}</p>
              <p>{{ 'doc_top_skills' | translate }}</p>
              <p>{{ 'doc_dept_distribution' | translate }}</p>
              <p>{{ 'doc_role_analysis' | translate }}</p>
              <p>{{ 'doc_quick_actions' | translate }}</p>
            </div>
          </div>

          <!-- Tips Section -->
          <div class="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-lg p-8 transition-colors duration-300">
            <h2 class="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">💡 {{ 'doc_tips' | translate }}</h2>
            <ul class="space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>{{ 'doc_tip1' | translate }}</li>
              <li>{{ 'doc_tip2' | translate }}</li>
              <li>{{ 'doc_tip3' | translate }}</li>
              <li>{{ 'doc_tip4' | translate }}</li>
              <li>{{ 'doc_tip5' | translate }}</li>
              <li>{{ 'doc_tip6' | translate }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DocumentationComponent {
  languageService = inject(LanguageService);
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 transition-colors duration-300">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 transition-colors duration-300">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">❓ {{ 'faq_title' | translate }}</h1>
          <p class="text-xl text-gray-600 dark:text-gray-400">{{ 'faq_find_answers' | translate }}</p>
        </div>

        <!-- FAQ Items -->
        <div class="space-y-4">
          <!-- Q1 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">{{ 'faq_q1' | translate }}</h3>
            <p class="text-gray-700 dark:text-gray-300">
              {{ 'faq_a1' | translate }}
            </p>
          </div>

          <!-- Q2 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">{{ 'faq_q2' | translate }}</h3>
            <p class="text-gray-700 dark:text-gray-300 mb-3">
              {{ 'faq_a2_intro' | translate }}
            </p>
            <ol class="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-1">
              <li>{{ 'faq_a2_step1' | translate }}</li>
              <li>{{ 'faq_a2_step2' | translate }}</li>
              <li>{{ 'faq_a2_step3' | translate }}</li>
              <li>{{ 'faq_a2_step4' | translate }}</li>
            </ol>
          </div>

          <!-- Q3 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">{{ 'faq_q3' | translate }}</h3>
            <p class="text-gray-700 dark:text-gray-300 mb-3">
              {{ 'faq_a3_intro' | translate }}
            </p>
            <ol class="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-1">
              <li>{{ 'faq_a3_step1' | translate }}</li>
              <li>{{ 'faq_a3_step2' | translate }}</li>
              <li>{{ 'faq_a3_step3' | translate }}</li>
              <li>{{ 'faq_a3_step4' | translate }}</li>
              <li>{{ 'faq_a3_step5' | translate }}</li>
            </ol>
          </div>

          <!-- Q4 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">{{ 'faq_q4' | translate }}</h3>
            <p class="text-gray-700 dark:text-gray-300">
              {{ 'faq_a4' | translate }}
            </p>
          </div>

          <!-- Q5 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">{{ 'faq_q5' | translate }}</h3>
            <p class="text-gray-700 dark:text-gray-300">
              {{ 'faq_a5' | translate }}
            </p>
          </div>

          <!-- Q6 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">{{ 'faq_q6' | translate }}</h3>
            <p class="text-gray-700 dark:text-gray-300 mb-3">
              {{ 'faq_a6_intro' | translate }}
            </p>
            <ol class="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-1">
              <li>{{ 'faq_a6_step1' | translate }}</li>
              <li>{{ 'faq_a6_step2' | translate }}</li>
              <li>{{ 'faq_a6_step3' | translate }}</li>
              <li>{{ 'faq_a6_step4' | translate }}</li>
            </ol>
          </div>

          <!-- Q7 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">{{ 'faq_q7' | translate }}</h3>
            <p class="text-gray-700 dark:text-gray-300">
              {{ 'faq_a7' | translate }}
            </p>
          </div>

          <!-- Q8 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">{{ 'faq_q8' | translate }}</h3>
            <p class="text-gray-700 dark:text-gray-300">
              {{ 'faq_a8' | translate }}
            </p>
          </div>

          <!-- Q9 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">{{ 'faq_q9' | translate }}</h3>
            <p class="text-gray-700 dark:text-gray-300">
              {{ 'faq_a9' | translate }}
            </p>
          </div>

          <!-- Q10 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">{{ 'faq_q10' | translate }}</h3>
            <p class="text-gray-700 dark:text-gray-300">
              {{ 'faq_a10' | translate }}
            </p>
          </div>

          <!-- Q11 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">{{ 'faq_q11' | translate }}</h3>
            <p class="text-gray-700 dark:text-gray-300">
              {{ 'faq_a11' | translate }}
            </p>
          </div>

          <!-- Q12 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">{{ 'faq_q12' | translate }}</h3>
            <p class="text-gray-700 dark:text-gray-300">
              {{ 'faq_a12' | translate }}
            </p>
          </div>
        </div>

        <!-- Still Have Questions -->
        <div class="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-lg p-8 mt-8 transition-colors duration-300">
          <h2 class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3">{{ 'still_have_questions' | translate }}</h2>
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            {{ 'faq_contact_prompt' | translate }}
          </p>
          <a 
            routerLink="/contact" 
            class="inline-block px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            {{ 'contact_us' | translate }}
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class FAQComponent {
  languageService = inject(LanguageService);
}

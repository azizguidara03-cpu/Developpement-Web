import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 transition-colors duration-300">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 transition-colors duration-300">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">📚 Documentation</h1>
          <p class="text-xl text-gray-600 dark:text-gray-400">Complete guide to using the Youth Leadership Tracker</p>
        </div>

        <!-- Documentation Sections -->
        <div class="space-y-6">
          <!-- Getting Started -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300">
            <h2 class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">🚀 Getting Started</h2>
            <div class="space-y-4 text-gray-700 dark:text-gray-300">
              <p><strong>1. Login:</strong> Use your AIESEC email and password to access the system</p>
              <p><strong>2. Dashboard:</strong> View your statistics and quick actions on the main dashboard</p>
              <p><strong>3. Members:</strong> Manage all committee members and their information</p>
              <p><strong>4. Experiences:</strong> Track leadership experiences and development</p>
              <p><strong>5. Profile:</strong> Update your personal profile and settings</p>
            </div>
          </div>

          <!-- Members Section -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300">
            <h2 class="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">👥 Members Management</h2>
            <div class="space-y-4 text-gray-700 dark:text-gray-300">
              <p><strong>View Members:</strong> See all committee members in a paginated list</p>
              <p><strong>Search:</strong> Find members by name, email, or department</p>
              <p><strong>Filter:</strong> Filter members by department (IGV, IGT, OGV, OGT, etc.)</p>
              <p><strong>Sort:</strong> Sort by name, email, department, or join date</p>
              <p><strong>Create:</strong> Add new members with skills and department assignment</p>
              <p><strong>Edit:</strong> Update member information</p>
              <p><strong>Delete:</strong> Remove members from the system</p>
            </div>
          </div>

          <!-- Experiences Section -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300">
            <h2 class="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">🏆 Experiences Tracking</h2>
            <div class="space-y-4 text-gray-700 dark:text-gray-300">
              <p><strong>View Experiences:</strong> See all leadership experiences in the system</p>
              <p><strong>Track Progress:</strong> Monitor active, completed, and upcoming experiences</p>
              <p><strong>Advanced Filters:</strong> Filter by role, department, status, and member</p>
              <p><strong>Skills Gained:</strong> Record and track skills learned from each experience</p>
              <p><strong>Duration Tracking:</strong> Automatically calculate experience duration</p>
              <p><strong>Create Experience:</strong> Add new leadership experiences with dates and details</p>
              <p><strong>Status Badges:</strong> Visual indicators for experience status (Active/Completed/Upcoming)</p>
            </div>
          </div>

          <!-- Dashboard Section -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300">
            <h2 class="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">📊 Analytics Dashboard</h2>
            <div class="space-y-4 text-gray-700 dark:text-gray-300">
              <p><strong>Key Metrics:</strong> View total members, experiences, and completion rates</p>
              <p><strong>Top Skills:</strong> See most developed skills across the committee</p>
              <p><strong>Department Distribution:</strong> Visualize member distribution by department</p>
              <p><strong>Role Analysis:</strong> Understand experience distribution by role</p>
              <p><strong>Quick Actions:</strong> Fast access to common tasks and operations</p>
            </div>
          </div>

          <!-- Tips Section -->
          <div class="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-lg p-8 transition-colors duration-300">
            <h2 class="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">💡 Tips & Best Practices</h2>
            <ul class="space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>Use the search feature to quickly find members or experiences</li>
              <li>Regularly update member skills to reflect their development</li>
              <li>Track all leadership experiences for proper evaluation</li>
              <li>Use filters to narrow down results and find what you need</li>
              <li>Check the dashboard regularly for team statistics</li>
              <li>Keep member information up-to-date</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DocumentationComponent {}

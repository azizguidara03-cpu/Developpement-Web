import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 transition-colors duration-300">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 transition-colors duration-300">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">❓ Frequently Asked Questions</h1>
          <p class="text-xl text-gray-600 dark:text-gray-400">Find answers to common questions about YLT</p>
        </div>

        <!-- FAQ Items -->
        <div class="space-y-4">
          <!-- Q1 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">What is Youth Leadership Tracker?</h3>
            <p class="text-gray-700 dark:text-gray-300">
              Youth Leadership Tracker (YLT) is a comprehensive management system designed for AIESEC local committees. 
              It helps track members, their leadership experiences, skills development, and provides analytics on committee performance.
            </p>
          </div>

          <!-- Q2 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">How do I create a new member?</h3>
            <p class="text-gray-700 dark:text-gray-300 mb-3">
              To create a new member:
            </p>
            <ol class="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-1">
              <li>Go to the Members section</li>
              <li>Click the "Create Member" button</li>
              <li>Fill in the member details (name, email, department, age, skills)</li>
              <li>Click "Create" to save</li>
            </ol>
          </div>

          <!-- Q3 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">How do I track an experience?</h3>
            <p class="text-gray-700 dark:text-gray-300 mb-3">
              To track a leadership experience:
            </p>
            <ol class="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-1">
              <li>Navigate to Experiences section</li>
              <li>Click "Create Experience"</li>
              <li>Select the member and role</li>
              <li>Add dates, description, and skills gained</li>
              <li>Save the experience</li>
            </ol>
          </div>

          <!-- Q4 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">Can I search for specific members?</h3>
            <p class="text-gray-700 dark:text-gray-300">
              Yes! The Members section has a powerful search feature. You can search by:
              <br/>• Member name • Email address • Department
              <br/>You can also filter by department and sort by various criteria.
            </p>
          </div>

          <!-- Q5 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">What does the Dashboard show?</h3>
            <p class="text-gray-700 dark:text-gray-300">
              The Dashboard displays:
              <br/>• Total members and experiences count
              <br/>• Active and completed experiences
              <br/>• Top skills in your committee
              <br/>• Member and role distribution
              <br/>• Quick action buttons for common tasks
            </p>
          </div>

          <!-- Q6 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">How do I update my profile?</h3>
            <p class="text-gray-700 dark:text-gray-300 mb-3">
              To update your profile:
            </p>
            <ol class="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-1">
              <li>Click on the "Profile" link in the navigation</li>
              <li>Click the "Edit" button</li>
              <li>Update your information</li>
              <li>Click "Save" to confirm changes</li>
            </ol>
          </div>

          <!-- Q7 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">Is my data saved automatically?</h3>
            <p class="text-gray-700 dark:text-gray-300">
              Yes! All data is automatically saved to your browser's storage. Your data persists even if you close the browser 
              and reopen the application, as long as you don't clear your browser's local storage.
            </p>
          </div>

          <!-- Q8 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">Can I delete a member or experience?</h3>
            <p class="text-gray-700 dark:text-gray-300">
              Yes! You can delete members and experiences (if you have admin access). Simply:
              <br/>• Go to the Members or Experiences section
              <br/>• Find the item you want to delete
              <br/>• Click the delete button
              <br/>• Confirm the action
              <br/><strong>Note:</strong> Deleted items cannot be recovered.
            </p>
          </div>

          <!-- Q9 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">What departments are supported?</h3>
            <p class="text-gray-700 dark:text-gray-300">
              YLT supports the following departments:
              <br/>• IGV (Incoming Global Volunteer)
              <br/>• IGT (Incoming Global Talent)
              <br/>• OGV (Outgoing Global Volunteer)
              <br/>• OGT (Outgoing Global Talent)
              <br/>• Talent Management
              <br/>• Finance
              <br/>• Business Development
              <br/>• Marketing
              <br/>• Information Management
            </p>
          </div>

          <!-- Q10 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">What should I do if I forgot my password?</h3>
            <p class="text-gray-700 dark:text-gray-300">
              Currently, YLT uses a demo authentication system. The default demo credentials are:
              <br/>• Email: admin&#64;aiesec.org (Admin)
              <br/>• Email: ahmed&#64;aiesec.org (VP)
              <br/>• Email: fatima&#64;aiesec.org (TL)
              <br/>• Email: ali&#64;aiesec.org (Member)
              <br/>• Password: password123
            </p>
          </div>

          <!-- Q11 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">How are experiences marked as completed?</h3>
            <p class="text-gray-700 dark:text-gray-300">
              Experiences are automatically marked based on their end date:
              <br/>• <strong>Active:</strong> End date is in the future
              <br/>• <strong>Completed:</strong> End date has passed
              <br/>• <strong>Upcoming:</strong> Start date is in the future
            </p>
          </div>

          <!-- Q12 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">What user roles exist in the system?</h3>
            <p class="text-gray-700 dark:text-gray-300">
              YLT has 4 user roles with different permissions:
              <br/>• <strong>Admin:</strong> Full access to all features
              <br/>• <strong>VP:</strong> Can view all, edit experiences
              <br/>• <strong>TL:</strong> Can view all, edit experiences
              <br/>• <strong>Member:</strong> View-only access
            </p>
          </div>
        </div>

        <!-- Still Have Questions -->
        <div class="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-lg p-8 mt-8 transition-colors duration-300">
          <h2 class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3">Still have questions?</h2>
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            If you couldn't find the answer you're looking for, don't hesitate to contact us.
          </p>
          <a 
            routerLink="/contact" 
            class="inline-block px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class FAQComponent {}

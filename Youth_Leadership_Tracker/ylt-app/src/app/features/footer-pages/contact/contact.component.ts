import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 transition-colors duration-300">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 transition-colors duration-300">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">📞 Contact Us</h1>
          <p class="text-xl text-gray-600 dark:text-gray-400">Get in touch with the YLT team</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Contact Info -->
          <div class="space-y-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300">
              <h2 class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">📍 Contact Information</h2>
              
              <div class="space-y-6">
                <div class="flex items-start gap-4">
                  <div class="text-3xl">📧</div>
                  <div>
                    <h3 class="font-bold text-gray-900 dark:text-white mb-1">Email</h3>
                    <p class="text-gray-600 dark:text-gray-400">contact@aiesec-ylt.com</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="text-3xl">📱</div>
                  <div>
                    <h3 class="font-bold text-gray-900 dark:text-white mb-1">Phone</h3>
                    <p class="text-gray-600 dark:text-gray-400">+216 XX XXX XXXX</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="text-3xl">📍</div>
                  <div>
                    <h3 class="font-bold text-gray-900 dark:text-white mb-1">Office Location</h3>
                    <p class="text-gray-600 dark:text-gray-400">AIESEC Local Committee<br>Tunisia</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="text-3xl">⏰</div>
                  <div>
                    <h3 class="font-bold text-gray-900 dark:text-white mb-1">Office Hours</h3>
                    <p class="text-gray-600 dark:text-gray-400">Monday - Friday: 9:00 AM - 6:00 PM<br>Saturday: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-lg p-8 transition-colors duration-300">
              <h3 class="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">🤝 Follow Us</h3>
              <div class="space-y-2 text-gray-700 dark:text-gray-300">
                <p>• Facebook: /AIESECTunisia</p>
                <p>• LinkedIn: /company/aiesec-tunisia</p>
                <p>• Instagram: @aiesec_tunisia</p>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300">
            <h2 class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">✉️ Send Us a Message</h2>
            
            <form class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input 
                  type="text" 
                  class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input 
                  type="email" 
                  class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                <input 
                  type="text" 
                  class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition"
                  placeholder="Message subject"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea 
                  class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 resize-none transition"
                  rows="5"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <button 
                type="submit"
                class="w-full px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
              >
                Send Message
              </button>
            </form>

            <p class="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
              We'll get back to you as soon as possible
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ContactComponent {}

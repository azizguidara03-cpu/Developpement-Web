import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">📞 Contact Us</h1>
          <p class="text-xl text-gray-600">Get in touch with the YLT team</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Contact Info -->
          <div class="space-y-6">
            <div class="bg-white rounded-lg shadow-md p-8">
              <h2 class="text-2xl font-bold text-blue-600 mb-6">📍 Contact Information</h2>
              
              <div class="space-y-6">
                <div class="flex items-start gap-4">
                  <div class="text-3xl">📧</div>
                  <div>
                    <h3 class="font-bold text-gray-900 mb-1">Email</h3>
                    <p class="text-gray-600">contact@aiesec-ylt.com</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="text-3xl">📱</div>
                  <div>
                    <h3 class="font-bold text-gray-900 mb-1">Phone</h3>
                    <p class="text-gray-600">+216 XX XXX XXXX</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="text-3xl">📍</div>
                  <div>
                    <h3 class="font-bold text-gray-900 mb-1">Office Location</h3>
                    <p class="text-gray-600">AIESEC Local Committee<br>Tunisia</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="text-3xl">⏰</div>
                  <div>
                    <h3 class="font-bold text-gray-900 mb-1">Office Hours</h3>
                    <p class="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM<br>Saturday: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-8">
              <h3 class="text-lg font-bold text-blue-600 mb-3">🤝 Follow Us</h3>
              <div class="space-y-2 text-gray-700">
                <p>• Facebook: /AIESECTunisia</p>
                <p>• LinkedIn: /company/aiesec-tunisia</p>
                <p>• Instagram: @aiesec_tunisia</p>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="bg-white rounded-lg shadow-md p-8">
            <h2 class="text-2xl font-bold text-blue-600 mb-6">✉️ Send Us a Message</h2>
            
            <form class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input 
                  type="text" 
                  class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input 
                  type="text" 
                  class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Message subject"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea 
                  class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
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

            <p class="text-sm text-gray-500 mt-4 text-center">
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

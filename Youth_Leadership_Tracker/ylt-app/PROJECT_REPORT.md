# 📘 Youth Leadership Tracker (YLT) - Comprehensive Project Report

## 1. Executive Summary & Vision

**Youth Leadership Tracker (YLT)** is a specialized web application designed to digitize and optimize the operations of youth-run organizations, with a primary focus on **AIESEC** entities. In the world of youth leadership, managing high turnover rates, tracking individual member development, and maintaining institutional memory are constant challenges. YLT addresses these by providing a centralized, persistent digital ecosystem.

Unlike generic HR tools, YLT is tailored for the **leadership development journey**. It doesn't just store contact info; it tracks the *growth* of a member from a new recruit to a team leader, recording every role, skill acquired, and contribution made. This project serves as a robust proof-of-concept for a modern, scalable organizational management system.

---

## 2. Technical Philosophy & Architecture

### 2.1 The "SaaS-Ready" Architecture
Although currently running as a client-side demo, the application is architected like a production-grade SaaS (Software as a Service) platform. It mimics a full-stack environment using a **Service-Layer Pattern**, decoupling the UI from the data logic. This ensures that migrating to a real backend (like Firebase or REST API) would require changes *only* in the services, touching zero UI code.

### 2.2 Technology Stack Efficiency

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Core Framework** | **Angular 20+** | Chosen for its strict structure, scalability, and powerful CLI. The project uses **Standalone Components**, discarding legacy NgModule complexity for a leaner codebase. |
| **Styling Engine** | **Tailwind CSS** | Enables rapid UI iteration and ensures design consistency through utility classes. It also facilitates the seamless Dark/Light mode implementation. |
| **State Management** | **RxJS + Signals** | A hybrid approach: `BehaviorSubjects` handle global app state (like the user session), while Angular's new `Signals` manage fine-grained, synchronous UI state (like language selection). |
| **Persistence** | **LocalStorage API** | Provides immediate data persistence across refreshes without requiring a database setup, making the app instantly demo-able on any device. |

---

## 3. Deep Dive into Key Features

### 3.1 🔐 Enterprise-Grade Authentication (Simulation)
Security is often an afterthought in demos, but YLT treats it as a first-class feature.
-   **Simulation of Reality**: Instead of a simple "if/else" check, the Auth Service simulates network latency and token validation.
-   **Brute-Force Protection**: The system tracks login failures. If a user fails 3 times, the account is logically "locked" for 5 minutes. This teaches developers how to implement rate-limiting logic on the frontend.
-   **Session Persistence**: Refreshing the page doesn't log you out, thanks to token storage in the browser.

| Login Portal | Registration |
|--------------|--------------|
| ![Login UI](docs/images/login-screen.png) | ![Registration UI](docs/images/register-screen.png) |

**Visual Feedback for Security Events:**
| Invalid Credentials | Security Lockout |
|---------------------|------------------|
| ![Login Failed](docs/images/login-failed.png) | ![Account Locked](docs/images/login-locked.png) |

### 3.2 📊 The Dashboard: A Single Source of Truth
The Dashboard is designed to answer the question: *"How is my Local Committee performing right now?"*
-   **Instant Metrics**: The top cards provide immediate numbers on membership size and active leadership roles.
-   **Visual Analytics**:
    -   *Department Distribution*: A pie chart helps VPs ensuring that HR, Marketing, and Finance departments are balanced.
    -   *Skill Heatmap*: A bar chart showing the most common skills in the organization (e.g., "Public Speaking," "Project Management"), helping identify training gaps.
-   **Adaptive UI**: The entire dashboard respects the user's system theme preference (Dark/Light).

| Dark Mode (High Contrast) | Light Mode (Standard) |
|---------------------------|-----------------------|
| ![Dashboard Dark](docs/images/dashboard-overview.png) | ![Dashboard Light](docs/images/dashboard-light-mode.png) |

### 3.3 👥 Member Management: Beyond a Spreadsheet
This module is the heart of the system. It replaces cumbersome Excel sheets with a dynamic, searchable directory.
-   **360-Degree Profile**: Each member card holds more than just a name. It links to their department, their current status (Active/Alumni), and their unique skill set.
-   **Smart Search**: Finding "John from Finance" or "Anyone with JavaScript skills" takes seconds using the real-time filter pipes.
-   **Data Integerity**: The system prevents duplicate emails, simulating database constraints in the browser.

| Directory View | Profile & Edit |
|----------------|----------------|
| ![Members List](docs/images/members-management.png) | ![Profile Edit](docs/images/user-profile.png) |
| ![Create Member](docs/images/member-create.png) | ![Edit Member](docs/images/member-edit.png) |

### 3.4 🏆 Experience Tracking: Gamifying Leadership
This is the unique value proposition of YLT. It logs the *dates* and *details* of every role a member holds.
-   **Chronological History**: Creates a timeline of a member's journey (e.g., Member -> Team Leader -> Vice President).
-   **Duration Logic**: The system automatically calculates the duration of experiences.
-   **Status Automation**: If an experience's end date passes, the system is smart enough to mark it as "Completed" visually.

| Experience List | Experience Forms |
|-----------------|------------------|
| ![Experience Tracking](docs/images/experiences-tracking.png) | ![Create Experience](docs/images/experience-create.png) |

### 3.5 🌍 Globalization (i18n)
YLT is built for a global network. The interface can instantly switch languages without reloading the page.
-   **Supported Languages**: English, French, and Spanish.
-   **Implementation**: A custom translation pipe (`| translate`) replaces static text with dynamic keys, proving that you don't need heavy libraries to build a multilingual app.

| Spanish Localization Example |
|------------------------------|
| ![Dashboard ES](docs/images/dashboard-es.png) |

---

## 4. Setup Guide

### prerequisites
-   **Node.js** (v18 or higher)
-   **npm** (v9 or higher)

### Quick Start
1.  **Get the Code**:
    ```bash
    git clone https://github.com/your-username/ylt-app.git
    cd ylt-app
    ```
2.  **Ignite the Engine**:
    ```bash
    npm install
    npm start
    ```
3.  **Launch**:
    Open `http://localhost:4200` to see the app in action.

---

## 5. Future Roadmap: From MVP to Product

To evolve YLT into a market-ready product, the following steps are envisioned:
1.  **Backend Integration**: Connect to **Supabase** or **Firebase** to allow real-time collaboration between multiple users on different devices.
2.  **Alumni Network**: Create a dedicated portal for past members to stay connected.
3.  **Gamification Engine**: Add badges and leaderboards based on the number of completed experiences and skills acquired.
4.  **Mobile Application**: Wrap the Angular app using **Capacitor** to deploy it to the App Store and Play Store.

---
## 🤝 Contributors

This project is developed and maintained by [**Aziz Guidara**](https://www.linkedin.com/in/aziz-guidara-082501278/) and [**Zeineb Karoui**](https://www.linkedin.com/in/zeineb-karoui-0738bb2a0/).


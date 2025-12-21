# 📘 Youth Leadership Tracker (YLT) - Project Report

## 1. Executive Summary

**Youth Leadership Tracker (YLT)** is a comprehensive web application engineered to streamline the management of youth organizations, with a specific focus on AIESEC committees. It serves as a central hub for tracking member data, leadership experiences, and organizational analytics, replacing scattered spreadsheets with a modern, cohesive digital solution.

The project leverages **Angular 20+** to provide a high-performance, responsive single-page application (SPA) experience. It features robust role-based management, real-time analytics, and a dynamic localization system.

---

## 2. Technical Architecture

### 2.1 Technology Stack

| Category | Technology | Description |
|----------|------------|-------------|
| **Framework** | Angular 20+ | Standalone functionality, Signals, and localized state management. |
| **Styling** | Tailwind CSS | Utility-first CSS framework for rapid, responsive UI development. |
| **State Management** | RxJS & Signals | `BehaviorSubjects` for global store, `Signals` for local component state. |
| **Visualization** | Ng2-Charts (Chart.js) | Interactive data visualization for dashboard analytics. |
| **Icons** | Lucide Icons | Modern, lightweight SVG icons. |

### 2.2 System Structure

The application follows a modular, lazy-loaded architecture to ensure scalability and optimal initial load times.

```
src/app/
├── features/        # Domain-specific modules (Lazy Loaded)
│   ├── auth/        # Authentication & Security
│   ├── dashboard/   # Analytics & key metrics
│   ├── members/     # Directory & profile management
│   └── experiences/ # Leadership role tracking
├── services/        # Business logic & state persistence
├── guards/          # Route protection (RBAC)
└── pipes/           # Utilities (e.g., Custom Translation Pipe)
```

**Key Architectural Decisions:**
- **Standalone Components**: No `NgModules`, reducing boilerplate and improving tree-shaking.
- **Service-Based State**: Singleton services manage data consistency across components using RxJS `BehaviorSubjects`.
- **Client-Side Persistence**: Data is persisted via `localStorage` to simulate a backend environment for demonstration purposes.

---

## 3. Core Modules & Features

### 3.1 Authentication & Security (`features/auth`)
The application implements a secure, simulation-based authentication system.
- **Credential Validation**: Validates against a mock user database.
- **Security Lockout**: Automatically locks an account for 5 minutes after 3 consecutive failed attempts to prevent brute-force attacks.
- **Session Management**: Uses a token-based approach stored in `localStorage`.

| Login Portal | Registration |
|--------------|--------------|
| ![Login UI](docs/images/login-screen.png) | ![Registration UI](docs/images/register-screen.png) |

**Error Handling & Lockout Visualization:**
| Invalid Attempt | Lockout State |
|-----------------|---------------|
| ![Login Failed](docs/images/login-failed.png) | ![Account Locked](docs/images/login-locked.png) |

### 3.2 Dashboard & Analytics (`features/dashboard`)
The command center of the application, providing real-time insights into organizational health.
- **Metric Cards**: Instant view of total members, active roles, and retention rates.
- **Data Visualization**: Dynamic charts showing skill distribution and department formatting.
- **Theme Support**: Fully optimized for both Light and Dark modes.

| Dark Mode Interface | Light Mode Interface |
|---------------------|----------------------|
| ![Dashboard Dark](docs/images/dashboard-overview.png) | ![Dashboard Light](docs/images/dashboard-light-mode.png) |

### 3.3 Member Management (`features/members`)
A powerful CRUD interface for managing the organization's human capital.
- **Smart Directory**: Searchable and filterable list of all members.
- **Profile Management**: Detailed views for editing personal info, department allocation, and skills.
- **Sync Mechanism**: Updates to member emails automatically sync with authentication credentials.

| Directory View | Profile & Edit |
|----------------|----------------|
| ![Members List](docs/images/members-management.png) | ![Profile Edit](docs/images/user-profile.png) |
| ![Create Member](docs/images/member-create.png) | ![Edit Member](docs/images/member-edit.png) |

### 3.4 Experience Tracking (`features/experiences`)
Tracks the leadership journey of every member.
- **Role Logging**: Records start/end dates, specific roles (e.g., Team Leader), and departments.
- **Status Computation**: Automatically calculates if a role is 'Active' or 'Completed' based on dates.

| Experience List | Experience Forms |
|-----------------|------------------|
| ![Experience Tracking](docs/images/experiences-tracking.png) | ![Create Experience](docs/images/experience-create.png) |

### 3.5 Internationalization (i18n)
Built-in support for global accessibility with a custom translation engine supporting **English**, **French**, and **Arabic**.

| Spanish Localization Example |
|------------------------------|
| ![Dashboard ES](docs/images/dashboard-es.png) |

---

## 4. Coding Standards & Best Practices

The codebase adheres to strict modern Angular conventions:
1.  **Injection Context**: Utilization of the `inject()` function over constructor dependency injection for cleaner classes.
2.  **Reactive Programming**: Extensive use of `AsyncPipe` and `takeUntil` operators to manage memory and subscription lifecycles.
3.  **Strict Typing**: Comprehensive TypeScript interfaces (driven by `models/`) ensure type safety across the application.

---

## 5. Deployment & Setup

### Prerequisites
- Node.js (v18+)
- Angular CLI (`npm i -g @angular/cli`)

### Installation Steps
1.  **Clone & Install**:
    ```bash
    git clone [repo-url]
    npm install
    ```
2.  **Development Server**:
    ```bash
    ng serve
    ```
    Access at `http://localhost:4200`.

3.  **Production Build**:
    ```bash
    npm run build
    ```
    Outputs optimized artifacts to `dist/`.

---

## 6. Future Roadmap

To transition YLT from a robust prototype to an enterprise-grade solution, the following enhancements are planned:
-   **Backend Integration**: Migration from `localStorage` to a unified backend (e.g., Supabase or Firebase) for real-time data syncing.
-   **Advanced Reporting**: Exportable PDF/CSV reports for organizational audits.
-   **Mobile App**: Compilation via Capacitor or Ionic for native mobile experiences.

---
**Report Generated By**: Antigravity AI
**Date**: December 21, 2025

# Youth Leadership Tracker - Codebase Guide

## 📚 Introduction

This guide provides a comprehensive technical overview of the **Youth Leadership Tracker (YLT)** application. It is designed to help developers understand the architecture, data flow, and key implementation details of the project.

---

## 🏛️ Project Architecture

The application follows a standard **Angular 18+ Standalone Component** architecture. It avoids `NgModules` in favor of direct component imports, making the codebase more tree-shakeable and modern.

### High-Level Structure
```
src/
├── app/
│   ├── features/           # Domain-specific modules (lazy loaded)
│   │   ├── auth/           # Login, unauthorized pages
│   │   ├── dashboard/      # Main stats dashboard
│   │   ├── experiences/    # Experience management (List, Form, Detail)
│   │   ├── members/        # Member management (List, Form, Detail)
│   │   └── profile/        # User profile settings
│   ├── guards/             # Route protection (AuthGuard)
│   ├── models/             # TypeScript interfaces and types
│   ├── pipes/              # Custom pipes (TranslatePipe)
│   ├── services/           # Business logic & state management
│   ├── shared/             # Reusable UI components (optional)
│   ├── app.routes.ts       # Application routing definition
│   └── app.component.ts    # Root component (Shell)
├── assets/
│   └── i18n/               # Translation JSON files (en.json, fr.json, ar.json)
└── main.ts                 # Application entry point
```

---

## 🔑 Key Modules & Logic

### 1. Authentication Module (`features/auth`) & `AuthService`
- **Philosophy**: Lightweight, client-side authentication for demo purposes.
- **Mechanism**:
  - Uses `localStorage` to store a fake JWT token (`ylt_token`) and current user data (`ylt_user`).
  - **Lockout Policy**: Enforces a 5-minute lockout after 3 failed login attempts.
  - **Synchronization**: The `syncMemberUpdate` method ensures that when a member's email is updated in the members module, their login credentials are automatically updated in the auth system.

### 2. Members Module (`features/members`) & `MembersService`
- **Purpose**: Manage the directory of youth leaders.
- **CRUD Flow**:
  1. Component calls Service method (e.g., `updateMember`).
  2. Service updates the in-memory `BehaviorSubject`.
  3. Service persists the new state to `localStorage` (`ylt_members`).
  4. **Sync Hook**: If updating a member, it calls `AuthService.syncMemberUpdate` to keep credentials consistent.
- **Validation**: Enforces unique email addresses during creation and updates to prevent account conflicts.

### 3. Experiences Module (`features/experiences`) & `ExperiencesService`
- **Purpose**: Track leadership roles held by members.
- **Relationships**: Each experience is linked to a `memberId`.
- **Status Logic**: Experiences are categorized as Active or Completed based on the `endDate`.

### 4. Internationalization (i18n) System
- **Implementation**: Custom lightweight translation system (no `ngx-translate` dependency).
- **Core Components**:
  - `LanguageService`: Manages current language state (Signal-based).
  - `TranslatePipe`: Pure pipe that transforms keys (e.g., `'HOME.TITLE'`) into text based on the current language.
  - `translations.ts` / JSONs: Stores the dictionary of terms.
- **Usage**:
  ```html
  <h1>{{ 'welcome_message' | translate }}</h1>
  ```

---

## 🔄 Common Logic Flows

### Login Flow
1. User submits login form.
2. `AuthService` validates credentials against mock users + `localStorage` registered users.
3. If valid -> Set token, update `isAuthenticated$` subject, navigate to Dashboard.
4. If invalid -> Increment attempt counter. If > 3, trigger lockout.

### Dashboard Data Loading
1. `DashboardService` subscribes to both `MembersService` and `ExperiencesService`.
2. It aggregates data using `combineLatest` or manual subscription to calculate:
   - Total Members / Experiences.
   - Departments distribution.
   - Top Skills (frequency analysis).
3. Data is pushed to the Dashboard Component for visualization (Chart.js).

---

## 📏 Coding Conventions

1. **Standalone Components**: Always use `standalone: true` and `imports: []`.
2. **Dependency Injection**: Use the `inject()` function instead of constructor injection.
   ```typescript
   // ✅ Good
   private authService = inject(AuthService);
   
   // ❌ Avoid
   constructor(private authService: AuthService) {}
   ```
3. **State Management**:
   - Use `BehaviorSubject` for shared state in services.
   - Use Angular `Signals` for local component state or simple reactive values (like current language).
4. **Subscriptions**:
   - Always unsubscribe using `takeUntil(destroy$)` pattern or `AsyncPipe`.
5. **Naming**:
   - Components: `kebab-case` files (`member-list.component.ts`), `PascalCase` classes (`MemberListComponent`).
   - Services: `feature.service.ts`.
   - Models: `singular.ts` (`member.ts`).

---

## 🚀 Extending the Project

### Adding a New Page
1. **Create Component**: `ng g c features/new-feature/page-name`.
2. **Add Route**: Open `app.routes.ts` and add a new entry:
   ```typescript
   {
     path: 'new-feature',
     loadComponent: () => import('./features/new-feature/page-name.component').then(m => m.PageNameComponent),
     canActivate: [authGuard]
   }
   ```
3. **Add Navigation**: Update the sidebar/footer in `app.component.ts`.

### Adding a New Service
1. **Generate**: `ng g s services/new-feature`.
2. **Logic**: Implement `BehaviorSubject` pattern for data.
3. **Persistence**: Add `localStorage` save/load methods.

---

## 🛠️ Debugging Tips

- **Lost Data?**: Check `Application -> Local Storage` in DevTools. Clear `ylt_members` to reset to mock data.
- **Login Issues?**: Check `ylt_login_attempts` in Local Storage if you are locked out.
- **Translation Missing?**: Ensure the key exists in `LanguageService` dictionaries.

import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./features/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
    // All authenticated users can access dashboard
  },
  {
    path: 'members',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/members/members-list/members-list.component').then(m => m.MembersListComponent)
        // All authenticated users can view members list
      },
      {
        path: 'create',
        loadComponent: () => import('./features/members/member-form/member-form.component').then(m => m.MemberFormComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin'] } // Only admin can create members
      },
      {
        path: ':id',
        loadComponent: () => import('./features/members/member-detail/member-detail.component').then(m => m.MemberDetailComponent)
        // All authenticated users can view member details
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./features/members/member-form/member-form.component').then(m => m.MemberFormComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin'] } // Only admin can edit members
      }
    ]
  },
  {
    path: 'experiences',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/experiences/experiences-list/experiences-list.component').then(m => m.ExperiencesListComponent)
        // All authenticated users can view experiences list
      },
      {
        path: 'create',
        loadComponent: () => import('./features/experiences/experience-form/experience-form.component').then(m => m.ExperienceFormComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin', 'vp', 'tl'] } // Admin, VP, TL can create experiences
      },
      {
        path: ':id',
        loadComponent: () => import('./features/experiences/experience-detail/experience-detail.component').then(m => m.ExperienceDetailComponent)
        // All authenticated users can view experience details
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./features/experiences/experience-form/experience-form.component').then(m => m.ExperienceFormComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin', 'vp', 'tl'] } // Admin, VP, TL can edit experiences
      }
    ]
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'documentation',
    loadComponent: () => import('./features/footer-pages/documentation/documentation.component').then(m => m.DocumentationComponent),
    canActivate: [authGuard]
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/footer-pages/contact/contact.component').then(m => m.ContactComponent),
    canActivate: [authGuard]
  },
  {
    path: 'faq',
    loadComponent: () => import('./features/footer-pages/faq/faq.component').then(m => m.FAQComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

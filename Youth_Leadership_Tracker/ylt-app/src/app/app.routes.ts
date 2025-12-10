import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

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
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'members',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/members/members-list/members-list.component').then(m => m.MembersListComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./features/members/member-form/member-form.component').then(m => m.MemberFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/members/member-detail/member-detail.component').then(m => m.MemberDetailComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./features/members/member-form/member-form.component').then(m => m.MemberFormComponent)
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
      },
      {
        path: 'create',
        loadComponent: () => import('./features/experiences/experience-form/experience-form.component').then(m => m.ExperienceFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/experiences/experience-detail/experience-detail.component').then(m => m.ExperienceDetailComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./features/experiences/experience-form/experience-form.component').then(m => m.ExperienceFormComponent)
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

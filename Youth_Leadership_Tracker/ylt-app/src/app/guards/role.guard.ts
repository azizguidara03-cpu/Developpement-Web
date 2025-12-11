import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth';

/**
 * Role-based access control guard
 * Usage in routes:
 * {
 *   path: 'admin',
 *   loadComponent: ...,
 *   canActivate: [roleGuard],
 *   data: { roles: ['admin'] }
 * }
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // First check if user is authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Get allowed roles from route data
  const allowedRoles = route.data['roles'] as UserRole[] | undefined;

  // If no roles specified, allow access (just needs authentication)
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  // Check if user has any of the allowed roles
  if (authService.hasAnyRole(allowedRoles)) {
    return true;
  }

  // User doesn't have required role, redirect to unauthorized
  router.navigate(['/unauthorized']);
  return false;
};

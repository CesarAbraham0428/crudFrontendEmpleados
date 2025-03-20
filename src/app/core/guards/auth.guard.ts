import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/autenticacion/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'] as string; // Role expected for the route
    const isLoggedIn = this.authService.isLoggedIn();
    const userRole = this.authService.getRole();

    if (!isLoggedIn) {
      this.router.navigate(['/login']); // Redirect to login if not authenticated
      return false;
    }

    if (requiredRole && !this.authService.hasRole(requiredRole)) {
      this.router.navigate(['/forbidden']); // Redirect if role doesn’t match
      return false;
    }

    return true;
  }
}
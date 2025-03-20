import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/autenticacion/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[] | string | undefined; // Cambiamos 'role' a 'roles'
    const isLoggedIn = this.authService.isLoggedIn();
    const userRole = this.authService.getRole();

    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    if (!userRole) {
      this.router.navigate(['/forbidden']);
      return false;
    }

    // Si no hay roles requeridos, permitimos el acceso (rutas públicas o sin restricción de rol)
    if (!requiredRoles) {
      return true;
    }

    // Si requiredRoles es un string, lo convertimos a array para mantener compatibilidad
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    // Verificamos si el rol del usuario está en la lista de roles permitidos
    if (!rolesArray.includes(userRole)) {
      this.router.navigate(['/forbidden']);
      return false;
    }

    return true;
  }
}
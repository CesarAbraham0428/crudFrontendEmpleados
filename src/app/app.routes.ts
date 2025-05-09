import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./modules/auth/login.component').then(m => m.LoginComponent) },
  { path: 'forbidden', loadComponent: () => import('./modules/auth/forbiden/forbidden.component').then(m => m.ForbiddenComponent) },
  { 
    path: 'recursos-humanos', 
    loadChildren: () => import('./modules/recursos-humanos/recursos-humanos.module').then(m => m.RecursosHumanosModule),
    canActivate: [AuthGuard],
    data: { roles: ['rh'] } // Solo rol de RH permitido
  }, 
  { 
    path: 'empleado', 
    loadChildren: () => import('./modules/empleado/empleado.module').then(m => m.EmpleadoModule),
    canActivate: [AuthGuard],
    data: { roles: ['empleado', 'rh'] } // Ambos roles permitidos
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/forbidden' }
];
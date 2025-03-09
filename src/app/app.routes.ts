import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'recursos-humanos', 
    loadChildren: () => import('./modules/recursos-humanos/recursos-humanos.module').then(m => m.RecursosHumanosModule) 
  }, 
  { 
    path: 'empleado', 
    loadChildren: () => import('./modules/empleado/empleado.module').then(m => m.EmpleadoModule) 
  }
];

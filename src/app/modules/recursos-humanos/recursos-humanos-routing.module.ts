import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: 'listaEmpleado',  
    loadComponent: () => import('../recursos-humanos/pages/empleado-list/empleado-list.component')
      .then(m => m.EmpleadoListComponent)  
  }, 
  { 
    path: 'actividades',  
    loadComponent: () => import('../recursos-humanos/pages/asignar-actividad/asignar-actividad.component')
      .then(m => m.AsignarActividadComponent)  
  }, 
  { 
    path: 'cursos-internos',  
    loadComponent: () => import('../recursos-humanos/pages/cursos-internos-list/cursos-internos-list.component')
      .then(m => m.CursosInternosListComponent)  
  },
  { 
    path: 'alta-empleado',  
    loadComponent: () => import('../recursos-humanos/pages/crear-empleado/crear-empleado.component')
      .then(m => m.CrearEmpleadoComponent)  
  },
  { 
    path: 'crear-curso',  
    loadComponent: () => import('../recursos-humanos/pages/crear-curso/crear-curso.component')
      .then(m => m.CrearCursoComponent)  
  }, 
  { 
    path: 'editar-empleado/:ClaveEmpleado',  
    loadComponent: () => import('../recursos-humanos/pages/crear-empleado/crear-empleado.component')
      .then(m => m.CrearEmpleadoComponent)  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecursosHumanosRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  { 
    path: 'cursos-externos-list',  
    loadComponent: () => import('../empleado/pages/curso-list/curso-list.component')
      .then(m => m.CursoListComponent)  
  }, 
  { 
    path: 'cursos-externos',  
    loadComponent: () => import('../empleado/pages/agregar-curso-externo/agregar-curso-externo.component')
      .then(m => m.AgregarCursoExternoComponent)  
  }, 
  { 
    path: 'ver-actividades',  
    loadComponent: () => import('../empleado/pages/ver-actividades/ver-actividades.component')
      .then(m => m.VerActividadesComponent)  
  },
  { 
    path: 'perfil',  
    loadComponent: () => import('../empleado/pages/perfil/perfil.component')
      .then(m => m.PerfilComponent)  
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpleadoRoutingModule { }

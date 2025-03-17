import { Component } from '@angular/core';

import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import {ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-curso-list',
  standalone: true,
  imports: [PanelModule,FloatLabelModule,FieldsetModule,CardModule,TableModule,ButtonModule],
  templateUrl: './curso-list.component.html',
  styleUrl: './curso-list.component.scss'
})
export class CursoListComponent {
   constructor(private router: Router) {}
  
  products: any[] = [
    { Curso: 'C001', TipoDocumento: 'Curso Angular', FechaInicio: 'Programación', FechaFinalizacion: 10,Certificado: 'documento'},
    { Curso: 'C001', TipoDocumento: 'Curso Angular', FechaInicio: 'Programación', FechaFinalizacion: 10,Certificado: 'documento'},
    { Curso: 'C001', TipoDocumento: 'Curso Angular', FechaInicio: 'Programación', FechaFinalizacion: 10,Certificado: 'documento'},
   { Curso: 'C001', TipoDocumento: 'Curso Angular', FechaInicio: 'Programación', FechaFinalizacion: 10,Certificado: 'documento'},
   { Curso: 'C001', TipoDocumento: 'Curso Angular', FechaInicio: 'Programación', FechaFinalizacion: 10,Certificado: 'documento'},
   { Curso: 'C001', TipoDocumento: 'Curso Angular', FechaInicio: 'Programación', FechaFinalizacion: 10,Certificado: 'documento'},
]; 
redirigir() {
  this.router.navigate(['empleado/cursos-externos']);
}
}

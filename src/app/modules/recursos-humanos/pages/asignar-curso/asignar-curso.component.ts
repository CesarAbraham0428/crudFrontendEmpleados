import { Component } from '@angular/core';
;

import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import {Button, ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-asignar-curso',
  standalone: true,
  imports: [PanelModule,CardModule,FieldsetModule,FloatLabelModule,TableModule,ButtonModule],
  templateUrl: './asignar-curso.component.html',
  styleUrl: './asignar-curso.component.scss'
})
export class AsignarCursoComponent {

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

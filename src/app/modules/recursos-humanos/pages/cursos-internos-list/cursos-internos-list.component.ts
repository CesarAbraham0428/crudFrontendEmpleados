import { Component } from '@angular/core';
import { Curso } from '../../../../models/cargarDatos/cargarDatos';


import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CargaDatosService } from '../../../../core/services/cargaDatos/carga-datos.service';
import { EmpleadoService } from '../../../../core/services/empleado/empleado.service';
import { Actividad,Departamento } from '../../../../models/cargarDatos/cargarDatos';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';



@Component({
  selector: 'app-cursos-internos-list',
  standalone: true,
  imports: [TableModule, PanelModule,CardModule,FieldsetModule,FloatLabelModule,ButtonModule,AutoCompleteModule,FormsModule,DatePickerModule],
  templateUrl: './cursos-internos-list.component.html',
  styleUrl: './cursos-internos-list.component.scss'
})
export class CursosInternosListComponent {

filteredItemsActividades: any[] = [];
filteredItemsCursos: any[] = [];
cursosSeleccionados: any;
fechaInicio: Date | null = null;
fechaTermino: Date | null = null;

  constructor(private empleadoService: EmpleadoService, private cargaDatosService: CargaDatosService,private router: Router) {}
  
  ngOnInit() {

    this.cargaDatosService.getCurso().subscribe(data => {
      if (data && data.nombrecurso) {
        this.filteredItemsCursos = data.nombrecurso.map((item:Curso) => ({
          label: item.NombreCurso,
          value: item.NombreCurso
        }));
      } else {
        console.error('La respuesta del backend no tiene la estructura esperada:', data);
      }
    });
  }



  filterItemsCursos(event: any) {
    const query = event.query.toLowerCase();
    this.filteredItemsCursos = this.filteredItemsCursos.filter(item =>
      item.label.toLowerCase().includes(query)
    );
  }



  products: any[] = [
    { Curso: 'C001', TipoDocumento: 'Curso Angular', FechaInicio: 'Programación', FechaFinalizacion: 10,Certificado: 'documento'},
    { Curso: 'C001', TipoDocumento: 'Curso Angular', FechaInicio: 'Programación', FechaFinalizacion: 10,Certificado: 'documento'},
    { Curso: 'C001', TipoDocumento: 'Curso Angular', FechaInicio: 'Programación', FechaFinalizacion: 10,Certificado: 'documento'},
   { Curso: 'C001', TipoDocumento: 'Curso Angular', FechaInicio: 'Programación', FechaFinalizacion: 10,Certificado: 'documento'},
   { Curso: 'C001', TipoDocumento: 'Curso Angular', FechaInicio: 'Programación', FechaFinalizacion: 10,Certificado: 'documento'},
   { Curso: 'C001', TipoDocumento: 'Curso Angular', FechaInicio: 'Programación', FechaFinalizacion: 10,Certificado: 'documento'},
]; 
redirigir() {
  this.router.navigate(['recursos-humanos/crear-curso']);
}
}


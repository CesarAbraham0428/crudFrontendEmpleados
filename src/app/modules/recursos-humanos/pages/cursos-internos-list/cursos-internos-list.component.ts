import { Component } from '@angular/core';
import { Curso } from '../../../../models/cargarDatos/cargarDatos';
import { RecursosHumanosService } from '../../../../core/services/recursos-humanos/recursos-humanos.service';
import { CommonModule } from '@angular/common';


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
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';




@Component({
  selector: 'app-cursos-internos-list',
  standalone: true,
  imports: [TableModule, PanelModule,CardModule,FieldsetModule,FloatLabelModule,ButtonModule,AutoCompleteModule,FormsModule,DatePickerModule,CommonModule,ToastModule],
  providers: [MessageService],
  templateUrl: './cursos-internos-list.component.html',
  styleUrl: './cursos-internos-list.component.scss'
})
export class CursosInternosListComponent {

filteredItemsCursos: any[] = [];
cursosSeleccionados: any;
fechaInicio: Date | null = null;
fechaTermino: Date | null = null;
cursos: any[] = [];

  constructor(private recursoshumanosService: RecursosHumanosService, 
              private cargaDatosService: CargaDatosService,
              private router: Router,
              private messageService: MessageService) {}
  
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

  aplicarFiltros(): void {
   
    const nombreCurso = this.cursosSeleccionados?.value || this.cursosSeleccionados;

    if (!this.cursosSeleccionados && !this.fechaInicio && !this.fechaTermino) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Advertencia', 
        detail: 'Debes seleccionar al menos un filtro para buscar cursos.' 
      });
      return;
    }
  
    // Crear el objeto de filtros
    const filtros = {
      nombreCurso: nombreCurso || null,
      fechaInicio: this.fechaInicio ? this.fechaInicio.toISOString() : null,
      fechaTermino: this.fechaTermino ? this.fechaTermino.toISOString() : null
    };
  
    
    this.recursoshumanosService.obtenerCursos(filtros).subscribe(
      (data) => {
        this.cursos = data;

        if (this.cursos.length === 0) {
          this.messageService.add({ 
            severity: 'info', 
            summary: 'Sin resultados', 
            detail: 'No hay cursos que coincidan con los filtros seleccionados.' 
          });
        } 
      },
      (error) => {
        console.error('Error al obtener los cursos', error);
      }
    );
  }

redirigir() {
  this.router.navigate(['recursos-humanos/crear-curso']);
}
}


import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../../../core/services/empleado/empleado.service';
import { EmpleadoActividad } from '../../../../models/empleado-actividad/empleado-actividad.model';
import { CargaDatosService } from '../../../../core/services/cargaDatos/carga-datos.service';
import { Ciudad,Departamento,Actividad } from '../../../../models/cargarDatos/cargarDatos';

// Importaciones de PrimeNG
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { DividerModule } from 'primeng/divider';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { CheckboxModule } from 'primeng/checkbox';
import { EditableRow } from 'primeng/table';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-asignar-actividad',
  imports:[KeyFilterModule,InputTextModule,PanelModule,CardModule,FieldsetModule,DividerModule,FloatLabelModule,AutoCompleteModule,FormsModule,TableModule,ButtonModule,CheckboxModule,CommonModule],
  standalone: true,
  templateUrl: './asignar-actividad.component.html',
  styleUrls: ['./asignar-actividad.component.scss']
})
export class AsignarActividadComponent implements OnInit {

  empleados: EmpleadoActividad[] = [];
  edicionHabilitada = false; // Variable para activar la edición

  

  actividadSeleccionada: any; // Valor seleccionado en el autocompletado
  departamentoSeleccionado: any; // Valor seleccionado en el autocompletado
  
  filteredItems: any[] = []; // Lista filtrada
  filteredItemsDepartamento: any[] = [];
  filteredItemsActividades: any[] = [];

  constructor(private empleadoService: EmpleadoService, private cargaDatosService: CargaDatosService) {}

  ngOnInit(): void {
    this.obtenerEmpleados();

    this.cargaDatosService.getDepartamentos().subscribe(data => {
      if (data && data.departamentos) {
        this.filteredItemsDepartamento = data.departamentos.map((item:Departamento) => ({
          label: item.NombreDepartamento,
          value: item.NombreDepartamento
        }));
      } else {
        console.error('La respuesta del backend no tiene la estructura esperada:', data);
      }
    });


    this.cargaDatosService.getActividades().subscribe(data => {
      if (data && data.actividades) {
        this.filteredItemsActividades = data.actividades.map((item:Actividad) => ({
          label: item.NombreActividad,
          value: item.NombreActividad
        }));
      } else {
        console.error('La respuesta del backend no tiene la estructura esperada:', data);
      }
    });
  }


 // Llamar al backend para obtener los empleados filtrados
 obtenerEmpleados(): void {
  if (this.actividadSeleccionada&& this.departamentoSeleccionado) {
    this.empleadoService
      .obtenerEmpleadosFiltrados(this.actividadSeleccionada, this.departamentoSeleccionado)
      .subscribe((empleados) => {
        console.log('Empleados filtrados:', empleados);  // Verificar la respuesta
        this.empleados = empleados;
      }, error => {
        console.error('Error al obtener empleados:', error); // En caso de error
      });
  }
}

  filterItemsDepartamentos(event: any) {
    const query = event.query.toLowerCase();
    this.filteredItemsDepartamento = this.filteredItemsDepartamento.filter(item =>
      item.label.toLowerCase().includes(query)
    );
  }


  filterItemsActividades(event: any) {
    const query = event.query.toLowerCase();
    this.filteredItemsActividades = this.filteredItemsActividades.filter(item =>
      item.label.toLowerCase().includes(query)
    );
  }
  

  // Cambia el estado de edición
  activarEdicion(): void {
    this.edicionHabilitada = !this.edicionHabilitada;
  }

  actualizarParticipacion(emp: EmpleadoActividad): void {
    // Cambia el valor de 'participacion' a 1 (participa) o 0 (no participa)
    const participacion = emp.participacion === 1 ? 0 : 1; 
    const actividad = this.actividadSeleccionada;
  
    if (actividad) {
      this.empleadoService.actualizarParticipacion(emp.ClaveEmpleado, actividad, participacion).subscribe(
        (response) => {
          console.log(`Participación de ${emp.NombreEmpleado} actualizada a ${participacion}`);
        },
        (error) => {
          console.error('Error al actualizar participación:', error);
        }
      );
    }
  }
  



  guardarCambios(): void {
    this.empleados.forEach(emp => {
      const estatus = emp.participacion;  // 0 o 1, dependiendo del estado del checkbox
      const actividad = this.actividadSeleccionada;  // Asegúrate de tener el valor correcto de la actividad seleccionada
      
      if (actividad) {
        // Asegúrate de que el nombre de la actividad esté presente
        this.empleadoService.actualizarParticipacion(emp.ClaveEmpleado, actividad, estatus).subscribe(
          (response) => {
            console.log(`Participación de ${emp.NombreEmpleado} actualizada a ${estatus}`);
          },
          (error) => {
            console.error('Error al actualizar participación:', error);
          }
        );
      }
    });
    this.edicionHabilitada = false;
  }
  
}
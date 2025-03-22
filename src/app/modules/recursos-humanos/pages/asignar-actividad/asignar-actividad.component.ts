import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../../../core/services/empleado/empleado.service';
import { EmpleadoActividad } from '../../../../models/empleado-actividad/empleado-actividad.model';
import { CargaDatosService } from '../../../../core/services/cargaDatos/carga-datos.service';
import {Departamento,Actividad } from '../../../../models/cargarDatos/cargarDatos';

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
  if (this.actividadSeleccionada && this.departamentoSeleccionado) {
    this.empleadoService
      .obtenerEmpleadosFiltrados(this.actividadSeleccionada, this.departamentoSeleccionado)
      .subscribe((empleados) => {
        console.log('Empleados filtrados:', empleados);  
        this.empleados = empleados.map(emp => {
          const actividad = emp.ActividadEmpresa.find(act => act.NombreActividad === this.actividadSeleccionada);
          return {
            ...emp,
            ActividadEmpresa: actividad ? [actividad] : [{ NombreActividad: this.actividadSeleccionada, Estatus: 0 }]
          };
        });
      }, error => {
        console.error('Error al obtener empleados:', error); 
      });
  }
}
// Getter para convertir Estatus a booleano
getParticipacion(emp: EmpleadoActividad): boolean {
  return emp.ActividadEmpresa[0].Estatus === 1;
}

// Setter para convertir booleano a Estatus
setParticipacion(emp: EmpleadoActividad, value: boolean): void {
  emp.ActividadEmpresa[0].Estatus = value ? 1 : 0;
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
    const actividad = this.actividadSeleccionada;
    const estatus = emp.ActividadEmpresa[0].Estatus; 
  
    if (actividad) {
      this.empleadoService.actualizarParticipacion(emp.ClaveEmpleado, actividad, estatus).subscribe(
        (response) => {
          console.log(`Participación de ${emp.NombreEmpleado} actualizada a ${estatus}`);
        },
        (error) => {
          console.error('Error al actualizar participación:', error);
        }
      );
    }
  }

  guardarCambios(): void {
    this.empleados.forEach(emp => {
      const estatus = emp.ActividadEmpresa[0].Estatus; 
      const actividad = this.actividadSeleccionada;
  
      if (actividad) {
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

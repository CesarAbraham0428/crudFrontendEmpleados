import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../../../core/services/empleado/empleado.service';
import { EmpleadoActividad } from '../../../../models/empleado-actividad/empleado-actividad.model';

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

  

  puestoSeleccionado: any; // Valor seleccionado en el autocompletado
  departamentoSeleccionado: any; // Valor seleccionado en el autocompletado
  filteredItems: any[] = []; // Lista filtrada

  constructor(private empleadoService: EmpleadoService) {}

  ngOnInit(): void {
    this.obtenerEmpleados();
  }

  obtenerEmpleados(): void {
    this.empleadoService.obtenerEmpleadoActividad().subscribe((empleados) => {
      this.empleados = empleados;
    });
  }

 
  items: any[] = [
    { label: 'Recursos Humanos' },
    { label: 'Tecnologias', value: 'Tecnologias' },
    { label: 'Opción 3', value: '3' },
  ];

  cols: any[] = [
    { label: 'Recursos Humanos' },
    { label: 'Opción 3' }
  ];

  filterItems(event: any) {
    const query = event.query.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      item.label.toLowerCase().includes(query)
    );
  }


  // Cambia el estado de edición
  activarEdicion(): void {
    this.edicionHabilitada = !this.edicionHabilitada;
  }

  // Método para guardar los cambios en la base de datos
  guardarCambios(): void {
    this.empleados.forEach(emp => {
      this.empleadoService.actualizarParticipacion(emp.id, emp.participacion).subscribe(resultado => {
        if (resultado) {
          console.log(`Participación de ${emp.nombreEmpleado} actualizada a ${emp.participacion ? '1' : '0'}`);
        }
      });
    });
    this.edicionHabilitada = false;
  }
}

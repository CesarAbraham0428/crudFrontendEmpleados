import { Component,Inject} from '@angular/core';
import { EmpleadoService } from '../../../../core/services/empleado/empleado.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { Checkbox } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-seleccionar-empleados',
  standalone: true,
  imports: [Button,TableModule,Checkbox,FormsModule],
  providers: [DynamicDialogConfig] ,
  templateUrl: './seleccionar-empleados.component.html',
  styleUrl: './seleccionar-empleados.component.scss'
})
export class SeleccionarEmpleadosComponent {
  empleados: any[] = []; // Lista de empleados disponibles
  empleadosSeleccionados: any[] = []; // Empleados seleccionados

  constructor(
    private empleadoService: EmpleadoService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig // Usamos config para acceder a los datos pasados al diálogo
  ) {}

  ngOnInit() {
    this.empleadoService.getEmpleados().subscribe((empleados) => {
      this.empleados = empleados;
      if (this.config.data?.empleadosSeleccionados) {
        this.empleadosSeleccionados = this.config.data.empleadosSeleccionados;

        // Inicializamos el estado 'selected' de los empleados ya seleccionados
        this.empleados.forEach(emp => {
          if (this.empleadosSeleccionados.some(seleccionado => seleccionado.id === emp.id)) {
            emp.selected = true;
          }
        });
      }
    });
  }

  guardar() {
    // Filtramos los empleados seleccionados
    this.empleadosSeleccionados = this.empleados.filter(emp => emp.selected);

     // Verificamos en consola
     console.log('Empleados seleccionados:', this.empleadosSeleccionados);
    
    // Cerramos el diálogo y pasamos los empleados seleccionados
    this.ref.close(this.empleadosSeleccionados);
  }
}
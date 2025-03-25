import { Component,OnInit} from '@angular/core';
import { EmpleadoService } from '../../../../core/services/empleado/empleado.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { Checkbox } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { Empleado,CargaEmpleadoCursos } from '../../../../models/empleado/empleado';
import { Router } from '@angular/router';



@Component({
  selector: 'app-seleccionar-empleados',
  standalone: true,
  imports: [Button,TableModule,Checkbox,FormsModule],
  providers: [DynamicDialogConfig] ,
  templateUrl: './seleccionar-empleados.component.html',
  styleUrl: './seleccionar-empleados.component.scss'
})
export class SeleccionarEmpleadosComponent implements OnInit {
  empleadosSeleccionados: any[] = []; // Empleados seleccionados
  empleados: CargaEmpleadoCursos[] = [];
  empleadosFiltrados: CargaEmpleadoCursos[] = [];
  searchTerm: string = '';

  constructor(
    private empleadoService: EmpleadoService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private router: Router
  ) {}

  ngOnInit() {
    this.obtenerEmpleados();
  }


 obtenerEmpleados(): void {
    this.empleadoService.getEmpleados().subscribe((response: Empleado[]) => {
      console.log('Empleados recibidos:', response); 
      this.empleados = response.map((empleado: Empleado) => ({
        ClaveEmpleado: empleado.ClaveEmpleado,
        Nombre: `${empleado.Nombre} ${empleado.ApP} ${empleado.ApM}`
      }));
      this.empleadosFiltrados = [...this.empleados];
    });
  }


  filtrarEmpleados() {
    if (this.searchTerm.trim() === '') {
      this.empleadosFiltrados = [...this.empleados]; // Restablecer si está vacío
    } else {
      this.empleadosFiltrados = this.empleados.filter(emp =>
        emp.ClaveEmpleado.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  


  guardar() {
    // Filtramos los empleados seleccionados
    this.empleadosSeleccionados = this.empleados.filter(emp => emp.selected);

     // Verificamos en consola
     console.log('Empleados seleccionados:', this.empleadosSeleccionados);
    
    // Cerramos el diálogo y pasamos los empleados seleccionados
    this.ref.close(this.empleadosSeleccionados);
  }

  redirigir() {
    this.ref.close();
}



}
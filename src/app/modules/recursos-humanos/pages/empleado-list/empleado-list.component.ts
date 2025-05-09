import { Component, OnInit,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadoService } from '../../../../core/services/empleado/empleado.service';
import { Empleado } from '../../../../models/empleado/empleado';

//Importaciones de PrimeNG
import { KeyFilterModule } from 'primeng/keyfilter';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { Table } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ChangeDetectionStrategy } from '@angular/core';




@Component({
  selector: 'app-empleado-list',
  standalone: true,
  imports: [KeyFilterModule,InputTextModule,PanelModule,CardModule,FieldsetModule,IconFieldModule,InputIconModule,FloatLabelModule,FormsModule,TableModule,ButtonModule,DropdownModule,MultiSelectModule,SliderModule,ProgressBarModule,CommonModule,TagModule,ConfirmDialogModule],
  providers: [ConfirmationService], 
  templateUrl: './empleado-list.component.html',
  styleUrl: './empleado-list.component.scss'
})
export class EmpleadoListComponent implements OnInit {
constructor(private empleadoService: EmpleadoService, private router: Router, private confirmationService: ConfirmationService,) {
  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
}


@ViewChild('dt1') dt1!: Table; 
selectedAgent: any[] = [];
selectedStatus: string = '';
customers: Empleado[] = [];
loading: boolean = false;
  
  filterGlobalValue(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.dt1.filterGlobal(inputValue, 'contains'); 
  }


  representatives: any[] = []; 
  statuses: any[] = [


    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'Suspended', value: 'Suspended' }
  ];
  activityValues: number[] = [0, 100];



  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.empleadoService.getEmpleados().subscribe(
      (data: Empleado[]) => { 
        this.customers = data;  // Ahora `data` es directamente un array de `Empleado`
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar los empleados', error);
        this.loading = false;
      }
    );
  }


  getSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    switch(status) {
      case "Active":
        return "success";
      case "Inactive":
        return "danger";
      // Otros casos aquí
      default:
        return undefined; // O puedes asignar un valor por defecto
    }
  }
  
  clear(dt: any) {
    dt.clear();
  }
     //command: () => this.navigateTo('/recursos-humanos/cursos')

     redirigir() {
      this.router.navigate(['recursos-humanos/alta-empleado']);
}


eliminarEmpleado(ClaveEmpleado: string) {
  this.confirmationService.confirm({
    message: '¿Estás seguro de que deseas eliminar este empleado?',
    header: 'Confirmación de Eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí',
    rejectLabel: 'No',
    accept: () => {
      this.empleadoService.eliminarEmpleado(ClaveEmpleado).subscribe({
        next: () => {
          console.log('Empleado eliminado exitosamente');
          // Opcionalmente, redirigir o actualizar la lista de empleados
          this.router.navigate(['recursos-humanos/listaEmpleado']);
        },
        error: (err) => {
          console.error('Error al eliminar empleado:', err);
        }
      });
    },
    reject: () => {
      console.log('Eliminación cancelada');
    }
  });
}
  //EDITAR EMPLEADO 
  editarEmpleado(ClaveEmpleado: string) {
    this.router.navigate(['recursos-humanos/editar-empleado', ClaveEmpleado]);
  }

}

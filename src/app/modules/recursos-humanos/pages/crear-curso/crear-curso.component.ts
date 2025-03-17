import { Component,OnInit } from '@angular/core';


//Importaciones de PrimeNG
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
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SeleccionarEmpleadosComponent } from '../seleccionar-empleados/seleccionar-empleados.component';




@Component({
  selector: 'app-crear-curso',
  standalone: true,
  imports: [KeyFilterModule,InputTextModule,PanelModule,CardModule,FieldsetModule,DatePickerModule,ButtonModule,FloatLabelModule,AutoCompleteModule,DividerModule,SkeletonModule,TableModule,FormsModule],
  providers:[DialogService,DynamicDialogRef],
  templateUrl: './crear-curso.component.html',
  styleUrl: './crear-curso.component.scss'
})
export class CrearCursoComponent implements OnInit {
  puestoSeleccionado: any; // Valor seleccionado en el autocompletado
  departamentoSeleccionado: any; // Valor seleccionado en el autocompletado
  ciudadSeleccionada: any; // Valor seleccionado en el autocompletado
  CPSeleccionado: any; // Valor seleccionado en el autocompletado
  Seleccionado: any; // Valor seleccionado en el autocompletado
  filteredItems: any[] = []; // Lista filtrada
  display: boolean = false;
  ref: DynamicDialogRef | undefined;
  empleadosSeleccionados: any[] = []; // Aquí se guardan los empleados seleccionados


 
  
  constructor(private router: Router,public dialogService: DialogService) {}

  

  ngOnInit() {
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
  redirigir() {
    this.router.navigate(['recursos-humanos/cursos-internos']);
}
showDialog() {
  this.display = true; // Muestra el diálogo
}
abrirDialogo() {
    this.ref = this.dialogService.open(SeleccionarEmpleadosComponent, {
      header: 'Seleccionar Empleados',
      width: '50%',
      data: { empleadosSeleccionados: this.empleadosSeleccionados } // Pasamos los datos de empleados seleccionados al diálogo
    });

    this.ref.onClose.subscribe((empleados: any[]) => {
      if (empleados) {
        this.empleadosSeleccionados = empleados;
        console.log('Empleados seleccionados:', this.empleadosSeleccionados);
      }
    });
  }

}

 interface Familiar {
  nombreFamiliar: string;
  parentesco: string;
  telefonos: string[];
  correos: string[];
}



import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


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
import { Select } from 'primeng/select';




@Component({
  selector: 'app-crear-empleado',
  standalone: true,
  imports: [InputTextModule,KeyFilterModule,PanelModule,FieldsetModule,DividerModule,CardModule,DatePickerModule,FloatLabelModule,AutoCompleteModule,ButtonModule,FormsModule,TableModule,CommonModule,SkeletonModule],
  templateUrl: './crear-empleado.component.html',
  styleUrl: './crear-empleado.component.scss'
})
export class CrearEmpleadoComponent implements OnInit {
  puestoSeleccionado: any; // Valor seleccionado en el autocompletado
  departamentoSeleccionado: any; // Valor seleccionado en el autocompletado
  ciudadSeleccionada: any; // Valor seleccionado en el autocompletado
  CPSeleccionado: any; // Valor seleccionado en el autocompletado
  Seleccionado: any; // Valor seleccionado en el autocompletado
  filteredItems: any[] = []; // Lista filtrada
 isEditing: boolean = false;
 constructor(private router: Router) {}

  

 ngOnInit() {
 }


 // Dependiente que estamos agregando o editando
 nuevoDependiente: Familiar = {
   nombreFamiliar: '',
   parentesco: '',
   telefonos: [''], // Inicializamos con un teléfono vacío
   correos: [''], // Inicializamos con un correo vacío
 };

 dependientes: Familiar[] = [];

 // Función para agregar un nuevo dependiente a la tabla
 agregarDependiente() {
   if (
     this.nuevoDependiente.nombreFamiliar &&
     this.nuevoDependiente.parentesco &&
     this.nuevoDependiente.telefonos.length > 0 &&
     this.nuevoDependiente.correos.length > 0
   ) {
     // Añadir el dependiente a la lista
     this.dependientes.push({ ...this.nuevoDependiente });

     // Limpiar el formulario para el siguiente registro
     this.resetForm();
   } else {
     alert('Por favor, complete todos los campos.');
   }
 }

 // Función para agregar un nuevo número de teléfono
 agregarTelefono() {
   this.nuevoDependiente.telefonos.push('');
 }

 // Función para agregar un nuevo correo electrónico
 agregarCorreo() {
   this.nuevoDependiente.correos.push('');
 }

 // Limpiar el formulario
 resetForm() {
   this.nuevoDependiente = {
     nombreFamiliar: '',
     parentesco: '',
     telefonos: [''],
     correos: [''],
   };
   this.isEditing = false; // Deja de mostrar la fila editable
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
    this.router.navigate(['recursos-humanos/listaEmpleado']);
}
}

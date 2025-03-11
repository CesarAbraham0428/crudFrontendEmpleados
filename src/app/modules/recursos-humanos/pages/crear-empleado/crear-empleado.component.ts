 interface Familiar {
  nombreFamiliar: string;
  parentesco: string;
  telefonos: string[];
  correos: string[];
  editando: boolean; 
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
import { InputMaskModule } from 'primeng/inputmask';




@Component({
  selector: 'app-crear-empleado',
  standalone: true,
  imports: [InputTextModule,KeyFilterModule,PanelModule,FieldsetModule,DividerModule,CardModule,DatePickerModule,FloatLabelModule,AutoCompleteModule,ButtonModule,FormsModule,TableModule,CommonModule,SkeletonModule,FormsModule,InputMaskModule],
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
  filteredItemsSexo: any[] = []; // Lista filtrada
  sexoSeleccionado: string = '';
  filteredItemsRol: any[] = []; // Lista filtrada
  RolSeleccionado: string = '';
 
 

 dependientes: Familiar[] = [];


 usuario = {
  Nombre: '',
  ApP: '',
  ApM: '',
  FechaNacimiento: '',
  RFC: '',
  Correos: [''],  // Inicia con un campo de correo
  Telefonos: [''],// Inicia con un campo de teléfono
  editando: false
};

// Agregar otro correo
agregarCorreoU() {
  this.usuario.Correos.push('');
}

// Agregar otro teléfono
agregarTelefonoU() {
  this.usuario.Telefonos.push('');
}

// Registrar usuario
registrarUsuario() {
  console.log("Usuario Registrado:", this.usuario);
  // Aquí harías la petición al backend con el objeto `this.usuario`
}



 constructor(private router: Router) {}

  

 ngOnInit() {

 }

 agregarDependiente() {
  this.dependientes.push({
    nombreFamiliar: '',
    parentesco: '',
    telefonos: [''],
    correos: [''],
    editando: true // Nuevo campo para indicar que está en edición
  });
}


 // Agregar un campo de teléfono en un dependiente
 agregarTelefono(dependiente: Familiar) {
  dependiente.telefonos.push('');
}

// Agregar un campo de correo en un dependiente
agregarCorreo(dependiente: Familiar) {
  dependiente.correos.push('');
}

// Eliminar un dependiente de la lista
eliminarDependiente(index: number) {
  this.dependientes.splice(index, 1);
}
// Eliminar un dependiente de la lista

// Guarda los cambios y desactiva el modo edición
guardarDependiente(dependiente: Familiar) {
  dependiente.editando = false;
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

  allItems = [
    { label: "Masculino", value: "M" },
    { label: "Femenino", value: "F" }
  ];
  ItemsRol = [
    { label: "Empleado", value: "Empleado" },
    { label: "Recursos Humanos", value: "RH" }
  ];

  filterItems(event: any) {
    const query = event.query.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      item.label.toLowerCase().includes(query)
    );
  }

  filterItemssSexo(event: any) {
    const query = event.query.toLowerCase();
    this.filteredItemsSexo = this.allItems.filter(allItems =>
    allItems.label.toLowerCase().includes(query)
    );
  }

  filterItemssRol(event: any) {
    const query = event.query.toLowerCase();
    this.filteredItemsRol = this.ItemsRol.filter(ItemsRol =>
    ItemsRol.label.toLowerCase().includes(query)
    );
  }
  redirigir() {
    this.router.navigate(['recursos-humanos/listaEmpleado']);
}
eliminarCorreo(index: number) {
  // Eliminar el correo en el índice especificado
  this.usuario.Correos.splice(index, 1);
}
eliminarTelefono(index: number) {
  // Eliminar el correo en el índice especificado
  this.usuario.Telefonos.splice(index, 1);
}

trackByFn(index: number, item: any): any {
  return index; // o algún identificador único del elemento
}
}

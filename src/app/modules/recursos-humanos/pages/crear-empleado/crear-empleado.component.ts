import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmpleadoService } from '../../../../core/services/empleado/empleado.service';
import { Empleado, ReferenciaFamiliar, Domicilio } from '../../../../models/empleado/empleado';  // Importa todos los modelos necesarios
import { CargaDatosService } from '../../../../core/services/cargaDatos/carga-datos.service';
import { Observable } from 'rxjs';
import {Departamento,Ciudad,Parentesco,Puesto} from '../../../../models/cargarDatos/cargarDatos';

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
import { PasswordModule } from 'primeng/password';
import { FileUploadModule } from 'primeng/fileupload';





@Component({
  selector: 'app-crear-empleado',
  standalone: true,
  imports: [InputTextModule,KeyFilterModule,PanelModule,FieldsetModule,DividerModule,CardModule,DatePickerModule,FloatLabelModule,AutoCompleteModule,ButtonModule,FormsModule,TableModule,CommonModule,SkeletonModule,FormsModule,InputMaskModule,PasswordModule,FileUploadModule],
  templateUrl: './crear-empleado.component.html',
  styleUrl: './crear-empleado.component.scss'
})
export class CrearEmpleadoComponent implements OnInit {

  nuevoEmpleado: Empleado = {
    ClaveEmpleado: '',  // Se generará en el backend
    Nombre: '',
    ApP: '',
    ApM: '',
    FechaNacimiento: '',
    RFC: '',
    Sexo: '',
    Departamento: '',
    Puesto: '',
    Telefono: [''],
    CorreoElectronico: [''],
    Password: '',  
    Rol: '',
    CursoExterno: [{ Nombre: '', TipoCurso: '', FechaInicio: '', FechaFin: '' }],  // ✅ Agrega un objeto vacío con estructura
    ActividadEmpresa: [{ NombreActividad: '', Estatus: 0 }],  // ✅ Incluye al menos un objeto válido
    ReferenciaFamiliar: [{ NombreFamiliar: '', Parentesco: '', Telefono: [], CorreoElectronico: '' }], // ✅ Estructura correcta
    createdAt: new Date().toISOString(),
    Domicilio: {
      Calle: '',
      NumeroExterior: '',
      NumeroInterior: '',
      Colonia: '',
      CodigoPostal: '',
      Ciudad: ''
    }
  };

  // Propiedades para almacenar referencias familiares
   nuevaReferenciaFamiliar() {
    this.nuevoEmpleado.ReferenciaFamiliar.push({
      NombreFamiliar: '',
      Parentesco: '',
      Telefono: [''], 
      CorreoElectronico: '' 
    });
  }

  filteredItemsDepartamento: any[] = [];
  filteredItemsPuesto: any[] = [];
  filteredItemsCiudad: any[] = [];
  filteredItemsParentesco: any[] = [];


  CPSeleccionado: any; // Valor seleccionado en el autocompletado
  Seleccionado: any; // Valor seleccionado en el autocompletado
  filteredItemsSexo: any[] = []; // Lista filtrada
  sexoSeleccionado: string = '';
  filteredItemsRol: any[] = []; // Lista filtrada
  RolSeleccionado: string = '';
  uploadedFiles: any[] = [];
 


// Agregar otro correo
agregarCorreoU() {
  this.nuevoEmpleado.CorreoElectronico.push('');
}

// Agregar otro teléfono
agregarTelefonoU() {
  this.nuevoEmpleado.Telefono.push('');
}

 constructor(private router: Router, private empleadoService: EmpleadoService,private cargaDatosService: CargaDatosService) {}

 // Método para registrar el empleado
 registrarEmpleado(): void {
  console.log('Datos enviados:', this.nuevoEmpleado); 
  this.empleadoService.registrarEmpleado(this.nuevoEmpleado).subscribe({
    next: (empleado) => {
      console.log('Empleado registrado:', empleado);
      // Limpiar el formulario si el registro fue exitoso
      this.limpiarFormulario();
    },
    error: (error) => {
      console.error('Error al registrar el empleado:', error);
    }
  });
}


// Método para limpiar el formulario del empleado
limpiarFormulario(): void {
  this.nuevoEmpleado = {
    ClaveEmpleado: '',
    Nombre: '',
    ApP: '',
    ApM: '',
    FechaNacimiento: '',
    RFC: '',
    Sexo: '',
    Departamento: '',
    Puesto: '',
    Telefono: [],
    CorreoElectronico: [],
    Password: '',
    Rol: '',
    CursoExterno: [],
    ActividadEmpresa: [],
    ReferenciaFamiliar: [],
    createdAt: new Date().toISOString(),
    Domicilio: {
      Calle: '',
      NumeroExterior: '',
      NumeroInterior: '',
      Colonia: '',
      CodigoPostal: '',
      Ciudad: ''
    }
  };
}

ngOnInit() {
  this.cargaDatosService.getDepartamentos().subscribe(data => {
    // Verifica que data sea un objeto y que tenga la propiedad "departamentos" 
    if (data && data.departamentos) {
      this.filteredItemsDepartamento = data.departamentos.map((item:Departamento) => ({
        label: item.NombreDepartamento,
        value: item.NombreDepartamento
      }));
    } else {
      console.error('La respuesta del backend no tiene la estructura esperada:', data);
    }
  });

  this.cargaDatosService.getCiudades().subscribe(data => {
    if (data && data.ciudades) {
      this.filteredItemsCiudad = data.ciudades.map((item:Ciudad) => ({
        label: item.nombreCiudad,
        value: item.nombreCiudad
      }));
    } else {
      console.error('La respuesta del backend no tiene la estructura esperada:', data);
    }
  });

  this.cargaDatosService.getParentescos().subscribe(data => {
    if (data && data.parentesco) {
      this.filteredItemsParentesco = data.parentesco.map((item:Parentesco) => ({
        label: item.Parentesco,
        value: item.Parentesco
      }));
    } else {
      console.error('La respuesta del backend no tiene la estructura esperada:', data);
    }
  });

  this.cargaDatosService.getPuestos().subscribe(data => {
    if (data && data.puestos) {
      this.filteredItemsPuesto = data.puestos.map((item:Puesto) => ({
        label: item.NombrePuesto,
        value: item.NombrePuesto
      }));
    } else {
      console.error('La respuesta del backend no tiene la estructura esperada:', data);
    }
  });
}


eliminarReferencia(index: number): void {
  this.nuevoEmpleado.ReferenciaFamiliar.splice(index, 1);
}

agregarTelefono(referencia: any): void {
  referencia.Telefono.push('');
}

eliminarTelefono(referencia: any, indice: number): void {
  if (indice >= 0 && indice < referencia.Telefono.length) {
    referencia.Telefono.splice(indice, 1);
  }
}



  allItems = [
    { label: "Masculino", value: "M" },
    { label: "Femenino", value: "F" }
  ];
  ItemsRol = [
    { label: "Empleado", value: "Empleado" },
    { label: "Recursos Humanos", value: "RH" }
  ];



  filterItemsDepartamento(event: any) {
    const query = event.query.toLowerCase();
    this.filteredItemsDepartamento = this.filteredItemsDepartamento.filter(item =>
      item.label.toLowerCase().includes(query)
    );
  }

  filterItemsCiudad(event: any) {
    const query = event.query.toLowerCase();
    this.filteredItemsCiudad = this.filteredItemsCiudad.filter(item =>
      item.label.toLowerCase().includes(query)
    );
  }

  filterItemsParentesco(event: any) {
    const query = event.query.toLowerCase();
    this.filteredItemsParentesco = this.filteredItemsParentesco.filter(item =>
      item.label.toLowerCase().includes(query)
    );
  }

  filterItemsPuesto(event: any) {
    const query = event.query.toLowerCase();
    this.filteredItemsPuesto = this.filteredItemsPuesto.filter(item =>
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
  this.nuevoEmpleado.CorreoElectronico.splice(index, 1);
}
eliminarTelefonoU(index: number) {
  // Eliminar el correo en el índice especificado
  this.nuevoEmpleado.Telefono.splice(index, 1);
}


trackByFn(index: number, item: any): any {
  return index; // o algún identificador único del elemento
}

onUpload(event: any) {
  for (let file of event.files) {
    this.uploadedFiles.push(file);
  }
}


}

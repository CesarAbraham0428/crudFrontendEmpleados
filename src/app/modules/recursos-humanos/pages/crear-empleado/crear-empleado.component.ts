import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmpleadoService } from '../../../../core/services/empleado/empleado.service';
import { Empleado} from '../../../../models/empleado/empleado';
import { CargaDatosService } from '../../../../core/services/cargaDatos/carga-datos.service';
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
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-crear-empleado',
  standalone: true,
  imports: [InputTextModule,KeyFilterModule,PanelModule,FieldsetModule,DividerModule,CardModule,DatePickerModule,FloatLabelModule,AutoCompleteModule,ButtonModule,FormsModule,TableModule,CommonModule,SkeletonModule,FormsModule,InputMaskModule,PasswordModule,FileUploadModule,ToastModule],
  providers:[MessageService],
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
    FotoEmpleado: null,
    Departamento: '',
    Puesto: '',
    Telefono: [''],
    CorreoElectronico: [''],
    Password: '',  
    Rol: '',
    CursoExterno: [{ Nombre: '', TipoCurso: '', FechaInicio: '', FechaFin: '' }],
    ActividadEmpresa: [{ NombreActividad: '', Estatus: 0 }],
    ReferenciaFamiliar: [{ NombreFamiliar: '', Parentesco: '', Telefono: [''], CorreoElectronico: '' }],
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
  fotoVistaPrevia: string | ArrayBuffer | null = null;
  isEditMode: boolean = false;
  rfcInvalido: boolean = false;
  formInvalid: boolean = false;

  formatearRFC() {
    let valor = this.nuevoEmpleado.RFC.toUpperCase(); // Convierte todo a mayúsculas
    
    // Quita cualquier caracter que no sea letra o número
    valor = valor.replace(/[^A-Z0-9]/g, ""); 
    
    // Separa en letras y números (si los hay)
    let letras = valor.substring(0, 4).replace(/[^A-Z]/g, ""); // Solo letras en los primeros 4 caracteres
    let numeros = valor.substring(4, 10).replace(/[^0-9]/g, ""); // Solo números en los últimos 6 caracteres
    
    // Reconstruye el RFC con el formato correcto
    this.nuevoEmpleado.RFC = letras + (letras.length === 4 ? "-" : "") + numeros;
  }


  validarRFC(): boolean {
    const rfcPattern = /^[A-Za-z]{4}-\d{6}$/; 
    return rfcPattern.test(this.nuevoEmpleado.RFC);
  }


  // Propiedades para almacenar referencias familiares
   nuevaReferenciaFamiliar() {
    this.nuevoEmpleado.ReferenciaFamiliar.push({
      NombreFamiliar: '',
      Parentesco: '',
      Telefono: [''], 
      CorreoElectronico: '' 
    });
  }



// Agregar otro correo
agregarCorreoU() {
  this.nuevoEmpleado.CorreoElectronico.push('');
}

// Agregar otro teléfono
agregarTelefonoU() {
  this.nuevoEmpleado.Telefono.push('');
}

 constructor(private router: Router, private empleadoService: EmpleadoService,private cargaDatosService: CargaDatosService, private messageService: MessageService,private route: ActivatedRoute) {}
 validarFormulario(): boolean {
  if (
    !this.nuevoEmpleado.Nombre ||
    !this.nuevoEmpleado.ApP ||
    !this.nuevoEmpleado.ApM ||
    !this.nuevoEmpleado.RFC ||
    !this.nuevoEmpleado.FechaNacimiento ||
    !this.nuevoEmpleado.Sexo ||
    !this.nuevoEmpleado.Departamento ||
    !this.nuevoEmpleado.Telefono ||
    !this.nuevoEmpleado.CorreoElectronico ||
    !this.nuevoEmpleado.Puesto ||
    !this.nuevoEmpleado.Password ||
    !this.nuevoEmpleado.Rol ||
    !this.nuevoEmpleado.Domicilio.Calle ||
    !this.nuevoEmpleado.Domicilio.NumeroExterior ||
    !this.nuevoEmpleado.Domicilio.Colonia ||
    !this.nuevoEmpleado.Domicilio.CodigoPostal ||
    !this.nuevoEmpleado.Domicilio.Ciudad 
  ) {
    this.formInvalid = true;
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Completa los campos son obligatorios.' });
    return false;
  }

  // Validar teléfonos
  if (this.nuevoEmpleado.Telefono.length === 0 || this.nuevoEmpleado.Telefono.some(t => !t)) {
    this.formInvalid = true;
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe proporcionar al menos un teléfono válido.' });
    return false;
  }

  // Validar correos electrónicos
  if (this.nuevoEmpleado.CorreoElectronico.length === 0 || this.nuevoEmpleado.CorreoElectronico.some(c => !c)) {
    this.formInvalid = true;
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe proporcionar al menos un correo electrónico válido.' });
    return false;
  }

  // Validar referencias familiares
  if (this.nuevoEmpleado.ReferenciaFamiliar.length === 0 || this.nuevoEmpleado.ReferenciaFamiliar.some(r => !r.NombreFamiliar || !r.Parentesco)) {
    this.formInvalid = true;
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe proporcionar al menos un familiar con nombre y parentesco válidos.' });
    return false;
  }
  this.formInvalid = false;
  return true;
}

 // Método para registrar el empleado
 registrarEmpleado(): void {
  if (!this.validarFormulario()) {
    return;
  }
  console.log('Datos enviados:', this.nuevoEmpleado);
  this.empleadoService.registrarEmpleado(this.nuevoEmpleado).subscribe({
    next: (empleado) => {
      console.log('Empleado registrado:', empleado);
      this.limpiarFormulario();
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Empleado registrado correctamente.' });
    },
    error: (error) => {
      if (error.status === 413) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La imagen es demasiado grande. El tamaño máximo permitido es 10 MB.' });
      } else {
        console.error('Error al registrar el empleado:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar el empleado.' });
      }
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
    FotoEmpleado: null,
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


  //CAMBIE PARA EDITAR 
  this.route.paramMap.subscribe(params => {
    const ClaveEmpleado = params.get('ClaveEmpleado'); 
    if (ClaveEmpleado) {
      this.isEditMode = true;
      this.obtenerEmpleadoPorClave(ClaveEmpleado);
    }
  });

}


eliminarReferencia(index: number): void {
  if (this.nuevoEmpleado.ReferenciaFamiliar.length > 1) {
    this.nuevoEmpleado.ReferenciaFamiliar.splice(index, 1);
  } else {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Debe haber al menos una referencia familiar.'
    });
  }
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

eliminarCorreo(index: number): void {
  if (this.nuevoEmpleado.CorreoElectronico.length > 1) {
    this.nuevoEmpleado.CorreoElectronico.splice(index, 1);
  } else {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Debe haber al menos un correo electrónico.'
    });
  }
}

eliminarTelefonoU(index: number): void {
  if (this.nuevoEmpleado.Telefono.length > 1) {
    this.nuevoEmpleado.Telefono.splice(index, 1);
  } else {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Debe haber al menos un teléfono.'
    });
  }
}

trackByFn(index: number, item: any): any {
  return index; // o algún identificador único del elemento
}

onUpload(event: any) {
  for (let file of event.files) {
    this.uploadedFiles.push(file);
  }
}
onFileSelected(event: any): void {
  const file = event.files[0]; // Obtener el archivo seleccionado
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string; // Convertir a base64
      this.nuevoEmpleado.FotoEmpleado = base64; // Asignar la imagen en base64 al objeto
    };
    reader.readAsDataURL(file); // Leer el archivo como base64
  }
}


//Edición 

// Cargar datos del empleado si se está editando
obtenerEmpleadoPorClave(claveEmpleado: string) {
  this.empleadoService.getEmpleadoPorClave(claveEmpleado).subscribe({
    next: (response) => {
      if (response) {
        this.nuevoEmpleado = response;  // Asignar el empleado recibido al objeto nuevoEmpleado
      }
    },
    error: (error) => {
      console.error('Error al obtener empleado:', error);
    }
  });
}


editarEmpleado(): void {
  if (!this.validarFormulario()) {
    return;
  }

  console.log('Datos enviados para actualizar:', this.nuevoEmpleado);

  // Llamar al servicio para actualizar el empleado
  this.empleadoService.actualizarEmpleado(this.nuevoEmpleado).subscribe({
    next: (empleado) => {
      console.log('Empleado actualizado:', empleado);
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Empleado actualizado correctamente.' });
      this.router.navigate(['recursos-humanos/listaEmpleado']); // Redirigir a la lista de empleados
    },
    error: (error) => {
      console.error('Error al actualizar el empleado:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el empleado.' });
    }
  });
}



}

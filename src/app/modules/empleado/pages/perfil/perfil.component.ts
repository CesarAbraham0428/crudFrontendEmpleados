import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../../../core/services/empleado/empleado.service';
import { Empleado } from '../../../../models/empleado/empleado';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    PanelModule, CardModule, FieldsetModule, FloatLabelModule, AutoCompleteModule,
    FormsModule, InputMaskModule, DatePickerModule, TableModule, ButtonModule,
    InputTextModule, PasswordModule
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  providers: [MessageService]
})

export class PerfilComponent implements OnInit {
  empleado: Empleado = {
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
    createdAt: '',
    updatedAt: '',
    Domicilio: {
      Calle: '',
      NumeroExterior: '',
      NumeroInterior: '',
      Colonia: '',
      CodigoPostal: '',
      Ciudad: ''
    }
  };

  filteredItemsCiudad: any[] = [];

  constructor(
    private empleadoService: EmpleadoService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.obtenerInformacionPersonal();
  }

  obtenerInformacionPersonal() {
    this.empleadoService.obtenerInfoPersonal().subscribe({
      next: (data) => {
        this.empleado = data.infoPersonalEmpleado[0]; // Asigna la información del empleado
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Información personal cargada'
        });
      },
      error: (err) => {
        console.error('Error al obtener la información personal:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la información personal'
        });
      }
    });
  }
}
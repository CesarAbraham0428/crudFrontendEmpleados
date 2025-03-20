import { CommonModule } from '@angular/common';
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
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    PanelModule, CardModule, FieldsetModule, FloatLabelModule, AutoCompleteModule,
    FormsModule, InputMaskModule, DatePickerModule, TableModule, ButtonModule,
    InputTextModule, PasswordModule, ToastModule
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
        const empleadoData = data.infoPersonalEmpleado?.[0]; // Accede al primer objeto del array
        if (empleadoData) {
          this.empleado = { ...this.empleado, ...empleadoData }; // Fusiona los datos
          
          // Asegurarse de que los arrays estén inicializados
          if (!this.empleado.Telefono) this.empleado.Telefono = [];
          if (!this.empleado.CorreoElectronico) this.empleado.CorreoElectronico = [];
          if (!this.empleado.ReferenciaFamiliar) this.empleado.ReferenciaFamiliar = [];
          
          // Asegurarse de que cada referencia familiar tenga un array de teléfonos
          this.empleado.ReferenciaFamiliar.forEach(ref => {
            if (!ref.Telefono) ref.Telefono = [];
          });
          
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Información personal cargada'
          });
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Atención',
            detail: 'No se encontró información personal'
          });
        }
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
  
  // Métodos para manejar los teléfonos del empleado
  addNewPhone() {
    this.empleado.Telefono.push('');
    // Aquí podrías llamar a un servicio para guardar el nuevo teléfono
    // this.empleadoService.actualizarTelefonos(this.empleado.Telefono).subscribe();
  }
  
  removePhone(index: number) {
    if (this.empleado.Telefono.length <= 1) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Debe mantener al menos un teléfono en su perfil'
      });
      return;
    }
    if (index >= 0 && index < this.empleado.Telefono.length) {
      this.empleado.Telefono.splice(index, 1);
      // Aquí podrías llamar a un servicio para eliminar el teléfono
      // this.empleadoService.actualizarTelefonos(this.empleado.Telefono).subscribe();
    }
  }
  
  // Métodos para manejar los correos del empleado
  addNewEmail() {
    this.empleado.CorreoElectronico.push('');
    // Aquí podrías llamar a un servicio para guardar el nuevo correo
    // this.empleadoService.actualizarCorreos(this.empleado.CorreoElectronico).subscribe();
  }
  
  removeEmail(index: number) {
    if (this.empleado.CorreoElectronico.length <= 1) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Debe mantener al menos un correo electrónico en su perfil'
      });
      return;
    }
    if (index >= 0 && index < this.empleado.CorreoElectronico.length) {
      this.empleado.CorreoElectronico.splice(index, 1);
      // Aquí podrías llamar a un servicio para eliminar el correo
      // this.empleadoService.actualizarCorreos(this.empleado.CorreoElectronico).subscribe();
    }
  }
  
  // Métodos para manejar los teléfonos de las referencias familiares
  addNewFamilyPhone(refIndex: number) {
    if (refIndex >= 0 && refIndex < this.empleado.ReferenciaFamiliar.length) {
      this.empleado.ReferenciaFamiliar[refIndex].Telefono.push('');
      // Aquí podrías llamar a un servicio para guardar el nuevo teléfono
      // this.empleadoService.actualizarTelefonosFamiliares(this.empleado.ReferenciaFamiliar).subscribe();
    }
  }
  
  removeFamilyPhone(refIndex: number, phoneIndex: number) {
    if (refIndex >= 0 && refIndex < this.empleado.ReferenciaFamiliar.length) {
      const familia = this.empleado.ReferenciaFamiliar[refIndex];
      if (familia.Telefono.length <= 1) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Atención',
          detail: `La referencia familiar ${familia.NombreFamiliar} debe tener al menos un teléfono`
        });
        return;
      }
      if (phoneIndex >= 0 && phoneIndex < familia.Telefono.length) {
        familia.Telefono.splice(phoneIndex, 1);
        // Aquí podrías llamar a un servicio para eliminar el teléfono
        // this.empleadoService.actualizarTelefonosFamiliares(this.empleado.ReferenciaFamiliar).subscribe();
      }
    }
  }
}
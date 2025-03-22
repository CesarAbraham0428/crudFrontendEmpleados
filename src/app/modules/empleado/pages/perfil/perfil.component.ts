import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../../../core/services/empleado/empleado.service';
import { Empleado, ReferenciaFamiliar } from '../../../../models/empleado/empleado';
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
import { lastValueFrom } from 'rxjs';
import { InputGroupModule } from 'primeng/inputgroup';
import { ReferenciasFamiliaresComponent } from './referencias-familiares/referencias-familiares.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    PanelModule, CardModule, FieldsetModule, FloatLabelModule, AutoCompleteModule,
    FormsModule, InputMaskModule, DatePickerModule, TableModule, ButtonModule,
    InputTextModule, PasswordModule, ToastModule, InputGroupModule,
    ReferenciasFamiliaresComponent
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

  nuevaReferencia = {
    NombreFamiliar: '',
    Parentesco: '',
    Telefono: [''],
    CorreoElectronico: ''
  };

  empleadoOriginal!: Empleado; // Para guardar el estado original
  isEditMode: boolean = false;
  currentPassword: string = '';
  newPassword: string = '';

  filteredItemsCiudad: any[] = [];

  constructor(
    private empleadoService: EmpleadoService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.obtenerInformacionPersonal();
  }

  domicilioCampos = ['Calle', 'NumeroExterior', 'Colonia', 'CodigoPostal', 'Ciudad'];

  getLabel(field: string): string {
    const labels: { [key: string]: string } = {
      Calle: 'Calle',
      NumeroExterior: 'Número Exterior',
      Colonia: 'Colonia',
      CodigoPostal: 'Código Postal',
      Ciudad: 'Ciudad'
    };
    return labels[field] || field;
  }

  obtenerInformacionPersonal() {
    this.empleadoService.obtenerInfoPersonal().subscribe({
      next: (data) => {
        const empleadoData = data.infoPersonalEmpleado?.[0];
        if (empleadoData) {
          this.empleado = { ...this.empleado, ...empleadoData };
          this.empleadoOriginal = JSON.parse(JSON.stringify(this.empleado)); // Copia profunda

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

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      // Si salimos del modo edición sin guardar, restauramos los valores originales
      this.empleado = JSON.parse(JSON.stringify(this.empleadoOriginal));
    }
  }

  async saveChanges() {
    try {
      const updates: Promise<any>[] = [];
      const operaciones: any[] = [];

      // Actualizar contraseña si cambió
      if (this.currentPassword && this.newPassword) {
        updates.push(lastValueFrom(this.empleadoService.actualizarPassword({
          Password: this.currentPassword,
          NuevaPassword: this.newPassword
        })));
      }

      // Actualizar domicilio si cambió
      if (JSON.stringify(this.empleado.Domicilio) !== JSON.stringify(this.empleadoOriginal.Domicilio)) {
        updates.push(lastValueFrom(this.empleadoService.actualizarDomicilio(this.empleado.Domicilio)));
      }

      // Si los correos cambiaron, agregar la operación
      if (JSON.stringify(this.empleado.CorreoElectronico) !== JSON.stringify(this.empleadoOriginal.CorreoElectronico)) {
        const correosAEliminar = this.empleadoOriginal.CorreoElectronico.filter(correo =>
          !this.empleado.CorreoElectronico.includes(correo)
        );
        const correosAAgregar = this.empleado.CorreoElectronico.filter(correo =>
          !this.empleadoOriginal.CorreoElectronico.includes(correo)
        );

        if (correosAEliminar.length) {
          operaciones.push({ tipo: "correo", operacion: "eliminar", datos: { correos: correosAEliminar } });
        }
        if (correosAAgregar.length) {
          operaciones.push({ tipo: "correo", operacion: "agregar", datos: { correos: correosAAgregar } });
        }
      }

      // Si los teléfonos cambiaron, agregar la operación
      if (JSON.stringify(this.empleado.Telefono) !== JSON.stringify(this.empleadoOriginal.Telefono)) {
        const telefonosAEliminar = this.empleadoOriginal.Telefono.filter(tel =>
          !this.empleado.Telefono.includes(tel)
        );
        const telefonosAAgregar = this.empleado.Telefono.filter(tel =>
          !this.empleadoOriginal.Telefono.includes(tel)
        );

        if (telefonosAEliminar.length) {
          operaciones.push({ tipo: "telefono", operacion: "eliminar", datos: { telefonos: telefonosAEliminar } });
        }
        if (telefonosAAgregar.length) {
          operaciones.push({ tipo: "telefono", operacion: "agregar", datos: { telefonos: telefonosAAgregar } });
        }
      }

      // Si hay operaciones de contacto, agregarlas al array de actualizaciones
      if (operaciones.length > 0) {
        updates.push(lastValueFrom(this.empleadoService.actualizarContactos(operaciones)));
      }

      // Actualizar referencias familiares si cambió
      if (JSON.stringify(this.empleado.ReferenciaFamiliar) !== JSON.stringify(this.empleadoOriginal.ReferenciaFamiliar)) {
        updates.push(lastValueFrom(this.empleadoService.actualizarReferenciasFamiliares(this.empleado.ReferenciaFamiliar)));
      }

      // Ejecutar todas las actualizaciones
      await Promise.all(updates);

      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Perfil actualizado correctamente'
      });

      this.empleadoOriginal = JSON.parse(JSON.stringify(this.empleado));
      this.isEditMode = false;
      this.currentPassword = '';
      this.newPassword = '';

    } catch (err) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo actualizar el perfil'
      });
      console.error(err);
    }
  }
  
  addNewPhone() {
    this.empleado.Telefono.push('');
  }

  removePhone(index: number) {
    if (this.empleado.Telefono.length > 1) {
      this.empleado.Telefono.splice(index, 1);
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Debe mantener al menos un teléfono' });
    }
  }

  addNewEmail() {
    this.empleado.CorreoElectronico.push('');
  }

  removeEmail(index: number) {
    if (this.empleado.CorreoElectronico.length > 1) {
      this.empleado.CorreoElectronico.splice(index, 1);
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Debe mantener al menos un correo' });
    }
  }

  //Referencia Familiar

  onReferenciaAgregada(nuevaReferencia: ReferenciaFamiliar) {
    this.empleado.ReferenciaFamiliar.push(nuevaReferencia);
  }
  
  onReferenciaEliminada(referenciaId: string) {
    const index = this.empleado.ReferenciaFamiliar.findIndex(r => r._id === referenciaId);
    if (index > -1) {
      this.empleado.ReferenciaFamiliar.splice(index, 1);
    }
  }

}
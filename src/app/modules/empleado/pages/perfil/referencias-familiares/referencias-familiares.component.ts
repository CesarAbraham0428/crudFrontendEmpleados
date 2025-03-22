import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { EmpleadoService } from '../../../../../core/services/empleado/empleado.service';
import { ReferenciaFamiliar } from '../../../../../models/empleado/empleado';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-referencias-familiares',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PanelModule,
    FieldsetModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    InputGroupModule,
    ToastModule
  ],
  templateUrl: './referencias-familiares.component.html',
  styleUrls: ['./referencias-familiares.component.scss']
})
export class ReferenciasFamiliaresComponent implements OnChanges {
  @Input() referencias: ReferenciaFamiliar[] = [];
  @Output() referenciasActualizadas = new EventEmitter<ReferenciaFamiliar[]>();

  isEditMode: boolean = false;
  referenciasLocales: ReferenciaFamiliar[] = [];
  originalReferencias: ReferenciaFamiliar[] = [];

  constructor(
    private empleadoService: EmpleadoService,
    private messageService: MessageService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['referencias']) {
      this.originalReferencias = JSON.parse(JSON.stringify(this.referencias));
      this.referenciasLocales = JSON.parse(JSON.stringify(this.referencias));
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.referenciasLocales = JSON.parse(JSON.stringify(this.originalReferencias));
    }
  }

  async guardarCambios() {
    try {
      // 1. Agregar nuevas referencias
      const nuevasReferencias = this.referenciasLocales.filter(r => !r._id);
      for (const nueva of nuevasReferencias) {
        const { _id, ...datos } = nueva;
        const response: any = await lastValueFrom(
          this.empleadoService.agregarReferenciaFamiliar(datos)
        );
        nueva._id = response.referenciaActualizada._id; // Actualizar ID local
      }

      // 2. Eliminar referencias removidas
      const eliminadas = this.originalReferencias.filter(orig =>
        !this.referenciasLocales.some(r => r._id === orig._id)
      );
      for (const eliminar of eliminadas) {
        if (eliminar._id) {
          await lastValueFrom(
            this.empleadoService.eliminarReferenciaFamiliar(eliminar._id)
          );
        }
      }

      // 3. Actualizar referencias modificadas
      for (const referencia of this.referenciasLocales) {
        if (referencia._id) {
          const original = this.originalReferencias.find(r => r._id === referencia._id);

          // Actualizar datos principales
          if (JSON.stringify(original) !== JSON.stringify(referencia)) {
            await lastValueFrom(
              this.empleadoService.actualizarReferenciaFamiliar(
                referencia._id,
                {
                  NombreFamiliar: referencia.NombreFamiliar,
                  Parentesco: referencia.Parentesco,
                  CorreoElectronico: referencia.CorreoElectronico
                }
              )
            );
          }

          // Actualizar teléfonos si cambiaron
          if (original && JSON.stringify(original.Telefono) !== JSON.stringify(referencia.Telefono)) {
            await lastValueFrom(
              this.empleadoService.actualizarTelefonosFamiliar(
                referencia._id,
                referencia.Telefono
              )
            );
          }
        }
      }

      // Actualizar lista padre
      this.referenciasActualizadas.emit(this.referenciasLocales);
      this.isEditMode = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Cambios guardados correctamente'
      });

    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al guardar los cambios'
      });
      console.error(error);
    }
  }

  agregarReferencia() {
    this.referenciasLocales.push({
      NombreFamiliar: '',
      Parentesco: '',
      Telefono: [''],
      CorreoElectronico: '',
      _id: undefined
    });
  }

  eliminarReferencia(index: number) {
    this.referenciasLocales.splice(index, 1);
  }

  agregarTelefono(refIndex: number) {
    this.referenciasLocales[refIndex].Telefono.push('');
  }

  eliminarTelefono(refIndex: number, telIndex: number) {
    if (this.referenciasLocales[refIndex].Telefono.length > 1) {
      this.referenciasLocales[refIndex].Telefono.splice(telIndex, 1);
    }
  }
}
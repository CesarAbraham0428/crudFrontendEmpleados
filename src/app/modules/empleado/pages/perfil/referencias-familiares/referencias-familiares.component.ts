import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
export class ReferenciasFamiliaresComponent {
  @Input() referencias: ReferenciaFamiliar[] = [];
  @Input() isEditMode: boolean = false;
  @Output() referenciaAgregada = new EventEmitter<ReferenciaFamiliar>();
  @Output() referenciaEliminada = new EventEmitter<string>();

  nuevaReferencia = {
    NombreFamiliar: '',
    Parentesco: '',
    Telefono: [''],
    CorreoElectronico: ''
  };

  constructor(
    private empleadoService: EmpleadoService,
    private messageService: MessageService
  ) { }

  async agregarReferenciaFamiliar() {
    try {
      if (!this.nuevaReferencia.NombreFamiliar || !this.nuevaReferencia.Parentesco || 
          !this.nuevaReferencia.Telefono[0] || !this.nuevaReferencia.CorreoElectronico) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Atención',
          detail: 'Todos los campos son requeridos'
        });
        return;
      }

      const response = await lastValueFrom(
        this.empleadoService.agregarReferenciaFamiliar(this.nuevaReferencia)
      );
      
      this.referenciaAgregada.emit(response.referenciaActualizada);
      this.resetNuevaReferencia();

      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Referencia familiar agregada correctamente'
      });

    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo agregar la referencia familiar'
      });
      console.error(error);
    }
  }

  async eliminarReferenciaFamiliar(referenciaId: string | undefined, index: number) {
    try {
      if (!referenciaId) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se encontró ID de la referencia'
        });
        return;
      }

      await lastValueFrom(
        this.empleadoService.eliminarReferenciaFamiliar(referenciaId)
      );

      this.referenciaEliminada.emit(referenciaId);

      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Referencia familiar eliminada correctamente'
      });

    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar la referencia familiar'
      });
      console.error(error);
    }
  }

  private resetNuevaReferencia() {
    this.nuevaReferencia = {
      NombreFamiliar: '',
      Parentesco: '',
      Telefono: [''],
      CorreoElectronico: ''
    };
  }

  addNewFamilyPhone(refIndex: number) {
    if (refIndex >= 0 && refIndex < this.referencias.length) {
      this.referencias[refIndex].Telefono.push('');
    }
  }

  removeFamilyPhone(refIndex: number, phoneIndex: number) {
    if (refIndex >= 0 && refIndex < this.referencias.length) {
      const familia = this.referencias[refIndex];
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
      }
    }
  }
}
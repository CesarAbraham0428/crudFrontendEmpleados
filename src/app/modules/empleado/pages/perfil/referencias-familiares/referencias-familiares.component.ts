import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() referenciasActualizadas = new EventEmitter<ReferenciaFamiliar[]>();
  
  isEditMode: boolean = false;
  referenciasLocales: ReferenciaFamiliar[] = [];

  constructor(
    private empleadoService: EmpleadoService,
    private messageService: MessageService
  ) { }

  ngOnChanges() {
    this.referenciasLocales = JSON.parse(JSON.stringify(this.referencias));
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.referenciasLocales = JSON.parse(JSON.stringify(this.referencias));
    }
  }

  async guardarCambios() {
    try {
      const response = await lastValueFrom(
        this.empleadoService.actualizarReferenciasFamiliares(this.referenciasLocales)
      );
      
      this.referenciasActualizadas.emit(this.referenciasLocales);
      this.isEditMode = false;
      
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Referencias actualizadas correctamente'
      });
      
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al guardar referencias'
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
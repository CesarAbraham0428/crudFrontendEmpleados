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
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CargaDatosService } from '../../../../../core/services/cargaDatos/carga-datos.service';
import { Parentesco } from '../../../../../models/cargarDatos/cargarDatos';

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
    ToastModule,
    AutoCompleteModule
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
  filteredItemsParentesco: any[] = [];

  constructor(
    private empleadoService: EmpleadoService,
    private messageService: MessageService,
    private cargaDatosService:CargaDatosService
  ) {  this.cargarParentescos(); }


  private cargarParentescos() {
    this.cargaDatosService.getParentescos().subscribe(data => {
      if (data && data.parentesco) {
        this.filteredItemsParentesco = data.parentesco.map((item: Parentesco) => ({
          label: item.Parentesco,
          value: item.Parentesco
        }));
      } else {
        console.error('La respuesta del backend no tiene la estructura esperada:', data);
      }
    });
  }

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
      const updates: Promise<any>[] = [];

      for (const referencia of this.referenciasLocales) {
        if (referencia._id) {
          const original = this.originalReferencias.find(r => r._id === referencia._id);

          // Detectar cambios en datos principales
          if (original && (
            original.NombreFamiliar !== referencia.NombreFamiliar ||
            original.Parentesco !== referencia.Parentesco ||
            original.CorreoElectronico !== referencia.CorreoElectronico
          )) {
            updates.push(lastValueFrom(
              this.empleadoService.actualizarReferenciaFamiliar(
                referencia._id,
                {
                  NombreFamiliar: referencia.NombreFamiliar,
                  Parentesco: referencia.Parentesco,
                  CorreoElectronico: referencia.CorreoElectronico
                }
              )
            ));
          }

          // Detectar cambios en teléfonos
          if (original && JSON.stringify(original.Telefono) !== JSON.stringify(referencia.Telefono)) {
            const telefonosOriginales = original.Telefono;
            const telefonosActuales = referencia.Telefono;

            // Calcular diferencias
            const telefonosAAgregar = telefonosActuales.filter(t => !telefonosOriginales.includes(t));
            const telefonosAEliminar = telefonosOriginales.filter(t => !telefonosActuales.includes(t));

            // Enviar operaciones al backend
            if (telefonosAAgregar.length > 0) {
              updates.push(lastValueFrom(
                this.empleadoService.actualizarTelefonosFamiliar(
                  referencia._id,
                  'agregar',
                  telefonosAAgregar
                )
              ));
            }

            if (telefonosAEliminar.length > 0) {
              updates.push(lastValueFrom(
                this.empleadoService.actualizarTelefonosFamiliar(
                  referencia._id,
                  'eliminar',
                  telefonosAEliminar
                )
              ));
            }
          }
        }
      }

      // Ejecutar todas las actualizaciones en paralelo
      await Promise.all(updates);

      // Actualizar lista padre con copia fresca del backend
      const empleadoActualizado = await lastValueFrom(
        this.empleadoService.obtenerInfoPersonal()
      );
      const nuevasReferenciasBackend = empleadoActualizado.infoPersonalEmpleado[0].ReferenciaFamiliar;

      this.referenciasActualizadas.emit([...nuevasReferenciasBackend]);
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
    // Agregar nuevo teléfono temporal
    this.referenciasLocales[refIndex].Telefono = [
      ...this.referenciasLocales[refIndex].Telefono,
      ''
    ];
  }

  eliminarTelefono(refIndex: number, telIndex: number) {
    if (this.referenciasLocales[refIndex].Telefono.length > 1) {
      // Filtrar el teléfono a eliminar manteniendo los demás
      this.referenciasLocales[refIndex].Telefono = this.referenciasLocales[refIndex].Telefono
        .filter((_, index) => index !== telIndex);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Debe mantener al menos un teléfono'
      });
    }
  }

  filterItemsParentesco(event: any) {
    const query = event.query.toLowerCase();
    this.filteredItemsParentesco = this.filteredItemsParentesco.filter(item =>
      item.label.toLowerCase().includes(query)
    );
  }
}
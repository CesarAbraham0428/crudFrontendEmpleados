import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmpleadoService } from '../../../../../core/services/empleado/empleado.service';
import { MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { Empleado } from '../../../../../models/empleado/empleado';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-foto-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule
  ],
  templateUrl: './foto-perfil.component.html',
  styleUrls: ['./foto-perfil.component.scss'],
  providers: [MessageService]
})
export class FotoPerfilComponent {
  @Input() empleado!: Empleado;
  @Output() fotoActualizada = new EventEmitter<Partial<Empleado>>();

  archivoSeleccionado: File | null = null;
  cargando = false;
  defaultFoto = 'img/default-user.png';

  constructor(
    private empleadoService: EmpleadoService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.cargarFotoPerfil();
  }

  private cargarFotoPerfil() {
    if (!this.empleado.FotoEmpleado) {
      this.empleadoService.obtenerFotoPerfil().subscribe({
        next: (response) => {
          if (response.foto) {
            this.empleado.FotoEmpleado = response.foto;
            this.fotoActualizada.emit({ FotoEmpleado: response.foto });
          }
        },
        error: (error) => {
          console.error('Error al cargar la foto:', error);
        }
      });
    }
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    console.log('Archivo seleccionado:', file);

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      console.error('Error: El archivo seleccionado no es una imagen');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El archivo debe ser una imagen'
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      console.error('Error: La imagen supera el tamaño permitido (2MB)');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La imagen no debe superar los 2MB'
      });
      return;
    }

    try {
      this.cargando = true;
      const formData = new FormData();
      formData.append('foto', file);

      const response: any = await lastValueFrom(
        this.empleadoService.subirFotoPerfil(formData)
      );

      // Actualizar con la foto en Base64 recibida del backend
      this.empleado.FotoEmpleado = response.foto;
      this.fotoActualizada.emit({ FotoEmpleado: response.foto });

      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Foto actualizada correctamente'
      });

    } catch (error) {
      console.error('Error al subir la foto:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al subir la foto'
      });
    } finally {
      this.cargando = false;
    }
  }

  async eliminarFoto() {
    try {
      this.cargando = true;
      await lastValueFrom(this.empleadoService.eliminarFotoPerfil());

      this.empleado.FotoEmpleado = null;
      this.fotoActualizada.emit({ FotoEmpleado: null });

      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Foto eliminada correctamente'
      });
    } catch (error: any) {
      let mensaje = 'Error al eliminar la foto';
      if (error.error?.message) mensaje += `: ${error.error.message}`;

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: mensaje
      });
    } finally {
      this.cargando = false;
    }
  }
  get fotoUrl(): string {
    if (!this.empleado.FotoEmpleado) return this.defaultFoto;

    // Si ya tiene el prefijo data URL, retornar directamente
    if (this.empleado.FotoEmpleado.startsWith('data:')) {
      return this.empleado.FotoEmpleado;
    }

    return `data:image/jpeg;base64,${this.empleado.FotoEmpleado}`;
  }
}
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmpleadoService } from '../../../../../core/services/empleado/empleado.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { Empleado } from '../../../../../models/empleado/empleado';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-foto-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule,
    ConfirmDialogModule 
  ],
  templateUrl: './foto-perfil.component.html',
  styleUrls: ['./foto-perfil.component.scss'],
  providers: [MessageService, ConfirmationService]
})export class FotoPerfilComponent {
  @Input() empleado!: Empleado;
  @Output() fotoActualizada = new EventEmitter<Partial<Empleado>>();

  archivoSeleccionado: File | null = null;
  cargando = false;
  defaultFoto = 'img/usuario.png';

  constructor(
    private empleadoService: EmpleadoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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
    if (!file) return;

    // Validaciones existentes
    if (!file.type.startsWith('image/')) {
      this.mostrarError('El archivo debe ser una imagen');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.mostrarError('La imagen no debe superar los 2MB');
      return;
    }

    // Mostrar diálogo de confirmación con previsualización
    this.mostrarDialogoConfirmacion(file, event.target);
  }

  private mostrarDialogoConfirmacion(file: File, inputElement: any) {
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      this.confirmationService.confirm({
        message: `
          <div class="preview-dialog">
            <img src="${e.target.result}" alt="Previsualización" class="preview-image"/>
            <p>¿Deseas actualizar tu foto de perfil?</p>
          </div>
        `,
        header: 'Confirmar actualización',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Actualizar',
        rejectLabel: 'Cancelar',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => this.procesarSubida(file),
        reject: () => {
          this.resetInputFile(inputElement);
          this.messageService.add({
            severity: 'warn', 
            summary: 'Operación cancelada',
            detail: 'La foto no fue actualizada'
          });
        }
      });
    };
    
    reader.readAsDataURL(file);
  }

  private async procesarSubida(file: File) {
    try {
      this.cargando = true;
      const formData = new FormData();
      formData.append('foto', file);

      const response: any = await lastValueFrom(
        this.empleadoService.subirFotoPerfil(formData)
      );

      this.fotoActualizada.emit({ FotoEmpleado: response.foto });
      this.mostrarExito('Foto actualizada correctamente');
      
    } catch (error) {
      this.mostrarError('Error al subir la foto');
    } finally {
      this.cargando = false;
    }
  }

  async eliminarFoto() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar tu foto de perfil?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: async () => {
        try {
          this.cargando = true;
          await lastValueFrom(this.empleadoService.eliminarFotoPerfil());
          this.fotoActualizada.emit({ FotoEmpleado: null });
          this.mostrarExito('Foto eliminada correctamente');
          
        } catch (error) {
          this.mostrarError('Error al eliminar la foto');
        } finally {
          this.cargando = false;
        }
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Operación cancelada',
          detail: 'La foto no fue eliminada'
        });
      }
    });
  }

  private resetInputFile(inputElement: any) {
    inputElement.value = '';
    this.archivoSeleccionado = null;
  }

  private mostrarExito(detalle: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: detalle,
      life: 3000
    });
  }

  private mostrarError(detalle: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: detalle,
      life: 5000
    });
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
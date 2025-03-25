import { CursoExterno } from '../../../../models/empleado/empleado';
import { EmpleadoService } from '../../../../core/services/empleado/empleado.service';
import { FormatoFechaPipe } from '../../pipes/fecha.pipe';

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-curso-list',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    FormatoFechaPipe,
    InputTextModule,
    CalendarModule,
    FormsModule
  ],
  templateUrl: './curso-list.component.html',
  styleUrls: ['./curso-list.component.scss'],
  providers: [MessageService, ConfirmationService] // Agregar el servicio
})
export class CursoListComponent implements OnInit {
  cursos: CursoExterno[] = [];
  cursosOriginal: CursoExterno[] = [];
  filtroNombre: string = '';
  filtroRangoFechas: Date[] = [];

  constructor(
    private router: Router,
    private empleadoService: EmpleadoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService // Inyectar el servicio
  ) { }

  ngOnInit(): void {
    this.obtenerCursos();
  }

  obtenerCursos(): void {
    this.empleadoService.obtenerCursosExternos().subscribe({
      next: (data) => {
        this.cursosOriginal = data.cursosExternos.flatMap(ce => ce.CursoExterno);
        this.aplicarFiltros(); // Aplicamos filtros iniciales
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los cursos'
        });
      }
    });
  }

  aplicarFiltros(): void {
    this.cursos = this.cursosOriginal.filter(curso => {
      const nombreMatch = !this.filtroNombre ||
        curso.Nombre.toLowerCase().includes(this.filtroNombre.toLowerCase());

      const [fechaInicio, fechaFin] = this.filtroRangoFechas || [];
      const cursoInicio = new Date(curso.FechaInicio).getTime();
      const cursoFin = new Date(curso.FechaFin).getTime();

      const fechaInicioMatch = !fechaInicio || cursoInicio >= new Date(fechaInicio).setHours(0, 0, 0, 0);
      const fechaFinMatch = !fechaFin || cursoFin <= new Date(fechaFin).setHours(23, 59, 59, 999);

      return nombreMatch && fechaInicioMatch && fechaFinMatch;
    });
  }

  // Método para limpiar filtros
  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroRangoFechas = [];
    this.aplicarFiltros();
  }

  redirigir() {
    this.router.navigate(['empleado/cursos-externos']);
  }

  editarCurso(curso: CursoExterno) {
    this.router.navigate(['empleado/cursos-externos'], { state: { curso } });
  }

  confirmarEliminar(cursoId: string) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.',
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'No',
      accept: () => {
        this.eliminarCurso(cursoId);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'Eliminación cancelada'
        });
      }
    });
  }

  eliminarCurso(cursoId: string) {
    this.empleadoService.eliminarCursoExterno(cursoId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Curso eliminado correctamente'
        });
        this.obtenerCursos(); // Refrescar la lista
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el curso: ' + (error.error?.details || error.message)
        });
      }
    });
  }
}
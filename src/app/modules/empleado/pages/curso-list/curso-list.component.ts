import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EmpleadoService } from '../../../../core/services/empleado/empleado.service';
import { CursoExterno } from '../../../../models/empleado/empleado';
import { FormatoFechaPipe } from '../../pipes/fecha.pipe';

@Component({
  selector: 'app-curso-list',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    ToastModule,
    FormatoFechaPipe
  ],
  templateUrl: './curso-list.component.html',
  styleUrls: ['./curso-list.component.scss'],
  providers: [MessageService]
})
export class CursoListComponent implements OnInit {
  cursos: CursoExterno[] = [];

  constructor(
    private router: Router,
    private empleadoService: EmpleadoService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.obtenerCursos();
  }

  obtenerCursos(): void {
    this.empleadoService.obtenerCursosExternos().subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        this.cursos = data.cursosExternos.flatMap(ce => ce.CursoExterno);
        console.log('Cursos procesados:', this.cursos);
      },
      error: (error) => {
        console.error('Error al obtener los cursos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los cursos'
        });
      }
    });
  }

  redirigir() {
    this.router.navigate(['empleado/cursos-externos']);
  }

  editarCurso(curso: CursoExterno) {
    this.router.navigate(['empleado/cursos-externos'], { state: { curso } });
  }

  eliminarCurso(cursoId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
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
}
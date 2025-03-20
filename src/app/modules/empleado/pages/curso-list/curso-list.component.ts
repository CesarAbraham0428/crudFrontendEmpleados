import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule completo
import { Router } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { EmpleadoService } from '../../../../core/services/empleado/empleado.service';
import { CursoExterno } from '../../../../models/empleado/empleado';
import { FormatoFechaPipe } from '../../pipes/fecha.pipe';

@Component({
  selector: 'app-curso-list',
  standalone: true,
  imports: [
    CommonModule, // Asegúrate de que CommonModule esté aquí
    PanelModule, 
    FloatLabelModule, 
    FieldsetModule, 
    CardModule, 
    TableModule, 
    ButtonModule, 
    FormatoFechaPipe
  ],
  templateUrl: './curso-list.component.html',
  styleUrl: './curso-list.component.scss'
})
export class CursoListComponent implements OnInit {
  cursos: CursoExterno[] = [];

  constructor(private router: Router, private empleadoService: EmpleadoService) { }

  ngOnInit(): void {
    this.obtenerCursos();
  }

  obtenerCursos(): void {
    this.empleadoService.obtenerCursosExternos().subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        // Extraemos los cursos de la estructura anidada
        this.cursos = data.cursosExternos.flatMap(ce => ce.CursoExterno);
        console.log('Cursos procesados:', this.cursos);
      },
      error: (error) => {
        console.error('Error al obtener los cursos:', error);
      }
    });
  }

  redirigir() {
    this.router.navigate(['empleado/cursos-externos']);
  }
}
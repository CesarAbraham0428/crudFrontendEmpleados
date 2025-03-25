import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActividadEmpresa } from '../../../../models/empleado/empleado'; // Asegúrate de importar la interfaz correcta
import { EmpleadoService } from '../../../../core/services/empleado/empleado.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';


@Component({
  selector: 'app-ver-actividades',
  standalone: true,
  imports: [
    PanelModule,
    CardModule,
    FieldsetModule,
    FloatLabelModule,
    TableModule,
    ButtonModule,
    MessageModule,
    CommonModule,
    InputTextModule,
    FormsModule,
    DropdownModule
  ],
  templateUrl: './ver-actividades.component.html',
  styleUrl: './ver-actividades.component.scss'
})

export class VerActividadesComponent implements OnInit {
  products: ActividadEmpresa[] = [];
  productsOriginal: ActividadEmpresa[] = []; // Copia original de los datos
  filtroNombre: string = '';
  filtroEstatus: string = '';

  opcionesEstatus = [
    { label: 'Todas', value: '' },
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'Completada', value: 'completada' }
  ];

  constructor(private router: Router, private empleadoService: EmpleadoService) { }

  ngOnInit() {
    this.obtenerActividades();
  }

  obtenerActividades() {
    this.empleadoService.obtenerActividadesEmpresa().subscribe({
      next: (res) => {
        if (res.actividadesEmpresa.length > 0) {
          this.productsOriginal = res.actividadesEmpresa[0].ActividadEmpresa;
          this.aplicarFiltros(); // Aplicar filtros iniciales
        }
      },
      error: (err) => {
        console.error("Error al obtener actividades:", err);
      }
    });
  }

  aplicarFiltros(): void {
    this.products = this.productsOriginal.filter(actividad => {
      const nombreMatch = !this.filtroNombre ||
        actividad.NombreActividad.toLowerCase().includes(this.filtroNombre.toLowerCase());

      const estatusMatch = !this.filtroEstatus ||
        (this.filtroEstatus === 'pendiente' && actividad.Estatus === 0) ||
        (this.filtroEstatus === 'completada' && actividad.Estatus !== 0);

      return nombreMatch && estatusMatch;
    });
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroEstatus = '';
    this.aplicarFiltros();
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActividadEmpresa } from '../../../../models/empleado/empleado'; // Asegúrate de importar la interfaz correcta
import { EmpleadoService } from '../../../../core/services/empleado/empleado.service';

import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ver-actividades',
  standalone: true,
  imports: [PanelModule, CardModule, FieldsetModule, FloatLabelModule, TableModule, ButtonModule],
  templateUrl: './ver-actividades.component.html',
  styleUrl: './ver-actividades.component.scss'
})

export class VerActividadesComponent implements OnInit {
  products: ActividadEmpresa[] = [];

  constructor(private router: Router, private empleadoService: EmpleadoService) {}

  ngOnInit() {
    this.obtenerActividades();
  }

  obtenerActividades() {
    this.empleadoService.obtenerActividadesEmpresa().subscribe({
      next: (res) => {
        // Extrae correctamente las actividades del array devuelto por la API
        if (res.actividadesEmpresa.length > 0) {
          this.products = res.actividadesEmpresa[0].ActividadEmpresa;
        }
      },
      error: (err) => {
        console.error("Error al obtener actividades:", err);
      }
    });
  }
}

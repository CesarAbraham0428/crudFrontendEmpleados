import { Component } from '@angular/core';


import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import {ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-ver-actividades',
  standalone: true,
  imports: [PanelModule,CardModule,FieldsetModule,FloatLabelModule,TableModule,ButtonModule],
  templateUrl: './ver-actividades.component.html',
  styleUrl: './ver-actividades.component.scss'
})
export class VerActividadesComponent {
  constructor(private router: Router) {}
  
  products: any[] = [
    { NombreActividad: 'C001', Estatus: 0},
    { NombreActividad: 'C001', Estatus: 0},
    { NombreActividad: 'C001', Estatus: 1},
    { NombreActividad: 'C001', Estatus: 0},
    { NombreActividad: 'C001', Estatus: 1},
]; 

}





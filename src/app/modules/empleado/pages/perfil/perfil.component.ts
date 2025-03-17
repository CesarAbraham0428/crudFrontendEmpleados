import { Component ,OnInit} from '@angular/core';
import { CargaDatosService } from '../../../../core/services/cargaDatos/carga-datos.service';
import { Ciudad } from '../../../../models/cargarDatos/cargarDatos';

import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TableModule } from 'primeng/table';
import {ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [PanelModule,CardModule,FieldsetModule,FloatLabelModule,AutoCompleteModule,FormsModule,InputMaskModule,DatePickerModule,TableModule,ButtonModule,InputTextModule,PasswordModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
   constructor(private cargaDatosService: CargaDatosService) {}
  

  filteredItemsCiudad: any[] = [];


  ngOnInit() {

    this.cargaDatosService.getCiudades().subscribe(data => {
      if (data && data.ciudades) {
        this.filteredItemsCiudad = data.ciudades.map((item:Ciudad) => ({
          label: item.nombreCiudad,
          value: item.nombreCiudad
        }));
      } else {
        console.error('La respuesta del backend no tiene la estructura esperada:', data);
      }
    });

  }
  

  filterItemsCiudad(event: any) {
    const query = event.query.toLowerCase();
    this.filteredItemsCiudad = this.filteredItemsCiudad.filter(item =>
      item.label.toLowerCase().includes(query)
    );
  }
  


}

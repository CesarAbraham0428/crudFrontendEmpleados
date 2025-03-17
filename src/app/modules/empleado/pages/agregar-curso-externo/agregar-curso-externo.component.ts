import { Component } from '@angular/core';


import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import {ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { KeyFilterModule } from 'primeng/keyfilter';
import { DividerModule } from 'primeng/divider';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-agregar-curso-externo',
  standalone: true,
  imports: [CardModule,FieldsetModule,FloatLabelModule,ButtonModule,PanelModule,InputTextModule,DatePickerModule,AutoCompleteModule],
  templateUrl: './agregar-curso-externo.component.html',
  styleUrl: './agregar-curso-externo.component.scss'
})
export class AgregarCursoExternoComponent { 
  constructor(private router: Router) {}
 
  filteredItemsTipoDocumento: any[] = []; // Lista filtrada
 
  allItems = [
    { label: "Certificado", value: "Certificado" },
    { label: "Diploma", value: "Diploma" }
  ];





  filterItemsTipoDocumento(event: any) {
    const query = event.query.toLowerCase();
    this.filteredItemsTipoDocumento = this.allItems.filter(allItems =>
    allItems.label.toLowerCase().includes(query)
    );
  }

  
  redirigirC() {
    this.router.navigate(['empleado/cursos-externos-list']);
  }
}

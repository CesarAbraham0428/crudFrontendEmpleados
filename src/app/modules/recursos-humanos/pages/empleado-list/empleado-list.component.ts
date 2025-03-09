import { Component, OnInit,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
//Importaciones de PrimeNG
import { KeyFilterModule } from 'primeng/keyfilter';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-empleado-list',
  standalone: true,
  imports: [KeyFilterModule,InputTextModule,PanelModule,CardModule,FieldsetModule,IconFieldModule,InputIconModule,FloatLabelModule,FormsModule,TableModule,ButtonModule,DropdownModule,MultiSelectModule,SliderModule,ProgressBarModule,CommonModule,TagModule],
  templateUrl: './empleado-list.component.html',
  styleUrl: './empleado-list.component.scss'
})
export class EmpleadoListComponent implements OnInit {
  @ViewChild('dt1') dt1!: Table; 
  selectedAgent: any[] = [];
selectedStatus: string = '';
  customers: any[] = []; // Debes asignarle datos reales en ngOnInit
  loading: boolean = false;
  
  filterGlobalValue(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.dt1.filterGlobal(inputValue, 'contains'); 
  }


  representatives: any[] = []; 
  statuses: any[] = [


    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'Suspended', value: 'Suspended' }
  ];
  activityValues: number[] = [0, 100];

  constructor(private router: Router) {}

  

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    // Simula la carga de datos, en producción reemplázalo con un servicio HTTP
    this.loading = true;
    setTimeout(() => {
      this.customers = [
        {
          id: 1,
          name: 'John Doe',
          country: { name: 'USA', code: 'us' },
          representative: { name: 'Alice', image: 'avatar1.png' },
          date: new Date(),
          balance: 1000,
          status: 'Active',
          activity: 75,
          verified: true
        }, 
        {
          id: 2,
          name: 'Cati',
          country: { name: 'USA', code: 'us' },
          representative: { name: 'Alice', image: 'avatar1.png' },
          date: new Date(),
          balance: 1000,
          status: 'Active',
          activity: 75,
          verified: true
        },
        {
          id: 3,
          name: 'Pedro',
          country: { name: 'USA', code: 'us' },
          representative: { name: 'Alice', image: 'avatar1.png' },
          date: new Date(),
          balance: 1000,
          status: 'Active',
          activity: 75,
          verified: true
        },
        {
          id: 1,
          name: 'Juan',
          country: { name: 'USA', code: 'us' },
          representative: { name: 'Alice', image: 'avatar1.png' },
          date: new Date(),
          balance: 1000,
          status: 'Active',
          activity: 75,
          verified: true
        }
      ];
      this.loading = false;
    }, 1000);
  }
  

  getSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    switch(status) {
      case "Active":
        return "success";
      case "Inactive":
        return "danger";
      // Otros casos aquí
      default:
        return undefined; // O puedes asignar un valor por defecto
    }
  }
  
  clear(dt: any) {
    dt.clear();
  }
     //command: () => this.navigateTo('/recursos-humanos/cursos')

     redirigir() {
      this.router.navigate(['recursos-humanos/alta-empleado']);
}


}

import { NgModule,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecursosHumanosRoutingModule } from './recursos-humanos-routing.module';





@NgModule({
  declarations: [
  
  ],
  imports: [
    CommonModule,
    RecursosHumanosRoutingModule,
  ]
})
export class RecursosHumanosModule implements OnInit {
  customers: any[] = []; // Asegúrate de llenarlo con datos reales
  loading: boolean = false;
  dt2: any; // Para referencia de la tabla
  representatives: any[] = [
    { name: 'John Doe', image: 'avatar1.png' },
    { name: 'Jane Smith', image: 'avatar2.png' }
  ];
  statuses: any[] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ];
  activityValues: number[] = [0, 100];

  constructor() {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    // Simulación de carga de datos
    setTimeout(() => {
      this.customers = [
        {
          name: 'Cliente 1',
          country: { name: 'USA', code: 'us' },
          representative: { name: 'John Doe', image: 'avatar1.png' },
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

  clear(table: any) {
    table.clear();
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'danger';
      default:
        return 'warning';
    }
  }
  }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpleadoRoutingModule } from './empleado-routing.module';

import { ConfirmDialogModule } from 'primeng/confirmdialog';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EmpleadoRoutingModule,
    ConfirmDialogModule
  ],
  exports:[
    EmpleadoRoutingModule
  ]
})
export class EmpleadoModule { }

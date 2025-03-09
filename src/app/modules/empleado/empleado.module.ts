import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpleadoRoutingModule } from './empleado-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EmpleadoRoutingModule
  ],
  exports:[
    EmpleadoRoutingModule
  ]
})
export class EmpleadoModule { }

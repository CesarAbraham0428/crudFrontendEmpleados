import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuLateralComponent } from './menu-lateral/menu-lateral.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,RouterModule,MenuLateralComponent
  ],
  exports: [
  ]
})
export class SharedModule { }

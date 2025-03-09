import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MenuLateralComponent } from './shared/menu-lateral/menu-lateral.component';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { RecursosHumanosModule } from './modules/recursos-humanos/recursos-humanos.module';




@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
   MenuLateralComponent,
   BadgeModule, 
   AvatarModule,
   RecursosHumanosModule,
  ], 
  providers: [],
  bootstrap: []
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MenuLateralComponent } from './shared/menu-lateral/menu-lateral.component';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { RecursosHumanosModule } from './modules/recursos-humanos/recursos-humanos.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';




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
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: []
})
export class AppModule {}

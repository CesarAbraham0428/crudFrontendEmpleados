import { Component } from '@angular/core';
import { RouterOutlet, RouterModule} from '@angular/router';
import { MenuLateralComponent } from './shared/menu-lateral/menu-lateral.component';
import { routes } from './app.routes';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuLateralComponent,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'RegistroEmpleados_db_frontend';

}

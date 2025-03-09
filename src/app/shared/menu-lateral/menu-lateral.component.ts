import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { LoginService } from '../../core/services/login.service';
@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [CommonModule,AvatarModule,MenuModule,BadgeModule],
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.scss',
})
export class MenuLateralComponent {
  colapsado: boolean = true;
  role: string = '';
  


  constructor(private router: Router,private login: LoginService) {
 this.role = this.login.getRole();
 this.filterMenuItems();
  }

   
  toggleMenu() {
    this.colapsado = !this.colapsado;
  }
  filterMenuItems() {
    // Filtra los elementos según el rol
    if (this.role === 'empleado') {
      this.items = this.items.filter(item => item.label !== 'Usuarios');
     
    } else {
       //this.items = this.items.filter(item => item.label !== '' && item.label !== 'Actividades');
    }
  }

  
  items = [
    { label: 'Usuarios', icon: 'pi pi-users',  command: () => this.navigateTo('/recursos-humanos/listaEmpleado'),
       visible: this.role === 'recursos-humanos'
    }, 
   
    {
      label: 'Cursos',
      icon: 'pi pi-fw pi-home',
      //command: () => this.navigateTo('/recursos-humanos/cursos')
      command: () => this.navigateTo(this.role === 'recursos-humanos' ? '/recursos-humanos/cursos-internos' : '/empleado/cursos-externos')

    },
    { label: 'Actividades', icon: 'pi pi-users',  
      //command: () => this.navigateTo('/recursos-humanos/actividades') 
      command: () => this.navigateTo(this.role === 'recursos-humanos' ? '/recursos-humanos/actividades' : '/empleado/ver-actividades')

      
    },
      {
      label: 'Mi perfil',
      icon: 'pi pi-fw pi-home',
      command: () => this.navigateTo('/recursos-humanos/actividades')
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-fw pi-info',
      command: () => this.navigateTo('/recursos-humanos/actividades')
    }
  
  ];

  navigateTo(url: string) {
    this.router.navigate([url]); //Redirigir a la ruta
  }

}

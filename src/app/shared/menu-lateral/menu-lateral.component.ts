import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { NavigationEnd, Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [CommonModule, AvatarModule, MenuModule, BadgeModule],
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss'],
})
export class MenuLateralComponent implements OnInit {
  colapsado: boolean = true;
  items: MenuItem[] = [];
  isVisible: boolean = true; // Nueva propiedad

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.loadMenuItems();
    this.checkVisibility();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkVisibility();
      }
    });
  }

  checkVisibility() {
    const currentUrl = this.router.url;
    this.isVisible = this.authService.isLoggedIn() && currentUrl !== '/login';
  }

  loadMenuItems() {
    const role = this.authService.getRole();
    this.items = [
      { 
        label: 'Usuarios', 
        icon: 'pi pi-users', 
        command: () => this.navigateTo('/recursos-humanos/listaEmpleado'),
        visible: role === 'recursos-humanos'
      },
      { 
        label: 'Cursos', 
        icon: 'pi pi-book', 
        command: () => this.navigateTo(role === 'recursos-humanos' ? '/recursos-humanos/cursos-internos' : '/empleado/cursos-externos-list'),
        visible: true
      },
      { 
        label: 'Actividades', 
        icon: 'pi pi-calendar', 
        command: () => this.navigateTo(role === 'recursos-humanos' ? '/recursos-humanos/actividades' : '/empleado/ver-actividades'),
        visible: true
      },
      { 
        label: 'Mi perfil', 
        icon: 'pi pi-user', 
        command: () => this.navigateTo('/empleado/perfil'),
        visible: role === 'empleado'
      },
      { 
        label: 'Cerrar sesión', 
        icon: 'pi pi-sign-out', 
        command: () => this.logout(),
        visible: true
      }
    ];
  }

  toggleMenu() {
    this.colapsado = !this.colapsado;
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }

  logout() {
    this.authService.logout().subscribe({
      next: (response) => {
        console.log('Logout exitoso:', response);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
      }
    });
  }
}
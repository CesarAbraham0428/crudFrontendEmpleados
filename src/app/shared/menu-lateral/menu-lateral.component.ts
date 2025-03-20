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
  isVisible: boolean = true;

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
        visible: role === 'rh'
      },
      { 
        label: 'Cursos', 
        icon: 'pi pi-book', 
        command: () => this.navigateTo(role === 'rh' ? '/recursos-humanos/cursos-internos' : '/empleado/cursos-externos-list'),
        visible: true
      },
      { 
        label: 'Gestión de Actividades', 
        icon: 'pi pi-calendar', 
        command: () => this.navigateTo('/recursos-humanos/actividades'),
        visible: role === 'rh'
      },
      { 
        label: 'Mis Actividades', 
        icon: 'pi pi-calendar', 
        command: () => this.navigateTo('/empleado/ver-actividades'),
        visible: role === 'empleado' || role === 'rh'
      },
      { 
        label: 'Mi perfil', 
        icon: 'pi pi-user', 
        command: () => this.navigateTo('/empleado/perfil'),
        visible: role === 'empleado'|| role === 'rh'
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
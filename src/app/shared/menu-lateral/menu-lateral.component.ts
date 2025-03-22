import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { NavigationEnd, Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { MenuItem } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [CommonModule, AvatarModule, MenuModule, BadgeModule, RippleModule],
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss'],
})
export class MenuLateralComponent implements OnInit, OnDestroy {
  colapsado: boolean = true;
  items: MenuItem[] = [];
  visibleItems: MenuItem[] = [];
  isVisible: boolean = true;
  userRole: string = '';
  logoutItem: MenuItem = { label: '', icon: '', command: () => {} };
  private routerSubscription: Subscription | undefined;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.userRole = this.authService.getRole() || 'invitado';
    this.loadMenuItems();
    this.updateVisibleItems();
    this.checkVisibility();
    
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkVisibility();
        this.userRole = this.authService.getRole() || 'invitado';
        this.loadMenuItems();
        this.updateVisibleItems();
      });
  }
  
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
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
        icon: 'pi pi-calendar-plus', 
        command: () => this.navigateTo('/empleado/ver-actividades'),
        visible: role === 'empleado' || role === 'rh'
      },
      { 
        label: 'Mi perfil', 
        icon: 'pi pi-user', 
        command: () => this.navigateTo('/empleado/perfil'),
        visible: role === 'empleado' || role === 'rh'
      }
    ];
    
    // Definir el botón de "Cerrar sesión" aparte
    this.logoutItem = { 
        label: 'Cerrar sesión', 
        icon: 'pi pi-sign-out', 
        command: () => this.logout(),
        visible: true
    };

    this.updateVisibleItems();
  }

  updateVisibleItems() {
    this.visibleItems = this.items.filter(item => item.visible === true);
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
        this.router.navigate(['/login']);
      }
    });
  }
}

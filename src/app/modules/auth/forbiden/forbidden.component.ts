import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="flex justify-content-center align-items-center h-screen">
      <div class="card p-4 text-center">
        <h2>Acceso Denegado</h2>
        <p>No tienes permiso para acceder a esta página.</p>
        <button pButton label="Volver al Inicio" (click)="goToLogin()"></button>
      </div>
    </div>
  `,
})
export class ForbiddenComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
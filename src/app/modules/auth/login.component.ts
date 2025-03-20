import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card'; // Nuevo: para la tarjeta

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    ToastModule,
    CardModule, // Añadido
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'], // Añadimos archivo de estilos
})
export class LoginComponent {
  credentials = { CorreoElectronico: '', Password: '' };
  errorMessage = '';
  isLoading = false; // Nuevo: para mostrar carga en el botón

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  login() {
    this.errorMessage = '';
    this.isLoading = true; // Activamos el estado de carga
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Respuesta del login:', response);
        const role = this.authService.getRole()?.toLowerCase();
        console.log('Rol después del login:', role);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Inicio de sesión exitoso' });
        setTimeout(() => {
          if (role === 'rh') {
            this.router.navigate(['/empleado/perfil']);
          } else if (role === 'empleado') {
            this.router.navigate(['/empleado/perfil']);
          } else {
            console.error('Rol desconocido:', role);
            this.errorMessage = 'Rol no reconocido. Contacta al administrador.';
          }
          this.isLoading = false; // Desactivamos carga
        }, 1000);
      },
      error: (err) => {
        this.errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
        console.error('Error en login:', err);
        this.isLoading = false; // Desactivamos carga en caso de error
      },
    });
  }
}
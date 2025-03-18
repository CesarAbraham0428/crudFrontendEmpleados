import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Empleado } from '../../../models/empleado/empleado';
import { isPlatformBrowser } from '@angular/common';

interface LoginResponse {
  message: string;
  usuario: { _id: string; rol: string };
}

interface User {
  id: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.baseUrl}/auth`;
  private userSubject = new BehaviorSubject<User | null>(null); 
  public user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Inyectamos PLATFORM_ID para detectar el entorno
  ) {
    // Solo cargamos desde localStorage si estamos en el navegador y hay datos previos
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.userSubject.next(JSON.parse(storedUser));
      }
    }
  }

  registrarEmpleados(): Observable<Empleado[]> {
    return this.http.get<{ empleados: Empleado[] }>(`${this.apiUrl}/obtenerEmpleados`).pipe(
      map(response => response.empleados), // Extrae el array "empleados" del objeto
      tap(data => console.log('Empleados recibidos:', data))  // Agrega este log
    );
  }

  login(credentials: { CorreoElectronico: string; Password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        const user = { id: response.usuario._id, role: response.usuario.rol.toLowerCase() }; // Usamos "rol" y normalizamos
        console.log('Usuario construido:', user); // Depuración
        this.userSubject.next(user);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('user', JSON.stringify(user));
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.get(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.userSubject.next(null);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('user');
        }
      })
    );
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  getRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  hasRole(role: string): boolean {
    const userRole = this.getRole();
    return userRole === role;
  }
}
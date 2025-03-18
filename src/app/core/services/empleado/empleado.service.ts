import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../../environments/environment';

import { EmpleadoActividad } from '../../../models/empleado-actividad/empleado-actividad.model';
import { Empleado } from '../../../models/empleado/empleado';
import { ActividadEmpresa } from '../../../models/empleado/empleado';
import { CursoExterno } from '../../../models/empleado/empleado';

import { tap, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {


  private apiUrl = `${environment.baseUrl}/empleado`;

  private baseUrl = `${environment.baseUrl}/auth`;

  constructor(private http:HttpClient) { }

  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<{ empleados: Empleado[] }>(`${this.apiUrl}/obtenerEmpleados`).pipe(
      map(response => response.empleados), // Extrae el array "empleados" del objeto
      tap(data => console.log('Empleados recibidos:', data))  // Agrega este log
    );
  }

  registrarEmpleado(empleado: Empleado): Observable<any> {
    return this.http.post(`${this.baseUrl}/registrar`, empleado);
  }

  private empleadosActividades: EmpleadoActividad[] = [
    { id: 1, actividad: 'Seguridad', claveEmpleado: 'E001', nombreEmpleado: 'Juan Pérez', participacion: true },
    { id: 2, actividad: 'Capacitación', claveEmpleado: 'E002', nombreEmpleado: 'María Gómez', participacion: false },
    { id: 3, actividad: 'Mantenimiento', claveEmpleado: 'E003', nombreEmpleado: 'Carlos López', participacion: true },
    { id: 4, actividad: 'Administración', claveEmpleado: 'E004', nombreEmpleado: 'Ana Ramírez', participacion: false },
  ];

  // Obtener lista de empleados con actividades
  obtenerEmpleadoActividad(): Observable<EmpleadoActividad[]> {
    return of([...this.empleadosActividades]); // Retorna una copia del array
  }

  // Actualizar el estado de participación
  actualizarParticipacion(id: number, participacion: boolean): Observable<boolean> {
    const empleado = this.empleadosActividades.find(emp => emp.id === id);
    if (empleado) {
      empleado.participacion = participacion;
      return of(true); // Simulamos una respuesta exitosa
    }
    return of(false);
  }

  //Abraham

  obtenerInfoPersonal(): Observable<{ infoPersonalEmpleado: Empleado[] }> {
    return this.http.get<{ infoPersonalEmpleado: Empleado[] }>(
      `${this.apiUrl}/obtenerInfoPersonal`,
      { withCredentials: true } // Asegura el envío de cookies para autenticación
    );
  }

  obtenerCursosExternos(): Observable<{ cursosExternos: { CursoExterno: CursoExterno[] }[] }> {
    return this.http.get<{ cursosExternos: { CursoExterno: CursoExterno[] }[] }>(
      `${this.apiUrl}/obtenerCursoExterno`,
      { withCredentials: true }
    );
  }
  

  obtenerActividadesEmpresa(): Observable<{ actividadesEmpresa: { ActividadEmpresa: ActividadEmpresa[] }[] }> {
    return this.http.get<{ actividadesEmpresa: { ActividadEmpresa: ActividadEmpresa[] }[] }>(
      `${this.apiUrl}/obtenerActividadesEmpleado`,
      { withCredentials: true }
    );
  }
  
  
}
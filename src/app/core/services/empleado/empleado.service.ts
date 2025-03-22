import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  constructor(private http: HttpClient) { }

  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<{ empleados: Empleado[] }>(`${this.apiUrl}/obtenerEmpleados`).pipe(
      map(response => response.empleados), // Extrae el array "empleados" del objeto
      tap(data => console.log('Empleados recibidos:', data))  // Agrega este log
    );
  }

  registrarEmpleado(empleado: Empleado): Observable<any> {
    return this.http.post(`${this.baseUrl}/registrar`, empleado);
  }


  obtenerEmpleadosFiltrados(NombreActividad: string, NombreDepartamento: string): Observable<EmpleadoActividad[]> {
    const url = `${this.apiUrl}/obtenerActividades?NombreActividad=${NombreActividad}&NombreDepartamento=${NombreDepartamento}`;
    return this.http.get<EmpleadoActividad[]>(url);
  }

  actualizarParticipacion(ClaveEmpleado: string, NombreActividad: string, participacion: number): Observable<any> {
    const body = {
      ClaveEmpleado,
      NombreActividad,
      participacion,
    };

    return this.http.put(`${this.apiUrl}/actualizarParticipacion`, body); // Hacemos una solicitud PUT al backend
  }


  getEmpleadoPorClave(ClaveEmpleado: string): Observable<Empleado> {
    return this.http.get<{empleado: Empleado}>(`${this.apiUrl}/obtenerClave/${ClaveEmpleado}`).pipe(
      map(response => response.empleado), // Extrae el empleado del objeto de respuesta
      tap(data => console.log('Empleado recibido:', data))  // Agrega este log para depurar
    );
  }


  actualizarEmpleado(empleado: Empleado): Observable<Empleado> {
    return this.http.patch<Empleado>(`${this.apiUrl}/actualizarEmpleadoT/${empleado.ClaveEmpleado}`, empleado);
  }

  eliminarEmpleado(ClaveEmpleado: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminarEmpleado/${ClaveEmpleado}`);
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
  
  // Informacion personal
  actualizarPassword(passwordData: { Password: string, NuevaPassword: string }): Observable<any> {
    return this.http.patch(`${this.baseUrl}/actualizarPassword`, passwordData, { withCredentials: true });
  }

  actualizarDomicilio(domicilio: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/actualizarEmpleado`, { Domicilio: domicilio }, { withCredentials: true });
  }

  actualizarContactos(operaciones: any[]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/actualizarContactos`, { operaciones }, { withCredentials: true });
  }

  //Referencia Familiar
  
  actualizarReferenciasFamiliares(referencias: any[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizarTelefonosFamiliar/:referenciaId`, { Referencias: referencias }, { withCredentials: true });
  }

  agregarReferenciaFamiliar(referenciaData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregarReferenciaFamiliar`, referenciaData, { 
      withCredentials: true 
    });
  }

  eliminarReferenciaFamiliar(referenciaId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminarReferenciaFamiliar/${referenciaId}`, { 
      withCredentials: true 
    });
  }

  //Cursos Externos

  // empleado.service.ts
  agregarCursoExterno(cursoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregarCursoExterno`, cursoData, { withCredentials: true });
  }

  actualizarCursoExterno(cursoExternoId: string, cursoData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/actualizarCursoExterno/${cursoExternoId}`, cursoData, { withCredentials: true });
  }

  // Nuevo método para eliminar
  eliminarCursoExterno(cursoExternoId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminarCursoExterno/${cursoExternoId}`, { withCredentials: true });
  }

}
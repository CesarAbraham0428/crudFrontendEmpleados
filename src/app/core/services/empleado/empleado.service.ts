import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EmpleadoActividad } from '../../../models/empleado-actividad/empleado-actividad.model';
import {environment} from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Empleado } from '../../../models/empleado/empleado';
import { tap, map} from 'rxjs/operators';


 
@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {


  private apiUrl = `${environment.baseUrl}/empleado`;

  private baseUrl = `${environment.baseUrl}/auth`;

  constructor(private http:HttpClient) { }



  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<{empleados: Empleado[] }>(`${this.apiUrl}/obtenerEmpleados`).pipe(
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
      ClaveEmpleado,        // 'ClaveEmpleado' en vez de '_id' en el backend
      NombreActividad,
      participacion,     // 0 para no participar, 1 para participar
    };

    return this.http.put(`${this.apiUrl}/actualizarParticipacion`, body); // Hacemos una solicitud PUT al backend
  }
  
}
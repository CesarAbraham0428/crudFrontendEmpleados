import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EmpleadoActividad } from '../../../models/empleado-actividad/empleado-actividad.model';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  constructor() { }

  private empleados = [
    { id: 1, clave: 'E001', nombre: 'Juan Pérez'},
    { id: 2, clave: 'E002', nombre: 'María Gómez' },
    { id: 3, clave: 'E003', nombre: 'Carlos López'},
    { id: 4, clave: 'E004', nombre: 'Ana Ramírez'}
  ];

  getEmpleados(): Observable<any[]> {
    return of(this.empleados); // Devuelve los empleados como un Observable
  }


  private empleadosActividades: EmpleadoActividad[] = [
    { id: 1, actividad: 'Actividad 1', claveEmpleado: 'E001', nombreEmpleado: 'Juan Pérez', participacion: true },
    { id: 2, actividad: 'Actividad 2', claveEmpleado: 'E002', nombreEmpleado: 'María Gómez', participacion: false },
    { id: 3, actividad: 'Actividad 1', claveEmpleado: 'E003', nombreEmpleado: 'Carlos López', participacion: true },
    { id: 4, actividad: 'Actividad 3', claveEmpleado: 'E004', nombreEmpleado: 'Ana Ramírez', participacion: false },
  ];

  // Obtener lista de empleados con actividades y participación
  obtenerEmpleadoActividad(): Observable<EmpleadoActividad[]> {
    return of(this.empleadosActividades); // Simulamos la respuesta del servidor
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
}

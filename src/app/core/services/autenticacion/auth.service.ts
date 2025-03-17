import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Empleado } from '../../../models/empleado/empleado';
import { Observable } from 'rxjs';
import { tap, map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.baseUrl}/auth`;

  constructor(private http:HttpClient) { }

  registrarEmpleados(): Observable<Empleado[]> {
    return this.http.get<{ empleados: Empleado[] }>(`${this.apiUrl}/obtenerEmpleados`).pipe(
      map(response => response.empleados), // Extrae el array "empleados" del objeto
      tap(data => console.log('Empleados recibidos:', data))  // Agrega este log
    );
  }


}
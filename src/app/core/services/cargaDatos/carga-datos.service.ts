import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CargaDatosService {

   private apiUrl = `${environment.baseUrl}/datos`;

  constructor(private http: HttpClient) {}

  getDepartamentos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/departamentos`);
  }
  
  getCiudades(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ciudades`);
  }
  
  getParentescos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/parentescos`);
  }
  
  getPuestos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/puestos`);
  }

  getActividades(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/actividades`);
  }
  
  getTipoDocumento(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/documentos`);
  }

  getCurso(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/nombrecursos`);
  }
}
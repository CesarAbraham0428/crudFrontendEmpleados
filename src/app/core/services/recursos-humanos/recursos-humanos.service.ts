import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecursosHumanosService {

   private apiUrl = `${environment.baseUrl}/cursosI`;

  constructor(private http: HttpClient) {}


  guardarCurso(curso: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, curso);
  }

  obtenerCursos(filtros: any = {}): Observable<any> {
    // Convertir el objeto de filtros en HttpParams
    let params = new HttpParams();
  
    if (filtros.nombreCurso) {
      params = params.set('nombreCurso', filtros.nombreCurso);
    }
    if (filtros.fechaInicio) {
      params = params.set('fechaInicio', filtros.fechaInicio);
    }
    if (filtros.fechaTermino) {
      params = params.set('fechaTermino', filtros.fechaTermino);
    }
    
    return this.http.get(`${this.apiUrl}/obtenercursos`, { params });
  }
}
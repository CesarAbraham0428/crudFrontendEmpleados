import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecursosHumanosService {

   private apiUrl = `${environment.baseUrl}/cursosI`;

  constructor(private http: HttpClient) {}


  guardarCurso(curso: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, curso);
  }
}
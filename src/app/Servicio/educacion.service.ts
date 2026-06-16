import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Educacion } from '../Modelo/educacion';

@Injectable({
  providedIn: 'root'
})
export class EducacionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  findAll(): Observable<Educacion[]> {
      return this.http.get<Educacion[]>(this.apiUrl + '/todas/educaciones')
        .pipe(
          catchError(error => {
            console.error('Error fetching Educaciones:', error);
            return of([]);  // Devuelve un array vacío
          })
        );
    }

    save(educacion: Educacion): Observable<Educacion> {
      return this.http.post<Educacion>(this.apiUrl + '/auth/guardar/educacion', educacion)
        .pipe(
          catchError(error => {
            console.error('Error saving Educacion nueva:', error);
            return of();  // Devuelve un vacío en caso de error
          })
        );
    }
  
      updateEducacion(id: number, educacion : Educacion): Observable<Educacion> {
      console.log(JSON.stringify(educacion));
      return this.http.put<Educacion>(`${this.apiUrl}/auth/modificar/educacion/${id}`, educacion)
      .pipe(
        catchError(error => {
          console.error('Error al actualizar Educacion:', error);
          alert('Error al actualizar Educacion:' + error.message);
          return throwError(() => error);
        })
      );
    }
        
    delete(id: number): Observable<any> {
      return this.http.delete<void>(this.apiUrl + '/borrar/educacion' + id)
        .pipe(
          catchError(error => {
            console.error('Error fetching conocimientos:', error);
            return of([]);  // Devuelve un array vacío
          })
        );
    }
}

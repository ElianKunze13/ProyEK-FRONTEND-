import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Habilidad } from '../Modelo/habilidad';

@Injectable({
  providedIn: 'root'
})
export class HabilidadService {
  
private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  findAll(): Observable<Habilidad[]> {
      return this.http.get<Habilidad[]>(this.apiUrl + '/todas/habilidades')
        .pipe(
          catchError(error => {
            console.error('Error fetching Habilidades:', error);
            return of([]);  // Devuelve un array vacío
          })
        );
    }

    save(habilidad: Habilidad): Observable<Habilidad> {
      return this.http.post<Habilidad>(this.apiUrl + '/auth/guardar/habilidad', habilidad)
        .pipe(
          catchError(error => {
            console.error('Error saving Habilidad nueva:', error);
            return of();  // Devuelve un vacío en caso de error
          })
        );
    }
  
      updatHabilidad(id: number, habilidad : Habilidad): Observable<Habilidad> {
      console.log(JSON.stringify(habilidad));
      return this.http.put<Habilidad>(`${this.apiUrl}/auth/modificar/habilidad/${id}`, habilidad)
      .pipe(
        catchError(error => {
          console.error('Error al actualizar Habilidad:', error);
          alert('Error al actualizar Habilidad:' + error.message);
          return throwError(() => error);
        })
      );
    }
        
    delete(id: number): Observable<any> {
      return this.http.delete<void>(this.apiUrl + '/borrar/habilidad/' + id)
        .pipe(
          catchError(error => {
            console.error('Error fetching Habilidad:', error);
            return of([]);  // Devuelve un array vacío
          })
        );
    }
}

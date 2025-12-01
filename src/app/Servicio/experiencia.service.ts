import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Experiencia } from '../Modelo/experiencia';

@Injectable({
  providedIn: 'root'
})
export class ExperienciaService {
private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  findAll(): Observable<Experiencia[]> {
      return this.http.get<Experiencia[]>(this.apiUrl + '/todas/experiencias')
        .pipe(
          catchError(error => {
            console.error('Error fetching Experiencias:', error);
            return of([]);  // Devuelve un array vacío
          })
        );
    }

    save(experiencia: Experiencia): Observable<Experiencia> {
      return this.http.post<Experiencia>(this.apiUrl + '/auth/guardar/experiencia', experiencia)
        .pipe(
          catchError(error => {
            console.error('Error saving Experiencia nueva:', error);
            return of();  // Devuelve un vacío en caso de error
          })
        );
    }
  
      updatExperiencia(id: number, experiencia : Experiencia): Observable<Experiencia> {
      console.log(JSON.stringify(experiencia));
      return this.http.put<Experiencia>(`${this.apiUrl}/auth/modificar/experiencia/${id}`, experiencia)
      .pipe(
        catchError(error => {
          console.error('Error al actualizar Experiencia:', error);
          alert('Error al actualizar Experiencia:' + error.message);
          return throwError(() => error);
        })
      );
    }
        
    delete(id: number): Observable<any> {
      return this.http.delete<void>(this.apiUrl + '/borrar/experiencia/' + id)
        .pipe(
          catchError(error => {
            console.error('Error fetching experiencia:', error);
            return of([]);  // Devuelve un array vacío
          })
        );
    }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Imagen } from '../Modelo/imagen';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  /*findAllFotos(): Observable<Foto[]> {
    return this.http.get<Foto[]>(`${this.apiUrl}/auth/fotos`).pipe(
      catchError(error => {
        console.error('Error fetching fotos:', error);
        return of([]);  // Devuelve un array vacío en caso de error
      })
    );
  }
  getById(id: number): Observable<Foto> {
    return this.http.get<Foto>(this.apiUrl + '/auth/fotos/' + id)
      .pipe(
        catchError(error => {
          console.error('Error fetching foto por id', error);
          return of();  // Devuelve un vacío
        })
      );
  }
  save(foto: Foto): Observable<Foto> {
    return this.http.post<Foto>(this.apiUrl + '/auth/fotos', foto)
      .pipe(
        catchError(error => {
          console.error('Error saving foto:', error);
          return of();  // Devuelve un vacío en caso de error
        })
      );
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/auth/fotos/' + id)
      .pipe(
        catchError(error => {
          console.error('Error deleting foto:', error);
          return of();  // Devuelve un vacío en caso de error
        })
      );
  } */


}

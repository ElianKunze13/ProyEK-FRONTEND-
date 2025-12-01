import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Conocimiento } from '../Modelo/conocimiento';
import { catchError, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConocimientoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  
    findAll(): Observable<Conocimiento[]> {
        return this.http.get<Conocimiento[]>(this.apiUrl + '/todos/conocimientos')
          .pipe(
            catchError(error => {
              console.error('Error fetching Conocimientos:', error);
              return of([]);  // Devuelve un array vacío
            })
          );
      }
  

findFrontend(): Observable<Conocimiento[]> {
    return this.http.get<Conocimiento[]>(this.apiUrl + '/frontend')
      .pipe(
        catchError(error => {
          console.error('Error fetching conocimientos FRONTEND:', error);
          return of([]);  // Devuelve un array vacío
        })
      );
  }
  findBackend(): Observable<Conocimiento[]> {
    return this.http.get<Conocimiento[]>(this.apiUrl + '/backend')
      .pipe(
        catchError(error => {
          console.error('Error fetching conocimientos BACKEND:', error);
          return of([]);  // Devuelve un array vacío
        })
      );
  }
  findBD(): Observable<Conocimiento[]> {
    return this.http.get<Conocimiento[]>(this.apiUrl + '/baseDatos')
      .pipe(
        catchError(error => {
          console.error('Error fetching conocimientos BASE DE DATOS:', error);
          return of([]);  // Devuelve un array vacío
        })
      );
  }
  findTesting(): Observable<Conocimiento[]> {
    return this.http.get<Conocimiento[]>(this.apiUrl + '/testing')
      .pipe(
        catchError(error => {
          console.error('Error fetching conocimientos TESTING:', error);
          return of([]);  // Devuelve un array vacío
        })
      );
  }
    findOtros(): Observable<Conocimiento[]> {
    return this.http.get<Conocimiento[]>(this.apiUrl + '/otros/conocimientos')
      .pipe(
        catchError(error => {
          console.error('Error fetching conocimientos OTROS:', error);
          return of([]);  // Devuelve un array vacío
        })
      );
  }
  save(conocimiento: Conocimiento): Observable<Conocimiento> {
    return this.http.post<Conocimiento>(this.apiUrl + '/auth/guardar/conocimiento', conocimiento)
      .pipe(
        catchError(error => {
          console.error('Error saving conocimiento nuevo:', error);
          return of();  // Devuelve un vacío en caso de error
        })
      );
  }

    updateReporte(id: number, conocimiento : Conocimiento): Observable<Conocimiento> {
    console.log(JSON.stringify(conocimiento));
    return this.http.put<Conocimiento>(`${this.apiUrl}/auth/modificar/conocimiento/${id}`, conocimiento)
    .pipe(
      catchError(error => {
        console.error('Error al actualizar conocimiento:', error);
        alert('Error al actualizar conocimiento:' + error.message);
        return throwError(() => error);
      })
    );
  }
      
  delete(id: number): Observable<any> {
    return this.http.delete<void>(this.apiUrl + '/borrrar/conocimiento/' + id)
      .pipe(
        catchError(error => {
          console.error('Error fetching conocimientos:', error);
          return of([]);  // Devuelve un array vacío
        })
      );
  }





}

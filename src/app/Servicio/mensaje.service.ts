import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Mensaje } from '../Modelo/mensaje';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  findAll(): Observable<Mensaje[]> {
      return this.http.get<Mensaje[]>(this.apiUrl + '/allMensajes')
        .pipe(
          catchError(error => {
            console.error('Error fetching Mensajes:', error);
            return of([]);  // Devuelve un array vacío
          })
        );
    }

    findbyId(id: number): Observable<Mensaje>{ 
      return this.http.get<Mensaje>(this.apiUrl + '/obtenerMensaje/' + id)
      .pipe(
        catchError(error => {
          console.error('Error fetching Mensaje por id', error);
          return of();  // Devuelve un vacío en caso de error
        })
      );}

    save(mensaje: Mensaje): Observable<Mensaje> {
      return this.http.post<Mensaje>(this.apiUrl + '/guardar/contacto', mensaje)
        .pipe(
          catchError(error => {
            console.error('Error saving Mensaje nuevo:', error);
            return of();  // Devuelve un vacío en caso de error
          })
        );
    }

        
    delete(id: number): Observable<any> {
      return this.http.delete<void>(this.apiUrl + '/borrar/mensajes/' + id)
        .pipe(
          catchError(error => {
            console.error('Error fetching Mensaje:', error);
            return of([]);  // Devuelve un array vacío
          })
        );
    }
}

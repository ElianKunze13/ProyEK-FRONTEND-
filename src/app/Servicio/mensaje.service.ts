import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Mensaje } from '../Modelo/mensaje';


export interface ApiResponse {
  estado: string;
  mensaje: string;
  data: Mensaje | null;
}
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

      /*modificar service para enviar datos de formulario a backend y enviar correo a usuario
    save(mensaje: Mensaje): Observable<Mensaje> {
      return this.http.post<Mensaje>(this.apiUrl + '/guardar/contacto', mensaje)
        .pipe(
          catchError(error => {
            console.error('Error saving Mensaje nuevo:', error);
            return of();  // Devuelve un vacío en caso de error
          })
        );
    }*/
  enviarMensaje(mensaje: Mensaje): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/guardar/contacto`, mensaje)
      .pipe(
        catchError(error => {
          console.error('Error enviando mensaje:', error);
          // Retornamos un objeto de error similar a la respuesta del backend
          return of({
            estado: 'error',
            mensaje: 'Error al conectar con el servidor',
            data: null
          });
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

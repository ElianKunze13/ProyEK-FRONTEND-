import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Usuario } from '../Modelo/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

 getById (id: number): Observable<Usuario> {   
    return this.http.get<Usuario>(this.apiUrl + '/auth/traerPor/' + id) // <Usuario> lo que va a devolver la llamada-consulta
      .pipe(
        
      map(usuario => ({
      ...usuario,
      fotoUsuario: usuario.fotoUsuario || [] // Convierte null a array vacío
    })
      )
      );
  }

getByUsername(username: string): Observable<Usuario | undefined> {
     return this.http.get<Usuario>(this.apiUrl + '/username/' + username)
    .pipe(
      catchError(error => {
        console.error('Error fetching usuario por username', error);
        return of(undefined); // Devuelve null ponele en caso de error
      })
    );
}

save(usuario: Usuario): Observable<Usuario> { 
    return this.http.post<Usuario>(this.apiUrl + '/guardarUsuario', usuario)
    .pipe(
        catchError(error => {
          console.error('Error saving usuario:', error);
          return of();  // Devuelve un vacío en caso de error
        })
      );
  }

 updateUsuario (id: number, usuario: Usuario): Observable<Usuario> { 
    return this.http.put<Usuario>(`${this.apiUrl}/usuario/${id}`, usuario)
    .pipe(
        catchError(error => {
          console.error('Error actualizando usuario:', error);
          return of();  // Devuelve un vacío en caso de error
        })
      );
  }



}

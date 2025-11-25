import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import  {  Observable, throwError, catchError, BehaviorSubject , tap, map} from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest } from './loginRequest';
import { isPlatformBrowser } from '@angular/common';
import { Usuario } from '../../Modelos/usuario';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  usuarioLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  usuarioToken: BehaviorSubject<String> =new BehaviorSubject<String>("");

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.usuarioLoginOn=new BehaviorSubject<boolean>(this.getToken() !=null);
    this.usuarioToken=new BehaviorSubject<String>(this.getToken() || "");
  }

  private apiUrl =environment.apiUrl;

  login(credentials: LoginRequest): Observable<any> {

    return this.http.post<any>(this.apiUrl + "/auth/login", credentials).pipe(
    tap((userData) => {
      localStorage.setItem("token", userData.token);  // 💾 Persistencia
      this.usuarioToken.next(userData.token);           // 🔄 Actualiza token
      this.usuarioLoginOn.next(true);                   // 🟢 Estado logueado
      this.setPayloadData();
    }),
    map((userData) => userData.token),                  // 🎯 Transformación
    catchError(this.handleError)                        // 🚨 Manejo errores
  );
}

register(credentials: Usuario): Observable<any> {

    return this.http.post<any>(this.apiUrl + "/auth/register", credentials).pipe(
    tap((userData) => {
      localStorage.setItem("token", userData.token);  // 💾 Persistencia
      this.usuarioToken.next(userData.token);           // 🔄 Actualiza token
      this.usuarioLoginOn.next(true);                   // 🟢 Estado logueado
      this.setPayloadData();
    }),
    map((userData) => userData.token),                  // 🎯 Transformación
    catchError(this.handleError)                        // 🚨 Manejo errores
  );
}

  logout():void{
  localStorage.removeItem("token");  // 🗑️ Limpia almacenamiento
  localStorage.removeItem("rol", ); // Primer rol
  localStorage.removeItem("username");
  localStorage.removeItem("tokenExp"); // Guardar expiración
  this.usuarioLoginOn.next(false);     // 🔴 Actualiza estado
  }

  private handleError(error:HttpErrorResponse){
    if(error.status===0){
      console.error('Se ha producio un error ', error.error);
    }
    else{
      console.error('Backend retornó el código de estado ', error);
    }
    return throwError(()=> new Error('Algo falló. Por favor intente nuevamente.'));
  }

  private getToken(): string | null {
  if (isPlatformBrowser(this.platformId)) {
    // si hay un browser p almacenar
      return localStorage.getItem("token");
    }
  else{
   // console.warn('localStorage no está disponible en este entorno');
    return '';
  }

}
  get userData():Observable<String>{
    return this.usuarioToken.asObservable();
  }


  get userLoginOn(): Observable<boolean>{
    return this.usuarioLoginOn.asObservable();
  }

  get userToken():String{
    return this.usuarioToken.value;
  }

isAuthenticated(): boolean {
  const token = this.getToken(); // Usar getToken() en lugar de userToken

  if (!token) {
    console.warn('No hay token disponible');
    return false;
  }

  // Verificar si el token está expirado
  const isExpired = this.isTokenExpired();

  if (isExpired) {
    console.warn('Token expirado, haciendo logout...');
    this.logout();
    return false;
  }

  return true;
}

// Corregir el método isTokenExpired
private isTokenExpired(): boolean {
  const exp = localStorage.getItem("tokenExp");
  if (!exp) return true;

  const expirationTime = parseInt(exp);
  const currentTime = Date.now();

  console.log('Verificando expiración:', {
    currentTime: new Date(currentTime),
    expirationTime: new Date(expirationTime),
    isExpired: currentTime > expirationTime
  });

  return currentTime > expirationTime;
}




getRole(): string | null {
  return localStorage.getItem('rol');
}
// En login.service.ts - Asegurar que todos los métodos manejen SSR
getUsername(): string | null {
  if (isPlatformBrowser(this.platformId)) {
    return localStorage.getItem('username'); 
  }
  return null;
}

private setPayloadData(): void {
  if (!isPlatformBrowser(this.platformId)) {
    return; // ✅ No ejecutar en servidor
  }

  const token = this.userToken;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      const roles = payload.roles;
      const sub = payload.sub;

      localStorage.setItem("rol", roles[0]);
      localStorage.setItem("username", sub);
      localStorage.setItem("tokenExp", exp.toString());

    } catch (error) {
      console.error('Error parsing token payload:', error);
    }
  }
}

getUsuarioDesdeToken(): { id: number, username: string, roles: string[] } | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    // 🔹 Retornamos los datos principales del usuario
    return {
      id: payload.id,
      username: payload.sub,
      roles: payload.roles
    };
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
}


}


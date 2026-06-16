// src/app/guards/auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { LoginService } from '../Servicio/auth2/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: LoginService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // ✅ Usar el Observable correctamente
    return this.authService.userLoginOn.pipe(
      take(1), // Tomar solo el primer valor y completar
      map(isAuthenticated => {
        if (isAuthenticated) {
          // Verificar adicionalmente si el token no está expirado
          if (!this.authService.isAuthenticated()) {
            console.warn('Token expirado en guard');
            this.authService.logout();
            return this.router.parseUrl('/login');
          }
          return true;
        }
        
        // Guardar la URL a la que intentaba acceder para redirigir después del login
        this.authService.setRedirectUrl(state.url);
        return this.router.parseUrl('/login');
      })
    );
  }
}
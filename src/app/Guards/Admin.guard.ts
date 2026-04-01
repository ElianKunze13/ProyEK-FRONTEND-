// admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { LoginService } from '../Servicio/auth2/login.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: LoginService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.userLoginOn.pipe(
      take(1),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          this.authService.setRedirectUrl(window.location.pathname);
          return this.router.parseUrl('/login');
        }

        // Verificar rol de ADMIN
        const role = this.authService.getRole();
        if (role !== 'ADMIN') {
          console.warn('Acceso denegado: se requiere rol ADMIN');
          return this.router.parseUrl('/unauthorized'); // Redirigir a página de no autorizado
        }

        return true;
      })
    );
  }
}
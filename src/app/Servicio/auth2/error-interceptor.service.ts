// error-interceptor.service.ts - VERSIÓN CORREGIDA
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const ErrorResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(error => {
      console.error('Error Interceptor:', error);

      // Solo manejar errores en el cliente
      if (typeof window !== 'undefined') {
        if (error.status === 401) {
          console.error('Error 401 - No autorizado');
          // Limpiar localStorage y redirigir
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExp");
          localStorage.removeItem("rol");
          localStorage.removeItem("username");

          // Redirigir al login
          window.location.href = '/login';
        } else if (error.status === 403) {
          console.error('Error 403 - Acceso denegado');
        } else if (error.status === 500) {
          console.error('Error 500 - Error interno del servidor');
        }
      }

      return throwError(() => error);
    })
  );
};

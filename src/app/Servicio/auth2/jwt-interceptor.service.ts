// jwt-interceptor.service.ts - VERSIÓN CORREGIDA
import { HttpInterceptorFn } from '@angular/common/http';

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Verificar si estamos en el cliente (navegador)
  if (typeof window === 'undefined') {
    return next(req);
  }

  const token = localStorage.getItem("token");

  if (token) {
    try {
      // Verificar expiración del token
      const tokenExp = localStorage.getItem("tokenExp");
      const isExpired = tokenExp && Date.now() > parseInt(tokenExp);

      if (isExpired) {
        console.warn('JWT Interceptor: Token expirado');
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExp");
        localStorage.removeItem("rol");
        localStorage.removeItem("username");
      } else {
        // Clonar la request y agregar el header
        const clonedReq = req.clone({
          setHeaders: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('JWT Interceptor: Token agregado a', req.url);
        return next(clonedReq);
      }
    } catch (error) {
      console.error('JWT Interceptor: Error procesando token', error);
    }
  }

  return next(req);
};

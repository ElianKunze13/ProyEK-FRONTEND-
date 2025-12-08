import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from '../../Servicio/auth2/login.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-modificar-portofolio',
  imports: [],
  templateUrl: './modificar-portofolio.component.html',
  styleUrl: './modificar-portofolio.component.css'
})
export class ModificarPortofolioComponent implements OnInit, OnDestroy {

  loginOn: boolean = false;
  usuario: string = "";
  rol: string = "";
  private subscription: Subscription = new Subscription();
  private isBrowser: boolean;

  constructor(
    private loginService: LoginService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // ✅ VERIFICAR ESTADO INICIAL INMEDIATAMENTE
    this.verificarEstadoInicial();

    // ✅ Suscribirse a cambios futuros
    this.subscription.add(
      this.loginService.userLoginOn.subscribe((isLoggedIn: boolean) => {
        this.loginOn = isLoggedIn;
        console.log('🔄 Estado de login cambiado:', this.loginOn);
        this.obtenerUsuarioDesdeStorage();
      })
    );
    
    // ✅ También suscribirse a cambios en el token
    this.subscription.add(
      this.loginService.userData.subscribe((token: String) => {
        console.log('🔄 Token actualizado:', token ? 'presente' : 'ausente');
        if (token) {
          this.loginOn = true;
          this.obtenerUsuarioDesdeStorage();
        } else {
          this.loginOn = false;
          this.usuario = "";
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private verificarEstadoInicial(): void {
    if (!this.isBrowser) return;

    try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      const role = localStorage.getItem("rol")

      console.log('🔍 Verificación inicial:', {
        token: token ? 'presente' : 'ausente',
        username: username || 'no disponible'
      });

      if (token && this.esTokenValido()) {
        this.loginOn = true;
        this.usuario = username || '';
        this.rol = role || '';
        console.log('✅ Usuario autenticado detectado:', this.usuario);

        // Forzar actualización en el servicio
        this.loginService.usuarioLoginOn.next(true);
        this.loginService.usuarioToken.next(token);
      } else {
        this.loginOn = false;
        this.usuario = "";
        this.rol = "";
        console.log('❌ No hay usuario autenticado');

        // Limpiar estado inconsistente
        if (!token) {
          this.limpiarStorage();
        }
      }
    } catch (error) {
      console.error('Error en verificación inicial:', error);
      this.loginOn = false;
      this.usuario = "";
    }
  }

  private esTokenValido(): boolean {
    try {
      const tokenExp = localStorage.getItem('tokenExp');
      if (!tokenExp) return false;

      const expiracion = parseInt(tokenExp);
      const ahora = Date.now();
      const valido = ahora < expiracion;

      console.log('⏰ Validación token:', {
        expiracion: new Date(expiracion),
        ahora: new Date(ahora),
        valido: valido
      });

      return valido;
    } catch {
      return false;
    }
  }

  private obtenerUsuarioDesdeStorage(): void {
    if (!this.isBrowser) return;

    try {
      const username = localStorage.getItem('username');
      console.log('👤 Obteniendo usuario desde storage:', username);

      if (username) {
        this.usuario = username;
      } else {
        this.usuario = "";
      }
    } catch (error) {
      console.warn('Error obteniendo usuario:', error);
      this.usuario = "";
    }
  }

  private limpiarStorage(): void {
    if (!this.isBrowser) return;

    try {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExp');
      localStorage.removeItem('rol');
      localStorage.removeItem('username');
      console.log('🧹 Storage limpiado');
    } catch (error) {
      console.warn('Error limpiando storage:', error);
    }
  }

  getInicialUsuario(): string {
    if (this.usuario && this.usuario.length > 0) {
      return this.usuario.charAt(0).toUpperCase();
    }
    return 'U';
  }

  logout(): void {
    console.log('🚪 Cerrando sesión...');
    this.loginService.logout();
    this.loginOn = false;
    this.usuario = "";
    this.limpiarStorage();
  }

}

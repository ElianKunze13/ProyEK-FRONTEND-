import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Habilidad } from '../../Modelo/habilidad';
import { HabilidadService } from '../../Servicio/habilidad.service';
import { Usuario } from '../../Modelo/usuario';
import { UsuarioService } from '../../Servicio/usuario.service';
import { Role } from '../../Modelo/Enums/role';
import { NgClass } from "../../../../node_modules/@angular/common/common_module.d-NEF7UaHr";

@Component({
  selector: 'app-perfil',
  imports: [],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit, OnDestroy {
    expandedIndex: number | null = null;

 usuario: Usuario = {
  id:0,
nombre: "",
username:"",
password:"",
rol:Role.ADMIN,
introduccion:"",
descripcion:"",
fotoUsuario :  [],
active:true 
};
  loading = true;

  habilidades: Habilidad[] = [];
  desplazamiento = 0;
  itemWidth = 150;
  itemsVisibles = 3;

  
 constructor(private http: HttpClient,
   private habilidadService: HabilidadService,
  private usuarioService:UsuarioService) {}
///metodo para descargar pdf curriculo
descargarPdf() {
  this.http.get('assets/BUENAS-PRACTICAS-EN-LA-PODA.pdf', { responseType: 'blob' })
    .subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'BUENAS-PRACTICAS-EN-LA-PODA.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
}
 
  ngOnInit(): void {
    // Agregar animación de entrada cuando se carga el componente
    setTimeout(() => {
      const mainPage = document.getElementById('main-page');
      if (mainPage) {
        mainPage.classList.add('slide-left-enter');
      }
    }, 50); 

 this.loadUsuario();
    this.cargarHabilidades();
  }


  // Configuración del carrusel automático
  intervalo: any;
  velocidad = 5000; // Milisegundos entre transiciones
  direccion: 'derecha' | 'izquierda' = 'derecha';
  
  cargarHabilidades(): void {
    this.habilidadService.findAll().subscribe({
      next: (data) => {
        this.habilidades = data;
        // Iniciar carrusel automático después de cargar datos
        this.iniciarCarruselAutomatico();
              console.log(JSON.stringify(this.habilidades))

      },
      error: (err) => {console.error('Error cargando habilidades', err),
      this.habilidades = [];
      }
    });
  }
  
  iniciarCarruselAutomatico(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
    
    this.intervalo = setInterval(() => {
      this.moverAutomatico();
    }, this.velocidad);
  }
  
  moverAutomatico(): void {
    if (this.direccion === 'derecha') {
      this.mover(1);
      
      // Cambiar dirección si llegamos al final
      const maxDesplazamiento = -((this.habilidades.length - this.itemsVisibles) * this.itemWidth);
      if (this.desplazamiento <= maxDesplazamiento) {
        setTimeout(() => {
          this.direccion = 'izquierda';
          this.mover(-1);
        }, 300);
      }
    } else {
      this.mover(-1);
      
      // Cambiar dirección si volvemos al inicio
      if (this.desplazamiento >= 0) {
        setTimeout(() => {
          this.direccion = 'derecha';
          this.mover(1);
        }, 300);
      }
    }
  }
  
  mover(direccion: number): void {
    this.desplazamiento += direccion * this.itemWidth;
  }
  
  // Métodos para pausar/reanudar al interactuar
  pausarCarrusel(): void {
    clearInterval(this.intervalo);
  }
  
  reanudarCarrusel(): void {
    this.iniciarCarruselAutomatico();
  }
  
  ngOnDestroy(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  loadUsuario(): void {
  this.loading = true;
  this.usuarioService.getById(1).subscribe({
    next: (data) => {
      console.log('Usuario recibido:', data);
      console.log('FotoUsuario:', data.fotoUsuario);
      console.log('Tipo de fotoUsuario:', typeof data.fotoUsuario);
      console.log('Es array?', Array.isArray(data.fotoUsuario));
      
      // DEPURACIÓN DETALLADA
      if (data.fotoUsuario) {
        console.log('Longitud del array:', data.fotoUsuario.length);
        if (data.fotoUsuario.length > 0) {
          console.log('Primer elemento:', data.fotoUsuario[0]);
          console.log('URL del primer elemento:', data.fotoUsuario[0]?.url);
          console.log('Alt del primer elemento:', data.fotoUsuario[0]?.alt);
        }
      } else {
        console.log('fotoUsuario es null o undefined');
      }
      
      // Normalizar fotoUsuario
      if (!data.fotoUsuario || !Array.isArray(data.fotoUsuario)) {
        console.log('Normalizando fotoUsuario a array vacío');
        data.fotoUsuario = [];
      }
      
      // Filtrar elementos vacíos o sin URL
      data.fotoUsuario = data.fotoUsuario.filter(foto => 
        foto && foto.url && foto.url.trim() !== ''
      );
      
      this.usuario = data;
      this.loading = false;
    },
    error: (err) => {
      console.error('Error al cargar usuario:', err);
      console.error('Detalles del error:', err.error);
      this.loading = false;
    }
  });
}

  // Método para obtener iniciales para avatar por defecto
  getIniciales(nombreCompleto: string | undefined): string {
    if (!nombreCompleto) return 'EK';
    
    const nombres = nombreCompleto.split(' ');
    if (nombres.length >= 2) {
      return (nombres[0].charAt(0) + nombres[1].charAt(0)).toUpperCase();
    }
    return nombreCompleto.substring(0, 2).toUpperCase();
  }


}


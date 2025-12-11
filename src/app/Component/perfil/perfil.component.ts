import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Habilidad } from '../../Modelo/habilidad';
import { HabilidadService } from '../../Servicio/habilidad.service';

@Component({
  selector: 'app-perfil',
  imports: [],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit, OnDestroy {

  habilidades: Habilidad[] = [];
  desplazamiento = 0;
  itemWidth = 150;
  itemsVisibles = 3;

  
 constructor(private http: HttpClient, private habilidadService: HabilidadService) {}
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
}


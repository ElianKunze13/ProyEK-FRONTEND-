import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Habilidad } from '../../Modelo/habilidad';
import { HabilidadService } from '../../Servicio/habilidad.service';
import { Usuario } from '../../Modelo/usuario';
import { UsuarioService } from '../../Servicio/usuario.service';
import { Role } from '../../Modelo/Enums/role';
import { ExperienciaService } from '../../Servicio/experiencia.service';
import { Experiencia } from '../../Modelo/experiencia';

@Component({
  selector: 'app-perfil',
  standalone: true, // Importante: si es standalone
  imports: [CommonModule], // Importar CommonModule para usar ngIf, ngFor
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  expandedIndex: number | null = null;
  
  // Propiedades para el popup/modal
  showModal: boolean = false;
  selectedExperiencia: Experiencia | null = null;

  usuario: Usuario = {
    id: 0,
    nombre: "",
    username: "",
    password: "",
    rol: Role.ADMIN,
    introduccion: "",
    descripcion: "",
    fotoPerfil: undefined,
    fotoPortada: undefined,
    active: true
  };
  loading = true;

  experiencias: Experiencia[] = [];
  habilidades: Habilidad[] = [];
  desplazamiento = 0;
  itemWidth = 150;
  itemsVisibles = 3;


  constructor(private http: HttpClient,
    private habilidadService: HabilidadService,
    private experienciaService: ExperienciaService,
    private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    setTimeout(() => {
      const mainPage = document.getElementById('main-page');
      if (mainPage) {
        mainPage.classList.add('slide-left-enter');
      }
    }, 50);

    this.loadUsuario();
    this.cargarHabilidades();
    this.cargarExperiencias();
  }

  // Método para abrir el modal con Bootstrap
  abrirModal(experiencia: Experiencia): void {
    console.log('Abriendo modal para:', experiencia.titulo); // Debug
    this.selectedExperiencia = experiencia;
    this.showModal = true;
    
    // Usar Bootstrap modal si está disponible
    const modalElement = document.getElementById('experienciaModal');
    if (modalElement) {
      // @ts-ignore
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Método para cerrar el modal
  cerrarModal(): void {
    this.showModal = false;
    this.selectedExperiencia = null;
  }

  // Método para abrir el link
  abrirLink(url: string | undefined): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  // Configuración del carrusel automático
  intervalo: any;
  velocidad = 5000;
  direccion: 'derecha' | 'izquierda' = 'derecha';

  cargarExperiencias(): void {
    this.experienciaService.findAll().subscribe({
      next: (data: Experiencia[]) => {
        this.experiencias = data;
        console.log('📊 Número de experiencias:', data.length);
      },
      error: (err) => {
        this.experiencias = [];
        console.log("Error al cargar lista")
        console.error('📄 Detalles del error:', err.error);
      }
    });
  }

  cargarHabilidades(): void {
    this.habilidadService.findAll().subscribe({
      next: (data) => {
        this.habilidades = data;
        this.iniciarCarruselAutomatico();
        console.log(JSON.stringify(this.habilidades))
      },
      error: (err) => {
        console.error('Error cargando habilidades', err);
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
      const maxDesplazamiento = -((this.habilidades.length - this.itemsVisibles) * this.itemWidth);
      if (this.desplazamiento <= maxDesplazamiento) {
        setTimeout(() => {
          this.direccion = 'izquierda';
          this.mover(-1);
        }, 300);
      }
    } else {
      this.mover(-1);
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

  loadUsuario(): void {
    this.loading = true;
    this.usuarioService.getById(1).subscribe({
      next: (data) => {
        this.usuario = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuario:', err);
        this.loading = false;
      }
    });
  }

  getIniciales(nombreCompleto: string | undefined): string {
    if (!nombreCompleto) return 'EK';
    const nombres = nombreCompleto.split(' ');
    if (nombres.length >= 2) {
      return (nombres[0].charAt(0) + nombres[1].charAt(0)).toUpperCase();
    }
    return nombreCompleto.substring(0, 2).toUpperCase();
  }
}
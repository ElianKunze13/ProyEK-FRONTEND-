import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../Servicio/usuario.service';
import { Usuario } from '../../Modelo/usuario';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  
  usuarioActual: Usuario | null = null;
  videoPath: string = '';
  tieneVideo: boolean = false;
  cargando: boolean = true;
  errorVideo: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    setTimeout(() => {
      const mainPage = document.getElementById('main-page');
      if (mainPage) {
        mainPage.classList.add('slide-left-enter');
      }
    }, 70);

    this.cargarUsuarioConVideo();
  }

  cargarUsuarioConVideo() {
    this.cargando = true;
    this.errorVideo = false;
    
    const usuarioId = this.obtenerIdUsuarioActual();
    
    this.usuarioService.getById(usuarioId).subscribe({
      next: (usuario) => {
        this.usuarioActual = usuario;
        console.log('Usuario cargado:', usuario);
        console.log('Video del usuario:', usuario.video);
        this.procesarVideo(usuario.video);
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
        this.cargando = false;
        this.errorVideo = true;
      }
    });
  }

  procesarVideo(video: any) {
    // CORRECCIÓN: Usar 'path' en lugar de 'url'
    if (video && video.path && video.path.trim() !== '') {
      this.tieneVideo = true;
      
      let urlSegura = video.path;
      
      // Si la URL no comienza con http, asumimos que es un video local
      if (!urlSegura.startsWith('http') && !urlSegura.startsWith('data:')) {
        if (!urlSegura.startsWith('/')) {
          urlSegura = '/' + urlSegura;
        }
      }
      
      this.videoPath = urlSegura;
      console.log('Video cargado correctamente - Path:', video.path);
      console.log('Nombre original:', video.nombreOriginal);
      console.log('Tipo:', video.tipo);
      console.log('URL segura:', urlSegura);
    } else {
      this.tieneVideo = false;
      this.videoPath = '';
      console.log('No hay video disponible para este usuario');
      if (video) {
        console.log('Video existe pero path está vacío o es nulo:', video);
      }
    }
  }

  obtenerIdUsuarioActual(): number {
    const userId = localStorage.getItem('userId');
    // Si no hay userId en localStorage, intentar obtener por username
    if (!userId) {
      const username = localStorage.getItem('username');
      if (username) {
        // Podrías hacer una llamada adicional aquí, pero por ahora retornamos 1
        console.log('No se encontró userId, usando ID por defecto 1');
      }
    }
    return userId ? parseInt(userId) : 1;
  }
}
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../Servicio/usuario.service';
import { Usuario } from '../../Modelo/usuario';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Role } from '../../Modelo/Enums/role';

@Component({
  selector: 'app-inicio',
  standalone: true, // Importante: si es standalone
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  
  //usuarioActual: Usuario | null = null;
  usuarioActual: Usuario = {
      id: 0,
      nombre: "",
      username: "",
      password: "",
      rol: Role.ADMIN,
      introduccion: "",
      descripcion: "",
      fotoPerfil: undefined,
      fotoPortada: undefined,
      videoPresentacion: 
        {
          id: 0,
          path: "",
          nombreOriginal: ""
          }
      ,
      active: true
    };
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
    
    //const usuarioId = this.obtenerIdUsuarioActual();
    
    this.usuarioService.getById(1).subscribe({
      next: (data) => {
        this.usuarioActual = data;
        console.log('Usuario cargado:', data);
        console.log('Video del usuario:', data.videoPresentacion);
        this.procesarVideo(data.videoPresentacion);
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
        this.cargando = false;
        this.errorVideo = true;
      }
    });
  }

    //modificar metodo para cargar usuario con video trayendo el id del usuario desde localStorage o por username
   /* cargarUsuarioConVideo(): void {
    this.cargando = true;
    this.errorVideo = false;
      this.usuarioService.getById(1).subscribe({
next: (data) =>{
  this.usuarioActual = data;
  this.cargando = false;
  console.log('Usuario cargado:', this.usuarioActual);
}
  });
}*/

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
     // console.log('Tipo:', video.tipo);
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

  /*obtenerIdUsuarioActual(): number {
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
  }*/
}
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../Modelo/usuario';
import { UsuarioService } from '../../Servicio/usuario.service';
import { Role } from '../../Modelo/Enums/role';
import { Router } from '@angular/router';
import { Imagen } from '../../Modelo/imagen';
import { Video } from '../../Modelo/video';
import { TipoVideo } from '../../Modelo/Enums/tipoVideo';

@Component({
  selector: 'app-actualizar-perfil',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './actualizar-perfil.component.html',
  styleUrl: './actualizar-perfil.component.css'
})
export class ActualizarPerfilComponent implements OnInit {

  EditarUsuarioForm!: FormGroup;
  editable: boolean = false;
  loginError: string = "";
  usuarioId: number | undefined;
  
  // Propiedades para notificaciones
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  notificationTimeout: any;
  
  // Propiedades separadas para cada tipo de imagen
  fotoPerfilUrl: string = '';
  fotoPerfilAlt: string = '';
  fotoPortadaUrl: string = '';
  fotoPortadaAlt: string = '';
  
  // Propiedades para el video
  videoPath: string = '';
  videoNombreOriginal: string = '';
  videoTipo: TipoVideo | string = '';
  videoId: any = null;
  
  // Lista de tipos de video
  tipoVideoKeys = Object.keys(TipoVideo).filter(key => isNaN(Number(key)));
  
  usuarioOriginal: Usuario | null = null;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.EditarUsuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      username: ['', [Validators.required, Validators.email]],
      introduccion: ['', [Validators.minLength(5), Validators.maxLength(500)]],
      descripcion: ['', [Validators.minLength(5), Validators.maxLength(500)]],
      password: ['', [Validators.minLength(8)]],
      repeatpassword: ['', [Validators.minLength(8)]],
      fotoPerfilUrl: [''],
      fotoPerfilAlt: [''],
      fotoPortadaUrl: [''],
      fotoPortadaAlt: [''],
      // Campos de video
      videoPath: [''],
      videoNombreOriginal: [''],
      // videoTipo: ['']
    });

    this.cargarUsuario();
  }

  mostrarNotificacion(mensaje: string, tipo: 'success' | 'error'): void {
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }
    
    this.notificationMessage = mensaje;
    this.notificationType = tipo;
    this.showNotification = true;
    
    this.notificationTimeout = setTimeout(() => {
      this.showNotification = false;
    }, 4000);
  }

  cerrarNotificacion(): void {
    this.showNotification = false;
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }
  }

  cargarUsuario(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.usuarioService.getByUsername(username).subscribe(usuario => {
        if (usuario) {
          this.usuarioId = usuario.id;
          this.usuarioOriginal = { ...usuario };
          
          this.fotoPerfilUrl = usuario.fotoPerfil?.url || '';
          this.fotoPerfilAlt = usuario.fotoPerfil?.alt || '';
          this.fotoPortadaUrl = usuario.fotoPortada?.url || '';
          this.fotoPortadaAlt = usuario.fotoPortada?.alt || '';
          
          // Cargar datos del video si existe
          if (usuario.videoPresentacion) {
            this.videoId = usuario.videoPresentacion.id;
            this.videoPath = usuario.videoPresentacion.path;
            this.videoNombreOriginal = usuario.videoPresentacion.nombreOriginal;
           //this.videoTipo = usuario.videoPresentacion.tipo;
          }
          
          this.EditarUsuarioForm.patchValue({
            nombre: usuario.nombre,
            username: usuario.username,
            introduccion: usuario.introduccion,
            descripcion: usuario.descripcion,
            password: '',
            repeatpassword: '',
            fotoPerfilUrl: usuario.fotoPerfil?.url || '',
            fotoPerfilAlt: usuario.fotoPerfil?.alt || '',
            fotoPortadaUrl: usuario.fotoPortada?.url || '',
            fotoPortadaAlt: usuario.fotoPortada?.alt || '',
            videoPath: usuario.videoPresentacion?.path || '',
            videoNombreOriginal: usuario.videoPresentacion?.nombreOriginal || '',
           // videoTipo: usuario.videoPresentacion?.tipo || ''
          });
        }
      });
    }
  }

  getInicialUsuario(): string {
    const nombre = this.EditarUsuarioForm.get('nombre')?.value;
    return nombre ? nombre.charAt(0).toUpperCase() : 'U';
  }

  activarEdicion(): void {
    this.editable = true;
    this.cerrarNotificacion();
    this.loginError = "";
  }

  cancelarEdicion(): void {
    this.editable = false;
    this.cargarUsuario();
    this.cerrarNotificacion();
    this.loginError = "";
  }

  // Manejar selección de archivo de video
  onVideoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tamaño máximo (1000MB = 1GB)
      if (file.size > 1000 * 1024 * 1024) {
        this.mostrarNotificacion("El video es demasiado grande. Máximo 1000MB (1GB)", "error");
        return;
      }
      
      // Validar tipo de video por extensión
      /*const fileExtension = file.name.split('.').pop()?.toUpperCase();
      if (!this.tipoVideoKeys.includes(fileExtension || '')) {
        this.mostrarNotificacion(`Formato de video no soportado. Formatos permitidos: ${this.tipoVideoKeys.join(', ')}`, "error");
        return;
      }*/
      
      // Crear URL temporal para previsualización
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.videoPath = e.target.result;
        this.videoNombreOriginal = file.name;
        //this.videoTipo = fileExtension || '';
        
        this.EditarUsuarioForm.patchValue({
          videoPath: e.target.result,
          videoNombreOriginal: file.name,
          //videoTipo: fileExtension || ''
        });
        
        this.mostrarNotificacion("Video cargado correctamente", "success");
      };
      reader.readAsDataURL(file);
    }
  }

  // Eliminar video
  eliminarVideo(): void {
    this.EditarUsuarioForm.patchValue({
      videoPath: '',
      videoNombreOriginal: '',
      //videoTipo: ''
    });
    this.videoPath = '';
    this.videoNombreOriginal = '';
    //this.videoTipo = '';
    this.videoId = null;
    this.mostrarNotificacion("Video eliminado", "success");
  }

  guardarCambios(): void {
    if (this.EditarUsuarioForm.valid) {
      this.loginError = "";
      this.cerrarNotificacion();

      const password = this.EditarUsuarioForm.value.password;
      const repeatpassword = this.EditarUsuarioForm.value.repeatpassword;
      
      if (password !== repeatpassword) { 
        this.loginError = "Las contraseñas no coinciden";
        this.mostrarNotificacion("Las contraseñas no coinciden", "error");
        return;
      }

      if (!this.usuarioId || !this.usuarioOriginal) {
        this.loginError = "No se pudo identificar al usuario";
        this.mostrarNotificacion("No se pudo identificar al usuario", "error");
        return;
      }

      // Preparar imagen de perfil
      let fotoPerfil: Imagen | undefined = undefined;
      const fotoPerfilUrl = this.EditarUsuarioForm.value.fotoPerfilUrl;
      const fotoPerfilAlt = this.EditarUsuarioForm.value.fotoPerfilAlt;

      if (fotoPerfilUrl && fotoPerfilUrl.trim() !== '') {
        fotoPerfil = {
          url: fotoPerfilUrl.trim(),
          alt: fotoPerfilAlt?.trim() || 'Foto de perfil'
        };
      }

      // Preparar imagen de portada
      let fotoPortada: Imagen | undefined = undefined;
      const fotoPortadaUrl = this.EditarUsuarioForm.value.fotoPortadaUrl;
      const fotoPortadaAlt = this.EditarUsuarioForm.value.fotoPortadaAlt;

      if (fotoPortadaUrl && fotoPortadaUrl.trim() !== '') {
        fotoPortada = {
          url: fotoPortadaUrl.trim(),
          alt: fotoPortadaAlt?.trim() || 'Foto de portada'
        };
      }

      // Preparar video
      let video: Video | undefined = undefined;
      const videoPath = this.EditarUsuarioForm.value.videoPath;
      const videoNombreOriginal = this.EditarUsuarioForm.value.videoNombreOriginal;
      //const videoTipo = this.EditarUsuarioForm.value.videoTipo;

      if (videoPath && videoPath.trim() !== '' && videoNombreOriginal && videoNombreOriginal.trim() !== '') {
        video = {
          path: videoPath.trim(),
          nombreOriginal: videoNombreOriginal.trim(),
         // tipo: videoTipo
        };
        
        if (this.videoId) {
          video.id = this.videoId;
        }
      }

      // Construir objeto usuario actualizado
      const usuarioActualizado: Usuario = {
        id: this.usuarioId,
        nombre: this.EditarUsuarioForm.value.nombre,
        username: this.EditarUsuarioForm.value.username,
        password: password || this.usuarioOriginal.password,
        rol: this.usuarioOriginal.rol,
        active: true,
        introduccion: this.EditarUsuarioForm.value.introduccion || '',
        descripcion: this.EditarUsuarioForm.value.descripcion || '',
        fotoPerfil: fotoPerfil,
        fotoPortada: fotoPortada,
        videoPresentacion: video
      };

      this.usuarioService.updateUsuario(this.usuarioId, usuarioActualizado).subscribe({
        next: (res) => { 
          console.log('Usuario actualizado correctamente', res);
          this.editable = false;
          
          this.fotoPerfilUrl = res.fotoPerfil?.url || '';
          this.fotoPerfilAlt = res.fotoPerfil?.alt || '';
          this.fotoPortadaUrl = res.fotoPortada?.url || '';
          this.fotoPortadaAlt = res.fotoPortada?.alt || '';
          
          if (res.videoPresentacion) {
            this.videoId = res.videoPresentacion.id;
            this.videoPath = res.videoPresentacion.path;
            this.videoNombreOriginal = res.videoPresentacion.nombreOriginal;
            //this.videoTipo = res.videoPresentacion.tipo;
          }
          
          this.usuarioOriginal = { ...res };
          localStorage.setItem('username', res.username);
          
          this.EditarUsuarioForm.patchValue({
            password: '',
            repeatpassword: ''
          });
          
          this.mostrarNotificacion("✅ ¡Perfil actualizado correctamente!", "success");
          //mostar en consola el objeto usuario actualizado para verificar los cambios
          console.log('Usuario actualizado:', res);
          
          setTimeout(() => {
            this.cargarUsuario();
          }, 2000);
        },
        error: (err) => {
          console.error('Error actualizando usuario:', err);
          
          let errorMessage = '';
          
          if (err.status === 400 && err.error) {
            const errores = [];
            for (const key in err.error) {
              if (err.error.hasOwnProperty(key)) {
                errores.push(`${key}: ${err.error[key]}`);
              }
            }
            errorMessage = errores.join(', ');
            this.loginError = errorMessage;
          } else if (err.error && err.error.message) {
            errorMessage = err.error.message;
            this.loginError = errorMessage;
          } else {
            errorMessage = 'Error al guardar los cambios. Intente nuevamente.';
            this.loginError = errorMessage;
          }
          
          this.mostrarNotificacion(`❌ ${errorMessage}`, "error");
        }
      });
    } else {
      this.loginError = "Por favor completa todos los campos correctamente.";
      this.mostrarNotificacion("Por favor completa todos los campos correctamente", "error");
      
      Object.keys(this.EditarUsuarioForm.controls).forEach(key => {
        const control = this.EditarUsuarioForm.get(key);
        if (control && control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  eliminarFotoPerfil(): void {
    this.EditarUsuarioForm.patchValue({
      fotoPerfilUrl: '',
      fotoPerfilAlt: ''
    });
    this.fotoPerfilUrl = '';
    this.fotoPerfilAlt = '';
    this.mostrarNotificacion("Foto de perfil eliminada", "success");
  }

  eliminarFotoPortada(): void {
    this.EditarUsuarioForm.patchValue({
      fotoPortadaUrl: '',
      fotoPortadaAlt: ''
    });
    this.fotoPortadaUrl = '';
    this.fotoPortadaAlt = '';
    this.mostrarNotificacion("Foto de portada eliminada", "success");
  }

  onFileSelected(event: any, tipo: 'perfil' | 'portada'): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.mostrarNotificacion("La imagen es demasiado grande. Máximo 5MB", "error");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (tipo === 'perfil') {
          this.EditarUsuarioForm.patchValue({
            fotoPerfilUrl: e.target.result
          });
          this.mostrarNotificacion("Foto de perfil cargada correctamente", "success");
        } else {
          this.EditarUsuarioForm.patchValue({
            fotoPortadaUrl: e.target.result
          });
          this.mostrarNotificacion("Foto de portada cargada correctamente", "success");
        }
      };
      reader.readAsDataURL(file);
    }
  }
}
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../Modelo/usuario';
import { UsuarioService } from '../../Servicio/usuario.service';
import { Router } from '@angular/router';
import { Imagen } from '../../Modelo/imagen';
import { ImagenUploadService } from '../../Servicio/imagen-upload.service'; // ✅ IMPORTAR SERVICIO

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
  
  // ✅ NUEVAS VARIABLES PARA UPLOAD DE IMÁGENES
  imagenPerfilSubiendo = false;
  imagenPortadaSubiendo = false;
  imagenPerfilPreview: string | null = null;
  imagenPortadaPreview: string | null = null;
  imagenPerfilFile: File | null = null;
  imagenPortadaFile: File | null = null;
  
  usuarioOriginal: Usuario | null = null;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private usuarioService: UsuarioService,
    private imagenUploadService: ImagenUploadService // ✅ INYECTAR SERVICIO
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
      fotoPortadaAlt: ['']
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
          
          // ✅ CARGAR PREVIEW DE IMÁGENES EXISTENTES
          this.imagenPerfilPreview = usuario.fotoPerfil?.url || null;
          this.imagenPortadaPreview = usuario.fotoPortada?.url || null;
          
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
            fotoPortadaAlt: usuario.fotoPortada?.alt || ''
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

  // ✅ MÉTODO: Manejar selección de archivo para foto de perfil
  onFileSelectedPerfil(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      if (!file.type.startsWith('image/')) {
        this.mostrarNotificacion('Por favor selecciona una imagen válida', 'error');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.mostrarNotificacion('La imagen no puede superar los 5MB', 'error');
        return;
      }
      
      this.imagenPerfilFile = file;
      
      // Mostrar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPerfilPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      // Subir automáticamente
      this.subirImagenPerfil(file);
    }
  }

  // ✅ MÉTODO: Subir imagen de perfil a ImageKit
  subirImagenPerfil(file: File): void {
    this.imagenPerfilSubiendo = true;
    
    this.imagenUploadService.uploadImage(file).subscribe({
      next: (imagen: Imagen) => {
        this.imagenPerfilSubiendo = false;
        
        // Actualizar el formulario con la URL de la imagen
        this.EditarUsuarioForm.patchValue({
          fotoPerfilUrl: imagen.url,
          fotoPerfilAlt: imagen.alt || file.name
        });
        
        this.fotoPerfilUrl = imagen.url;
        this.fotoPerfilAlt = imagen.alt || file.name;
        
        this.mostrarNotificacion('✅ Foto de perfil subida exitosamente', 'success');
      },
      error: (err) => {
        this.imagenPerfilSubiendo = false;
        console.error('Error al subir imagen de perfil:', err);
        this.mostrarNotificacion('❌ Error al subir la foto de perfil', 'error');
      }
    });
  }

  // ✅ MÉTODO: Eliminar foto de perfil seleccionada
  eliminarFotoPerfil(): void {
    this.imagenPerfilPreview = null;
    this.imagenPerfilFile = null;
    this.fotoPerfilUrl = '';
    this.fotoPerfilAlt = '';
    this.EditarUsuarioForm.patchValue({
      fotoPerfilUrl: '',
      fotoPerfilAlt: ''
    });
    this.mostrarNotificacion('Foto de perfil eliminada', 'success');
  }

  // ✅ MÉTODO: Manejar selección de archivo para foto de portada
  onFileSelectedPortada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      if (!file.type.startsWith('image/')) {
        this.mostrarNotificacion('Por favor selecciona una imagen válida', 'error');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.mostrarNotificacion('La imagen no puede superar los 5MB', 'error');
        return;
      }
      
      this.imagenPortadaFile = file;
      
      // Mostrar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPortadaPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      // Subir automáticamente
      this.subirImagenPortada(file);
    }
  }

  // ✅ MÉTODO: Subir imagen de portada a ImageKit
  subirImagenPortada(file: File): void {
    this.imagenPortadaSubiendo = true;
    
    this.imagenUploadService.uploadImage(file).subscribe({
      next: (imagen: Imagen) => {
        this.imagenPortadaSubiendo = false;
        
        // Actualizar el formulario con la URL de la imagen
        this.EditarUsuarioForm.patchValue({
          fotoPortadaUrl: imagen.url,
          fotoPortadaAlt: imagen.alt || file.name
        });
        
        this.fotoPortadaUrl = imagen.url;
        this.fotoPortadaAlt = imagen.alt || file.name;
        
        this.mostrarNotificacion('✅ Foto de portada subida exitosamente', 'success');
      },
      error: (err) => {
        this.imagenPortadaSubiendo = false;
        console.error('Error al subir imagen de portada:', err);
        this.mostrarNotificacion('❌ Error al subir la foto de portada', 'error');
      }
    });
  }

  // ✅ MÉTODO: Eliminar foto de portada seleccionada
  eliminarFotoPortada(): void {
    this.imagenPortadaPreview = null;
    this.imagenPortadaFile = null;
    this.fotoPortadaUrl = '';
    this.fotoPortadaAlt = '';
    this.EditarUsuarioForm.patchValue({
      fotoPortadaUrl: '',
      fotoPortadaAlt: ''
    });
    this.mostrarNotificacion('Foto de portada eliminada', 'success');
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
        fotoPortada: fotoPortada
      };

      this.usuarioService.updateUsuario(this.usuarioId, usuarioActualizado).subscribe({
        next: (res) => { 
          console.log('Usuario actualizado correctamente', res);
          this.editable = false;
          
          this.fotoPerfilUrl = res.fotoPerfil?.url || '';
          this.fotoPerfilAlt = res.fotoPerfil?.alt || '';
          this.fotoPortadaUrl = res.fotoPortada?.url || '';
          this.fotoPortadaAlt = res.fotoPortada?.alt || '';
          
          this.imagenPerfilPreview = res.fotoPerfil?.url || null;
          this.imagenPortadaPreview = res.fotoPortada?.url || null;
          
          this.usuarioOriginal = { ...res };
          localStorage.setItem('username', res.username);
          
          this.EditarUsuarioForm.patchValue({
            password: '',
            repeatpassword: ''
          });
          
          this.mostrarNotificacion("✅ ¡Perfil actualizado correctamente!", "success");
          
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
}
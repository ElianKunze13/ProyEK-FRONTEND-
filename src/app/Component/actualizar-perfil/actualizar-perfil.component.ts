import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../Modelo/usuario';
import { UsuarioService } from '../../Servicio/usuario.service';
import { Role } from '../../Modelo/Enums/role';
import { Router } from '@angular/router';
import { Imagen } from '../../Modelo/imagen';

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
      fotoPortadaAlt: ['']
    });

    this.cargarUsuario();
  }

  // Método para mostrar notificaciones
  mostrarNotificacion(mensaje: string, tipo: 'success' | 'error'): void {
    // Limpiar timeout anterior si existe
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }
    
    this.notificationMessage = mensaje;
    this.notificationType = tipo;
    this.showNotification = true;
    
    // Auto-ocultar después de 4 segundos
    this.notificationTimeout = setTimeout(() => {
      this.showNotification = false;
    }, 4000);
  }

  // Método para cerrar notificación manualmente
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
          
          // Cargar imagen de perfil si existe
          this.fotoPerfilUrl = usuario.fotoPerfil?.url || '';
          this.fotoPerfilAlt = usuario.fotoPerfil?.alt || '';
          
          // Cargar imagen de portada si existe
          this.fotoPortadaUrl = usuario.fotoPortada?.url || '';
          this.fotoPortadaAlt = usuario.fotoPortada?.alt || '';
          
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
    // Limpiar notificaciones al activar edición
    this.cerrarNotificacion();
    this.loginError = "";
  }

  cancelarEdicion(): void {
    this.editable = false;
    this.cargarUsuario(); // Recargar datos originales
    this.cerrarNotificacion();
    this.loginError = "";
  }

  guardarCambios(): void {
    if (this.EditarUsuarioForm.valid) {
      this.loginError = "";
      this.cerrarNotificacion();

      // Validar contraseñas
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
          
          // Actualizar las imágenes mostradas con los nuevos valores
          this.fotoPerfilUrl = res.fotoPerfil?.url || '';
          this.fotoPerfilAlt = res.fotoPerfil?.alt || '';
          this.fotoPortadaUrl = res.fotoPortada?.url || '';
          this.fotoPortadaAlt = res.fotoPortada?.alt || '';
          
          // Actualizar el usuario original con los nuevos datos
          this.usuarioOriginal = { ...res };
          
          // Actualizar en localStorage si es necesario
          localStorage.setItem('username', res.username);
          
          // Limpiar campos de contraseña del formulario
          this.EditarUsuarioForm.patchValue({
            password: '',
            repeatpassword: ''
          });
          
          // Mostrar mensaje de éxito
          this.mostrarNotificacion("✅ ¡Perfil actualizado correctamente!", "success");
          
          // Opcional: Recargar datos después de 2 segundos
          setTimeout(() => {
            this.cargarUsuario();
          }, 2000);
        },
        error: (err) => {
          console.error('Error actualizando usuario:', err);
          
          let errorMessage = '';
          
          // Manejar errores específicos
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
          
          // Mostrar mensaje de error
          this.mostrarNotificacion(`❌ ${errorMessage}`, "error");
        }
      });
    } else {
      this.loginError = "Por favor completa todos los campos correctamente.";
      this.mostrarNotificacion("Por favor completa todos los campos correctamente", "error");
      
      // Marcar todos los campos como tocados
      Object.keys(this.EditarUsuarioForm.controls).forEach(key => {
        const control = this.EditarUsuarioForm.get(key);
        if (control && control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  // Método auxiliar para eliminar imagen de perfil
  eliminarFotoPerfil(): void {
    this.EditarUsuarioForm.patchValue({
      fotoPerfilUrl: '',
      fotoPerfilAlt: ''
    });
    this.fotoPerfilUrl = '';
    this.fotoPerfilAlt = '';
    this.mostrarNotificacion("Foto de perfil eliminada", "success");
  }

  // Método auxiliar para eliminar imagen de portada
  eliminarFotoPortada(): void {
    this.EditarUsuarioForm.patchValue({
      fotoPortadaUrl: '',
      fotoPortadaAlt: ''
    });
    this.fotoPortadaUrl = '';
    this.fotoPortadaAlt = '';
    this.mostrarNotificacion("Foto de portada eliminada", "success");
  }

  // Método para previsualizar imagen
  onFileSelected(event: any, tipo: 'perfil' | 'portada'): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB límite
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
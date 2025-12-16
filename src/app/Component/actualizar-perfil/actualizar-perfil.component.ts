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
export class ActualizarPerfilComponent implements OnInit{
 /*EditarUsuarioForm!: FormGroup;
  editable: boolean = false; // creo la variable editable en false
  loginError: string = "";
  usuarioId: number | undefined;

  constructor(private fb: FormBuilder, private router: Router, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.EditarUsuarioForm = this.fb.group( {
      nombre: ['', Validators.required],
      username: ['', [Validators.required, Validators.email]],
      introduccion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
      descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeatpassword: ['', [Validators.required, Validators.minLength(8)]],
    });

    const username = localStorage.getItem('username');
    if (username) {
      this.usuarioService.getByUsername(username).subscribe(usuario => {
        if (usuario) {
          this.usuarioId = usuario.id;
          this.EditarUsuarioForm.patchValue({
            nombre: usuario.nombre,
            username: usuario.username,
           introduccion: usuario.introduccion,
           descripcion: usuario.descripcion,
           password: usuario.password
          });
        }
      });
    }
  }

  get repeatpassword() {
    return this.EditarUsuarioForm.controls['repeatpassword'];
  }

  getInicialUsuario(): string {
    const nombre = this.EditarUsuarioForm.get('username')?.value;
    return nombre ? nombre.charAt(0).toUpperCase() : 'U';
  }


    getEmail(): string {
    const nombre = this.EditarUsuarioForm.get('email')?.value;
    return nombre ? nombre.charAt(0).toUpperCase() : ' ';
  }

  activarEdicion() {
    this.editable = true;
  }

  cancelarEdicion() {
    this.editable = false;
    const username = localStorage.getItem('username');
    if (username) {
      this.usuarioService.getByUsername(username).subscribe(usuario => {
        if (usuario) {
          this.EditarUsuarioForm.patchValue({
            nombre: usuario.nombre,
            username: usuario.username,
            introduccion: usuario.introduccion,
            descripcion: usuario.descripcion,
            password: usuario.password,
            repeatpassword: usuario.password
          });
        }
      });
    }
  }



 guardarCambios() {
  if (this.EditarUsuarioForm.valid) {
    this.loginError = "";

    if (this.EditarUsuarioForm.value.password !== this.EditarUsuarioForm.value.repeatpassword) { 
      this.loginError = "Las contraseñas no coinciden";
      return;
    }

    // Obtener el usuario actual primero para preservar datos no editados
    const username = localStorage.getItem('username');
    if (username) {
      this.usuarioService.getByUsername(username).subscribe(usuarioActual => {
        if (usuarioActual) {
          const usuarioActualizado: Usuario = {
            id: this.usuarioId,
            nombre: this.EditarUsuarioForm.value.nombre,
            username: this.EditarUsuarioForm.value.username, // CORRECCIÓN: usar username, no email
            password: this.EditarUsuarioForm.value.password,
            rol: usuarioActual.rol, // Preservar el rol original
            active: true,
            introduccion: this.EditarUsuarioForm.value.introduccion || '', // Usar valor del formulario
            descripcion: this.EditarUsuarioForm.value.descripcion || '', // Usar valor del formulario
            fotoUsuario: usuarioActual.fotoUsuario || [] // Preservar fotos
          };

          this.usuarioService.save(usuarioActualizado).subscribe({
            next: res => { 
              console.log('Usuario actualizado', res);
              this.editable = false;
            },
            error: err => {
              console.error('Error actualizando usuario:', err);
              // Mostrar mensajes de validación específicos
              if (err.error) {
                this.loginError = Object.values(err.error).join(', ');
              } else {
                this.loginError = 'Error al guardar los cambios';
              }
            }
          });
        }
      });
    }
  } else {
    this.loginError = "Por favor completa todos los campos correctamente.";
    // Marcar todos los campos como tocados para mostrar errores
    Object.keys(this.EditarUsuarioForm.controls).forEach(key => {
      this.EditarUsuarioForm.get(key)?.markAsTouched();
    });
  }
}*/
 EditarUsuarioForm!: FormGroup;
  editable: boolean = false;
  loginError: string = "";
  usuarioId: number | undefined;
  imagenUrl: string = '';
  imagenAlt: string = '';
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
      imagenUrl: [''],
      imagenAlt: ['']
    });

    this.cargarUsuario();
  }

  cargarUsuario(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.usuarioService.getByUsername(username).subscribe(usuario => {
        if (usuario) {
          this.usuarioId = usuario.id;
          this.usuarioOriginal = usuario;
          
          // Obtener la primera imagen si existe
          const primeraImagen = usuario.fotoUsuario && usuario.fotoUsuario.length > 0 
            ? usuario.fotoUsuario[0] 
            : null;
          
          this.imagenUrl = primeraImagen?.url || '';
          this.imagenAlt = primeraImagen?.alt || '';
          
          this.EditarUsuarioForm.patchValue({
            nombre: usuario.nombre,
            username: usuario.username,
            introduccion: usuario.introduccion,
            descripcion: usuario.descripcion,
            password: usuario.password,
            repeatpassword: usuario.password,
            imagenUrl: primeraImagen?.url || '',
            imagenAlt: primeraImagen?.alt || ''
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
  }

  cancelarEdicion(): void {
    this.editable = false;
    this.cargarUsuario(); // Recargar datos originales
  }

  guardarCambios(): void {
    if (this.EditarUsuarioForm.valid) {
      this.loginError = "";

      // Validar contraseñas
      if (this.EditarUsuarioForm.value.password !== this.EditarUsuarioForm.value.repeatpassword) { 
        this.loginError = "Las contraseñas no coinciden";
        return;
      }

      if (!this.usuarioId || !this.usuarioOriginal) {
        this.loginError = "No se pudo identificar al usuario";
        return;
      }

      // Preparar array de imágenes
      const fotoUsuario: Imagen[] = [];
      const imagenUrl = this.EditarUsuarioForm.value.imagenUrl;
      const imagenAlt = this.EditarUsuarioForm.value.imagenAlt;

      if (imagenUrl) {
        fotoUsuario.push({
          url: imagenUrl,
          alt: imagenAlt || 'Foto de perfil'
        });
      }

      // Si hay imágenes existentes y no queremos eliminarlas, las mantenemos
      const imagenesActualizadas = fotoUsuario.length > 0 
        ? fotoUsuario 
        : this.usuarioOriginal.fotoUsuario || [];

      const usuarioActualizado: Usuario = {
        id: this.usuarioId,
        nombre: this.EditarUsuarioForm.value.nombre,
        username: this.EditarUsuarioForm.value.username,
        password: this.EditarUsuarioForm.value.password,
        rol: this.usuarioOriginal.rol,
        active: true,
        introduccion: this.EditarUsuarioForm.value.introduccion || '',
        descripcion: this.EditarUsuarioForm.value.descripcion || '',
        fotoUsuario: imagenesActualizadas
      };

      
      this.usuarioService.updateUsuario(this.usuarioId, usuarioActualizado).subscribe({
        next: (res) => { 
          console.log('Usuario actualizado correctamente', res);
          this.editable = false;
          
          // Actualizar la imagen mostrada
          const primeraImagen = res.fotoUsuario && res.fotoUsuario.length > 0 
            ? res.fotoUsuario[0] 
            : null;
          this.imagenUrl = primeraImagen?.url || '';
          this.imagenAlt = primeraImagen?.alt || '';
          
          // Actualizar en localStorage si es necesario
          localStorage.setItem('username', res.username);
          
          // Opcional: navegar a perfil
          // this.router.navigateByUrl('/perfilUsuario');
        },
        error: (err) => {
          console.error('Error actualizando usuario:', err);
          
          // Manejar errores específicos
          if (err.status === 400 && err.error) {
            const errores = [];
            for (const key in err.error) {
              if (err.error.hasOwnProperty(key)) {
                errores.push(`${key}: ${err.error[key]}`);
              }
            }
            this.loginError = errores.join(', ');
          } else if (err.error && err.error.message) {
            this.loginError = err.error.message;
          } else {
            this.loginError = 'Error al guardar los cambios. Intente nuevamente.';
          }
        }
      });
    } else {
      this.loginError = "Por favor completa todos los campos correctamente.";
      // Marcar todos los campos como tocados
      Object.keys(this.EditarUsuarioForm.controls).forEach(key => {
        const control = this.EditarUsuarioForm.get(key);
        if (control && control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

}

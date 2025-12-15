import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../Modelo/usuario';
import { UsuarioService } from '../../Servicio/usuario.service';
import { Role } from '../../Modelo/Enums/role';
import { Router } from '@angular/router';

@Component({
  selector: 'app-actualizar-perfil',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './actualizar-perfil.component.html',
  styleUrl: './actualizar-perfil.component.css'
})
export class ActualizarPerfilComponent implements OnInit{
 EditarUsuarioForm!: FormGroup;
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


/*
  guardarCambios() {
    if (this.EditarUsuarioForm.valid) {
      this.loginError = "";

      if (this.EditarUsuarioForm.value.password !== this.EditarUsuarioForm.value.repeatpassword) { 
        this.loginError = "Las contraseñas no coinciden";
        return;
      }

      const usuario: Usuario = {
        id: this.usuarioId,
        nombre: this.EditarUsuarioForm.value.nombre,
        username: this.EditarUsuarioForm.value.email,
        password: this.EditarUsuarioForm.value.password,
        rol: Role.ADMIN,
        active: true,
        introduccion: '',
        descripcion: '',
        fotoUsuario: []
      };

      this.usuarioService.save(usuario).subscribe({
        next: res => { 
          console.log('Usuario actualizado', res);
          this.editable = false;
          this.router.navigateByUrl('/perfilUsuario');
        },
        error: err => {
          console.error(err);
          this.loginError = err;
        }
      });
    } else {
      this.loginError = "Por favor completa todos los campos correctamente.";
    }
  }*/
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
}
}

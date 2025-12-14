import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse, MensajeService } from '../../Servicio/mensaje.service';
import { Mensaje } from '../../Modelo/mensaje';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacto',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent implements OnInit{
/*contactoForm: FormGroup;
  enviando = false;
  mensajeExito = false;
  mensajeError = false;

   constructor(private fb: FormBuilder,private mensajeService: MensajeService
  ) {
    this.contactoForm = this.fb.group({
      nombreUsuario: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      mensaje: ['', [Validators.required, Validators.maxLength(300)]]
    });
  }


 ngOnInit() {
    // Agregar animación de entrada cuando se carga el componente
    setTimeout(() => {
      const mainPage = document.getElementById('main-page');
      if (mainPage) {
        mainPage.classList.add('slide-left-enter');
      }
    }, 50); // Pequeño delay para que Angular renderice primero
  }
  
onSubmit(): void {
    if (this.contactoForm.valid) {
      this.enviando = true;
      const mensaje: Mensaje = this.contactoForm.value;

      this.mensajeService.enviarMensaje(mensaje).subscribe({
        next: (response) => {
          this.enviando = false;
          this.mensajeExito = true;
          this.contactoForm.reset();
          
          // Ocultar mensaje de éxito después de 5 segundos
          setTimeout(() => {
            this.mensajeExito = false;
          }, 5000);
        },
        error: (error) => {
          this.enviando = false;
          this.mensajeError = true;
          console.error('Error al enviar mensaje:', error);
          
          setTimeout(() => {
            this.mensajeError = false;
          }, 5000);
        }
      });
    }
  }*/

 contactoForm: FormGroup;
  enviando = false;
  mensajeExito = false;
  mensajeError = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private mensajeService: MensajeService
  ) {
    this.contactoForm = this.fb.group({
      nombreUsuario: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      mensaje: ['', [Validators.required, Validators.maxLength(300)]]
    });
  }

 ngOnInit() {
    // Agregar animación de entrada cuando se carga el componente
    setTimeout(() => {
      const mainPage = document.getElementById('main-page');
      if (mainPage) {
        mainPage.classList.add('slide-left-enter');
      }
    }, 50); // Pequeño delay para que Angular renderice primero
  }
  
  onSubmit(): void {
    if (this.contactoForm.valid) {
      this.enviando = true;
      this.mensajeExito = false;
      this.mensajeError = false;
      
      const mensaje: Mensaje = this.contactoForm.value;

      this.mensajeService.enviarMensaje(mensaje).subscribe({
        next: (response: ApiResponse) => {
          this.enviando = false;
          
          if (response.estado === 'success') {
            this.mensajeExito = true;
            this.contactoForm.reset();
            
            // Ocultar mensaje de éxito después de 5 segundos
            setTimeout(() => {
              this.mensajeExito = false;
            }, 5000);
          } else {
            this.mensajeError = true;
            this.errorMessage = response.mensaje;
            
            setTimeout(() => {
              this.mensajeError = false;
            }, 5000);
          }
        },
        error: (error) => {
          this.enviando = false;
          this.mensajeError = true;
          this.errorMessage = 'Error de conexión con el servidor';
          console.error('Error al enviar mensaje:', error);
          
          setTimeout(() => {
            this.mensajeError = false;
          }, 5000);
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.contactoForm.controls).forEach(key => {
        const control = this.contactoForm.get(key);
        control?.markAsTouched();
      });
    }
  }

}

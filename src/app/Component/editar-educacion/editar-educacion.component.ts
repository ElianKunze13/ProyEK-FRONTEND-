import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Educacion } from '../../Modelo/educacion';
import { EducacionService } from '../../Servicio/educacion.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Imagen } from '../../Modelo/imagen';
import { TipoEducacion } from '../../Modelo/Enums/tipoEducacion';

@Component({
  selector: 'app-editar-educacion',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-educacion.component.html',
  styleUrl: './editar-educacion.component.css'
})
export class EditarEducacionComponent implements OnInit {
  expandedIndex: number | null = null;
  educaciones: Educacion[] = [];
  
  // Formulario para crear nueva educación
  educacionForm!: FormGroup;
  
  // Formulario para editar educación existente
  editarEducacionForm!: FormGroup;
  
  // Variables para la educación que se está editando
  educacionEditada: Educacion = {
    id: 0,
    titulo: '',
    descripcion: '',
    tipoEducacion: TipoEducacion.OTROS,
    imagenes: []
  };
  
  // Variables para la educación a eliminar
  educacionAEliminar: Educacion | null = null;
  
  // Variables de estado
  guardando: boolean = false;
  actualizando: boolean = false;
  eliminando: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  mensaje: string = '';
  mensajeTipo: 'success' | 'error' | 'info' = 'info';
  
  // Controla si el modal está visible
  mostrarModal: boolean = false;
  mostrarModalConfirmacion: boolean = false;

  constructor(
    private educacionService: EducacionService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.inicializarFormularios();
    this.cargarEducaciones();
  }

  inicializarFormularios(): void {
    // Formulario para crear nueva educación
    this.educacionForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      tipoEducacion: ['', Validators.required],
      imagenUrl: [''],
      imagenAlt: ['']
    });

    // Formulario para editar educación
    this.editarEducacionForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      tipoEducacion: ['', Validators.required],
      imagenUrl: [''],
      imagenAlt: ['']
    });
  }

  cargarEducaciones(): void {
    this.educacionService.findAll().subscribe({
      next: (data: Educacion[]) => {
        console.log('✅ Datos recibidos:', data);
        this.educaciones = data;
      },
      error: (error) => {
        console.error('Error al cargar lista:', error);
        this.educaciones = [];
        this.errorMessage = 'Error al cargar las educaciones';
      }
    });
  }

  guardarEducacion(): void {
    if (this.educacionForm.invalid) {
      Object.keys(this.educacionForm.controls).forEach(key => {
        const control = this.educacionForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.guardando = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Preparar array de imágenes
    const imagenes: Imagen[] = [];
    const imagenUrl = this.educacionForm.value.imagenUrl;
    const imagenAlt = this.educacionForm.value.imagenAlt;

    if (imagenUrl) {
      imagenes.push({
        url: imagenUrl,
        alt: imagenAlt || 'Imagen de educación'
      });
    }

    // Crear objeto Educacion
    const nuevaEducacion: Educacion = {
      id: null,
      titulo: this.educacionForm.value.titulo,
      descripcion: this.educacionForm.value.descripcion,
      tipoEducacion: this.educacionForm.value.tipoEducacion as TipoEducacion,
      imagenes: imagenes
    };

    this.educacionService.save(nuevaEducacion).subscribe({
      next: (educacionCreada) => {
        console.log('✅ Educación creada exitosamente:', educacionCreada);
        
        this.successMessage = 'Educación creada exitosamente';
        this.guardando = false;
        
        this.educaciones.unshift(educacionCreada);
        this.educacionForm.reset();
        
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (error) => {
        console.error('❌ Error al crear educación:', error);
        this.guardando = false;
        this.errorMessage = 'Error al guardar la educación. Intente nuevamente.';
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 10000);
      }
    });
  }

  cargarEducacionParaEditar(educacion: Educacion): void {
    console.log('Cargando educación para editar:', educacion);
    
    this.educacionEditada = {
      ...educacion
    };

    // Obtener la primera imagen si existe
    const primeraImagen = educacion.imagenes && educacion.imagenes.length > 0 
      ? educacion.imagenes[0] 
      : { url: '', alt: '' };

    // Actualizar el formulario con los datos
    this.editarEducacionForm.patchValue({
      titulo: educacion.titulo,
      descripcion: educacion.descripcion,
      tipoEducacion: educacion.tipoEducacion,
      imagenUrl: primeraImagen.url,
      imagenAlt: primeraImagen.alt
    });

    this.mensaje = `Editando: "${educacion.titulo}"`;
    this.mensajeTipo = 'info';
    
    // Mostrar el modal
    this.mostrarModal = true;
    
    // Desplazar la página hacia arriba si es necesario
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  actualizarEducacion(): void {
    if (this.editarEducacionForm.invalid) {
      // Marcar todos los campos como tocados
      Object.keys(this.editarEducacionForm.controls).forEach(key => {
        const control = this.editarEducacionForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      this.mostrarMensaje('Por favor completa todos los campos correctamente', 'error');
      return;
    }

    if (!this.educacionEditada.id) {
      this.mostrarMensaje('No hay educación seleccionada para editar', 'error');
      return;
    }

    this.actualizando = true;
    this.mensaje = '';

    // Preparar array de imágenes
    const imagenes: Imagen[] = [];
    const imagenUrl = this.editarEducacionForm.value.imagenUrl;
    const imagenAlt = this.editarEducacionForm.value.imagenAlt;

    if (imagenUrl) {
      imagenes.push({
        url: imagenUrl,
        alt: imagenAlt || 'Imagen de educación'
      });
    }

    // Crear objeto Educacion actualizado
    const educacionActualizada: Educacion = {
      id: this.educacionEditada.id,
      titulo: this.editarEducacionForm.value.titulo,
      descripcion: this.editarEducacionForm.value.descripcion,
      tipoEducacion: this.editarEducacionForm.value.tipoEducacion as TipoEducacion,
      imagenes: imagenes
    };

    // Llamar al servicio update
    this.educacionService.updateEducacion(this.educacionEditada.id, educacionActualizada).subscribe({
      next: (educacionActualizadaResp) => {
        console.log('✅ Educación actualizada exitosamente:', educacionActualizadaResp);
        
        this.mostrarMensaje('¡Educación actualizada con éxito!', 'success');
        this.actualizando = false;
        
        // Actualizar la educación en la lista
        const index = this.educaciones.findIndex(e => e.id === this.educacionEditada.id);
        if (index !== -1) {
          this.educaciones[index] = { ...educacionActualizadaResp };
        }
        
        // Cerrar el modal después de 2 segundos
        setTimeout(() => {
          this.cerrarModal();
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Error al actualizar educación:', error);
        this.actualizando = false;
        
        if (error.status === 404) {
          this.mostrarMensaje('Error: No se encontró la educación', 'error');
        } else if (error.status === 400) {
          this.mostrarMensaje('Error: Datos inválidos', 'error');
        } else if (error.status === 401 || error.status === 403) {
          this.mostrarMensaje('No tiene permisos para realizar esta acción', 'error');
        } else {
          this.mostrarMensaje('Error al actualizar la educación. Intente nuevamente.', 'error');
        }
      }
    });
  }

  // Método para confirmar eliminación
  confirmarEliminacion(educacion: Educacion): void {
    console.log('Confirmando eliminación de:', educacion);
    this.educacionAEliminar = educacion;
    this.mostrarModalConfirmacion = true;
  }

  // Método para cancelar eliminación
  cancelarEliminacion(): void {
    this.mostrarModalConfirmacion = false;
    this.educacionAEliminar = null;
    this.eliminando = false;
  }

  // Método para eliminar educación
  eliminarEducacion(): void {
    if (!this.educacionAEliminar || !this.educacionAEliminar.id) {
      this.mostrarMensaje('No hay educación seleccionada para eliminar', 'error');
      return;
    }

    this.eliminando = true;
    const educacionId = this.educacionAEliminar.id;
    const tituloEducacion = this.educacionAEliminar.titulo;

    this.educacionService.delete(educacionId).subscribe({
      next: () => {
        console.log('✅ Educación eliminada exitosamente:', tituloEducacion);
        
        // Remover la educación de la lista
        this.educaciones = this.educaciones.filter(e => e.id !== educacionId);
        
        // Mostrar mensaje de éxito
        this.successMessage = `Educación "${tituloEducacion}" eliminada exitosamente`;
        
        this.eliminando = false;
        this.mostrarModalConfirmacion = false;
        this.educacionAEliminar = null;
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (error) => {
        console.error('❌ Error al eliminar educación:', error);
        this.eliminando = false;
        
        let errorMsg = 'Error al eliminar la educación. Intente nuevamente.';
        
        if (error.status === 404) {
          errorMsg = 'Error: No se encontró la educación a eliminar';
        } else if (error.status === 401 || error.status === 403) {
          errorMsg = 'No tiene permisos para realizar esta acción';
        } else if (error.status === 500) {
          errorMsg = 'Error interno del servidor al eliminar la educación';
        }
        
        this.errorMessage = errorMsg;
        
        // Ocultar mensaje después de 10 segundos
        setTimeout(() => {
          this.errorMessage = '';
        }, 10000);
      }
    });
  }

  // Método para mostrar mensajes
  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error' | 'info'): void {
    this.mensaje = mensaje;
    this.mensajeTipo = tipo;
  }

  // Método para cerrar el modal de edición
  cerrarModal(): void {
    this.mostrarModal = false;
    this.mensaje = '';
    this.editarEducacionForm.reset();
    this.actualizando = false;
  }

  // Métodos auxiliares para acceso a controles
  get titulo() { return this.educacionForm.get('titulo'); }
  get descripcion() { return this.educacionForm.get('descripcion'); }
  get tipoEducacion() { return this.educacionForm.get('tipoEducacion'); }
}
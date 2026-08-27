import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Educacion } from '../../Modelo/educacion';
import { EducacionService } from '../../Servicio/educacion.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Imagen } from '../../Modelo/imagen';
import { TipoEducacion } from '../../Modelo/Enums/tipoEducacion';
import { ImagenUploadService } from '../../Servicio/imagen-upload.service'; // ✅ IMPORTAR SERVICIO

@Component({
  selector: 'app-editar-educacion',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-educacion.component.html',
  styleUrl: './editar-educacion.component.css'
})
export class EditarEducacionComponent implements OnInit {
  educaciones: Educacion[] = [];
  
  // Formulario para crear nueva educación
  educacionForm!: FormGroup;
  
  // Formulario para editar educación existente
  editarEducacionForm!: FormGroup;
  
  // Variables para la educación que se está editando
  educacionEditada: Educacion | null = null;
  
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

  // ✅ VARIABLES PARA UPLOAD DE IMÁGENES
  imagenSubiendo = false;
  imagenSubiendoEditar = false;
  imagenProgreso = 0;
  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;
  imagenPreviewEditar: string | null = null;
  
  // ✅ TIMEOUT PARA PREVIEW
  private previewTimeout: any = null;

  constructor(
    private educacionService: EducacionService,
    private imagenUploadService: ImagenUploadService, // ✅ INYECTAR SERVICIO
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
      fechaInicio: [new Date(), Validators.required],
      fechaObtencion: [new Date(), Validators.required],
      tipoEducacion: ['', Validators.required],
      imagenUrl: [''],
      imagenAlt: ['']
    });

    // Formulario para editar educación
    this.editarEducacionForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      fechaInicio: [new Date(), Validators.required],
      fechaObtencion: [new Date(), Validators.required],
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

  // ✅ MÉTODO: Manejar selección de archivo (para crear)
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validar archivo
      if (!file.type.startsWith('image/')) {
        this.mostrarMensaje('Por favor selecciona una imagen válida', 'error');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.mostrarMensaje('La imagen no puede superar los 5MB', 'error');
        return;
      }
      
      this.imagenSeleccionada = file;
      
      // Mostrar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      // Subir automáticamente
      this.subirImagen(file);
    }
  }

  // ✅ MÉTODO: Subir imagen a ImageKit (para crear)
  subirImagen(file: File): void {
    this.imagenSubiendo = true;
    this.imagenProgreso = 0;
    
    // Simular progreso
    const interval = setInterval(() => {
      if (this.imagenProgreso < 90) {
        this.imagenProgreso += 10;
      }
    }, 200);
    
    this.imagenUploadService.uploadImage(file).subscribe({
      next: (imagen: Imagen) => {
        clearInterval(interval);
        this.imagenProgreso = 100;
        this.imagenSubiendo = false;
        
        // Actualizar el formulario con la URL de la imagen
        this.educacionForm.patchValue({
          imagenUrl: imagen.url,
          imagenAlt: imagen.alt || file.name
        });
        
        this.mostrarMensaje('✅ Imagen subida exitosamente', 'success');
      },
      error: (err) => {
        clearInterval(interval);
        this.imagenSubiendo = false;
        this.imagenProgreso = 0;
        console.error('Error al subir imagen:', err);
        this.mostrarMensaje('❌ Error al subir la imagen: ' + (err.error?.message || err.message), 'error');
      }
    });
  }

  // ✅ MÉTODO: Eliminar imagen seleccionada (para crear)
  eliminarImagenSeleccionada(): void {
    this.imagenPreview = null;
    this.imagenSeleccionada = null;
    this.imagenProgreso = 0;
    this.educacionForm.patchValue({
      imagenUrl: '',
      imagenAlt: ''
    });
  }

  // ✅ MÉTODO: Manejar selección de archivo (para editar)
  onFileSelectedEditar(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      if (!file.type.startsWith('image/')) {
        this.mostrarMensaje('Por favor selecciona una imagen válida', 'error');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.mostrarMensaje('La imagen no puede superar los 5MB', 'error');
        return;
      }
      
      this.imagenSubiendoEditar = true;
      
      // Mostrar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPreviewEditar = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      this.imagenUploadService.uploadImage(file).subscribe({
        next: (imagen: Imagen) => {
          this.imagenSubiendoEditar = false;
          this.editarEducacionForm.patchValue({
            imagenUrl: imagen.url,
            imagenAlt: imagen.alt || file.name
          });
          
          this.mostrarMensaje('✅ Imagen actualizada exitosamente', 'success');
        },
        error: (err) => {
          this.imagenSubiendoEditar = false;
          console.error('Error al subir imagen:', err);
          this.mostrarMensaje('❌ Error al subir la imagen: ' + (err.error?.message || err.message), 'error');
        }
      });
    }
  }

  // ✅ MÉTODO: Eliminar imagen en edición
  eliminarImagenEditar(): void {
    this.imagenPreviewEditar = null;
    this.editarEducacionForm.patchValue({
      imagenUrl: '',
      imagenAlt: ''
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

    // Preparar imagen
    let imagen: Imagen | undefined = undefined;
    const imagenUrl = this.educacionForm.value.imagenUrl;
    const imagenAlt = this.educacionForm.value.imagenAlt;

    if (imagenUrl) {
      imagen = {
        url: imagenUrl,
        alt: imagenAlt || 'Imagen de educación'
      };
    }

    // Crear objeto Educacion
    const nuevaEducacion: Educacion = {
      id: null,
      titulo: this.educacionForm.value.titulo,
      fechaInicio: this.educacionForm.value.fechaInicio,
      fechaObtencion: this.educacionForm.value.fechaObtencion,
      descripcion: this.educacionForm.value.descripcion,
      tipoEducacion: this.educacionForm.value.tipoEducacion as TipoEducacion,
      imagen: imagen
    };

    this.educacionService.save(nuevaEducacion).subscribe({
      next: (educacionCreada) => {
        console.log('✅ Educación creada exitosamente:', educacionCreada);
        
        this.successMessage = 'Educación creada exitosamente';
        this.guardando = false;
        
        this.educaciones.unshift(educacionCreada);
        this.educacionForm.reset();
        this.imagenPreview = null;
        this.imagenSeleccionada = null;
        this.imagenProgreso = 0;
        
        // Recargar lista
        setTimeout(() => {
          this.cargarEducaciones();
        }, 500);
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
    
    this.educacionEditada = { ...educacion };

    // Obtener la imagen si existe
    const imagen = educacion.imagen;

    // Asegurarse de que las fechas sean objetos Date válidos
    const fechaInicio = educacion.fechaInicio ? new Date(educacion.fechaInicio) : new Date();
    const fechaObtencion = educacion.fechaObtencion ? new Date(educacion.fechaObtencion) : new Date();

    // Actualizar el formulario con los datos
    this.editarEducacionForm.patchValue({
      titulo: educacion.titulo || '',
      descripcion: educacion.descripcion || '',
      fechaInicio: fechaInicio,
      fechaObtencion: fechaObtencion,
      tipoEducacion: educacion.tipoEducacion || '',
      imagenUrl: imagen?.url || '',
      imagenAlt: imagen?.alt || ''
    });

    // Mostrar preview de la imagen existente
    if (imagen?.url) {
      this.imagenPreviewEditar = imagen.url;
    } else {
      this.imagenPreviewEditar = null;
    }

    // Marcar todos los campos como "touched" para mostrar validaciones si es necesario
    Object.keys(this.editarEducacionForm.controls).forEach(key => {
      const control = this.editarEducacionForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });

    this.mensaje = `Editando: "${educacion.titulo}"`;
    this.mensajeTipo = 'info';
    
    // Mostrar el modal
    this.mostrarModal = true;
  }

  actualizarEducacion(): void {
    console.log('=== INICIANDO ACTUALIZACIÓN ===');
    console.log('Formulario válido:', this.editarEducacionForm.valid);
    console.log('Valores del formulario:', this.editarEducacionForm.value);
    
    if (this.editarEducacionForm.invalid) {
      Object.keys(this.editarEducacionForm.controls).forEach(key => {
        const control = this.editarEducacionForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      this.mostrarMensaje('Por favor completa todos los campos correctamente', 'error');
      return;
    }

    if (!this.educacionEditada?.id) {
      this.mostrarMensaje('No hay educación seleccionada para editar', 'error');
      return;
    }

    this.actualizando = true;
    this.mensaje = '';

    // Preparar imagen
    let imagen: Imagen | undefined = undefined;
    const imagenUrl = this.editarEducacionForm.value.imagenUrl;
    const imagenAlt = this.editarEducacionForm.value.imagenAlt;

    if (imagenUrl) {
      imagen = {
        url: imagenUrl,
        alt: imagenAlt || 'Imagen de educación'
      };
    }

    // Crear objeto Educacion actualizado
    const educacionActualizada: Educacion = {
      id: this.educacionEditada.id,
      titulo: this.editarEducacionForm.value.titulo,
      descripcion: this.editarEducacionForm.value.descripcion,
      fechaInicio: this.editarEducacionForm.value.fechaInicio,
      fechaObtencion: this.editarEducacionForm.value.fechaObtencion,
      tipoEducacion: this.editarEducacionForm.value.tipoEducacion as TipoEducacion,
      imagen: imagen
    };
    
    console.log('Objeto a actualizar:', educacionActualizada);

    this.educacionService.updateEducacion(this.educacionEditada.id, educacionActualizada).subscribe({
      next: (educacionActualizadaResp) => {
        console.log('✅ Educación actualizada exitosamente:', educacionActualizadaResp);
        
        this.mostrarMensaje('¡Educación actualizada con éxito!', 'success');
        this.actualizando = false;
        
        // Actualizar la educación en la lista
        const index = this.educaciones.findIndex(e => e.id === this.educacionEditada?.id);
        if (index !== -1) {
          this.educaciones[index] = { ...educacionActualizadaResp };
          this.educaciones = [...this.educaciones]; // Forzar actualización de vista
        }
        
        // Cerrar el modal después de 2 segundos
        setTimeout(() => {
          this.cerrarModal();
          this.cargarEducaciones(); // Recargar lista completa
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Error al actualizar educación:', error);
        this.actualizando = false;
        
        if (error.status === 404) {
          this.mostrarMensaje('Error: No se encontró la educación', 'error');
        } else if (error.status === 400) {
          this.mostrarMensaje('Error: Datos inválidos. Verifica los campos.', 'error');
        } else if (error.status === 401 || error.status === 403) {
          this.mostrarMensaje('No tiene permisos para realizar esta acción', 'error');
        } else {
          this.mostrarMensaje('Error al actualizar la educación. Intente nuevamente.', 'error');
        }
      }
    });
  }

  confirmarEliminacion(educacion: Educacion): void {
    console.log('Confirmando eliminación de:', educacion);
    this.educacionAEliminar = educacion;
    this.mostrarModalConfirmacion = true;
  }

  cancelarEliminacion(): void {
    this.mostrarModalConfirmacion = false;
    this.educacionAEliminar = null;
    this.eliminando = false;
  }

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
        
        this.educaciones = this.educaciones.filter(e => e.id !== educacionId);
        
        this.successMessage = `Educación "${tituloEducacion}" eliminada exitosamente`;
        
        this.eliminando = false;
        this.mostrarModalConfirmacion = false;
        this.educacionAEliminar = null;
        
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
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 10000);
      }
    });
  }

  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error' | 'info'): void {
    this.mensaje = mensaje;
    this.mensajeTipo = tipo;
    
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => {
      if (this.mensaje === mensaje) {
        this.mensaje = '';
      }
    }, 5000);
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.mensaje = '';
    this.editarEducacionForm.reset();
    this.actualizando = false;
    this.imagenPreviewEditar = null;
    this.imagenSubiendoEditar = false;
  }

  // Métodos auxiliares para acceso a controles
  get titulo() { return this.educacionForm.get('titulo'); }
  get descripcion() { return this.educacionForm.get('descripcion'); }
  get tipoEducacion() { return this.educacionForm.get('tipoEducacion'); }
}
import { Component, OnInit } from '@angular/core';
import { Conocimiento } from '../../Modelo/conocimiento';
import { ConocimientoService } from '../../Servicio/conocimiento.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoConocimiento } from '../../Modelo/Enums/tipoConocimiento';
import { Nivel } from '../../Modelo/Enums/nivel';
import { Imagen } from '../../Modelo/imagen';
import { ImagenUploadService } from '../../Servicio/imagen-upload.service'; // ✅ IMPORTAR SERVICIO

@Component({
  selector: 'app-editar-herramientas',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-herramientas.component.html',
  styleUrl: './editar-herramientas.component.css'
})

export class EditarHerramientasComponent implements OnInit {
  conocimientos: Conocimiento[] = [];
  
  // Formulario para crear nuevo conocimiento
  conocimientoForm!: FormGroup;
  
  // Formulario para editar conocimiento existente
  editarConocimientoForm!: FormGroup;
  
  // Variables para el conocimiento que se está editando
  conocimientoEditado: Conocimiento | null = null;
  
  // Variables para el conocimiento a eliminar
  conocimientoAEliminar: Conocimiento | null = null;
  
  // Variables de estado
  guardando: boolean = false;
  actualizando: boolean = false;
  eliminando: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  mensaje: string = '';
  mensajeTipo: 'success' | 'error' | 'info' = 'info';
  
  // Controla si los modales están visibles
  mostrarModalEditar: boolean = false;
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
    private conocimientoService: ConocimientoService,
    private imagenUploadService: ImagenUploadService, // ✅ INYECTAR SERVICIO
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.inicializarFormularios();
    this.cargarConocimientos();
  }

  inicializarFormularios(): void {
    // Formulario para crear nuevo conocimiento
    this.conocimientoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      nivel: ['', Validators.required],
      tipoConocimiento: ['', Validators.required],
      imagenUrl: [''],
      imagenAlt: ['']
    });

    // Formulario para editar conocimiento
    this.editarConocimientoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      nivel: ['', Validators.required],
      tipoConocimiento: ['', Validators.required],
      imagenUrl: [''],
      imagenAlt: ['']
    });
  }

  cargarConocimientos(): void {
    this.conocimientoService.findAll().subscribe({
      next: (data: Conocimiento[]) => {
        console.log('✅ Conocimientos cargados:', data);
        this.conocimientos = data;
      },
      error: (error) => {
        console.error('Error al cargar conocimientos:', error);
        this.conocimientos = [];
        this.errorMessage = 'Error al cargar los conocimientos';
      }
    });
  }

  // ✅ MÉTODO: Manejar selección de archivo (para crear)
  onFileSelected(event: Event): void {
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
        
        this.conocimientoForm.patchValue({
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
    this.conocimientoForm.patchValue({
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
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPreviewEditar = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      this.imagenUploadService.uploadImage(file).subscribe({
        next: (imagen: Imagen) => {
          this.imagenSubiendoEditar = false;
          this.editarConocimientoForm.patchValue({
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
    this.editarConocimientoForm.patchValue({
      imagenUrl: '',
      imagenAlt: ''
    });
  }

  guardarConocimiento(): void {
    if (this.conocimientoForm.invalid) {
      Object.keys(this.conocimientoForm.controls).forEach(key => {
        const control = this.conocimientoForm.get(key);
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
    const imagenUrl = this.conocimientoForm.value.imagenUrl;
    const imagenAlt = this.conocimientoForm.value.imagenAlt;

    if (imagenUrl) {
      imagen = {
        url: imagenUrl,
        alt: imagenAlt || `Logo de ${this.conocimientoForm.value.nombre}`
      };
    }

    // Convertir valores de string a enum
    const nivelEnum = this.convertirStringANivel(this.conocimientoForm.value.nivel);
    const tipoEnum = this.convertirStringATipoConocimiento(this.conocimientoForm.value.tipoConocimiento);

    // Crear objeto Conocimiento
    const nuevoConocimiento: Conocimiento = {
      id: null,
      nombre: this.conocimientoForm.value.nombre,
      nivel: nivelEnum,
      tipoConocimiento: tipoEnum,
      imagen: imagen
    };

    console.log('Enviando conocimiento a guardar:', nuevoConocimiento);

    this.conocimientoService.save(nuevoConocimiento).subscribe({
      next: (conocimientoCreado) => {
        console.log('✅ Conocimiento creado exitosamente:', conocimientoCreado);
        
        this.successMessage = 'Conocimiento creado exitosamente';
        this.guardando = false;
        
        this.conocimientos.unshift(conocimientoCreado);
        this.conocimientoForm.reset();
        this.imagenPreview = null;
        this.imagenSeleccionada = null;
        this.imagenProgreso = 0;
        
        setTimeout(() => {
          this.successMessage = '';
          this.cargarConocimientos();
        }, 500);
      },
      error: (error) => {
        console.error('❌ Error al crear conocimiento:', error);
        this.guardando = false;
        
        if (error.status === 400 && error.error) {
          const errores = [];
          for (const key in error.error) {
            if (error.error.hasOwnProperty(key)) {
              errores.push(`${key}: ${error.error[key]}`);
            }
          }
          this.errorMessage = `Error de validación: ${errores.join(', ')}`;
        } else if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'No tiene permisos para realizar esta acción';
        } else {
          this.errorMessage = 'Error al guardar el conocimiento. Intente nuevamente.';
        }
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 10000);
      }
    });
  }

  cargarConocimientoParaEditar(conocimiento: Conocimiento): void {
    console.log('Cargando conocimiento para editar:', conocimiento);
    
    this.conocimientoEditado = { ...conocimiento };

    // Obtener la imagen si existe
    const imagen = conocimiento.imagen;

    // Convertir enum a string para el formulario
    const nivelString = this.convertirNivelAString(conocimiento.nivel);
    const tipoString = this.convertirTipoConocimientoAString(conocimiento.tipoConocimiento);

    // Actualizar el formulario con los datos
    this.editarConocimientoForm.patchValue({
      nombre: conocimiento.nombre,
      nivel: nivelString,
      tipoConocimiento: tipoString,
      imagenUrl: imagen?.url || '',
      imagenAlt: imagen?.alt || ''
    });

    // Mostrar preview de la imagen existente
    if (imagen?.url) {
      this.imagenPreviewEditar = imagen.url;
    } else {
      this.imagenPreviewEditar = null;
    }

    this.mensaje = `Editando: "${conocimiento.nombre}"`;
    this.mensajeTipo = 'info';
    
    // Mostrar el modal
    this.mostrarModalEditar = true;
  }

  actualizarConocimiento(): void {
    if (this.editarConocimientoForm.invalid) {
      Object.keys(this.editarConocimientoForm.controls).forEach(key => {
        const control = this.editarConocimientoForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      this.mostrarMensaje('Por favor completa todos los campos correctamente', 'error');
      return;
    }

    if (!this.conocimientoEditado?.id) {
      this.mostrarMensaje('No hay conocimiento seleccionado para editar', 'error');
      return;
    }

    this.actualizando = true;
    this.mensaje = '';

    // Preparar imagen
    let imagen: Imagen | undefined = undefined;
    const imagenUrl = this.editarConocimientoForm.value.imagenUrl;
    const imagenAlt = this.editarConocimientoForm.value.imagenAlt;

    if (imagenUrl) {
      imagen = {
        url: imagenUrl,
        alt: imagenAlt || `Logo de ${this.editarConocimientoForm.value.nombre}`
      };
    }

    // Convertir valores de string a enum
    const nivelEnum = this.convertirStringANivel(this.editarConocimientoForm.value.nivel);
    const tipoEnum = this.convertirStringATipoConocimiento(this.editarConocimientoForm.value.tipoConocimiento);

    // Crear objeto Conocimiento actualizado
    const conocimientoActualizado: Conocimiento = {
      id: this.conocimientoEditado.id,
      nombre: this.editarConocimientoForm.value.nombre,
      nivel: nivelEnum,
      tipoConocimiento: tipoEnum,
      imagen: imagen
    };

    console.log('Actualizando conocimiento:', conocimientoActualizado);

    this.conocimientoService.updateConocimiento(this.conocimientoEditado.id, conocimientoActualizado).subscribe({
      next: (conocimientoActualizadoResp) => {
        console.log('✅ Conocimiento actualizado exitosamente:', conocimientoActualizadoResp);
        
        this.mostrarMensaje('¡Conocimiento actualizado con éxito!', 'success');
        this.actualizando = false;
        
        const index = this.conocimientos.findIndex(c => c.id === this.conocimientoEditado?.id);
        if (index !== -1) {
          this.conocimientos[index] = { ...conocimientoActualizadoResp };
          this.conocimientos = [...this.conocimientos];
        }
        
        setTimeout(() => {
          this.cerrarModalEditar();
          this.cargarConocimientos();
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Error al actualizar conocimiento:', error);
        this.actualizando = false;
        
        if (error.status === 404) {
          this.mostrarMensaje('Error: No se encontró el conocimiento', 'error');
        } else if (error.status === 400) {
          this.mostrarMensaje('Error: Datos inválidos', 'error');
        } else if (error.status === 401 || error.status === 403) {
          this.mostrarMensaje('No tiene permisos para realizar esta acción', 'error');
        } else {
          this.mostrarMensaje('Error al actualizar el conocimiento. Intente nuevamente.', 'error');
        }
      }
    });
  }

  confirmarEliminacion(conocimiento: Conocimiento): void {
    console.log('Confirmando eliminación de:', conocimiento);
    this.conocimientoAEliminar = conocimiento;
    this.mostrarModalConfirmacion = true;
  }

  cancelarEliminacion(): void {
    this.mostrarModalConfirmacion = false;
    this.conocimientoAEliminar = null;
    this.eliminando = false;
  }

  eliminarConocimiento(): void {
    if (!this.conocimientoAEliminar || !this.conocimientoAEliminar.id) {
      this.mostrarMensaje('No hay conocimiento seleccionado para eliminar', 'error');
      return;
    }

    this.eliminando = true;
    const conocimientoId = this.conocimientoAEliminar.id;
    const nombreConocimiento = this.conocimientoAEliminar.nombre;

    this.conocimientoService.delete(conocimientoId).subscribe({
      next: () => {
        console.log('✅ Conocimiento eliminado exitosamente:', nombreConocimiento);
        
        this.conocimientos = this.conocimientos.filter(c => c.id !== conocimientoId);
        
        this.successMessage = `Conocimiento "${nombreConocimiento}" eliminado exitosamente`;
        
        this.eliminando = false;
        this.mostrarModalConfirmacion = false;
        this.conocimientoAEliminar = null;
        
        setTimeout(() => {
          this.successMessage = '';
          this.cargarConocimientos();
        }, 500);
      },
      error: (error) => {
        console.error('❌ Error al eliminar conocimiento:', error);
        this.eliminando = false;
        
        let errorMsg = 'Error al eliminar el conocimiento. Intente nuevamente.';
        
        if (error.status === 404) {
          errorMsg = 'Error: No se encontró el conocimiento a eliminar';
        } else if (error.status === 401 || error.status === 403) {
          errorMsg = 'No tiene permisos para realizar esta acción';
        } else if (error.status === 500) {
          errorMsg = 'Error interno del servidor al eliminar el conocimiento';
        }
        
        this.errorMessage = errorMsg;
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 10000);
      }
    });
  }

  // Métodos auxiliares para conversión de enums
  private convertirStringANivel(nivelString: string): Nivel {
    switch(nivelString.toUpperCase()) {
      case 'PRINCIPIANTE_BASICO': return Nivel.PRINCIPIANTE_BASICO;
      case 'INTERMEDIO': return Nivel.INTERMEDIO;
      case 'ALTO': return Nivel.ALTO;
      case 'AVANZADO': return Nivel.AVANZADO;
      default: return Nivel.PRINCIPIANTE_BASICO;
    }
  }

  private convertirNivelAString(nivel: Nivel): string {
    switch(nivel) {
      case Nivel.PRINCIPIANTE_BASICO: return 'PRINCIPIANTE_BASICO';
      case Nivel.INTERMEDIO: return 'INTERMEDIO';
      case Nivel.ALTO: return 'ALTO';
      case Nivel.AVANZADO: return 'AVANZADO';
      default: return 'PRINCIPIANTE_BASICO';
    }
  }

  private convertirStringATipoConocimiento(tipoString: string): TipoConocimiento {
    switch(tipoString.toUpperCase()) {
      case 'FRONTEND': return TipoConocimiento.FRONTEND;
      case 'BACKEND': return TipoConocimiento.BACKEND;
      case 'BASE_DATOS': return TipoConocimiento.BASE_DATOS;
      case 'TESTING': return TipoConocimiento.TESTING;
      case 'IA': return TipoConocimiento.IA;
      case 'PROTOTIPO': return TipoConocimiento.PROTOTIPO;
      case 'OTROS': return TipoConocimiento.OTROS;
      default: return TipoConocimiento.OTROS;
    }
  }

  private convertirTipoConocimientoAString(tipo: TipoConocimiento): string {
    switch(tipo) {
      case TipoConocimiento.FRONTEND: return 'FRONTEND';
      case TipoConocimiento.BACKEND: return 'BACKEND';
      case TipoConocimiento.BASE_DATOS: return 'BASE_DATOS';
      case TipoConocimiento.TESTING: return 'TESTING';
      case TipoConocimiento.IA: return 'IA';
      case TipoConocimiento.PROTOTIPO: return 'PROTOTIPO';
      case TipoConocimiento.OTROS: return 'OTROS';
      default: return 'OTROS';
    }
  }

  // Método para mostrar mensajes
  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error' | 'info'): void {
    this.mensaje = mensaje;
    this.mensajeTipo = tipo;
    
    setTimeout(() => {
      if (this.mensaje === mensaje) {
        this.mensaje = '';
      }
    }, 5000);
  }

  // Método para cerrar el modal de edición
  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.mensaje = '';
    this.editarConocimientoForm.reset();
    this.actualizando = false;
    this.conocimientoEditado = null;
    this.imagenPreviewEditar = null;
    this.imagenSubiendoEditar = false;
  }

  // ✅ DESTRUIR TIMEOUTS AL SALIR DEL COMPONENTE
  ngOnDestroy(): void {
    if (this.previewTimeout) {
      clearTimeout(this.previewTimeout);
      this.previewTimeout = null;
    }
  }

  // Métodos auxiliares para acceso a controles
  get nombre() { return this.conocimientoForm.get('nombre'); }
  get nivel() { return this.conocimientoForm.get('nivel'); }
  get tipoConocimiento() { return this.conocimientoForm.get('tipoConocimiento'); }
}
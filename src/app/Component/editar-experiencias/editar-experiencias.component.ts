import { Component, OnInit } from '@angular/core';
import { Experiencia } from '../../Modelo/experiencia';
import { ExperienciaService } from '../../Servicio/experiencia.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TecnologiaUsada } from '../../Modelo/Enums/tecnologiaUsada';
import { TipoExperiencia } from '../../Modelo/Enums/tipoExperiencia';
import { Imagen } from '../../Modelo/imagen';
import { ImagenUploadService } from '../../Servicio/imagen-upload.service';

@Component({
  selector: 'app-editar-experiencias',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-experiencias.component.html',
  styleUrl: './editar-experiencias.component.css'
})
export class EditarExperienciasComponent implements OnInit {
  experiencias: Experiencia[] = [];
  
  // Arrays para los selectores (usando valores del enum)
  tiposExperiencia = [
    { value: TipoExperiencia.PROYECTO_PERSONAL, label: 'PROYECTO PERSONAL' },
    { value: TipoExperiencia.TRABAJO_LABORAL_COLABORATIVO, label: 'TRABAJO LABORAL COLABORATIVO' },
    { value: TipoExperiencia.APORTE_CODIGO_ABIERTO, label: 'APORTE CÓDIGO ABIERTO' },
    { value: TipoExperiencia.PRACTICA_PROFESIONAL, label: 'PRÁCTICA PROFESIONAL' },
    { value: TipoExperiencia.TRABAJO_LABORAL_FREELANCE, label: 'TRABAJO LABORAL FREELANCE' }
  ];
  
  tecnologiasUsadas = [
    { value: TecnologiaUsada.ANGULAR, label: 'ANGULAR' },
    { value: TecnologiaUsada.REACT, label: 'REACT' },
    { value: TecnologiaUsada.VUE, label: 'VUE' },
    { value: TecnologiaUsada.SPRINGBOOT, label: 'SPRINGBOOT' },
    { value: TecnologiaUsada.DJANGO, label: 'DJANGO' },
    { value: TecnologiaUsada.JAVA, label: 'JAVA' },
    { value: TecnologiaUsada.JAVASCRIPT, label: 'JAVASCRIPT' },
    { value: TecnologiaUsada.TYPESCRIPT, label: 'TYPESCRIPT' },
    { value: TecnologiaUsada.BOOTSTRAP, label: 'BOOTSTRAP' },
    { value: TecnologiaUsada.TAILWIND, label: 'TAILWIND' },
    { value: TecnologiaUsada.PYTHON, label: 'PYTHON' },
    { value: TecnologiaUsada.PHP, label: 'PHP' },
    { value: TecnologiaUsada.MYSQL, label: 'MYSQL' },
    { value: TecnologiaUsada.MONGODB, label: 'MONGODB' },
    { value: TecnologiaUsada.POSTGRESQL, label: 'POSTGRESQL' }
  ];
  
  // Formularios
  experienciaForm: FormGroup;
  editarExperienciaForm: FormGroup;
  
  // Estados
  guardando = false;
  actualizando = false;
  eliminando = false;
  
  // Mensajes
  errorMessage = '';
  successMessage = '';
  mensaje = '';
  mensajeTipo: 'error' | 'success' = 'success';
  
  // Modales
  mostrarModalEditar = false;
  mostrarModalConfirmacion = false;
  
  // Datos para editar/eliminar
  experienciaEditada: Experiencia | null = null;
  experienciaAEliminar: Experiencia | null = null;

  // Variable para almacenar la experiencia seleccionada
selectedExperiencia: Experiencia | null = null;


  // ✅ VARIABLES PARA UPLOAD DE IMÁGENES
  imagenSubiendo = false;
  imagenSubiendoEditar = false;
  imagenProgreso = 0;
  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;
  imagenPreviewEditar: string | null = null;

  // ✅ NUEVA VARIABLE PARA CONTROLAR EL TIMEOUT DE PREVIEW
  private previewTimeout: any = null;

  constructor(
    private experienciaService: ExperienciaService,
    private imagenUploadService: ImagenUploadService,
    private fb: FormBuilder
  ) {
    // Formulario para crear nueva experiencia
    this.experienciaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      fechaInicioProyecto: ['', [Validators.required]],
      fechaFinProyecto: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      tipoExperiencia: ['', [Validators.required]],
      tecnologiaUsada: ['', [Validators.required]],
      link: [''],
      imagenUrl: [''],
      imagenAlt: ['']
    });
    
    // Formulario para editar experiencia
    this.editarExperienciaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      fechaInicioProyecto: ['', [Validators.required]],
      fechaFinProyecto: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      tipoExperiencia: ['', [Validators.required]],
      tecnologiaUsada: ['', [Validators.required]],
      link: [''],
      imagenUrl: [''],
      imagenAlt: ['']
    });
  }

  ngOnInit(): void {
    this.cargarExperiencias();
  }

  cargarExperiencias(): void {
    this.experienciaService.findAll().subscribe({
      next: (data: Experiencia[]) => {
        this.experiencias = data;
        console.log('📊 Número de experiencias:', data.length);
      },
      error: (err) => {
        this.experiencias = [];
        console.error('📄 Detalles del error:', err.error);
        this.mostrarMensaje('Error al cargar experiencias', 'error');
      }
    });
  }
  // ✅ NUEVO MÉTODO PARA ABRIR MODAL DE DETALLES
abrirModalDetalles(experiencia: Experiencia): void {
  // Usamos el modal de Bootstrap que ya existe en perfil.component
  // Pero como estamos en otro componente, creamos uno local
  // Para simplificar, reutilizamos la lógica de selección
  this.selectedExperiencia = experiencia;
  // Mostrar modal usando Bootstrap (si está disponible)
  const modalElement = document.getElementById('experienciaModal');
  if (modalElement) {
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
  } else {
    // Si no hay modal de Bootstrap, usar alert o crear uno
    console.log('Detalles de la experiencia:', experiencia);
    // Opcional: implementar un modal propio
  }
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
      
      // ✅ CANCELAR TIMEOUT ANTERIOR SI EXISTE
      if (this.previewTimeout) {
        clearTimeout(this.previewTimeout);
        this.previewTimeout = null;
      }
      
      // Subir automáticamente
      this.subirImagen(file);
    }
  }

  // ✅ MÉTODO: Subir imagen (para crear) - ELIMINADO EL TIMEOUT QUE BORRABA LA PREVIEW
  subirImagen(file: File): void {
    this.imagenSubiendo = true;
    this.imagenProgreso = 0;
    
    // Simular progreso (opcional)
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
        this.experienciaForm.patchValue({
          imagenUrl: imagen.url,
          imagenAlt: imagen.alt || file.name
        });
        
        this.mostrarMensaje('✅ Imagen subida exitosamente', 'success');
        
        // ✅ ELIMINADO: setTimeout que borraba la preview
        // Ahora la preview se mantiene hasta que el usuario guarde o la elimine manualmente
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
    this.experienciaForm.patchValue({
      imagenUrl: '',
      imagenAlt: ''
    });
    
    // ✅ CANCELAR TIMEOUT SI EXISTE
    if (this.previewTimeout) {
      clearTimeout(this.previewTimeout);
      this.previewTimeout = null;
    }
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
          this.editarExperienciaForm.patchValue({
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
    this.editarExperienciaForm.patchValue({
      imagenUrl: '',
      imagenAlt: ''
    });
  }

  guardarExperiencia(): void {
    if (this.experienciaForm.invalid) {
      this.marcarControlesComoTocados(this.experienciaForm);
      return;
    }

    this.guardando = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Preparar la imagen
    let imagen: Imagen | undefined = undefined;
    const imagenUrl = this.experienciaForm.value.imagenUrl;
    const imagenAlt = this.experienciaForm.value.imagenAlt;

    if (imagenUrl) {
      imagen = {
        url: imagenUrl,
        alt: imagenAlt || `Logo de ${this.experienciaForm.value.titulo}`
      };
    }

    const nuevaExperiencia: Experiencia = {
      id: null,
      titulo: this.experienciaForm.value.titulo,
      fechaInicioProyecto: this.experienciaForm.value.fechaInicioProyecto,
      fechaFinProyecto: this.experienciaForm.value.fechaFinProyecto,
      descripcion: this.experienciaForm.value.descripcion,
      link: this.experienciaForm.value.link || '',
      tipoExperiencia: this.experienciaForm.value.tipoExperiencia,
      tecnologiaUsada: this.experienciaForm.value.tecnologiaUsada,
      imagen: imagen
    };

    console.log('📤 Enviando experiencia a guardar:', JSON.stringify(nuevaExperiencia, null, 2));

    this.experienciaService.save(nuevaExperiencia).subscribe({
      next: (experienciaGuardada) => {
        console.log('✅ Experiencia guardada exitosamente:', experienciaGuardada);
        
        // ✅ ACTUALIZAR LA LISTA CORRECTAMENTE
        this.experiencias = [...this.experiencias, experienciaGuardada];
        
        this.successMessage = 'Experiencia creada exitosamente';
        this.experienciaForm.reset();
        this.guardando = false;
        
        // ✅ LIMPIAR PREVIEW PERO MANTENER LA IMAGEN EN EL FORMULARIO
        this.imagenPreview = null;
        this.imagenSeleccionada = null;
        this.imagenProgreso = 0;
        
        // ✅ RECARGAR LA LISTA COMPLETA PARA ACTUALIZAR TODO
        setTimeout(() => {
          this.cargarExperiencias();
        }, 500);
      },
      error: (err) => {
        console.error('❌ Error creando experiencia:', err);
        this.errorMessage = 'Error al crear la experiencia: ' + (err.error?.message || err.message || 'Error desconocido');
        this.guardando = false;
      }
    });
  }

  // EDITAR EXPERIENCIA
  cargarExperienciaParaEditar(experiencia: Experiencia): void {
    this.experienciaEditada = experiencia;
    
    // Obtener la imagen si existe
    const imagen = experiencia.imagen;
    
    this.editarExperienciaForm.patchValue({
      titulo: experiencia.titulo,
      fechaInicioProyecto: this.formatDateForInput(experiencia.fechaInicioProyecto),
      fechaFinProyecto: this.formatDateForInput(experiencia.fechaFinProyecto),
      descripcion: experiencia.descripcion,
      tipoExperiencia: experiencia.tipoExperiencia,
      tecnologiaUsada: experiencia.tecnologiaUsada,
      link: experiencia.link || '',
      imagenUrl: imagen?.url || '',
      imagenAlt: imagen?.alt || ''
    });
    
    // Mostrar preview de la imagen existente
    if (imagen?.url) {
      this.imagenPreviewEditar = imagen.url;
    } else {
      this.imagenPreviewEditar = null;
    }
    
    this.mostrarModalEditar = true;
    this.mensaje = '';
  }

  private formatDateForInput(date: string | Date): string {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0];
  }

  actualizarExperiencia(): void {
    if (this.editarExperienciaForm.invalid) {
      this.marcarControlesComoTocados(this.editarExperienciaForm);
      return;
    }

    if (!this.experienciaEditada?.id) {
      this.mensajeTipo = 'error';
      this.mensaje = 'No se encontró la experiencia a actualizar';
      return;
    }

    this.actualizando = true;
    this.mensaje = '';

    // Preparar la imagen
    let imagen: Imagen | undefined = undefined;
    const imagenUrl = this.editarExperienciaForm.value.imagenUrl;
    const imagenAlt = this.editarExperienciaForm.value.imagenAlt;

    if (imagenUrl) {
      imagen = {
        url: imagenUrl,
        alt: imagenAlt || `Logo de ${this.editarExperienciaForm.value.titulo}`
      };
    }

    const experienciaActualizada: Experiencia = {
      id: this.experienciaEditada.id,
      titulo: this.editarExperienciaForm.value.titulo,
      fechaInicioProyecto: this.editarExperienciaForm.value.fechaInicioProyecto,
      fechaFinProyecto: this.editarExperienciaForm.value.fechaFinProyecto,
      descripcion: this.editarExperienciaForm.value.descripcion,
      link: this.editarExperienciaForm.value.link || '',
      tipoExperiencia: this.editarExperienciaForm.value.tipoExperiencia,
      tecnologiaUsada: this.editarExperienciaForm.value.tecnologiaUsada,
      imagen: imagen
    };

    console.log('📤 Enviando experiencia a actualizar:', JSON.stringify(experienciaActualizada, null, 2));

    this.experienciaService.updateExperiencia(this.experienciaEditada.id, experienciaActualizada).subscribe({
      next: (experienciaActualizada) => {
        console.log('✅ Experiencia actualizada exitosamente:', experienciaActualizada);
        
        // ✅ ACTUALIZAR LA LISTA CORRECTAMENTE
        const index = this.experiencias.findIndex(e => e.id === experienciaActualizada.id);
        if (index !== -1) {
          this.experiencias[index] = experienciaActualizada;
          // ✅ FORZAR ACTUALIZACIÓN DE LA VISTA
          this.experiencias = [...this.experiencias];
        }
        
        this.mensajeTipo = 'success';
        this.mensaje = 'Experiencia actualizada exitosamente';
        this.actualizando = false;

        console.log('Experincia con ID ' + experienciaActualizada.id + ' actualizada correctamente.');
        localStorage.setItem('experiencias', JSON.stringify(this.experiencias));
        
        setTimeout(() => {
          this.cerrarModalEditar();
          // ✅ RECARGAR LA LISTA COMPLETA PARA ACTUALIZAR TODO
          this.cargarExperiencias();
        }, 1500);
      },
      error: (err) => {
        console.error('❌ Error actualizando experiencia:', err);
        this.mensajeTipo = 'error';
        this.mensaje = 'Error al actualizar la experiencia: ' + (err.error?.message || err.message || 'Error desconocido');
        this.actualizando = false;
      }
    });
  }

  // ELIMINAR EXPERIENCIA
  confirmarEliminacion(experiencia: Experiencia): void {
    this.experienciaAEliminar = experiencia;
    this.mostrarModalConfirmacion = true;
  }

  eliminarExperiencia(): void {
    if (!this.experienciaAEliminar?.id) {
      this.mostrarMensaje('No se encontró la experiencia a eliminar', 'error');
      return;
    }

    this.eliminando = true;
    
    this.experienciaService.delete(this.experienciaAEliminar.id).subscribe({
      next: () => {
        console.log('✅ Experiencia eliminada exitosamente');
        this.experiencias = this.experiencias.filter(e => e.id !== this.experienciaAEliminar?.id);
        this.cancelarEliminacion();
        this.mostrarMensaje('Experiencia eliminada exitosamente', 'success');
        this.eliminando = false;
        this.cargarExperiencias();
      },
      error: (err) => {
        console.error('❌ Error eliminando experiencia:', err);
        this.mostrarMensaje('Error al eliminar la experiencia: ' + (err.error?.message || err.message || 'Error desconocido'), 'error');
        this.eliminando = false;
      }
    });
  }

  // UTILIDADES
  private marcarControlesComoTocados(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private mostrarMensaje(mensaje: string, tipo: 'error' | 'success'): void {
    if (tipo === 'error') {
      this.errorMessage = mensaje;
      this.successMessage = '';
    } else {
      this.successMessage = mensaje;
      this.errorMessage = '';
    }
    
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 5000);
  }

  // Método para obtener el label de un tipo de experiencia
  getTipoExperienciaLabel(tipo: TipoExperiencia): string {
    const found = this.tiposExperiencia.find(item => item.value === tipo);
    return found ? found.label : tipo.toString();
  }

  // Método para obtener el label de una tecnología
  getTecnologiaUsadaLabel(tecnologia: TecnologiaUsada): string {
    const found = this.tecnologiasUsadas.find(item => item.value === tecnologia);
    return found ? found.label : tecnologia.toString();
  }

  // MODALES
  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.experienciaEditada = null;
    this.editarExperienciaForm.reset();
    this.mensaje = '';
    this.imagenPreviewEditar = null;
    this.imagenSubiendoEditar = false;
  }

  cancelarEliminacion(): void {
    this.mostrarModalConfirmacion = false;
    this.experienciaAEliminar = null;
    this.eliminando = false;
  }

  // ✅ DESTRUIR TIMEOUTS AL SALIR DEL COMPONENTE
  ngOnDestroy(): void {
    if (this.previewTimeout) {
      clearTimeout(this.previewTimeout);
      this.previewTimeout = null;
    }
  }
}
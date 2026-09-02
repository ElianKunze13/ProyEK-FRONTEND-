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
  
  // TECNOLOGÍAS DISPONIBLES
  tecnologiasDisponibles = [
    { value: TecnologiaUsada.ANGULAR, label: 'Angular' },
    { value: TecnologiaUsada.REACT, label: 'React' },
    { value: TecnologiaUsada.VUE, label: 'Vue.js' },
    { value: TecnologiaUsada.SPRINGBOOT, label: 'Spring Boot' },
    { value: TecnologiaUsada.DJANGO, label: 'Django' },
    { value: TecnologiaUsada.JAVA, label: 'Java' },
    { value: TecnologiaUsada.JAVASCRIPT, label: 'JavaScript' },
    { value: TecnologiaUsada.TYPESCRIPT, label: 'TypeScript' },
    { value: TecnologiaUsada.BOOTSTRAP, label: 'Bootstrap' },
    { value: TecnologiaUsada.TAILWIND, label: 'Tailwind' },
    { value: TecnologiaUsada.PYTHON, label: 'Python' },
    { value: TecnologiaUsada.PHP, label: 'PHP' },
    { value: TecnologiaUsada.MYSQL, label: 'MySQL' },
    { value: TecnologiaUsada.MONGODB, label: 'MongoDB' },
    { value: TecnologiaUsada.POSTGRESQL, label: 'PostgreSQL' }
  ];
  
  // Mapeo de colores para badges
  tecnologiaColors: { [key: string]: string } = {
    'ANGULAR': 'bg-danger',
    'REACT': 'bg-info',
    'VUE': 'bg-success',
    'SPRINGBOOT': 'bg-success',
    'DJANGO': 'bg-success',
    'JAVA': 'bg-warning text-dark',
    'JAVASCRIPT': 'bg-warning text-dark',
    'TYPESCRIPT': 'bg-primary',
    'BOOTSTRAP': 'bg-purple',
    'TAILWIND': 'bg-cyan',
    'PYTHON': 'bg-primary',
    'PHP': 'bg-secondary',
    'MYSQL': 'bg-primary',
    'MONGODB': 'bg-success',
    'POSTGRESQL': 'bg-primary'
  };

  // Obtener nombre display de la tecnología
  getTecnologiaDisplay(tecnologia: string): string {
    const found = this.tecnologiasDisponibles.find(t => t.value === tecnologia);
    return found ? found.label : tecnologia;
  }

  // Obtener color de la tecnología
  getTecnologiaColor(tecnologia: string): string {
    return this.tecnologiaColors[tecnologia] || 'bg-secondary';
  }

  // Método para verificar si una tecnología está seleccionada
  isTecnologiaSeleccionada(tecnologia: string): boolean {
    const tecnologiasSeleccionadas = this.experienciaForm.get('tecnologiasUsadas')?.value as string[] || [];
    return tecnologiasSeleccionadas.includes(tecnologia);
  }

  // Método para verificar en el formulario de edición
  isTecnologiaSeleccionadaEditar(tecnologia: string): boolean {
    const tecnologiasSeleccionadas = this.editarExperienciaForm.get('tecnologiasUsadas')?.value as string[] || [];
    return tecnologiasSeleccionadas.includes(tecnologia);
  }

  // Toggle selección de tecnología (crear)
  toggleTecnologia(tecnologia: string): void {
    const control = this.experienciaForm.get('tecnologiasUsadas');
    const currentValue = control?.value as string[] || [];
    
    if (currentValue.includes(tecnologia)) {
      control?.setValue(currentValue.filter(t => t !== tecnologia));
    } else {
      control?.setValue([...currentValue, tecnologia]);
    }
  }

  // Toggle selección de tecnología (editar)
  toggleTecnologiaEditar(tecnologia: string): void {
    const control = this.editarExperienciaForm.get('tecnologiasUsadas');
    const currentValue = control?.value as string[] || [];
    
    if (currentValue.includes(tecnologia)) {
      control?.setValue(currentValue.filter(t => t !== tecnologia));
    } else {
      control?.setValue([...currentValue, tecnologia]);
    }
  }
  
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

  // VARIABLES PARA UPLOAD DE IMÁGENES
  imagenSubiendo = false;
  imagenSubiendoEditar = false;
  imagenProgreso = 0;
  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;
  imagenPreviewEditar: string | null = null;

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
      tecnologiasUsadas: [[], [Validators.required, Validators.minLength(1)]],
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
      tecnologiasUsadas: [[], [Validators.required, Validators.minLength(1)]],
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

  // ============================================
  // MÉTODO PARA ABRIR MODAL DE DETALLES - MEJORADO
  // ============================================
  abrirModalDetalles(experiencia: Experiencia): void {
    console.log('🟢 Abriendo modal para:', experiencia.titulo);
    this.selectedExperiencia = experiencia;
    
    // Pequeño retraso para asegurar que Angular actualice el DOM
    setTimeout(() => {
      const modalElement = document.getElementById('experienciaModal');
      console.log('🔍 Elemento modal encontrado:', modalElement);
      
      if (modalElement) {
        try {
          // Verificar si bootstrap está disponible
          if (typeof (window as any).bootstrap !== 'undefined') {
            const modal = new (window as any).bootstrap.Modal(modalElement);
            modal.show();
            console.log('✅ Modal abierto con Bootstrap');
          } else {
            // Fallback si Bootstrap no está disponible
            console.warn('⚠️ Bootstrap no disponible, usando fallback');
            this.abrirModalManual(modalElement);
          }
        } catch (error) {
          console.error('❌ Error al abrir modal:', error);
          // Fallback: mostrar alert con los detalles
          this.mostrarDetallesComoAlert(experiencia);
        }
      } else {
        console.error('❌ Elemento modal no encontrado');
        // Fallback: mostrar alert con los detalles
        this.mostrarDetallesComoAlert(experiencia);
      }
    }, 100);
  }

  // Método para abrir modal manualmente
  private abrirModalManual(modalElement: HTMLElement): void {
    modalElement.style.display = 'block';
    modalElement.classList.add('show');
    document.body.classList.add('modal-open');
    
    // Crear backdrop manual
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
  }

  // Método de fallback para mostrar detalles sin modal
  private mostrarDetallesComoAlert(experiencia: Experiencia): void {
    const tecnologiasStr = experiencia.tecnologiasUsadas && experiencia.tecnologiasUsadas.length > 0
      ? experiencia.tecnologiasUsadas.map(t => this.getTecnologiaDisplay(t)).join(', ')
      : 'Sin tecnologías';
    
    const fechaInicio = new Date(experiencia.fechaInicioProyecto).toLocaleDateString('es-ES');
    const fechaFin = new Date(experiencia.fechaFinProyecto).toLocaleDateString('es-ES');
    
    const mensaje = `📋 ${experiencia.titulo}\n\n` +
                    `📅 ${fechaInicio} → ${fechaFin}\n\n` +
                    `📝 ${experiencia.descripcion}\n\n` +
                    `🔧 Tecnologías: ${tecnologiasStr}\n\n` +
                    `🔗 ${experiencia.link || 'Sin enlace'}`;
    
    alert(mensaje);
  }

  // ============================================
  // MÉTODO PARA CERRAR MODAL DE DETALLES
  // ============================================
  cerrarModalDetalles(): void {
    console.log('🔴 Cerrando modal');
    
    const modalElement = document.getElementById('experienciaModal');
    if (modalElement) {
      try {
        // Intentar cerrar con Bootstrap
        if (typeof (window as any).bootstrap !== 'undefined') {
          const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          } else {
            this.cerrarModalManual();
          }
        } else {
          this.cerrarModalManual();
        }
      } catch (error) {
        console.error('Error al cerrar modal:', error);
        this.cerrarModalManual();
      }
    }
    this.selectedExperiencia = null;
  }

  // Método para cerrar modal manualmente
  private cerrarModalManual(): void {
    const modalElement = document.getElementById('experienciaModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');
      
      // Remover backdrop
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }
  }

  // ============================================
  // MÉTODOS PARA MANEJAR IMÁGENES
  // ============================================
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
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      if (this.previewTimeout) {
        clearTimeout(this.previewTimeout);
        this.previewTimeout = null;
      }
      
      this.subirImagen(file);
    }
  }

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
        
        this.experienciaForm.patchValue({
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

  eliminarImagenSeleccionada(): void {
    this.imagenPreview = null;
    this.imagenSeleccionada = null;
    this.imagenProgreso = 0;
    this.experienciaForm.patchValue({
      imagenUrl: '',
      imagenAlt: ''
    });
    
    if (this.previewTimeout) {
      clearTimeout(this.previewTimeout);
      this.previewTimeout = null;
    }
  }

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

  eliminarImagenEditar(): void {
    this.imagenPreviewEditar = null;
    this.editarExperienciaForm.patchValue({
      imagenUrl: '',
      imagenAlt: ''
    });
  }

  // ============================================
  // MÉTODOS CRUD
  // ============================================
  guardarExperiencia(): void {
    if (this.experienciaForm.invalid) {
      this.marcarControlesComoTocados(this.experienciaForm);
      this.mostrarMensaje('Por favor complete todos los campos requeridos', 'error');
      return;
    }

    this.guardando = true;
    this.errorMessage = '';
    this.successMessage = '';

    let imagen: Imagen | undefined = undefined;
    const imagenUrl = this.experienciaForm.value.imagenUrl;
    const imagenAlt = this.experienciaForm.value.imagenAlt;

    if (imagenUrl) {
      imagen = {
        url: imagenUrl,
        alt: imagenAlt || `Logo de ${this.experienciaForm.value.titulo}`
      };
    }

    const tecnologiasUsadas = this.experienciaForm.value.tecnologiasUsadas || [];

    const nuevaExperiencia: Experiencia = {
      id: null,
      titulo: this.experienciaForm.value.titulo,
      fechaInicioProyecto: this.experienciaForm.value.fechaInicioProyecto,
      fechaFinProyecto: this.experienciaForm.value.fechaFinProyecto,
      descripcion: this.experienciaForm.value.descripcion,
      link: this.experienciaForm.value.link || '',
      tipoExperiencia: this.experienciaForm.value.tipoExperiencia,
      tecnologiasUsadas: tecnologiasUsadas,
      imagen: imagen
    };

    console.log('📤 Enviando experiencia a guardar:', JSON.stringify(nuevaExperiencia, null, 2));

    this.experienciaService.save(nuevaExperiencia).subscribe({
      next: (experienciaGuardada) => {
        console.log('✅ Experiencia guardada exitosamente:', experienciaGuardada);
        
        this.experiencias = [...this.experiencias, experienciaGuardada];
        this.successMessage = '✅ Experiencia creada exitosamente';
        this.experienciaForm.reset();
        this.guardando = false;
        
        this.imagenPreview = null;
        this.imagenSeleccionada = null;
        this.imagenProgreso = 0;
        this.experienciaForm.patchValue({ tecnologiasUsadas: [] });
        
        setTimeout(() => {
          this.successMessage = '';
          this.cargarExperiencias();
        }, 2000);
      },
      error: (err) => {
        console.error('❌ Error creando experiencia:', err);
        this.errorMessage = '❌ Error al crear la experiencia: ' + (err.error?.message || err.message || 'Error desconocido');
        this.guardando = false;
      }
    });
  }

  cargarExperienciaParaEditar(experiencia: Experiencia): void {
    this.experienciaEditada = experiencia;
    
    const imagen = experiencia.imagen;
    const tecnologiasExistentes = experiencia.tecnologiasUsadas || [];
    
    this.editarExperienciaForm.patchValue({
      titulo: experiencia.titulo,
      fechaInicioProyecto: this.formatDateForInput(experiencia.fechaInicioProyecto),
      fechaFinProyecto: this.formatDateForInput(experiencia.fechaFinProyecto),
      descripcion: experiencia.descripcion,
      tipoExperiencia: experiencia.tipoExperiencia,
      tecnologiasUsadas: tecnologiasExistentes,
      link: experiencia.link || '',
      imagenUrl: imagen?.url || '',
      imagenAlt: imagen?.alt || ''
    });
    
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
      this.mostrarMensaje('Por favor complete todos los campos requeridos', 'error');
      return;
    }

    if (!this.experienciaEditada?.id) {
      this.mensajeTipo = 'error';
      this.mensaje = 'No se encontró la experiencia a actualizar';
      return;
    }

    this.actualizando = true;
    this.mensaje = '';

    let imagen: Imagen | undefined = undefined;
    const imagenUrl = this.editarExperienciaForm.value.imagenUrl;
    const imagenAlt = this.editarExperienciaForm.value.imagenAlt;

    if (imagenUrl) {
      imagen = {
        url: imagenUrl,
        alt: imagenAlt || `Logo de ${this.editarExperienciaForm.value.titulo}`
      };
    }

    const tecnologiasUsadas = this.editarExperienciaForm.value.tecnologiasUsadas || [];

    const experienciaActualizada: Experiencia = {
      id: this.experienciaEditada.id,
      titulo: this.editarExperienciaForm.value.titulo,
      fechaInicioProyecto: this.editarExperienciaForm.value.fechaInicioProyecto,
      fechaFinProyecto: this.editarExperienciaForm.value.fechaFinProyecto,
      descripcion: this.editarExperienciaForm.value.descripcion,
      link: this.editarExperienciaForm.value.link || '',
      tipoExperiencia: this.editarExperienciaForm.value.tipoExperiencia,
      tecnologiasUsadas: tecnologiasUsadas,
      imagen: imagen
    };

    console.log('📤 Enviando experiencia a actualizar:', JSON.stringify(experienciaActualizada, null, 2));

    this.experienciaService.updateExperiencia(this.experienciaEditada.id, experienciaActualizada).subscribe({
      next: (experienciaActualizada) => {
        console.log('✅ Experiencia actualizada exitosamente:', experienciaActualizada);
        
        const index = this.experiencias.findIndex(e => e.id === experienciaActualizada.id);
        if (index !== -1) {
          this.experiencias[index] = experienciaActualizada;
          this.experiencias = [...this.experiencias];
        }
        
        this.mensajeTipo = 'success';
        this.mensaje = '✅ Experiencia actualizada exitosamente';
        this.actualizando = false;

        console.log('Experiencia con ID ' + experienciaActualizada.id + ' actualizada correctamente.');
        localStorage.setItem('experiencias', JSON.stringify(this.experiencias));
        
        setTimeout(() => {
          this.cerrarModalEditar();
          this.cargarExperiencias();
        }, 1500);
      },
      error: (err) => {
        console.error('❌ Error actualizando experiencia:', err);
        this.mensajeTipo = 'error';
        this.mensaje = '❌ Error al actualizar la experiencia: ' + (err.error?.message || err.message || 'Error desconocido');
        this.actualizando = false;
      }
    });
  }

  // ============================================
  // MÉTODOS PARA ELIMINAR
  // ============================================
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
        this.mostrarMensaje('✅ Experiencia eliminada exitosamente', 'success');
        this.eliminando = false;
        this.cargarExperiencias();
      },
      error: (err) => {
        console.error('❌ Error eliminando experiencia:', err);
        this.mostrarMensaje('❌ Error al eliminar la experiencia: ' + (err.error?.message || err.message || 'Error desconocido'), 'error');
        this.eliminando = false;
      }
    });
  }

  // ============================================
  // UTILIDADES
  // ============================================
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

  getTipoExperienciaLabel(tipo: TipoExperiencia): string {
    const found = this.tiposExperiencia.find(item => item.value === tipo);
    return found ? found.label : tipo.toString();
  }

  getTecnologiasLabels(tecnologias: string[] | undefined): string {
    if (!tecnologias || tecnologias.length === 0) return 'Sin tecnologías';
    return tecnologias.map(t => this.getTecnologiaDisplay(t)).join(', ');
  }

  // ============================================
  // MÉTODOS PARA MODALES
  // ============================================
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

  ngOnDestroy(): void {
    if (this.previewTimeout) {
      clearTimeout(this.previewTimeout);
      this.previewTimeout = null;
    }
  }
}
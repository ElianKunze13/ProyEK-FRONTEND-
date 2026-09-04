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

  // =============================================
  // NUEVAS PROPIEDADES PARA MÚLTIPLES IMÁGENES
  // =============================================
  // Crear
  imagenesSeleccionadas: File[] = [];
  imagenesPreviews: string[] = [];
  imagenesSubidas: Imagen[] = [];
  imagenSubiendo = false;
  imagenProgreso = 0;
  maxImagenes = 5;

  // Editar
  imagenesPreviewsEditar: string[] = [];
  imagenSubiendoEditar = false;

  // 🔥 Para el carrusel en el modal de detalles
  imagenActualIndex: number = 0;

  // =============================================
  // MÉTODOS PARA OBTENER TECNOLOGÍAS
  // =============================================
  getTecnologiaDisplay(tecnologia: string): string {
    const found = this.tecnologiasDisponibles.find(t => t.value === tecnologia);
    return found ? found.label : tecnologia;
  }

  getTecnologiaColor(tecnologia: string): string {
    return this.tecnologiaColors[tecnologia] || 'bg-secondary';
  }

  isTecnologiaSeleccionada(tecnologia: string): boolean {
    const tecnologiasSeleccionadas = this.experienciaForm.get('tecnologiasUsadas')?.value as string[] || [];
    return tecnologiasSeleccionadas.includes(tecnologia);
  }

  isTecnologiaSeleccionadaEditar(tecnologia: string): boolean {
    const tecnologiasSeleccionadas = this.editarExperienciaForm.get('tecnologiasUsadas')?.value as string[] || [];
    return tecnologiasSeleccionadas.includes(tecnologia);
  }

  toggleTecnologia(tecnologia: string): void {
    const control = this.experienciaForm.get('tecnologiasUsadas');
    const currentValue = control?.value as string[] || [];
    
    if (currentValue.includes(tecnologia)) {
      control?.setValue(currentValue.filter(t => t !== tecnologia));
    } else {
      control?.setValue([...currentValue, tecnologia]);
    }
  }

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

  // Variable para almacenar la experiencia seleccionada para el modal de detalles
  selectedExperiencia: Experiencia | null = null;

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
      link: ['']
    });
    
    // Formulario para editar experiencia (sin campos de imágenes, se manejan por separado)
    this.editarExperienciaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      fechaInicioProyecto: ['', [Validators.required]],
      fechaFinProyecto: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      tipoExperiencia: ['', [Validators.required]],
      tecnologiasUsadas: [[], [Validators.required, Validators.minLength(1)]],
      link: ['']
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
  // MÉTODO PARA ABRIR MODAL DE DETALLES (con carrusel)
  // ============================================
  abrirModalDetalles(experiencia: Experiencia): void {
    console.log('🟢 Abriendo modal para:', experiencia.titulo);
    this.selectedExperiencia = experiencia;
    this.imagenActualIndex = 0; // 🔥 Reiniciar índice del carrusel
  }

  // ============================================
  // MÉTODO PARA CERRAR MODAL DE DETALLES
  // ============================================
  cerrarModalDetalles(): void {
    console.log('🔴 Cerrando modal');
    this.selectedExperiencia = null;
  }

  // ============================================
  // MÉTODOS PARA EL CARRUSEL DE IMÁGENES EN MODAL DE DETALLES
  // ============================================
  siguienteImagen(): void {
    if (!this.selectedExperiencia?.imagenes?.length) return;
    this.imagenActualIndex = (this.imagenActualIndex + 1) % this.selectedExperiencia.imagenes.length;
  }

  anteriorImagen(): void {
    if (!this.selectedExperiencia?.imagenes?.length) return;
    this.imagenActualIndex = (this.imagenActualIndex - 1 + this.selectedExperiencia.imagenes.length) % this.selectedExperiencia.imagenes.length;
  }

  irAImagen(index: number): void {
    if (!this.selectedExperiencia?.imagenes?.length) return;
    if (index >= 0 && index < this.selectedExperiencia.imagenes.length) {
      this.imagenActualIndex = index;
    }
  }

  // ============================================
  // MÉTODOS PARA MANEJAR MÚLTIPLES IMÁGENES - CREAR
  // ============================================
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Verificar que no se exceda el máximo de imágenes
      const totalActual = this.imagenesSeleccionadas.length + this.imagenesSubidas.length;
      const disponibles = this.maxImagenes - totalActual;
      if (disponibles <= 0) {
        this.mostrarMensaje(`Máximo ${this.maxImagenes} imágenes permitidas`, 'error');
        return;
      }

      const files = Array.from(input.files);
      // Tomar solo las que caben
      const filesAAgregar = files.slice(0, disponibles);

      filesAAgregar.forEach(file => {
        if (!file.type.startsWith('image/')) {
          this.mostrarMensaje('Solo se permiten imágenes', 'error');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          this.mostrarMensaje('Cada imagen no puede superar los 5MB', 'error');
          return;
        }
        this.imagenesSeleccionadas.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagenesPreviews.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });

      // Limpiar el input para permitir seleccionar nuevamente el mismo archivo
      input.value = '';
    }
  }

  eliminarImagenSeleccionada(index: number): void {
    this.imagenesSeleccionadas.splice(index, 1);
    this.imagenesPreviews.splice(index, 1);
  }

  // Subir todas las imágenes seleccionadas al servidor
  subirTodasImagenes(): Promise<Imagen[]> {
    return new Promise((resolve, reject) => {
      if (this.imagenesSeleccionadas.length === 0) {
        resolve(this.imagenesSubidas);
        return;
      }

      this.imagenSubiendo = true;
      const total = this.imagenesSeleccionadas.length;
      let completadas = 0;
      const resultados: Imagen[] = [];

      this.imagenesSeleccionadas.forEach((file, index) => {
        this.imagenUploadService.uploadImage(file).subscribe({
          next: (imagen: Imagen) => {
            resultados.push(imagen);
            completadas++;
            this.imagenProgreso = Math.round((completadas / total) * 100);
            if (completadas === total) {
              this.imagenSubiendo = false;
              this.imagenProgreso = 0;
              this.imagenesSubidas = [...this.imagenesSubidas, ...resultados];
              this.imagenesSeleccionadas = [];
              this.imagenesPreviews = [];
              resolve(this.imagenesSubidas);
            }
          },
          error: (err) => {
            this.imagenSubiendo = false;
            this.imagenProgreso = 0;
            reject(err);
          }
        });
      });
    });
  }

  // ============================================
  // MÉTODOS PARA MANEJAR MÚLTIPLES IMÁGENES - EDITAR
  // ============================================
  onFileSelectedEditar(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Calcular cuántas imágenes actuales hay (existentes + nuevas)
      const totalActual = this.totalImagenesEditar;
      const disponibles = this.maxImagenes - totalActual;
      if (disponibles <= 0) {
        this.mostrarMensaje(`Máximo ${this.maxImagenes} imágenes permitidas`, 'error');
        return;
      }

      const files = Array.from(input.files);
      const filesAAgregar = files.slice(0, disponibles);

      filesAAgregar.forEach(file => {
        if (!file.type.startsWith('image/')) {
          this.mostrarMensaje('Solo se permiten imágenes', 'error');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          this.mostrarMensaje('Cada imagen no puede superar los 5MB', 'error');
          return;
        }
        // Subir inmediatamente la imagen para editar
        this.imagenSubiendoEditar = true;
        this.imagenUploadService.uploadImage(file).subscribe({
          next: (imagen: Imagen) => {
            // Agregar la imagen subida al array de imágenes de la experiencia editada
            if (this.experienciaEditada) {
              if (!this.experienciaEditada.imagenes) {
                this.experienciaEditada.imagenes = [];
              }
              this.experienciaEditada.imagenes.push(imagen);
              // Actualizar preview
              //this.imagenesPreviewsEditar.push(imagen.url);
            }
            this.imagenSubiendoEditar = false;
            this.mostrarMensaje('✅ Imagen agregada exitosamente', 'success');
          },
          error: (err) => {
            this.imagenSubiendoEditar = false;
            console.error('Error al subir imagen:', err);
            this.mostrarMensaje('❌ Error al subir la imagen: ' + (err.error?.message || err.message), 'error');
          }
        });
      });

      input.value = '';
    }
  }

  eliminarImagenEditar(index: number): void {
    if (!this.experienciaEditada?.imagenes) return;
    // Eliminar la imagen del array
    this.experienciaEditada.imagenes.splice(index, 1);
    // También eliminar el preview si corresponde (para imágenes nuevas)
    // Pero como solo manejamos previews para imágenes nuevas, y esas ya están en el array,
    // podemos simplemente actualizar los previews basados en el array actual.
    this.imagenesPreviewsEditar = this.experienciaEditada.imagenes.map(img => img.url);
  }

  // 🔥 Getter para contar el total de imágenes en edición
  get totalImagenesEditar(): number {
    return (this.experienciaEditada?.imagenes?.length || 0) //+ this.imagenesPreviewsEditar.length;
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

    if (this.imagenesSeleccionadas.length === 0 && this.imagenesSubidas.length === 0) {
      this.mostrarMensaje('Debe agregar al menos una imagen', 'error');
      return;
    }

    this.guardando = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Primero subir las imágenes pendientes
    this.subirTodasImagenes().then((imagenes: Imagen[]) => {
      // Combinar imágenes subidas anteriormente + nuevas
      const todasLasImagenes = [...this.imagenesSubidas, ...imagenes];

      const nuevaExperiencia: Experiencia = {
        id: null,
        titulo: this.experienciaForm.value.titulo,
        fechaInicioProyecto: this.experienciaForm.value.fechaInicioProyecto,
        fechaFinProyecto: this.experienciaForm.value.fechaFinProyecto,
        descripcion: this.experienciaForm.value.descripcion,
        link: this.experienciaForm.value.link || '',
        tipoExperiencia: this.experienciaForm.value.tipoExperiencia,
        tecnologiasUsadas: this.experienciaForm.value.tecnologiasUsadas || [],
        imagenes: todasLasImagenes
      };

      console.log('📤 Enviando experiencia a guardar:', JSON.stringify(nuevaExperiencia, null, 2));

      this.experienciaService.save(nuevaExperiencia).subscribe({
        next: (experienciaGuardada) => {
          console.log('✅ Experiencia guardada exitosamente:', experienciaGuardada);
          
          this.experiencias = [...this.experiencias, experienciaGuardada];
          this.successMessage = '✅ Experiencia creada exitosamente';
          this.experienciaForm.reset();
          this.guardando = false;
          
          // Limpiar imágenes
          this.imagenesSeleccionadas = [];
          this.imagenesPreviews = [];
          this.imagenesSubidas = [];
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
    }).catch((err) => {
      console.error('❌ Error al subir imágenes:', err);
      this.errorMessage = '❌ Error al subir las imágenes: ' + (err.error?.message || err.message || 'Error desconocido');
      this.guardando = false;
    });
  }

  cargarExperienciaParaEditar(experiencia: Experiencia): void {
    this.experienciaEditada = { ...experiencia }; // Copia para no modificar original

    // Cargar imágenes existentes en el array de preview
    this.imagenesPreviewsEditar = experiencia.imagenes?.map(img => img.url) || [];
    
    this.editarExperienciaForm.patchValue({
      titulo: experiencia.titulo,
      fechaInicioProyecto: this.formatDateForInput(experiencia.fechaInicioProyecto),
      fechaFinProyecto: this.formatDateForInput(experiencia.fechaFinProyecto),
      descripcion: experiencia.descripcion,
      tipoExperiencia: experiencia.tipoExperiencia,
      tecnologiasUsadas: experiencia.tecnologiasUsadas || [],
      link: experiencia.link || ''
    });
    
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

    if (this.totalImagenesEditar === 0) {
      this.mostrarMensaje('Debe tener al menos una imagen', 'error');
      return;
    }

    this.actualizando = true;
    this.mensaje = '';

    const experienciaActualizada: Experiencia = {
      id: this.experienciaEditada.id,
      titulo: this.editarExperienciaForm.value.titulo,
      fechaInicioProyecto: this.editarExperienciaForm.value.fechaInicioProyecto,
      fechaFinProyecto: this.editarExperienciaForm.value.fechaFinProyecto,
      descripcion: this.editarExperienciaForm.value.descripcion,
      link: this.editarExperienciaForm.value.link || '',
      tipoExperiencia: this.editarExperienciaForm.value.tipoExperiencia,
      tecnologiasUsadas: this.editarExperienciaForm.value.tecnologiasUsadas || [],
      imagenes: this.experienciaEditada.imagenes
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
    this.imagenesPreviewsEditar = [];
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
import { Component, OnInit } from '@angular/core';
import { Experiencia } from '../../Modelo/experiencia';
import { ExperienciaService } from '../../Servicio/experiencia.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TecnologiaUsada } from '../../Modelo/Enums/tecnologiaUsada';
import { TipoExperiencia } from '../../Modelo/Enums/tipoExperiencia';

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

  constructor(
    private experienciaService: ExperienciaService,
    private fb: FormBuilder
  ) {
    // Formulario para crear nueva experiencia
    this.experienciaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      fechaHora: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      tipoExperiencia: ['', [Validators.required]],
      tecnologiaUsada: ['', [Validators.required]]
    });
    
    // Formulario para editar experiencia
    this.editarExperienciaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      fechaHora: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      tipoExperiencia: ['', [Validators.required]],
      tecnologiaUsada: ['', [Validators.required]]
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

  // CREAR NUEVA EXPERIENCIA
  guardarExperiencia(): void {
    if (this.experienciaForm.invalid) {
      this.marcarControlesComoTocados(this.experienciaForm);
      return;
    }

    this.guardando = true;
    this.errorMessage = '';
    this.successMessage = '';

    const nuevaExperiencia: Experiencia = {
      id: null,
      titulo: this.experienciaForm.value.titulo,
      fechaHora: this.experienciaForm.value.fechaHora,
      descripcion: this.experienciaForm.value.descripcion,
      tipoExperiencia: this.experienciaForm.value.tipoExperiencia,
      tecnologiaUsada: this.experienciaForm.value.tecnologiaUsada
    };

    this.experienciaService.save(nuevaExperiencia).subscribe({
      next: (experienciaGuardada) => {
        this.experiencias.push(experienciaGuardada);
        this.successMessage = 'Experiencia creada exitosamente';
        this.experienciaForm.reset();
        this.guardando = false;
        
        // Recargar lista
        this.cargarExperiencias();
      },
      error: (err) => {
        console.error('Error creando experiencia:', err);
        this.errorMessage = 'Error al crear la experiencia: ' + (err.error?.message || err.message);
        this.guardando = false;
      }
    });
  }

  // EDITAR EXPERIENCIA
  cargarExperienciaParaEditar(experiencia: Experiencia): void {
    this.experienciaEditada = experiencia;
    this.editarExperienciaForm.patchValue({
      titulo: experiencia.titulo,
      fechaHora: this.formatDateForInput(experiencia.fechaHora),
      descripcion: experiencia.descripcion,
      tipoExperiencia: experiencia.tipoExperiencia,
      tecnologiaUsada: experiencia.tecnologiaUsada
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
      return;
    }

    if (!this.experienciaEditada?.id) return;

    this.actualizando = true;
    this.mensaje = '';

    const experienciaActualizada: Experiencia = {
      id: this.experienciaEditada.id,
      titulo: this.editarExperienciaForm.value.titulo,
      fechaHora: this.editarExperienciaForm.value.fechaHora,
      descripcion: this.editarExperienciaForm.value.descripcion,
      tipoExperiencia: this.editarExperienciaForm.value.tipoExperiencia,
      tecnologiaUsada: this.editarExperienciaForm.value.tecnologiaUsada
    };

    this.experienciaService.updatExperiencia(this.experienciaEditada.id, experienciaActualizada).subscribe({
      next: (experienciaActualizada) => {
        const index = this.experiencias.findIndex(e => e.id === experienciaActualizada.id);
        if (index !== -1) {
          this.experiencias[index] = experienciaActualizada;
        }
        
        this.mensajeTipo = 'success';
        this.mensaje = 'Experiencia actualizada exitosamente';
        
        setTimeout(() => {
          this.cerrarModalEditar();
          this.cargarExperiencias();
        }, 1500);
      },
      error: (err) => {
        console.error('Error actualizando experiencia:', err);
        this.mensajeTipo = 'error';
        this.mensaje = 'Error al actualizar la experiencia: ' + (err.error?.message || err.message);
        this.actualizando = false;
      },
      complete: () => {
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
    if (!this.experienciaAEliminar?.id) return;

    this.eliminando = true;
    
    this.experienciaService.delete(this.experienciaAEliminar.id).subscribe({
      next: () => {
        this.experiencias = this.experiencias.filter(e => e.id !== this.experienciaAEliminar?.id);
        this.cancelarEliminacion();
        this.mostrarMensaje('Experiencia eliminada exitosamente', 'success');
      },
      error: (err) => {
        console.error('Error eliminando experiencia:', err);
        this.mostrarMensaje('Error al eliminar la experiencia: ' + (err.error?.message || err.message), 'error');
        this.eliminando = false;
      },
      complete: () => {
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
  }

  cancelarEliminacion(): void {
    this.mostrarModalConfirmacion = false;
    this.experienciaAEliminar = null;
    this.eliminando = false;
  }
}

/*export class EditarExperienciasComponent implements OnInit {
  experiencias: Experiencia[] = [];
  
  // Enums para selectores
  tiposExperiencia = Object.values(TipoExperiencia).filter(value => typeof value === 'string');
  tecnologiasUsadas = Object.values(TecnologiaUsada).filter(value => typeof value === 'string');
  
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

  constructor(
    private experienciaService: ExperienciaService,
    private fb: FormBuilder
  ) {
    // Formulario para crear nueva experiencia
    this.experienciaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      fechaHora: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      tipoExperiencia: ['', [Validators.required]],
      tecnologiaUsada: ['', [Validators.required]]
    });
    
    // Formulario para editar experiencia
    this.editarExperienciaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      fechaHora: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      tipoExperiencia: ['', [Validators.required]],
      tecnologiaUsada: ['', [Validators.required]]
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

  // CREAR NUEVA EXPERIENCIA
  guardarExperiencia(): void {
    if (this.experienciaForm.invalid) {
      this.marcarControlesComoTocados(this.experienciaForm);
      return;
    }

    this.guardando = true;
    this.errorMessage = '';
    this.successMessage = '';

    const nuevaExperiencia: Experiencia = {
      id: null,
      titulo: this.experienciaForm.value.titulo,
      fechaHora: this.experienciaForm.value.fechaHora,
      descripcion: this.experienciaForm.value.descripcion,
      tipoExperiencia: this.experienciaForm.value.tipoExperiencia as TipoExperiencia,
      tecnologiaUsada: this.experienciaForm.value.tecnologiaUsada as TecnologiaUsada
    };

    this.experienciaService.save(nuevaExperiencia).subscribe({
      next: (experienciaGuardada) => {
        this.experiencias.push(experienciaGuardada);
        this.successMessage = 'Experiencia creada exitosamente';
        this.experienciaForm.reset();
        this.guardando = false;
        
        // Recargar lista
        this.cargarExperiencias();
      },
      error: (err) => {
        console.error('Error creando experiencia:', err);
        this.errorMessage = 'Error al crear la experiencia: ' + (err.error?.message || err.message);
        this.guardando = false;
      }
    });
  }

  // EDITAR EXPERIENCIA
  cargarExperienciaParaEditar(experiencia: Experiencia): void {
    this.experienciaEditada = experiencia;
    this.editarExperienciaForm.patchValue({
      titulo: experiencia.titulo,
      fechaHora: this.formatDateForInput(experiencia.fechaHora),
      descripcion: experiencia.descripcion,
      tipoExperiencia: experiencia.tipoExperiencia,
      tecnologiaUsada: experiencia.tecnologiaUsada
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
      return;
    }

    if (!this.experienciaEditada?.id) return;

    this.actualizando = true;
    this.mensaje = '';

    const experienciaActualizada: Experiencia = {
      id: this.experienciaEditada.id,
      titulo: this.editarExperienciaForm.value.titulo,
      fechaHora: this.editarExperienciaForm.value.fechaHora,
      descripcion: this.editarExperienciaForm.value.descripcion,
      tipoExperiencia: this.editarExperienciaForm.value.tipoExperiencia as TipoExperiencia,
      tecnologiaUsada: this.editarExperienciaForm.value.tecnologiaUsada as TecnologiaUsada
    };

    this.experienciaService.updatExperiencia(this.experienciaEditada.id, experienciaActualizada).subscribe({
      next: (experienciaActualizada) => {
        const index = this.experiencias.findIndex(e => e.id === experienciaActualizada.id);
        if (index !== -1) {
          this.experiencias[index] = experienciaActualizada;
        }
        
        this.mensajeTipo = 'success';
        this.mensaje = 'Experiencia actualizada exitosamente';
        
        setTimeout(() => {
          this.cerrarModalEditar();
          this.cargarExperiencias();
        }, 1500);
      },
      error: (err) => {
        console.error('Error actualizando experiencia:', err);
        this.mensajeTipo = 'error';
        this.mensaje = 'Error al actualizar la experiencia: ' + (err.error?.message || err.message);
        this.actualizando = false;
      },
      complete: () => {
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
    if (!this.experienciaAEliminar?.id) return;

    this.eliminando = true;
    
    this.experienciaService.delete(this.experienciaAEliminar.id).subscribe({
      next: () => {
        this.experiencias = this.experiencias.filter(e => e.id !== this.experienciaAEliminar?.id);
        this.cancelarEliminacion();
        this.mostrarMensaje('Experiencia eliminada exitosamente', 'success');
      },
      error: (err) => {
        console.error('Error eliminando experiencia:', err);
        this.mostrarMensaje('Error al eliminar la experiencia: ' + (err.error?.message || err.message), 'error');
        this.eliminando = false;
      },
      complete: () => {
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

  // Métodos para formatear enums para visualización
  formatearTipoExperiencia(tipo: TipoExperiencia): string {
    return tipo.toString().replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  formatearTecnologia(tecnologia: TecnologiaUsada): string {
    return tecnologia.toString().charAt(0).toUpperCase() + tecnologia.toString().slice(1).toLowerCase();
  }

  // MODALES
  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.experienciaEditada = null;
    this.editarExperienciaForm.reset();
    this.mensaje = '';
  }

  cancelarEliminacion(): void {
    this.mostrarModalConfirmacion = false;
    this.experienciaAEliminar = null;
    this.eliminando = false;
  }
}*/

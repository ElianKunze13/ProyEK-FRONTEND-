import { Component, OnInit } from '@angular/core';
import { Habilidad } from '../../Modelo/habilidad';
import { HabilidadService } from '../../Servicio/habilidad.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-habilidades',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-habilidades.component.html',
  styleUrl: './editar-habilidades.component.css'
})
export class EditarHabilidadesComponent implements OnInit {
  habilidades: Habilidad[] = [];
  
  // Formularios
  habilidadForm: FormGroup;
  editarHabilidadForm: FormGroup;
  
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
  habilidadEditada: Habilidad | null = null;
  habilidadAEliminar: Habilidad | null = null;

  constructor(
    private habilidadService: HabilidadService,
    private fb: FormBuilder
  ) {
    // Formulario para crear nueva habilidad
    this.habilidadForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]]
    });
    
    // Formulario para editar habilidad
    this.editarHabilidadForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.cargarHabilidades();
  }

  cargarHabilidades(): void {
    this.habilidadService.findAll().subscribe({
      next: (data) => {
        this.habilidades = data;
        console.log('Habilidades cargadas:', this.habilidades);
      },
      error: (err) => {
        console.error('Error cargando habilidades', err);
        this.habilidades = [];
        this.mostrarMensaje('Error al cargar habilidades', 'error');
      }
    });
  }

  // CREAR NUEVA HABILIDAD
  guardarHabilidad(): void {
    if (this.habilidadForm.invalid) {
      this.marcarControlesComoTocados(this.habilidadForm);
      return;
    }

    this.guardando = true;
    this.errorMessage = '';
    this.successMessage = '';

    const nuevaHabilidad: Habilidad = {
      id: null,
      nombre: this.habilidadForm.value.nombre
    };

    this.habilidadService.save(nuevaHabilidad).subscribe({
      next: (habilidadGuardada) => {
        this.habilidades.push(habilidadGuardada);
        this.successMessage = 'Habilidad creada exitosamente';
        this.habilidadForm.reset();
        this.guardando = false;
        
        // Recargar lista
        this.cargarHabilidades();
      },
      error: (err) => {
        console.error('Error creando habilidad:', err);
        this.errorMessage = 'Error al crear la habilidad: ' + (err.error?.message || err.message);
        this.guardando = false;
      }
    });
  }

  // EDITAR HABILIDAD
  cargarHabilidadParaEditar(habilidad: Habilidad): void {
    this.habilidadEditada = habilidad;
    this.editarHabilidadForm.patchValue({
      nombre: habilidad.nombre
    });
    this.mostrarModalEditar = true;
    this.mensaje = '';
  }

  actualizarHabilidad(): void {
    if (this.editarHabilidadForm.invalid) {
      this.marcarControlesComoTocados(this.editarHabilidadForm);
      return;
    }

    if (!this.habilidadEditada?.id) return;

    this.actualizando = true;
    this.mensaje = '';

    const habilidadActualizada: Habilidad = {
      id: this.habilidadEditada.id,
      nombre: this.editarHabilidadForm.value.nombre
    };

    this.habilidadService.updatHabilidad(this.habilidadEditada.id, habilidadActualizada).subscribe({
      next: (habilidadActualizada) => {
        const index = this.habilidades.findIndex(h => h.id === habilidadActualizada.id);
        if (index !== -1) {
          this.habilidades[index] = habilidadActualizada;
        }
        
        this.mensajeTipo = 'success';
        this.mensaje = 'Habilidad actualizada exitosamente';
        
        setTimeout(() => {
          this.cerrarModalEditar();
          this.cargarHabilidades();
        }, 1500);
      },
      error: (err) => {
        console.error('Error actualizando habilidad:', err);
        this.mensajeTipo = 'error';
        this.mensaje = 'Error al actualizar la habilidad: ' + (err.error?.message || err.message);
        this.actualizando = false;
      },
      complete: () => {
        this.actualizando = false;
      }
    });
  }

  // ELIMINAR HABILIDAD
  confirmarEliminacion(habilidad: Habilidad): void {
    this.habilidadAEliminar = habilidad;
    this.mostrarModalConfirmacion = true;
  }

  eliminarHabilidad(): void {
    if (!this.habilidadAEliminar?.id) return;

    this.eliminando = true;
    
    this.habilidadService.delete(this.habilidadAEliminar.id).subscribe({
      next: () => {
        this.habilidades = this.habilidades.filter(h => h.id !== this.habilidadAEliminar?.id);
        this.cancelarEliminacion();
        this.mostrarMensaje('Habilidad eliminada exitosamente', 'success');
      },
      error: (err) => {
        console.error('Error eliminando habilidad:', err);
        this.mostrarMensaje('Error al eliminar la habilidad: ' + (err.error?.message || err.message), 'error');
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

  // MODALES
  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.habilidadEditada = null;
    this.editarHabilidadForm.reset();
    this.mensaje = '';
  }

  cancelarEliminacion(): void {
    this.mostrarModalConfirmacion = false;
    this.habilidadAEliminar = null;
    this.eliminando = false;
  }
}
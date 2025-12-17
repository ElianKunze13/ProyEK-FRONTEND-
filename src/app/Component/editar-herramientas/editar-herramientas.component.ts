import { Component, OnInit } from '@angular/core';
import { Conocimiento } from '../../Modelo/conocimiento';
import { ConocimientoService } from '../../Servicio/conocimiento.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoConocimiento } from '../../Modelo/Enums/tipoConocimiento';
import { Nivel } from '../../Modelo/Enums/nivel';
import { Imagen } from '../../Modelo/imagen';

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

  constructor(
    private conocimientoService: ConocimientoService,
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

    // Preparar array de imágenes
    const imagenes: Imagen[] = [];
    const imagenUrl = this.conocimientoForm.value.imagenUrl;
    const imagenAlt = this.conocimientoForm.value.imagenAlt;

    if (imagenUrl) {
      imagenes.push({
        url: imagenUrl,
        alt: imagenAlt || `Logo de ${this.conocimientoForm.value.nombre}`
      });
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
      imagenes: imagenes
    };

    console.log('Enviando conocimiento a guardar:', nuevoConocimiento);

    this.conocimientoService.save(nuevoConocimiento).subscribe({
      next: (conocimientoCreado) => {
        console.log('✅ Conocimiento creado exitosamente:', conocimientoCreado);
        
        this.successMessage = 'Conocimiento creado exitosamente';
        this.guardando = false;
        
        this.conocimientos.unshift(conocimientoCreado);
        this.conocimientoForm.reset();
        
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
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

    // Obtener la primera imagen si existe
    const primeraImagen = conocimiento.imagenes && conocimiento.imagenes.length > 0 
      ? conocimiento.imagenes[0] 
      : { url: '', alt: '' };

    // Convertir enum a string para el formulario
    const nivelString = this.convertirNivelAString(conocimiento.nivel);
    const tipoString = this.convertirTipoConocimientoAString(conocimiento.tipoConocimiento);

    // Actualizar el formulario con los datos
    this.editarConocimientoForm.patchValue({
      nombre: conocimiento.nombre,
      nivel: nivelString,
      tipoConocimiento: tipoString,
      imagenUrl: primeraImagen.url,
      imagenAlt: primeraImagen.alt
    });

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

    // Preparar array de imágenes
    const imagenes: Imagen[] = [];
    const imagenUrl = this.editarConocimientoForm.value.imagenUrl;
    const imagenAlt = this.editarConocimientoForm.value.imagenAlt;

    if (imagenUrl) {
      imagenes.push({
        url: imagenUrl,
        alt: imagenAlt || `Logo de ${this.editarConocimientoForm.value.nombre}`
      });
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
      imagenes: imagenes
    };

    console.log('Actualizando conocimiento:', conocimientoActualizado);

    this.conocimientoService.updateReporte(this.conocimientoEditado.id, conocimientoActualizado).subscribe({
      next: (conocimientoActualizadoResp) => {
        console.log('✅ Conocimiento actualizado exitosamente:', conocimientoActualizadoResp);
        
        this.mostrarMensaje('¡Conocimiento actualizado con éxito!', 'success');
        this.actualizando = false;
        
        // Actualizar el conocimiento en la lista
        const index = this.conocimientos.findIndex(c => c.id === this.conocimientoEditado?.id);
        if (index !== -1) {
          this.conocimientos[index] = { ...conocimientoActualizadoResp };
        }
        
        // Cerrar el modal después de 2 segundos
        setTimeout(() => {
          this.cerrarModalEditar();
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
        
        // Remover el conocimiento de la lista
        this.conocimientos = this.conocimientos.filter(c => c.id !== conocimientoId);
        
        // Mostrar mensaje de éxito
        this.successMessage = `Conocimiento "${nombreConocimiento}" eliminado exitosamente`;
        
        this.eliminando = false;
        this.mostrarModalConfirmacion = false;
        this.conocimientoAEliminar = null;
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
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
        
        // Ocultar mensaje después de 10 segundos
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
  }

  // Método para cerrar el modal de edición
  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.mensaje = '';
    this.editarConocimientoForm.reset();
    this.actualizando = false;
    this.conocimientoEditado = null;
  }

  // Métodos auxiliares para acceso a controles
  get nombre() { return this.conocimientoForm.get('nombre'); }
  get nivel() { return this.conocimientoForm.get('nivel'); }
  get tipoConocimiento() { return this.conocimientoForm.get('tipoConocimiento'); }
}
/*export class EditarHerramientasComponent implements OnInit {
  expandedIndex: number | null = null;
conocimientos: Conocimiento[] = [];

constructor(
    private conocimientoService: ConocimientoService,
  ) {}
  ngOnInit() {
    this.cargarConocimientos();
  }

  cargarConocimientos(): void {
    this.conocimientoService.findAll().subscribe({
      next: (data: Conocimiento[]) => {
        console.log('✅ Datos recibidos:', data);
        this.conocimientos = data;
      },
      error: (error) => {
        console.error('Error al cargar lista:', error);
        this.conocimientos = [];
      }
    });
  }

}*/

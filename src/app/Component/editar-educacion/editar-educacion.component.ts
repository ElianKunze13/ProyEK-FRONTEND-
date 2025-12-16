import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Educacion } from '../../Modelo/educacion';
import { EducacionService } from '../../Servicio/educacion.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Imagen } from '../../Modelo/imagen';
import { TipoEducacion } from '../../Modelo/Enums/tipoEducacion';

@Component({
  selector: 'app-editar-educacion',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './editar-educacion.component.html',
  styleUrl: './editar-educacion.component.css'
})
export class EditarEducacionComponent implements OnInit {
  expandedIndex: number | null = null;
  educaciones: Educacion[] = [];
  educacionForm!: FormGroup;
  guardando: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private educacionService: EducacionService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.inicializarFormulario();
    this.cargarEducaciones();
  }

  inicializarFormulario(): void {
    this.educacionForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      //fechaObtencion: ['', Validators.required],
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
      // Marcar todos los campos como tocados para mostrar errores
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
      id: null, // El backend generará el ID
      titulo: this.educacionForm.value.titulo,
      descripcion: this.educacionForm.value.descripcion,
      //fechaObtencion: new Date(this.educacionForm.value.fechaObtencion),
      tipoEducacion: this.educacionForm.value.tipoEducacion as TipoEducacion,
      imagenes: imagenes
    };

    console.log('Enviando educación:', nuevaEducacion);

    // Llamar al servicio save
    this.educacionService.save(nuevaEducacion).subscribe({
      next: (educacionCreada) => {
        console.log('✅ Educación creada exitosamente:', educacionCreada);
        
        this.successMessage = 'Educación creada exitosamente';
        this.guardando = false;
        
        // Agregar la nueva educación a la lista
        this.educaciones.unshift(educacionCreada);
        
        // Limpiar el formulario
        this.educacionForm.reset();
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (error) => {
        console.error('❌ Error al crear educación:', error);
        this.guardando = false;
        
        // Manejar diferentes tipos de errores
        if (error.status === 400) {
          if (error.error && error.error.errors) {
            // Errores de validación del backend
            const errores = Object.values(error.error.errors).join(', ');
            this.errorMessage = `Error de validación: ${errores}`;
          } else {
            this.errorMessage = 'Error en los datos enviados. Verifique la información.';
          }
        } else if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'No tiene permisos para realizar esta acción';
        } else {
          this.errorMessage = 'Error al guardar la educación. Intente nuevamente.';
        }
        
        // Ocultar mensaje después de 10 segundos
        setTimeout(() => {
          this.errorMessage = '';
        }, 10000);
      }
    });
  }

  cargarEducacionParaEditar(educacion: Educacion): void {
    // Aquí puedes implementar la lógica para editar
    console.log('Cargando educación para editar:', educacion);
    // Podrías abrir un modal o navegar a otra página
    // Por ahora solo mostramos un mensaje en consola
    alert(`Editar educación: ${educacion.titulo}`);
  }

  // Métodos auxiliares para acceder a los controles del formulario
  get titulo() { return this.educacionForm.get('titulo'); }
  get descripcion() { return this.educacionForm.get('descripcion'); }
  //get fechaObtencion() { return this.educacionForm.get('fechaObtencion'); }
  get tipoEducacion() { return this.educacionForm.get('tipoEducacion'); }
}
/*export class EditarEducacionComponent {
   expandedIndex: number | null = null;
 educaciones: Educacion[]=[];

constructor(private educacionService: EducacionService){}

ngOnInit() {
  this.cargarEducaciones();
}

  cargarEducaciones(): void {
    this.educacionService.findAll().subscribe({
        next: (data: Educacion[])=>{
           console.log('✅ Datos recibidos:', data);
          console.log('📊 Cantidad de items:', data.length);
          console.log('🔍 Estructura del primer item:', data[0]);
          
          this.educaciones=data;
          console.log(JSON.stringify(this.educaciones))
        },
        error: () =>{
          this.educaciones=[];
          console.log(JSON.stringify(this.educaciones))
  
          console.log("Error al cargar lista")
        }
      })
  
  
  
  
  }


}*/

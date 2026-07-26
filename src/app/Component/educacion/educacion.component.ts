import { Component, OnInit } from '@angular/core';
import { Educacion } from '../../Modelo/educacion';
import { EducacionService } from '../../Servicio/educacion.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-educacion',
  imports: [CommonModule],
  templateUrl: './educacion.component.html',
  styleUrl: './educacion.component.css'
})
export class EducacionComponent implements OnInit {
  expandedIndex: number | null = null;
  educaciones: Educacion[] = [];
  mostrarPopup = false;
  educacionSeleccionada: Educacion | null = null;

  constructor(private educacionService: EducacionService) {}

  ngOnInit() {
    this.cargarEducaciones();
    setTimeout(() => {
      const mainPage = document.getElementById('main-page');
      if (mainPage) {
        mainPage.classList.add('slide-left-enter');
      }
    }, 50);
  }

  cargarEducaciones(): void {
    this.educacionService.findAll().subscribe({
      next: (data: Educacion[]) => {
        console.log('✅ Datos recibidos:', data);
        console.log('📊 Cantidad de items:', data.length);
        this.educaciones = data;
      },
      error: () => {
        this.educaciones = [];
        console.log("Error al cargar lista");
      }
    });
  }

  verdetalles(educacion: Educacion): void {
    console.log('Ver certificado de:', educacion.titulo);
    this.educacionSeleccionada = educacion;
    this.mostrarPopup = true;
  }

  cerrarPopup(): void {
    this.mostrarPopup = false;
    this.educacionSeleccionada = null;
  }

  // Método auxiliar para formatear fechas si el pipe date no funciona
  formatDate(date: Date | undefined): string {
    if (!date) return 'No disponible';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }
}
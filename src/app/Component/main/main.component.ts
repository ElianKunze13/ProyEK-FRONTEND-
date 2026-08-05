import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Conocimiento } from '../../Modelo/conocimiento';
import { ConocimientoService, TipoConocimiento } from '../../Servicio/conocimiento.service';

@Component({
  selector: 'app-main',
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  expandedIndex: number | null = null;

  // Un solo objeto para almacenar todos los tipos
  conocimientos: { [key in TipoConocimiento]?: Conocimiento[] } = {};
  
  // Estado de carga por tipo
  loadingStates: { [key in TipoConocimiento]?: boolean } = {};
  
  // Estado de error por tipo
  errorStates: { [key in TipoConocimiento]?: boolean } = {};
  
  // Para facilitar el acceso en el template
  tipos: TipoConocimiento[] = ['FRONTEND', 'BACKEND', 'BASE_DATOS', 'TESTING', 'OTROS', 'IA', 'PROTOTIPO'];

  constructor(private conocimientoService: ConocimientoService) {}

  ngOnInit() {
    this.cargarTodosLosConocimientos();

    // Agregar animación de entrada cuando se carga el componente
    setTimeout(() => {
      const mainPage = document.getElementById('main-page');
      if (mainPage) {
        mainPage.classList.add('slide-left-enter');
      }
    }, 50);
  }

  // Método único para cargar todos los tipos de conocimientos
  cargarTodosLosConocimientos(): void {
    this.tipos.forEach(tipo => {
      this.cargarConocimientosPorTipo(tipo);
    });
  }

  // Método único para cargar por tipo específico
  cargarConocimientosPorTipo(tipo: TipoConocimiento): void {
    // Iniciar estado de carga
    this.loadingStates[tipo] = true;
    this.errorStates[tipo] = false;
    this.conocimientos[tipo] = [];

    this.conocimientoService.findByTipo(tipo).subscribe({
      next: (data: Conocimiento[]) => {
        console.log(`✅ Datos recibidos para ${tipo}:`, data);
        console.log(`📊 Cantidad de items para ${tipo}:`, data.length);
        
        this.conocimientos[tipo] = data;
        this.loadingStates[tipo] = false;
        this.errorStates[tipo] = false;
        
        console.log(JSON.stringify(this.conocimientos[tipo]));
      },
      error: (error) => {
        console.error(`❌ Error al cargar lista de ${tipo}:`, error);
        this.conocimientos[tipo] = [];
        this.loadingStates[tipo] = false;
        this.errorStates[tipo] = true;
      }
    });
  }

  // Método para recargar un tipo específico (útil después de crear/editar/eliminar)
  recargarPorTipo(tipo: TipoConocimiento): void {
    this.cargarConocimientosPorTipo(tipo);
  }

  // Método para verificar si un tipo tiene datos
  tieneDatos(tipo: TipoConocimiento): boolean {
    return !!(this.conocimientos[tipo] && this.conocimientos[tipo]!.length > 0);
  }

  // Método para obtener el total de conocimientos
  getTotalConocimientos(): number {
    let total = 0;
    this.tipos.forEach(tipo => {
      if (this.conocimientos[tipo]) {
        total += this.conocimientos[tipo]!.length;
      }
    });
    return total;
  }

  // Método para verificar si hay algún error
  hayError(): boolean {
    return this.tipos.some(tipo => this.errorStates[tipo]);
  }

  // Método para verificar si está cargando
  estaCargando(): boolean {
    return this.tipos.some(tipo => this.loadingStates[tipo]);
  }
}
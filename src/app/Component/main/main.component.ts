import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Conocimiento } from '../../Modelo/conocimiento';
import { ConocimientoService} from '../../Servicio/conocimiento.service';
import { TipoConocimiento } from '../../Modelo/Enums/tipoConocimiento';

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
  
  // Todos los tipos disponibles (ordenados para mejor visualización)
  tipos: TipoConocimiento[] = [
    TipoConocimiento.FRONTEND,
    TipoConocimiento.BACKEND,
    TipoConocimiento.BASE_DATOS,
    TipoConocimiento.TESTING,
    TipoConocimiento.IA,
    TipoConocimiento.PROTOTIPO,
    TipoConocimiento.DISENIO,  
    TipoConocimiento.OTROS
  ];

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

  // Método para verificar si hay algún error
  hayError(): boolean {
    return this.tipos.some(tipo => this.errorStates[tipo]);
  }

  // Método para verificar si está cargando
  estaCargando(): boolean {
    return this.tipos.some(tipo => this.loadingStates[tipo]);
  }
}
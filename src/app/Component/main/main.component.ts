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
export class MainComponent implements OnInit{
    expandedIndex: number | null = null;

// Un solo objeto para almacenar todos los tipos
  conocimientos: { [key in TipoConocimiento]?: Conocimiento[] } = {};
  
  // Para facilitar el acceso en el template
  tipos: TipoConocimiento[] = ['FRONTEND', 'BACKEND', 'BASE_DATOS', 'TESTING', 'OTROS', 'IA', 'PROTOTIPO'];
  
  /*conFront:Conocimiento[] =[];
  conBack:Conocimiento[] =[];
  conBD:Conocimiento[] =[];
  conTest:Conocimiento[] =[];
  conOtros:Conocimiento[] =[];
conIA:Conocimiento[] =[];
conProt:Conocimiento[] =[];
*/

   constructor(private conocimientoService: ConocimientoService){}

   ngOnInit() {

    this.cargarTodosLosConocimientos();

    /*this.cargarConocimientosFront();
    this.cargarConocimientosBack();
    this.cargarConocimientosBD();
    this.cargarConocimientosTest();
    this.cargarConocimientosOtros();
   this.cargarConocimientosIA();
   this.cargarConocimientosPrototipo();*/


    // Agregar animación de entrada cuando se carga el componente
    setTimeout(() => {
      const mainPage = document.getElementById('main-page');
      if (mainPage) {
        mainPage.classList.add('slide-left-enter');
      }
    }, 50); // Pequeño delay para que Angular renderice primero
  }

   // Método único para cargar todos los tipos de conocimientos
  cargarTodosLosConocimientos(): void {
    this.tipos.forEach(tipo => {
      this.cargarConocimientosPorTipo(tipo);
    });
  }
  // Método único para cargar por tipo específico
  cargarConocimientosPorTipo(tipo: TipoConocimiento): void {
    this.conocimientoService.findByTipo(tipo).subscribe({
      next: (data: Conocimiento[]) => {
        console.log(`✅ Datos recibidos para ${tipo}:`, data);
        console.log(`📊 Cantidad de items para ${tipo}:`, data.length);
        
        this.conocimientos[tipo] = data;
        console.log(JSON.stringify(this.conocimientos[tipo]));
      },
      error: () => {
        this.conocimientos[tipo] = [];
        console.log(`Error al cargar lista de ${tipo}`);
      }
    });
  }

  // Método para recargar un tipo específico (útil después de crear/editar/eliminar)
  recargarPorTipo(tipo: TipoConocimiento): void {
    this.cargarConocimientosPorTipo(tipo);
  }


 /* cargarConocimientosFront(): void{
    this.conocimientoService.findFrontend().subscribe({
      next: (data: Conocimiento[])=>{
         console.log('✅ Datos recibidos:', data);
        console.log('📊 Cantidad de items:', data.length);
        console.log('🔍 Estructura del primer item:', data[0]);
        
        this.conFront=data;
        console.log(JSON.stringify(this.conFront))
      },
      error: () =>{
        this.conFront=[];
        console.log(JSON.stringify(this.conFront))

        console.log("Error al cargar lista")
      }
    })
  }
 cargarConocimientosBack(): void{
    this.conocimientoService.findBackend().subscribe({
      next: (data: Conocimiento[])=>{
         console.log('✅ Datos recibidos:', data);
        console.log('📊 Cantidad de items:', data.length);
        console.log('🔍 Estructura del primer item:', data[0]);
        
        this.conBack=data;
        console.log(JSON.stringify(this.conBack))
      },
      error: () =>{
        this.conFront=[];
        console.log(JSON.stringify(this.conBack))

        console.log("Error al cargar lista")
      }
    })
  }
 cargarConocimientosBD(): void{
    this.conocimientoService.findBD().subscribe({
      next: (data: Conocimiento[])=>{
         console.log('✅ Datos recibidos:', data);
        console.log('📊 Cantidad de items:', data.length);
        console.log('🔍 Estructura del primer item:', data[0]);
        
        this.conBD=data;
        console.log(JSON.stringify(this.conBD))
      },
      error: () =>{
        this.conFront=[];
        console.log(JSON.stringify(this.conBD))

        console.log("Error al cargar lista")
      }
    })
  }
   cargarConocimientosTest(): void{
    this.conocimientoService.findTesting().subscribe({
      next: (data: Conocimiento[])=>{
         console.log('✅ Datos recibidos:', data);
        console.log('📊 Cantidad de items:', data.length);
        console.log('🔍 Estructura del primer item:', data[0]);
        
        this.conTest=data;
        console.log(JSON.stringify(this.conTest))
      },
      error: () =>{
        this.conTest=[];
        console.log(JSON.stringify(this.conTest))

        console.log("Error al cargar lista")
      }
    })
  }
   cargarConocimientosOtros(): void{
    this.conocimientoService.findOtros().subscribe({
      next: (data: Conocimiento[])=>{
         console.log('✅ Datos recibidos:', data);
        console.log('📊 Cantidad de items:', data.length);
        console.log('🔍 Estructura del primer item:', data[0]);
        
        this.conOtros=data;
        console.log(JSON.stringify(this.conOtros))
      },
      error: () =>{
        this.conOtros=[];
        console.log(JSON.stringify(this.conOtros))

        console.log("Error al cargar lista")
      }
    })
  }

 cargarConocimientosIA(): void{
    this.conocimientoService.findIA().subscribe({
      next: (data: Conocimiento[])=>{
         console.log('✅ Datos recibidos:', data);
        console.log('📊 Cantidad de items:', data.length);
        console.log('🔍 Estructura del primer item:', data[0]);
        
        this.conIA=data;
        console.log(JSON.stringify(this.conIA))
      },
      error: () =>{
        this.conIA=[];
        console.log(JSON.stringify(this.conIA))
        console.log("Error al cargar lista")
      }
    })
  }

  cargarConocimientosPrototipo(): void{
    this.conocimientoService.findModelado().subscribe({
      next: (data: Conocimiento[])=>{
         console.log('✅ Datos recibidos:', data);
        console.log('📊 Cantidad de items:', data.length);
        console.log('🔍 Estructura del primer item:', data[0]);
        
        this.conProt=data;
        console.log(JSON.stringify(this.conProt))
      },
      error: () =>{
        this.conProt=[];
        console.log(JSON.stringify(this.conProt))
        console.log("Error al cargar lista")
      }
    })
  }
 */
}

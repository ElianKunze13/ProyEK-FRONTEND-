import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Conocimiento } from '../../Modelo/conocimiento';
import { ConocimientoService } from '../../Servicio/conocimiento.service';

@Component({
  selector: 'app-main',
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit{
    expandedIndex: number | null = null;

  conFront:Conocimiento[] =[];
  conBack:Conocimiento[] =[];
  conBD:Conocimiento[] =[];
  conTest:Conocimiento[] =[];
  conOtros:Conocimiento[] =[];

   constructor(private conocimientoService: ConocimientoService){}

   ngOnInit() {
    this.cargarConocimientosFront();
    this.cargarConocimientosBack();
    this.cargarConocimientosBD();
    this.cargarConocimientosTest();
    this.cargarConocimientosOtros();

    // Agregar animación de entrada cuando se carga el componente
    setTimeout(() => {
      const mainPage = document.getElementById('main-page');
      if (mainPage) {
        mainPage.classList.add('slide-left-enter');
      }
    }, 50); // Pequeño delay para que Angular renderice primero
  }

  cargarConocimientosFront(): void{
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
        
        this.conFront=data;
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
        
        this.conFront=data;
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
        
        this.conFront=data;
        console.log(JSON.stringify(this.conTest))
      },
      error: () =>{
        this.conFront=[];
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
        
        this.conFront=data;
        console.log(JSON.stringify(this.conOtros))
      },
      error: () =>{
        this.conFront=[];
        console.log(JSON.stringify(this.conOtros))

        console.log("Error al cargar lista")
      }
    })
  }

}

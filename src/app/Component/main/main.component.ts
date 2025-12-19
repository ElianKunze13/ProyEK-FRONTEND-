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
conIA:Conocimiento[] =[];
conProt:Conocimiento[] =[];

   constructor(private conocimientoService: ConocimientoService){}

   ngOnInit() {
    this.cargarConocimientosFront();
    this.cargarConocimientosBack();
    this.cargarConocimientosBD();
    this.cargarConocimientosTest();
    this.cargarConocimientosOtros();
   this.cargarConocimientosIA();
   this.cargarConocimientosPrototipo();


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
 
}

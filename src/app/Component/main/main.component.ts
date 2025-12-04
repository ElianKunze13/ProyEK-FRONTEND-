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

  conocimientosVal:Conocimiento[] =[];
  

   constructor(private conocimientoService: ConocimientoService){}

   ngOnInit() {
    this.cargarListaConocimientos();

    // Agregar animación de entrada cuando se carga el componente
    setTimeout(() => {
      const mainPage = document.getElementById('main-page');
      if (mainPage) {
        mainPage.classList.add('slide-left-enter');
      }
    }, 50); // Pequeño delay para que Angular renderice primero
  }

  cargarListaConocimientos(): void{
    this.conocimientoService.findAll().subscribe({
      next: (data: Conocimiento[])=>{this.conocimientosVal=data;
        console.log(JSON.stringify(this.conocimientosVal))
      },
      error: () =>{
        this.conocimientosVal=[];
        console.log("Error al cargar lista")
      }
    })
  }



}

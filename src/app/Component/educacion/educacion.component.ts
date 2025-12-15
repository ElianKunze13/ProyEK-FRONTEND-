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
export class EducacionComponent implements OnInit{
    expandedIndex: number | null = null;
 educaciones: Educacion[]=[];

constructor(private educacionService: EducacionService){}

ngOnInit() {
  this.cargarEducaciones();
    // Agregar animación de entrada cuando se carga el componente
    setTimeout(() => {
      const mainPage = document.getElementById('main-page');
      if (mainPage) {
        mainPage.classList.add('slide-left-enter');
      }
    }, 50); // Pequeño delay para que Angular renderice primero
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

  
mostrarPopup = false;

verdetalles(reencuentro: any) {
  this.mostrarPopup = true;
}

cerrarPopup() {
  this.mostrarPopup = false;
}

abrirPopup(reencuentro: any) {
  console.log('Ver certificado');
  this.mostrarPopup = true;
}
}

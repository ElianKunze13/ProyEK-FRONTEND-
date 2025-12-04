import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-educacion',
  imports: [],
  templateUrl: './educacion.component.html',
  styleUrl: './educacion.component.css'
})
export class EducacionComponent implements OnInit{
ngOnInit() {
    // Agregar animación de entrada cuando se carga el componente
    setTimeout(() => {
      const mainPage = document.getElementById('main-page');
      if (mainPage) {
        mainPage.classList.add('slide-left-enter');
      }
    }, 50); // Pequeño delay para que Angular renderice primero
  }
}

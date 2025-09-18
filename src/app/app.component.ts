import { Component } from '@angular/core';
import { InicioComponent } from "./Component/inicio/inicio.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, InicioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PortofolioEK';
   
    
  
}

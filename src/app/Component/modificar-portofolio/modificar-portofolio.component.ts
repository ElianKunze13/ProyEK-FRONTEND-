import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from '../../Servicio/auth2/login.service';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-modificar-portofolio',
  imports: [RouterLink],
  templateUrl: './modificar-portofolio.component.html',
  styleUrl: './modificar-portofolio.component.css'
})
export class ModificarPortofolioComponent{
 

 
}

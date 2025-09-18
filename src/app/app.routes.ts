import { Routes } from '@angular/router';

export const routes: Routes = [

// Ruta raíz redirige a inicio
    { path: "", redirectTo: "/inicio", pathMatch: "full" },
{
    path:"inicio", 
    loadComponent: () => import("./Component/inicio/inicio.component")
    .then(m => m.InicioComponent)
},
{
    path:"main", 
    loadComponent: () => import("./Component/main/main.component")
    .then(m => m.MainComponent)
},

];

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
{ 
    path: "login",
    loadComponent: () => import("./Component/login/login/login.component")
    .then(m => m.LoginComponent)
},
{ 
    path: "perfil",
    loadComponent: () => import("./Component/perfil/perfil.component")
    .then(m => m.PerfilComponent)
},
{ 
    path: "formularios",
    loadComponent: () => import("./Component/formulario/formulario.component")
    .then(m => m.FormularioComponent)
},
{
      path:'**',
      loadComponent:() => import('./Component/inicio/inicio.component').then(m => m.InicioComponent)
    },

];

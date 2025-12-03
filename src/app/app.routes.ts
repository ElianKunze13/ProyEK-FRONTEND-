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
    loadComponent: () => import("./Component/login/login.component")
    .then(m => m.LoginComponent)
},
{ 
    path: "perfil",
    loadComponent: () => import("./Component/perfil/perfil.component")
    .then(m => m.PerfilComponent)
},{ 
    path: "contacto",
    loadComponent: () => import("./Component/contacto/contacto.component")
    .then(m => m.ContactoComponent)
},

{ 
    path: "actualizarPortofolio",
    loadComponent: () => import("./Component/modificar-portofolio/modificar-portofolio.component")
    .then(m => m.ModificarPortofolioComponent)
},
{ 
    path: "actualizarPerfil",
    loadComponent: () => import("./Component/modificar-perfil/modificar-perfil.component")
    .then(m => m.ModificarPerfilComponent)
},
{
      path:'**',
      loadComponent:() => import('./Component/inicio/inicio.component').then(m => m.InicioComponent)
    },

];

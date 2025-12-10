import { Routes } from '@angular/router';
import { AuthGuard } from './Servicio/auth2/Auth.guard';

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
    path: "perfilUsuario",
    loadComponent: () => import("./Component/perfil/perfil.component")
    .then(m => m.PerfilComponent)
},{ 
    path: "contacto",
    loadComponent: () => import("./Component/contacto/contacto.component")
    .then(m => m.ContactoComponent)
},{ 
    path: "educacion",
    loadComponent: () => import("./Component/educacion/educacion.component")
    .then(m => m.EducacionComponent)
},

{ 
    path: "actualizarPortofolio",
    canActivate: [AuthGuard],
    loadComponent: () => import("./Component/modificar-portofolio/modificar-portofolio.component")
    .then(m => m.ModificarPortofolioComponent)
},
{ 
    path: "actualizarPerfil",
    canActivate: [AuthGuard],
    loadComponent: () => import("./Component/modificar-perfil/modificar-perfil.component")
    .then(m => m.ModificarPerfilComponent)
},
{ 
    path: "panelEducacion",
    canActivate: [AuthGuard],
    loadComponent: () => import("./Component/editar-educacion/editar-educacion.component")
    .then(m => m.EditarEducacionComponent)
},
{ 
    path: "panelExperiencia",
    canActivate: [AuthGuard],
    loadComponent: () => import("./Component/editar-experiencias/editar-experiencias.component")
    .then(m => m.EditarExperienciasComponent)
},
{ 
    path: "panelHabilidad",
    canActivate: [AuthGuard],
    loadComponent: () => import("./Component/editar-habilidades/editar-habilidades.component")
    .then(m => m.EditarHabilidadesComponent)
},
{ 
    path: "panelHerramienta",
    canActivate: [AuthGuard],
    loadComponent: () => import("./Component/editar-herramientas/editar-herramientas.component")
    .then(m => m.EditarHerramientasComponent)
},
{
      path:'**',
      loadComponent:() => import('./Component/inicio/inicio.component').then(m => m.InicioComponent)
    },

];

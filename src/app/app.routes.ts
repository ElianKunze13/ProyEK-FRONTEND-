import { Routes } from '@angular/router';
import { AdminGuard } from './Guards/Admin.guard';
import { AuthGuard } from './Guards/Auth.guard';

export const routes: Routes = [
     
    ///SOLUCIONAR:
    ///AdminGuard no funciona, ya que aun siendo usuario ADMIN, rutas que requieren AdminGuard
    //  no se pueden acceder, pero si se accede a rutas que requieren AuthGuard, si se puede acceder
    //  sin problemas, incluso siendo usuario ADMIN, por lo tanto el problema es que AdminGuard no funciona,
    //  y no se por que, ya que el codigo de AdminGuard es igual al de AuthGuard, y ambos funcionan con el 
    // mismo servicio de LoginService, y ambos tienen el mismo constructor, y ambos tienen el mismo metodo
    //  canActivate, por lo tanto no entiendo porque AdminGuard no funciona, y AuthGuard si funciona.

    //canActivate: [AuthGuard,AdminGuard],

// Ruta raíz redirige a inicio
    { path: "", redirectTo: "/inicio", pathMatch: "full" },
{
    path:"inicio",//PUBLICA: seccion presentacion inicial (btn INGRESAR)
    loadComponent: () => import("./Component/inicio/inicio.component")
    .then(m => m.InicioComponent)
},
{
    path:"main", //PUBLICA seccion de herramientas
    loadComponent: () => import("./Component/main/main.component")
    .then(m => m.MainComponent)
},
{ 
    path: "login",//PUBLICA
    loadComponent: () => import("./Component/login/login.component")
    .then(m => m.LoginComponent)
},
{ 
    path: "perfilUsuario",//PUBLICA:seccion MI PERFIL
    loadComponent: () => import("./Component/perfil/perfil.component")
    .then(m => m.PerfilComponent)
},{ 
    path: "contacto",//PUBLICA: seccion CONTACTOS
    loadComponent: () => import("./Component/contacto/contacto.component")
    .then(m => m.ContactoComponent)
},{ 
    path: "educacion",//PUBLICA: seccion ESTUDIOS
    loadComponent: () => import("./Component/educacion/educacion.component")
    .then(m => m.EducacionComponent)
},

{ 
    path: "actualizarPortofolio",//PRIVADA
    canActivate: [AuthGuard],
    loadComponent: () => import("./Component/modificar-portofolio/modificar-portofolio.component")
    .then(m => m.ModificarPortofolioComponent)
},
{ 
    path: "actualizarPerfil",//PRIVADA
    canActivate: [AuthGuard],
    loadComponent: () => import("./Component/actualizar-perfil/actualizar-perfil.component")
    .then(m => m.ActualizarPerfilComponent)
},
{ 
    path: "panelEducacion",//PRIVADA
    canActivate: [AuthGuard],//AdminGuard
    loadComponent: () => import("./Component/editar-educacion/editar-educacion.component")
    .then(m => m.EditarEducacionComponent)
},
{ 
    path: "panelExperiencia",//PRIVADA
    canActivate: [AuthGuard],
    loadComponent: () => import("./Component/editar-experiencias/editar-experiencias.component")
    .then(m => m.EditarExperienciasComponent)
},
{ 
    path: "panelHabilidad",//PRIVADA
    canActivate: [AuthGuard],
    loadComponent: () => import("./Component/editar-habilidades/editar-habilidades.component")
    .then(m => m.EditarHabilidadesComponent)
},
{ 
    path: "panelHerramienta",//PRIVADA
    canActivate: [AuthGuard],
    loadComponent: () => import("./Component/editar-herramientas/editar-herramientas.component")
    .then(m => m.EditarHerramientasComponent)
},
{
      path:'**',
      loadComponent:() => import('./Component/inicio/inicio.component').then(m => m.InicioComponent)
    },

];

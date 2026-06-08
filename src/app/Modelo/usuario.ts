import { Role } from "./Enums/role";
import { Imagen } from "./imagen";

export interface Usuario {
    id: any;
    nombre: string;
    username: string;
    password: string;
    rol: Role;
    
    introduccion: string;
    descripcion: string;
    
    //fotoUsuario: Imagen[];
    fotoPerfil?: Imagen;  // Cambiado de lista a imagen unica
    fotoPortada?: Imagen;  // Cambiado de lista a imagen unica

      active: boolean;

}
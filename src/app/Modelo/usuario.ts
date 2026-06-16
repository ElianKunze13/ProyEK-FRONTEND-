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

    fotoPerfil?: Imagen; 
    fotoPortada?: Imagen; 

//videoPresentacion?: Video;

      active: boolean;

}
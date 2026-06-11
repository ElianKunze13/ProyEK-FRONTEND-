import { Role } from "./Enums/role";
import { Imagen } from "./imagen";
import { Video } from "./video";

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

video?: Video;

      active: boolean;

}
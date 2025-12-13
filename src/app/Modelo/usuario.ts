import { Role } from "./Enums/role";
import { Imagen } from "./imagen";

export interface Usuario {
    id: any;
    nombre: string;
    username: string;
    password: string;
    rol: Role;
    descripcion: string;
    fotoUsuario: Imagen[];
      active: boolean;

}
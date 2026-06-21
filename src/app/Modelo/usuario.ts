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

//atributo video no se incluye en el modelo de usuario, ya que no es relevante para la información
//  básica del usuario. Si es necesario, se puede agregar y traer desde assets

      active: boolean;

}
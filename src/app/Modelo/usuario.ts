import { Role } from "./Enums/role";

export interface Usuario{
    id: any;
        nombre: string;
        telefono: string;
username: string;
password: string;
rol: Role;
}
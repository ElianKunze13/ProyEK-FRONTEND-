import { Nivel } from "./Enums/nivel";
import { TipoEducacion } from "./Enums/tipoEducacion";
import { Imagen } from "./imagen";

export interface Educacion{
    id: any;
        descripcion: string;
        nivel: Nivel;
        tipoEducacion: TipoEducacion;
        imagenes: Imagen[];
}
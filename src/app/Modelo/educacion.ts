import { TipoEducacion } from "./Enums/tipoEducacion";
import { Imagen } from "./imagen";

export interface Educacion{
    id: any;
    titulo: string;
        descripcion: string;
        tipoEducacion: TipoEducacion;
        imagenes: Imagen[];
}
import { TipoEducacion } from "./Enums/tipoEducacion";
import { Imagen } from "./imagen";

export interface Educacion{
    id: any;
    titulo: string;
    //fechaObtencion: Date;
        descripcion: string;
        tipoEducacion: TipoEducacion;
        imagenes: Imagen[];
}
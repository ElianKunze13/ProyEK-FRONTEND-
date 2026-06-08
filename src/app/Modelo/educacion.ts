import { TipoEducacion } from "./Enums/tipoEducacion";
import { Imagen } from "./imagen";

export interface Educacion {
    id: any;
    titulo: string;
    fechaInicio: Date;
    fechaObtencion: Date;
    descripcion: string;
    tipoEducacion: TipoEducacion;
    imagen?: Imagen;
}
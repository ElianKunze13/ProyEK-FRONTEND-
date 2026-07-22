import { TipoEducacion } from "./Enums/tipoEducacion";
import { Imagen } from "./imagen";

export interface Educacion {
    id: any;
    titulo: string;
    fechaInicio: Date | undefined;
    fechaObtencion: Date | undefined;
    descripcion: string;
    tipoEducacion: TipoEducacion;
    imagen?: Imagen;
}
import { TipoEducacion } from "./Enums/tipoEducacion";
import { Imagen } from "./imagen";

export interface Educacion{
    id: any;
    titulo: string;

    ///AGREGAR VALORES FALTANTES Y ARREGLAR TIPOS DE DATOS

        descripcion: string;
        tipoEducacion: TipoEducacion;
        imagenes: Imagen[];
}
import { Nivel } from "./Enums/nivel";
import { TipoConocimiento } from "./Enums/tipoConocimiento";
import { Imagen } from "./imagen";

export interface Conocimiento {
    id: any;
    nombre: string;
    nivel: Nivel;
    tipoConocimiento: TipoConocimiento;
    imagenes: Imagen[]  ;
}
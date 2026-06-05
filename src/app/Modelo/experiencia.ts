import { TecnologiaUsada } from "./Enums/tecnologiaUsada";
import { TipoExperiencia } from "./Enums/tipoExperiencia";
import { Imagen } from "./imagen";

export interface Experiencia {

    id: any;
    titulo: string;
    fechaFinProyecto: string | Date;
    descripcion: string;
    tipoExperiencia: TipoExperiencia;
    tecnologiaUsada: TecnologiaUsada;
    imagen?: Imagen;

}
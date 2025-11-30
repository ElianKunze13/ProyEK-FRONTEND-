import { TecnologiaUsada } from "./Enums/tecnologiaUsada";
import { TipoExperiencia } from "./Enums/tipoExperiencia";

export interface Experiencia {
   
    id: any;
        titulo: string;
        fechaHora: Date;
        descripcion: string;
        tipoExperiencia: TipoExperiencia;
        tecnologiaUsada: TecnologiaUsada;
}
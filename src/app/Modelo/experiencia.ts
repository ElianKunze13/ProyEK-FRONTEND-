import { TecnologiaUsada } from "./Enums/tecnologiaUsada";
import { TipoExperiencia } from "./Enums/tipoExperiencia";
import { Imagen } from "./imagen";

export interface Experiencia {

    id: any;
    titulo: string;
    
    // INCLUIR FECHA DE INICIO Y FIN PARA PROYECTOS, EN CASO DE QUE SEA UN PROYECTO EN CURSO,
    // LA FECHA DE FIN PUEDE SER NULL O UN VALOR ESPECIAL
    
    // fechaInicioProyecto: string | Date;
    fechaFinProyecto: string | Date;
    descripcion: string;
    link: string;
    imagen?: Imagen; 
    tipoExperiencia: TipoExperiencia;
    tecnologiaUsada: TecnologiaUsada;

}
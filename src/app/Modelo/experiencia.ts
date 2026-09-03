import { TecnologiaUsada } from "./Enums/tecnologiaUsada";
import { TipoExperiencia } from "./Enums/tipoExperiencia";
import { Imagen } from "./imagen";

export interface Experiencia {
    id: any;
    titulo: string;
    fechaInicioProyecto: string | Date;
    fechaFinProyecto: string | Date;
    descripcion: string;
    link: string;
    imagenes?: Imagen[]; // 🔥 CAMBIO: ahora es un array de imágenes
    tipoExperiencia: TipoExperiencia;
    tecnologiasUsadas: TecnologiaUsada[];
}
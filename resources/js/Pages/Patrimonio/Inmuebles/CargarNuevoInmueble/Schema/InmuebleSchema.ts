import * as z from "zod";
import { contactoSchema } from "./ContactoSchema";



export enum tipocontrato {
    casa = 'casa',
    departamento = 'departamento',
    local = 'local',
    terreno = 'terreno',
    galpon = 'galpon'
}


export enum estadoInmueble {
    activo = 'activo',
    alquilado = 'alquilado',
    baja = 'baja',
    desocupado = 'desocupado',
    donado = 'donado',
    vendido = 'vendido'
}


export const inmuebleSchema = z.object({
    num_partida: z.coerce.number().positive({ message: "El número de partida es obligatorio" }),
    id_seccionales: z.coerce.number(),
    tipo_ocupacion_id: z.coerce.number(),
    estado_id: z.coerce.number(),
    nombre_fantasia: z.string().min(2, { message: "El nombre fantasia es obligatorio" }),
    nombre_completo: z.string().min(2, { message: "El nombre completo es obligatorio" }),
    tipo_inmueble_id: z.coerce.number(),
    calle_id: z.string(),
    numero: z.coerce.number(),
    superficie_cubierta: z.coerce.number().positive({ message: "La superficie cubierta es obligatoria" }),
    superficie_libre: z.coerce.number().positive({ message: "La superficie libre es obligatoria" }),
    superficie_total: z.coerce.number().positive({ message: "La superficie total es obligatoria" }),
    tipo_contrato: z.coerce.number(),
    
    /* contactos */
     contactos: z.array(contactoSchema), 

    /* domicilio */
    fecha_inscripcion: z.coerce.string(),
    fecha_escritura: z.coerce.string(),
    fecha_contrato: z.coerce.string(),
    fecha_inicio: z.coerce.string(),
    fecha_fin: z.coerce.string(),
    importe: z.coerce.number(),
    num_escritura: z.coerce.number(),
    folio: z.coerce.number(),
    tomo: z.coerce.number(),
    observacion: z.string(),

    /* nomeclatura catastral */
    circunscripcion: z.coerce.string(),
    seccion: z.coerce.string(),
    manzana: z.coerce.string(),
    parcela: z.coerce.string(),
    subparcela: z.coerce.string(),
    poligono: z.coerce.string(),
    zona: z.coerce.string(),
    partida: z.coerce.string(),
    valuacion_fiscal: z.coerce.string(),
})

export type InmuebleSchemaType = z.infer<typeof inmuebleSchema>;


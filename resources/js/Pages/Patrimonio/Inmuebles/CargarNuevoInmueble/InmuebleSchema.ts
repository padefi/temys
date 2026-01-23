import * as z from "zod";



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


/* import * as z from "zod";
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
    num_partida: z.coerce
        .number()
        .positive({ message: "El número de partida debe ser mayor a 0" }),
    tipo_ocupacion_id: z.coerce
        .number(),
    estado_id: z.enum(estadoInmueble, { message: "El nombre fantasia debe tener al menos 2 caracteres" }),
    nombre_fantasia: z.string()
        .min(1, { message: "El nombre fantasía es requerido" }),
    nombre_completo: z.string()
        .min(1, { message: "El nombre completo es requerido" }),
    tipo_inmueble_id: z.coerce.number(),
    calle_id: z.string(),
    numero: z.coerce.number().positive({ message: "El número debe ser mayor a 0" }),
    superficie_cubierta: z.coerce.number().positive({ message: "El número debe ser mayor a 0" }),
    superficie_libre: z.coerce.number().positive({ message: "El número debe ser mayor a 0" }),
    superficie_total: z.coerce.number().positive({ message: "El número debe ser mayor a 0" }),
    tipo_contrato: z.enum(tipocontrato),

    /* domicili*
    fecha_inscripcion: z.coerce.date("Formato inválido"),
    fecha_escritura: z.coerce.date(),
    fecha_contrato: z.coerce.date(),
    fecha_inicio: z.coerce.date(),
    fecha_fin: z.coerce.date(),
    importe: z.coerce.number().positive({ message: "El número debe ser mayor a 0" }),
    num_escritura: z.coerce.number().positive({ message: "El número debe ser mayor a 0" }),
    folio: z.coerce.number().positive({ message: "El número debe ser mayor a 0" }),
    tomo: z.coerce.number().positive({ message: "El número debe ser mayor a 0" }),
    observacion: z.string().optional().default(""),
});

export type InmuebleSchemaType = z.infer<typeof inmuebleSchema>; */
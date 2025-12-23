import * as z from "zod";
enum tipocontrato {
    casa='casa',
    departamento='departamento',
    local='local',
    terreno='terreno',
    galpon='galpon' 
}


enum estadoInmueble{
    activo='activo',
    alquilado='alquilado',
    baja='baja',
    desocupado='desocupado',
    donado='donado',
    vendido='vendido'
}


export const inmuebleSchema = z.object({
    num_partida: z.coerce.number({ message: "El nombre fantasia debe tener al menos 2 caracteres" }),
    tipo_ocupacion_id: z.coerce.number(),
    estado_id: z.enum(estadoInmueble,{ message: "El nombre fantasia debe tener al menos 2 caracteres" }),
    nombre_fantasia: z.string().min(2, { message: "El nombre fantasia debe tener al menos 2 caracteres" }),
    nombre_completo: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    tipo_inmueble_id:z.coerce.number(),

    provincia_id: z.string(),
    localidad_id: z.string(),
    calle_id: z.string(),
    numero:z.coerce.number(),
    codigo_postal: z.coerce.number(),
    piso: z.coerce.number(),
    departamento: z.string(),

    superficie_cubierta: z.coerce.number(),
    superficie_libre: z.coerce.number(),
    superficie_total:z.coerce.number(),
    
    tipo_contrato: z.enum(tipocontrato),

/* domicilio */
    fecha_inscripcion: z.date(),
    fecha_escritura:  z.date(),
    fecha_contrato:  z.date(),
    fecha_inicio:  z.date(),
    fecha_fin:  z.date(),
    importe: z.coerce.number(),
    num_escritura: z.coerce.number(),
    folio: z.coerce.number(),
    tomo:z.coerce.number(),
    observacion: z.string(), 
})

export type InmuebleSchemaType = z.infer<typeof inmuebleSchema>;
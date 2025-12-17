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
    num_partida: z.coerce.number(),
    estado_id: z.enum(estadoInmueble),
    nombre_completo: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    nombre_fantasia: z.string().min(2, { message: "El nombre fantasia debe tener al menos 2 caracteres" }),
    tipo_inmueble_id:z.coerce.number(),
    tipo_ocupacion_id: z.coerce.number(),
    superficie_cubierta: z.coerce.number(),
    tipo_contrato: z.enum(tipocontrato),

    superficie_libre: z.coerce.number(),
    superficie_total:z.coerce.number(),
    provincia_id: z.coerce.number(),
    localidad_id: z.coerce.number(),
    calle_id: z.coerce.number(),
    numero:z.coerce.number(),
    codigo_postal: z.coerce.number(),
    piso: z.coerce.number(),
    departamento: z.coerce.number(),
/* domicilio */
    fecha_inscripcion: Date(),
    fecha_escritura: Date(),
    fecha_contrato: Date(),
    fecha_inicio: Date(),
    fecha_fin: Date(),
    importe: z.coerce.number(),
    num_escritura: z.coerce.number(),
    folio: z.coerce.number(),
    tomo:z.coerce.number(),
    observacion: z.string(), 
})

export type InmuebleSchemaType = z.infer<typeof inmuebleSchema>;
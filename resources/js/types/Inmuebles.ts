export interface Contacto {
  tipo: string
  valor: string
  descripcion: string
}





export interface InmuebleFormData {
  num_partida: string
  estado_id: string
  nombre_completo: string
  nombre_fantasia: string
  tipo_inmueble_id: string
  tipo_ocupacion_id: string
  superficie_cubierta: string
  tipo_contrato: string
  superficie_libre: string
  superficie_total: string
  provincia_id: string;
  localidad_id: string;
  calle_id: string;
  numero: string;
  codigo_postal?: string;
  piso?: string;
  departamento?: string;
  contactos: Contacto[]
  fecha_inscripcion: Date
  fecha_escritura: Date
  fecha_contrato: Date
  fecha_inicio: Date
  fecha_fin: Date
  importe: string
  num_escritura: string
  folio: string
  tomo: String
  observacion: string

}
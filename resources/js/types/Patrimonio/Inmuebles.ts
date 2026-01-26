export interface Inmueble {
  num_inmueble: number
  nombre_seccional: string
  num_partida: string
  estado: string
  tipo_inmueble_nombre: string
  tipo_ocupacion_nombre: string

  nombres_inmueble: {
    nombre_completo: string
    nombre_fantasia: string
  }

  superficie: {
    cubierta: string
    libre: string
    total: string
  }

  creacion: {
    fecha: string
    usuario: string
  }

  actualizacion: {
    fecha: string
    usuario: string
  }
}


export interface Impuesto {
  id: string
  nombre: string
  periodo: string
  vencimiento: string
  monto: number
  estado: "Pendiente" | "Vencido" | "Pagado"
}

export interface Documento {
  id: string
  nombre: string
  tipo: "pdf" | "jpg" | "png"
  fecha: string
  tamaño: string
}

export interface ExistenciasItem {
  id: number
  producto_id: number
  nombre: string
  categoria: string
  cantidad_actual: number
  stockDispoble: number
  entrada: number
  salida: number
  stockEstimado: number
  estadoEntregas: string
  estado_ajuste: string
  cantidad_contada: number
}



export interface ExtendedExistenciasItem extends ExistenciasItem {
  stockDisponible: number;
  stockEstimado: number;
  entrada: number;
  salida: number;
}


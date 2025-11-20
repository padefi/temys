export interface AjusteData {
    producto: string
    almacen: string
    almacenId:number
    productoId:number
    cantidadSistema: number
    cantidadContada: number
    diferencia: number
    fecha: string
    usuario: string
    motivo: string
}



export interface AjusteSeleccionado {
  ajusteId: number;
  productoId: number;
}

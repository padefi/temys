export interface RecepcionDetalle {
    id: number;
    producto_id: number;
    nombreProducto: string;
    cantidadRecibida: number;
    cantidadEsperada: number;
    estado: string;
}

export interface  RecepcionesItem {
    id: string;
    orden_id:number;
    origen_id: number;
    destino_id: number;
    estado_orden_entrega:string,
    tipo_recepcion: string;
    movimiento_id: number;
    fecha_recepcion: Date;
    estado: string;
    usuario_creacion: string;
    detalles?: RecepcionDetalle[];
}
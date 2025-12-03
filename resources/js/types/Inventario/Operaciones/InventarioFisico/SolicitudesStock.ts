export interface SolicitudDetalle {
    producto_id: number;
    nombre_producto: string;
    cantidad: number;
    cantidad_aprobada: number;
}

export interface Solicitudes {
    id: number;
    nombre_almacen_solicitante: string;
    nombre_almacen_proovedor: string;
    estado: string;
    motivo: string;
    prioridad: string;
    fecha: Date;
    detalles: SolicitudDetalle[]; // ahora es una lista de productos
}

export interface StockRequest {
    id: string
    id_producto: string
    nombre_producto: string
    nombre_almacen_solicitante: string
    cantidad: number
    prioridad: "Alta" | "Media" | "Baja" | "Urgente"
    motivo: string
    detalles: SolicitudDetalle[];
}
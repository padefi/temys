export interface DetalleProducto {
    id: string;
    nombre: string;
    cantidad: number;
    fecha_creacion: string;
    usuarioCreacion: string;
}

export interface DetalleCancelacion {
    motivo: string;
    fecha: string;
    usuario: string;
}

export interface EntregaItem {
    id: number;
    fecha_envio: string | null;
    fecha_creacion: string | null;
    usuario_creacion: string;
    estado: string;
    origen: string;
    destino: string;
    productos: DetalleProducto[];
    cancelacion: DetalleCancelacion;
}
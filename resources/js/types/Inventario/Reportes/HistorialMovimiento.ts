export interface MovimientosItem {
    id: number;
    fecha: string;
    tipo_movimiento: string;
    nombreProducto: string;
    origen: string;
    destino: string;
    usuarioCreacion: string
    cantidad: number;
}
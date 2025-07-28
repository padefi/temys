import { CotizacionOrden } from "./CotizacionOrden";
import { Origenes } from "./Origen";

export interface SolicitudCompra {
    id: number
    origen_id: number
    origen?: Origenes
    descripcion: string
    estado: string
    usuario_id: number
    usuario_actualizacion: number
    created_at: Date
    updated_at: Date
    ordenes_cotizacion?: CotizacionOrden[]
}

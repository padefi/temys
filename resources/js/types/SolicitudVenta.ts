import { CotizacionOrdenVenta } from "./CotizacionOrdenVenta";
import { Origenes } from "./Origen";

export interface SolicitudVenta {
    id: number
    origen_id: number
    origen?: Origenes
    descripcion: string
    estado: string
    usuario_id: number
    usuario_actualizacion: number
    created_at: Date
    updated_at: Date
    orden_cotizacion_venta?: CotizacionOrdenVenta[]

}

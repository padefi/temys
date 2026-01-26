import { Almacen } from "./Almacen";
import { Archivo } from "./Archivos";
import { CotizacionOrden } from "./CotizacionOrden";
import { OrdenesVentaDetalle } from "./OrdenVentaDetalle";
import { TipoMoneda } from "./TipoMoneda";
import { Comprobante } from "./Comprobante";

export interface OrdenesVenta {
    id: number
    cliente?: {
        nombre: string;
        apellido: string;
        id: number; // ⚠️ Asegurate que exista un ID único del cliente
    }
    moneda_id: string;
    tipo_moneda: TipoMoneda;
    cotizacion_moneda: number | null;
    entrega_esperada: Date;
    entregar_a: string;
    observaciones: string;
    almacen_destino: number
    almacen: Almacen;
    ordenes_cotizacion: CotizacionOrden[]
    detalles?: OrdenesVentaDetalle[]  // usa el tipo correcto si tienes uno
    archivos?: Archivo[]
    comprobantes?: Comprobante[]
    created_at: Date;
    updated_at: Date;
    estado: string
}

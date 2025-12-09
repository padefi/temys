import { Almacen } from "./Almacen";
import { Archivo } from "./Archivos";
import { CotizacionOrden } from "./CotizacionOrden";
import { OrdenesCompraDetalle } from "./OrdenCompraDetalle";
import { TipoMoneda } from "./TipoMoneda";
import { ComprobanteProveedor } from "./ComprobanteProveedor";

export interface OrdenesCompra {
    id: number
    proveedor?: {
        razon_social: string;
        nombre_fantasia: string;
        id: number; // ⚠️ Asegurate que exista un ID único del proveedor
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
    detalles?: OrdenesCompraDetalle[]  // usa el tipo correcto si tienes uno
    archivos?: Archivo[]
    comprobantes_proveedores?: ComprobanteProveedor[]
    created_at: Date;
    updated_at: Date;
    estado: string
}

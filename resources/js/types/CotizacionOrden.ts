import { Proveedor } from "./Proveedor";
import { TipoMoneda } from "./TipoMoneda";
import { SolicitudCompra } from "./SolicitudCompra";
import { OrdenesCompra } from "./OrdenCompra";

// types/CotizacionOrdenes.ts
export interface CotizacionOrden {
    id: number;
    proveedor_id: number;
    proveedor : Proveedor// Relación opcional con el modelo
    moneda_id: string;
    tipo_moneda: TipoMoneda;
    cotizar_antes_de: Date;
    entrega_esperada: Date;
    entregar_a: string;
    observaciones: string;
    estado: string;
    usuario_id: number;
    usuario_actualizacion: number;
    detalles?: DetalleCotizacion[]  // usa el tipo correcto si tienes uno
    //////SOLICITUD DE COMPRA RELACIONADA
    created_at: Date;
    updated_at: Date;
    solicitudes?: SolicitudCompra[]
    //////ORDEN DE COMPRA RELACIONADA
    ordenes_compra?: OrdenesCompra[]
}

export interface DetalleCotizacion {
    id: number
    orden_cotizaciones_id: number
    producto_id: number
    descripcion: string
    codigo_barras: string
    referencia?: string
    cantidad: number
    precio_unitario: number
    porcentaje_descuento: number
    importe: number
}

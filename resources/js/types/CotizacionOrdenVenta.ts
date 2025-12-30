import { Proveedor } from "./Proveedor";
import { TipoMoneda } from "./TipoMoneda";
import { SolicitudCompra } from "./SolicitudCompra";
import { OrdenesCompra } from "./OrdenCompra";
import { Almacen } from "./Almacen";

import { Archivo } from "./Archivos";
import { Impuesto } from "./Impuesto";
import { Cliente } from "./Cliente";
import { SolicitudVenta } from "./SolicitudVenta";
import { OrdenesVenta } from "./OrdenVenta";
// types/CotizacionOrdenes.ts
export interface CotizacionOrdenVenta {
    id: number;
    cliente_id: number;
    cliente : Cliente// Relación opcional con el modelo
    moneda_id: number;
    tipo_moneda: TipoMoneda;
    cotizar_antes_de: Date;
    entregar_a: string;
    entrega_esperada: Date;
    almacen_destino: number
    almacen: Almacen;
    observaciones: string;
    estado: string;
    usuario_id: number;
    usuario_actualizacion: number;
    detalles?: DetalleCotizacion[]  // usa el tipo correcto si tienes uno
    //////SOLICITUD DE VENTA RELACIONADA
    created_at: Date;
    updated_at: Date;
    solicitud_venta?: SolicitudVenta[]
    //////ORDEN DE VENTA RELACIONADA
    ordenes_venta?: OrdenesVenta[]
    archivos?: Archivo[]
}

export interface DetalleCotizacion {
    id: number
    orden_cotizaciones_id: number
    producto_id: number
    entrega_esperada: Date
    descripcion: string
    codigo_barras: string
    referencia?: string
    cantidad: number
    detalles_impuesto: Impuesto[]
    precio_unitario: number
    porcentaje_descuento: number
    importe: number
}

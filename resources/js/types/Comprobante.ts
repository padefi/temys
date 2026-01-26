import { TipoMoneda } from "./TipoMoneda";
import { OrdenCobro } from "./OrdenCobro";
import { OrdenPago } from "./OrdenPago";

export interface Comprobante {
    id: number;
    tipo: string;
    tipo_id: number;
    orden_venta_id: number;
    fecha_factura: Date;
    fecha_vencimiento: Date;
    condicion_venta_id: number;
    moneda_id: number;
    tipo_moneda: TipoMoneda;
    punto_venta: string;
    numero_factura: string;
    tipo_comprobante_id: number;
    estado: string;
    descripcion: string;
    usuario_creacion: number;
    detalles: ComprobanteDetalles[]
    condicion_venta: CondicionVenta;
    tipo_comprobante: TipoComprobante;
    archivos: ComprobanteArchivo[]
    ordenes_cobro?: OrdenCobro[]
    ordenes_pago?: OrdenPago[]
    comprobantes_aplicados?: ComprobanteAplicado[]
    importe_disponible?: number;

}
export interface ComprobanteAplicado {
    id: number;
    comprobante_id: number;
    comprobante_aplicado_id: number;
    importe_aplicado: number;
}
export interface ComprobanteDetalles {
    id: number;
    comprobante_id: number;
    producto_id: number;
    descripcion: string;
    modelo: string;
    unidad_medida_id: number;
    cantidad: number;
    precio_unitario: number;
    porcentaje_descuento: number;
    co_cuenta_id: number;
    cuenta_contable: string;
    importe: number;
    usuario_creacion: number;
    usuario_actualizacion: number;

}

export interface ComprobanteDetallesImpuestos {
    id: number;
    detalle_id: number;
    impuesto_id: number;

}

export interface TipoComprobante {
    id: number;
    nombre: string;
    codigo_arca: string;
    signo: string;
    categoria: string;
    afecta_saldo: boolean;
    habilitado: boolean;

}

export interface CondicionVenta {
    id: number;
    nombre: string;
    descripcion: string;
}

export interface ComprobanteArchivo {
    id: number;
    comprobante_id: number;
    nombre: string;
    path: string;
    mime: string;
    size: number;
}

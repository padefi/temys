import { TipoMoneda } from "./TipoMoneda";
import { OrdenPagoProveedores } from "./OrdenPagoProveedores";

export interface ComprobanteProveedor {
    id: number;
    orden_compra_id: number;
    proveedor_id: number;
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
    detalles: ComprobanteProveedorDetalles[]
    condicion_venta: CondicionVenta;
    tipo_comprobante: TipoComprobante;
    archivos: ComprobanteProveedorArchivo[]
    ordenes_pago?: OrdenPagoProveedores[]

}
export interface ComprobanteProveedorDetalles {
    id: number;
    comprobante_proveedor_id: number;
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

export interface ComprobanteProveedorDetallesImpuestos {
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

export interface ComprobanteProveedorArchivo {
    id: number;
    comprobante_proveedor_id: number;
    nombre: string;
    path: string;
    mime: string;
    size: number;
}

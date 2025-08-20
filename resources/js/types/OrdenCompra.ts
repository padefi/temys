import { Almacen } from "./Almacen";
import { OrdenesCompraDetalle } from "./OrdenCompraDetalle";
import { TipoMoneda } from "./TipoMoneda";

export interface OrdenesCompra {
    id: number
    proveedor?: {
        razon_social: string;
        nombre_fantasia: string;
        id: number; // ⚠️ Asegurate que exista un ID único del proveedor
    }
    moneda_id: string;
    tipo_moneda: TipoMoneda;
    entrega_esperada: Date;
    entregar_a: string;
    observaciones: string;
    almacen_destino: number
    almacen: Almacen;
    detalles?: OrdenesCompraDetalle[]  // usa el tipo correcto si tienes uno
    created_at: Date;
    updated_at: Date;
    estado: string
}

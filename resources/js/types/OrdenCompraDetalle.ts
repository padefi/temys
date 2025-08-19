import { Modelo } from "./Producto";

export interface OrdenesCompraDetalle {
    id: number
    orden_compras_id: number
    orden_cotizaciones_id: number
    producto_id: number
    producto?: {
        id: number; // ⚠️ Asegurate que exista un ID único del producto
        nombre: string;
        modelo: {
            descripcion: string;
            marca_id: number;
            marca: {
                descripcion: string;
                id: number; // ⚠️ Asegurate que exista un ID único del producto
            };
            id: number; // ⚠️ Asegurate que exista un ID único del producto
        };
        subcategoria: {
            descripcion: string;
            id: number;
        };
        cod_barras: string;
        referencia: string;
    }
    entrega_esperada: Date
    descripcion: string
    cantidad: number
    precio_unitario: number
    porcentaje_descuento: number
    importe: number
    usuario_creacion: number
    usuario_actualizacion: number
    created_at: Date
    updated_at: Date
}

export type Producto = {
    id: number;
    nombre: string;
    descripcion: string;
    modelo_id?: number;
    subcategoria_id?: number;
};

export type Almacen = {
    id: number;
    nombre: string;
};

export type StockItem = {
    id: number;
    producto: Producto;
    almacen: Almacen;
    cantidad_actual: number;
    cantidad_contada: number;
    stock_minimo: number;
};


/* diversos */

/* export type Producto = {
    id: number;
    nombre: string;
}; */


export type AlmacenStock = {
    id: number;
    producto_id: number;
    nombre: string;
    nombre_producto: string;
    cantidad_actual: number
};


export interface Solicitudes {
    id: number;
    nombre_producto: string;
    nombre_almacen_solicitante: string;
    nombre_almacen_proovedor: string;
    estado: string;
    cantidad: number;
    cantidad_aprobada: number;
    motivo: string;
    prioridad: string;
    fecha: Date;
}

export interface StockRequest {
  id: string
  id_producto:string
  nombre_producto: string
  nombre_almacen_solicitante: string
  cantidad: number
  prioridad: "Alta" | "Media" | "Baja" | "Urgente"
  motivo: string
}
/*  */
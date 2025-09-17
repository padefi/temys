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
    estado_ajuste: string;
    cantidad_contada: number;
    stock_minimo: number;
    ajuste_id: number
};

export type AlmacenStock = {
    id: number;
    producto_id: number;
    nombre: string;
    nombre_producto: string;
    cantidad_actual: number
};

export interface SolicitudDetalle {
    producto_id: number;
    nombre_producto: string;
    cantidad: number;
    cantidad_aprobada: number;
}

export interface Solicitudes {
    id: number;
    nombre_almacen_solicitante: string;
    nombre_almacen_proovedor: string;
    estado: string;
    motivo: string;
    prioridad: string;
    fecha: Date;
    detalles: SolicitudDetalle[]; // ahora es una lista de productos
}

export interface StockRequest {
    id: string
    id_producto: string
    nombre_producto: string
    nombre_almacen_solicitante: string
    cantidad: number
    prioridad: "Alta" | "Media" | "Baja" | "Urgente"
    motivo: string
    detalles: SolicitudDetalle[];
}

export interface AjusteData {
    producto: string
    almacen: string
    cantidadSistema: number
    cantidadContada: number
    diferencia: number
    fecha: string
    usuario: string
    motivo: string
}

export interface Permissions {
    canUpdate: boolean;
    canCreate: boolean;
    canConfirm: boolean;
    isAdmin: boolean;
}

export interface MovimientosItem {
    id: number;
    fecha: string;
    tipo_movimiento: string;
    nombreProducto: string;
    origen: string;
    destino: string;
    usuarioCreacion: string
    cantidad: number;
}

export interface ExistenciasItem {
  id: number
  producto_id: number
  nombre: string
  categoria: string
  stockActual: number
  stockDispoble: number
  entrada: number
  salida: number
  stockEstimado: number
  estadoEntregas: string
  estado_ajuste: string
  cantidad_contada: number
}
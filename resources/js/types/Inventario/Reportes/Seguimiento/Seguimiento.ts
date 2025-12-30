export interface MovimientoEstado {
  id: number;
  transito_id: number;
  estado: string;
  usuario_id: number;
  fecha: string; 
  observacion: string;
  ubicacion_actual: string;
  usuario?: {
    id: number;
    name: string;
  };
}

export interface Almacen {
  id: number;
  nombre: string;
}

export interface Producto {
  id: number;
  nombre: string;
}

export interface InventarioOrdenEntrega {
  id: number;
  origen: Almacen;
  destino: Almacen;
  
}

export interface InventarioStockTransito {
  id: number;
  entrega_id: number;
  producto_id: number;
  origen_id: number;
  destino_id: number;
  cantidad: number;
  estado: string;
 /*  ubicacion_actual: string; */
  fecha_salida: string; 
  fecha_llegada: string;
  observaciones: string;
  producto: Producto;
  orden_entrega: InventarioOrdenEntrega;
  movimiento_estados: MovimientoEstado[];
  cantidad_total?: number;
}

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
export type ProductoEnAlmacen = {
  producto_id: number;
  producto: string;
  cantidad_actual: number;
  stock_minimo: number;
};
export type AlmacenStock = {
  almacen_id: number;
  almacen: string;
  productos: ProductoEnAlmacen[];
};


/* export type AlmacenStock = {
    id: number;
    producto_id: number;
    nombre: string;
    nombre_producto: string;
    cantidad_actual: number;
    stock_minimo:number;
};
 */
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

export type StockInventarioItem = {
    id: number;
    producto: string;
    productoId:number;
    almacen: string;
    almacenId:number;
    cantidad_actual: number;
    estado_ajuste: string;
    cantidad_contada: number;
    stock_minimo: number;
    ajuste_id: number
};
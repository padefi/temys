// types/productos.ts
export interface ProductosDisponibles {
    id: number;
    nombre: string;
    descripcion: string;
    marca_id: number;
    modelo_id: number;
    modelo?: Modelo; // Relación opcional con el modelo
    subcategoria_id: number;
    sub_categoria?: Subcategoria; // Relación opcional con el modelo
    codigo_barras: string;
    referencia: string;
    usuario_id: string;
}

export interface Modelo {
  id: number;
  descripcion: string;
  // si tenés más campos del modelo, los podés agregar acá
}

export interface Subcategoria {
  id: number;
  descripcion: string;
  // si tenés más campos del modelo, los podés agregar acá
}

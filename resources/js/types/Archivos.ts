export interface Archivo {
  id?: number;        // solo si viene de la DB
  nombre: string;
  url?: string;       // solo si viene de la DB
  mime: string;
  size: number;
  file?: File;        // solo si es un archivo recién subido
  isCotizacion?: boolean;
}

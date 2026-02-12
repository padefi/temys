export interface TipoMoneda {
    id: number;
    codigo: string;
    descripcion: string;
    simbolo: string;
    pais_origen: string;
    habilitado: boolean | number;
}

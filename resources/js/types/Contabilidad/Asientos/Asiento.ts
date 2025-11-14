import { Partida } from "./Partida";

export interface Asiento {
    id: number;
    ejercicio: number;
    numero: number;
    estado: EstadoAsiento;
    fecha: string | Date;
    concepto: string;
    importe: number;
    partidas?: Partida[];
}

export enum EstadoAsiento {
    PENDIENTE = "PENDIENTE",
    CONTROLADO = "CONTROLADO",
    ANULADO = "ANULADO",
}

import { EstadoAsiento } from "./EstadoAsientos";
import { Partida } from "./Partida";

export interface Asiento {
    id: number;
    ejercicio: number;
    numero: number;
    estado: EstadoAsiento;
    fecha: string;
    concepto: string;
    importe: number;
    partidas?: Partida[];
}

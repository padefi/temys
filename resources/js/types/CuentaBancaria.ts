import { Banco } from "./Banco";

export interface CuentaBancaria {
    id: number; banco_id: number; numero_cuenta: string; activo: boolean; tipo_cuenta: string; banco?: Banco;
}

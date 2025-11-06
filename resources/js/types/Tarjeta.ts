import { CuentaBancaria } from "./CuentaBancaria";

export interface Tarjeta {
    id: number; tipo: string; numero_tarjeta: string; cuenta_bancaria?: CuentaBancaria
}

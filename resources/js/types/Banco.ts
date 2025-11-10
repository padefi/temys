
import { CuentaBancaria } from "./CuentaBancaria";
export interface Banco {
    id: number; banco: string; cuenta_bancaria?: CuentaBancaria[];
}

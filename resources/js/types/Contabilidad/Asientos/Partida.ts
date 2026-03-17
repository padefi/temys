import { Cuenta } from "../PlanCuentas/Cuenta";

export interface Partida {
    id: number;
    asientoId?: number;
    cuenta: Cuenta;
    concepto: string;
    debe: number;
    haber: number;
}

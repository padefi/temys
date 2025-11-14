import { Cuenta } from "../PlanCuentas/Cuenta";
import { Asiento } from "./Asiento";

export interface Partida {
    cuenta: Cuenta;
    concepto: string;
    debe: number;
    haber: number;
}

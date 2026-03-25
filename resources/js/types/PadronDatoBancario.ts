import type { Tipo } from "@/types/Padron";
import type { TipoClave } from "@/types/Proveedor";
import type { TipoCuenta } from "@/types/Proveedor";

export type PadronDatoBancario = {
  id: number;
  tipo: Tipo;
  tipo_id: number;
  tipo_clave: TipoClave;
  clave: string | null;
  alias: string | null;
  entidad_financiera: number;
  moneda: number;
  tipo_cuenta: TipoCuenta;
  predeterminado: boolean;
}
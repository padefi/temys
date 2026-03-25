import "@tanstack/react-table";

import type { Nacionalidad } from "@/types/Nacionalidad";
import type { CondicionIva } from "@/types/CondicionIva";
import type { ActividadEconomica } from "@/types/ActividadEconomica";
import type { EntidadFinanciera } from "@/types/EntidadFinanciera";
import type { TipoMoneda } from "@/types/TipoMoneda";
import type { TipoContacto } from "@/types/TipoContacto";

declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    module: number;
    nacionalidades: Nacionalidad[];
    condicionesIva: CondicionIva[];
    actividades: ActividadEconomica[];
    entidadesFinancieras: EntidadFinanciera[];
    tiposMoneda: TipoMoneda[];
    tipoContactos: TipoContacto[];
  }
}
import { useMemo } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

import type { Nacionalidad } from "@/types/Nacionalidad";
import type { CondicionIva } from "@/types/CondicionIva";
import type { ActividadEconomica } from "@/types/ActividadEconomica";
import type { EntidadFinanciera } from "@/types/EntidadFinanciera";
import type { TipoMoneda } from "@/types/TipoMoneda";
import type { TipoContacto } from "@/types/TipoContacto";
import type { Proveedor, ProveedorCreatePayload, ProveedorUpdatePayload } from "@/types/Proveedor";

import ProveedorWizard from "./ProveedorWizard";
import { hydrateProveedorFormFromServer } from "./utils/proveedorFormFactory";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  proveedor: Proveedor;
  nacionalidades: Nacionalidad[];
  condicionesIva: CondicionIva[];
  actividades: ActividadEconomica[];
  entidadesFinancieras: EntidadFinanciera[];
  tiposMoneda: TipoMoneda[];
  tipoContactos: TipoContacto[];
};

export default function ProveedoresEditar({ proveedor, setOpen, ...props }: Props) {
  const initialData = useMemo(
    () => hydrateProveedorFormFromServer(proveedor),
    [proveedor]
  );

  const handleSubmit = (payload: ProveedorCreatePayload | ProveedorUpdatePayload) => {
    router.put(route("proveedores.update", proveedor.id), payload as ProveedorUpdatePayload, {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => {
        toast.success("Proveedor actualizado correctamente");
        setOpen(false);
      },
      onError: () => {
        toast.error("Error al actualizar proveedor");
      },
    });
  };

  return (
    <ProveedorWizard
      open={props.open}
      setOpen={setOpen}
      mode="edit"
      initialData={initialData}
      onSubmit={handleSubmit}
      nacionalidades={props.nacionalidades}
      condicionesIva={props.condicionesIva}
      actividades={props.actividades}
      entidadesFinancieras={props.entidadesFinancieras}
      tiposMoneda={props.tiposMoneda}
      tipoContactos={props.tipoContactos}
    />
  );
}
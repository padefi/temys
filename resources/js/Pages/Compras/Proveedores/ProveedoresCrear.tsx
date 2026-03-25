import { router } from "@inertiajs/react";
import { toast } from "sonner";

import type { Nacionalidad } from "@/types/Nacionalidad";
import type { CondicionIva } from "@/types/CondicionIva";
import type { ActividadEconomica } from "@/types/ActividadEconomica";
import type { EntidadFinanciera } from "@/types/EntidadFinanciera";
import type { TipoMoneda } from "@/types/TipoMoneda";
import type { TipoContacto } from "@/types/TipoContacto";
import type { ProveedorCreatePayload } from "@/types/Proveedor";

import ProveedorWizard from "./ProveedorWizard";
import { createEmptyProveedorForm } from "./utils/proveedorFormFactory";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  nacionalidades: Nacionalidad[];
  condicionesIva: CondicionIva[];
  actividades: ActividadEconomica[];
  entidadesFinancieras: EntidadFinanciera[];
  tiposMoneda: TipoMoneda[];
  tipoContactos: TipoContacto[];
};

export default function ProveedoresCrear(props: Props) {
  const submit = (payload: ProveedorCreatePayload) =>
    router.post(route("proveedores.store"), payload, {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => {
        toast.success("Proveedor creado correctamente");
        props.setOpen(false);
      },
      onError: () => toast.error("Error al crear proveedor"),
    });

  return (
    <ProveedorWizard
      {...props}
      mode="create"
      initialData={createEmptyProveedorForm()}
      onSubmit={submit}
    />
  );
}
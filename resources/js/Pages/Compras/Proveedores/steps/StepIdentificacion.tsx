import { useMemo } from "react";
import { toast } from "sonner";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import TextInput from "@/Components/TextInput";
import SingleSearchableSelect from "@/Components/SingleSelectSearchable";

import type { Nacionalidad } from "@/types/Nacionalidad";
import type { ProveedorForm } from "@/types/Proveedor";
import type { TipoDocumento } from "@/types/Padron";
import type { PadronStatus } from "../hooks/usePadronLookup";

type Props = {
  data: {
    tipo_documento: TipoDocumento;
    documento: string;
    nacionalidad: number | null;
  };
  setData: <K extends keyof ProveedorForm>(key: K, value: ProveedorForm[K]) => void;

  nacionalidades: Nacionalidad[];

  padronStatus: PadronStatus;
  padronMessage: string | null;

  showNacionalidad: boolean;
  nacionalidadReadonly: boolean;
  readonly?: boolean;
};

const Required = () => <span className="ml-1 text-red-600 font-medium">*</span>;
const BORDER_FOCUS = "focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:border-gray-200";

export function StepIdentificacion({
  data,
  setData,
  nacionalidades,
  padronStatus,
  padronMessage,
  showNacionalidad,
  nacionalidadReadonly,
  readonly = false,
}: Props) {
  const nacionalidadOptions = useMemo(
    () =>
      (nacionalidades ?? [])
        .slice()
        .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
        .map((n) => ({
          id: String(n.id),
          label: n.nacionalidad,
          keywords: [n.nacionalidad, String(n.id_nac ?? "")],
        })),
    [nacionalidades]
  );

  const status = useMemo(() => {
    if (readonly) {
      return {
        color: "bg-muted/30 border-border text-foreground",
        text: "Modo edición. Tipo de Documento y Documento bloqueado.",
      };
    }

    if (padronStatus === "cliente" || padronStatus === "padron_only") {
      return {
        color: "bg-green-50 border-green-200 text-green-900",
        text: "Encontrado. Podés continuar.",
      };
    }

    if (padronStatus === "not_found") {
      return {
        color: "bg-amber-50 border-amber-200 text-amber-900",
        text: "No encontrado. Podés continuar cargando manualmente.",
      };
    }

    if (padronStatus === "proveedor" || padronStatus === "error") {
      return {
        color: "bg-red-50 border-red-200 text-red-900",
        text: padronStatus === "proveedor" ? "Ya existe como Proveedor." : "CUIT inválido o error de validación.",
      };
    }

    return {
      color: "bg-muted/30 border-border text-foreground",
      text: "Validando en padrón...",
    };
  }, [readonly, padronStatus]);

  return (
    <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-6 w-full">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Paso 1 · Identificación</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Ingresá el documento para validar contra el <strong>padrón</strong>.
        </p>
      </div>

      <div className={`rounded-lg border px-4 py-3 text-sm ${status.color}`}>
        <div className="font-medium">Estado del padrón</div>
        <div className="text-xs mt-1">{padronMessage ?? status.text}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Tipo de documento <Required />
          </Label>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={readonly}
              onClick={() => setData("tipo_documento", "CUIT")}
            >
              CUIT
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>
            Documento <Required />
          </Label>
          <TextInput
            value={data.documento}
            disabled={readonly}
            onChange={(e) => setData("documento", e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Ej: 20123456789"
            className={`w-full ${BORDER_FOCUS}`}
          />
        </div>

        {showNacionalidad && (
          <div className="md:col-span-2 space-y-2">
            <Label>Nacionalidad</Label>

            <SingleSearchableSelect
              value={data.nacionalidad != null ? String(data.nacionalidad) : ""}
              placeholder="Seleccionar nacionalidad"
              options={nacionalidadOptions}
              clearable
              onChange={(v) => {
                if (nacionalidadReadonly && !readonly) {
                  toast.warning("La nacionalidad viene desde el padrón y no se puede modificar.", {
                    duration: 3500,
                  });
                  return;
                }
              
                setData("nacionalidad", v ? Number(v) : null);
              }}
            />

            {!data.nacionalidad && (
              <p className="text-xs text-muted-foreground">No es obligatorio, es opcional.</p>
            )}

            {nacionalidadReadonly && (
              <p className="text-xs text-muted-foreground">La nacionalidad fue tomada del padrón.</p>
            )}

            {readonly && (
              <p className="text-xs text-muted-foreground">Podés actualizar la nacionalidad en caso de requerirlo.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
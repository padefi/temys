import { Label } from "@/Components/ui/label";
import SingleSearchableSelect from "@/Components/SingleSelectSearchable";
import MultiSelectSearchable from "@/Components/MultiSelectSearchable";
import type { CondicionIva } from "@/types/CondicionIva";
import type { ActividadEconomica } from "@/types/ActividadEconomica";
import { getMissingFields } from "../utils/getMissingFields";

type Props = {
  data: {
    condicion_iva_id: number | null;
    actividades_ids: number[];
  };
  setData: (key: string, value: any) => void;
  condicionesIva: CondicionIva[];
  actividades: ActividadEconomica[];
  visited?: boolean;
};

const Required = () => <span className="ml-1 text-red-600 font-medium">*</span>;

export function StepActividadIva({
  data,
  setData,
  condicionesIva,
  actividades,
  visited = false,
}: Props) {
  const condicionOptions = condicionesIva.map((c) => ({
    id: c.id,
    label: c.descripcion,
    keywords: [c.descripcion],
  }));

  const actividadOptions = actividades.map((a) => ({
    id: a.id,
    label: a.descripcion,
    keywords: [a.descripcion],
  }));

  const missingFields = getMissingFields([
    ["Condición IVA", data.condicion_iva_id !== null],
    ["Actividades Económicas", data.actividades_ids.length > 0],
  ]);

  return (
    <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-6 w-full">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
          Paso 3 · Actividad / Condición <Required />
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Seleccioná <strong>condición IVA</strong> y al menos una <strong>actividad económica</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-2">
          <Label>
            Condición IVA <Required />
          </Label>
          <SingleSearchableSelect
            value={data.condicion_iva_id ?? ""}
            options={condicionOptions}
            placeholder="Seleccionar..."
            clearable
            onChange={(v) => setData("condicion_iva_id", v ? Number(v) : null)}
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label>
            Actividades Económicas <Required />
          </Label>
          <MultiSelectSearchable
            values={data.actividades_ids}
            options={actividadOptions.map((o) => ({ id: Number(o.id), label: o.label, keywords: o.keywords }))}
            placeholder="Seleccionar..."
            onChange={(vals) => setData("actividades_ids", vals)}
          />
          <p className="text-xs text-muted-foreground">
            Podés seleccionar una o varias actividades.
          </p>
        </div>
      </div>

      {visited && missingFields.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          <div className="font-medium mb-1">Faltan completar:</div>
          <ul className="list-disc ml-5">
            {missingFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
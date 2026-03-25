import { Label } from "@/Components/ui/label";
import TextInput from "@/Components/TextInput";
import SingleSearchableSelect from "@/Components/SingleSelectSearchable";
import type { ProveedorForm, TipoProveedor } from "@/types/Proveedor";
import { getMissingFields } from "../utils/getMissingFields";

type Props = {
  data: Pick<ProveedorForm, "razon_social" | "nombre_fantasia" | "tipo">;
  setData: <K extends keyof ProveedorForm>(key: K, value: ProveedorForm[K]) => void;
  visited?: boolean;
};

const Required = () => <span className="ml-1 font-medium text-red-600">*</span>;
const INPUT_CLASS = "w-full focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:border-gray-200";

const tipoProveedorOptions: { id: TipoProveedor; label: string; keywords: string[] }[] = [
  { id: "Humana", label: "Persona Humana", keywords: ["humana", "persona humana"] },
  { id: "Jurídica", label: "Persona Jurídica", keywords: ["juridica", "jurídica", "persona juridica", "persona jurídica"] },
];

export function StepProveedor({ data, setData, visited = false }: Props) {
  const missingFields = getMissingFields([
    ["Razón Social", !!data.razon_social.trim()],
    ["Nombre Fantasía", !!data.nombre_fantasia.trim()],
    ["Tipo de Proveedor", !!data.tipo],
  ]);

  return (
    <div className="w-full space-y-6 rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
          Paso 2 · Proveedor <Required />
        </h2>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Completá los datos básicos del <strong>proveedor</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label>
            Razón Social <Required />
          </Label>
          <TextInput
            value={data.razon_social}
            onChange={(e) => setData("razon_social", e.target.value)}
            className={INPUT_CLASS}
            autoComplete="off"
            placeholder="Ej: Transporte S.A."
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>
            Nombre Fantasía <Required />
          </Label>
          <TextInput
            value={data.nombre_fantasia}
            onChange={(e) => setData("nombre_fantasia", e.target.value)}
            className={INPUT_CLASS}
            autoComplete="off"
            placeholder="Ej: Temys"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>
            Tipo de Proveedor <Required />
          </Label>
          <SingleSearchableSelect
            value={data.tipo || ""}
            options={tipoProveedorOptions}
            placeholder="Seleccionar..."
            clearable
            onChange={(v) => setData("tipo", (v as TipoProveedor) || "")}
          />
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
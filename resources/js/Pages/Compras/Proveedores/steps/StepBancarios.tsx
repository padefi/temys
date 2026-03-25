import { Landmark, Pencil, Plus, Trash2, Star } from "lucide-react";

import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import TextInput from "@/Components/TextInput";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import SingleSearchableSelect from "@/Components/SingleSelectSearchable";

import type { BancarioDraft } from "@/types/Proveedor";
import type { EntidadFinanciera } from "@/types/EntidadFinanciera";
import type { TipoMoneda } from "@/types/TipoMoneda";

import { getMissingFields } from "../utils/getMissingFields";
import { useBancariosDraft } from "../hooks/useBancariosDraft";
import Swal from "sweetalert2";

type Props = {
  bancarios: BancarioDraft[];
  setBancarios: (next: BancarioDraft[]) => void;
  entidadesFinancieras: EntidadFinanciera[];
  tiposMoneda: TipoMoneda[];
  visited: boolean;
};

const Required = () => <span className="ml-1 text-red-600 font-medium">*</span>;
const BORDER_FOCUS = "focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:border-gray-200";

export function StepBancarios({
  bancarios,
  setBancarios,
  entidadesFinancieras,
  tiposMoneda,
  visited,
}: Props) {
  const {
    entidadOptions,
    monedaOptions,
    tipoCuentaOptions,
    tipoClaveOptions,
    draft,
    setDraft,
    editingTmpId,
    entidadSeleccionada,
    claveDigits,
    errors,
    isValid,
    claveCbuOk,
    claveCvuOk,
    clavePrefix,
    clavePrefixOk,
    claveLenOk,
    resetDraft,
    saveDraft,
    editRow,
    deleteRow: deleteBancarioDraft,
    setPredeterminado,
  } = useBancariosDraft({
    bancarios,
    setBancarios,
    entidadesFinancieras,
    tiposMoneda,
  });

  const missingFields = getMissingFields([
    ["Entidad financiera", !!draft.entidad_financiera_id],
    ["Tipo de clave", !!draft.tipo_clave],
    ["Moneda", !!draft.moneda_id],
    ["Tipo de cuenta", !!draft.tipo_cuenta],
    ["Clave o Alias", !!claveDigits || !!draft.alias.trim()],
  ]);

  const stepMissingFields = getMissingFields([
    ["Al menos un dato bancario cargado", bancarios.length > 0],
  ]);

  const handleDelete = async (tmpId: string) => {
    const row = (bancarios ?? []).find((x) => x._tmpId === tmpId);
    const modalEl = document.getElementById("proveedores-wizard-modal");
    const entidad = row?.entidad_financiera_id
      ? entidadesFinancieras.find((e) => e.id === row.entidad_financiera_id)
      : null;

    const moneda = row?.moneda_id
      ? tiposMoneda.find((m) => m.id === row.moneda_id)
      : null;
  
    const result = await Swal.fire({
      title: "¿Eliminar dato bancario?",
      html: row
      ? `<div style="text-align:left;font-size:13px;line-height:1.5;">
          <div style="margin-bottom:6px;"><b>Entidad:</b> ${entidad?.descripcion ?? `#${row.entidad_financiera_id ?? "-"}`}</div>
          <div style="margin-bottom:6px;"><b>Tipo de clave:</b> ${row.tipo_clave || "-"}</div>
          <div style="margin-bottom:6px;"><b>Clave:</b> ${row.clave || "-"}</div>
          <div style="margin-bottom:6px;"><b>Alias:</b> ${row.alias || "-"}</div>
          <div style="margin-bottom:6px;"><b>Moneda:</b> ${moneda ? `${moneda.descripcion} (${moneda.codigo})` : `#${row.moneda_id ?? "-"}`}</div>
          <div style="margin-bottom:6px;"><b>Tipo de cuenta:</b> ${row.tipo_cuenta || "-"}</div>
          <div><b>Predeterminado:</b> ${row.predeterminado ? "Sí" : "No"}</div>
        </div>`
      : "Esta acción no se puede deshacer.",
      icon: "warning",
      target: modalEl ?? undefined,
      backdrop: true,
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
    });
  
    if (!result.isConfirmed) return;
  
    deleteBancarioDraft(tmpId);
  
    await Swal.fire({
      title: "Eliminado",
      text: "El dato bancario fue eliminado.",
      icon: "success",
      target: modalEl ?? undefined,
      timer: 1200,
      showConfirmButton: false,
    });
  };

  return (
    <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-6 w-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
            Paso 4 · Datos bancarios <Required />
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Cargá al menos un <strong>dato bancario</strong>. Podés agregar más y marcar uno como predeterminado.
          </p>
        </div>

        <div className="shrink-0 flex gap-2">
          {editingTmpId && (
            <Button type="button" variant="outline" className="cursor-pointer" onClick={resetDraft}>
              Cancelar edición
            </Button>
          )}

          <Button
            type="button"
            onClick={saveDraft}
            className={`text-white cursor-pointer ${
              isValid ? "bg-green-600 hover:bg-green-700" : "bg-muted-foreground hover:bg-muted-foreground/90"
            }`}
          >
            {editingTmpId ? (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Guardar cambios
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Agregar
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Entidad financiera <Required />
          </Label>
          <SingleSearchableSelect
            value={draft.entidad_financiera_id ?? ""}
            placeholder="Seleccionar entidad"
            options={entidadOptions}
            clearable
            onChange={(v) =>
              setDraft((prev) => ({
                ...prev,
                entidad_financiera_id: v ? Number(v) : null,
                clave: "",
              }))
            }
          />
          {!draft.entidad_financiera_id && (
            <p className="text-xs text-muted-foreground">Solo se muestran entidades habilitadas.</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>
            Tipo de clave <Required />
          </Label>
          <Select
            value={draft.tipo_clave}
            onValueChange={(v) => setDraft((prev) => ({ ...prev, tipo_clave: v as BancarioDraft["tipo_clave"], clave: "" }))}
            disabled={!draft.entidad_financiera_id}
          >
            <SelectTrigger className="min-h-[42px] w-full">
              <SelectValue placeholder="Seleccionar tipo de clave" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tipo</SelectLabel>
                {tipoClaveOptions.length === 0 ? (
                  <SelectItem value="__empty__" disabled>
                    Seleccioná una entidad primero
                  </SelectItem>
                ) : (
                  tipoClaveOptions.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.label}
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>

          {entidadSeleccionada?.tipo && (
            <p className="text-xs text-muted-foreground">
              Entidad: <strong>{entidadSeleccionada.tipo}</strong> · Prefijo:{" "}
              <strong>{entidadSeleccionada.clave_unica}</strong>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Clave (22 dígitos)</Label>
          <TextInput
            value={draft.clave}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                clave: e.target.value.replace(/\D/g, "").slice(0, 22),
              }))
            }
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Ej: 0070..."
            className={`w-full ${BORDER_FOCUS}`}
            disabled={!draft.tipo_clave}
          />
          {claveDigits && !clavePrefixOk && (
            <p className="text-xs text-red-600">
              La clave no pertenece a la entidad seleccionada, debe comenzar con {clavePrefix}.
            </p>
          )}

          {claveDigits && clavePrefixOk && !claveLenOk && (
            <p className="text-xs text-red-600">La clave debe tener 22 dígitos.</p>
          )}

          {claveDigits && clavePrefixOk && claveLenOk && draft.tipo_clave === "Cbu" && !claveCbuOk && (
            <p className="text-xs text-red-600">CBU inválido.</p>
          )}

          {claveDigits && clavePrefixOk && claveLenOk && draft.tipo_clave === "Cbu" && claveCbuOk && (
            <p className="text-xs text-green-700">CBU válido.</p>
          )}

          {claveDigits && clavePrefixOk && claveLenOk && draft.tipo_clave === "Cvu" && !claveCvuOk && (
            <p className="text-xs text-red-600">CVU inválido.</p>
          )}

          {claveDigits && clavePrefixOk && claveLenOk && draft.tipo_clave === "Cvu" && claveCvuOk && (
            <p className="text-xs text-green-700">CVU válido.</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Alias</Label>
          <TextInput
            value={draft.alias}
            onChange={(e) => setDraft((prev) => ({ ...prev, alias: e.target.value }))}
            placeholder="Ej: mi.alias.banco"
            className={`w-full ${BORDER_FOCUS}`}
          />
          <p className="text-xs text-muted-foreground">
            Debés completar al menos <strong>Clave</strong> o <strong>Alias</strong>.
          </p>
        </div>

        <div className="space-y-2">
          <Label>
            Moneda <Required />
          </Label>
          <SingleSearchableSelect
            value={draft.moneda_id ?? ""}
            placeholder="Seleccionar moneda"
            options={monedaOptions}
            clearable
            onChange={(v) => setDraft((prev) => ({ ...prev, moneda_id: v ? Number(v) : null }))}
          />
        </div>

        <div className="space-y-2">
          <Label>
            Tipo de cuenta <Required />
          </Label>
          <Select
            value={draft.tipo_cuenta}
            onValueChange={(v) => setDraft((prev) => ({ ...prev, tipo_cuenta: v as BancarioDraft["tipo_cuenta"] }))}
          >
            <SelectTrigger className="min-h-[42px] w-full">
              <SelectValue placeholder="Seleccionar tipo de cuenta" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tipo</SelectLabel>
                {tipoCuentaOptions.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-green-600 cursor-pointer"
              checked={draft.predeterminado}
              onChange={(e) => setDraft((prev) => ({ ...prev, predeterminado: e.target.checked }))}
              //disabled={bancarios.length === 0}
            />
            Marcar como predeterminado
          </label>  
          <p className="text-xs text-muted-foreground">
            Si marcás más de uno, quedará predeterminado solo el último seleccionado.
          </p>
        </div>
      </div>

      {!isValid && (missingFields.length > 0 || errors.length > 0) && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          <div className="font-medium mb-1">Revisá estos puntos:</div>
          <ul className="list-disc ml-5 space-y-0.5 text-sm">
            {missingFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
            {errors
              .filter((e) => !missingFields.includes(e))
              .slice(0, 4)
              .map((e) => (
                <li key={e}>{e}</li>
              ))}
          </ul>
        </div>
      )}

      <div className="rounded-xl border bg-background overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="text-sm font-medium flex items-center gap-2">
            <Landmark className="h-4 w-4 text-muted-foreground" />
            Entidades financieras cargadas
          </div>
          <div className="text-xs text-muted-foreground">Total: {bancarios.length}</div>
        </div>

        {bancarios.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">Todavía no cargaste datos bancarios.</div>
        ) : (
          <div className="divide-y">
            {bancarios.map((b) => {
              const ent = b.entidad_financiera_id
                ? entidadesFinancieras.find((e) => e.id === b.entidad_financiera_id)
                : null;
              const mon = b.moneda_id ? tiposMoneda.find((m) => m.id === b.moneda_id) : null;

              return (
                <div key={b._tmpId} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate">
                        {ent?.descripcion ?? `Entidad #${b.entidad_financiera_id ?? "-"}`}
                      </span>

                      {b.predeterminado && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-semibold inline-flex items-center gap-1">
                          <Star className="h-3 w-3" /> Predeterminado
                        </span>
                      )}
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground space-y-1">
                      <div>
                        <span className="font-medium">Tipo clave:</span> {b.tipo_clave || "-"} ·{" "}
                        <span className="font-medium">Tipo cuenta:</span> {b.tipo_cuenta || "-"}
                      </div>
                      <div className="truncate">
                        <span className="font-medium">Clave:</span> {b.clave || "-"} ·{" "}
                        <span className="font-medium">Alias:</span> {b.alias || "-"}
                      </div>
                      <div>
                        <span className="font-medium">Moneda:</span>{" "}
                        {mon ? `${mon.descripcion} (${mon.codigo})` : `#${b.moneda_id ?? "-"}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    {!b.predeterminado && (
                      <Button type="button" variant="outline" size="sm" className="cursor-pointer" onClick={() => setPredeterminado(b._tmpId)}>
                        Predeterminar
                      </Button>
                    )}

                    <Button
                      type="button"
                      size="sm"
                      className="bg-amber-400 hover:bg-amber-500 text-white cursor-pointer"
                      onClick={() => editRow(b._tmpId)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                      onClick={() => handleDelete(b._tmpId)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {visited && stepMissingFields.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          <div className="font-medium mb-1">Falta completar:</div>
          <ul className="list-disc ml-5">
            {stepMissingFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
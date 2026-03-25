import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Pencil, Plus, Trash2, Star, Hotel } from "lucide-react";
import Swal from "sweetalert2";

import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import SingleSearchableSelect from "@/Components/SingleSelectSearchable";
import BuscadorDireccionesCompacto from "@/Components/BuscadorDirecciones";

import type { DomicilioDraft, TipoDomicilio } from "@/types/Proveedor";
import { getMissingFields } from "../utils/getMissingFields";

type Props = {
  domicilios: DomicilioDraft[];
  setDomicilios: (next: DomicilioDraft[]) => void;
};

const Optional = () => (
    <span className="ml-2 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
      Opcional
    </span>
);

const Required = () => <span className="ml-1 text-red-600 font-medium">*</span>;
const makeTmpId = () => globalThis.crypto?.randomUUID?.() ?? `tmp_${Date.now()}_${Math.random()}`;

export function StepDomicilios({ domicilios, setDomicilios }: Props) {
  const [editingTmpId, setEditingTmpId] = useState<string | null>(null);
  const [buscadorResetKey, setBuscadorResetKey] = useState(0);
  const [isChangingDireccion, setIsChangingDireccion] = useState(false);

  const defaultDraft = (): DomicilioDraft => ({
    _tmpId: makeTmpId(),
    tipo_domicilio: "",
    calle_id: "",
    altura: 0,
    predeterminado: false,
    codigo_postal: null,
    piso: null,
    departamento: null,
    observaciones: null,
    calle_nombre: null,
    provincia: null,
    localidad: null,
    lat: null,
    lon: null,
  });

  const [draft, setDraft] = useState<DomicilioDraft>(defaultDraft());

  const comboKey = (d: Pick<DomicilioDraft, "tipo_domicilio" | "calle_id" | "altura">) =>
    `${String(d.tipo_domicilio)}|${String(d.calle_id)}|${Number(d.altura)}`;

  const hasApiSelection = useMemo(
    () => !!draft.calle_id && draft.calle_id.trim() !== "" && Number(draft.altura) > 0,
    [draft.calle_id, draft.altura]
  );

  const duplicatesInList = useMemo(() => {
    const selfId = editingTmpId;
    const k = comboKey(draft);

    return (
      !!draft.tipo_domicilio &&
      !!draft.calle_id &&
      draft.altura > 0 &&
      (domicilios ?? []).some((x) => x._tmpId !== selfId && comboKey(x) === k)
    );
  }, [draft, domicilios, editingTmpId]);

  const isValid = useMemo(() => {
    if (!draft.tipo_domicilio) return false;
    if (!hasApiSelection) return false;
    if (duplicatesInList) return false;
    return true;
  }, [draft.tipo_domicilio, hasApiSelection, duplicatesInList]);

  const missingFields = getMissingFields([
    ["Tipo de domicilio", !!draft.tipo_domicilio],
    ["Dirección seleccionada desde resultados", hasApiSelection],
  ]);

  const resetDraft = () => {
    setEditingTmpId(null);
    setDraft(defaultDraft());
    setBuscadorResetKey((k) => k + 1);
    setIsChangingDireccion(false);
  };

  const normalizeDefaults = (rows: DomicilioDraft[]) => {
    let found = false;

    return rows.map((x) => {
      if (x.predeterminado && !found) {
        found = true;
        return x;
      }
      if (x.predeterminado && found) return { ...x, predeterminado: false };
      return x;
    });
  };

  const handleSave = () => {
    if (!isValid) {
      if (!draft.tipo_domicilio) toast.warning("Seleccioná el tipo de domicilio.");
      else if (!hasApiSelection) toast.warning("Seleccioná una dirección válida en los resultados.");
      else if (duplicatesInList) toast.warning("Ese domicilio ya existe en la lista.");
      else toast.warning("Revisá los datos del domicilio.");
      return;
    }

    const payload: DomicilioDraft = {
      ...draft,
      calle_id: String(draft.calle_id),
      altura: Number(draft.altura),
      tipo_domicilio: draft.tipo_domicilio as TipoDomicilio,
      predeterminado: !!draft.predeterminado,
    };

    const next = editingTmpId
      ? domicilios.map((x) => (x._tmpId === editingTmpId ? payload : x))
      : [...domicilios, payload];

    setDomicilios(normalizeDefaults(next));
    resetDraft();
  };

  const handleEdit = (tmpId: string) => {
    const row = domicilios.find((x) => x._tmpId === tmpId);
    if (!row) return;

    setEditingTmpId(tmpId);
    setDraft({ ...row });
    setIsChangingDireccion(false);
  };

  const handleDelete = async (tmpId: string) => {
    const row = domicilios.find((x) => x._tmpId === tmpId);
    const modalEl = document.getElementById("proveedores-wizard-modal");

    const result = await Swal.fire({
      title: "¿Eliminar domicilio?",
      html: row
        ? `<div style="text-align:left;font-size:13px;line-height:1.5;">
             <div style="margin-bottom:6px;"><b>Tipo:</b> ${row.tipo_domicilio}</div>
             <div style="margin-bottom:6px;"><b>Dirección:</b> ${row.calle_nombre ?? `calle_id ${row.calle_id}`} ${row.altura}</div>
             <div style="margin-bottom:6px;"><b>Ubicación:</b> ${[row.localidad, row.provincia].filter(Boolean).join(" · ") || "-"}</div>
             <div style="margin-bottom:6px;"><b>Código Postal:</b> ${row.codigo_postal || "-"}</div>
             <div style="margin-bottom:6px;"><b>Piso:</b> ${row.piso || "-"}</div>
             <div style="margin-bottom:6px;"><b>Departamento:</b> ${row.departamento || "-"}</div>
             <div style="margin-bottom:6px;"><b>Observaciones:</b> ${row.observaciones || "-"}</div>
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

    const next = domicilios.filter((x) => x._tmpId !== tmpId);
    setDomicilios(normalizeDefaults(next));

    if (editingTmpId === tmpId) resetDraft();

    await Swal.fire({
      title: "Eliminado",
      text: "El domicilio fue eliminado.",
      icon: "success",
      timer: 1200,
      showConfirmButton: false,
      target: modalEl ?? undefined,
    });
  };

  const setPredeterminado = (tmpId: string) => {
    setDomicilios(domicilios.map((x) => ({ ...x, predeterminado: x._tmpId === tmpId })));
  };

  const domicilioLabel = (d: DomicilioDraft) => {
    const calle = d.calle_nombre?.trim() ? d.calle_nombre : `calle_id ${d.calle_id}`;
    const loc = d.localidad ? ` · ${d.localidad}` : "";
    const prov = d.provincia ? ` · ${d.provincia}` : "";
    return `${calle} ${d.altura}${loc}${prov}`;
  };

  return (
    <>
      <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-6 w-full">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
                Paso 5 · Domicilios <Optional />
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Cargá domicilios <strong>Real</strong> y/o <strong>Fiscal</strong>. (Paso opcional)
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
              onClick={handleSave}
              disabled={!isValid}
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
              Tipo de domicilio <Required />
            </Label>
            <SingleSearchableSelect
              value={draft.tipo_domicilio}
              placeholder="Seleccionar..."
              options={[
                { id: "Real", label: "Real", keywords: ["real"] },
                { id: "Fiscal", label: "Fiscal", keywords: ["fiscal"] },
              ]}
              clearable
              onChange={(v) => setDraft((p) => ({ ...p, tipo_domicilio: (v as TipoDomicilio) || "" }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Predeterminado</Label>
            <label className="inline-flex items-center gap-2 text-sm mt-1">
              <input
                type="checkbox"
                className="accent-green-600 cursor-pointer"
                checked={draft.predeterminado}
                onChange={(e) => setDraft((p) => ({ ...p, predeterminado: e.target.checked }))}
              />
              Marcar como predeterminado
            </label>
            <p className="text-xs text-muted-foreground">
              Si marcás más de uno, quedará predeterminado solo el último seleccionado.
            </p>
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label>
              Dirección (API) <Required />
            </Label>

            {editingTmpId && !isChangingDireccion ? (
              <div className="rounded-lg border bg-muted/20 p-3 flex items-start justify-between gap-3">
                <div className="text-sm">
                  <div className="font-semibold">
                    {draft.calle_nombre ?? `calle_id ${draft.calle_id}`} {draft.altura}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {draft.localidad ?? ""}
                    {draft.provincia ? ` · ${draft.provincia}` : ""}
                  </div>
                  {draft.lat != null && draft.lon != null && (
                    <div className="mt-1 text-[10px] text-muted-foreground">
                      📍 {Number(draft.lat).toFixed(4)}, {Number(draft.lon).toFixed(4)}
                    </div>
                  )}
                </div>

                <Button type="button" variant="outline" className="cursor-pointer" onClick={() => setIsChangingDireccion(true)}>
                  Cambiar dirección
                </Button>
              </div>
            ) : (
              <BuscadorDireccionesCompacto
                resetKey={buscadorResetKey}
                mostrarMapa={true}
                mostrarBorde={false}
                initialFilters={
                  editingTmpId
                    ? {
                        provincia: draft.provincia ?? null,
                        localidad: draft.localidad ?? null,
                        calle: draft.calle_nombre ?? null,
                        altura: draft.altura > 0 ? draft.altura : null,
                      }
                    : undefined
                }
                value={
                  hasApiSelection
                    ? {
                        calle_id: draft.calle_id,
                        altura: draft.altura,
                        calle_nombre: draft.calle_nombre ?? undefined,
                        provincia: draft.provincia ?? undefined,
                        localidad: draft.localidad ?? undefined,
                        lat: draft.lat ?? undefined,
                        lon: draft.lon ?? undefined,
                      }
                    : null
                }
                mostrarResultados={!editingTmpId || isChangingDireccion}
                onDireccionSeleccionada={(d) => {
                  if (!d) {
                    setDraft((p) => ({
                      ...p,
                      calle_id: "",
                      altura: 0,
                      codigo_postal: null,
                      piso: null,
                      departamento: null,
                      observaciones: null,
                      calle_nombre: null,
                      provincia: null,
                      localidad: null,
                      lat: null,
                      lon: null,
                    }));
                    return;
                  }

                  setDraft((p) => ({
                    ...p,
                    calle_id: String(d.calle_id),
                    altura: Number(d.altura),
                    calle_nombre: d.calle_nombre ?? null,
                    provincia: d.provincia ?? null,
                    localidad: d.localidad ?? null,
                    lat: d.lat ?? null,
                    lon: d.lon ?? null,
                  }));

                  if (editingTmpId) setIsChangingDireccion(false);
                }}
              />
            )}

            {!hasApiSelection ? (
              <div className="text-xs text-muted-foreground">
                Seleccioná una dirección en los resultados para poder {editingTmpId ? "guardar cambios" : "agregar"}.
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                Seleccionado: <strong>{draft.calle_nombre ?? "Calle"}</strong> {draft.altura}
                {draft.localidad ? ` · ${draft.localidad}` : ""}
                {draft.provincia ? ` · ${draft.provincia}` : ""}
              </div>
            )}

            {hasApiSelection && (
              <div className="md:col-span-2 rounded-xl border bg-muted/10 p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold">Datos adicionales (opcional)</h3>
                  <p className="text-xs text-muted-foreground">Completa solo si corresponde.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Código Postal</Label>
                    <input
                      className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                      value={draft.codigo_postal ?? ""}
                      onChange={(e) => setDraft((p) => ({ ...p, codigo_postal: e.target.value || null }))}
                      placeholder="Ej: 1878"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Piso</Label>
                    <input
                      className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                      value={draft.piso ?? ""}
                      onChange={(e) => setDraft((p) => ({ ...p, piso: e.target.value || null }))}
                      placeholder="Ej: 3 / PB"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Departamento</Label>
                    <input
                      className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                      value={draft.departamento ?? ""}
                      onChange={(e) => setDraft((p) => ({ ...p, departamento: e.target.value || null }))}
                      placeholder="Ej: A"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Observaciones</Label>
                    <input
                      className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                      value={draft.observaciones ?? ""}
                      onChange={(e) => setDraft((p) => ({ ...p, observaciones: e.target.value || null }))}
                      placeholder="Ej: Portón negro"
                    />
                  </div>
                </div>
              </div>
            )}

            {!isValid && (missingFields.length > 0 || duplicatesInList) && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
                <div className="font-medium mb-1">Revisá estos puntos:</div>
                <ul className="list-disc ml-5 space-y-0.5 text-sm">
                  {missingFields.map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                  {duplicatesInList && <li>Ese domicilio ya existe en la lista.</li>}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-background overflow-hidden mt-4">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="text-sm font-medium flex items-center gap-2">
            <Hotel  className="h-4 w-4 text-muted-foreground"/> 
            Domicilios cargados
          </div>
          <div className="text-xs text-muted-foreground">Total: {domicilios.length}</div>
        </div>

        {domicilios.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">Todavía no cargaste domicilios. (es opcional, puede continuar igual)</div>
        ) : (
          <div className="divide-y">
            {domicilios.map((d) => (
              <div key={d._tmpId} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold truncate">{domicilioLabel(d)}</span>

                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                      {d.tipo_domicilio}
                    </span>

                    {d.predeterminado && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-semibold inline-flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Predeterminado
                      </span>
                    )}
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
                    {d.codigo_postal ? <span>CP: {d.codigo_postal}</span> : null}
                    {d.piso ? <span>Piso: {d.piso}</span> : null}
                    {d.departamento ? <span>Dto: {d.departamento}</span> : null}
                    {d.observaciones ? <span className="truncate max-w-[520px]">Obs: {d.observaciones}</span> : null}
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  {!d.predeterminado && (
                    <Button type="button" variant="outline" size="sm" className="cursor-pointer" onClick={() => setPredeterminado(d._tmpId)}>
                      Predeterminar
                    </Button>
                  )}

                  <Button
                    type="button"
                    size="sm"
                    className="bg-amber-400 hover:bg-amber-500 text-white cursor-pointer"
                    onClick={() => handleEdit(d._tmpId)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                    onClick={() => handleDelete(d._tmpId)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
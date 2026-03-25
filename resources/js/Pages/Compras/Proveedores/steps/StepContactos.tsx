import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Phone, AtSign, Notebook, Star } from "lucide-react";
import Swal from "sweetalert2";

import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import TextInput from "@/Components/TextInput";
import SingleSearchableSelect from "@/Components/SingleSelectSearchable";

import type { TipoContacto } from "@/types/TipoContacto";
import type { ContactoDraft } from "@/types/Proveedor";
import { getMissingFields } from "../utils/getMissingFields";

type Props = {
  contactos: ContactoDraft[];
  setContactos: (next: ContactoDraft[]) => void;
  tipoContactos: TipoContacto[];
  visited?: boolean;
};

const Optional = () => (
  <span className="ml-2 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
    Opcional
  </span>
);

const BORDER_FOCUS =
  "focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:border-gray-200";

const makeTmpId = () =>
  globalThis.crypto?.randomUUID?.() ?? `tmp_${Date.now()}_${Math.random()}`;

export function StepContactos({
  contactos,
  setContactos,
  tipoContactos,
  visited = false,
}: Props) {
  const [editingTmpId, setEditingTmpId] = useState<string | null>(null);

  const tipoOptions = useMemo(
    () =>
      (tipoContactos ?? [])
        .filter((t) => t.habilitado !== false)
        .map((t) => ({
          id: t.id,
          label: t.descripcion,
          keywords: [t.descripcion],
        })),
    [tipoContactos]
  );

  const tiposMap = useMemo(() => {
    const map = new Map<number, TipoContacto>();
    (tipoContactos ?? []).forEach((t) => map.set(Number(t.id), t));
    return map;
  }, [tipoContactos]);

  const defaultDraft = (): ContactoDraft => ({
    _tmpId: makeTmpId(),
    tipo_contacto: null,
    contacto: "",
    predeterminado: false,
  });

  const [draft, setDraft] = useState<ContactoDraft>(defaultDraft());

  const tipoDescripcion = useMemo(() => {
    if (!draft.tipo_contacto) return "";
    return tiposMap.get(Number(draft.tipo_contacto))?.descripcion ?? "";
  }, [draft.tipo_contacto, tiposMap]);

  const tipoDescripcionNormalized = tipoDescripcion.trim().toLowerCase();
  const normalizedContacto = useMemo(() => draft.contacto.trim(), [draft.contacto]);
  const onlyDigits = useMemo(() => normalizedContacto.replace(/\D/g, ""), [normalizedContacto]);

  const isEmail = tipoDescripcionNormalized.includes("email");
  const isTelefono = tipoDescripcionNormalized.includes("tel");
  const isCelular = tipoDescripcionNormalized.includes("cel");

  const emailOk = useMemo(() => {
    if (!isEmail || !normalizedContacto) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedContacto);
  }, [isEmail, normalizedContacto]);

  const telefonoOk = useMemo(() => {
    if (!isTelefono || !normalizedContacto) return true;
    return onlyDigits.length >= 8 && onlyDigits.length <= 20;
  }, [isTelefono, normalizedContacto, onlyDigits]);

  const celularOk = useMemo(() => {
    if (!isCelular || !normalizedContacto) return true;
    return onlyDigits.length >= 10 && onlyDigits.length <= 20;
  }, [isCelular, normalizedContacto, onlyDigits]);

  const contactoForCompare = useMemo(() => {
    if (!normalizedContacto) return "";
    return isEmail ? normalizedContacto.toLowerCase() : normalizedContacto;
  }, [normalizedContacto, isEmail]);

  const duplicatesInList = useMemo(() => {
    if (!draft.tipo_contacto || !contactoForCompare) return false;

    return (contactos ?? []).some((x) => {
      if (x._tmpId === editingTmpId) return false;
      if (Number(x.tipo_contacto) !== Number(draft.tipo_contacto)) return false;

      const other = (x.contacto ?? "").trim();
      const otherCmp = isEmail ? other.toLowerCase() : other;

      return otherCmp === contactoForCompare;
    });
  }, [contactos, draft.tipo_contacto, contactoForCompare, editingTmpId, isEmail]);

  const missingFields = getMissingFields([
    ["Tipo de contacto", !!draft.tipo_contacto],
    ["Contacto", !!normalizedContacto],
  ]);

  const errors = useMemo(() => {
    const list: string[] = [];

    if (!draft.tipo_contacto || !normalizedContacto) return list;

    if (isEmail && !emailOk) {
      list.push("El Email ingresado no es válido.");
    }

    if (isTelefono && !telefonoOk) {
      list.push("El teléfono debe tener entre 8 y 20 números.");
    }

    if (isCelular && !celularOk) {
      list.push("El celular debe tener entre 10 y 20 números.");
    }

    if (duplicatesInList) {
      list.push("Ya existe un contacto con ese tipo y valor.");
    }

    return list;
  }, [
    draft.tipo_contacto,
    normalizedContacto,
    isEmail,
    isTelefono,
    isCelular,
    emailOk,
    telefonoOk,
    celularOk,
    duplicatesInList,
  ]);

  const draftIsValid = missingFields.length === 0 && errors.length === 0;

  const resetDraft = () => {
    setEditingTmpId(null);
    setDraft(defaultDraft());
  };

  const normalizeDefaults = (rows: ContactoDraft[]) => {
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

  const setPredeterminado = (tmpId: string) => {
    setContactos((contactos ?? []).map((x) => ({ ...x, predeterminado: x._tmpId === tmpId })));
  };

  const handleSave = () => {
    if (!draftIsValid) {
      toast.warning(missingFields[0] ?? errors[0] ?? "Revisá los datos del contacto.", {
        duration: 3500,
      });
      return;
    }

    const payload: ContactoDraft = {
      ...draft,
      contacto: isEmail ? normalizedContacto.toLowerCase() : normalizedContacto,
      predeterminado: !!draft.predeterminado,
    };

    const next = editingTmpId
      ? (contactos ?? []).map((x) => (x._tmpId === editingTmpId ? payload : x))
      : [...(contactos ?? []), payload];

    setContactos(normalizeDefaults(next));
    resetDraft();
  };

  const handleEdit = (tmpId: string) => {
    const row = (contactos ?? []).find((x) => x._tmpId === tmpId);
    if (!row) return;

    setEditingTmpId(tmpId);
    setDraft({ ...row, contacto: row.contacto ?? "" });
  };

  const handleDelete = async (tmpId: string) => {
    const row = (contactos ?? []).find((x) => x._tmpId === tmpId);
    const modalEl = document.getElementById("proveedores-wizard-modal");

    const tipoDesc = row?.tipo_contacto ? tiposMap.get(Number(row.tipo_contacto))?.descripcion : null;

    const result = await Swal.fire({
      title: "¿Eliminar contacto?",
      html: row
        ? `<div style="text-align:left;font-size:13px;line-height:1.5;">
             <div style="margin-bottom:6px;"><b>Tipo:</b> ${tipoDesc ?? `#${row.tipo_contacto ?? "-"}`}</div>
             <div style="margin-bottom:6px;"><b>Contacto:</b> ${row.contacto || "-"}</div>
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

    const next = (contactos ?? []).filter((x) => x._tmpId !== tmpId);
    setContactos(normalizeDefaults(next));

    if (editingTmpId === tmpId) resetDraft();

    await Swal.fire({
      title: "Eliminado",
      text: "El contacto fue eliminado.",
      icon: "success",
      timer: 1200,
      showConfirmButton: false,
      target: modalEl ?? undefined,
    });
  };

  const stepCount = (contactos ?? []).length;

  return (
    <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-6 w-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
            Paso 6 · Contactos <Optional />
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Cargá <strong>teléfonos</strong>, <strong>celulares</strong> y <strong>emails</strong>. (Paso opcional)
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
            disabled={!draftIsValid}
            className={`text-white cursor-pointer ${
              draftIsValid ? "bg-green-600 hover:bg-green-700" : "bg-muted-foreground hover:bg-muted-foreground/90"
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
          <Label className="text-sm font-medium">Tipo de contacto</Label>
          <SingleSearchableSelect
            value={draft.tipo_contacto ?? ""}
            placeholder="Seleccionar tipo"
            options={tipoOptions}
            clearable
            onChange={(v) => setDraft((prev) => ({ ...prev, tipo_contacto: v ? Number(v) : null }))}
          />
          <p className="text-xs text-muted-foreground">Ej: Teléfono, Celular, Email.</p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Contacto</Label>
          <TextInput
            value={draft.contacto}
            onChange={(e) => setDraft((p) => ({ ...p, contacto: e.target.value }))}
            placeholder={
              isEmail
                ? "Ej: compras@empresa.com"
                : isCelular
                ? "Ej: 11 5555 5555"
                : "Ej: 4333 2211"
            }
            className={`w-full ${BORDER_FOCUS}`}
            autoComplete="off"
          />

          {isEmail && normalizedContacto && !emailOk && (
            <p className="text-xs text-red-600">Ingresá un email válido.</p>
          )}

          {isTelefono && normalizedContacto && !telefonoOk && (
            <p className="text-xs text-red-600">El teléfono debe tener entre 8 y 20 números.</p>
          )}

          {isCelular && normalizedContacto && !celularOk && (
            <p className="text-xs text-red-600">El celular debe tener entre 10 y 20 números.</p>
          )}

          {duplicatesInList && (
            <p className="text-xs text-red-600">Ya existe un contacto con ese tipo y valor.</p>
          )}
        </div>

        <div className="md:col-span-2 space-y-2">
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
      </div>

      {!draftIsValid && (missingFields.length > 0 || errors.length > 0) && (
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
            <Notebook className="h-4 w-4 text-muted-foreground" />
            Contactos cargados
          </div>
          <div className="text-xs text-muted-foreground">Total: {stepCount}</div>
        </div>

        {stepCount === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            Todavía no cargaste contactos. {visited ? "(es opcional, puede continuar igual)" : ""}
          </div>
        ) : (
          <div className="divide-y">
            {contactos.map((c) => {
              const tipoDesc = c.tipo_contacto ? tiposMap.get(Number(c.tipo_contacto))?.descripcion : null;
              const icon = (tipoDesc ?? "").toLowerCase().includes("email") ? (
                <AtSign className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Phone className="h-4 w-4 text-muted-foreground" />
              );

              return (
                <div key={c._tmpId} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {icon}
                      <span className="text-sm font-semibold truncate">
                        {tipoDesc ?? `Tipo #${c.tipo_contacto ?? "-"}`}
                      </span>

                      {c.predeterminado && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-semibold inline-flex items-center gap-1">
                          <Star className="h-3 w-3" />  
                          Predeterminado
                        </span>
                      )}
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground">
                      <span className="font-medium">Contacto:</span>{" "}
                      <span className="break-words">{c.contacto || "-"}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    {!c.predeterminado && (
                      <Button type="button" variant="outline" size="sm" className="cursor-pointer" onClick={() => setPredeterminado(c._tmpId)}>
                        Predeterminar
                      </Button>
                    )}

                    <Button
                      type="button"
                      size="sm"
                      className="bg-amber-400 hover:bg-amber-500 text-white cursor-pointer"
                      onClick={() => handleEdit(c._tmpId)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                      onClick={() => handleDelete(c._tmpId)}
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
    </div>
  );
}
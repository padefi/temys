import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { validateCBU, validateCVU } from "@/utils/validateFunctions";

import type { EntidadFinanciera, TipoEntidad } from "@/types/EntidadFinanciera";
import type { TipoMoneda } from "@/types/TipoMoneda";
import type { BancarioDraft, TipoClave, TipoCuenta } from "@/types/Proveedor";

export function useBancariosDraft(params: {
  bancarios: BancarioDraft[];
  setBancarios: (next: BancarioDraft[]) => void;
  entidadesFinancieras: EntidadFinanciera[];
  tiposMoneda: TipoMoneda[];
}) {
  const { bancarios, setBancarios, entidadesFinancieras, tiposMoneda } = params;

  const makeTmpId = () =>
    (globalThis.crypto?.randomUUID?.() ?? `tmp_${Date.now()}_${Math.random()}`);

  const normalizeKey = (v: string) => v.trim().toLowerCase();
  const onlyDigits = (v: string) => (v ?? "").replace(/\D/g, "");

  const entidadesMap = useMemo(() => {
    const m = new Map<number, EntidadFinanciera>();
    entidadesFinancieras.forEach((e) => m.set(e.id, e));
    return m;
  }, [entidadesFinancieras]);

  const entidadOptions = useMemo(
    () =>
      entidadesFinancieras
        .filter((e) => Number(e.habilitado) === 1 || e.habilitado === true)
        .map((e) => ({
          id: e.id,
          label: e.descripcion,
          keywords: [e.descripcion, e.tipo, e.clave_unica],
        })),
    [entidadesFinancieras]
  );

  const monedaOptions = useMemo(
    () =>
      tiposMoneda
        .filter((m) => Number(m.habilitado) === 1 || m.habilitado === true)
        .map((m) => ({
          id: m.id,
          label: `${m.descripcion} (${m.codigo})`,
          keywords: [m.descripcion, m.codigo, m.simbolo, m.pais_origen],
        })),
    [tiposMoneda]
  );

  const defaultDraft = (): BancarioDraft => ({
    _tmpId: makeTmpId(),
    entidad_financiera_id: null,
    tipo_clave: "",
    clave: "",
    alias: "",
    moneda_id: null,
    tipo_cuenta: "",
    predeterminado: false,
  });

  const [draft, setDraft] = useState<BancarioDraft>(defaultDraft());
  const [editingTmpId, setEditingTmpId] = useState<string | null>(null);

  const entidadSeleccionada = useMemo(() => {
    if (!draft.entidad_financiera_id) return null;
    return entidadesMap.get(draft.entidad_financiera_id) ?? null;
  }, [draft.entidad_financiera_id, entidadesMap]);

  const tipoClavePermitidas = useMemo<TipoClave[]>(() => {
    const tipo = entidadSeleccionada?.tipo as TipoEntidad | undefined;
    if (!tipo) return [];
    if (tipo === "Banco") return ["Cbu"];
    if (tipo === "Billetera Virtual") return ["Cvu"];
    return ["Cbu", "Cvu"]; // Financiera
  }, [entidadSeleccionada]);

  //Si cambia entidad y el tipo_clave quedó inválido → se corrige
  useEffect(() => {
    if (!draft.entidad_financiera_id) return;
    if (tipoClavePermitidas.length === 0) return;

    if (!draft.tipo_clave || !tipoClavePermitidas.includes(draft.tipo_clave as TipoClave)) {
      setDraft((prev) => ({ ...prev, tipo_clave: tipoClavePermitidas[0] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.entidad_financiera_id, entidadSeleccionada?.tipo]);

  const claveDigits = useMemo(() => onlyDigits(draft.clave), [draft.clave]);
  const aliasNormalized = useMemo(() => normalizeKey(draft.alias), [draft.alias]);

  const clavePrefix = entidadSeleccionada?.clave_unica ?? "";

  const hasClaveOrAlias = useMemo(() => Boolean(claveDigits) || Boolean(aliasNormalized), [claveDigits, aliasNormalized]);

  const clavePrefixOk = useMemo(() => {
    if (!claveDigits) return true; // vacío: ok
    if (claveDigits.length < 3) return false;
    return claveDigits.startsWith(clavePrefix);
  }, [claveDigits, clavePrefix]);

  const claveLenOk = useMemo(() => {
    if (!claveDigits) return true;
    return claveDigits.length === 22;
  }, [claveDigits]);

  const claveCbuOk = useMemo(() => {
    if (!claveDigits) return true;
    if (draft.tipo_clave !== "Cbu") return true;
    if (claveDigits.length !== 22) return false;
    return validateCBU(claveDigits);
  }, [claveDigits, draft.tipo_clave]);

  const claveCvuOk = useMemo(() => {
    if (!claveDigits) return true;
    if (draft.tipo_clave !== "Cvu") return true;
    if (claveDigits.length !== 22) return false;
    return validateCVU(claveDigits);
  }, [claveDigits, draft.tipo_clave]);

  const duplicatesInList = useMemo(() => {
    const selfId = editingTmpId;

    const claveDup =
      !!claveDigits &&
      (bancarios ?? []).some((x) => x._tmpId !== selfId && onlyDigits(x.clave) === claveDigits);

    const aliasDup =
      !!aliasNormalized &&
      (bancarios ?? []).some((x) => x._tmpId !== selfId && normalizeKey(x.alias) === aliasNormalized);

    return { claveDup, aliasDup };
  }, [bancarios, claveDigits, aliasNormalized, editingTmpId]);

  const errors = useMemo(() => {
    const e: string[] = [];

    if (!draft.entidad_financiera_id) e.push("Seleccioná una entidad financiera.");
    if (!draft.moneda_id) e.push("Seleccioná una moneda.");
    if (!draft.tipo_cuenta) e.push("Seleccioná un tipo de cuenta.");
    if (!draft.tipo_clave) e.push("Seleccioná un tipo de clave.");

    if (!hasClaveOrAlias) e.push("Debés completar al menos Clave o Alias.");

    if (claveDigits) {
      if (!clavePrefixOk) e.push(`La clave debe comenzar con ${clavePrefix}.`);
      if (!claveLenOk) e.push("La clave debe tener 22 dígitos.");
      if (draft.tipo_clave === "Cbu" && !claveCbuOk) e.push("CBU inválido.");
      if (draft.tipo_clave === "Cvu" && !claveCvuOk) e.push("CVU inválido.");
    }

    if (duplicatesInList.claveDup) e.push("Ya existe un registro con esa Clave.");
    if (duplicatesInList.aliasDup) e.push("Ya existe un registro con ese Alias.");

    return e;
  }, [
    draft.entidad_financiera_id,
    draft.moneda_id,
    draft.tipo_cuenta,
    draft.tipo_clave,
    hasClaveOrAlias,
    claveDigits,
    clavePrefixOk,
    claveLenOk,
    claveCbuOk,
    claveCvuOk,
    duplicatesInList.claveDup,
    duplicatesInList.aliasDup,
    clavePrefix,
  ]);

  const isValid = errors.length === 0;

  const resetDraft = () => {
    setEditingTmpId(null);
    setDraft(defaultDraft());
  };

  const normalizeDefaults = (rows: BancarioDraft[]) => {
    let found = false;
  
    return rows.map((x) => {
      if (x.predeterminado && !found) {
        found = true;
        return x;
      }
  
      if (x.predeterminado && found) {
        return { ...x, predeterminado: false };
      }
  
      return x;
    });
  };

  const saveDraft = () => {
    if (!isValid) {
      toast.warning(errors[0] ?? "Revisá los datos bancarios.", { duration: 3500 });
      return false;
    }
  
    const payload: BancarioDraft = {
      ...draft,
      clave: claveDigits,
      alias: draft.alias.trim(),
      predeterminado: !!draft.predeterminado,
    };
  
    const next = editingTmpId
      ? (bancarios ?? []).map((x) => (x._tmpId === editingTmpId ? payload : x))
      : [...(bancarios ?? []), payload];
  
    setBancarios(normalizeDefaults(next));
  
    resetDraft();
    return true;
  };

  const editRow = (tmpId: string) => {
    const row = (bancarios ?? []).find((x) => x._tmpId === tmpId);
    if (!row) return;

    setEditingTmpId(tmpId);
    setDraft({
      ...row,
      clave: row.clave ?? "",
      alias: row.alias ?? "",
    });
  };

  const deleteRow = (tmpId: string) => {
    const next = (bancarios ?? []).filter((x) => x._tmpId !== tmpId);
    setBancarios(normalizeDefaults(next));
  
    if (editingTmpId === tmpId) resetDraft();
  };

  const setPredeterminado = (tmpId: string) => {
    setBancarios(
      (bancarios ?? []).map((x) => ({
        ...x,
        predeterminado: x._tmpId === tmpId,
      }))
    );
  };

  const tipoCuentaOptions = useMemo(
    () => [
      {
        id: "Caja de Ahorro" as TipoCuenta,
        label: "Caja de Ahorro",
        keywords: ["caja", "ahorro"] as string[],
      },
      {
        id: "Cuenta Corriente" as TipoCuenta,
        label: "Cuenta Corriente",
        keywords: ["cuenta", "corriente"] as string[],
      },
    ],
    []
  );

  const tipoClaveOptions = useMemo(
    () =>
      tipoClavePermitidas.map((t) => ({
        id: t,
        label: t === "Cbu" ? "CBU" : "CVU",
        keywords: [t.toLowerCase()],
      })),
    [tipoClavePermitidas]
  );

  return {
    entidadOptions,
    monedaOptions,
    tipoCuentaOptions,
    tipoClaveOptions,

    draft,
    setDraft,
    editingTmpId,

    entidadSeleccionada,
    claveDigits,
    aliasNormalized,
    hasClaveOrAlias,

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
    deleteRow,
    setPredeterminado,
  };
}
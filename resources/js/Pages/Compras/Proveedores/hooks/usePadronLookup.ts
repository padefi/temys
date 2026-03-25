import { useEffect, useState } from "react";
import { cuitValidator } from "@/utils/validateFunctions";
import type { TipoDocumento } from "@/types/Padron";

export type PadronStatus =
  | "idle"
  | "checking"
  | "not_found"
  | "padron_only"
  | "cliente"
  | "proveedor"
  | "error";

type PadronResult = {
  status: PadronStatus;
  padron_id?: number | null;
  nacionalidad?: number | null;
  message?: string | null;
};

type Args = {
  tipo_documento: TipoDocumento;
  documento: string;
  onResult: (r: PadronResult) => void;
  enabled?: boolean;
};

export function usePadronLookup({
  tipo_documento,
  documento,
  onResult,
  enabled = true,
}: Args) {
  const [status, setStatus] = useState<PadronStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setStatus("idle");
      setMessage(null);
      onResult({ status: "idle", padron_id: null, nacionalidad: null, message: null });
      return;
    }

    if (!documento || !tipo_documento) {
      setStatus("idle");
      setMessage(null);
      onResult({ status: "idle", padron_id: null, nacionalidad: null, message: null });
      return;
    }

    const doc = documento.replace(/\D/g, "");

    if (tipo_documento === "CUIT" && !cuitValidator(doc)) {
      const msg = "CUIT inválido.";
      setStatus("error");
      setMessage(msg);
      onResult({ status: "error", padron_id: null, nacionalidad: null, message: msg });
      return;
    }

    setStatus("checking");
    setMessage(null);

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(
          route("proveedores.verify-padron", { tipo_documento, documento: doc }),
          {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              Accept: "application/json",
            },
            signal: controller.signal,
          }
        );

        const json = await response.json();
        const st = json.status as PadronStatus;

        setStatus(st);

        if (st === "not_found") {
          const msg =
            "No se encontraron registros existentes con el CUIT ingresado. Es válido para ser ingresado como Proveedor.";
          setMessage(msg);
          onResult({ status: st, padron_id: null, nacionalidad: null, message: msg });
          return;
        }

        if (st === "padron_only") {
          const msg =
            "El CUIT se encuentra asociado pero no se encontró registro como Proveedor. Es válido para ingresarlo.";
          setMessage(msg);
          onResult({
            status: st,
            padron_id: json.padron_id ?? null,
            nacionalidad: json.nacionalidad ?? null,
            message: msg,
          });
          return;
        }

        if (st === "cliente") {
          const msg =
            "El CUIT ingresado ya existe como Cliente pero no como Proveedor, por lo que es válido para ingresarlo.";
          setMessage(msg);
          onResult({
            status: st,
            padron_id: json.padron_id ?? null,
            nacionalidad: json.nacionalidad ?? null,
            message: msg,
          });
          return;
        }

        if (st === "proveedor") {
          const msg =
            "El CUIT ingresado ya existe como Proveedor, por lo que no es válido para ser ingresado como nuevo Proveedor.";
          setMessage(msg);
          onResult({
            status: st,
            padron_id: json.padron_id ?? null,
            nacionalidad: json.nacionalidad ?? null,
            message: msg,
          });
          return;
        }

        setMessage(null);
        onResult({
          status: st,
          padron_id: json.padron_id ?? null,
          nacionalidad: json.nacionalidad ?? null,
          message: null,
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        const msg = "Error al verificar registro existente.";
        setStatus("error");
        setMessage(msg);
        onResult({ status: "error", padron_id: null, nacionalidad: null, message: msg });
      }
    }, 400);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [enabled, tipo_documento, documento, onResult]);

  return { status, message };
}
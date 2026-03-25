import { useMemo } from "react";
import { CheckCircle2, Landmark, User2, BadgeCheck } from "lucide-react";
import { Label } from "@/Components/ui/label";

import type { Nacionalidad } from "@/types/Nacionalidad";
import type { ProveedorForm } from "@/types/Proveedor";
import type { CondicionIva } from "@/types/CondicionIva";
import type { ActividadEconomica } from "@/types/ActividadEconomica";
import type { Mode } from "@/types/Padron";

type Props = {
  mode: Mode;
  data: ProveedorForm;
  nacionalidades: Nacionalidad[];
  docsCount: number;
  condicionesIva: CondicionIva[];
  actividades: ActividadEconomica[];
};

export function StepConfirmacion({
  mode,
  data,
  nacionalidades,
  docsCount,
  condicionesIva,
  actividades,
}: Props) {
  const isEdit = mode === "edit";

  const nacionalidadLabel = useMemo(() => {
    if (!data.nacionalidad) return "-";
    const n = nacionalidades.find((x) => Number(x.id) === Number(data.nacionalidad));
    return n?.nacionalidad ?? `#${data.nacionalidad}`;
  }, [data.nacionalidad, nacionalidades]);

  const condicionIvaLabel = useMemo(() => {
    if (!data.condicion_iva_id) return "-";
    const c = condicionesIva.find((x) => Number(x.id) === Number(data.condicion_iva_id));
    return c?.descripcion ?? `#${data.condicion_iva_id}`;
  }, [data.condicion_iva_id, condicionesIva]);

  const actividadesLabels = useMemo(() => {
    if (!data.actividades_ids.length) return [];
    return actividades
      .filter((a) => data.actividades_ids.includes(Number(a.id)))
      .map((a) => a.descripcion);
  }, [data.actividades_ids, actividades]);

  const bancariosCount = data.bancarios.length;
  const domiciliosCount = data.domicilios.length;
  const contactosCount = data.contactos.length;

  return (
    <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-6 w-full">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Paso 8 · Confirmación</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Revisá el resumen y luego presioná{" "}
          <strong>{isEdit ? "Editar Proveedor" : "Guardar Proveedor"}</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard
          icon={<User2 className="h-4 w-4 text-muted-foreground" />}
          title="Identificación"
        >
          <Row label="Tipo documento" value={data.tipo_documento || "-"} />
          <Row label="Documento" value={data.documento || "-"} />
          <Row label="Nacionalidad" value={nacionalidadLabel} />
        </SectionCard>

        <SectionCard
          icon={<CheckCircle2 className="h-4 w-4 text-muted-foreground" />}
          title="Proveedor"
        >
          <Row label="Razón social" value={data.razon_social || "-"} />
          <Row label="Nombre fantasía" value={data.nombre_fantasia || "-"} />
          <Row label="Tipo" value={data.tipo || "-"} />
        </SectionCard>

        <SectionCard
          icon={<BadgeCheck className="h-4 w-4 text-muted-foreground" />}
          title="Actividad / IVA"
        >
          <Row label="Condición IVA" value={condicionIvaLabel} />

          <div className="flex items-start justify-between gap-3">
            <Label className="text-xs text-muted-foreground">Actividades</Label>
            <div className="text-sm font-medium text-right break-words">
              {actividadesLabels.length === 0 ? "-" : `${actividadesLabels.length}`}
            </div>
          </div>

          {actividadesLabels.length > 0 && (
            <ul className="mt-1 list-disc ml-5 space-y-1 text-sm text-foreground">
              {actividadesLabels.slice(0, 6).map((actividad) => (
                <li key={actividad} className="break-words">
                  {actividad}
                </li>
              ))}
              {actividadesLabels.length > 6 && (
                <li className="text-muted-foreground">
                  + {actividadesLabels.length - 6} más…
                </li>
              )}
            </ul>
          )}
        </SectionCard>

        <div className="lg:col-span-3 rounded-xl border bg-background p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Landmark className="h-4 w-4 text-muted-foreground" />
            Cargas
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <MiniStat label="Bancarios" value={String(bancariosCount)} />
            <MiniStat label="Documentos" value={String(docsCount)} />
            <MiniStat label="Domicilios (opc.)" value={String(domiciliosCount)} />
            <MiniStat label="Contactos (opc.)" value={String(contactosCount)} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-green-50 border-green-200 p-4 text-sm text-green-900">
        <div className="font-semibold">
          {isEdit ? "Listo para actualizar" : "Listo para guardar"}
        </div>
        <div className="text-sm mt-1">
          Si necesitás corregir algún dato, usá <strong>Anterior</strong> para volver al paso correspondiente.
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-background p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </div>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="text-sm font-medium text-right break-words">{value}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/10 px-3 py-2 flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
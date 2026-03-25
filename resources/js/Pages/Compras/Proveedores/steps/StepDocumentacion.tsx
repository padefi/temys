import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { toast } from "sonner";
import { Eye, Trash2, Upload } from "lucide-react";
import Swal from "sweetalert2";
import type { AdjuntoExistente, DocumentacionState, DocumentacionExistenteState, DocumentacionPreviews, DocPreview } from "@/types/Proveedor";
import type { Mode } from "@/types/Padron";

type Props = {
  mode: Mode;
  documentacion: DocumentacionState;
  documentacionExistente: DocumentacionExistenteState;
  previews: DocumentacionPreviews;

  totalBytes: number;
  maxFileSize: number;
  maxTotalSize: number;
  allowedTypes: string[];

  setSingleDoc: (file: File | null) => void;
  setConstanciaFechaAdjunto: (value: string | null) => void;
  clearSingleExistingDoc: () => void;

  addMultiDocs: (bucket: "constancias_cbu" | "exenciones", filesToAdd: File[]) => void;
  removeMultiDoc: (bucket: "constancias_cbu" | "exenciones", index: number) => void;
  clearMultiDocs: (bucket: "constancias_cbu" | "exenciones") => void;

  removeExistingMultiDoc: (bucket: "constancias_cbu" | "exenciones", index: number) => void;
  clearExistingMultiDocs: (bucket: "constancias_cbu" | "exenciones") => void;

  openPreview: (item: DocPreview) => void;
  openExistingPreview?: (item: AdjuntoExistente) => void;

  visited?: boolean;
  isValid?: boolean;
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const num = bytes / Math.pow(k, i);
  return `${num.toFixed(i === 0 ? 0 : 2)} ${sizes[i]}`;
};

const confirmSwal = async (args: {
  title: string;
  html: string;
  confirmText: string;
  successTitle: string;
}) => {
  const modalEl = document.getElementById("proveedores-wizard-modal");

  const result = await Swal.fire({
    title: args.title,
    html: args.html,
    icon: "warning",
    target: modalEl ?? undefined,
    backdrop: true,
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: args.confirmText,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#64748b",
  });

  if (!result.isConfirmed) return false;

  await Swal.fire({
    title: args.successTitle,
    icon: "success",
    timer: 1200,
    showConfirmButton: false,
    target: modalEl ?? undefined,
  });

  return true;
};

export default function StepDocumentacion({
  mode,
  documentacion,
  documentacionExistente,
  previews,
  totalBytes,
  maxFileSize,
  maxTotalSize,
  allowedTypes,
  setSingleDoc,
  setConstanciaFechaAdjunto,
  clearSingleExistingDoc,
  addMultiDocs,
  removeMultiDoc,
  clearMultiDocs,
  removeExistingMultiDoc,
  clearExistingMultiDocs,
  openPreview,
  openExistingPreview,
  visited = false,
  isValid = true,
}: Props) {
  const constanciaPreview = previews.constancia_inscripcion;

  const hasConstanciaFile =
    !!documentacion.constancia_inscripcion || !!documentacionExistente.constancia_inscripcion;

  const resolvedFechaAdjunto =
    documentacion.constancia_inscripcion_fecha_adjunto ??
    documentacionExistente.constancia_inscripcion?.fecha_adjunto ??
    "";

  const hasConstanciaFecha = !!resolvedFechaAdjunto;

  const validateIncomingFiles = (incoming: FileList | null) => {
    if (!incoming) return [];
    const incomingFiles = Array.from(incoming);
    const valid: File[] = [];

    for (const file of incomingFiles) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`El archivo "${file.name}" no es un tipo permitido.`);
        continue;
      }

      if (file.size > maxFileSize) {
        toast.error(`El archivo "${file.name}" supera ${formatBytes(maxFileSize)}.`);
        continue;
      }

      valid.push(file);
    }

    return valid;
  };

  const canAddBytes = (files: File[]) => {
    const addBytes = files.reduce((a, f) => a + f.size, 0);
    return totalBytes + addBytes <= maxTotalSize;
  };

  const confirmRemoveSingle = async (name: string, extra?: string) => {
    return confirmSwal({
      title: "¿Quitar archivo?",
      html: `<div style="text-align:left;font-size:13px;">
               <div><b>${name}</b></div>
               ${extra ? `<div style="opacity:.8">${extra}</div>` : ""}
             </div>`,
      confirmText: "Sí, quitar",
      successTitle: "Archivo quitado",
    });
  };

  return (
    <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-6 w-full">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Paso 7 · Documentación</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Podés subir <strong>imágenes</strong> o <strong>PDFs</strong> y administrarlos desde acá.
        </p>
      </div>

      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Límites</p>
            <p className="text-xs text-muted-foreground">
              Máximo por archivo: {formatBytes(maxFileSize)} · Total máximo: {formatBytes(maxTotalSize)}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            Total actual: <span className="font-semibold">{formatBytes(totalBytes)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-background p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Label className="text-sm font-medium">
              Constancia de Inscripción <span className="text-red-600">*</span>
            </Label>
            <p className="text-xs text-muted-foreground">Obligatoria. PDF o imagen.</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Fecha del adjunto <span className="text-red-600">*</span>
          </Label>
          <input
            type="date"
            className="w-full h-10 rounded-md border bg-background px-3 text-sm"
            value={resolvedFechaAdjunto}
            onChange={(e) => setConstanciaFechaAdjunto(e.target.value || null)}
          />
          <p className="text-xs text-muted-foreground">
            Esta fecha se guardará en el registro de constancia de inscripción.
          </p>
        </div>

        {documentacion.constancia_inscripcion ? (
          <div className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{documentacion.constancia_inscripcion.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatBytes(documentacion.constancia_inscripcion.size)}
              </p>
            </div>

            <div className="flex gap-2">
              {constanciaPreview && (
                <Button type="button" variant="outline" size="sm" className="cursor-pointer" onClick={() => openPreview(constanciaPreview)}>
                  <Eye className="h-4 w-4 mr-1" /> Ver
                </Button>
              )}

              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="cursor-pointer"
                onClick={async () => {
                  const ok = await confirmRemoveSingle(
                    documentacion.constancia_inscripcion!.name,
                    formatBytes(documentacion.constancia_inscripcion!.size)
                  );
                  if (!ok) return;
                  setSingleDoc(null);
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Quitar
              </Button>
            </div>
          </div>
        ) : documentacionExistente.constancia_inscripcion ? (
          <div className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {documentacionExistente.constancia_inscripcion.nombre_archivo}
              </p>
              <p className="text-xs text-muted-foreground">
                Archivo guardado previamente
                {/* {documentacionExistente.constancia_inscripcion.fecha_adjunto
                  ? ` · Fecha adjunto: ${documentacionExistente.constancia_inscripcion.fecha_adjunto}`
                  : ""} */}
                {documentacionExistente.constancia_inscripcion.size != null
                  ? ` · ${formatBytes(documentacionExistente.constancia_inscripcion.size)}`
                  : ""}
              </p>
            </div>

            <div className="flex gap-2">
              {openExistingPreview && documentacionExistente.constancia_inscripcion.url && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => openExistingPreview(documentacionExistente.constancia_inscripcion!)}
                >
                  <Eye className="h-4 w-4 mr-1" /> Ver
                </Button>
              )}

              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="cursor-pointer"
                onClick={async () => {
                  const ok = await confirmRemoveSingle(
                    documentacionExistente.constancia_inscripcion!.nombre_archivo,
                    "Archivo existente en servidor"
                  );
                  if (!ok) return;
                  clearSingleExistingDoc();
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Quitar
              </Button>
            </div>
          </div>
        ) : (
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed bg-background p-6 text-sm text-muted-foreground hover:bg-muted/30 transition">
            <Upload className="h-4 w-4" />
            <span>Adjuntar archivo</span>
            <input
              type="file"
              className="hidden"
              accept={[...allowedTypes, ".pdf", ".png", ".jpg", ".jpeg", ".webp"].join(",")}
              onChange={(e) => {
                const files = validateIncomingFiles(e.target.files);
                const file = files[0] ?? null;
                if (!file) return;

                if (!canAddBytes([file])) {
                  toast.error(`El total de archivos no puede superar ${formatBytes(maxTotalSize)}.`);
                  return;
                }

                setSingleDoc(file);
                e.currentTarget.value = "";
              }}
            />
          </label>
        )}

        {visited && !isValid && !hasConstanciaFile && (
          <div className="rounded-lg border bg-red-50 border-red-200 px-4 py-3 text-sm text-red-900">
            Debés adjuntar la Constancia de Inscripción.
          </div>
        )}
        {visited && !isValid && hasConstanciaFile && !hasConstanciaFecha && (
          <div className="rounded-lg border bg-red-50 border-red-200 px-4 py-3 text-sm text-red-900">
            Debés ingresar la fecha de la Constancia de Inscripción.
          </div>
        )}
      </div>

      <Bucket
        title="Constancias CBU / CVU"
        subtitle="Opcional. Podés adjuntar una o varias."
        files={documentacion.constancias_cbu}
        existingFiles={documentacionExistente.constancias_cbu}
        previews={previews.constancias_cbu}
        onAdd={(list) => {
          const files = validateIncomingFiles(list);
          if (files.length === 0) return;

          if (!canAddBytes(files)) {
            toast.error(`El total de archivos no puede superar ${formatBytes(maxTotalSize)}.`);
            return;
          }

          addMultiDocs("constancias_cbu", files);
        }}
        onRemove={(idx) => removeMultiDoc("constancias_cbu", idx)}
        onClear={() => clearMultiDocs("constancias_cbu")}
        onRemoveExisting={(idx) => removeExistingMultiDoc("constancias_cbu", idx)}
        onClearExisting={() => clearExistingMultiDocs("constancias_cbu")}
        onPreview={openPreview}
        onExistingPreview={openExistingPreview}
        accept={[...allowedTypes, ".pdf", ".png", ".jpg", ".jpeg", ".webp"].join(",")}
      />

      <Bucket
        title="Exenciones"
        subtitle="Opcional. Adjuntá documentación relacionada."
        files={documentacion.exenciones}
        existingFiles={documentacionExistente.exenciones}
        previews={previews.exenciones}
        onAdd={(list) => {
          const files = validateIncomingFiles(list);
          if (files.length === 0) return;

          if (!canAddBytes(files)) {
            toast.error(`El total de archivos no puede superar ${formatBytes(maxTotalSize)}.`);
            return;
          }

          addMultiDocs("exenciones", files);
        }}
        onRemove={(idx) => removeMultiDoc("exenciones", idx)}
        onClear={() => clearMultiDocs("exenciones")}
        onRemoveExisting={(idx) => removeExistingMultiDoc("exenciones", idx)}
        onClearExisting={() => clearExistingMultiDocs("exenciones")}
        onPreview={openPreview}
        onExistingPreview={openExistingPreview}
        accept={[...allowedTypes, ".pdf", ".png", ".jpg", ".jpeg", ".webp"].join(",")}
      />
    </div>
  );
}

function Bucket(props: {
  title: string;
  subtitle: string;
  files: File[];
  existingFiles: AdjuntoExistente[];
  previews: DocPreview[];
  onAdd: (files: FileList | null) => void;
  onRemove: (index: number) => void;
  onClear: () => void;
  onRemoveExisting: (index: number) => void;
  onClearExisting: () => void;
  onPreview: (item: DocPreview) => void;
  onExistingPreview?: (item: AdjuntoExistente) => void;
  accept: string;
}) {
  const {
    title,
    subtitle,
    files,
    existingFiles,
    previews,
    onAdd,
    onRemove,
    onClear,
    onRemoveExisting,
    onClearExisting,
    onPreview,
    onExistingPreview,
    accept,
  } = props;

  const totalCount = files.length + existingFiles.length;

  const confirmRemove = async (name: string, extra?: string) => {
    return confirmSwal({
      title: "¿Quitar archivo?",
      html: `<div style="text-align:left;font-size:13px;">
               <div><b>${name}</b></div>
               ${extra ? `<div style="opacity:.8">${extra}</div>` : ""}
             </div>`,
      confirmText: "Sí, quitar",
      successTitle: "Archivo quitado",
    });
  };

  const confirmClear = async () => {
    return confirmSwal({
      title: "¿Limpiar archivos?",
      html: `<div style="text-align:left;font-size:13px;">
               <div>Se eliminarán <b>${totalCount}</b> archivo(s) de esta sección.</div>
             </div>`,
      confirmText: "Sí, limpiar",
      successTitle: "Archivos eliminados",
    });
  };

  return (
    <div className="rounded-xl border bg-background p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Label className="text-sm font-medium">{title}</Label>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>

        {totalCount > 0 ? (
          <Button
            type="button"
            variant="ghost"
            className="text-xs cursor-pointer"
            onClick={async () => {
              const ok = await confirmClear();
              if (!ok) return;
              onClearExisting();
              onClear();
            }}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Limpiar
          </Button>
        ) : null}
      </div>

      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed bg-background p-4 text-sm text-muted-foreground hover:bg-muted/30 transition">
        <Upload className="h-4 w-4" />
        <span>Agregar archivos</span>
        <input
          type="file"
          className="hidden"
          multiple
          accept={accept}
          onChange={(e) => {
            onAdd(e.target.files);
            e.currentTarget.value = "";
          }}
        />
      </label>

      {totalCount === 0 ? (
        <div className="text-xs text-muted-foreground px-1">No hay archivos adjuntos.</div>
      ) : (
        <div className="space-y-2">
          {existingFiles.map((f, idx) => (
            <div
              key={`existing-${f.id}`}
              className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{f.nombre_archivo}</p>
                <p className="text-xs text-muted-foreground">
                  Archivo guardado previamente
                  {f.fecha_adjunto ? ` · Fecha adjunto: ${f.fecha_adjunto}` : ""}
                  {f.size != null ? ` · ${formatBytes(f.size)}` : ""}
                </p>
              </div>

              <div className="flex gap-2">
                {onExistingPreview && f.url && (
                  <Button type="button" variant="outline" size="sm" className="cursor-pointer" onClick={() => onExistingPreview(f)}>
                    <Eye className="h-4 w-4 mr-1" /> Ver
                  </Button>
                )}

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="cursor-pointer"
                  onClick={async () => {
                    const ok = await confirmRemove(f.nombre_archivo, "Archivo existente en servidor");
                    if (!ok) return;
                    onRemoveExisting(idx);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Quitar
                </Button>
              </div>
            </div>
          ))}

          {files.map((f, idx) => {
            const prev = previews[idx];

            return (
              <div
                key={`${f.name}-${f.size}-${f.lastModified}`}
                className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(f.size)}</p>
                </div>

                <div className="flex gap-2">
                  {prev && (
                    <Button type="button" variant="outline" size="sm" className="cursor-pointer" onClick={() => onPreview(prev)}>
                      <Eye className="h-4 w-4 mr-1" /> Ver
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer"
                    onClick={async () => {
                      const ok = await confirmRemove(f.name, formatBytes(f.size));
                      if (!ok) return;
                      onRemove(idx);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Quitar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
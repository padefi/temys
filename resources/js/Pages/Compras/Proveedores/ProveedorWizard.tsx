import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "@inertiajs/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { toast } from "sonner";

import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "@/Components/ui/dialog";

import type { Nacionalidad } from "@/types/Nacionalidad";
import type { CondicionIva } from "@/types/CondicionIva";
import type { ActividadEconomica } from "@/types/ActividadEconomica";
import type { EntidadFinanciera } from "@/types/EntidadFinanciera";
import type { TipoMoneda } from "@/types/TipoMoneda";
import type { TipoContacto } from "@/types/TipoContacto";
import type { AdjuntoExistente, ProveedorCreatePayload, ProveedorForm, ProveedorUpdatePayload, DocPreview } from "@/types/Proveedor";
import type { Mode } from "@/types/Padron";

import { stepper, WIZARD_STEPS, type StepId } from "./utils/proveedorWizard";
import { buildProveedorCreatePayload, buildProveedorUpdatePayload } from "./utils/proveedorPayload";
import { usePadronLookup } from "./hooks/usePadronLookup";
import { useWizardScroll } from "./hooks/useWizardScroll";

import WizardNav from "./components/WizardNav";
import WizardFooter from "./components/WizardFooter";

import { StepIdentificacion } from "./steps/StepIdentificacion";
import { StepProveedor } from "./steps/StepProveedor";
import { StepActividadIva } from "./steps/StepActividadIva";
import { StepBancarios } from "./steps/StepBancarios";
import { StepDomicilios } from "./steps/StepDomicilios";
import { StepContactos } from "./steps/StepContactos";
import StepDocumentacion from "./steps/StepDocumentacion";
import { StepConfirmacion } from "./steps/StepConfirmacion";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  mode: Mode;
  initialData: ProveedorForm;
  onSubmit: (payload: ProveedorCreatePayload | ProveedorUpdatePayload) => void;
  nacionalidades: Nacionalidad[];
  condicionesIva: CondicionIva[];
  actividades: ActividadEconomica[];
  entidadesFinancieras: EntidadFinanciera[];
  tiposMoneda: TipoMoneda[];
  tipoContactos: TipoContacto[];
};

const OPTIONAL: StepId[] = ["domicilios", "contactos"];
const isOptional = (id: StepId) => OPTIONAL.includes(id);

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MAX_TOTAL_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_TYPES = ["application/pdf", ...ALLOWED_IMAGE_TYPES];

type PreviewItem = {
  name: string;
  url: string;
  mimeType?: string | null;
}

type DocState = ProveedorForm["documentacion"];

type DocPreviews = {
  constancia_inscripcion: DocPreview | null;
  constancias_cbu: DocPreview[];
  exenciones: DocPreview[];
};

const fileKey = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;
const isImageMime = (mime?: string | null) => !!mime && mime.startsWith("image/");
const isPdfMime = (mime?: string | null) => mime === "application/pdf";

const getMimeTypeFromFilename = (filename: string): string | null => {
  const ext = filename.split(".").pop()?.toLowerCase();

  if (!ext) return null;
  if (["jpg", "jpeg"].includes(ext)) return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "pdf") return "application/pdf";

  return null;
};

export default function ProveedorWizard(props: Props) {
  const { open, setOpen, mode, initialData } = props;

  const { data, setData, processing } = useForm<ProveedorForm>(initialData);

  const [visited, setVisited] = useState<Set<StepId>>(() => new Set(["identificacion"]));
  const [nacionalidadFromPadron, setNacionalidadFromPadron] = useState(false);
  const [docPreviews, setDocPreviews] = useState<DocPreviews>({
    constancia_inscripcion: null,
    constancias_cbu: [],
    exenciones: [],
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<PreviewItem | null>(null);

  const replaceFormData = useCallback((next: ProveedorForm) => {
    setData("tipo_documento", next.tipo_documento);
    setData("documento", next.documento);
    setData("nacionalidad", next.nacionalidad);
    setData("padron_id", next.padron_id);

    setData("razon_social", next.razon_social);
    setData("nombre_fantasia", next.nombre_fantasia);
    setData("tipo", next.tipo);

    setData("condicion_iva_id", next.condicion_iva_id);
    setData("actividades_ids", next.actividades_ids);

    setData("bancarios", next.bancarios);
    setData("domicilios", next.domicilios);
    setData("contactos", next.contactos);

    setData("documentacion", next.documentacion);
    setData("documentacion_existente", next.documentacion_existente);
    setData("anotaciones", next.anotaciones);
  }, [setData]);

  const openPreview = (item: DocPreview) => {
    setPreviewItem({
      name: item.file.name,
      url: item.url,
      mimeType: item.file.type,
    });
    setPreviewOpen(true);
  };

  const openExistingPreview = (item: AdjuntoExistente) => {
    if (!item.url) {
      toast.error("El archivo no tiene URL disponible para visualizar.");
      return;
    }

    setPreviewItem({
      name: item.nombre_archivo,
      url: item.url,
      mimeType: getMimeTypeFromFilename(item.nombre_archivo),
    });
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setPreviewItem(null);
  };

  const onPadronResult = useCallback(
    (r: { status: any; padron_id?: number | null; nacionalidad?: number | null }) => {
      if (mode === "edit") return;

      if (r.status === "not_found") {
        setData("padron_id", null);
        setData("nacionalidad", null);
        setNacionalidadFromPadron(false);
        return;
      }

      if (r.status === "padron_only" || r.status === "cliente") {
        const nac = r.nacionalidad == null ? null : Number(r.nacionalidad);
        setData("padron_id", r.padron_id ?? null);
        setData("nacionalidad", nac);
        setNacionalidadFromPadron(nac !== null);
        return;
      }

      if (r.status === "proveedor") {
        setData("padron_id", r.padron_id ?? null);
        return;
      }

      setData("padron_id", null);
    },
    [mode, setData]
  );

  const { status: padronStatus, message: padronMessage } = usePadronLookup({
    tipo_documento: data.tipo_documento,
    documento: data.documento,
    onResult: onPadronResult,
    enabled: mode === "create",
  });

  const docsCount =
    (data.documentacion.constancia_inscripcion ? 1 : 0) +
    (data.documentacion.constancias_cbu?.length ?? 0) +
    (data.documentacion.exenciones?.length ?? 0) +
    (data.documentacion_existente.constancia_inscripcion ? 1 : 0) +
    (data.documentacion_existente.constancias_cbu?.length ?? 0) +
    (data.documentacion_existente.exenciones?.length ?? 0);

  const totalNewBytes = (doc: DocState) =>
    [doc.constancia_inscripcion, ...(doc.constancias_cbu ?? []), ...(doc.exenciones ?? [])]
      .filter(Boolean)
      .reduce((a, f) => a + (f as File).size, 0);

  const totalExistingBytes =
    (data.documentacion_existente.constancia_inscripcion?.size ?? 0) +
    (data.documentacion_existente.constancias_cbu ?? []).reduce((a, f) => a + (f.size ?? 0), 0) +
    (data.documentacion_existente.exenciones ?? []).reduce((a, f) => a + (f.size ?? 0), 0);

  const totalBytes = totalExistingBytes + totalNewBytes(data.documentacion);    

  const setSingleDoc = (file: File | null) => {
        setDocPreviews((p) => {
          if (p.constancia_inscripcion?.url) URL.revokeObjectURL(p.constancia_inscripcion.url);
          return {
            ...p,
            constancia_inscripcion: file ? { file, url: URL.createObjectURL(file) } : null,
          };
        });
      
        setData("documentacion", {
          ...data.documentacion,
          constancia_inscripcion: file,
        });
  };

  const addMultiDocs = (bucket: "constancias_cbu" | "exenciones", filesToAdd: File[]) => {
    const merged = [...(data.documentacion[bucket] ?? []), ...filesToAdd];
    const unique = merged.filter((f, i, a) => i === a.findIndex((x) => fileKey(x) === fileKey(f)));
    const nextDoc = { ...data.documentacion, [bucket]: unique };

    if (totalExistingBytes + totalNewBytes(nextDoc) > MAX_TOTAL_SIZE) {
      toast.error("El total de archivos no puede superar los 10 MB.");
      return;
    }

    setDocPreviews((p) => {
      p[bucket].forEach((x) => URL.revokeObjectURL(x.url));

      return {
        ...p,
        [bucket]: unique.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
      };
    });

    setData("documentacion", nextDoc);
  };

  const removeMultiDoc = (bucket: "constancias_cbu" | "exenciones", index: number) => {
    const nextArr = (data.documentacion[bucket] ?? []).filter((_, i) => i !== index);
  
    setDocPreviews((p) => {
      p[bucket].forEach((x) => URL.revokeObjectURL(x.url));
      return {
        ...p,
        [bucket]: nextArr.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
      };
    });
  
    setData("documentacion", {
      ...data.documentacion,
      [bucket]: nextArr,
    });
  };

  const clearMultiDocs = (bucket: "constancias_cbu" | "exenciones") => {
    setDocPreviews((p) => {
      p[bucket].forEach((x) => URL.revokeObjectURL(x.url));
      return { ...p, [bucket]: [] };
    });
  
    setData("documentacion", {
      ...data.documentacion,
      [bucket]: [],
    });
  };

  const setConstanciaFechaAdjunto = (value: string | null) => {
    setData("documentacion", {
      ...data.documentacion,
      constancia_inscripcion_fecha_adjunto: value,
    });
  };

  const clearSingleExistingDoc = () => {
    setData("documentacion_existente", {
      ...data.documentacion_existente,
      constancia_inscripcion: null,
    });
  };
  
  const removeExistingMultiDoc = (bucket: "constancias_cbu" | "exenciones", index: number) => {
    const nextArr = (data.documentacion_existente[bucket] ?? []).filter((_, i) => i !== index);
  
    setData("documentacion_existente", {
      ...data.documentacion_existente,
      [bucket]: nextArr,
    });
  };
  
  const clearExistingMultiDocs = (bucket: "constancias_cbu" | "exenciones") => {
    setData("documentacion_existente", {
      ...data.documentacion_existente,
      [bucket]: [],
    });
  };

  const handleSubmit = () => {
    try {
      const payload =
        mode === "edit"
          ? buildProveedorUpdatePayload(data)
          : buildProveedorCreatePayload(data);
  
      props.onSubmit(payload);
    } catch {
      toast.error("Error al preparar el payload");
    }
  };

  useEffect(() => {
    if (!open) return;

    replaceFormData(initialData);
    setVisited(new Set(["identificacion"]));
    setNacionalidadFromPadron(false);

    setDocPreviews((p) => {
      if (p.constancia_inscripcion?.url) URL.revokeObjectURL(p.constancia_inscripcion.url);
      p.constancias_cbu.forEach((x) => URL.revokeObjectURL(x.url));
      p.exenciones.forEach((x) => URL.revokeObjectURL(x.url));
      return { constancia_inscripcion: null, constancias_cbu: [], exenciones: [] };
    });

    setPreviewOpen(false);
    setPreviewItem(null);
  }, [open, initialData, replaceFormData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <DialogPrimitive.Content className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6">
          <div id="proveedores-wizard-modal" className="w-[95vw] max-w-[1200px] h-[95vh] bg-background border rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <DialogHeader className="px-6 sm:px-8 py-4 sm:py-5 border-b shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <DialogTitle className="text-xl sm:text-2xl font-semibold">
                    {mode === "edit" ? "Editar Proveedor" : "Nuevo Proveedor"}
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base">
                    {mode === "edit" ? "Edición guiada por pasos" : "Alta guiada por pasos"}
                  </DialogDescription>
                </div>

                <DialogPrimitive.Close asChild>
                  <button type="button" className="rounded-md p-2 text-muted-foreground hover:bg-muted transition-colors" aria-label="Cerrar">
                    ✕
                  </button>
                </DialogPrimitive.Close>
              </div>
            </DialogHeader>

            <stepper.Stepper.Provider
              key={open ? `${mode}-open` : `${mode}-closed`}
              variant="horizontal"
              labelOrientation="vertical"
              tracking={false}
              className="flex flex-col min-h-0 flex-1"
              initialStep="identificacion"
            >
              {({ methods }: { methods: ReturnType<typeof stepper.useStepper> }) => (
                <ProveedorWizardShell
                  {...props}
                  methods={methods}
                  data={data}
                  setData={setData}
                  processing={processing}
                  visited={visited}
                  setVisited={setVisited}
                  nacionalidadFromPadron={nacionalidadFromPadron}
                  padronStatus={padronStatus}
                  padronMessage={padronMessage}
                  docsCount={docsCount}
                  totalBytes={totalBytes}
                  docPreviews={docPreviews}
                  setSingleDoc={setSingleDoc}
                  setConstanciaFechaAdjunto={setConstanciaFechaAdjunto}
                  clearSingleExistingDoc={clearSingleExistingDoc}
                  addMultiDocs={addMultiDocs}
                  removeMultiDoc={removeMultiDoc}
                  clearMultiDocs={clearMultiDocs}
                  removeExistingMultiDoc={removeExistingMultiDoc}
                  clearExistingMultiDocs={clearExistingMultiDocs}
                  openPreview={openPreview}
                  openExistingPreview={openExistingPreview}
                  handleSubmit={handleSubmit}
                />
              )}
            </stepper.Stepper.Provider>

            <Dialog open={previewOpen} onOpenChange={(o) => (!o ? closePreview() : null)}>
              <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 bg-black/60 z-[60]" />
                <DialogPrimitive.Content className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                  <DialogTitle className="sr-only">Vista previa de archivo</DialogTitle>

                  <div className="w-[95vw] max-w-[1000px] h-[85vh] bg-background border rounded-xl shadow-lg overflow-hidden flex flex-col">
                    <div className="px-4 py-3 border-b flex items-center justify-between">
                      <div className="text-sm font-medium truncate">{previewItem?.name ?? "Vista previa"}</div>
                      <button
                        type="button"
                        className="rounded-md p-2 text-muted-foreground hover:bg-muted"
                        onClick={closePreview}
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex-1 min-h-0 overflow-auto bg-muted/20 p-4">
                      {!previewItem ? (
                        <div className="text-sm text-muted-foreground">Sin archivo para previsualizar.</div>
                      ) : isImageMime(previewItem.mimeType) ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <img
                            src={previewItem.url}
                            alt={previewItem.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ) : isPdfMime(previewItem.mimeType) ? (
                        <iframe
                          title={previewItem.name}
                          src={previewItem.url}
                          className="w-full h-full rounded-md border bg-background"
                        />
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Este tipo de archivo no tiene vista previa.
                        </div>
                      )}
                    </div>
                  </div>
                </DialogPrimitive.Content>
              </DialogPrimitive.Portal>
            </Dialog>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}

function ProveedorWizardShell({
    methods,
    setOpen,
    mode,
    data,
    setData,
    processing,
    visited,
    setVisited,
    nacionalidades,
    condicionesIva,
    actividades,
    entidadesFinancieras,
    tiposMoneda,
    tipoContactos,
    nacionalidadFromPadron,
    padronStatus,
    padronMessage,
    docsCount,
    totalBytes,
    docPreviews,
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
    handleSubmit,
  }: Props & {
    methods: ReturnType<typeof stepper.useStepper>;
    data: ProveedorForm;
    setData: any;
    processing: boolean;
    visited: Set<StepId>;
    setVisited: React.Dispatch<React.SetStateAction<Set<StepId>>>;
    nacionalidadFromPadron: boolean;
    padronStatus: any;
    padronMessage: string | null;
    docsCount: number;
    totalBytes: number;
    docPreviews: {
      constancia_inscripcion: { file: File; url: string } | null;
      constancias_cbu: { file: File; url: string }[];
      exenciones: { file: File; url: string }[];
    };
    setSingleDoc: (file: File | null) => void;
    setConstanciaFechaAdjunto: (value: string | null) => void;
    clearSingleExistingDoc: () => void;
    addMultiDocs: (bucket: "constancias_cbu" | "exenciones", filesToAdd: File[]) => void;
    removeMultiDoc: (bucket: "constancias_cbu" | "exenciones", index: number) => void;
    clearMultiDocs: (bucket: "constancias_cbu" | "exenciones") => void;
    removeExistingMultiDoc: (bucket: "constancias_cbu" | "exenciones", index: number) => void;
    clearExistingMultiDocs: (bucket: "constancias_cbu" | "exenciones") => void;
    openPreview: (item: { file: File; url: string }) => void;
    openExistingPreview: (item: AdjuntoExistente) => void;
    handleSubmit: () => void;
  }) {
    const currentStepId = String((methods.state.current as any)?.id ?? (methods.state.current as any)?.data?.id) as StepId;
  
    const currentIndex = useMemo(() => {
      const arr = stepper.steps as any[];
      return arr.findIndex((s) => String(s?.id ?? s?.data?.id) === currentStepId);
    }, [currentStepId]);
  
    const { bodyRef, footerShadow } = useWizardScroll([currentStepId]);
  
    useEffect(() => {
      setVisited((p) => new Set(p).add(currentStepId));
    }, [currentStepId, setVisited]);
  
    const canContinueFromIdentificacion =
      mode === "edit" ? true : padronStatus === "not_found" || padronStatus === "padron_only" || padronStatus === "cliente";
  
    const showNacionalidad =
      mode === "edit" ? true : padronStatus === "not_found" || padronStatus === "padron_only" || padronStatus === "cliente";
  
    const stepValidation: Record<StepId, () => boolean> = {
      identificacion: () => canContinueFromIdentificacion,
      proveedor: () => !!data.razon_social.trim() && !!data.nombre_fantasia.trim() && !!data.tipo,
      actividad_iva: () => data.condicion_iva_id !== null && (data.actividades_ids?.length ?? 0) > 0,
      bancarios: () => (data.bancarios?.length ?? 0) > 0,
      domicilios: () => true,
      contactos: () => true,
      documentacion: () =>
        (!!data.documentacion.constancia_inscripcion ||
          !!data.documentacion_existente.constancia_inscripcion) &&
        !!(
          data.documentacion.constancia_inscripcion_fecha_adjunto ||
          data.documentacion_existente.constancia_inscripcion?.fecha_adjunto
        ),
      confirmacion: () => true,
    };
  
    const stepErrorMessage: Partial<Record<StepId, string>> = {
      identificacion: "Debés ingresar un CUIT válido.",
      proveedor: "Completá Razón Social, Nombre Fantasía y Tipo de Proveedor.",
      actividad_iva: "Debés seleccionar una Condición IVA y al menos una Actividad Económica.",
      bancarios: "Debés cargar al menos un dato bancario válido.",
      documentacion: "Debés adjuntar la Constancia de Inscripción.",
      confirmacion: "Completá todos los pasos anteriores antes de confirmar.",
    };
  
    const stepStatus = useMemo<Record<StepId, "valid" | "pending">>(() => {
      const st = {} as Record<StepId, "valid" | "pending">;
  
      (stepper.steps as any[]).forEach((s) => {
        const id = String(s?.id ?? s?.data?.id) as StepId;
        if (id === "confirmacion") return;
        if (isOptional(id)) {
          st[id] = visited.has(id) ? "valid" : "pending";
          return;
        }
        st[id] = !visited.has(id) ? "pending" : stepValidation[id]() ? "valid" : "pending";
      });
  
      return st;
    }, [visited, stepValidation]);
  
    const requiredStepsValid = useMemo(
      () =>
        (stepper.steps as any[])
          .map((s) => String(s?.id ?? s?.data?.id) as StepId)
          .filter((id) => id !== "confirmacion" && !isOptional(id))
          .every((id) => stepValidation[id]()),
      [stepValidation]
    );
  
    const canGoToStep = (id: StepId) => {
      if (id === "identificacion") return true;
      if (!stepValidation.identificacion()) return false;
      if (id === "confirmacion") return requiredStepsValid;
      return true;
    };
  
    const notifyInvalidGate = (target: StepId) => {
      if (target !== "identificacion" && !stepValidation.identificacion()) {
        toast.warning(stepErrorMessage.identificacion ?? "Primero completá Identificación.", { duration: 4000 });
        return;
      }
      if (target === "confirmacion") {
        toast.warning(stepErrorMessage.confirmacion ?? "Completá los pasos anteriores.", { duration: 4000 });
        return;
      }
      const msg = stepErrorMessage[target];
      if (msg) toast.warning(msg, { duration: 4000 });
    };
  
    const stepState = (index: number, stepId: StepId) => {
      const isCompleted = visited.has(stepId) && stepStatus[stepId] === "valid";
      const isActive = index === currentIndex;
      const isError = !isOptional(stepId) && visited.has(stepId) && stepStatus[stepId] === "pending" && !stepValidation[stepId]();
      return { isCompleted, isActive, isError };
    };
  
    const nav = methods?.navigation ?? methods;
    const canNext = !(currentStepId === "identificacion" && !stepValidation.identificacion());

    const onNext = () => {
    if (!canNext) return;

    const arr = stepper.steps as any[];
    const next = arr[currentIndex + 1];
    const nextId = next ? (String(next?.id ?? next?.data?.id) as StepId) : null;

    if (nextId === "confirmacion" && !requiredStepsValid) {
        notifyInvalidGate("confirmacion");
        return;
    }

    nav.next?.();
    };

    const onPrev = () => {
    nav.prev?.();
    };

    const onGoTo = (id: StepId) => {
    if (!canGoToStep(id)) {
        notifyInvalidGate(id);
        return;
    }

    nav.goTo?.(id);
    };
  
    const canSave = !!methods.state.isLast && !processing && requiredStepsValid;

    return (
      <>
        <WizardNav
          steps={WIZARD_STEPS}
          currentId={currentStepId}
          currentIndex={currentIndex}
          canGoToStep={canGoToStep}
          onGoTo={onGoTo}
          stepState={stepState}
        />
  
        <div ref={bodyRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain px-4 sm:px-6 py-5 sm:py-6">
          <div className="max-w-[1100px] mx-auto w-full min-h-0">
            <div key={currentStepId} className="transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-2">
            {currentStepId !== "confirmacion" && (
                <p className="text-md text-muted-foreground mb-2">
                Los campos marcados con <span className="text-red-600">*</span> son obligatorios.
                </p>
            )}
  
              {currentStepId === "identificacion" && (
                <StepIdentificacion
                  data={{ tipo_documento: data.tipo_documento, documento: data.documento, nacionalidad: data.nacionalidad }}
                  setData={setData}
                  nacionalidades={nacionalidades}
                  padronStatus={padronStatus}
                  padronMessage={padronMessage}
                  showNacionalidad={showNacionalidad}
                  nacionalidadReadonly={nacionalidadFromPadron}
                  readonly={mode === "edit"}
                />
              )}
  
              {currentStepId === "proveedor" && (
                <StepProveedor
                  data={{ razon_social: data.razon_social, nombre_fantasia: data.nombre_fantasia, tipo: data.tipo }}
                  setData={setData}
                  visited={visited.has("proveedor")}
                />
              )}
  
              {currentStepId === "actividad_iva" && (
                <StepActividadIva
                  data={{ condicion_iva_id: data.condicion_iva_id, actividades_ids: data.actividades_ids }}
                  setData={setData}
                  condicionesIva={condicionesIva}
                  actividades={actividades}
                  visited={visited.has("actividad_iva")}
                />
              )}
  
              {currentStepId === "bancarios" && (
                <StepBancarios
                  visited={visited.has("bancarios")}
                  bancarios={data.bancarios}
                  setBancarios={(next) => setData("bancarios", next)}
                  entidadesFinancieras={entidadesFinancieras}
                  tiposMoneda={tiposMoneda}
                />
              )}
  
              {currentStepId === "domicilios" && (
                <StepDomicilios
                  domicilios={data.domicilios}
                  setDomicilios={(next) => setData("domicilios", next)}
                />
              )}
  
              {currentStepId === "contactos" && (
                <StepContactos
                  visited={visited.has("contactos")}
                  contactos={data.contactos}
                  setContactos={(next) => setData("contactos", next)}
                  tipoContactos={tipoContactos}
                />
              )}
  
              {currentStepId === "documentacion" && (
                <StepDocumentacion
                  mode={mode}
                  documentacion={data.documentacion}
                  documentacionExistente={data.documentacion_existente}
                  previews={docPreviews}
                  totalBytes={totalBytes}
                  maxFileSize={MAX_FILE_SIZE}
                  maxTotalSize={MAX_TOTAL_SIZE}
                  allowedTypes={ALLOWED_TYPES}
                  setSingleDoc={setSingleDoc}
                  setConstanciaFechaAdjunto={setConstanciaFechaAdjunto}
                  clearSingleExistingDoc={clearSingleExistingDoc}
                  addMultiDocs={addMultiDocs}
                  removeMultiDoc={removeMultiDoc}
                  clearMultiDocs={clearMultiDocs}
                  removeExistingMultiDoc={removeExistingMultiDoc}
                  clearExistingMultiDocs={clearExistingMultiDocs}
                  openPreview={openPreview}
                  openExistingPreview={openExistingPreview}
                  visited={visited.has("documentacion")}
                  isValid={stepValidation.documentacion()}
                />
              )}
  
              {currentStepId === "confirmacion" && (
                <StepConfirmacion
                  mode={mode}
                  data={data}
                  nacionalidades={nacionalidades}
                  docsCount={docsCount}
                  condicionesIva={condicionesIva}
                  actividades={actividades}
                />
              )}
            </div>
          </div>
        </div>
  
        <WizardFooter
          mode={mode}
          footerShadow={footerShadow}
          isFirst={!!methods.state.isFirst}
          isLast={!!methods.state.isLast}
          processing={processing}
          canNext={canNext}
          canSave={canSave}
          onPrev={onPrev}
          onNext={onNext}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />        
      </>
    );
  }
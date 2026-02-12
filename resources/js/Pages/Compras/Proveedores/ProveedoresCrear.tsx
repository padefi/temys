import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogDescription, DialogHeader, DialogTitle
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import TextInput from "@/Components/TextInput";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { toast } from "sonner";
import { Check, X, Trash2, Eye, Pencil, Plus, Banknote, Landmark } from "lucide-react";
import { TipoDocumento } from "@/types/Proveedor";
import { Nacionalidad } from "@/types/Nacionalidad";
import { CondicionIva } from "@/types/CondicionIva";
import { ActividadEconomica } from "@/types/ActividadEconomica";
import { EntidadFinanciera } from "@/types/EntidadFinanciera";
import { TipoMoneda } from "@/types/TipoMoneda";
import { cuitValidator, validateCBU } from "@/utils/validateFunctions";
import { defineStepper } from "@/Components/stepper";
import SingleSearchableSelect from "@/Components/SingleSelectSearchable";
import MultiSelectSearchable from "@/Components/MultiSelectSearchable";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  nacionalidades: Nacionalidad[];
  condicionesIva: CondicionIva[];
  actividades: ActividadEconomica[];
  entidadesFinancieras: EntidadFinanciera[];
  tiposMoneda: TipoMoneda[];
};

type StepId =
  | "identificacion"
  | "proveedor"
  | "actividad_iva"
  | "bancarios"
  | "domicilios"
  | "contactos"
  | "documentacion"
  | "confirmacion";

type PadronStatus =
  | "idle"
  | "checking"
  | "not_found"
  | "padron_only"
  | "cliente"
  | "proveedor"
  | "error";

type TipoProveedor = 
    "Humana" 
  | "Jurídica";   

/* ------------------------------------------------------------------ */
/* Stepper definition */
/* ------------------------------------------------------------------ */

const stepper = defineStepper(
  { id: "identificacion", label: "Identificación" },
  { id: "proveedor", label: "Proveedor" },
  { id: "actividad_iva", label: "Actividad / Condición" },
  { id: "bancarios", label: "Datos Bancarios" },
  { id: "domicilios", label: "Domicilios" },
  { id: "contactos", label: "Contactos" },
  { id: "documentacion", label: "Documentación" },
  { id: "confirmacion", label: "Confirmación" }
);

/* ------------------------------------------------------------------ */
/* Const */
/* ------------------------------------------------------------------ */

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const ALLOWED_TYPES = ["application/pdf", ...ALLOWED_IMAGE_TYPES];

const tiposDocumento: { value: TipoDocumento; label: string }[] = [
  { value: "CUIT", label: "CUIT" },
];

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

const isImageFile = (file: File) => file.type.startsWith("image/");
const isPdfFile = (file: File) => file.type === "application/pdf";
const Required = () => (
  <span className="ml-1 text-red-600 font-medium">*</span>
);
const IncompleteBadge = () => (
  <span className="mt-0.5 inline-block rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
    Incompleto
  </span>
);
const normalizeNacionalidad = (value: any): number | null => {
  if (value === null || value === 0) return null;
  return Number(value);
};

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function ProveedoresCrear({ open, setOpen, nacionalidades, condicionesIva = [], actividades = [], entidadesFinancieras = [] }: Props) {
  const { data, setData, post, processing, reset } = useForm<{
    tipo_documento: TipoDocumento;
    documento: string;
    nacionalidad: number | null;
    razon_social: string;
    nombre_fantasia: string;
    tipo: TipoProveedor | "";
    padron_id: number | null;

    bancarios: any[];
    condicion_iva_id: number | null;
    actividades_ids: number[];
    domicilios: any[];
    contactos: any[];

    documentacion: File[];
    anotaciones: string;
  }>({
    tipo_documento: "CUIT" as TipoDocumento,
    documento: "",
    nacionalidad: null,
    razon_social: "",
    nombre_fantasia: "",
    tipo: "",
    padron_id: null,

    bancarios: [],
    condicion_iva_id: null,
    actividades_ids: [],
    domicilios: [],
    contactos: [],

    documentacion: [],
    anotaciones: "",
  });

  const methods = stepper.useStepper();
  const currentStep = methods.current;

  const [padronStatus, setPadronStatus] = useState<PadronStatus>("idle");
  const [padronMessage, setPadronMessage] = useState<string | null>(null);

  const [nacionalidadFromPadron, setNacionalidadFromPadron] = useState(false);

  const [visitedSteps, setVisitedSteps] = useState<Set<StepId>>(
    () => new Set(["identificacion"])
  );

  const [docPreviews, setDocPreviews] = useState<{ file: File; url: string }[]>(
    []
  );

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<{ file: File; url: string } | null>(null);

  const canContinueFromIdentificacion =
    padronStatus === "not_found" ||
    padronStatus === "padron_only" ||
    padronStatus === "cliente";

  const showNacionalidad =
    padronStatus === "not_found" ||
    padronStatus === "padron_only" ||
    padronStatus === "cliente";
  
  //const EMPTY_NACIONALIDAD = "__empty__";  

  const nacionalidadReadonly =
    nacionalidadFromPadron === true;

  const getNacionalidadLabel = (id?: number | null) => {
    if (!id) return "-";
    return nacionalidades.find(n => n.id === id)?.nacionalidad ?? "-";
  };  

  /* const tiposProveedor = [
    { value: "Humana", label: "Persona Humana" },
    { value: "Jurídica", label: "Persona Jurídica" },
  ] as const; */

  const nacionalidadOptions = useMemo(
    () =>
      nacionalidades.map((n) => ({
        id: n.id,
        label: n.nacionalidad,
        keywords: [n.nacionalidad],
      })),
    [nacionalidades]
  );

  const tipoProveedorOptions = useMemo(
    () => [
      {
        id: "Humana",
        label: "Persona Humana",
        keywords: ["humana", "persona humana"],
      },
      {
        id: "Jurídica",
        label: "Persona Jurídica",
        keywords: [
          "juridica",
          "jurídica",
          "persona juridica",
          "persona jurídica",
        ],
      },
    ],
    []
  );

  const currentIndex = useMemo(() => {
    return stepper.steps.findIndex((s) => s.id === currentStep.id);
  }, [currentStep.id]);

  /* const goNextStep = () => {
    const next = stepper.steps[currentIndex + 1];
    if (!next) return;
    methods.goTo(next.id);
  }; */
  
  const goPrevStep = () => {
    const prev = stepper.steps[currentIndex - 1];
    if (!prev) return;
    methods.goTo(prev.id);
  };

  /* ------------------------------------------------------------------ */
  /* Validaciones por step */
  /* ------------------------------------------------------------------ */

  const stepValidation: Record<StepId, () => boolean> = {
    identificacion: () =>
    canContinueFromIdentificacion,
    proveedor: () =>
      data.razon_social.trim() !== "" &&
      data.nombre_fantasia.trim() !== "" &&
      data.tipo !== "",
    actividad_iva: () =>
      data.condicion_iva_id !== null &&
      data.actividades_ids.length > 0,
    bancarios: () => false,
    domicilios: () => false,
    contactos: () => false,
    documentacion: () => Array.isArray(data.documentacion) && data.documentacion.length > 0,
    confirmacion: () => true,
  };

  /* ------------------------------------------------------------------ */
  /* Mensajes de error por step (UX) */
  /* ------------------------------------------------------------------ */

  const stepErrorMessage: Partial<Record<StepId, string>> = {
    identificacion:
      "Debés ingresar un CUIT válido.",
    proveedor:
      "Completá Razón Social, Nombre Fantasía y Tipo de Proveedor.",
    documentacion:
      "Debés adjuntar al menos un archivo obligatorio.",
    actividad_iva: 
      "Debés seleccionar una Condición IVA y al menos una Actividad Económica.",  
  };

  const stepStatus = useMemo<Record<StepId, "valid" | "pending">>(() => {
    const status = {} as Record<StepId, "valid" | "pending">;

    stepper.steps.forEach((s) => {
      const id = s.id as StepId;
      if (id === "confirmacion") return;

      if (!visitedSteps.has(id)) status[id] = "pending";
      else status[id] = stepValidation[id]() ? "valid" : "pending";
    });

    return status;
  }, [
    padronStatus,
    data.razon_social,
    data.nombre_fantasia,
    data.tipo,
    data.documentacion,
    visitedSteps,
  ]);

  const allPreviousStepsValid = stepper.steps
    .filter((s) => s.id !== "confirmacion")
    .every((s) => stepStatus[s.id as StepId] === "valid");

  /* ------------------------------------------------------------------ */
  /* Scroll real + shadow dinámico del sticky */
  /* ------------------------------------------------------------------ */

  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [footerShadow, setFooterShadow] = useState(false);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    const onScroll = () => setFooterShadow(el.scrollTop > 8);
    onScroll();

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // cuando cambia de step, reseteo scroll al inicio (mejora UX + evita “quedar abajo”)
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTop = 0;
    setFooterShadow(false);
  }, [currentStep.id]);

  /* ------------------------- effects ------------------------------ */

  useEffect(() => {
    if (!open) {
      reset();

      setPadronStatus("idle");
      setPadronMessage(null);

      setVisitedSteps(new Set(["identificacion"]));

      setDocPreviews((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p.url));
        return [];
      });

      setPreviewOpen(false);
      setPreviewItem(null);

      methods.goTo(stepper.steps[0].id);

      // por las dudas, reseteo scroll
      requestAnimationFrame(() => {
        if (bodyRef.current) bodyRef.current.scrollTop = 0;
        setFooterShadow(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    setVisitedSteps((prev) => {
      const next = new Set(prev);
      next.add(currentStep.id as StepId);
      return next;
    });
  }, [currentStep.id]);

  useEffect(() => {
    if (!data.documento || !data.tipo_documento) {
      setPadronStatus("idle");
      setPadronMessage(null);
      setData("padron_id", null);
      return;
    }

    const doc = data.documento.replace(/\D/g, "");

    if (data.documento !== doc) {
      setData("documento", doc);
    }

    if (data.tipo_documento === "CUIT") {
      if (!cuitValidator(doc)) {
        setPadronStatus("error");
        setPadronMessage("CUIT inválido.");
        setData("padron_id", null);
        return;
      }
    }

    setPadronStatus("checking");

    const timeout = setTimeout(() => {
      fetch(
        route("proveedores.verify-padron", {
          tipo_documento: data.tipo_documento,
          documento: doc,
        }),
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Accept: "application/json",
          },
        }
      )
        .then((r) => r.json())
        .then((json) => {
          setPadronStatus(json.status as PadronStatus);

          if (json.status === "not_found") {
            setPadronMessage(
              "No se encontraron registros existentes con el CUIT ingresado. Es válido para ser ingresado como Proveedor."
            );
            setData("padron_id", null);
            setData("nacionalidad", null);
            setNacionalidadFromPadron(false);
          }

          if (json.status === "padron_only") {
            setPadronMessage(
              "El CUIT se encuentra asociado pero no se encontró registro como Proveedor. Es válido para ingresarlo."
            );
            setData("padron_id", json.padron_id);
            const nac = normalizeNacionalidad(json.nacionalidad);
            setData("nacionalidad", nac);
            setNacionalidadFromPadron(nac !== null);    
          }

          if (json.status === "cliente") {
            setPadronMessage(
              "El CUIT ingresado ya existe como Cliente pero no como Proveedor, por lo que es válido para ingresarlo."
            );
            setData("padron_id", json.padron_id);
            const nac = normalizeNacionalidad(json.nacionalidad);
            setData("nacionalidad", nac);
            setNacionalidadFromPadron(nac !== null);
          }

          if (json.status === "proveedor") {
            setPadronMessage(
              "El CUIT ingresado ya existe como Proveedor, por lo que no es válido para ser ingresado como nuevo Proveedor. Por favor, verificar su existencia en la tabla de Proveedores."
            );
            setData("padron_id", json.padron_id);
          }
        })
        .catch(() => {
          setPadronStatus("error");
          setPadronMessage("Error al verificar registro existente.");
        });
    }, 400);

    return () => clearTimeout(timeout);
  }, [data.tipo_documento, data.documento, setData]);

  /* ------------------------- documentación ------------------------------- */

  const syncDocumentacion = (files: File[]) => {
    setData("documentacion", files);

    setDocPreviews((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    });
  };

  const handleAddFiles = (incoming: FileList | null) => {
    if (!incoming) return;

    const incomingFiles = Array.from(incoming);
    const currentFiles = data.documentacion ?? [];

    let totalSize = currentFiles.reduce((acc, f) => acc + f.size, 0);
    const validFiles: File[] = [];

    for (const file of incomingFiles) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`El archivo "${file.name}" no es un tipo permitido.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(`El archivo "${file.name}" supera los 2 MB.`);
        continue;
      }

      if (totalSize + file.size > MAX_TOTAL_SIZE) {
        toast.error("El total de archivos no puede superar los 10 MB.");
        break;
      }

      totalSize += file.size;
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    const merged = [...currentFiles, ...validFiles];

    const unique = merged.filter((f, idx, arr) => {
      const key = `${f.name}-${f.size}-${f.lastModified}`;
      return idx === arr.findIndex((x) => `${x.name}-${x.size}-${x.lastModified}` === key);
    });

    syncDocumentacion(unique);
  };

  const handleRemoveFile = (index: number) => {
    const current = data.documentacion ?? [];
    const next = current.filter((_, i) => i !== index);
    syncDocumentacion(next);
  };

  const openPreview = (item: { file: File; url: string }) => {
    setPreviewItem(item);
    setPreviewOpen(true);
  };

  /* ------------------------- submit ------------------------------- */

  const handleSubmit = () => {
    post(route("proveedores.store"), {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => {
        toast.success("Proveedor creado correctamente");
        setOpen(false);
      },
      onError: () => {
        toast.error("Error al crear proveedor");
      },
    });
  };

  /* ------------------------------------------------------------------ */
  /* Helpers UI Stepper */
  /* ------------------------------------------------------------------ */

  const stepState = (index: number, stepId: StepId) => {
    const isCompleted = visitedSteps.has(stepId) && stepStatus[stepId] === "valid";
    const isActive = index === currentIndex;

    const isError =
      visitedSteps.has(stepId) &&
      stepStatus[stepId] === "pending" &&
      !!stepValidation[stepId] &&
      !stepValidation[stepId]();

    return { isCompleted, isActive, isError };
  };

  const canGoToStep = (stepId: StepId) => {
    // Siempre puede volver a Identificación
    if (stepId === "identificacion") return true;
  
    // Gate: si Identificación no es válida, no puede ir a ningún otro step
    if (!stepValidation.identificacion()) return false;
  
    // Confirmación solo si todos los anteriores están validados
    if (stepId === "confirmacion") return allPreviousStepsValid;
  
    // ✅ Libre navegación a cualquier step (2..8), aunque esté incompleto
    return true;
  };

  const notifyInvalidStep = (stepId: StepId) => {
    const message = stepErrorMessage[stepId];
    if (message) {
      toast.warning(message, {
        duration: 4000,
      });
    }
  };

  /* const getFirstInvalidStep = (): StepId | null => {
    for (const step of stepper.steps) {
      const id = step.id as StepId;
      if (id === "confirmacion") continue;
  
      if (!stepValidation[id]()) {
        return id;
      }
    }
    return null;
  }; */

  /* ------------------------------------------------------------------ */
  /* Render */
  /* ------------------------------------------------------------------ */

  const canNext = !methods.isLast && stepValidation[currentStep.id as StepId]?.();
  const canSave = methods.isLast && !processing && allPreviousStepsValid;

  const BORDER_FOCUS_TEXTINPUT = "focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:border-gray-200";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 z-40" />

        {/* IMPORTANTE: NO overflow-y acá, para no competir con el scroll interno */}
        <DialogPrimitive.Content className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6">
          <div className="w-[95vw] max-w-[1200px] h-[95vh] bg-background border rounded-2xl shadow-lg overflow-hidden flex flex-col">
            {/* HEADER (más compacto) */}
            <DialogHeader className="px-6 sm:px-8 py-4 sm:py-5 border-b shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <DialogTitle className="text-xl sm:text-2xl font-semibold">
                    Nuevo Proveedor
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base">
                    Cargá la información paso a paso.
                  </DialogDescription>
                </div>

                <DialogPrimitive.Close asChild>
                  <button
                    type="button"
                    className="rounded-md p-2 text-muted-foreground hover:bg-muted transition-colors"
                    aria-label="Cerrar"
                  >
                    ✕
                  </button>
                </DialogPrimitive.Close>
              </div>
            </DialogHeader>

            <stepper.Stepper.Provider
              variant="horizontal"
              labelOrientation="vertical"
              className="flex flex-col min-h-0 flex-1"
            >
              {/* NAV (más prolija + transiciones) */}
              <div className="border-b bg-muted/20 shrink-0">
                <div className="px-4 sm:px-6 py-3 sm:py-4 overflow-x-auto">
                  <div className="min-w-[900px] max-w-[1100px] mx-auto">
                    <div className="flex items-center">
                      {stepper.steps.map((s, index) => {
                        const stepId = s.id as StepId;
                        const { isCompleted, isActive, isError } = stepState(index, stepId);

                        const circleClass = isError
                          ? "bg-red-600 text-white ring-2 ring-red-200"
                          : isCompleted
                          ? "bg-green-600 text-white ring-2 ring-green-200"
                          : isActive
                          ? "bg-foreground text-background ring-2 ring-foreground/20"
                          : "bg-gray-200 text-gray-700";

                        const labelClass = isActive
                          ? "text-foreground font-semibold"
                          : isCompleted
                          ? "text-foreground/80"
                          : "text-muted-foreground";

                        const lineClass =
                          index < currentIndex
                            ? "bg-green-600"
                            : "bg-gray-300";

                        return (
                          <div key={s.id} className="flex-1 flex items-center">
                            <button
                              type="button"
                              onClick={() => {
                                if (!canGoToStep(stepId)) {
                                  notifyInvalidStep(stepId);
                                  return;
                                }
                                methods.goTo(s.id);
                              }}
                              disabled={!canGoToStep(stepId)}
                              className="
                                flex flex-col items-center gap-1.5 min-w-[92px]
                                disabled:cursor-not-allowed
                                transition-opacity
                                disabled:opacity-50
                              "
                            >
                              <div
                                className={`
                                  h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold
                                  transition-all duration-300
                                  ${circleClass}
                                  ${isActive ? "scale-[1.03]" : "scale-100"}
                                `}
                              >
                                {isError ? (
                                  <X className="h-4 w-4" />
                                ) : isCompleted ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  index + 1
                                )}
                              </div>

                              <div className="flex flex-col items-center">
                                <div className={`text-[11px] leading-tight text-center transition-colors ${labelClass}`}>
                                  {s.label}
                                </div>

                                {isError && !isActive && (
                                  <IncompleteBadge />
                                )}
                              </div>
                            </button>

                            {index < stepper.steps.length - 1 && (
                              <div className="flex-1 px-3">
                                <div
                                  className={`
                                    h-[2px] w-full rounded
                                    transition-colors duration-300
                                    ${lineClass}
                                  `}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* BODY: ESTE ES EL ÚNICO SCROLL */}
              <div
                ref={bodyRef}
                className="
                  flex-1 min-h-0 overflow-y-auto overflow-x-hidden
                  overscroll-contain
                  px-4 sm:px-6 py-5 sm:py-6
                "
              >
                <div className="max-w-[1100px] mx-auto w-full min-h-0">
                  {/* animación al cambiar de step */}
                  <div
                    key={currentStep.id}
                    className="transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-2"
                  >
                    <p className="text-md text-muted-foreground mb-2">
                        Los campos marcados con <span className="text-red-600">*</span> son obligatorios.
                    </p>
                    <stepper.Stepper.Panel>
                      {/* ================= PASO 1 ================= */}
                      {currentStep.id === "identificacion" && (
                        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-4 w-full">
                          <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
                            Paso 1 · Identificación del proveedor
                          </h2>

                          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5"> */}
                          {/* <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-3 sm:gap-4"> */}
                          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-3 sm:gap-4">
                            <div>
                              <Label>Tipo Documento</Label>
                              <Select
                                value={data.tipo_documento}
                                onValueChange={(v: TipoDocumento) => setData("tipo_documento", v)}
                              >
                                <SelectTrigger className="min-h-[42px] mt-1 w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Tipo</SelectLabel>
                                    {tiposDocumento.map((t) => (
                                      <SelectItem key={t.value} value={t.value}>
                                        {t.label}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* <div className="md:col-span-2"> */}
                            <div>
                              <Label>Documento <Required /></Label>
                              <div className="mt-1">
                              <TextInput
                                value={data.documento}
                                onChange={(e) => {
                                    const onlyNumbers = e.target.value.replace(/\D/g, "");
                                    setData("documento", onlyNumbers);
                                }}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className={`w-full ${BORDER_FOCUS_TEXTINPUT}`}
                              />
                              </div>

                              <div className="mt-2">
                                {padronStatus === "checking" && (
                                  <p className="text-xs text-muted-foreground">
                                    Verificando CUIT…
                                  </p>
                                )}
                              </div>
                            </div>

                            {showNacionalidad && (
                            <div>
                              <Label>Nacionalidad</Label>

                              <div className="mt-1">
                                <SingleSearchableSelect
                                  value={data.nacionalidad ?? ""}
                                  placeholder="Seleccionar nacionalidad"
                                  options={nacionalidadOptions}
                                  disabled={nacionalidadReadonly}
                                  clearable={!nacionalidadReadonly}
                                  onChange={(v) => {
                                    // v viene string: "" significa "sin selección"
                                    setData("nacionalidad", v ? Number(v) : null);
                                  }}
                                />
                              </div>

                              {nacionalidadReadonly && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  Este dato proviene del padrón y no puede modificarse.
                                </p>
                              )}

                              {!data.nacionalidad && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  Este campo no es obligatorio.
                                </p>
                              )}
                            </div>
                            )}

                            {/* {showNacionalidad && (
                            <div>
                                <Label>Nacionalidad</Label>

                                <Select
                                value={ data.nacionalidad === null ? EMPTY_NACIONALIDAD : data.nacionalidad.toString()}
                                onValueChange={(v) => {
                                    if (v === EMPTY_NACIONALIDAD) {
                                      setData("nacionalidad", null);
                                      return;
                                    }
                                  
                                    setData("nacionalidad", Number(v));
                                  }}
                                disabled={nacionalidadReadonly}
                                >
                                <SelectTrigger className="mt-2 w-full">
                                    <SelectValue placeholder="Seleccionar nacionalidad" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Nacionalidades</SelectLabel>

                                    <SelectItem value={EMPTY_NACIONALIDAD}>
                                      Seleccionar nacionalidad
                                    </SelectItem>

                                    {nacionalidades.map((n: Nacionalidad) => (
                                      <SelectItem key={n.id} value={String(n.id)}>
                                        {n.nacionalidad}
                                      </SelectItem>
                                    ))}
                                    </SelectGroup>
                                </SelectContent>
                                </Select>

                                {nacionalidadReadonly && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Este dato proviene del padrón y no puede modificarse.
                                </p>
                                )}
                                {showNacionalidad && !data.nacionalidad && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Este campo no es obligatorio.
                                </p>
                                )}
                            </div>
                            )} */}
       
                          </div>

                          {padronMessage && (
                            <div
                              className={`
                                rounded-lg border px-4 py-3 text-sm
                                ${
                                  padronStatus === "proveedor" || padronStatus === "error"
                                    ? "bg-red-50 border-red-200 text-red-900"
                                    : "bg-green-50 border-green-200 text-green-900"
                                }
                              `}
                            >
                              {padronMessage}
                            </div>
                          )}
                        </div>
                      )}

                      {/* ================= PASO 2 ================= */}
                      {currentStep.id === "proveedor" && (
                        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-4 w-full">
                          <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
                            Paso 2 · Datos del proveedor
                          </h2>

                          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5"> */}
                          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-3 sm:gap-4">
                            <div>
                              <Label>Razón Social <Required /></Label>
                              <div className="mt-1">
                                <TextInput
                                  value={data.razon_social}
                                  onChange={(e) => setData("razon_social", e.target.value)}
                                  className={`w-full ${BORDER_FOCUS_TEXTINPUT}`}
                                />
                              </div>
                            </div>

                            <div>
                              <Label>Nombre Fantasía <Required /></Label>
                              <div className="mt-1">
                                <TextInput
                                  value={data.nombre_fantasia}
                                  onChange={(e) => setData("nombre_fantasia", e.target.value)}
                                  className={`w-full ${BORDER_FOCUS_TEXTINPUT}`}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>
                                Tipo de Proveedor <Required />
                              </Label>

                             
                                <SingleSearchableSelect
                                  value={data.tipo ?? ""}
                                  placeholder="Seleccionar tipo"
                                  options={tipoProveedorOptions}
                                  onChange={(v) => setData("tipo", v as TipoProveedor)}
                                />
                              
                              {visitedSteps.has("proveedor") && !data.tipo && (
                                <p className="text-xs text-red-600">
                                  Debés seleccionar un tipo de Proveedor.
                                </p>
                              )}
                            </div>

                            {/* <div>
                              <Label>
                                Tipo de Proveedor <Required />
                              </Label>

                              <Select
                                value={data.tipo}
                                onValueChange={(v: TipoProveedor) => setData("tipo", v)}
                              >
                                <SelectTrigger className="mt-2 w-full">
                                <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>

                                <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Tipo</SelectLabel>
                                    {tiposProveedor.map((t) => (
                                    <SelectItem key={t.value} value={t.value}>
                                        {t.label}
                                    </SelectItem>
                                    ))}
                                </SelectGroup>
                                </SelectContent>
                              </Select>

                              {!data.tipo && visitedSteps.has("proveedor") && (
                                <p className="mt-1 text-xs text-red-600">
                                El tipo de proveedor es obligatorio.
                                </p>
                              )}
                            </div> */}
                          </div>
                        </div>
                      )}

                      {/* ================= PASO 3 ================= */}
                      {currentStep.id === "actividad_iva" && (
                        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-4 w-full">
                          <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
                            Paso 3 · Actividad(es) / Condición IVA
                          </h2>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            
                            {/* Condición IVA */}
                            <div className="space-y-2">
                              <Label>
                                Condición frente al IVA <Required />
                              </Label>
                              <SingleSearchableSelect
                                value={data.condicion_iva_id ?? undefined}
                                placeholder="Seleccionar condición IVA"
                                options={condicionesIva.map((c) => ({
                                  id: c.id,
                                  label: c.descripcion,
                                  keywords: [c.descripcion],
                                }))}
                                onChange={(value) =>
                                  setData("condicion_iva_id", Number(value))
                                }
                              />

                              {/* <Select
                                value={data.condicion_iva_id?.toString() ?? ""}
                                onValueChange={(v) => setData("condicion_iva_id", Number(v))}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Seleccionar condición IVA" />
                                </SelectTrigger>

                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Condiciones IVA</SelectLabel>
                                    {condicionesIva.map((c) => (
                                      <SelectItem key={c.id} value={String(c.id)}>
                                        {c.descripcion}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select> */}

                              {visitedSteps.has("actividad_iva") && data.condicion_iva_id === null && (
                                <p className="text-xs text-red-600">
                                  Debés seleccionar una condición IVA.
                                </p>
                              )}
                            </div>

                            {/* Actividades económicas */}
                            <div className="space-y-2">
                              <Label>
                                Actividades económicas <Required />
                              </Label>

                              <MultiSelectSearchable
                                values={data.actividades_ids}
                                placeholder="Seleccionar actividades económicas"
                                options={actividades.map((a) => ({
                                  id: a.id,
                                  label: a.descripcion,
                                  keywords: [a.descripcion],
                                }))}
                                onChange={(values) =>
                                  setData("actividades_ids", values)
                                }
                              />

                              {/* <div
                                className="
                                  rounded-lg border bg-background
                                  max-h-[260px] overflow-y-auto
                                  p-3 space-y-2
                                "
                              >
                                {actividades.length === 0 && (
                                  <p className="text-sm text-muted-foreground">
                                    No hay actividades disponibles.
                                  </p>
                                )}

                                {actividades.map((a) => {
                                  const checked = data.actividades_ids.includes(a.id);

                                  return (
                                    <label
                                      key={a.id}
                                      className={`
                                        flex items-start gap-3 rounded-md px-3 py-2
                                        cursor-pointer transition-colors
                                        ${checked ? "bg-green-50 border border-green-200" : "hover:bg-muted"}
                                      `}
                                    >
                                      <input
                                        type="checkbox"
                                        className="mt-1 accent-green-600"
                                        checked={checked}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setData("actividades_ids", [...data.actividades_ids, a.id]);
                                          } else {
                                            setData(
                                              "actividades_ids",
                                              data.actividades_ids.filter((id) => id !== a.id)
                                            );
                                          }
                                        }}
                                      />

                                      <span className="text-sm leading-tight">
                                        {a.descripcion}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div> */}

                              {visitedSteps.has("actividad_iva") && data.actividades_ids.length === 0 && (
                                <p className="text-xs text-red-600">
                                  Debés seleccionar al menos una actividad económica.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ================= PASO 8 ================= */}
                      {currentStep.id === "documentacion" && (
                        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-4 w-full">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
                                Paso 8 · Documentación obligatoria
                              </h2>
                              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                Adjuntá al menos un archivo. Podés subir imágenes o PDFs y administrarlos desde acá.
                              </p>
                            </div>

                            <div className="shrink-0">
                              <input
                                type="file"
                                multiple
                                accept="image/*,application/pdf"
                                className="hidden"
                                id="documentacion-input"
                                onChange={(e) => {
                                  handleAddFiles(e.target.files);
                                  e.currentTarget.value = "";
                                }}
                              />
                              <Button
                                type="button"
                                onClick={() => document.getElementById("documentacion-input")?.click()}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                Agregar archivos
                              </Button>
                            </div>
                          </div>

                          {data.documentacion.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
                              No hay archivos cargados todavía.
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                              {docPreviews.map((p, idx) => (
                                <div
                                  key={`${p.file.name}-${p.file.size}-${p.file.lastModified}`}
                                  className="rounded-xl border bg-background p-4 flex gap-4 items-start transition-shadow hover:shadow-md"
                                >
                                  <div className="w-20 h-20 rounded-md border bg-muted/30 flex items-center justify-center overflow-hidden">
                                    {isImageFile(p.file) ? (
                                      <img
                                        src={p.url}
                                        alt={p.file.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="text-xs text-muted-foreground px-2 text-center">
                                        {isPdfFile(p.file) ? "PDF" : "ARCHIVO"}
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">
                                      {p.file.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {(p.file.size / 1024 / 1024).toFixed(2)} MB
                                    </div>

                                    <div className="flex items-center gap-2 mt-3">
                                      <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => openPreview(p)}
                                        className="bg-sky-300 hover:bg-sky-600 text-white"
                                      >
                                        <Eye className="h-4 w-4 mr-2" />
                                        Ver
                                      </Button>

                                      <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => handleRemoveFile(idx)}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Eliminar
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {!stepValidation.documentacion() && visitedSteps.has("documentacion") && (
                            <div className="rounded-lg border bg-red-50 border-red-200 px-4 py-3 text-sm text-red-900">
                              Debés adjuntar al menos un archivo para continuar.
                            </div>
                          )}
                        </div>
                      )}

                      {/* ================= PASO 9 ================= */}
                      {currentStep.id === "confirmacion" && (
                        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-4 w-full">
                          <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
                            Paso 9 · Confirmación
                          </h2>

                          <div className="rounded-lg border bg-muted/30 p-4 text-sm">
                            <div className="font-medium mb-2">Resumen rápido</div>
                            <ul className="space-y-1 text-muted-foreground">
                              <li>
                                <strong>CUIT:</strong> {data.documento || "-"}
                              </li>
                              <li>
                                <strong>Razón Social:</strong> {data.razon_social || "-"}
                              </li>
                              <li>
                                <strong>Nombre Fantasía:</strong> {data.nombre_fantasia || "-"}
                              </li>
                              <li>
                                <strong>Nacionalidad:</strong>{" "}
                                {getNacionalidadLabel(data.nacionalidad)}
                              </li>
                              <li>
                                <strong>Documentos:</strong> {data.documentacion.length}
                              </li>
                            </ul>
                          </div>

                          <div>
                            <Label>Anotaciones (opcional)</Label>
                            <textarea
                              value={data.anotaciones}
                              onChange={(e) => setData("anotaciones", e.target.value)}
                              rows={6}
                              className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                              placeholder="Observaciones internas, aclaraciones, etc."
                            />
                          </div>
                        </div>
                      )}

                      {/* ================= OTROS PASOS ================= */}
                        {currentStep.id !== "identificacion" &&
                        currentStep.id !== "proveedor" &&
                        currentStep.id !== "actividad_iva" &&
                        currentStep.id !== "documentacion" &&
                        currentStep.id !== "confirmacion" && (
                          <div className="rounded-2xl border bg-muted/30 p-6 text-muted-foreground w-full">
                            Paso <strong>{currentStep.label}</strong> (a implementar)
                          </div>
                        )}
                    </stepper.Stepper.Panel>
                  </div>
                </div>
              </div>

              {/* CONTROLS sticky + shadow dinámico */}
              <div
                className={`
                  border-t bg-background px-6 sm:px-8 py-4 shrink-0 sticky bottom-0 z-10
                  transition-shadow duration-300
                  ${footerShadow ? "shadow-[0_-10px_25px_rgba(0,0,0,0.18)]" : ""}
                `}
              >
                <stepper.Stepper.Controls className="w-full justify-end gap-3 sm:gap-4">
                  <Button
                    variant="outline"
                    disabled={methods.isFirst}
                    onClick={goPrevStep}
                  >
                    Anterior
                  </Button>

                  {methods.isLast ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={processing || !allPreviousStepsValid}
                      className={
                        canSave
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : ""
                      }
                    >
                      Guardar Proveedor
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        methods.next(); // siempre avanza 1 step
                      }}
                      disabled={
                        processing ||
                        (
                        currentStep.id === "identificacion" &&
                        !stepValidation.identificacion()
                        )
                      }
                      className={
                        currentStep.id !== "identificacion" || stepValidation.identificacion()
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : ""
                      }
                    >
                      Siguiente
                    </Button>
                    /* <Button
                      onClick={methods.next}
                      disabled={!stepValidation[currentStep.id as StepId]?.()}
                      className={
                        canNext
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : ""
                      }
                    >
                      Siguiente
                    </Button> */
                    
                  )}
                </stepper.Stepper.Controls>
              </div>
            </stepper.Stepper.Provider>
          </div>

          {/* ✅ Modal de vista previa (zoom) */}
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogPrimitive.Portal>
              <DialogPrimitive.Overlay className="fixed inset-0 bg-black/60 z-[60]" />
              <DialogPrimitive.Content className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <DialogTitle className="sr-only">
                    Vista previa de archivo
                </DialogTitle>
                <div className="w-[95vw] max-w-[1000px] h-[85vh] bg-background border rounded-xl shadow-lg overflow-hidden flex flex-col">
                  <div className="px-4 py-3 border-b flex items-center justify-between">
                    <div className="text-sm font-medium truncate">
                      {previewItem?.file.name ?? "Vista previa"}
                    </div>
                    <button
                      type="button"
                      className="rounded-md p-2 text-muted-foreground hover:bg-muted"
                      onClick={() => setPreviewOpen(false)}
                      aria-label="Cerrar vista previa"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex-1 min-h-0 overflow-auto bg-muted/20 p-4">
                    {!previewItem ? (
                      <div className="text-sm text-muted-foreground">
                        Sin archivo para previsualizar.
                      </div>
                    ) : isImageFile(previewItem.file) ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={previewItem.url}
                          alt={previewItem.file.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : isPdfFile(previewItem.file) ? (
                      <iframe
                        title={previewItem.file.name}
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
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}







/* import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import TextInput from "@/Components/TextInput";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { toast } from "sonner";
import { TipoDocumento } from "@/types/Proveedor";
import { cuitValidator } from "@/utils/validateFunctions";
import { defineStepper } from "@/Components/stepper";

type Props = {
    open: boolean;
    setOpen: (v: boolean) => void;
};

type PadronStatus = "idle" | "checking" | "not_found" | "padron_only" | "cliente" | "proveedor" | "error";

const tiposDocumento: { value: TipoDocumento; label: string }[] = [
    //{ value: "DNI", label: "DNI" },
    //{ value: "Pasaporte", label: "Pasaporte" },
    //{ value: "Cédula", label: "Cédula" },
    //{ value: "LC", label: "Libreta Cívica" },
    //{ value: "LE", label: "Libreta de Enrolamiento" },
    { value: "CUIT", label: "CUIT" },
    //{ value: "CUIL", label: "CUIL" },
];

export default function ProveedoresCrear({ open, setOpen }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        tipo_documento: TipoDocumento;
        documento: string;
        nacionalidad: string;
        razon_social: string;
        nombre_fantasia: string;
        padron_id: number | null;
    }>({
        tipo_documento: "CUIT",
        documento: "",
        nacionalidad: "",
        razon_social: "",
        nombre_fantasia: "",
        padron_id: null,
    });

    const [padronStatus, setPadronStatus] = useState<PadronStatus>("idle");
    const [padronMessage, setPadronMessage] = useState<string | null>(null);

    // 🔁 Reset cuando se abre/cierra
    useEffect(() => {
        if (!open) {
            reset();
            setPadronStatus("idle");
            setPadronMessage(null);
        }
    }, [open]);

    // 🔍 Verificación en padrón "en tiempo real" con debounce
    useEffect(() => {
        if (!data.tipo_documento || !data.documento) {
            setPadronStatus("idle");
            setPadronMessage(null);
            setData("padron_id", null);
            return;
        }

        // 1. Normalizar
        const doc = data.documento.replace(/[-_]/g, "");

        // 2. Validar CUIT si corresponde
        if (data.tipo_documento === "CUIT") {
            if (!cuitValidator(doc)) {
                setPadronStatus("error");
                setPadronMessage("CUIT inválido.");
                setData("padron_id", null);
                return; // IMPORTANTE: no hace fetch si es inválido
            }
        }

        setPadronStatus("checking");
        setPadronMessage(null);

        const timeout = setTimeout(() => {
            const url = route("proveedores.verify-padron", {
                tipo_documento: data.tipo_documento,
                documento: data.documento,
            });

            
            fetch(url, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Accept": "application/json",
                },
            })
                .then(async (res) => {
                    if (!res.ok) throw new Error("Error de red");
                    return res.json();
                })
                .then((json) => {
                    const status = json.status as PadronStatus;
                    setPadronStatus(status);

                    if (status === "not_found") {
                        setPadronMessage(
                            "No se encontraron registros existentes con el CUIT ingresado. Es válido para ser ingresado como Proveedor."
                        );
                        setData("padron_id", null);
                        // nacionalidad queda editable y vacía para cargar
                    } else if (status === "padron_only") {
                        setPadronMessage(
                            "El CUIT se encuentra asociado pero no se encontró registro como Proveedor. Es válido para ingresarlo."
                        );
                        setData("padron_id", json.padron_id ?? null);
                        if (json.nacionalidad) {
                            setData("nacionalidad", json.nacionalidad);
                        }
                    } else if (status === "cliente") {
                        setPadronMessage(
                            "El CUIT ingresado ya existe como Cliente pero no como Proveedor, por lo que es válido para ingresarlo."
                        );
                        setData("padron_id", json.padron_id ?? null);
                        if (json.nacionalidad) {
                            setData("nacionalidad", json.nacionalidad);
                        }
                    } else if (status === "proveedor") {
                        setPadronMessage(
                            "El CUIT ingresado ya existe como Proveedor, por lo que no es válido para ser ingresado como nuevo Proveedor. Por favor, verificar su existencia en la tabla de Proveedores."
                        );
                        setData("padron_id", json.padron_id ?? null);
                        if (json.nacionalidad) {
                            setData("nacionalidad", json.nacionalidad);
                        }
                    }
                })
                .catch(() => {
                    setPadronStatus("error");
                    setPadronMessage("Error al verificar registro existente.");
                });
        }, 400); // debounce 400ms

        return () => clearTimeout(timeout);
    }, [data.tipo_documento, data.documento]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (padronStatus === "proveedor") {
            toast.error(
                "El CUIT ingresado ya existe como Proveedor, por lo que no es válido para ser ingresado como nuevo Proveedor. Por favor, verificar su existencia en la tabla de Proveedores."
            );
            return;
        }

        post(route("proveedores.store"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Proveedor creado correctamente");
                reset();
                setPadronStatus("idle");
                setPadronMessage(null);
                setOpen(false);
            },
            onError: () => {
                toast.error("Error al crear proveedor");
            },
        });
    };

    const showFormulario =
        padronStatus === "not_found" ||
        padronStatus === "padron_only" ||
        padronStatus === "cliente";

    const nacionalidadReadOnly = padronStatus === "padron_only"; // según lo que pediste

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Nuevo Proveedor</DialogTitle>
                    <DialogDescription>
                        Ingresá el CUIT para validar.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    //Paso 1: Tipo doc + Documento
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Tipo de Documento</Label>
                            <Select
                                value={data.tipo_documento}
                                onValueChange={(v: TipoDocumento) =>
                                    setData("tipo_documento", v)
                                }
                            >
                                <SelectTrigger className="mt-1 w-full">
                                    <SelectValue placeholder="Tipo de documento" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Tipos de Documento</SelectLabel>
                                        {tiposDocumento.map((t) => (
                                            <SelectItem key={t.value} value={t.value}>
                                                {t.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.tipo_documento && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.tipo_documento}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Documento</Label>
                            <TextInput
                                value={data.documento}
                                onChange={(e) => setData("documento", e.target.value)}
                                className="w-full mt-1"
                                onBlur={() => {
                                    const d = data.documento.replace(/\D/g, "");
                                    setData("documento", d);
                                }}
                            />
                            {errors.documento && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.documento}
                                </p>
                            )}
                        </div>
                    </div>

                    //Mensaje de estado del padrón
                    {padronMessage && (
                        <p className="text-sm mt-1">
                            {padronMessage}
                        </p>
                    )}

                    //Si ya existe como proveedor → solo mensaje y botón Cerrar
                    {padronStatus === "proveedor" && (
                        <DialogFooter className="mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cerrar
                            </Button>
                        </DialogFooter>
                    )}

                    //Formulario completo solo cuando es válido para alta
                    {showFormulario && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <Label>Nacionalidad</Label>
                                    <TextInput
                                        value={data.nacionalidad}
                                        onChange={(e) =>
                                            setData("nacionalidad", e.target.value)
                                        }
                                        className="w-full mt-1"
                                        disabled={nacionalidadReadOnly}
                                    />
                                    {errors.nacionalidad && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.nacionalidad}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>Razón Social</Label>
                                    <TextInput
                                        value={data.razon_social}
                                        onChange={(e) =>
                                            setData("razon_social", e.target.value)
                                        }
                                        className="w-full mt-1"
                                    />
                                    {errors.razon_social && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.razon_social}
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <Label>Nombre Fantasía</Label>
                                    <TextInput
                                        value={data.nombre_fantasia}
                                        onChange={(e) =>
                                            setData("nombre_fantasia", e.target.value)
                                        }
                                        className="w-full mt-1"
                                    />
                                    {errors.nombre_fantasia && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.nombre_fantasia}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <DialogFooter className="mt-4 gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? "Guardando..." : "Guardar"}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
} */

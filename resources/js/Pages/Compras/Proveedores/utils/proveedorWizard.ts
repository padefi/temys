import { defineStepper } from "@/Components/stepper";

export type StepId =
  | "identificacion"
  | "proveedor"
  | "actividad_iva"
  | "bancarios"
  | "domicilios"
  | "contactos"
  | "documentacion"
  | "confirmacion";

export const WIZARD_STEPS: { id: StepId; label: string }[] = [
  { id: "identificacion", label: "Identificación" },
  { id: "proveedor", label: "Proveedor" },
  { id: "actividad_iva", label: "Actividad / Condición" },
  { id: "bancarios", label: "Datos Bancarios" },
  { id: "domicilios", label: "Domicilios" },
  { id: "contactos", label: "Contactos" },
  { id: "documentacion", label: "Documentación" },
  { id: "confirmacion", label: "Confirmación" },
];

//Define Stepper solo con ids (sin label)
export const stepper = defineStepper(
  { id: "identificacion" },
  { id: "proveedor" },
  { id: "actividad_iva" },
  { id: "bancarios" },
  { id: "domicilios" },
  { id: "contactos" },
  { id: "documentacion" },
  { id: "confirmacion" }
);
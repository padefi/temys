import type { TipoDocumento } from "@/types/Padron";

export type TipoProveedor = "Humana" | "Jurídica";
export type TipoClave = "Cbu" | "Cvu";
export type TipoCuenta = "Caja de Ahorro" | "Cuenta Corriente";
export type TipoDomicilio = "Real" | "Fiscal";

export type DocBucket = "constancia_inscripcion" | "constancias_cbu" | "exenciones";
export type DocPreview = { file: File; url: string };

export type DocumentacionState = {
  constancia_inscripcion: File | null;
  constancia_inscripcion_fecha_adjunto: string | null;
  constancias_cbu: File[];
  exenciones: File[];
};

export type AdjuntoExistente = {
  id: number;
  tipo_adjunto: number;
  descripcion: string;
  nombre_archivo: string;
  ruta_archivo: string;
  fecha_adjunto?: string | null;
  url?: string | null;
  size?: number | null;
};

export type DocumentacionExistenteState = {
  constancia_inscripcion: AdjuntoExistente | null;
  constancias_cbu: AdjuntoExistente[];
  exenciones: AdjuntoExistente[];
};

export type DocumentacionPreviews = {
  constancia_inscripcion: DocPreview | null;
  constancias_cbu: DocPreview[];
  exenciones: DocPreview[];
};

export interface Padron {
  id: number;
  tipo_documento: TipoDocumento;
  documento: string;
  nacionalidad: number | null;
}

/* =========================
 * Drafts del wizard
* ========================= */
export type BancarioDraft = {
  _tmpId: string;
  entidad_financiera_id: number | null;
  tipo_clave: TipoClave | "";
  clave: string;
  alias: string;
  moneda_id: number | null;
  tipo_cuenta: TipoCuenta | "";
  predeterminado: boolean;
};

export type DomicilioDraft = {
  _tmpId: string;
  tipo_domicilio: TipoDomicilio | "";
  calle_id: string;
  altura: number;
  predeterminado: boolean;
  codigo_postal?: string | null;
  piso?: string | null;
  departamento?: string | null;
  observaciones?: string | null;
  calle_nombre?: string | null;
  provincia?: string | null;
  localidad?: string | null;
  lat?: number | null;
  lon?: number | null;
};

export type ContactoDraft = {
  _tmpId: string;
  tipo_contacto: number | null;
  contacto: string;
  predeterminado: boolean;
};

/* =========================
 * Tipos persistibles
* ========================= */
export type ProveedorBancarioPayload = {
  entidad_financiera_id: number | null;
  tipo_clave: TipoClave;
  clave: string;
  alias: string;
  moneda_id: number | null;
  tipo_cuenta: TipoCuenta;
  predeterminado: boolean;
};

export type ProveedorDomicilioPayload = {
  tipo_domicilio: TipoDomicilio;
  calle_id: string;
  altura: number;
  predeterminado: boolean;
  codigo_postal?: string | null;
  piso?: string | null;
  departamento?: string | null;
  observaciones?: string | null;
};

export type ProveedorContactoPayload = {
  tipo_contacto: number | null;
  contacto: string;
  predeterminado: boolean;
};

/* =========================
 * Backend entity
* ========================= */
export interface Proveedor {
  id: number;
  id_padron: number;
  padron: Padron;

  tipo: TipoProveedor;
  nombre_fantasia: string;
  razon_social: string;

  condicion_iva_id: number | null;
  actividades?: {
    id: number;
    descripcion: string;
  }[];

  bancarios?: (ProveedorBancarioPayload & { id: number })[];
  domicilios?: (ProveedorDomicilioPayload & {
    id: number;
    calle_nombre?: string | null;
    provincia?: string | null;
    localidad?: string | null;
    lat?: number | null;
    lon?: number | null;
  })[];
  contactos?: (ProveedorContactoPayload & { id: number })[];

  adjuntos_requeridos?: AdjuntoExistente[];
  adjuntos_opcionales?: AdjuntoExistente[];

  anotaciones?: string;
}

/* =========================
 * Form state
* ========================= */
export type ProveedorForm = {
  tipo_documento: TipoDocumento;
  documento: string;
  nacionalidad: number | null;
  padron_id: number | null;

  razon_social: string;
  nombre_fantasia: string;
  tipo: TipoProveedor | "";

  condicion_iva_id: number | null;
  actividades_ids: number[];

  bancarios: BancarioDraft[];
  domicilios: DomicilioDraft[];
  contactos: ContactoDraft[];

  documentacion: DocumentacionState;
  documentacion_existente: DocumentacionExistenteState;

  anotaciones: string;
};

/* =========================
 * Payloads
* ========================= */
export type ProveedorCreatePayload = {
  tipo_documento: TipoDocumento;
  documento: string;
  nacionalidad: number | null;
  padron_id: number | null;

  razon_social: string;
  nombre_fantasia: string;
  tipo: TipoProveedor;

  condicion_iva_id: number | null;
  actividades_ids: number[];

  bancarios: ProveedorBancarioPayload[];
  domicilios: ProveedorDomicilioPayload[];
  contactos: ProveedorContactoPayload[];

  documentacion: DocumentacionState;
  anotaciones: string;
};

export type ProveedorUpdatePayload = {
  tipo_documento: TipoDocumento;
  documento: string;
  nacionalidad: number | null;
  padron_id: number | null;

  razon_social: string;
  nombre_fantasia: string;
  tipo: TipoProveedor;

  condicion_iva_id: number | null;
  actividades_ids: number[];

  bancarios: ProveedorBancarioPayload[];
  domicilios: ProveedorDomicilioPayload[];
  contactos: ProveedorContactoPayload[];

  documentacion: DocumentacionState;
  documentacion_existente: DocumentacionExistenteState;

  anotaciones: string;
};
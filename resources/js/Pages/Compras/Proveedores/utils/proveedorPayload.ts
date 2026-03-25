import type {
  ProveedorForm,
  ProveedorCreatePayload,
  ProveedorUpdatePayload,
  TipoClave,
  TipoCuenta,
  TipoProveedor,
  TipoDomicilio,
} from "@/types/Proveedor";

const cleanString = (value: unknown) => String(value ?? "").trim();
const cleanDigits = (value: unknown) => String(value ?? "").replace(/\D/g, "");

const buildBasePayload = (form: ProveedorForm) => ({
  tipo_documento: form.tipo_documento,
  documento: cleanDigits(form.documento),
  nacionalidad: form.nacionalidad ?? null,
  padron_id: form.padron_id ?? null,

  razon_social: cleanString(form.razon_social),
  nombre_fantasia: cleanString(form.nombre_fantasia),
  tipo: form.tipo as TipoProveedor,

  condicion_iva_id: form.condicion_iva_id ?? null,
  actividades_ids: form.actividades_ids ?? [],

  bancarios: (form.bancarios ?? []).map(({ _tmpId, ...b }) => ({
    entidad_financiera_id: b.entidad_financiera_id ?? null,
    tipo_clave: b.tipo_clave as TipoClave,
    clave: cleanDigits(b.clave),
    alias: cleanString(b.alias),
    moneda_id: b.moneda_id ?? null,
    tipo_cuenta: b.tipo_cuenta as TipoCuenta,
    predeterminado: !!b.predeterminado,
  })),

  domicilios: (form.domicilios ?? []).map((d) => ({
    tipo_domicilio: d.tipo_domicilio as TipoDomicilio,
    calle_id: cleanString(d.calle_id),
    altura: Number(d.altura ?? 0),
    predeterminado: !!d.predeterminado,
    codigo_postal: d.codigo_postal ?? null,
    piso: d.piso ?? null,
    departamento: d.departamento ?? null,
    observaciones: d.observaciones ?? null,
  })),

  contactos: (form.contactos ?? []).map(({ _tmpId, ...c }) => ({
    tipo_contacto: c.tipo_contacto ?? null,
    contacto: cleanString(c.contacto),
    predeterminado: !!c.predeterminado,
  })),

  documentacion: form.documentacion,
  anotaciones: cleanString(form.anotaciones),
});

export function buildProveedorCreatePayload(form: ProveedorForm): ProveedorCreatePayload {
  return {
    ...buildBasePayload(form),
  };
}

export function buildProveedorUpdatePayload(form: ProveedorForm): ProveedorUpdatePayload {
  return {
    ...buildBasePayload(form),
    documentacion_existente: form.documentacion_existente,
  };
}
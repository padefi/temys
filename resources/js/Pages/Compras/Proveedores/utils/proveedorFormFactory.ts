import type { Proveedor, ProveedorForm } from "@/types/Proveedor";

const makeTmpId = () =>
  globalThis.crypto?.randomUUID?.() ?? `tmp_${Date.now()}_${Math.random()}`;

export function createEmptyProveedorForm(): ProveedorForm {
  return {
    tipo_documento: "CUIT",
    documento: "",
    nacionalidad: null,
    padron_id: null,

    razon_social: "",
    nombre_fantasia: "",
    tipo: "",

    condicion_iva_id: null,
    actividades_ids: [],

    bancarios: [],
    domicilios: [],
    contactos: [],

    documentacion: {
      constancia_inscripcion: null,
      constancia_inscripcion_fecha_adjunto: null,
      constancias_cbu: [],
      exenciones: [],
    },

    documentacion_existente: {
      constancia_inscripcion: null,
      constancias_cbu: [],
      exenciones: [],
    },

    anotaciones: "",
  };
}

export function hydrateProveedorFormFromServer(proveedor: Proveedor): ProveedorForm {
  const base = createEmptyProveedorForm();
  const adjuntosRequeridos = proveedor.adjuntos_requeridos ?? [];
  const adjuntosOpcionales = proveedor.adjuntos_opcionales ?? [];

  return {
    ...base,

    tipo_documento: proveedor.padron?.tipo_documento ?? "CUIT",
    documento: proveedor.padron?.documento ?? "",
    nacionalidad: proveedor.padron?.nacionalidad ?? null,
    padron_id: proveedor.padron?.id ?? null,

    razon_social: proveedor.razon_social ?? "",
    nombre_fantasia: proveedor.nombre_fantasia ?? "",
    tipo: proveedor.tipo ?? "",

    condicion_iva_id: proveedor.condicion_iva_id ?? null,
    actividades_ids: proveedor.actividades?.map((a) => Number(a.id)) ?? [],

    bancarios: (proveedor.bancarios ?? []).map((b) => ({
      _tmpId: makeTmpId(),
      entidad_financiera_id: b.entidad_financiera_id ?? null,
      tipo_clave: b.tipo_clave ?? "",
      clave: b.clave ?? "",
      alias: b.alias ?? "",
      moneda_id: b.moneda_id ?? null,
      tipo_cuenta: b.tipo_cuenta ?? "",
      predeterminado: !!b.predeterminado,
    })),

    domicilios: (proveedor.domicilios ?? []).map((d) => ({
      _tmpId: makeTmpId(),
      tipo_domicilio: d.tipo_domicilio ?? "",
      calle_id: d.calle_id ?? "",
      altura: Number(d.altura ?? 0),
      predeterminado: !!d.predeterminado,
      codigo_postal: d.codigo_postal ?? null,
      piso: d.piso ?? null,
      departamento: d.departamento ?? null,
      observaciones: d.observaciones ?? null,
      calle_nombre: d.calle_nombre ?? null,
      provincia: d.provincia ?? null,
      localidad: d.localidad ?? null,
      lat: d.lat ?? null,
      lon: d.lon ?? null,
    })),

    contactos: (proveedor.contactos ?? []).map((c) => ({
      _tmpId: makeTmpId(),
      tipo_contacto: c.tipo_contacto ?? null,
      contacto: c.contacto ?? "",
      predeterminado: !!c.predeterminado,
    })),

    documentacion: {
      constancia_inscripcion: null,
      constancia_inscripcion_fecha_adjunto:
        adjuntosRequeridos.find((a) => Number(a.tipo_adjunto) === 1)?.fecha_adjunto ?? null,
      constancias_cbu: [],
      exenciones: [],
    },

    documentacion_existente: {
      constancia_inscripcion:
        adjuntosRequeridos.find((a) => Number(a.tipo_adjunto) === 1) ?? null,
      constancias_cbu:
        adjuntosOpcionales.filter((a) => Number(a.tipo_adjunto) === 2),
      exenciones:
        adjuntosOpcionales.filter((a) => Number(a.tipo_adjunto) === 3),
    },

    anotaciones: proveedor.anotaciones ?? "",
  };
}
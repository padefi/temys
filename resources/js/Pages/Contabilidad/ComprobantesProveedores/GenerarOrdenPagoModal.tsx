import React, { useState, useRef, useEffect, useCallback } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X, Trash2 } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { TipoMoneda } from '@/types/TipoMoneda'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import CampoBancoTarjeta from "./CampoBancoTarjeta"
import { ComprobanteProveedor } from "@/types/ComprobanteProveedor"
import axios from "axios"
import { toast } from "sonner"

type Pago = {
  metodo_pago_id: number
  metodo: string
  moneda: number
  importe: number
  fecha: string
  banco?: string
  cuentaBancaria?: number
  tarjeta?: string
  cotizacionMoneda?: number
  bancoId?: number
  tarjetaId?: number
  cbuProveedorId?: string
}

type Cbu = {
  id: number;
  cbu: string;
  alias: string;
};

type MetodoPago = {
  id: number;
  nombre: string;
  descripcion: string;
  co_cuenta_id: number;
}

type AnticipoAplicado = {
  anticipo_id: number
  factura_id: number
  importe: number
}

type Props = {
  open: boolean
  onClose: (updated?: boolean) => void
  proveedorId: number
  facturasSeleccionadas: { id: number; monedaOrden: number; total: number; montoAPagar: number }[]
  facturasDetalle: ComprobanteProveedor[]
  onSubmit: (data: any) => void
}

export default function GenerarOrdenPagoModal({
  open,
  onClose,
  proveedorId,
  facturasSeleccionadas,
  facturasDetalle,
}: Props) {
    const [step, setStep] = useState(1)
    const [plan, setPlan] = useState("unico")
    const [cuotas, setCuotas] = useState(1)
    const [activeTab, setActiveTab] = useState("0")
    const tabsRef = useRef<HTMLDivElement>(null)
    const [pagosUnicos, setPagosUnicos] = useState<Pago[]>([
        { metodo_pago_id: 0, metodo: "", moneda: Number(facturasSeleccionadas[0]?.monedaOrden || 0), importe: 0, fecha: "" }
    ])

    const [pagosCuotas, setPagosCuotas] = useState<Pago[][]>([])

    const [intentoSubmit, setIntentoSubmit] = useState(false)
    const [cbus, setCbus] = useState<Cbu[]>([]);
    const [tipoMonedas, setTipoMonedas] = useState<TipoMoneda[]>([]);
    const [metodoPagos, setMetodoPagos] = useState<MetodoPago[]>([]);

    const [anticipos, setAnticipos] = useState<ComprobanteProveedor[]>([])
    const [anticiposAplicados, setAnticiposAplicados] = useState<AnticipoAplicado[]>([])



    /* =======================
     USEEFFECTS
    ======================= */

    useEffect(() => {
    if (!open || !proveedorId) return

    axios
        .get(`/contabilidad/${proveedorId}/anticipos-disponibles`)
        .then(res => setAnticipos(res.data))
        .catch(() => setAnticipos([]))

    }, [open, proveedorId])


    useEffect(() => {

    //////////TRAE TIPO MONEDAS
    const fetchMonedas = async () => {
        try {
            const res = await axios.get("/tipo-monedas");
            const data = Array.isArray(res.data) ? res.data : res.data.data;
            setTipoMonedas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al traer las monedas", error);
            setTipoMonedas([]);
        }
    };
    if (open) fetchMonedas();

    //////////TRAE METODO PAGOS
    const fetchMetodoPagos = async () => {
        try {
            const res = await axios.get("/metodo-pagos");
            const data = Array.isArray(res.data) ? res.data : res.data.data;
            setMetodoPagos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al traer las monedas", error);
            setMetodoPagos([]);
        }
    };
    if (open) fetchMetodoPagos();
    }, [open]);




    // 🔹 Traer CBUs del proveedor
    useEffect(() => {
        if (!proveedorId) return
        fetch(`/proveedores/${proveedorId}/cbus`)
        .then((res) => res.json())
        .then((data) => setCbus(Array.isArray(data) ? data : []))
        .catch(() => setCbus([]))
    }, [proveedorId])

    // 🔹 Ajustar cuotas
    useEffect(() => {
        if (plan === "pagos") {
        const newCuotas: Pago[][] = Array.from({ length: cuotas }, (_, i) =>
            pagosCuotas[i] && pagosCuotas[i].length
            ? pagosCuotas[i]
            : [{ metodo_pago_id: 0, metodo: "", moneda: Number(facturasSeleccionadas[i]?.monedaOrden || 0), importe: 0, fecha: "" }]
        )
        setPagosCuotas(newCuotas)
        }
    }, [cuotas, plan])




    /* =======================
     HELPERS
    ======================= */
    const toNumber = (value: any): number => {
        const n = Number(value)
        return isNaN(n) ? 0 : n
    }

    const getImporteComprobante = (c: any) =>
    Number(c.importe_disponible ?? 0)

    //helper para los decimales
    const round2 = (n: number) =>
    Math.round((Number(n) + Number.EPSILON) * 100) / 100



    const totalAnticipos = anticiposAplicados.reduce(
        (acc, a) => acc + toNumber(a.importe),
        0
    )

    const totalFacturas = facturasSeleccionadas.reduce(
        (acc, f) => acc + toNumber(f.montoAPagar),
        0
    )

    const totalAPagarNeto = round2(Math.max(totalFacturas - totalAnticipos, 0))
    const esSoloAnticipos = totalAPagarNeto === 0

    const toggleAnticipo = (
    facturaId: number,
    anticipo: ComprobanteProveedor
    ) => {
    const existe = anticiposAplicados.find(
        a => a.factura_id === facturaId && a.anticipo_id === anticipo.id
    )

    // ❌ Si existe → lo saco
    if (existe) {
        setAnticiposAplicados(prev =>
        prev.filter(
            a => !(a.factura_id === facturaId && a.anticipo_id === anticipo.id)
        )
        )
        return
    }

    const disponible = getDisponibleAnticipo(anticipo)
    if (disponible <= 0) return

    setAnticiposAplicados(prev => [
        ...prev,
        {
        factura_id: facturaId,
        anticipo_id: anticipo.id,
        importe: 0
        }
    ])
    }

    const calcTotal = (pagos: Pago[]) =>
    pagos.reduce((acc, p) => acc + toNumber(p.importe), 0)

    const totalPagosUnicos = calcTotal(pagosUnicos)
    const totalPagosCuotas = calcTotal(pagosCuotas.flat())

    // 🔹 Calcular importe faltante general
    const getImporteFaltante = (actualTotal: number) => {
        const faltante = totalFacturas - actualTotal
        return faltante > 0 ? faltante : 0
    }

    const getTotalFactura = (f: ComprobanteProveedor) => {
        return f.detalles.reduce(
            (acc, d) => acc + Number(d.importe || 0),
            0
        )
    }

    const getTotalUsadoAnticipo = (anticipoId: number) =>
    anticiposAplicados
        .filter(a => a.anticipo_id === anticipoId)
        .reduce((acc, a) => acc + Number(a.importe), 0)

    const getDisponibleAnticipo = (anticipo: ComprobanteProveedor) => {
    const total = Number(anticipo.importe_disponible ?? 0)
    const usado = getTotalUsadoAnticipo(anticipo.id)
    return Math.max(total - usado, 0)
    }

    const getAnticiposFactura = (facturaId: number) =>
    anticiposAplicados.filter(a => a.factura_id === facturaId)

    const totalAnticiposFactura = (facturaId: number) =>
    getAnticiposFactura(facturaId)
        .reduce((acc, a) => acc + Number(a.importe), 0)




    /* =======================
        SUBMIT
    ======================= */
    const handleUpdatePagoCuota = useCallback(
        (cuotaIdx: number, updater: Pago[] | ((prev: Pago[]) => Pago[])) => {
        setPagosCuotas((prevCuotas) => {
            const updated = [...prevCuotas];
            const currentList = prevCuotas[cuotaIdx] || [];
            const newList = typeof updater === "function" ? updater(currentList) : updater;
            updated[cuotaIdx] = newList;
            return updated;
        });
        },
        []
    );



    // 🔹 Agregar fila y completar con faltante
    const handleAddPagoUnico = () => {
        const faltante = getImporteFaltante(totalPagosUnicos)
        setPagosUnicos([
        ...pagosUnicos,
        { metodo_pago_id: 0, metodo: "", moneda: Number(facturasSeleccionadas[0]?.monedaOrden || 0), importe: faltante, fecha: "" },
        ])
    }

    const handleAddPagoCuota = (cuotaIdx: number) => {
        const pagosDeEstaCuota = pagosCuotas[cuotaIdx] || []
        const totalEstaCuota = calcTotal(pagosDeEstaCuota)
        const faltante = getImporteFaltante(totalPagosCuotas)

        const updated = [...pagosCuotas]
        updated[cuotaIdx] = [
        ...pagosDeEstaCuota,
        { metodo_pago_id: 0, metodo: "", moneda: Number(facturasSeleccionadas[0]?.monedaOrden || 0), importe: faltante, fecha: "" },
        ]
        setPagosCuotas(updated)
    }

    const handleDeletePagoUnico = (idx: number) => setPagosUnicos(pagosUnicos.filter((_, i) => i !== idx))
    const handleDeletePagoCuota = (cuotaIdx: number, idx: number) => {
        const updated = [...pagosCuotas]
        updated[cuotaIdx] = updated[cuotaIdx].filter((_, i) => i !== idx)
        setPagosCuotas(updated)
    }

    const handlePlanSubmit = () => {
        if (plan === "pagos") {
        const initialCuotas = Array.from({ length: cuotas }, () => [
            { metodo_pago_id: 0, metodo: "", moneda: Number(facturasSeleccionadas[0]?.monedaOrden || 0), importe: 0, fecha: "" }
        ]);
        setPagosCuotas(initialCuotas);
        setActiveTab("0");
        }
        setStep(2);
    };

    const formatCurrency = (amount: number, code = "ARS") => {
    return toNumber(amount).toLocaleString("es-AR", {
        style: "currency",
        currency: code,
        minimumFractionDigits: 2
    })
    }



  const handleFinalSubmit = async () => {

    setIntentoSubmit(true)
    const totalPagos = plan === "unico" ? round2(totalPagosUnicos) : round2(totalPagosCuotas)
    const faltante = getImporteFaltante(totalPagos)

    /*if (faltante > 0) {
      toast.error("Falta completar el monto total a pagar.")
      return
    }
    if (faltante < 0) {
      toast.error("El total de pagos supera el total a pagar.")
      return
    }*/

    if (totalPagos < totalAPagarNeto) {
      toast.error("Falta completar el monto a pagar")
      return
    }

    if (totalPagos > totalAPagarNeto) {
      toast.error("El total supera el monto a pagar")
      return
    }

// 🟢 CASO: solo anticipos
if (esSoloAnticipos) {
    try {
      const dataToSend = {
        tipo_pago: "Anticipos",
        cantidad_cuotas: null,
        facturasSeleccionadas,
        anticipos_aplicados: anticiposAplicados,
        pagos: [], // 👈 vacío
      }

      const res = await axios.post(
        "/contabilidad/ordenesPagos",
        dataToSend
      )

      if (res.status === 201) {
        toast.success("Anticipos aplicados correctamente")
        onClose(true)
      }
    } catch (error: any) {
      const backendMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error al aplicar anticipos"

      toast.error(backendMessage)
    }

    return // ⛔ salimos acá
}


if (!esSoloAnticipos) {
try{
    const dataToSend =
        plan === "unico"
        ? {
            tipo_pago: "Unico",
            cantidad_cuotas: null,
            facturasSeleccionadas: facturasSeleccionadas,
            anticipos_aplicados: anticiposAplicados,
            pagos: pagosUnicos.map((p) => ({
                metodo_pago_id: p.metodo_pago_id,
                moneda_id: p.moneda, // ✅ número
                importe: p.importe,
                fecha_pago: p.fecha,
                banco_origen_id: p.bancoId ? Number(p.bancoId) : null, // ✅ entero o null
                cuenta_origen_id: p.cuentaBancaria ? Number(p.cuentaBancaria) : null,
                tarjeta_origen_id: p.tarjetaId ? Number(p.tarjetaId) : null,
                cbu_pago: p.cbuProveedorId ? p.cbuProveedorId : null,
                usuario_id: 1,
            })),
            }
        : {
            tipo_pago: "Cuotas",
            cantidad_cuotas: cuotas,
            facturasSeleccionadas: facturasSeleccionadas,
            anticipos_aplicados: anticiposAplicados,
            pagos: pagosCuotas.flat().map((p) => ({
                metodo_pago_id: p.metodo_pago_id,
                moneda_id: p.moneda, // ✅ número
                importe: p.importe,
                fecha_pago: p.fecha,
                banco_origen_id: p.bancoId ? Number(p.bancoId) : null, // ✅ entero o null
                cuenta_origen_id: p.cuentaBancaria ? Number(p.cuentaBancaria) : null,
                tarjeta_origen_id: p.tarjetaId ? Number(p.tarjetaId) : null,
                cbu_pago: p.cbuProveedorId ? p.cbuProveedorId : null,
                usuario_id: 1,
            })),
            };


    const res = await axios.post("/contabilidad/ordenesPagos", dataToSend)
    if (res.status === 201) {
        toast.success("Orden de pago generada exitosamente")

        onClose(true);
    }
    }catch (error: any) {
            // 🧩 Si el backend envía un mensaje claro (como en tu caso)
            const backendMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Error al guardar la factura.";

            toast.error(backendMessage);
    }
}
};



  const scrollTabs = (offset: number) => {
    if (tabsRef.current) tabsRef.current.scrollBy({ left: offset, behavior: "smooth" })
  }

  const renderCamposCondicionales = (
    p: Pago,
    idx: number,
    list: Pago[],
    setList: (newList: Pago[] | ((prev: Pago[]) => Pago[])) => void
  ) => {
    const showError = intentoSubmit;

    const updateMultipleFields = (fields: Partial<Pago>) => {
      setList((prevList: Pago[]) => {
        const newList = prevList.map((item, i) =>
          i === idx ? { ...item, ...fields } : item
        );
        return newList;
      });
    };




    return (
      <>
        {showError && !p.metodo && <p className="text-sm text-red-600 col-span-6">Seleccioná un método</p>}
        {showError && !p.moneda && <p className="text-sm text-red-600 col-span-6">Seleccioná una moneda</p>}
        {showError && p.importe <= 0 && <p className="text-sm text-red-600 col-span-6">El importe debe ser mayor a 0</p>}
        {showError && !p.fecha && <p className="text-sm text-red-600 col-span-6">Seleccioná una fecha</p>}
        {showError && p.metodo === "Transferencia" && !p.cbuProveedorId && <p className="text-sm text-red-600 col-span-2">Seleccioná un CBU del proveedor</p>}

        {p.metodo === "Transferencia" && (
          <div className="col-span-6 grid grid-cols-1 gap-2">
            <CampoBancoTarjeta
              tipo="transferencia"
              value={{
                bancoId: p.bancoId,
                cuentaId: p.cuentaBancaria ? Number(p.cuentaBancaria) : undefined,
              }}
              onChange={(val) => updateMultipleFields({ bancoId: val.bancoId, cuentaBancaria: val.cuentaId })}
            />
            <div className="col-span-1">
              <select
                className="border p-2 rounded w-full"
                value={p.cbuProveedorId || ""}
                onChange={(e) => updateMultipleFields({ cbuProveedorId: e.target.value })}
              >
                <option value="">Seleccioná un CBU</option>
                {cbus.map((c) => <option key={c.id} value={c.cbu}>{c.cbu} ({c.alias})</option>)}
              </select>
              {showError && !p.cbuProveedorId && <p className="text-sm text-red-600 mt-1">Seleccioná un CBU</p>}
            </div>
          </div>
        )}

        {p.metodo === "Cheque" && (
          <div className="col-span-6">
            <CampoBancoTarjeta tipo="banco" value={p.bancoId} onChange={(val) => updateMultipleFields({ bancoId: val })} />
            {showError && !p.bancoId && <p className="text-sm text-red-600 mt-1">Seleccioná un banco</p>}
          </div>
        )}

        {p.metodo === "Tarjeta" && (
          <div className="col-span-6">
            <CampoBancoTarjeta tipo="tarjeta" value={p.tarjetaId} onChange={(val) => updateMultipleFields({ tarjetaId: val })} />
            {showError && !p.tarjetaId && <p className="text-sm text-red-600 mt-1">Seleccioná una tarjeta</p>}
          </div>
        )}
      </>
    );
  };

    const isPagoCompleto = (p: Pago) => {
        const camposBasicos = p.metodo_pago_id > 0 && p.moneda > 0 && p.importe > 0 && !!p.fecha
            if (!camposBasicos) return false

            if (p.metodo === "Cheque") return !!p.bancoId
            if (p.metodo === "Tarjeta") return !!p.tarjetaId
            if (p.metodo === "Transferencia") return !!p.bancoId && !!p.cuentaBancaria && !!p.cbuProveedorId

            return true
    }

    const totalPagosActual =
        plan === "unico"
            ? round2(totalPagosUnicos)
            : round2(totalPagosCuotas)

    const coincideTotal =
        round2(totalPagosActual) === round2(totalAPagarNeto)

    const saldoRestante = round2(totalAPagarNeto - totalPagosActual)

    const pagosCompletos =
        plan === "unico"
            ? pagosUnicos.length > 0 && pagosUnicos.every(isPagoCompleto)
            : pagosCuotas.length > 0 &&
            pagosCuotas.every(
                (cuota) => cuota.length > 0 && cuota.every(isPagoCompleto)
            )

    const isFormValid = pagosCompletos && coincideTotal

  return (
  <Dialog.Root open={open} onOpenChange={onClose}>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />

    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-full max-w-6xl shadow-lg max-h-[90vh] overflow-auto">
      <Dialog.Title className="text-lg font-bold">
        Generar Orden de Pago
      </Dialog.Title>

      <Dialog.Close asChild>
        <button className="absolute top-3 right-3 p-1 rounded hover:bg-gray-200">
          <X size={20} />
        </button>
      </Dialog.Close>

      {/* 🧾 FACTURAS SELECCIONADAS */}
      {facturasSeleccionadas.length > 0 && (
        <div className="mt-4 border rounded-lg p-4 bg-gray-50 space-y-4">

            <div className="grid grid-cols-2 font-semibold">
                <div>Facturas seleccionadas</div>
                <div className="text-right">A pagar</div>
            </div>

            {facturasDetalle
                .filter(f => facturasSeleccionadas.some(fs => fs.id === f.id))
                .map(f => {
                const seleccion = facturasSeleccionadas.find(fs => fs.id === f.id)

                return (
                    <div key={f.id} className="border rounded p-3 bg-white space-y-2">

                    {/* DATOS FACTURA */}
                    <div className="flex justify-between">
                        <div>
                        <strong>
                            {f.tipo_comprobante?.nombre || "Factura"}
                        </strong>{" "}
                        {f.id} – Nº {f.punto_venta}-{f.numero_factura}
                        <div className="text-sm text-gray-500 italic">
                            Total factura:{" "}
                            {formatCurrency(getTotalFactura(f), f.tipo_moneda?.codigo)}
                        </div>
                        </div>

                        {/* A PAGAR */}
                        <div className="font-semibold">
                        {formatCurrency(
                            seleccion?.montoAPagar ?? 0,
                            f.tipo_moneda?.codigo
                        )}
                        </div>
                    </div>

                    {/* ANTICIPOS */}

                    {anticipos.length > 0 && (
                        <div className="border rounded p-3 bg-blue-50">
                        <h4 className="font-semibold mb-2">
                            Anticipos disponibles
                        </h4>

                        {anticipos
                        .filter(a => {
                            // ❌ No permitir usar el mismo anticipo para pagarse
                            if (
                            f.tipo_comprobante?.categoria === "anticipo" &&
                            a.id === f.id
                            ) {
                            return false
                            }

                            return true
                        })
                        .map(a => {
                            const aplicado = anticiposAplicados.find(
                            x =>
                                x.factura_id === f.id &&
                                x.anticipo_id === a.id
                            )

                            const disponible = getDisponibleAnticipo(a)

                            return (
                            <div
                                key={a.id}
                                className="flex items-center gap-3 mb-2"
                            >
                                <input
                                type="checkbox"
                                checked={!!aplicado}
                                onChange={() => toggleAnticipo(f.id, a)}
                                />

                                <span className="flex-1">
                                {a.tipo_comprobante?.nombre} Nº{" "}
                                {a.punto_venta}-{a.numero_factura}
                                </span>

                                <span className="text-blue-700 text-sm">
                                Disponible:{" "}
                                {formatCurrency(
                                    disponible,
                                    a.tipo_moneda?.codigo
                                )}
                                </span>

                                {aplicado && (
                                <Input
                                    type="number"
                                    min={0}
                                    max={disponible + aplicado.importe}
                                    className="w-28"
                                    value={aplicado.importe}
                                    onChange={e => {
                                    const nuevo = Number(e.target.value)
                                    const max =
                                        disponible + aplicado.importe
                                    if (nuevo > max) return

                                    setAnticiposAplicados(prev =>
                                        prev.map(x =>
                                        x.factura_id === f.id &&
                                        x.anticipo_id === a.id
                                            ? { ...x, importe: nuevo }
                                            : x
                                        )
                                    )
                                    }}
                                />
                                )}
                            </div>
                            )
                        })}

                        <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                            <span>Total anticipos factura</span>
                            <span>
                            {formatCurrency(
                                totalAnticiposFactura(f.id),
                                f.tipo_moneda?.codigo
                            )}
                            </span>
                        </div>
                        </div>
                    )}
                    </div>
                )
                })}

            {/* TOTAL A PAGAR GLOBAL */}
            <div className="border-t pt-3 space-y-1">

            <div className="flex justify-between font-semibold">
                <span>Total Neto a Pagar</span>
                <span>
                {formatCurrency(
                    totalAPagarNeto,
                    facturasDetalle[0]?.tipo_moneda?.codigo
                )}
                </span>
            </div>

            <div className="flex justify-between">
                <span>Pagos Cargados</span>
                <span>
                {formatCurrency(
                    totalPagosActual,
                    facturasDetalle[0]?.tipo_moneda?.codigo
                )}
                </span>
            </div>

            <div
                className={`flex justify-between font-bold ${
                saldoRestante === 0
                    ? "text-green-600"
                    : saldoRestante > 0
                    ? "text-red-600"
                    : "text-orange-600"
                }`}
            >
                <span>
                {saldoRestante === 0
                    ? "Saldo"
                    : saldoRestante > 0
                    ? "Falta Saldar"
                    : "Excedente"}
                </span>
                <span>
                {formatCurrency(
                    Math.abs(saldoRestante),
                    facturasDetalle[0]?.tipo_moneda?.codigo
                )}
                </span>
            </div>
            </div>
            </div>
        )}


        {esSoloAnticipos && (
        <div className="mt-6 flex justify-end">
            <Button onClick={handleFinalSubmit}>
            Confirmar
            </Button>
        </div>
        )}


        {/* PASO 1 */}
        {step === 1 && !esSoloAnticipos && (
            <div className="space-y-4 mt-6">
            <div>
                <Label>Plan</Label>
                <select
                className="border p-2 rounded w-full"
                value={plan}
                onChange={e => setPlan(e.target.value)}
                >
                <option value="unico">Plan Único</option>
                <option value="pagos">Plan de Pagos</option>
                </select>
            </div>

            {plan === "pagos" && (
                <div>
                <Label>Cantidad de Cuotas</Label>
                <Input
                    type="number"
                    min={1}
                    value={cuotas}
                    onChange={e => setCuotas(Number(e.target.value))}
                />
                </div>
            )}

            <div className="flex justify-end gap-2">
                <Button onClick={handlePlanSubmit}>
                Siguiente
                </Button>
            </div>
            </div>
        )}


        {/* Paso 2 */}
        {step === 2 && (
          <div className="mt-4 space-y-4">
            {plan === "unico" ? (
              <div>
                <div className="grid grid-cols-6 gap-2 font-semibold text-sm text-gray-700 mb-2">
                  <div>Método</div>
                  <div>Moneda</div>
                  <div>Importe</div>
                  <div>Fecha</div>
                  <div></div>
                </div>

                {pagosUnicos.map((p, idx) => (
                  <div key={idx} className="grid grid-cols-6 gap-2 mb-2 items-center">
                    <select
                    value={p.metodo_pago_id}
                    onChange={(e) => {
                        const selectedId = Number(e.target.value);
                        const selectedMetodo = metodoPagos.find((m) => m.id === selectedId);
                        const updated = [...pagosUnicos];
                        updated[idx].metodo_pago_id = selectedId;
                        updated[idx].metodo = selectedMetodo ? selectedMetodo.nombre : "";
                        setPagosUnicos(updated);
                    }}
                    >
                    <option value="">Seleccioná un método</option>
                    {metodoPagos.map((m) => (
                        <option key={m.id} value={m.id}>
                        {m.nombre}
                        </option>
                    ))}
                    </select>


                    <select
                    value={p.moneda}
                    onChange={(e) => {
                        const updated = [...pagosUnicos];
                        updated[idx].moneda = Number(e.target.value); // 🔹 convertir a número
                        setPagosUnicos(updated);
                    }}
                    >
                    <option value="">Seleccioná una moneda</option>
                    {tipoMonedas.map((m) => (
                        <option key={m.codigo} value={m.id}> {/* 🔹 usar id, no simbolo */}
                            {m.descripcion} ({m.simbolo})
                        </option>
                    ))}
                    </select>


                    <Input type="number" value={p.importe} onChange={(e) => { const updated = [...pagosUnicos]; updated[idx].importe = Number(e.target.value); setPagosUnicos(updated); }} />
                    <Input type="date" value={p.fecha} min={new Date().toISOString().split("T")[0]} onChange={(e) => { const updated = [...pagosUnicos]; updated[idx].fecha = e.target.value; setPagosUnicos(updated); }} />

                    <button type="button" onClick={() => handleDeletePagoUnico(idx)} className="p-2 text-red-600 hover:bg-red-100 rounded"><Trash2 size={18} /></button>

                    {renderCamposCondicionales(p, idx, pagosUnicos, setPagosUnicos)}
                  </div>
                ))}

                <Button variant="outline" onClick={handleAddPagoUnico}>+ Agregar fila</Button>
                <div className="text-sm text-gray-600 mt-2">Total cargado: {totalPagosUnicos}</div>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center gap-2 mb-2">
                  <button type="button" onClick={() => scrollTabs(-150)} className="px-2 py-1 bg-gray-200 rounded">&lt;</button>
                  <div className="flex-1 overflow-x-auto no-scrollbar" ref={tabsRef}>
                    <TabsList className="flex gap-1 w-max min-w-full">
                      {Array.from({ length: cuotas }).map((_, i) => <TabsTrigger key={i} value={String(i)} className="flex-shrink-0 whitespace-nowrap px-3 py-1 border rounded text-sm">Cuota {i + 1}</TabsTrigger>)}
                    </TabsList>
                  </div>
                  <button type="button" onClick={() => scrollTabs(150)} className="px-2 py-1 bg-gray-200 rounded">&gt;</button>
                </div>

                <div className="grid grid-cols-6 gap-2 font-semibold text-sm text-gray-700 mb-2"><div>Método</div><div>Moneda</div><div>Importe</div><div>Fecha</div><div></div></div>

                {pagosCuotas.map((pagoList, cuotaIdx) => (
                  <TabsContent key={cuotaIdx} value={String(cuotaIdx)}>
                    {Array.isArray(pagoList) ? pagoList.map((p, idx) => (
                      <div key={idx} className="grid grid-cols-6 gap-2 mb-2 items-center">
                        <select
                        value={p.metodo_pago_id}
                        onChange={(e) => {
                            const selectedId = Number(e.target.value);
                            const selectedMetodo = metodoPagos.find((m) => m.id === selectedId);
                            const updated = [...pagosCuotas];
                            updated[cuotaIdx][idx].metodo_pago_id = selectedId;
                            updated[cuotaIdx][idx].metodo = selectedMetodo ? selectedMetodo.nombre : "";
                            setPagosCuotas(updated);
                        }}
                        >
                        <option value="">Seleccioná un método</option>
                        {metodoPagos.map((m) => (
                            <option key={m.id} value={m.id}>
                            {m.nombre}
                            </option>
                        ))}
                        </select>


                        <select
                        value={p.moneda || tipoMonedas[0]?.id || ""}
                        onChange={(e) => {
                            const updated = [...pagosCuotas];
                            updated[cuotaIdx][idx].moneda = Number(e.target.value); // 🔹 convertir a número
                            setPagosCuotas(updated);
                        }}
                        >
                        <option value="">Seleccioná una moneda</option>
                        {tipoMonedas.map((m) => (
                            <option key={m.codigo} value={m.id}> {/* 🔹 usar id */}
                            {m.descripcion} ({m.simbolo})
                            </option>
                        ))}
                        </select>


                        <Input type="number" value={p.importe} onChange={(e) => { const updated = [...pagosCuotas]; updated[cuotaIdx][idx].importe = Number(e.target.value); setPagosCuotas(updated); }} />
                        <Input type="date" value={p.fecha} min={new Date().toISOString().split("T")[0]} onChange={(e) => { const updated = [...pagosCuotas]; updated[cuotaIdx][idx].fecha = e.target.value; setPagosCuotas(updated); }} />

                        <button type="button" onClick={() => handleDeletePagoCuota(cuotaIdx, idx)} className="p-2 text-red-600 hover:bg-red-100 rounded"><Trash2 size={18} /></button>

                        {renderCamposCondicionales(p, idx, pagosCuotas[cuotaIdx], (newList) => handleUpdatePagoCuota(cuotaIdx, newList))}
                      </div>
                    )) : null}

                    <Button variant="outline" onClick={() => handleAddPagoCuota(cuotaIdx)}>+ Agregar fila</Button>
                    <div className="text-sm text-gray-600 mt-2">Total de esta cuota: {formatCurrency(calcTotal(pagoList), tipoMonedas[0]?.codigo)}</div>

                  </TabsContent>
                ))}

                <div className="text-sm text-gray-600 mt-2">Total cargado: {totalPagosCuotas}</div>
              </Tabs>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setStep(1)}>Atrás</Button>
              <Button disabled={!isFormValid} onClick={handleFinalSubmit} >Confirmar</Button>
            </div>
          </div>
        )}
      </Dialog.Content>
    </Dialog.Root>
  )
}

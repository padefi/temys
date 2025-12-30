import React, { useState, useRef, useEffect, useCallback } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X, Trash2 } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { TipoMoneda } from '@/types/TipoMoneda'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import CampoBancoTarjeta from "./CampoBancoTarjeta"
import { router } from '@inertiajs/react';
import { Typography } from "@/Components/ui/typography"
import { ComprobanteProveedor } from "@/types/ComprobanteProveedor"
import axios from "axios"
import { toast } from "sonner"

type Cobro = {
  metodo: string
  metodo_id: number
  moneda: number
  importe: number
  fecha: string
  banco?: string
  cuentaBancaria?: number
  tarjeta?: string
  cotizacionMoneda?: number
  bancoId?: number
  tarjetaId?: number
  cbuClienteId?: number
}

type Cbu = {
  id: number;
  cbu: string;
  alias: string;
};

type Props = {
  open: boolean
  onClose: () => void
  monedaOrden: number
  tipoMonedas: TipoMoneda[]
  clienteId: number
  facturasSeleccionadas: number[]
  comprobantes: ComprobanteProveedor[]
  onSubmit: (data: any) => void
}

export default function GenerarOrdenCobroModal({
  open,
  onClose,
  monedaOrden,
  tipoMonedas,
  clienteId,
  facturasSeleccionadas,
  comprobantes,
  onSubmit
}: Props) {
  const [step, setStep] = useState(1)
  const [plan, setPlan] = useState("unico")
  const [cuotas, setCuotas] = useState(1)
  const [activeTab, setActiveTab] = useState("0")
  const tabsRef = useRef<HTMLDivElement>(null)

  const [cobrosUnicos, setCobrosUnicos] = useState<Cobro[]>([
    { metodo: "", moneda: Number(monedaOrden), importe: 0, fecha: "", metodo_id: 0 }
  ])

  const [cobrosCuotas, setCobrosCuotas] = useState<Cobro[][]>([])

  const [intentoSubmit, setIntentoSubmit] = useState(false)
  const [cbus, setCbus] = useState<Cbu[]>([]);

  // Traer CBU del cliente
  useEffect(() => {
    if (!clienteId) return;

    fetch(`/clientes/${clienteId}/cbus`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCbus(data);
        else setCbus([]);
      })
      .catch(() => setCbus([]));
  }, [clienteId]);

  // Ajustar cuotas
  useEffect(() => {
    if (plan === "cobros") {
      const newCuotas: Cobro[][] = Array.from({ length: cuotas }, (_, i) => {
        const existing = cobrosCuotas[i];
        if (!Array.isArray(existing)) {
          return [{ metodo: "", moneda: Number(monedaOrden), importe: 0, fecha: "", metodo_id: 0 }];
        }
        return existing;
      });
      setCobrosCuotas(newCuotas);
    }
  }, [cuotas, plan]);

  const isCobroCompleto = (c: Cobro) => {
    const camposBasicos = !!c.metodo && !!c.metodo_id && !!c.moneda && c.importe > 0 && !!c.fecha
    if (!camposBasicos) return false

    if (c.metodo === "Cheque") return !!c.bancoId
    if (c.metodo === "Tarjeta") return !!c.tarjetaId
    if (c.metodo === "Transferencia") return !!c.bancoId && !!c.cuentaBancaria && !!c.cbuClienteId

    return true
  }

  const handleUpdateCobroCuota = useCallback(
    (cuotaIdx: number, updater: Cobro[] | ((prev: Cobro[]) => Cobro[])) => {
      setCobrosCuotas((prevCuotas) => {
        const updated = [...prevCuotas];
        const currentList = prevCuotas[cuotaIdx] || [];
        const newList = typeof updater === "function" ? updater(currentList) : updater;
        updated[cuotaIdx] = newList;
        return updated;
      });
    },
    []
  );

  const allComplete = plan === "unico"
    ? cobrosUnicos.every(isCobroCompleto)
    : cobrosCuotas.flat().every(isCobroCompleto)

  const calcTotal = (cobros: Cobro[]) => cobros.reduce((acc, p) => acc + p.importe, 0)
  const calcTotalPorCuota = (cobroList: Cobro[]) => cobroList.reduce((acc, p) => acc + p.importe, 0)

  const totalCobrosUnicos = calcTotal(cobrosUnicos)
  const totalCobrosCuotas = calcTotal(cobrosCuotas.flat())

  const getImporteFaltante = (actualTotal: number) => {
    const faltante = comprobantes
      .filter((f) => facturasSeleccionadas.includes(f.id))
      .reduce((acc, f) => acc + Number(f.detalles.reduce((acc, d) => acc + Number(d.importe || 0), 0) || 0), 0) - actualTotal
    return faltante > 0 ? faltante : 0
  }


  const handleAddCobroUnico = () => {
    const faltante = getImporteFaltante(totalCobrosUnicos)
    if (faltante > 0) {
      setCobrosUnicos([
        ...cobrosUnicos,
        { metodo: "", moneda: monedaOrden, importe: faltante, fecha: "", metodo_id: 0 }
      ])
    }
  }

  const handleAddCobroCuota = (cuotaIdx: number) => {
    const cobrosDeEstaCuota = cobrosCuotas[cuotaIdx] || []
    const totalEstaCuota = calcTotal(cobrosDeEstaCuota)
    const faltante = getImporteFaltante(totalEstaCuota)

    if (faltante > 0) {
      const updated = [...cobrosCuotas]
      updated[cuotaIdx] = [
        ...cobrosDeEstaCuota,
        { metodo: "", moneda: monedaOrden, importe: faltante, fecha: "", metodo_id: 0 }
      ]
      setCobrosCuotas(updated)
    }
  }

  const handleDeleteCobroUnico = (idx: number) => setCobrosUnicos(cobrosUnicos.filter((_, i) => i !== idx))
  const handleDeleteCobroCuota = (cuotaIdx: number, idx: number) => {
    const updated = [...cobrosCuotas]
    updated[cuotaIdx] = updated[cuotaIdx].filter((_, i) => i !== idx)
    setCobrosCuotas(updated)
  }

  const handlePlanSubmit = () => {
    if (plan === "cobros") {
      const initialCuotas = Array.from({ length: cuotas }, () => [
        { metodo: "", moneda: monedaOrden, importe: 0, fecha: "" }
      ]);
      setCobrosCuotas(initialCuotas.map((cuota) => cuota.map((p) => ({ ...p, metodo_id: 0 }))));
      setActiveTab("0");
    }
    setStep(2);
  };

  const handleFinalSubmit = async () => {
    setIntentoSubmit(true);
try{
    const dataToSend =
        plan === "unico"
        ? {
            tipo_pago: "Unico",
            cantidad_cuotas: null,
            facturasSeleccionadas: facturasSeleccionadas,
            cobros: cobrosUnicos.map((p) => ({
                metodo_pago: p.metodo,
                metodo_pago_id: p.metodo_id,
                moneda_id: p.moneda, // ✅ número
                importe: p.importe,
                fecha_pago: p.fecha,
                banco_origen: p.bancoId ? Number(p.bancoId) : null, // ✅ entero o null
                cuenta_origen: p.cuentaBancaria ? Number(p.cuentaBancaria) : null,
                cbu_pago: p.cbuClienteId ? Number(p.cbuClienteId) : null,
                usuario_id: 1,
            })),
            }
        : {
            tipo_pago: "Cuotas",
            cantidad_cuotas: cuotas,
            facturasSeleccionadas: facturasSeleccionadas,
            cobros: cobrosCuotas.flat().map((p) => ({
                metodo_pago: p.metodo,
                moneda_id: p.moneda, // ✅ número
                importe: p.importe,
                fecha_pago: p.fecha,
                banco_origen: p.bancoId ? Number(p.bancoId) : null,
                cuenta_origen: p.cuentaBancaria ? Number(p.cuentaBancaria) : null,
                cbu_pago: p.cbuClienteId ? Number(p.cbuClienteId) : null,
                usuario_id: 1,
            })),
            };

    const totalCobros = plan === "unico" ? totalCobrosUnicos : totalCobrosCuotas;
    if (getImporteFaltante(totalCobros)  > 0) {
        alert("La suma de los importes supera el total de la orden");
        return;
    }

    const res = await axios.post("/compras/ordenes-compras/ordenes-pagos", dataToSend)
    if (res.status === 201) {
        toast.success("Orden de pago generada exitosamente")
        onSubmit(res.data);
        onClose();
    }
    }catch (error: any) {
            // 🧩 Si el backend envía un mensaje claro (como en tu caso)
            const backendMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Error al guardar la factura.";

            toast.error(backendMessage);
        }
    };


  const scrollTabs = (offset: number) => {
    if (tabsRef.current) tabsRef.current.scrollBy({ left: offset, behavior: "smooth" })
  }

  const renderCamposCondicionales = (
    p: Cobro,
    idx: number,
    list: Cobro[],
    setList: (newList: Cobro[] | ((prev: Cobro[]) => Cobro[])) => void
  ) => {
    const showError = intentoSubmit;

    const updateMultipleFields = (fields: Partial<Cobro>) => {
      setList((prevList: Cobro[]) => {
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
        {showError && p.metodo === "Transferencia" && !p.cbuClienteId && <p className="text-sm text-red-600 col-span-2">Seleccioná un CBU del cliente</p>}

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
                value={p.cbuClienteId || ""}
                onChange={(e) => updateMultipleFields({ cbuClienteId: Number(e.target.value) })}
              >
                <option value="">Seleccioná un CBU</option>
                {cbus.map((c) => <option key={c.id} value={c.id}>{c.cbu} ({c.alias})</option>)}
              </select>
              {showError && !p.cbuClienteId && <p className="text-sm text-red-600 mt-1">Seleccioná un CBU</p>}
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

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-full max-w-6xl shadow-lg max-h-[90vh] overflow-auto">
        <Dialog.Title className="text-lg font-bold">Generar Orden de Cobro</Dialog.Title>
        <Dialog.Close asChild>
          <button className="absolute top-3 right-3 p-1 rounded hover:bg-gray-200"><X size={20} /></button>
        </Dialog.Close>
        {/* 🧾 Facturas seleccionadas */}
        {facturasSeleccionadas.length > 0 && (
        <div className="mt-4 border rounded-lg p-3 bg-gray-50">
            <h4 className="font-semibold mb-2">Facturas seleccionadas</h4>
            <ul className="space-y-1 text-sm">
            {comprobantes
                .filter((f) => facturasSeleccionadas.includes(f.id))
                .map((f) => (
                <li key={f.id} className="flex justify-between border-b last:border-0 pb-1">
                    <span>
                    <strong>{f.tipo_comprobante?.nombre || 'Factura'}</strong>{" "}
                    {f.id} - Nº {f.punto_venta}-{f.numero_factura}
                    </span>
                    <span>
                    {Number(f.detalles.reduce((acc, d) => acc + Number(d.importe || 0), 0) || 0).toLocaleString('es-AR', {
                        style: 'currency',
                        currency: f.tipo_moneda?.codigo || 'ARS',
                        minimumFractionDigits: 2
                    })}
                    </span>
                </li>
                ))}

            {/* Total general */}
            <li className="flex justify-between font-semibold pt-2 border-t">
                <span>Total seleccionado</span>
                <span>
                {comprobantes
                    .filter((f) => facturasSeleccionadas.includes(f.id))
                    .reduce((acc, f) => acc + Number(f.detalles.reduce((acc, d) => acc + Number(d.importe || 0), 0) || 0), 0)
                    .toLocaleString('es-AR', {
                    style: 'currency',
                    currency:
                        comprobantes[0]?.tipo_moneda?.codigo || 'ARS',
                    minimumFractionDigits: 2
                    })}
                </span>
            </li>
            </ul>
        </div>
        )}

        {/* Paso 1 */}
        {step === 1 && (
          <div className="space-y-4 mt-4">
            <div>
              <Label>Plan</Label>
              <select className="border p-2 rounded w-full" value={plan} onChange={(e) => setPlan(e.target.value)}>
                <option value="unico">Plan Único</option>
                <option value="cobros">Plan de Cobros</option>
              </select>
            </div>

            {plan === "cobros" && (
              <div>
                <Label>Cantidad de Cuotas</Label>
                <Input type="number" min={1} value={cuotas} onChange={(e) => setCuotas(Number(e.target.value))} />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button onClick={handlePlanSubmit}>Siguiente</Button>
            </div>
          </div>
        )}

        {/* Paso 2 */}
        {step === 2 && (
          <div className="mt-4 space-y-4">
            {plan === "unico" ? (
              <div>
                <div className="grid grid-cols-6 gap-2 font-semibold text-sm text-gray-700 mb-2">
                  <div>Método</div><div>Moneda</div><div>Importe</div><div>Fecha</div><div></div>
                </div>

                {cobrosUnicos.map((p, idx) => (
                  <div key={idx} className="grid grid-cols-6 gap-2 mb-2 items-center">
                    <select value={p.metodo} onChange={(e) => { const updated = [...cobrosUnicos];
                                                                updated[idx].metodo = e.target.value;
                                                                setCobrosUnicos(updated); }}>
                      <option value="">Método</option>
                      <option value="Transferencia">Transferencia</option>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Tarjeta">Tarjeta</option>
                      <option value="Cheque">Cheque</option>
                    </select>

                    <select
                    value={p.moneda || tipoMonedas[0]?.id || ""}
                    onChange={(e) => {
                        const updated = [...cobrosUnicos];
                        updated[idx].moneda = Number(e.target.value); // 🔹 convertir a número
                        setCobrosUnicos(updated);
                    }}
                    >
                    {tipoMonedas.map((m) => (
                        <option key={m.codigo} value={m.id}> {/* 🔹 usar id, no simbolo */}
                        {m.descripcion} ({m.simbolo})
                        </option>
                    ))}
                    </select>


                    <Input type="number" value={p.importe} onChange={(e) => { const updated = [...cobrosUnicos]; updated[idx].importe = Number(e.target.value); setCobrosUnicos(updated); }} />
                    <Input type="date" value={p.fecha} min={new Date().toISOString().split("T")[0]} onChange={(e) => { const updated = [...cobrosUnicos]; updated[idx].fecha = e.target.value; setCobrosUnicos(updated); }} />

                    <button type="button" onClick={() => handleDeleteCobroUnico(idx)} className="p-2 text-red-600 hover:bg-red-100 rounded"><Trash2 size={18} /></button>

                    {renderCamposCondicionales(p, idx, cobrosUnicos, setCobrosUnicos)}
                  </div>
                ))}

                <Button variant="outline" onClick={handleAddCobroUnico}>+ Agregar fila</Button>
                <div className="text-sm text-gray-600 mt-2">Total cargado: {totalCobrosUnicos}</div>
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

                {cobrosCuotas.map((cobroList, cuotaIdx) => (
                  <TabsContent key={cuotaIdx} value={String(cuotaIdx)}>
                    {Array.isArray(cobroList) ? cobroList.map((p, idx) => (
                      <div key={idx} className="grid grid-cols-6 gap-2 mb-2 items-center">
                        <select value={p.metodo} onChange={(e) => { const updated = [...cobrosCuotas]; updated[cuotaIdx][idx].metodo = e.target.value; setCobrosCuotas(updated); }}>
                          <option value="">Método</option>
                          <option value="Transferencia">Transferencia</option>
                          <option value="Efectivo">Efectivo</option>
                          <option value="Tarjeta">Tarjeta</option>
                          <option value="Cheque">Cheque</option>
                        </select>

                        <select
                        value={p.moneda || tipoMonedas[0]?.id || ""}
                        onChange={(e) => {
                            const updated = [...cobrosCuotas];
                            updated[cuotaIdx][idx].moneda = Number(e.target.value); // 🔹 convertir a número
                            setCobrosCuotas(updated);
                        }}
                        >
                        {tipoMonedas.map((m) => (
                            <option key={m.codigo} value={m.id}> {/* 🔹 usar id */}
                            {m.descripcion} ({m.simbolo})
                            </option>
                        ))}
                        </select>


                        <Input type="number" value={p.importe} onChange={(e) => { const updated = [...cobrosCuotas]; updated[cuotaIdx][idx].importe = Number(e.target.value); setCobrosCuotas(updated); }} />
                        <Input type="date" value={p.fecha} min={new Date().toISOString().split("T")[0]} onChange={(e) => { const updated = [...cobrosCuotas]; updated[cuotaIdx][idx].fecha = e.target.value; setCobrosCuotas(updated); }} />

                        <button type="button" onClick={() => handleDeleteCobroCuota(cuotaIdx, idx)} className="p-2 text-red-600 hover:bg-red-100 rounded"><Trash2 size={18} /></button>

                        {renderCamposCondicionales(p, idx, cobrosCuotas[cuotaIdx], (newList) => handleUpdateCobroCuota(cuotaIdx, newList))}
                      </div>
                    )) : null}

                    <Button variant="outline" onClick={() => handleAddCobroCuota(cuotaIdx)}>+ Agregar fila</Button>
                    <div className="text-sm text-gray-600 mt-2">Total de esta cuota: {calcTotalPorCuota(cobroList)}</div>
                  </TabsContent>
                ))}

                <div className="text-sm text-gray-600 mt-2">Total cargado: {totalCobrosCuotas}</div>
              </Tabs>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setStep(1)}>Atrás</Button>
              <Button onClick={handleFinalSubmit} disabled={!allComplete}>Confirmar</Button>
            </div>
          </div>
        )}
      </Dialog.Content>
    </Dialog.Root>
  )
}

import { useState, useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import axios from 'axios'
import { Input } from '@/Components/ui/input'
import { Card, CardHeader, CardContent } from '@/Components/ui/card'
import { ScrollArea } from '@/Components/ui/scroll-area'
import { Separator } from '@/Components/ui/separator'
import { cn } from '@/lib/utils'
import { Proveedor } from '@/types/Proveedor'
import { ComprobanteProveedor } from '@/types/ComprobanteProveedor'
import { Checkbox } from '@/Components/ui/checkbox'
import { Button } from '@/Components/ui/button'
import CuentaCorrienteModal from '../CuentaCorrienteProveedores'
import GenerarOrdenPagoModal from './GenerarOrdenPagoModal'
import { toast } from 'sonner'
import { formatCurrency, getImporteOrdenPago } from '@/lib/money'
import { useMoneyInput } from '@/hooks/useMoneyInput'

export default function Index() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [filtered, setFiltered] = useState<Proveedor[]>([])
  const [selected, setSelected] = useState<Proveedor | null>(null)
  const [facturas, setFacturas] = useState<ComprobanteProveedor[]>([])
  const [search, setSearch] = useState('')

  // monto ahora es string para evitar NaN
  const [seleccionadas, setSeleccionadas] = useState<
    { id: number; monedaOrden: number; total: number; monto: string }[]
  >([])

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginated = filtered.slice(startIndex, endIndex)


  const puedeGenerar =
  seleccionadas.length > 0 &&
  seleccionadas.every(f => {
    const num = Number(f.monto.replace('.', '').replace(',', '.')) || 0;
    const factura = facturas.find(x => x.id === f.id);
    if (!factura) return false;

    const total = (factura.detalles ?? []).reduce((acc, d) => acc + (Number(d.importe) || 0), 0);

    const pagado = (factura.ordenes_pago ?? [])
      .filter(op => op.estado === "Confirmado")
      .reduce((acc, op) => acc + getImporteOrdenPago(op), 0);

    const saldo = total - pagado;

    const pendientes = (factura.ordenes_pago ?? [])
      .filter(op => op.estado === "Pendiente")
      .reduce((acc, op) => acc + getImporteOrdenPago(op), 0);

    const maxPagar = saldo - pendientes;

    return !!f.monto && num > 0 && num <= maxPagar;
  });


    useEffect(() => {
    const fetchProveedores = async () => {
        const res = await axios.get('/contabilidad/proveedoresListado')
        const lista = res.data

        // Ordenar: saldo primero, luego alfabético
        const ordenados = lista.sort((a: any, b: any) => {
        // 1️⃣ Primero por saldo (los que tienen saldo > 0 van arriba)
        if (a.saldo > 0 && b.saldo === 0) return -1
        if (a.saldo === 0 && b.saldo > 0) return 1

        // 2️⃣ Segundo criterio: orden alfabético
        return a.razon_social.localeCompare(b.razon_social)
        })

        setProveedores(ordenados)
        setFiltered(ordenados)
    }

    fetchProveedores()
    }, [])


  useEffect(() => {
    const lower = search.toLowerCase()
    setFiltered(
      proveedores.filter(
        p =>
          p.nombre_fantasia.toLowerCase().includes(lower) ||
          p.razon_social.toLowerCase().includes(lower)
      )
    )
    setCurrentPage(1)
  }, [search, proveedores])

  useEffect(() => {
    if (selected) {
      const fetchFacturas = async () => {
        const res = await axios.get(`/contabilidad/${selected.id}/pendientes`)
        setFacturas(res.data)
        setSeleccionadas([])
      }
      fetchFacturas()
    } else {
      setFacturas([])
    }
  }, [selected])



    const toggleFactura = (facturaId: number, total: number, monedaId: number, maxPagar: number) => {
    setSeleccionadas(prev => {
        const exists = prev.find(f => f.id === facturaId);

        if (exists) return prev.filter(f => f.id !== facturaId);

        // monto por defecto: saldo - pendientes
        const montoDefault = maxPagar.toFixed(2).replace('.', ',');

        return [
        ...prev,
        {
            id: facturaId,
            monedaOrden: monedaId,
            total,
            monto: montoDefault
        }
        ];
    });
    };


  const actualizarMonto = (facturaId: number, monto: string) => {
    setSeleccionadas(prev =>
      prev.map(f => (f.id === facturaId ? { ...f, monto } : f))
    )
  }

    //helper para los decimales
    const round2 = (n: number) =>
    Math.round((Number(n) + Number.EPSILON) * 100) / 100

    const totalPagar = seleccionadas.reduce((acc, f) => {
        const num = Number(f.monto.replace('.', '').replace(',', '.')) || 0
        return acc + num
    }, 0)

    const [open, setOpen] = useState(false)
    const [modalPagoVisible, setModalPagoVisible] = useState(false)

    const handleClosePago = async (updated?: boolean) => {
        setModalPagoVisible(false)
        if (!updated) return

        if (selected) {
        const res = await axios.get(`/contabilidad/${selected.id}/pendientes`)
        setFacturas(res.data)
        }

        const resProv = await axios.get('/contabilidad/proveedoresListado')
        setProveedores(resProv.data)
        setFiltered(resProv.data)

        toast.success('Datos actualizados')
    }

    const handleGenerarOrdenPago = (data: any) => {

    }

  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Contabilidad</h2>}
    >
      <Head title="Contabilidad" />

      <div className="flex h-[calc(100vh-100px)] p-4 gap-4 overflow-hidden">

        {/* IZQUIERDA */}
        <Card className="w-1/3 flex flex-col overflow-hidden">
          <CardHeader>
            <Input
              placeholder="Buscar proveedor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1">
              {paginated.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={cn(
                    'flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 border-b',
                    selected?.id === p.id && 'bg-gray-200 font-semibold'
                  )}
                >
                  <span>{p.padron?.documento} - {p.nombre_fantasia}</span>
                  <span className="text-sm text-gray-700">${round2(p.saldo ?? 0.00)}</span>
                </div>
              ))}
            </ScrollArea>

            {totalPages > 1 && (
              <div className="flex justify-between items-center p-2 border-t bg-gray-50">
                <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                  Anterior
                </Button>
                <span className="text-sm">Página {currentPage} de {totalPages}</span>
                <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                  Siguiente
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Separator orientation="vertical" />

        {/* DERECHA */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader>
            <h3 className="text-lg font-semibold">
              {selected
                ? `Facturas pendientes de ${selected.nombre_fantasia}`
                : 'Seleccioná un proveedor'}
            </h3>
            <Button variant="outline" onClick={() => setOpen(true)}>
                Ver cuenta corriente
            </Button>

          </CardHeader>

          <CardContent className="flex-1 overflow-auto">

            {!selected && <p className="text-gray-500">Seleccioná un proveedor.</p>}

            {selected && facturas.length === 0 && (
              <p className="text-gray-500">No hay facturas pendientes.</p>
            )}

            {selected && facturas.length > 0 && (
              <>
                <div className="overflow-auto mt-2 border rounded">
                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="p-2 text-center"></th>
                        <th className="text-left p-2">Tipo</th>
                        <th className="text-left p-2">Factura</th>
                        <th className="text-left p-2">Fecha</th>
                        <th className="text-right p-2">Total Factura</th>
                        <th className="text-right p-2">Pagado</th>
                        <th className="text-right p-2">Saldo</th>
                        <th className="text-right p-2">A Saldar</th>
                        <th className="text-right p-2">A Pagar</th>
                      </tr>
                    </thead>

                    <tbody>
                   {facturas.map(f => {
                        // ➜ SIGNO DEL TIPO DE COMPROBANTE
                        const signo = f.tipo_comprobante?.signo === "haber" ? -1 : 1;

                        const total = (f.detalles ?? []).reduce(
                            (acc, d) => acc + signo * (Number(d.importe) || 0),
                            0
                        );

                        // SOLO ORDENES DE PAGO CONFIRMADAS
                        const pagado = (f.ordenes_pago ?? [])
                            .filter(op => op.estado === "Confirmado")
                            .reduce((acc, op) => acc + getImporteOrdenPago(op), 0);

                                                // SOLO ORDENES DE PAGO CONFIRMADAS
                        const comprobantesAplicados = (f.comprobantes_aplicados ?? [])
                            .reduce((acc, ca) => acc + (Number(ca.pivot.importe_aplicado) || 0), 0);

                        // SALDO FINAL
                        const saldo = total + pagado - comprobantesAplicados;


                        const selectedFactura = seleccionadas.find(sel => sel.id === f.id);

                        const pendientes = (f.ordenes_pago ?? [])
                        .filter(op => op.estado === "Pendiente")
                        .reduce((acc, op) => acc + getImporteOrdenPago(op), 0);

                        const aSaldar = pendientes;

                        // monto permitido:
                        const maxPagar = saldo - aSaldar;

                        return (
                        <tr key={f.id} className="border-b hover:bg-gray-50">
                            <td className="p-2 text-center">
                            <Checkbox
                                checked={!!selectedFactura}
                                onCheckedChange={() => toggleFactura(f.id, total, f.moneda_id, maxPagar)}
                            />
                            </td>

                            <td className="p-2">{f.tipo_comprobante?.nombre}</td>
                            <td className="p-2">{f.punto_venta}-{f.numero_factura}</td>
                            <td className="p-2">{new Date(f.fecha_factura).toLocaleDateString()}</td>

                            {/* TOTAL */}
                            <td className="p-2 text-right">
                            {formatCurrency(total, f.tipo_moneda?.codigo)}
                            </td>

                            {/* PAGADO */}
                            <td className="p-2 text-right">
                            {formatCurrency(pagado, f.tipo_moneda?.codigo)}
                            </td>

                            {/* SALDO */}
                            <td className="p-2 text-right">
                            {formatCurrency(saldo, f.tipo_moneda?.codigo)}
                            </td>

                            {/* A SALDAR */}
                            <td className="p-2 text-right">
                            {formatCurrency(aSaldar, f.tipo_moneda?.codigo)}
                            </td>

                            {/* A PAGAR */}
                            <td className="p-2 text-right">
                            <Input
                                className="w-28 text-right"
                                disabled={!selectedFactura}
                                value={selectedFactura?.monto || ""}
                                placeholder="0,00"
                                onChange={e => {
                                let v = e.target.value.replace(/[^\d,]/g, "");

                                const num = Number(v.replace('.', '').replace(',', '.')) || 0;

                                if (num > maxPagar) {
                                    // Limitar al máximo permitido
                                    v = maxPagar.toFixed(2).replace('.', ',');
                                }

                                actualizarMonto(f.id, v);
                                }}
                                onBlur={() => {
                                const montoSel = seleccionadas.find(s => s.id === f.id);
                                if (!montoSel) return;

                                // Normalizar formato final: 0,00
                                let v = montoSel.monto;

                                if (!v || v === "") v = "0,00";

                                // Pasos de normalización
                                if (!v.includes(",")) v = v + ",00";

                                // Limitar a 2 decimales
                                const [ent, dec = ""] = v.split(",");
                                const dec2 = dec.padEnd(2, "0").slice(0, 2);

                                actualizarMonto(f.id, `${ent},${dec2}`);
                                }}
                            />
                            </td>
                        </tr>
                        );
                    })}
                    </tbody>

                  </table>
                </div>
              </>
            )}
          </CardContent>

          {seleccionadas.length > 0 && (
            <div className="border-t p-4 flex justify-between items-center">
              <span className="font-semibold">
                Total a pagar: {formatCurrency(totalPagar, 'ARS')}
              </span>

              <Button disabled={!puedeGenerar} onClick={() => setModalPagoVisible(true)}>
                Generar orden de pago
              </Button>
            </div>
          )}
        </Card>
      </div>

      <CuentaCorrienteModal open={open} onClose={() => setOpen(false)} proveedor={selected} />

      {modalPagoVisible && (
        <GenerarOrdenPagoModal
          open={modalPagoVisible}
          onClose={updated => handleClosePago(updated)}
          proveedorId={selected?.id || 0}
          facturasSeleccionadas={seleccionadas.map(f => ({
            id: f.id,
            monedaOrden: f.monedaOrden,
            total: f.total,
            montoAPagar: Number(f.monto.replace('.', '').replace(',', '.'))
          }))}
          facturasDetalle={facturas.filter(f =>
            seleccionadas.some(sel => sel.id === f.id)
          )}
          onSubmit={handleGenerarOrdenPago}
        />
      )}
    </AuthenticatedLayout>
  )
}

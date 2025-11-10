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

export default function Index() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [filtered, setFiltered] = useState<Proveedor[]>([])
  const [selected, setSelected] = useState<Proveedor | null>(null)
  const [facturas, setFacturas] = useState<ComprobanteProveedor[]>([])
  const [search, setSearch] = useState('')
  const [seleccionadas, setSeleccionadas] = useState<
    { id: number; monedaOrden: number; total: number; monto: number }[]
  >([])

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginated = filtered.slice(startIndex, endIndex)

  const puedeGenerar = seleccionadas.length > 0 && seleccionadas.every(f => f.monto > 0)

  useEffect(() => {
    const fetchProveedores = async () => {
      const res = await axios.get('/contabilidad/proveedoresListado')
      setProveedores(res.data)
      setFiltered(res.data)
    }
    fetchProveedores()
  }, [])

  useEffect(() => {
    const lower = search.toLowerCase()
    const filteredList = proveedores.filter(
      p =>
        p.nombre_fantasia.toLowerCase().includes(lower) ||
        p.razon_social.toLowerCase().includes(lower)
    )
    setFiltered(filteredList)
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

  const toggleFactura = (facturaId: number, total: number, monedaId: number) => {
    setSeleccionadas(prev => {
      const exists = prev.find(f => f.id === facturaId)
      if (exists) return prev.filter(f => f.id !== facturaId)
      return [...prev, { id: facturaId, monedaOrden: monedaId, total, monto: total }]
    })
  }

  const actualizarMonto = (facturaId: number, monto: number) => {
    setSeleccionadas(prev =>
      prev.map(f => (f.id === facturaId ? { ...f, monto: Number(monto) } : f))
    )
  }

  const totalPagar = seleccionadas.reduce((acc, f) => acc + f.monto, 0)

  const [open, setOpen] = useState(false)
  const [modalPagoVisible, setModalPagoVisible] = useState(false)

  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Contabilidad</h2>}
    >
      <Head title="Contabilidad" />

      <div className="flex h-[calc(100vh-100px)] p-4 gap-4 overflow-hidden">
        {/* 📋 Columna izquierda: Proveedores */}
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
                  <span>
                    {p.padron?.documento} - {p.nombre_fantasia}
                  </span>
                  <span className="text-sm text-gray-700">${p.saldo?.toFixed(2) ?? '0.00'}</span>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No se encontraron proveedores
                </p>
              )}
            </ScrollArea>

            {/* 🔹 Controles de paginación */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-2 border-t bg-gray-50">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  Anterior
                </Button>
                <span className="text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Separator orientation="vertical" />

        {/* 📑 Columna derecha: Facturas pendientes */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader>
            <h3 className="text-lg font-semibold">
              {selected
                ? `Facturas pendientes de ${selected.nombre_fantasia}`
                : 'Seleccioná un proveedor'}
            </h3>
          </CardHeader>

          <CardContent className="flex-1 overflow-auto">
            {selected ? (
              facturas.length > 0 ? (
                <>
                  <Button variant="outline" onClick={() => setOpen(true)}>
                    Ver cuenta corriente
                  </Button>

                  <div className="overflow-auto mt-2 border rounded">
                    <table className="w-full text-sm border-collapse">
                      <thead className="bg-gray-100 border-b">
                        <tr>
                          <th className="p-2 text-center"></th>
                          <th className="text-left p-2">Tipo</th>
                          <th className="text-left p-2">Factura</th>
                          <th className="text-left p-2">Fecha</th>
                          <th className="text-right p-2">Total</th>
                          <th className="text-right p-2">Pagado</th>
                          <th className="text-right p-2">Saldo</th>
                          <th className="text-right p-2">A pagar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {facturas.map(f => {
                          const total = (f.detalles ?? []).reduce(
                            (acc, d) => acc + (Number(d.importe) || 0),
                            0
                          )

                          const pagado = (f.ordenes_pago ?? []).reduce(
                            (acc, op) =>
                              acc + (Number(op.pivot?.importe_aplicado) || Number(op.importe) || 0),
                            0
                          )

                          const saldo = total - pagado
                          const selectedFactura = seleccionadas.find(sel => sel.id === f.id)

                          return (
                            <tr key={f.id} className="border-b hover:bg-gray-50">
                              <td className="p-2 text-center">
                                <Checkbox
                                  checked={!!selectedFactura}
                                  onCheckedChange={() =>
                                    toggleFactura(f.id, total, f.moneda_id)
                                  }
                                />
                              </td>
                              <td className="p-2">{f.tipo_comprobante?.nombre}</td>
                              <td className="p-2">
                                {f.punto_venta}-{f.numero_factura}
                              </td>
                              <td className="p-2">
                                {new Date(f.fecha_factura).toLocaleDateString()}
                              </td>
                              <td className="p-2 text-right">${total.toFixed(2)}</td>
                              <td className="p-2 text-right">${pagado.toFixed(2)}</td>
                              <td className="p-2 text-right">${saldo.toFixed(2)}</td>

                              <td className="p-2 text-right">
                                <Input
                                  type="number"
                                  className="w-28 text-right"
                                  value={
                                    selectedFactura
                                      ? selectedFactura.monto.toFixed(2)
                                      : ''
                                  }
                                  onChange={e => {
                                    let valor = Number(e.target.value)
                                    if (valor > saldo) valor = saldo
                                    actualizarMonto(f.id, valor)
                                  }}
                                  disabled={!selectedFactura}
                                  placeholder="0.00"
                                  min={0}
                                  max={saldo}
                                />
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">No hay facturas pendientes.</p>
              )
            ) : (
              <p className="text-gray-500">Seleccioná un proveedor de la lista.</p>
            )}
          </CardContent>

          {seleccionadas.length > 0 && (
            <div className="border-t p-4 flex justify-between items-center">
              <span className="font-semibold">
                Total a pagar: ${totalPagar.toFixed(2)}
              </span>
              <Button
                disabled={!puedeGenerar}
                onClick={() => setModalPagoVisible(true)}
              >
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
          onClose={() => setModalPagoVisible(false)}
          proveedorId={selected?.id || 0}
          facturasSeleccionadas={seleccionadas.map(f => ({
            id: f.id,
            monedaOrden: f.monedaOrden,
            total: f.total,
            montoAPagar: f.monto
          }))}
          facturasDetalle={facturas.filter(f =>
            seleccionadas.some(sel => sel.id === f.id)
          )}
        />
      )}
    </AuthenticatedLayout>
  )
}

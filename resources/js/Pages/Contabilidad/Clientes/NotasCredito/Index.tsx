import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Textarea } from "@/Components/ui/textarea"
import { Combobox } from "@/Components/ui/combobox"
import axios from 'axios';
import { toast } from 'sonner';
import { Popover,PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Command,CommandInput,CommandEmpty, CommandItem, CommandList } from '@/Components/ui/command';
import { formatFechaAR } from '@/utils/formatterFunctions';

export default function Index() {



    const { clientes,impuestos } = usePage().props as any;
    const [facturas, setFacturas] = useState<any[]>([])
    const [loadingFacturas, setLoadingFacturas] = useState(false)
    const [facturaSeleccionada, setFacturaSeleccionada] = useState<any | null>(null)
    const [items, setItems] = useState<any[]>([])


    const [clienteId, setClienteId] = useState<string>("")
    const [facturaId, setFacturaId] = useState<string>("")
    const [tipo, setTipo] = useState<"total" | "parcial">("parcial")
    const [fecha, setFecha] = useState<string>("")
    const [fechaVencimiento, setFechaVencimiento] = useState<string>("")
    const [observacion, setObservacion] = useState<string>("")

    const [motivosNC, setMotivosNC] = useState<any[]>([])
    const [motivoNCId, setMotivoNCId] = useState<string>("")

    const [condicionVenta, setCondicionVenta] = useState<any[]>([])
    const [condicionVentaId, setCondicionVentaId] = useState<string>("")


  ///////////USEEFFECT
  // Obtener facturas cuando cambie el cliente
  useEffect(() => {
    if (!clienteId) {
        setFacturas([])
        return
    }

    setLoadingFacturas(true)

    fetch(`/contabilidad/clientes/${clienteId}/facturas`)
        .then(res => res.json())
        .then(data => {
        setFacturas(data)
        })
        .finally(() => setLoadingFacturas(false))

    }, [clienteId])

    // Obtener items cuando cambie la factura
    useEffect(() => {
        if (!facturaId) {
            setFacturaSeleccionada(null)
            setItems([{
            producto_id: null,
            descripcion: "",
            modelo: "",
            unidad_medida_id: "",
            unidad_medida: "",
            cantidad: 1,
            precio_unitario: 0,
            porcentaje_descuento: 0,
            impuestos_seleccionados: [],   // 🔴 CLAVE
            subtotal: 0,
            importe: 0,
            co_cuenta_id: null
            }])

            return
        }

        const factura = facturas.find(f => f.id.toString() === facturaId)
        if (!factura) return

        setFacturaSeleccionada(factura)
        // Mapear detalles de factura → items NC
        const detallesMapeados = factura.detalles.map((d: any) => {
        const cantidad = Number(d.cantidad)
        const precio = Number(d.precio_unitario)
        const descuento = Number(d.porcentaje_descuento || 0)

        const bruto = cantidad * precio
        const montoDescuento = bruto * (descuento / 100)
        const subtotal = bruto - montoDescuento

        return {
            producto_id: d.producto_id,
            cantidad,
            precio_unitario: precio,
            modelo: d.modelo,
            descripcion: d.descripcion,
            unidad_medida_id: d.unidad_medida.id,
            unidad_medida: d.unidad_medida.codigo,
            porcentaje_descuento: descuento,
            impuestos_seleccionados: d.impuestos_seleccionados || [],
            subtotal,
            importe: Number(d.importe), // o subtotal si querés recalcular
            co_cuenta_id: d.co_cuenta_id
        }
        })

        setItems(detallesMapeados)


        // Si hay factura, por defecto NC total
        setTipo("total")

    }, [facturaId])

    // Obtener motivos NC cuando cargue la página
    useEffect(() => {
        fetch('/contabilidad/motivos-nota-credito')
        .then(res => res.json())
        .then(data => setMotivosNC(data))
    }, [])

    // Obtener condiciones venta cuando cargue la página
    useEffect(() => {
        fetch('/condiciones-venta')
        .then(res => res.json())
        .then(data => setCondicionVenta(data))
    }, [])

    const total = items.reduce(
    (acc, i) => acc + i.importe,
    0
    )

    const updateItem = (idx: number, field: string, value: any) => {
        const copy = [...items]
        const actualizado = {
            ...copy[idx],
            [field]: value
        }

        copy[idx] = recalcularItem(actualizado)
        setItems(copy)
    }

    // AÑADIR UN NUEVO ITEM
    /*const addItem = () => {
    setItems([
        ...items,
        {
        producto_id: null,
        descripcion: "Nuevo ítem",
        cantidad: 1,
        precio_unitario: 0,
        porcentaje_descuento: 0,
        subtotal: 0,
        importe_total: 0
        }
    ])
    }*/

    // RECALCULAR SUBTOTAL Y TOTAL DE UN ITEM
    const recalcularItem = (item: any) => {
    const cantidad = Number(item.cantidad) || 0
    const precio = Number(item.precio_unitario) || 0
    const descuento = Number(item.porcentaje_descuento) || 0

    const bruto = cantidad * precio
    const montoDescuento = bruto * (descuento / 100)
    const subtotal = bruto - montoDescuento

    const impuestosMonto = calcularImpuestos(
        subtotal,
        item.impuestos_seleccionados || []
    )

    const importe = subtotal + impuestosMonto

    return {
        ...item,
        subtotal,
        impuestos_monto: impuestosMonto,
        importe
    }
    }


    // CALCULAR TOTAL DE UNA FACTURA
    const totalFactura = (factura: any) => {
    if (!factura || !factura.detalles) return 0

    return factura.detalles.reduce(
        (acc: number, d: any) => acc + Number(d.importe),
        0
    )
    }

    //TOTAL DE LOS PAGOS
    const totalPagos = (factura: any) =>
    (factura.ordenes_tesoreria || []).reduce(
        (acc: number, p: any) => acc + Number(p.importe),
        0
    )
    //TOTAL DE LA NOTA DE CREDITO
    const totalNotasCredito = (factura: any) =>
    (factura.comprobantes_aplicados || []).reduce(
        (acc: number, nc: any) => acc + Number(nc.importe),
        0
    )
    //SALDO PENDIENTE
    const saldoPendiente = (factura: any) => {
    const total = totalFactura(factura)
    const pagos = totalPagos(factura)
    const notasCredito = totalNotasCredito(factura)

    return total - pagos - notasCredito
    }
    //VALIDAR NC VS SALDO
    const excedeSaldo =
    tipo === "parcial" &&
    facturaSeleccionada &&
    total >= totalFactura(facturaSeleccionada)

    // VALIDAR FORMULARIO
    const formInvalido =
    !clienteId ||
    !facturaId ||
    !fecha ||
    !fechaVencimiento ||
    !condicionVentaId ||
    !motivoNCId ||
    excedeSaldo


    // Manejar envío del formulario
    const handleSubmit = async () => {
    if (formInvalido) return

    const payload = {
        cliente_id: clienteId,
        factura_id: facturaId,
        fecha: fecha,
        fecha_vencimiento: fechaVencimiento,
        tipo,
        condicion_venta_id: condicionVentaId,
        motivo_nota_credito_id: motivoNCId,
        observaciones: observacion,
        detalles: items,
        total_factura: totalFactura(facturaSeleccionada)
    }

    try {
        const { data } = await axios.post(
        '/contabilidad/notas-credito',
        payload
        )

        toast.success("Nota de crédito emitida correctamente");
        setItems([])
        setObservacion("")
        setTipo("total")
        setCondicionVentaId("")
        setMotivoNCId("")
        setFecha("")
        setFechaVencimiento("")
        setFacturaId("")
        setClienteId("")



    } catch (error: any) {
        console.error(error)

        if (error.response?.status === 422) {
        // validaciones backend
        alert('Hay errores de validación. Revisá los datos ingresados.')
        console.log(error.response.data.errors)
        } else {
        alert('Ocurrió un error al emitir la nota de crédito')
        }
    }
    }


    const calcularImpuestos = (subtotal: number, impuestosSeleccionados: number[]) => {
    return impuestosSeleccionados.reduce((acc, impuestoId) => {
        const imp = impuestos.find((i: any) => i.id === impuestoId)
        if (!imp) return acc

        return acc + subtotal * (Number(imp.porcentaje) / 100)
    }, 0)
    }



    return (

        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Notas de Crédito</h2>}>
        <Head title="Notas de Crédito" />

        <div className="max-w-6xl mx-auto space-y-6 mt-6">
            <h1 className="text-2xl font-semibold">Nota de Crédito – Cliente</h1>

            {/* Datos generales */}
            <Card>
                <CardContent className="grid grid-cols-1 gap-4 pt-6">

                {/* Cliente */}
                <div className="col-span-3">
                <label className="text-sm">Cliente</label>
                <Combobox
                    value={clienteId}
                    onValueChange={(val) => {
                    setClienteId(val)
                    setFacturaId("") // resetea factura al cambiar cliente
                    }}
                    placeholder="Seleccionar cliente"
                    options={clientes.map((c: any) => ({
                    label: c.padron.documento
                        ? `${c.apellido} - ${c.nombre} - ${c.padron.documento}`
                        : c.nombre || c.apellido,
                    value: c.id.toString()
                    }))}
                />
                </div>

                <div>
                    <label className="text-sm">Factura asociada</label>
                    <Combobox
                        value={facturaId}
                        onValueChange={setFacturaId}
                        placeholder={
                        loadingFacturas
                            ? "Cargando facturas..."
                            : "Seleccionar factura"
                        }
                        options={facturas.map(f => ({
                        label: `${f.tipo_comprobante.nombre} - ${f.punto_venta} - ${f.numero_factura} - ${f.descripcion} - ${formatFechaAR(f.fecha_factura)}`,
                        value: f.id.toString()
                        }))}
                        disabled={!clienteId || loadingFacturas}
                    />
                </div>

                <div>
                    <label className="text-sm">Fecha Nota Crédito</label>
                    <Input
                    type="date"
                    value={fecha}
                    onChange={e => setFecha(e.target.value)}
                    />
                </div>

                <div>
                <label className="text-sm">Tipo</label>
                <Combobox
                    value={tipo}
                    onValueChange={v => setTipo(v as any)}
                    placeholder="Tipo"
                    options={[
                    { label: "Parcial", value: "parcial" },
                    { label: "Total", value: "total" }
                    ]}
                />
                </div>

                <div className="col-span-1">
                <label className="text-sm">Motivo de la Nota de Crédito</label>
                <Combobox
                    value={motivoNCId}
                    onValueChange={setMotivoNCId}
                    placeholder="Seleccionar motivo"
                    options={motivosNC.map(m => ({
                    label: m.descripcion,
                    value: m.id.toString()
                    }))}
                />
                </div>

                <div className="col-span-1">
                    <label className="text-sm">Fecha Venc.</label>
                    <Input
                    type="date"
                    value={fechaVencimiento}
                    onChange={e => setFechaVencimiento(e.target.value)}
                    />
                </div>


                <div className="col-span-1">
                <label className="text-sm">Condición de Venta</label>
                <Combobox
                    value={condicionVentaId}
                    onValueChange={setCondicionVentaId}
                    placeholder="Seleccionar condición de venta"
                    options={condicionVenta.map(m => ({
                    label: m.nombre,
                    value: m.id.toString()
                    }))}
                />
                </div>

                <div className="col-span-3">
                <label className="text-sm">Observaciones</label>
                <Textarea
                    placeholder="Detalle adicional u observaciones internas"
                    value={observacion}
                    onChange={e => setObservacion(e.target.value)}
                />
                </div>


            </CardContent>
        </Card>



        {/* Detalle */}
        <Card>
            <CardContent className="pt-6 space-y-4">

                {facturaSeleccionada && (
                <div className="text-sm text-muted-foreground">
                    Factura {facturaSeleccionada.punto_venta}-{facturaSeleccionada.numero_factura} ·
                    Fecha {facturaSeleccionada.fecha_factura.slice(0,10)} ·
                    Total ${facturaSeleccionada.detalles
                    .reduce((acc: number, d: any) => acc + Number(d.importe), 0)
                    .toFixed(2)}
                </div>
                )}

                <h2 className="font-medium">Detalle</h2>

                <div className="grid grid-cols-14 gap-2 text-xs font-medium text-muted-foreground border-b pb-2">
                    <div className="col-span-2 text-left">Producto / Descripción</div>
                    <div className="col-span-1 text-left">Modelo</div>
                    <div className="col-span-1 text-left">Observacion</div>
                    <div className="col-span-1 text-left">U.Medida</div>
                    <div className="col-span-1 text-left">Cant.</div>
                    <div className="col-span-1 text-left">Precio</div>
                    <div className="col-span-1 text-left">% Desc.</div>
                    <div className="col-span-3 text-left">Impuestos</div>
                    <div className="col-span-1 text-left">Subtotal</div>
                    <div className="col-span-1 text-left">Importe NC</div>
                    <div className="col-span-1"></div>
                </div>

                {items.map((item, idx) => (

                <div key={idx} className="grid grid-cols-14 gap-2 text-sm items-center">
                    <Input
                    className="col-span-2 "
                    value={item.descripcion}
                    disabled
                    />

                    <Input
                    className="col-span-1"
                    value={item.modelo}
                    disabled
                    />

                    <Input
                    className="col-span-1"
                    value={item.descripcion}
                    disabled
                    />

                    <Input
                    className="col-span-1"
                    value={item.unidad_medida}
                    disabled
                    />

                    <Input
                    className="col-span-1 text-right"
                    type="number"
                    value={item.cantidad}
                    disabled={tipo === "total"}
                    onChange={e => updateItem(idx, "cantidad", Number(e.target.value))}
                    />

                    <Input
                    className="col-span-1 text-right"
                    type="number"
                    value={item.precio_unitario}
                    disabled={tipo === "total"}
                    onChange={e => updateItem(idx, "precio_unitario", Number(e.target.value))}
                    />

                    <Input
                    className="col-span-1 text-right"
                    type="number"
                    value={item.porcentaje_descuento}
                    disabled={tipo === "total"}
                    onChange={e => updateItem(idx, "porcentaje_descuento", Number(e.target.value))}
                    />

                    <Popover >
                    <PopoverTrigger asChild className="col-span-3 text-right">
                        <Button variant="outline" className="w-full justify-start">
                        {item.impuestos_seleccionados.length
                            ? impuestos
                                .filter((i:any) => item.impuestos_seleccionados.includes(i.id))
                                .map((i:any) => i.descripcion)
                                .join(', ')
                            : 'Seleccionar impuestos'}
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-[250px] p-2">
                        <Command>
                        <CommandInput placeholder="Buscar impuesto..." />
                        <CommandList>
                            <CommandEmpty>No hay coincidencias.</CommandEmpty>

                            {impuestos.map((i: any) => {
                            const seleccionado = item.impuestos_seleccionados.includes(i.id)

                            return (
                                <CommandItem
                                key={i.id}
                                onSelect={() => {
                                    let nuevos = [...item.impuestos_seleccionados]
                                    if (seleccionado) {
                                    nuevos = nuevos.filter(id => id !== i.id)
                                    } else {
                                    nuevos.push(i.id)
                                    }
                                    updateItem(idx, 'impuestos_seleccionados', nuevos)
                                }}
                                >
                                <input
                                    type="checkbox"
                                    checked={seleccionado}
                                    readOnly
                                    className="mr-2"
                                />
                                {i.descripcion} ({i.porcentaje}%)
                                </CommandItem>
                            )
                            })}
                        </CommandList>
                        </Command>
                    </PopoverContent>
                    </Popover>



                    <Input
                    className="col-span-1 text-right"
                    value={item.subtotal}
                    disabled
                    />

                    <Input
                    className="col-span-1 font-medium text-right"
                    value={item.importe}
                    disabled
                    />

                    {tipo === "parcial" && (
                    <Button
                        variant="ghost"
                        className="col-span-1 text-red-500"
                        onClick={() => setItems(items.filter((_, i) => i !== idx))}
                    >
                        ✕
                    </Button>
                    )}

                </div>

                ))}

            {/* tipo === "parcial" && (
               <Button variant="outline" onClick={addItem}>
                + Agregar ítem
                </Button>
            )*/}

            </CardContent>
        </Card>

        {/* Totales */}
        <Card>
            <CardContent className="flex justify-between items-center pt-6">
            <div className="text-sm text-muted-foreground">
                Impacto: reduce saldo del cliente
            </div>
            <div className="text-xl font-semibold">
                Total NC: ${total.toFixed(2)}
            </div>
            </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex justify-end gap-2">
            {excedeSaldo && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
                ⚠️ El importe de la nota de crédito (${total.toFixed(2)}) debe ser menor al de la factura (${saldoPendiente(facturaSeleccionada).toFixed(2)}).
            </div>
            )}

            <Button variant="outline">Cancelar</Button>
            <Button disabled={formInvalido} onClick={handleSubmit}>
                Emitir Nota de Crédito
            </Button>

        </div>
        </div>


        </AuthenticatedLayout>
    )
    }

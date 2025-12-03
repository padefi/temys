import React, { useState, useEffect, useMemo } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Button } from "@/Components/ui/button"
import { Textarea } from "@/Components/ui/textarea"
import { TipoMoneda } from "@/types/TipoMoneda"
import { Typography } from "@/Components/ui/typography"
import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow
} from "@/Components/ui/table"
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/Components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/Components/ui/dropdown-menu"
import { Popover, PopoverTrigger, PopoverContent } from "@/Components/ui/popover"
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from "@/Components/ui/command"
import { router, usePage } from "@inertiajs/react"
import { ProductosDisponibles } from "@/types/Producto"
import { OrdenesCompra } from "@/types/OrdenCompra"
import axios from "axios"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@radix-ui/react-alert-dialog"
import { AlertDialogFooter, AlertDialogHeader } from "@/Components/ui/alert-dialog"
import { Archivo } from "@/types/Archivos"



type ProductoEditable = {
  id: number
  producto_id: number
  entrega_esperada: Date
  nombre: string
  descripcion: string
  modelo_descripcion: string
  subcategoria_descripcion: string
  co_cuenta_id?: number
  co_cuenta_descripcion?: string
  codigo_barras: string
  referencia: string
  cantidad: number
  precio_unitario: number
  impuestos_seleccionados: number[]
  porcentaje_descuento: number
  importe: number
  usuario_id: number
  _precio_editado?: boolean
  _importe_editado?: boolean
}

type Props = {
 auth: { user: { id: number; name: string; email: string } }
  /*productos: ProductosDisponibles[]*/
  detalles?: any[]
  open: boolean
  onClose: () => void
  totalOrden: number
  monedaOrden: number | null
  tipoMonedas: TipoMoneda[]
  proveedorId: number
  onSubmit: (data: any) => void
  co_cuentas: { id: number; codigo: string; descripcion: string }[]
  impuestos: { id: number; descripcion: string; porcentaje: number }[]
  productos: ProductoEditable[]
  ordenCompra?: OrdenesCompra
  estadoOrden: number | string
  setProductosValidosFactura: (valid: boolean) => void
  setProductos: (productos: ProductoEditable[]) => void

}

export default function GenerarFacturaModal({
  open,
  onClose,
  onSubmit,
  totalOrden,
  monedaOrden,
  proveedorId,
  tipoMonedas,
  estadoOrden,
  detalles,
  productos,
  impuestos,
  ordenCompra,
  co_cuentas,
  setProductos,
  setProductosValidosFactura,

}: Props) {
    const { auth, productos: productosDisponibles = [], } = usePage().props
    const [productosLocal, setProductosLocal] = useState<ProductoEditable[]>([])

    const [tiposComprobante, setTiposComprobante] = useState<{id:number, nombre:string}[]>([])
    const [condicionesVenta, setCondicionesVenta] = useState<{id:number, nombre:string}[]>([])



    useEffect(() => {
        axios.get("/tipos-comprobantes")
        .then(res => setTiposComprobante(res.data))
        .catch(err => console.error("Error cargando tipos de comprobante", err))

        axios.get("/condiciones-venta")
        .then(res => setCondicionesVenta(res.data))
        .catch(err => console.error("Error cargando condiciones de venta", err))
    }, [])

    // 🧩 Inicializa productos locales desde detalles (si existen)
    useEffect(() => {
        if (detalles && detalles.length > 0) {
        const iniciales = detalles.map(det => ({
            id: det.id,
            producto_id: det.producto_id,
            entrega_esperada: new Date(det.entrega_esperada),
            nombre: det.producto?.nombre || "",
            descripcion: det.descripcion || "",
            modelo_descripcion: det.producto?.modelo?.descripcion || "",
            subcategoria_descripcion: det.producto?.sub_categoria?.descripcion || "",
            co_cuenta_id:  undefined,
            co_cuenta_descripcion: "",
            codigo_barras: det.producto?.codigo_barras || "",
            referencia: det.producto?.referencia || "",
            cantidad: det.cantidad || 0,
            precio_unitario: +det.precio_unitario || 0,
            impuestos_seleccionados: det.impuestos ? det.impuestos.map((i: any) => i.id) : [],
            porcentaje_descuento: +det.porcentaje_descuento || 0,
            importe: +det.importe || 0,
            usuario_id: auth.user.id,
        }))
        setProductosLocal(iniciales)
        } else {
        setProductosLocal(productos)
        }
    }, [detalles, open])

    // Actualiza productos y validez
        useEffect(() => {
            setProductos(productosLocal)
            const todosValidos = productosLocal.length > 0 &&
                productosLocal.every(p =>
                p.producto_id > 0 &&
                p.descripcion.trim() !== '' &&
                p.cantidad > 0 &&
                p.precio_unitario > 0
                )
            setProductosValidosFactura(todosValidos)


        }, [productosLocal])

    // 🧾 Campos de factura
    const [fechaFactura, setFechaFactura] = useState("")
    const [fechaVencimiento, setFechaVencimiento] = useState("")
    const [puntoVenta, setPuntoVenta] = useState("")
    const [numeroFactura, setNumeroFactura] = useState("")
    const [tipoComprobante, setTipoComprobante] = useState("")
    const [condicionVenta, setCondicionVenta] = useState("")

    const [tipoFactura, setTipoFactura] = useState("")
    const [estadoFactura, setEstadoFactura] = useState("")
    const [descripcion, setDescripcion] = useState("")

    const [columnasVisibles, setColumnasVisibles] = useState({
        entrega_esperada: false,
        descripcion: true,
        modelo: false,
        subcategoria: false,
        codigo_barras: false,
        referencia: false,
        cantidad: true,
        precio_unitario: true,
        impuestos: true,
        porcentaje_descuento: true,
        importe: true,
        co_cuenta: true,
    })


    // 🔍 Validación de campos obligatorios
    const camposCompletos = useMemo(() => {
    return (
        !!fechaFactura &&
        !!numeroFactura &&
        !!puntoVenta &&
        !!tipoComprobante &&
        !!condicionVenta &&
        productosLocal.length > 0 &&
        productosLocal.every(
        p => p.cantidad > 0 && p.precio_unitario > 0 && p.co_cuenta_id > 0
        )
    )
    }, [fechaFactura, numeroFactura, puntoVenta, tipoComprobante, condicionVenta, productosLocal])


    const handleSubmit = async () => {
        if (!camposCompletos) {
            toast.error("Debes completar todos los campos obligatorios, incluida la cuenta contable de cada producto.")
            return
        }


        if (productosLocal.some(p => !p.co_cuenta_id)) {
            toast.error("Todos los productos deben tener una cuenta contable asignada antes de guardar la factura.")
            return
        }

        try {
            const payload = {
            proveedor_id: proveedorId,
            fecha_factura: fechaFactura,
            fecha_vencimiento: fechaVencimiento,
            punto_venta: puntoVenta,
            numero_factura: numeroFactura,
            tipo_comprobante_id: tiposComprobante.find(tc => tc.nombre === tipoComprobante)?.id || null,
            condicion_venta_id: condicionesVenta.find(cv => cv.nombre === condicionVenta)?.id || null,
            descripcion,
            estado: "Pendiente",
            moneda_id: monedaOrden,
            usuario_creacion: auth.user.id,
            orden_compra_id: [ordenCompra?.id],
            detalles: productosLocal.map(p => ({
                descripcion: p.descripcion,
                modelo: p.modelo_descripcion,
                producto_id: p.producto_id,
                unidad_medida_id: 1,
                cantidad: p.cantidad,
                precio_unitario: p.precio_unitario,
                porcentaje_descuento: p.porcentaje_descuento,
                co_cuenta_id: p.co_cuenta_id,
                importe: p.importe,
                usuario_creacion: auth.user.id,
                impuestos: p.impuestos_seleccionados,
            })),
            totalOrden : totalOrden,
            }

            const res = await axios.post("/compras/ordenes-compras/comprobantes-proveedores", payload)

            if (res.status === 201) {
            toast.success("Factura generada exitosamente")
            onSubmit(res.data)
            onClose()
            }
        } catch (error: any) {
            // 🧩 Si el backend envía un mensaje claro (como en tu caso)
            const backendMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Error al guardar la factura.";

            toast.error(backendMessage);
        }
    }


    // 🧮 Cambios en los campos de productos
    const handleChangeCampo = (index: number, campo: keyof ProductoEditable, valor: any) => {
        const nuevos = [...productosLocal]
        const p = { ...nuevos[index], [campo]: valor }

        const totalImpuestos = impuestos
        .filter(i => p.impuestos_seleccionados.includes(i.id))
        .reduce((acc, i) => acc + i.porcentaje / 100, 0)
        const descuento = p.porcentaje_descuento / 100

        if (campo === "importe") {
        if (p.cantidad > 0) {
            p.precio_unitario = +(p.importe / (p.cantidad * (1 + totalImpuestos) * (1 - descuento))).toFixed(2)
            p._importe_editado = true
        }
        } else if (["cantidad", "precio_unitario"].includes(campo)) {
        if (!p._importe_editado) {
            p.importe = +(p.precio_unitario * p.cantidad * (1 + totalImpuestos) * (1 - descuento)).toFixed(2)
        } else if (p.cantidad > 0) {
            p.precio_unitario = +(p.importe / (p.cantidad * (1 + totalImpuestos) * (1 - descuento))).toFixed(2)
        }
        } else if (["porcentaje_descuento", "impuestos_seleccionados"].includes(campo)) {
        if (p._importe_editado && p.cantidad > 0) {
            p.precio_unitario = +(p.importe / (p.cantidad * (1 + totalImpuestos) * (1 - descuento))).toFixed(2)
        } else {
            p.importe = +(p.precio_unitario * p.cantidad * (1 + totalImpuestos) * (1 - descuento)).toFixed(2)
        }
        }

        nuevos[index] = p
        setProductosLocal(nuevos)
    }

    const agregarLinea = () => {
        setProductosLocal([
        ...productosLocal,
        {
            id: Date.now(),
            producto_id: 0,
            entrega_esperada: new Date(),
            nombre: '',
            descripcion: '',
            modelo_descripcion: '',
            subcategoria_descripcion: '',
            co_cuenta_descripcion: '',
            codigo_barras: '',
            referencia: '',
            cantidad: 0,
            precio_unitario: 0,
            impuestos_seleccionados: [],
            porcentaje_descuento: 0,
            importe: 0,
            usuario_id: auth.user.id
        }
        ])
    }

    const eliminarLinea = (id: number) => setProductosLocal(productosLocal.filter(p => p.id !== id))

    const handleChangeProducto = (index: number, value: string) => {
        const nuevos = [...productosLocal]
        const producto = productosDisponibles.find(p => p.nombre === value)
        if (producto) {
        nuevos[index] = {
            ...nuevos[index],
            producto_id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            modelo_descripcion: producto.modelo?.descripcion || '',
            subcategoria_descripcion: producto.sub_categoria?.descripcion || '',
            co_cuenta_id: producto.co_cuenta_id || undefined,
            co_cuenta_descripcion: producto.co_cuenta?.descripcion || '',
            codigo_barras: producto.codigo_barras || '',
            referencia: producto.referencia || ''
        }
        } else {
        nuevos[index].nombre = value
        }
        setProductosLocal(nuevos)
    }

    const handleEliminarProducto = (index: number) => {
        const nuevos = [...productosLocal]
        nuevos.splice(index, 1) // elimina el producto del array local
        setProductosLocal(nuevos)
    }

    // 🔢 Rellena con ceros a la izquierda hasta alcanzar la longitud indicada
    const padLeft = (value: string, length: number) => {
    if (!value) return "";
    return value.padStart(length, "0");
    };

    ////archivos adjuntos
    const [archivos, setArchivos] = useState<Archivo[]>([]);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState<Archivo | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    // 🚀 Subida de archivos
    const handleUploadFile = async (ordenId: number, archivo: File) => {
            const formData = new FormData()
            formData.append("archivo", archivo)

            router.post(`/compras/ordenes-compras/${ordenId}/archivoFactura`, formData, {
            forceFormData: true,
            onSuccess: () => toast.success(`Archivo ${archivo.name} subido con éxito`),
            onError: () => toast.error(`Error al subir ${archivo.name}`),
            })
    }

    ////////////Manejo de archivos adjuntos
        const handleArchivosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length || !ordenCompra?.id) return;

        const nuevosArchivos: Archivo[] = Array.from(e.target.files).map(f => ({
            nombre: f.name,
            file: f,
            mime: f.type,
            size: f.size,
        }));

        setArchivos(prev => [...prev, ...nuevosArchivos]);

        nuevosArchivos.forEach(a => handleUploadFile(ordenCompra.id!, a.file!));
        }

        const abrirModal = (archivo: Archivo) => {
        setArchivoSeleccionado(archivo);
        setModalVisible(true);
        };

        const cerrarModal = () => {
        setArchivoSeleccionado(null);
        setModalVisible(false);
        };

  return (
    <>
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl w-full max-w-7xl shadow-lg max-h-[90vh] overflow-auto">
        <Dialog.Title className="text-lg font-bold mb-4">📄 Cargar Factura</Dialog.Title>

        <Dialog.Close asChild>
          <button className="absolute top-3 right-3 p-1 rounded hover:bg-gray-200">
            <X size={20} />
          </button>
        </Dialog.Close>

        {/* FORMULARIO PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label>Proveedor <Typography>{ordenCompra?.proveedor?.razon_social || ""}</Typography></Label>

          </div>
          <div>
            <Label>Orden Compra N° <Typography>{ordenCompra?.id || ""}</Typography></Label>

          </div>
          <div>
            <Label>Fecha de Factura</Label>
            <Input type="date" value={fechaFactura} onChange={e => setFechaFactura(e.target.value)} />
          </div>
          <div>
            <Label>Fecha de Vencimiento</Label>
            <Input type="date" value={fechaVencimiento} onChange={e => setFechaVencimiento(e.target.value)} />
          </div>
          <div>
            <Label>Condición de Venta</Label>
            <Input
            list="condicionesVenta"
            value={condicionVenta}
            onChange={e => setCondicionVenta(e.target.value)}
            />
            <datalist id="condicionesVenta">
            {condicionesVenta.map(tc => (
                <option key={tc.id} value={tc.nombre} />
            ))}
            </datalist>
          </div>
          <div>
            <Label>Número de Factura</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                maxLength={4}
                placeholder="Pto Vta"
                value={puntoVenta}
                onChange={e => setPuntoVenta(e.target.value.replace(/\D/g, ""))}
                onBlur={() => setPuntoVenta(padLeft(puntoVenta, 4))}
              />
              <span className="text-2xl font-bold self-center">-</span>
              <Input
                type="text"
                maxLength={8}
                placeholder="N° Factura"
                value={numeroFactura}
                onChange={e => setNumeroFactura(e.target.value.replace(/\D/g, ""))}
                onBlur={() => setNumeroFactura(padLeft(numeroFactura, 8))}
              />
            </div>
          </div>
          <div>
            <Label>Tipo de Comprobante</Label>
            <Input
            list="comprobantes"
            value={tipoComprobante}
            onChange={e => setTipoComprobante(e.target.value)}
            />
            <datalist id="comprobantes">
            {tiposComprobante.map(tc => (
                <option key={tc.id} value={tc.nombre} />
            ))}
            </datalist>
          </div>


          <div className="md:col-span-2">
            <Label>Descripción / Observaciones</Label>
            <Textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          </div>
        </div>

        {/* 🧮 TABLA DE PRODUCTOS */}
         <Tabs defaultValue="productos" className="w-full">


      <TabsContent value="productos">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={agregarLinea}>Agregar línea</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Mostrar Columnas</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.entries(columnasVisibles).map(([col, visible]) => (
                <DropdownMenuCheckboxItem
                  key={col}
                  checked={visible}
                  onCheckedChange={() =>
                    setColumnasVisibles(prev => ({ ...prev, [col]: !prev[col as keyof typeof prev] }))
                  }
                >
                  {col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Table>
          <TableCaption>Productos seleccionados para la generación de la factura.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              {columnasVisibles.entrega_esperada && <TableHead>Fecha Entrega</TableHead>}
              {columnasVisibles.descripcion && <TableHead>Descripción</TableHead>}
              {columnasVisibles.modelo && <TableHead>Modelo</TableHead>}
              {columnasVisibles.subcategoria && <TableHead>Subcategoría</TableHead>}
              {columnasVisibles.co_cuenta && <TableHead>Cuenta</TableHead>}
              {columnasVisibles.codigo_barras && <TableHead>Código de Barras</TableHead>}
              {columnasVisibles.referencia && <TableHead>Referencia</TableHead>}
              {columnasVisibles.cantidad && <TableHead>Cantidad</TableHead>}
              {columnasVisibles.precio_unitario && <TableHead>Precio Unitario</TableHead>}
              {columnasVisibles.impuestos && <TableHead>Impuestos</TableHead>}
              {columnasVisibles.porcentaje_descuento && <TableHead>% Desc.</TableHead>}
              {columnasVisibles.importe && <TableHead>Importe</TableHead>}
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {productosLocal.map((producto, index) => {

              const habilitado = producto.cantidad > 0 && estadoOrden === "Pendiente"

              return (
                <TableRow key={producto.id}>
                  <TableCell>
                    <input
                      list="sugerencias-productos"
                      type="text"
                      //disabled={producto.producto_id > 0}
                      value={producto.nombre}
                      onChange={(e) => handleChangeProducto(index, e.target.value)}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </TableCell>

                    {columnasVisibles.entrega_esperada && (
                        <TableCell>
                        <input
                            disabled={!habilitado}
                            type="date"
                             value={
                                producto.entrega_esperada
                                ? new Date(producto.entrega_esperada).toISOString().split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                                handleChangeCampo(index, "entrega_esperada", new Date(e.target.value))
                            }
                            className="w-full border px-2 py-1 rounded"
                        />
                        </TableCell>
                    )}

                    {columnasVisibles.descripcion && (
                        <TableCell>
                        <input
                            disabled={!habilitado}
                            type="text"
                            value={producto.descripcion}
                            onChange={(e) => handleChangeCampo(index, 'descripcion', e.target.value)}
                            className="w-full border px-2 py-1 rounded"
                        />
                        </TableCell>
                    )}

                    {columnasVisibles.modelo && (
                        <TableCell>
                        <input
                            disabled={!habilitado}
                            type="text"
                            value={producto.modelo_descripcion}
                            readOnly
                            className="w-full border px-2 py-1 rounded bg-gray-100"
                        />
                        </TableCell>
                    )}

                    {columnasVisibles.subcategoria && (
                        <TableCell>
                        <input
                            disabled={!habilitado}
                            type="text"
                            value={producto.subcategoria_descripcion}
                            readOnly
                            className="w-full border px-2 py-1 rounded bg-gray-100"
                        />
                        </TableCell>
                    )}

                    {columnasVisibles.co_cuenta && (
                    <TableCell>
                        <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant="outline"
                            className={`w-full justify-start ${
                                !producto.co_cuenta_id ? "border-red-500 text-red-600" : ""
                            }`}

                            >
                            {producto.co_cuenta_id
                                ? `${co_cuentas.find(c => c.id === producto.co_cuenta_id)?.codigo} - ${
                                    co_cuentas.find(c => c.id === producto.co_cuenta_id)?.descripcion
                                }`
                                : "Seleccionar cuenta"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-2">
                            <Command>
                            <CommandInput placeholder="Buscar cuenta..." />
                            <CommandList>
                                <CommandEmpty>No se encontraron cuentas.</CommandEmpty>
                                {co_cuentas.map((c) => (
                                <CommandItem
                                    key={c.id}
                                    onSelect={() => handleChangeCampo(index, "co_cuenta_id", c.id)}
                                >
                                    {c.codigo} - {c.descripcion}
                                </CommandItem>
                                ))}
                            </CommandList>
                            </Command>
                        </PopoverContent>
                        </Popover>
                    </TableCell>
                    )}


                    {columnasVisibles.codigo_barras && (
                        <TableCell>
                        <input
                            type="text"
                            value={producto.codigo_barras}
                            onChange={(e) => handleChangeCampo(index, 'codigo_barras', e.target.value)}
                            className="w-full border px-2 py-1 rounded"
                        />
                        </TableCell>
                    )}

                    {columnasVisibles.referencia && (
                        <TableCell>
                        <input
                            type="text"
                            value={producto.referencia}
                            onChange={(e) => handleChangeCampo(index, 'referencia', e.target.value)}
                            className="w-full border px-2 py-1 rounded"
                        />
                        </TableCell>
                    )}

                    {columnasVisibles.cantidad && (
                        <TableCell>
                        <input
                            type="number"
                            min={0}
                            value={producto.cantidad}
                            onChange={(e) => handleChangeCampo(index, 'cantidad', +e.target.value)}
                            className="w-20 border px-2 py-1 rounded"
                        />
                        </TableCell>
                    )}

                    {columnasVisibles.precio_unitario && (
                        <TableCell>
                        <input
                            type="number"
                            value={producto.precio_unitario}
                            disabled={producto._importe_editado}
                            onChange={(e) => handleChangeCampo(index, 'precio_unitario', +e.target.value)}
                            className="w-24 border px-2 py-1 rounded"
                        />
                        </TableCell>
                    )}

                    {columnasVisibles.impuestos && (
                        <TableCell>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                                {producto.impuestos_seleccionados.length
                                ? impuestos
                                    .filter(i => producto.impuestos_seleccionados.includes(i.id))
                                    .map(i => i.descripcion)
                                    .join(', ')
                                : 'Seleccionar impuestos'}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[250px] p-2">
                            <Command>
                                <CommandInput placeholder="Buscar impuesto..." />
                                <CommandList>
                                <CommandEmpty>No hay coincidencias.</CommandEmpty>
                                {impuestos.map(i => {
                                    const seleccionado = producto.impuestos_seleccionados.includes(i.id)
                                    return (
                                    <CommandItem
                                        key={i.id}
                                        onSelect={() => {
                                        let nuevosIds = [...producto.impuestos_seleccionados]
                                        if (seleccionado) nuevosIds = nuevosIds.filter(id => id !== i.id)
                                        else nuevosIds.push(i.id)
                                        handleChangeCampo(index, 'impuestos_seleccionados', nuevosIds)
                                        }}
                                    >
                                        <input type="checkbox" checked={seleccionado} readOnly className="mr-2" />
                                        {i.descripcion} ({i.porcentaje}%)
                                    </CommandItem>
                                    )
                                })}
                                </CommandList>
                            </Command>
                            </PopoverContent>
                        </Popover>
                        </TableCell>
                    )}

                    {columnasVisibles.porcentaje_descuento && (
                        <TableCell>
                        <input
                            type="number"
                            value={producto.porcentaje_descuento}
                            onChange={(e) => handleChangeCampo(index, 'porcentaje_descuento', +e.target.value)}
                            className="w-20 border px-2 py-1 rounded"
                        />
                        </TableCell>
                    )}

                    {columnasVisibles.importe && (
                        <TableCell>
                        <input
                        type="number"
                        value={producto.importe}
                        onChange={(e) => handleChangeCampo(index, 'importe', +e.target.value)}
                        className="w-28 border px-2 py-1 rounded"
                        />
                        </TableCell>

                    )}

                    <TableCell>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEliminarProducto(index)}
                        className="text-red-500 hover:text-red-700"
                    >
                        🗑
                    </Button>
                    </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>


        <Label>Adjuntar Factura</Label>
            <Input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              onChange={handleArchivosChange}
            />
            {archivos.map((file, idx) => (
            <li key={idx} className="flex justify-between items-center py-1 px-2 hover:bg-gray-100">
                <span
                className="cursor-pointer hover:underline"
                onClick={() => abrirModal(file)}
                >
                📄 {file.nombre}
                </span>

                {!file.isCotizacion && estadoOrden == 'Pendiente' && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <button className="ml-2 text-red-600 hover:text-red-800">
                        <X size={16} />
                    </button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar archivo</AlertDialogTitle>
                        <AlertDialogDescription>
                        ¿Estás seguro que quieres eliminar <strong>{file.nombre}</strong>? Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                        onClick={() => {
                            setArchivos(prev => prev.filter(f => f !== file));
                            if (file.id) {
                            router.post(`/compras/ordenes-compras/archivoFactura/${file.id}/eliminarFactura`, {}, {
                                onSuccess: () => toast.success('Archivo eliminado correctamente'),
                                onError: () => toast.error('Error al eliminar el archivo')
                            });
                            }
                        }}
                        >
                        Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                )}

            </li>
            ))}


        <div className="flex flex-col items-end mt-2 pr-2 text-sm space-y-1">
        {/* Subtotal */}
        <div className="text-right">
            Subtotal: $
            {productosLocal
            .reduce((acc, p) => acc + p.precio_unitario * p.cantidad, 0)
            .toFixed(2)}
        </div>

        {/* Descuento total */}
        <div className="text-right">
            Descuento total: $
            {productosLocal
            .reduce(
                (acc, p) =>
                acc + p.precio_unitario * p.cantidad * (p.porcentaje_descuento / 100),
                0
            )
            .toFixed(2)}
        </div>

        {/* Impuestos seleccionados */}
        <div className="text-right">
            Impuestos:
            <div className="ml-4">
            {impuestos
                .filter(i => productosLocal.some(p => p.impuestos_seleccionados.includes(i.id)))
                .map(i => {
                const totalImpuesto = productosLocal.reduce((acc, p) => {
                    if (p.impuestos_seleccionados.includes(i.id)) {
                    return acc + p.precio_unitario * p.cantidad * (i.porcentaje / 100)
                    }
                    return acc
                }, 0)
                return (
                    <div key={i.id}>
                    {i.descripcion}: ${totalImpuesto.toFixed(2)}
                    </div>
                )
                })}
            </div>
        </div>

        {/* Total
        <div className='text-lg font-semibold text-right'>
            Total: $
            {productosLocal.reduce((acc, p) => acc + p.importe, 0).toFixed(2)}
        </div>*/}
        </div>



      </TabsContent>

      <TabsContent value="mas-info">Aquí va otra información.</TabsContent>
    </Tabs>

        {/* TOTAL Y BOTONES */}
        <div className="flex justify-between items-center mt-6">
          <Typography variant="h3">
            Total: {tipoMonedas.find(m => m.id === monedaOrden)?.simbolo || "$"}{" "}
            {totalOrden.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
          </Typography>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button
                className="bg-green-700 hover:bg-green-800 text-white"
                disabled={!camposCompletos}
                onClick={handleSubmit}
            >
                Guardar Factura
            </Button>

          </div>
        </div>
      </Dialog.Content>

    </Dialog.Root>

    <Dialog.Root open={modalVisible} onOpenChange={setModalVisible}>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <Dialog.Title className="text-lg font-bold mb-2">{archivoSeleccionado?.nombre}</Dialog.Title>
            <Dialog.Close asChild>
            <button className="absolute top-3 right-3 p-1 rounded hover:bg-gray-200">
                <X size={20} />
            </button>
            </Dialog.Close>

            {archivoSeleccionado && (
            <>
                {archivoSeleccionado.file ? (
                // Recién subido
                archivoSeleccionado.file.type.startsWith('image/') ? (
                    <img
                    src={URL.createObjectURL(archivoSeleccionado.file)}
                    alt={archivoSeleccionado.nombre}
                    className="max-h-96 w-auto mx-auto"
                    />
                ) : archivoSeleccionado.file.type === 'application/pdf' ? (
                    <iframe
                    src={URL.createObjectURL(archivoSeleccionado.file)}
                    className="w-full h-96"
                    />
                ) : (
                    <p className="mt-4 text-gray-500">No se puede previsualizar este tipo de archivo.</p>
                )
                ) : (
                // Existente
                archivoSeleccionado.mime.startsWith('image/') ? (
                    <img
                    src={archivoSeleccionado.url}
                    alt={archivoSeleccionado.nombre}
                    className="max-h-96 w-auto mx-auto"
                    />
                ) : archivoSeleccionado.mime === 'application/pdf' ? (
                    <iframe
                    src={archivoSeleccionado.url}
                    className="w-full h-96"
                    />
                ) : (
                    <p className="mt-4 text-gray-500">No se puede previsualizar este tipo de archivo.</p>
                )
                )}
            </>
            )}
        </Dialog.Content>
        </Dialog.Root>
    </>
  )


}

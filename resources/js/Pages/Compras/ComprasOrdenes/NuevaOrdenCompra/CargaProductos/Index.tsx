import React, { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow
} from '@/Components/ui/table'
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/Components/ui/tabs'
import { Button } from '@/Components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/Components/ui/popover'
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from '@/Components/ui/command'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu'
import { CirclePlus } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import ProductosIndex from '../../../../General/Productos/Index'
import { ProductosDisponibles } from '@/types/Producto'

type PageProps = {
  auth: { user: { id: number; name: string; email: string } }
  productos: ProductosDisponibles[]
  impuestos: { id: number; descripcion: string; porcentaje: number }[]
}

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
  setProductosValidos: (valid: boolean) => void
  setProductos: (productos: ProductoEditable[]) => void
  detalles?: any[]
}

export default function CargaProductos({ setProductosValidos, setProductos, detalles }: Props) {
  const { impuestos, auth, productos: productosDisponibles = [] } = usePage<PageProps>().props
  const [productos, setLocalProductos] = useState<ProductoEditable[]>([])
  const [modalAbierto, setModalAbierto] = useState(false)
  const [columnasVisibles, setColumnasVisibles] = useState({
    entrega_esperada: true,
    descripcion: true,
    modelo: true,
    subcategoria: false,
    cuenta: true,
    codigo_barras: false,
    referencia: false,
    cantidad: true,
    precio_unitario: true,
    impuestos: true,
    porcentaje_descuento: true,
    importe: true
  })

  // Inicializa con detalles si llegan
  useEffect(() => {
    if (detalles && detalles.length > 0) {
      const iniciales = detalles.map(det => ({
        id: det.id,
        producto_id: det.producto_id,
        entrega_esperada: new Date(det.entrega_esperada),
        nombre: det.producto?.nombre || '',
        descripcion: det.descripcion || '',
        modelo_descripcion: det.producto?.modelo?.descripcion || '',
        subcategoria_descripcion: det.producto?.sub_categoria?.descripcion || '',
        co_cuenta_id: det.producto?.rubro?.id || undefined,
        co_cuenta_descripcion: det.producto?.rubro?.descripcion || '',
        codigo_barras: det.codigo_barras || '',
        referencia: det.referencia || '',
        cantidad: det.cantidad || 0,
        precio_unitario: +det.precio_unitario || 0,
        impuestos_seleccionados: det.impuestos ? det.impuestos.map((i: any) => i.id) : [],
        porcentaje_descuento: +det.porcentaje_descuento || 0,
        importe: +det.importe || 0,
        usuario_id: auth.user.id,
      }))
      setLocalProductos(iniciales)
    }
  }, [detalles])

  // Actualiza productos y validez
  useEffect(() => {
    const hayProductoValido = productos.some(p => p.producto_id > 0 && p.cantidad > 0)
    setProductosValidos(hayProductoValido)
    setProductos(productos)
  }, [productos])

  const agregarLinea = () => {
    setLocalProductos([
      ...productos,
      {
        id: Date.now(),
        producto_id: 0,
        entrega_esperada: new Date(),
        nombre: '',
        descripcion: '',
        modelo_descripcion: '',
        subcategoria_descripcion: '',
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

  const eliminarLinea = (id: number) => setLocalProductos(productos.filter(p => p.id !== id))

  const handleChangeProducto = (index: number, value: string) => {
    const nuevos = [...productos]
    const producto = productosDisponibles.find(p => p.nombre === value)
    if (producto) {
      nuevos[index] = {
        ...nuevos[index],
        producto_id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        modelo_descripcion: producto.modelo?.descripcion || '',
        subcategoria_descripcion: producto.sub_categoria?.descripcion || '',
        codigo_barras: producto.codigo_barras || '',
        referencia: producto.referencia || ''
      }
    } else {
      nuevos[index].nombre = value
    }
    setLocalProductos(nuevos)
  }

  const calcularImporte = (p: ProductoEditable) => {
    const totalImpuestos = impuestos
      .filter(i => p.impuestos_seleccionados.includes(i.id))
      .reduce((acc, i) => acc + i.porcentaje / 100, 0)
    const descuento = p.porcentaje_descuento / 100
    return +(p.precio_unitario * p.cantidad * (1 + totalImpuestos) * (1 - descuento)).toFixed(2)
  }

   const handleChangeCampo = (index: number, campo: keyof ProductoEditable, valor: any) => {
    const nuevos = [...productos]
    const p = { ...nuevos[index], [campo]: valor }

    const totalImpuestos = impuestos
        .filter(i => p.impuestos_seleccionados.includes(i.id))
        .reduce((acc, i) => acc + i.porcentaje / 100, 0)
    const descuento = p.porcentaje_descuento / 100

    if (campo === 'co_cuenta_id') {
        const cuenta = cuentas.find(r => r.id === valor)
        p.co_cuenta_id = cuenta?.id
        p.co_cuenta_descripcion = cuenta?.descripcion
    }

    if (campo === 'importe') {
        if (p.cantidad > 0) {
        // Si editamos el importe, recalculamos precio unitario
        p.precio_unitario = +(p.importe / (p.cantidad * (1 + totalImpuestos) * (1 - descuento))).toFixed(2)
        p._importe_editado = true
        }
    } else if (['cantidad', 'precio_unitario'].includes(campo)) {
        // Cambios normales: recalcular importe si no se editó manualmente
        if (!p._importe_editado) {
        p.importe = +(p.precio_unitario * p.cantidad * (1 + totalImpuestos) * (1 - descuento)).toFixed(2)
        } else {
        // Si se editó importe, recalcular precio_unitario
        if (p.cantidad > 0) {
            p.precio_unitario = +(p.importe / (p.cantidad * (1 + totalImpuestos) * (1 - descuento))).toFixed(2)
        }
        }
    } else if (['porcentaje_descuento', 'impuestos_seleccionados'].includes(campo)) {
        // Si el importe fue editado manualmente, actualizar precio_unitario
        if (p._importe_editado && p.cantidad > 0) {
        p.precio_unitario = +(p.importe / (p.cantidad * (1 + totalImpuestos) * (1 - descuento))).toFixed(2)
        } else {
        // Si no, recalcular importe normalmente
        p.importe = +(p.precio_unitario * p.cantidad * (1 + totalImpuestos) * (1 - descuento)).toFixed(2)
        }
    }

    nuevos[index] = p
    setLocalProductos(nuevos)
    }



  return (
    <Tabs defaultValue="productos" className="w-full">
      <TabsList>
        <TabsTrigger value="productos">Productos</TabsTrigger>
        <TabsTrigger value="mas-info">Más Info</TabsTrigger>
      </TabsList>

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
          <TableCaption>Productos seleccionados para la orden de compra.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              {columnasVisibles.entrega_esperada && <TableHead>Fecha Entrega</TableHead>}
              {columnasVisibles.descripcion && <TableHead>Descripción</TableHead>}
              {columnasVisibles.modelo && <TableHead>Modelo</TableHead>}
              {columnasVisibles.subcategoria && <TableHead>Subcategoría</TableHead>}
              {columnasVisibles.cuenta && <TableHead>Rubro</TableHead>}
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
            {productos.map((producto, index) => {
              const habilitado = producto.cantidad > 0
              return (
                <TableRow key={producto.id}>
                  <TableCell>
                    <input
                      list="sugerencias-productos"
                      type="text"
                      disabled={producto.producto_id > 0}
                      value={producto.nombre}
                      onChange={(e) => handleChangeProducto(index, e.target.value)}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </TableCell>

                    {columnasVisibles.entrega_esperada && (
                        <TableCell>
                        <input
                            type="text"
                            value={producto.entrega_esperada?.toLocaleDateString()}
                            onChange={(e) => handleChangeCampo(index, 'entrega_esperada', e.target.value)}
                            className="w-full border px-2 py-1 rounded"
                        />
                        </TableCell>
                    )}

                    {columnasVisibles.descripcion && (
                        <TableCell>
                        <input
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
                            type="text"
                            value={producto.subcategoria_descripcion}
                            readOnly
                            className="w-full border px-2 py-1 rounded bg-gray-100"
                        />
                        </TableCell>
                    )}

                    {columnasVisibles.cuenta && (
                    <TableCell>
                        <select
                        value={producto.co_cuenta_id || ''}
                        onChange={(e) => handleChangeCampo(index, 'co_cuenta_id', +e.target.value)}
                        className="w-full border px-2 py-1 rounded"
                        >
                        <option value="">Seleccionar cuenta</option>
                        {cuentas.map(r => (
                            <option key={r.id} value={r.id}>{r.descripcion}</option>
                        ))}
                        </select>
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
                            disabled={!habilitado || producto._importe_editado}
                            onChange={(e) => handleChangeCampo(index, 'precio_unitario', +e.target.value)}
                            className="w-24 border px-2 py-1 rounded"
                        />
                        </TableCell>
                    )}

                    {columnasVisibles.impuestos && (
                        <TableCell>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start" disabled={!habilitado}>
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
                            disabled={!habilitado}
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
                        disabled={!habilitado}
                        onChange={(e) => handleChangeCampo(index, 'importe', +e.target.value)}
                        className="w-28 border px-2 py-1 rounded"
                        />
                        </TableCell>

                    )}

                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarLinea(producto.id)}
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

        <div className="flex flex-col items-end mt-2 pr-2 text-sm space-y-1">
        {/* Subtotal */}
        <div className="text-right">
            Subtotal: $
            {productos
            .reduce((acc, p) => acc + p.precio_unitario * p.cantidad, 0)
            .toFixed(2)}
        </div>

        {/* Descuento total */}
        <div className="text-right">
            Descuento total: $
            {productos
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
                .filter(i => productos.some(p => p.impuestos_seleccionados.includes(i.id)))
                .map(i => {
                const totalImpuesto = productos.reduce((acc, p) => {
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

        {/* Total */}
        <div className='text-lg font-semibold text-right'>
            Total: $
            {productos.reduce((acc, p) => acc + p.importe, 0).toFixed(2)}
        </div>
        </div>


        <datalist id="sugerencias-productos">
          {productosDisponibles.map(p => (
            <option key={p.id} value={p.nombre} />
          ))}
        </datalist>
      </TabsContent>

      <TabsContent value="mas-info">Aquí va otra información.</TabsContent>
    </Tabs>
  )
}

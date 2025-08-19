import React, { useState, useEffect } from 'react'
import { router, usePage } from '@inertiajs/react'
import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow
} from '@/Components/ui/table'
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/Components/ui/tabs'
import { Button } from '@/Components/ui/button'
import { Popover,PopoverTrigger,PopoverContent } from '@/Components/ui/popover'
import { Command,CommandInput,CommandList,CommandEmpty,CommandItem } from '@/Components/ui/command'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu'

import { CirclePlus  } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog'
import ProductosIndex from '../../../../General/Productos/Index'

import { ProductosDisponibles } from '@/types/Producto'



type PageProps = {
    auth: {
            user: {
                id: number
                name: string
                email: string
            }
        }
    productos: ProductosDisponibles[] ,
    impuestos: { id: number; descripcion: string }[]
}

type ProductoEditable = {
  id: number
  producto_id: number
  entrega_esperada: Date
  nombre: string
  descripcion: string
  modelo_descripcion: string
  subcategoria_descripcion: string
  codigo_barras: string
  referencia: string
  cantidad: number
  precio_unitario: number
  impuestos_seleccionados: number[]
  porcentaje_descuento: number
  importe: number
  usuario_id: number
}

type Props = {
  setProductosValidos: (valid: boolean) => void
  setProductos: (productos: ProductoEditable[]) => void
  detalles?: any[]  // o tipa mejor si tienes tipo
}
export default function CargaProductos({ setProductosValidos, setProductos, detalles, }: Props) {

    const [productos, setLocalProductos] = useState<ProductoEditable[]>([])
    const { impuestos, auth, productos: productosDisponibles = [], } = usePage<PageProps>().props
    const [modalAbierto, setModalAbierto] = useState(false)
    const [columnasVisibles, setColumnasVisibles] = useState({
        entrega_esperada: true,
        descripcion: true,
        modelo: true,
        subcategoria: false,
        codigo_barras: false,
        referencia: false,
        cantidad: true,
        precio_unitario: true,
        impuestos: true,
        porcentaje_descuento: true,
        importe: true
    })

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
            usuario_id: auth.user.id,
        }
        ])
    }

    // 🟢 Si llegan detalles, inicializa el array local
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
            codigo_barras: det.codigo_barras || '',
            referencia: det.referencia || '',
            cantidad: det.cantidad || 0,
            precio_unitario: +det.precio_unitario || 0,
            impuestos_seleccionados: det.impuestos_ids || [],
            porcentaje_descuento: +det.porcentaje_descuento || 0,
            importe: +det.importe || 0,
            usuario_id: auth.user.id,
        }))
        setLocalProductos(iniciales)
        }
    }, [detalles])

    useEffect(() => {
    const hayProductoValido = productos.some(p => p.producto_id > 0 && p.cantidad > 0)
    setProductosValidos(hayProductoValido)
    setProductos(productos)
    }, [productos])

    const handleChangeProducto = (index: number, value: string) => {
    const nuevos = [...productos]
    const producto = productosDisponibles.find(p => p.nombre === value)

    if (producto) {
      nuevos[index] = {
        ...nuevos[index],
        producto_id: producto.id,
        entrega_esperada: nuevos[index].entrega_esperada,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        modelo_descripcion: producto.modelo?.descripcion || '',
        subcategoria_descripcion: producto.sub_categoria?.descripcion || '',
        codigo_barras: producto.codigo_barras || '',
        referencia: producto.referencia || '',
        cantidad: nuevos[index].cantidad || 0,
        precio_unitario: nuevos[index].precio_unitario || 0,
        impuestos_seleccionados: [],
        porcentaje_descuento: nuevos[index].porcentaje_descuento || 0,
        importe: nuevos[index].importe || 0,
        usuario_id: auth.user.id,
      }
    } else {
      nuevos[index].nombre = value
    }

    setLocalProductos(nuevos)
    }


  const handleChangeCampo = (index: number, campo: keyof ProductoEditable, valor: string | number) => {
    const nuevos = [...productos]
    nuevos[index] = { ...nuevos[index], [campo]: valor }
    setLocalProductos(nuevos)
  }

  const eliminarLinea = (id: number) => {
    setLocalProductos(productos.filter(p => p.id !== id))
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
                    setColumnasVisibles(prev => ({
                      ...prev,
                      [col]: !prev[col as keyof typeof prev]
                    }))
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
                <TableHead>
                    Producto
                    <Dialog.Root open={modalAbierto} onOpenChange={setModalAbierto}>
                        <Dialog.Trigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => setModalAbierto(true)}
                        >
                            <CirclePlus />
                        </Button>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                        <Dialog.Content className="fixed top-1/2 left-1/2 w-[120vw] max-w-6xl max-h-[120vh] overflow-auto rounded-md bg-white p-6 shadow-lg transform -translate-x-1/2 -translate-y-1/2">
                            <ProductosIndex />
                        </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>

                </TableHead>
                {columnasVisibles.entrega_esperada && <TableHead>Fecha Entrega Esperada</TableHead>}
                {columnasVisibles.descripcion && <TableHead>Descripción</TableHead>}
                {columnasVisibles.modelo && <TableHead>Modelo</TableHead>}
                {columnasVisibles.subcategoria && <TableHead>Subcategoría</TableHead>}
                {columnasVisibles.codigo_barras && <TableHead>Código de Barras</TableHead>}
                {columnasVisibles.referencia && <TableHead>Referencia</TableHead>}
                {columnasVisibles.cantidad && <TableHead>Cantidad</TableHead>}
                {columnasVisibles.precio_unitario && <TableHead>Precio Unitario</TableHead>}
                {columnasVisibles.impuestos &&
                <TableHead>
                    Impuestos
                    <Button variant="secondary" size="icon" className="size-8">
                        <CirclePlus />
                    </Button>
                </TableHead>}
                {columnasVisibles.porcentaje_descuento && <TableHead>% Desc.</TableHead>}
                {columnasVisibles.importe && <TableHead>Importe</TableHead>}
                <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.map((producto, index) => (
              <TableRow key={producto.id}>
                <TableCell>
                  <input
                    list="sugerencias-productos"
                    type="text"
                    disabled={producto.producto_id > 0}
                    value={producto.nombre}
                    onChange={(e) => handleChangeProducto(index, e.target.value)}
                    placeholder="Buscar producto"
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
                      min="1"
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
                      onChange={(e) => handleChangeCampo(index, 'precio_unitario', +e.target.value)}
                      className="w-30 border px-2 py-1 rounded"
                    />
                  </TableCell>
                )}
               {columnasVisibles.impuestos && (
                <TableCell>
                    <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                        {producto.impuestos_seleccionados.length > 0
                            ? impuestos
                                .filter(i => producto.impuestos_seleccionados.includes(i.id))
                                .map(i => i.descripcion)
                                .join(', ')
                            : "Seleccionar impuestos"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-2">
                        <Command>
                        <CommandInput placeholder="Buscar impuesto..." />
                        <CommandList>
                            <CommandEmpty>No hay coincidencias.</CommandEmpty>
                            {impuestos.map(impuesto => (
                            <CommandItem
                                key={impuesto.id}
                                onSelect={() => {
                                const nuevos = [...productos]
                                const seleccionado = nuevos[index].impuestos_seleccionados.includes(impuesto.id)

                                nuevos[index].impuestos_seleccionados = seleccionado
                                    ? nuevos[index].impuestos_seleccionados.filter(id => id !== impuesto.id)
                                    : [...nuevos[index].impuestos_seleccionados, impuesto.id]

                                setLocalProductos(nuevos)
                                }}
                            >
                                <input
                                type="checkbox"
                                checked={producto.impuestos_seleccionados.includes(impuesto.id)}
                                readOnly
                                className="mr-2"
                                />
                                {impuesto.descripcion}
                            </CommandItem>
                            ))}
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
                      value={parseFloat((producto.cantidad * producto.precio_unitario * (1 - producto.porcentaje_descuento / 100)).toFixed(2))}

                      className="w-40 border px-2 py-1 rounded bg-gray-100"
                      readOnly
                    />
                  </TableCell>
                )}
                <TableCell>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarLinea(producto.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Eliminar fila"
                    >
                        🗑
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end mt-4 pr-4 text-lg font-semibold">
        Total: $
        {productos
            .reduce(
            (acc, p) =>
                acc +
                (p.cantidad * p.precio_unitario * (1 - p.porcentaje_descuento / 100)),
            0
            )
            .toFixed(2)}
        </div>
        <datalist id="sugerencias-productos">
        {productosDisponibles.map(p => (
            <option key={p.id} value={p.nombre} />
        ))}
        </datalist>

      </TabsContent>

      <TabsContent value="mas-info">
        Aquí va otra información.
      </TabsContent>

    </Tabs>
  )
}

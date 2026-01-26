import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/Components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Textarea } from "@/Components/ui/textarea"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/Components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover"
import { ChevronsUpDown, CircleX, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import axios from "axios"
import type { AlmacenStock, StockInventarioItem } from "@/types/Inventario/Operaciones/InventarioFisico/Stock"

interface SolicitarStockProps {
    open: boolean
    onClose: React.Dispatch<React.SetStateAction<boolean>>
    productosBajoStock: StockInventarioItem[]
    productosStockNormal: StockInventarioItem[]
}

type SelectedProduct = {
    producto: StockInventarioItem
    cantidad: number
}

export const SolicitarStock: React.FC<SolicitarStockProps> = ({
    open,
    onClose,
    productosBajoStock,
    productosStockNormal,
}) => {
    const [almacenes, setAlmacenes] = useState<AlmacenStock[]>([])
    const [almacenProveedor, setAlmacenProveedor] = useState("")
    const [prioridad, setPrioridad] = useState("Alta")
    const [motivo, setMotivo] = useState("")
    const [loading, setLoading] = useState(false)
    const [selectedItems, setSelectedItems] = useState<SelectedProduct[]>([])
    const [erroresCantidad, setErroresCantidad] = useState<Record<number, string>>({})
    const [openCombobox, setOpenCombobox] = useState(false)
    const [searchValue, setSearchValue] = useState("")

    useEffect(() => {
        const selectedProductoIds = selectedItems.map((item) => item.producto.productoId)

        if (selectedProductoIds.length === 0) {
            setAlmacenes([])
            return
        }
        axios
            .get("/stock-producto-almacen", {
                params: { productos: selectedProductoIds },
            })
            .then((res) => setAlmacenes(res.data))
            .catch((err) => console.error("Error al cargar almacenes", err))
    }, [selectedItems])

    const toggleProducto = (item: StockInventarioItem) => {
        setSelectedItems((prev) => {
            const exists = prev.find((p) => p.producto.id === item.id)
            if (exists) {
                return prev.filter((p) => p.producto.id !== item.id)
            } else {
                return [...prev, { producto: item, cantidad: 1 }]
            }
        })
    }

    const handleSelectProductoNormal = (productoId: string) => {
        const prod = productosStockNormal.find((p) => p.id === Number.parseInt(productoId))
        if (!prod) return

        const exists = selectedItems.find((item) => item.producto.id === prod.id)
        if (exists) return

        setSelectedItems((prev) => [...prev, { producto: prod, cantidad: 1 }])
        setOpenCombobox(false)
        setSearchValue("")
    }

    const updateCantidad = (id: number, value: number) => {
        setSelectedItems((prev) => prev.map((item) => (item.producto.id === id ? { ...item, cantidad: value } : item)))
    }

    const handleSubmit = async () => {
        if (!almacenProveedor || selectedItems.length === 0) return
        setLoading(true)

        try {
            const payload = selectedItems.map((item) => ({
                producto_id: item.producto.productoId,
                almacen_solicitante_id: item.producto.almacenId,
                almacen_proveedor_id: Number.parseInt(almacenProveedor),
                cantidad: item.cantidad,
                prioridad,
                motivo,
            }))

            await axios.post("/solicitar-stock/multiple", { solicitudes: payload })

            onClose(false)
            setSelectedItems([])
            setMotivo("")
            setAlmacenProveedor("")
        } catch (error) {
            console.error("Error al enviar solicitudes:", error)
        } finally {
            setLoading(false)
        }
    }

    const productosParaMostrar = [
        ...productosBajoStock,
        ...selectedItems
            .filter((item) => !productosBajoStock.some((p) => p.id === item.producto.id))
            .map((item) => item.producto),
    ]

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-[1000px]! max-w-none!">
                <DialogHeader>
                    <DialogTitle>Solicitar Stock a Otro Almacén</DialogTitle>
                    <DialogDescription>
                        Selecciona productos por bajo stock o agregalos manualmente desde el selector.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Agregar producto con stock normal</Label>
                        <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openCombobox}
                                    className="w-full justify-between bg-transparent"
                                >
                                    <span className="text-muted-foreground">Buscar producto...</span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[600px] p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Buscar producto por nombre..."
                                        value={searchValue}
                                        onValueChange={setSearchValue}
                                    />
                                    <CommandList>
                                        <CommandEmpty>No se encontraron productos.</CommandEmpty>
                                        <CommandGroup>
                                            {productosStockNormal
                                                .filter((prod) => {
                                                    const alreadySelected = selectedItems.some((item) => item.producto.id === prod.id)
                                                    return !alreadySelected
                                                })
                                                .map((prod) => (
                                                    <CommandItem
                                                        key={prod.id}
                                                        value={`${prod.producto} ${prod.id}`}
                                                        onSelect={() => handleSelectProductoNormal(`${prod.id}`)}
                                                        className="cursor-pointer"
                                                    >
                                                        <div className="flex justify-between w-full">
                                                            <span>{prod.producto}</span>
                                                            <span className="text-muted-foreground text-sm">Stock: {prod.cantidad_actual}</span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between mb-2">
                            <Label className="text-base font-semibold">Productos seleccionados ({selectedItems.length})</Label>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
                            {productosParaMostrar.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Search className="mx-auto h-12 w-12 opacity-20 mb-2" />
                                    <p>No hay productos seleccionados</p>
                                </div>
                            ) : (
                                productosParaMostrar.map((item) => {
                                    const isSelected = selectedItems.find((p) => p.producto.id === item.id)
                                    const isBajoStock = productosBajoStock.some((p) => p.id === item.id)

                                    return (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                "p-4 border rounded-lg transition-all",
                                                isSelected ? "bg-emerald-50 border-emerald-300" : "bg-gray-50 border-gray-200",
                                            )}
                                        >
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Label className="font-semibold text-base">{item.producto}</Label>
                                                        {isBajoStock && (
                                                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                                                                Bajo stock
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Stock actual: <strong className="text-foreground">{item.cantidad_actual}</strong> | Mínimo:{" "}
                                                        <strong className="text-foreground">{item.stock_minimo}</strong> | Almacén:{" "}
                                                        <strong className="text-foreground">{item.almacen}</strong>
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col gap-1">
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            className={cn("w-[120px]", erroresCantidad[item.id] && "border-red-500")}
                                                            disabled={!isSelected}
                                                            placeholder="Cantidad"
                                                            value={isSelected?.cantidad || ""}
                                                            onChange={(e) => {
                                                                const valor = Number.parseInt(e.target.value || "0", 10)

                                                                if (valor <= 0) {
                                                                    setErroresCantidad((prev) => ({
                                                                        ...prev,
                                                                        [item.id]: "Debe ser mayor a 0",
                                                                    }))
                                                                    updateCantidad(item.id, valor)
                                                                } else {
                                                                    setErroresCantidad((prev) => {
                                                                        const updated = { ...prev }
                                                                        delete updated[item.id]
                                                                        return updated
                                                                    })
                                                                    updateCantidad(item.id, valor)
                                                                }
                                                            }}
                                                        />
                                                        {erroresCantidad[item.id] && (
                                                            <p className="text-red-500 text-xs">{erroresCantidad[item.id]}</p>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!isSelected}
                                                            onChange={() => toggleProducto(item)}
                                                            className="h-5 w-5 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label>Almacén proveedor</Label>
                            <Select onValueChange={setAlmacenProveedor} value={almacenProveedor}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar proveedor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(!almacenes || almacenes.length === 0) ? (
                                        <div className="px-4 py-2 text-sm text-muted-foreground">
                                            No se encontraron almacenes disponibles
                                        </div>
                                    ) : (
                                        almacenes.map((almacen) => (
                                            <SelectItem
                                                key={almacen.almacen_id}
                                                value={`${almacen.almacen_id}`}
                                                className="py-3 flex flex-col items-start space-y-1"
                                            >
                                                {/* Nombre del almacén */}
                                                <span className="text-sm font-medium">
                                                    🏢 {almacen.almacen}
                                                </span>

                                                {/* Productos dentro del almacén */}
                                                <div className="flex flex-col text-xs text-muted-foreground pl-3">
                                                    {almacen.productos.map((prod) => (
                                                        <span key={prod.producto_id}>
                                                            • {prod.producto} — {prod.cantidad_actual} disponibles
                                                        </span>
                                                    ))}
                                                </div>
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>

                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Prioridad</Label>
                            <Select defaultValue={prioridad} onValueChange={setPrioridad}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Baja">Baja</SelectItem>
                                    <SelectItem value="Media">Media</SelectItem>
                                    <SelectItem value="Alta">Alta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Justificación</Label>
                        <Textarea
                            placeholder="Motivo de la solicitud..."
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onClose(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-emerald-500 hover:bg-emerald-600"
                        disabled={
                            loading ||
                            !almacenProveedor ||
                            selectedItems.length === 0 ||
                            selectedItems.some((item) => item.cantidad <= 0)
                        }
                    >
                        {loading ? "Enviando..." : "Enviar Solicitudes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

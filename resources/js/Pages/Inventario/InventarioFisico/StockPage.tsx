import React, { useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/Components/ui/tooltip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/Components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Tabs, TabsContent } from "@/Components/ui/tabs";
import { DataTableSkeleton } from "@/Components/DataTableSkeleton";
import { usePermissions } from "@/composables/permissions";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Label } from "@/Components/ui/label";
import { Package, AlertTriangle, Plus, Search, ArrowUpDown, ArrowDownWideNarrow, ArrowUpNarrowWide, Bell, Save, BrushCleaning, Clock10, SquarePen, Pencil } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { SolicitarStock } from "./ModalCrearSolicitudStock";
import SolicitudesStock from "./ModalSolicitudesEntrantes";
import { AjusteInventarioModal } from "./ModalConfirmarAjuste";
import { Almacen, StockItem } from "./Types";
import axios from "axios";
import { toast } from 'sonner';
import { AnimatePresence, motion } from "framer-motion";

type PageProps = InertiaPageProps & {
    stocks: {
        data: StockItem[];
    };
};
interface AjusteSeleccionado {
    ajusteId: number;
    productoId: number;
}
export default function StockManagement() {
    const [productosDisponibles, setProductosDisponibles] = useState<StockItem[]>([]);
    const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAlmacen, setselectedAlmacen] = useState("all");
    const [stockFiltro, setstockFiltro] = useState("all");
    const [solicitudDialogOpen, setsolicitudDialogOpen] = useState(false);
    const [solicitudesStockDialogOpen, setSolicitudesStockDialogOpen] = useState(false);
    const [solicitudes, setSolicitudes] = useState()
    const [stock, setStock] = useState<StockItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [sortColumn, setSortColumn] = useState<keyof StockItem | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
    const { stocks } = usePage<PageProps>().props;
    const [isLoading, setIsLoading] = useState(true);
    const { hasSubmenuPermission } = usePermissions();
    const { hasRole } = usePermissions();
    const [editingCell, setEditingCell] = useState<{ rowId: number, field: string } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const cellBeingEditedRef = useRef<HTMLTableCellElement>(null);
    const [editedRows, setEditedRows] = useState<Record<number, number>>({})
    const [isModalOpenInventario, setIsModalOpenInventario] = useState(false)
    const [ajusteSeleccionado, setAjusteSeleccionado] = useState<AjusteSeleccionado | null>(null);




    useEffect(() => {
        setStock(stocks.data);
        setIsLoading(false)
    }, [stocks]);



    useEffect(() => {
        axios
            .get("/inventario/almacenes")
            .then((res) => setAlmacenes(res.data.data))
            .catch((err) => console.error("Error al cargar almacenes", err));
    }, []);




    const filteredStock = stock.filter((item) => {
        const matchesSearch = item.producto.nombre
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesWarehouse =
            selectedAlmacen === "all" ||
            item.almacen.nombre === selectedAlmacen;
        const matchesstockFiltro =
            stockFiltro === "all" ||
            (stockFiltro === "low" &&
                item.cantidad_actual > 0 &&
                item.cantidad_actual <= item.stock_minimo) ||
            (stockFiltro === "normal" &&
                item.cantidad_actual > item.stock_minimo) ||
            (stockFiltro === "empty" && item.cantidad_actual === 0);
        return matchesSearch && matchesWarehouse && matchesstockFiltro;
    });

    const totalPages = Math.ceil(filteredStock.length / itemsPerPage);
    const getStockStatus = (actual: any, minimo: any) => {
        if (actual === 0) return { status: "Sin stock", color: "destructive" };
        if (actual <= minimo) return { status: "Stock bajo", color: "custom" };
        if (actual <= minimo * 1.5)
            return { status: "Stock medio", color: "warning" };
        return { status: "Stock normal", color: "success" };
    };


    const handleAbrirModal = () => {
        const productosFiltrados = stock.filter(
            (item) => item.cantidad_actual <= item.stock_minimo
        );
        setProductosDisponibles(productosFiltrados);
        setsolicitudDialogOpen(true);

    };

    const handleSolicitudes = async () => {
        try {
            const res = await axios.get(`/solicitudes-stock/`)
            setSolicitudes(res.data)
            setSolicitudesStockDialogOpen(true)
        } catch (err) {
            console.error("Error al cargar detalles de la solicitud", err)
        }
    }

    const sortedStock = React.useMemo(() => {
        if (!sortColumn || !sortDirection) return filteredStock;

        const sorted = [...filteredStock].sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (sortColumn) {
                case "producto":
                    aValue = a.producto.nombre.toLowerCase();
                    bValue = b.producto.nombre.toLowerCase();
                    break;
                case "cantidad_actual":
                    aValue = a.cantidad_actual;
                    bValue = b.cantidad_actual;
                    break;
                case "stock_minimo":
                    aValue = a.stock_minimo;
                    bValue = b.stock_minimo;
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
            if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [filteredStock, sortColumn, sortDirection]);


    const paginatedStock = sortedStock.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    const handleSort = (column: keyof StockItem) => {
        if (sortColumn !== column) { // Primer clic en nueva columna: orden ascendente

            setSortColumn(column);
            setSortDirection("asc");
        } else {

            if (sortDirection === "asc") {// Si ya está ordenado en ascendente → cambia a descendente
                setSortDirection("desc");
            }

            else if (sortDirection === "desc") { // Si ya está ordenado en descendente → elimina orden
                setSortColumn(null);
                setSortDirection(null);
            }

            else {
                setSortDirection("asc");// Si no hay orden (null) → orden ascendente
            }
        }
    };

    /* INPUT EDITABLE CANTIDADES CONTADAS  */
    useEffect(() => {
        if (editingCell && inputRef.current) {
            inputRef.current.focus();
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (editingCell && cellBeingEditedRef.current && !cellBeingEditedRef.current.contains(event.target as Node)) {
                inputRef.current?.blur();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editingCell]);

    // Manejador de clic en la celda para activar la edición
    const handleCellClick = (id: any, field: any) => {
        setEditingCell({ rowId: id, field });
    };

    // Manejador de cambio en el input editable
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        id: number,
        field: keyof StockItem
    ) => {
        const newValue = Number(e.target.value);
        setStock(prevData =>
            prevData.map(item =>
                item.id === id ? { ...item, [field]: newValue } : item)
        );
        setEditedRows(prev => ({ ...prev, [id]: newValue }));
    };

    const handleInputBlur = () => {
        if (editingCell) {
            const editedItem = stock.find(item => item.id === editingCell.rowId);
            if (!editedItem) return;
            setEditingCell(null);
        }
    };

    // Función para calcular la diferencia
    const calculaDiferencia = (aMano: number, contada: number) => {
        if (contada > 0) {
            return (contada !== undefined ? contada : aMano) - aMano;
        }
    };

    const handleAplicarTodo = async () => {
        const dataRows = Object.entries(editedRows).map(([id, cantidad]) => ({
            id: Number(id),
            cantidad_contada: cantidad,
        }));

        try {
            const response = await axios.post("/actualizar-cantidad-contadas-masivo", {
                data: dataRows,
            });
            const data = await response.data;
            toast.success(data.message);

            setEditedRows({});

        } catch (error: any) {
            toast.error(error.response.data.message)
            console.error("Error al aplicar todo:", error);
        }
    };

    const handleAplicarFila = async (id: number) => {
        const row = stock.find((item) => item.id === id);
        if (!row) return;

        try {
            const response = await axios.post(`/actualizar-cantidad-contadas/${id}`, {
                cantidad_contada: row.cantidad_contada,
            });
            const data = await response.data;

            toast.success(data.message);

            const updated = { ...editedRows };
            delete updated[id];

            setEditedRows(updated);
        } catch (error: any) {
            toast.error(error.response.data.message)
            console.error("Error al aplicar fila:", error);
        }
    };

    const handleLimpiarFila = (id: number) => {
        setStock(prev =>
            prev.map(item =>
                item.id === id ? { ...item, cantidad_contada: 0 } : item
            )
        );
        const updated = { ...editedRows };
        delete updated[id];
        setEditedRows(updated);
    };



    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Inventario</h2>
            }>
            <Head title="Inventario" />

            <div className="mx-auto w-full p-6 space-y-6">
                <div className=" flex justify-between">
                    {hasSubmenuPermission('inventarioFisico', 'confirm') &&
                        <Tooltip>
                            <TooltipTrigger asChild>
                                {hasSubmenuPermission("inventarioFisico", "create") && (
                                    <Button size="sm" variant="outline" onClick={handleAbrirModal} className="text-xs"> <Plus className="h-3 w-3 mr-1" /> Solicitar </Button>
                                )}
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Solicitudes de stock</p>
                            </TooltipContent>
                        </Tooltip>}

                    <span>inventario Fisico</span>
                </div>

                <Tabs defaultValue="stock" className="space-y-4">
                    <TabsContent value="stock" className="space-y-4">
                        <Card>
                            <CardHeader className="text-xl flex justify-between">

                                <CardTitle>Filtros</CardTitle>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="lg" onClick={() => handleSolicitudes()}>
                                            <Badge variant={"success"}>1</Badge>
                                            <Bell className="h-4 " />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Solicitudes de stock</p>
                                    </TooltipContent>
                                </Tooltip>

                            </CardHeader>

                            <CardContent>
                                {/*Filtros*/}
                                <div className="grid  grid-cols-1 md:grid-cols-3 gap-35">
                                    <div className="space-y-2">
                                        <Label htmlFor="search">Buscar producto</Label>
                                        <div className="relative w-46">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="search" placeholder="Nombre" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="pl-8" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Almacén</Label>
                                        <Select value={selectedAlmacen} onValueChange={(value) => { setselectedAlmacen(value); setCurrentPage(1); }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar almacén" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todos los almacenes</SelectItem>
                                                {almacenes.map((almacen) => (
                                                    <SelectItem key={almacen.id} value={almacen.nombre} >{almacen.nombre}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Estado de stock</Label>
                                        <Select value={stockFiltro} onValueChange={(value) => { setstockFiltro(value); setCurrentPage(1); }} >
                                            <SelectTrigger className="w-46">
                                                <SelectValue placeholder="Estado de stock" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todos</SelectItem>
                                                <SelectItem value="low">Stock bajo</SelectItem>
                                                <SelectItem value="normal">Stock normal</SelectItem>
                                                <SelectItem value="empty">Sin stock</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Resumen compacto */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-35 text-sm text-muted-foreground mt-8">
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4" />
                                        <span>Total Productos:</span>
                                        <span className="font-bold text-gray-700">{filteredStock.length}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                        <span>Stock Bajo:</span>
                                        <span className="font-bold text-red-700">
                                            {filteredStock.filter((item) => item.cantidad_actual <= item.stock_minimo).length}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-red-500" />
                                        <span>Sin Stock:</span>
                                        <span className="font-bold text-red-700">{filteredStock.filter((item) => item.cantidad_actual === 0).length}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex justify-between">
                                <div>
                                    <CardTitle>Inventario de Productos</CardTitle>
                                    <CardDescription>Lista completa de productos con información de stock y ubicación</CardDescription>
                                </div>
                                <div>
                                    {hasSubmenuPermission('inventarioFisico', 'update') &&
                                        <Button size="sm" variant="outline" onClick={handleAplicarTodo} className="text-xs" disabled={Object.keys(editedRows).length === 0} >
                                            <Plus className="h-3 w-3 mr-1" /> Aplicar todo
                                        </Button>
                                    }

                                </div>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <Table>
                                        <TableHeader className="sticky-header">
                                            <TableRow>
                                                <TableHead className="text-center">Producto</TableHead>
                                                <TableHead className="text-center">Almacén Origen</TableHead>
                                                <TableHead className="text-center">
                                                    <Button variant="ghost" className="w-full justify-center uppercase cursor-pointer select-none" onClick={() => handleSort("cantidad_actual")}>
                                                        <span className="inline-flex items-center gap-1"> Stock Actual
                                                            {sortColumn === "cantidad_actual" ? (sortDirection === "asc" ? (
                                                                <ArrowUpNarrowWide className="ml-1 h-4 w-4 animate-bounce" />
                                                            ) : (
                                                                <ArrowDownWideNarrow className="ml-1 h-4 w-4 animate-bounce" />
                                                            )
                                                            ) : (
                                                                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                                                            )}
                                                        </span>
                                                    </Button>
                                                </TableHead>
                                                {hasSubmenuPermission('inventarioFisico', 'update') && hasSubmenuPermission('inventarioFisico', 'create') &&
                                                    <>
                                                        <TableHead className="text-center">Cantidades contadas </TableHead>
                                                        <TableHead className="text-center">Diferencias</TableHead>
                                                    </>}
                                                <TableHead className="text-center">Estado</TableHead>
                                                <TableHead className="text-center">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        {isLoading ? (
                                            <TableBody>
                                                <DataTableSkeleton columnCount={6} rowCount={5} showHeaders={false}></DataTableSkeleton>
                                            </TableBody>
                                        ) : (
                                            <TableBody className="text-center">
                                                {paginatedStock.map((item: StockItem, index: number) => {
                                                    const stockStatus = getStockStatus(item.cantidad_actual, item.stock_minimo);
                                                    return (
                                                        <TableRow key={item.id + index}>
                                                            <TableCell className="font-medium">{item.producto.nombre}</TableCell>
                                                            <TableCell>{item.almacen.nombre}</TableCell>
                                                            <TableCell className="font-mono relative">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    {item.cantidad_actual}
                                                                </div>
                                                            </TableCell>

                                                            {/* Celda editable para Cantidades Contadas */}
                                                            {hasSubmenuPermission('inventarioFisico', 'update') && hasSubmenuPermission('inventarioFisico', 'create') &&
                                                                <>

                                                                    {/* <TableCell
                                                                className={`py-3 px-4 relative flex justify-center ${item.estado_ajuste !== 'nuevo' && hasSubmenuPermission('inventarioFisico', 'update')
                                                                        ? 'cursor-pointer'
                                                                        : ''
                                                                    }`}
                                                                
                                                            >
                                                                <Button   onClick={() => {
                                                                    if (item.estado_ajuste !== 'nuevo' && hasSubmenuPermission('inventarioFisico', 'update')) {
                                                                        handleCellClick(item.id, 'cantidad_contada');
                                                                    }
                                                                }} > <SquarePen /></Button>
                                                                {editingCell &&
                                                                    editingCell.rowId === item.id &&
                                                                    editingCell.field === 'cantidad_contada' ? (                                                              
                                                                     <input
                                                                        ref={inputRef}
                                                                        type="text"
                                                                        value={item.cantidad_contada === 0 ? '' : item.cantidad_contada ?? ''}
                                                                        onChange={(e) => handleInputChange(e, item.id, 'cantidad_contada')}
                                                                        onBlur={handleInputBlur}
                                                                        disabled={item.estado_ajuste === 'nuevo' || !hasSubmenuPermission('inventarioFisico', 'update')}
                                                                        className={`w-24 p-1 border border-neutral-200 rounded-md ${item.estado_ajuste === 'nuevo' || !hasSubmenuPermission('inventarioFisico', 'update')
                                                                                ? 'bg-neutral-100 text-gray-500 cursor-not-allowed focus:ring-0 focus:outline-none'
                                                                                : 'focus:ring-2 focus:ring-neutral-300'
                                                                            }`}
                                                                    /> 
                                                                      
                                                                ) : (
                                                                    <div  className={`flex items-center justify-center gap-1 rounded-md w-24 h-9 `}>
                                                                        <span>
                                                                            {item.cantidad_contada === 0 || item.cantidad_contada == null ? '' : item.cantidad_contada}
                                                                        </span>
                                                                        

                                                                        {item.estado_ajuste === 'nuevo' && (
                                                                            <>
                                                                              {hasSubmenuPermission('inventarioFisico', 'confirm') && hasRole('admin') &&
                                                                             <span
                                                                                className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800 cursor-pointer"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    if (item.ajuste_id) {
                                                                                        setAjusteSeleccionado({
                                                                                            ajusteId: item.ajuste_id,
                                                                                            productoId: item.producto.id,
                                                                                        });
                                                                                        setIsModalOpenInventario(true);
                                                                                    }
                                                                                }}>
                                                                                <Clock10 className="inline h-4 w-4 mr-1" />
                                                                                Pendiente
                                                                            </span>
                                                                            }
                                                                            </>
                                                                           
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </TableCell> */}
                                                                    <TableCell
                                                                        className="py-3 px-4 relative flex justify-center"
                                                                    >
                                                                        {/* Caso: edición activa */}
                                                                        {editingCell &&
                                                                            editingCell.rowId === item.id &&
                                                                            editingCell.field === "cantidad_contada" ? (
                                                                            <AnimatePresence
                                                                                initial={false}
                                                                                mode="popLayout">
                                                                                <input
                                                                                    ref={inputRef}
                                                                                    type="text"
                                                                                    value={item.cantidad_contada === 0 ? "" : item.cantidad_contada ?? ""}
                                                                                    onChange={(e) => handleInputChange(e, item.id, "cantidad_contada")}
                                                                                    onBlur={handleInputBlur}
                                                                                    disabled={
                                                                                        item.estado_ajuste === "nuevo" ||
                                                                                        !hasSubmenuPermission("inventarioFisico", "update")
                                                                                    }
                                                                                    className={`w-24 p-1 border border-neutral-200 rounded-md ${item.estado_ajuste === "nuevo" ||
                                                                                        !hasSubmenuPermission("inventarioFisico", "update")
                                                                                        ? "bg-neutral-100 text-gray-500 cursor-not-allowed focus:ring-0 focus:outline-none"
                                                                                        : "focus:ring-2 focus:ring-neutral-300"
                                                                                        }`}
                                                                                />

                                                                            </AnimatePresence>

                                                                        ) : (
                                                                            <div className="flex items-center justify-center gap-1 rounded-md w-24 h-9 ">
                                                                                {/* Mostrar cantidad si existe */}
                                                                                {item.cantidad_contada !== 0 && item.cantidad_contada != null ? (
                                                                                    <span>{item.cantidad_contada}</span>
                                                                                ) : (
                                                                                    // Mostrar botón solo si no hay cantidad
                                                                                    item.estado_ajuste !== "nuevo" &&
                                                                                    hasSubmenuPermission("inventarioFisico", "update") && (

                                                                                        <Tooltip>
                                                                                            <TooltipTrigger asChild>
                                                                                                <motion.button initial={false} whileTap={{ scale: 0.9 }}


                                                                                                    onClick={() =>
                                                                                                        handleCellClick(item.id, "cantidad_contada")
                                                                                                    }
                                                                                                >
                                                                                                    <Pencil className="color: text-amber-500" />

                                                                                                </motion.button>
                                                                                            </TooltipTrigger>
                                                                                            <TooltipContent>
                                                                                                <p>Agregar cantidad</p>
                                                                                            </TooltipContent>
                                                                                        </Tooltip>
                                                                                    )
                                                                                )}

                                                                                {/* Badge "Pendiente" */}
                                                                                {item.estado_ajuste === "nuevo" &&
                                                                                    hasSubmenuPermission("inventarioFisico", "confirm") &&
                                                                                    hasRole("admin") && (
                                                                                        <span
                                                                                            className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800 cursor-pointer"
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                if (item.ajuste_id) {
                                                                                                    setAjusteSeleccionado({
                                                                                                        ajusteId: item.ajuste_id,
                                                                                                        productoId: item.producto.id,
                                                                                                    });
                                                                                                    setIsModalOpenInventario(true);
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            <Clock10 className="inline h-4 w-4 mr-1" />
                                                                                            Pendiente
                                                                                        </span>
                                                                                    )}
                                                                            </div>
                                                                        )}
                                                                    </TableCell>





                                                                    <TableCell
                                                                        className={`py-3 px-4 font-medium ${calculaDiferencia(item.cantidad_actual, item.cantidad_contada)! > 0
                                                                            ? 'text-green-600'
                                                                            : calculaDiferencia(item.cantidad_actual, item.cantidad_contada)! < 0
                                                                                ? 'text-red-600'
                                                                                : 'text-gray-500'
                                                                            }`} >
                                                                        {calculaDiferencia(item.cantidad_actual, item.cantidad_contada)}
                                                                    </TableCell>

                                                                </>
                                                            }
                                                            <TableCell>
                                                                <Badge variant={stockStatus.color as | "default" | "destructive" | "secondary" | "outline"}>{stockStatus.status}</Badge>
                                                            </TableCell>

                                                            <TableCell>

                                                                {editedRows[item.id] !== undefined ? (
                                                                    <>
                                                                        {hasSubmenuPermission('inventarioFisico', 'update') && (
                                                                            <>
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="outline"
                                                                                    onClick={() => handleAplicarFila(item.id)}
                                                                                    className="text-xs"
                                                                                >
                                                                                    <Save className="h-3 w-3 mr-1" /> Aplicar
                                                                                </Button>
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="outline"
                                                                                    onClick={() => handleLimpiarFila(item.id)}
                                                                                    className="text-xs ml-2"
                                                                                >
                                                                                    <BrushCleaning className="h-3 w-3 mr-1" /> Limpiar
                                                                                </Button>
                                                                            </>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <span className="text-muted-foreground text-xs"></span>
                                                                )}

                                                            </TableCell>

                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>)}
                                    </Table>
                                </div>

                                {/* Controles de paginación */}
                                <div className="flex justify-between items-center mt-4 px-4">
                                    <div className="text-sm text-muted-foreground">Página {currentPage} de {totalPages}</div>
                                    <div className="space-x-2">
                                        <Button size="sm" variant="outline" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} >
                                            Anterior
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} >
                                            Siguiente
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Dialog para solicitar stock */}
            {solicitudDialogOpen && <SolicitarStock open={solicitudDialogOpen} onClose={() => setsolicitudDialogOpen(false)} productos={productosDisponibles} />}
            {/* Dialog Solicitudes de stock para aprobar */}
            {solicitudesStockDialogOpen && <SolicitudesStock isOpen={solicitudesStockDialogOpen} onClose={() => setSolicitudesStockDialogOpen(false)} requests={solicitudes}></SolicitudesStock>}
            {/* Dialog Inventario modal */}
            {isModalOpenInventario && ajusteSeleccionado && (
                <AjusteInventarioModal
                    isOpen={isModalOpenInventario}
                    onClose={() => setIsModalOpenInventario(false)}
                    idAjuste={ajusteSeleccionado.ajusteId} // id del ajuste
                    productoId={ajusteSeleccionado.productoId} // id del producto
                    onApprove={() => {
                        console.log("Ajuste aprobado");
                        setIsModalOpenInventario(false);
                    }}
                    onReject={() => {
                        console.log("Ajuste rechazado");
                        setIsModalOpenInventario(false);
                    }}
                />
            )}

        </AuthenticatedLayout>


    );
}

import React, { useEffect, useState } from "react";
import {
    Package,
    AlertTriangle,
    Plus,
    Search,
    ArrowUpDown,
    ArrowDownWideNarrow,
    ArrowUpNarrowWide,
    Download,
    Bell,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Tabs, TabsContent } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

import axios from "axios";
import { usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { SolicitarStock } from "./ModalSolicitarStock";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

type Producto = {
    id: number;
    nombre: string;
    descripcion: string;
    modelo_id?: number;
    subcategoria_id?: number;
};

type Almacen = {
    id: number;
    nombre: string;
};

type StockItem = {
    id: number;
    producto: Producto;
    almacen: Almacen;
    cantidad_actual: number;
    stock_minimo: number;
};
type PageProps = InertiaPageProps & {
    stocks: {
        data: StockItem[];
    };
};

export default function StockManagement() {
    const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAlmacen, setselectedAlmacen] = useState("all");
    const [stockFiltro, setstockFiltro] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState<StockItem | null>(
        null
    );
    const [solicitudDialogOpen, setsolicitudDialogOpen] = useState(false);
    const [stock, setStock] = useState<StockItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [sortColumn, setSortColumn] = useState<keyof StockItem | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
        null
    );

    const { stocks } = usePage<PageProps>().props;

    useEffect(() => {
        setStock(stocks.data);
    }, []);

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
    /*    const paginatedStock = filteredStock.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
 */
    const getStockStatus = (actual: any, minimo: any) => {
        if (actual === 0) return { status: "Sin stock", color: "destructive" };
        if (actual <= minimo) return { status: "Stock bajo", color: "custom" };
        if (actual <= minimo * 1.5)
            return { status: "Stock medio", color: "secondary" };
        return { status: "Stock normal", color: "success" };
    };

    const handleRequestStock = (product: any) => {
        setSelectedProduct(product);
        setsolicitudDialogOpen(true);
    };

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
        if (sortColumn !== column) {
            // Primer clic en nueva columna: orden ascendente
            setSortColumn(column);
            setSortDirection("asc");
        } else {
            // Si ya está ordenado en ascendente → cambia a descendente
            if (sortDirection === "asc") {
                setSortDirection("desc");
            }
            // Si ya está ordenado en descendente → elimina orden
            else if (sortDirection === "desc") {
                setSortColumn(null);
                setSortDirection(null);
            }
            // Si no hay orden (null) → orden ascendente
            else {
                setSortDirection("asc");
            }
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Inventario
                </h2>
            }
        >
            <Head title="Inventario" />
            <div className="mb-6"></div>
            <div className="mx-auto w-full p-6 space-y-6">
                <Tabs defaultValue="stock" className="space-y-4">
                    <TabsContent value="stock" className="space-y-4">
                        <Card>
                            <CardHeader className="text-xl flex justify-between">
                                <CardTitle>Filtros</CardTitle>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        
                                        <Button variant="outline" size="lg">
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
                                <div className="grid  grid-cols-1 md:grid-cols-3 gap-35">
                                    <div className="space-y-2">
                                        <Label htmlFor="search">
                                            Buscar producto
                                        </Label>
                                        <div className="relative w-46">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="search"
                                                placeholder="Nombre"
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    setSearchTerm(
                                                        e.target.value
                                                    );
                                                    setCurrentPage(1);
                                                }}
                                                className="pl-8"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Almacén</Label>
                                        <Select
                                            value={selectedAlmacen}
                                            onValueChange={(value) => {
                                                setselectedAlmacen(value);
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar almacén" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    Todos los almacenes
                                                </SelectItem>
                                                {almacenes.map((almacen) => (
                                                    <SelectItem
                                                        key={almacen.id}
                                                        value={almacen.nombre}
                                                    >
                                                        {almacen.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Estado de stock</Label>
                                        <Select
                                            value={stockFiltro}
                                            onValueChange={(value) => {
                                                setstockFiltro(value);
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <SelectTrigger className="w-46">
                                                <SelectValue placeholder="Estado de stock" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    Todos
                                                </SelectItem>
                                                <SelectItem value="low">
                                                    Stock bajo
                                                </SelectItem>
                                                <SelectItem value="normal">
                                                    Stock normal
                                                </SelectItem>
                                                <SelectItem value="empty">
                                                    Sin stock
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Resumen compacto */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-35 text-sm text-muted-foreground mt-8">
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4" />
                                        <span>Total Productos:</span>
                                        <span className="font-bold text-gray-700">
                                            {filteredStock.length}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                        <span>Stock Bajo:</span>
                                        <span className="font-bold text-red-700">
                                            {
                                                filteredStock.filter(
                                                    (item) =>
                                                        item.cantidad_actual <=
                                                        item.stock_minimo
                                                ).length
                                            }
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-red-500" />
                                        <span>Sin Stock:</span>
                                        <span className="font-bold text-red-700">
                                            {
                                                filteredStock.filter(
                                                    (item) =>
                                                        item.cantidad_actual ===
                                                        0
                                                ).length
                                            }
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Inventario de Productos</CardTitle>
                                <CardDescription>
                                    Lista completa de productos con información
                                    de stock y ubicación
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <Table>
                                        <TableHeader className="sticky-header">
                                            <TableRow>
                                                <TableHead className="text-center">
                                                    Producto
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    Almacén Origen
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-center uppercase cursor-pointer select-none"
                                                        onClick={() =>
                                                            handleSort(
                                                                "cantidad_actual"
                                                            )
                                                        }
                                                    >
                                                        <span className="inline-flex items-center gap-1">
                                                            Stock Actual
                                                            {sortColumn ===
                                                            "cantidad_actual" ? (
                                                                sortDirection ===
                                                                "asc" ? (
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

                                                <TableHead className="text-center">
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-center uppercase cursor-pointer select-none"
                                                        onClick={() =>
                                                            handleSort(
                                                                "stock_minimo"
                                                            )
                                                        }
                                                    >
                                                        <span className="inline-flex items-center gap-1">
                                                            Stock Mínimo
                                                            {sortColumn ===
                                                            "stock_minimo" ? (
                                                                sortDirection ===
                                                                "asc" ? (
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

                                                <TableHead className="text-center">
                                                    Estado
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    Acciones
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="text-center">
                                            {paginatedStock.map((item) => {
                                                const stockStatus =
                                                    getStockStatus(
                                                        item.cantidad_actual,
                                                        item.stock_minimo
                                                    );
                                                return (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="font-medium">
                                                            {
                                                                item.producto
                                                                    .nombre
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                item.almacen
                                                                    .nombre
                                                            }
                                                        </TableCell>
                                                        {/*  <TableCell>{item.almacen.nombre}</TableCell> */}
                                                        <TableCell className="font-mono">
                                                            {
                                                                item.cantidad_actual
                                                            }
                                                        </TableCell>
                                                        <TableCell className="font-mono">
                                                            {item.stock_minimo}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={
                                                                    stockStatus.color as
                                                                        | "default"
                                                                        | "destructive"
                                                                        | "secondary"
                                                                        | "outline"
                                                                }
                                                            >
                                                                {
                                                                    stockStatus.status
                                                                }
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.cantidad_actual <=
                                                                item.stock_minimo && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() =>
                                                                        handleRequestStock(
                                                                            item
                                                                        )
                                                                    }
                                                                    className="text-xs"
                                                                >
                                                                    <Plus className="h-3 w-3 mr-1" />{" "}
                                                                    Solicitar
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Controles de paginación */}
                                <div className="flex justify-between items-center mt-4 px-4">
                                    <div className="text-sm text-muted-foreground">
                                        Página {currentPage} de {totalPages}
                                    </div>
                                    <div className="space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                setCurrentPage((p) =>
                                                    Math.max(p - 1, 1)
                                                )
                                            }
                                            disabled={currentPage === 1}
                                        >
                                            Anterior
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                setCurrentPage((p) =>
                                                    Math.min(p + 1, totalPages)
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                        >
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
            <SolicitarStock
                solicitudDialogOpen={solicitudDialogOpen}
                setsolicitudDialogOpen={setsolicitudDialogOpen}
                selectedProduct={selectedProduct}
            ></SolicitarStock>
        </AuthenticatedLayout>

        
    );
}

import { useEffect, useState } from "react";
import { Package, AlertTriangle, Plus, Search } from "lucide-react";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

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
    const [selectedProduct, setSelectedProduct] = useState<StockItem | null>(null);
    const [solicitudDialogOpen, setsolicitudDialogOpen] = useState(false);
    const [stock, setStock] = useState<StockItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
        const matchesSearch = item.producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesWarehouse = selectedAlmacen === "all" || item.almacen.nombre === selectedAlmacen;
        const matchesstockFiltro =
            stockFiltro === "all" ||
            (stockFiltro === "low" && item.cantidad_actual <= item.stock_minimo) ||
            (stockFiltro === "normal" && item.cantidad_actual > item.stock_minimo);

        return matchesSearch && matchesWarehouse && matchesstockFiltro;
    });

    const totalPages = Math.ceil(filteredStock.length / itemsPerPage);
    const paginatedStock = filteredStock.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStockStatus = (actual: any, minimo: any) => {
        if (actual === 0) return { status: "Sin stock", color: "destructive" };
        if (actual <= minimo) return { status: "Stock bajo", color: "destructive" };
        if (actual <= minimo * 1.5) return { status: "Stock medio", color: "secondary" };
        return { status: "Stock normal", color: "default" };
    };

    const handleRequestStock = (product: any) => {
        setSelectedProduct(product);
        setsolicitudDialogOpen(true);
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Inventario</h2>}>
            <Head title="Inventario" />

            <div className="mx-auto w-full p-6 space-y-6">
                <Tabs defaultValue="stock" className="space-y-4">
                    <TabsContent value="stock" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Filtros</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="search">Buscar producto</Label>
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="search"
                                                placeholder="Nombre"
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
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
                                                <SelectItem value="all">Todos los almacenes</SelectItem>
                                                {almacenes.map((almacen) => (
                                                    <SelectItem key={almacen.id} value={almacen.nombre}>
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
                                            <SelectTrigger>
                                                <SelectValue placeholder="Estado de stock" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todos</SelectItem>
                                                <SelectItem value="low">Stock bajo</SelectItem>
                                                <SelectItem value="normal">Stock normal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                
                                {/* Resumen compacto */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mt-4">
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
                                        <span className="font-bold text-red-700">
                                            {filteredStock.filter((item) => item.cantidad_actual === 0).length}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Inventario de Productos</CardTitle>
                                <CardDescription>
                                    Lista completa de productos con información de stock y ubicación
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <Table>
                                        <TableHeader className="sticky-header">
                                            <TableRow>
                                                <TableHead className="text-center">Producto</TableHead>
                                                <TableHead className="text-center">Almacén Origen</TableHead>
                                               {/*  <TableHead className="text-center">Almacén Actual</TableHead> */}
                                                <TableHead className="text-center">Stock Actual</TableHead>
                                                <TableHead className="text-center">Stock Mínimo</TableHead>
                                                <TableHead className="text-center">Estado</TableHead>
                                                <TableHead className="text-center">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="text-center">
                                            {paginatedStock.map((item) => {
                                                const stockStatus = getStockStatus(
                                                    item.cantidad_actual,
                                                    item.stock_minimo
                                                );
                                                return (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="font-medium">{item.producto.nombre}</TableCell>
                                                        <TableCell>{item.almacen.nombre}</TableCell>
                                                       {/*  <TableCell>{item.almacen.nombre}</TableCell> */}
                                                        <TableCell className="font-mono">{item.cantidad_actual}</TableCell>
                                                        <TableCell className="font-mono">{item.stock_minimo}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={stockStatus.color as "default" | "destructive" | "secondary" | "outline"}>
                                                                {stockStatus.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.cantidad_actual <= item.stock_minimo && (
                                                                <Button size="sm" variant="outline" onClick={() => handleRequestStock(item)} className="text-xs">
                                                                    <Plus className="h-3 w-3 mr-1" /> Solicitar
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
                                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            Anterior
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                            disabled={currentPage === totalPages}
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
            <Dialog open={solicitudDialogOpen} onOpenChange={setsolicitudDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Solicitar Stock a Otro Almacén</DialogTitle>
                            <DialogDescription>
                                Solicita stock de{" "}
                                {selectedProduct?.producto.nombre} desde otros
                                almacenes autorizados
                            </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 text-red-800 mb-2">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="font-medium">Stock Bajo Detectado</span>
                            </div>

                            <div className="text-sm text-red-700">
                                <div className="font-medium">
                                    {selectedProduct?.producto.nombre}
                                </div>
                                <div>
                                    Stock actual:{" "}
                                    <span className="font-bold">
                                        {selectedProduct?.cantidad_actual}
                                    </span>
                                    {" "}| Mínimo:{" "}
                                    <span className="font-bold">{selectedProduct?.stock_minimo}</span>
                                </div>
                                <div>
                                    Almacén:{" "}
                                    {selectedProduct?.almacen.nombre}
                                </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Almacén solicitante</Label>
                                    <Input
                                    type="text"
                                    value={selectedProduct?.almacen.nombre}
                                    disabled
                                    className="bg-gray-100 cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Almacén proveedor</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar proveedor" />
                            </SelectTrigger>
                                    <SelectContent>
                                        {almacenes.map((almacen) => (
                                            <SelectItem key={almacen.id} value={almacen.nombre}>
                                                {almacen.nombre}
                                            </SelectItem>
                                        ))} 
                                    </SelectContent>
                        </Select> 
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Cantidad solicitada</Label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        defaultValue={selectedProduct ? Math.max( 0, selectedProduct.stock_minimo - selectedProduct.cantidad_actual ) : 0}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Prioridad</Label>
                                    <Select defaultValue="high">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Baja</SelectItem>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="high">Alta</SelectItem>
                                            <SelectItem value="urgent"> Urgente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Justificación</Label>
                                <Textarea placeholder="Motivo de la solicitud..." />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setsolicitudDialogOpen(false)} >Cancelar </Button>
                            <Button onClick={() => setsolicitudDialogOpen(false)} className="bg-purple-600 hover:bg-purple-700" > Enviar Solicitud </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
        </AuthenticatedLayout>
    );
}

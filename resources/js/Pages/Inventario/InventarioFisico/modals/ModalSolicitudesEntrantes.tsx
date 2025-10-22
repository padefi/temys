import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/Components/ui/table";

import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import AceptarStock from "./ModalAprobarORechazarStock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Pagination } from "../components/PaginationSolicitud";
import { Solicitudes } from "../../../../types/Inventario";
import { Calendar, ChevronDown, ChevronRight, MapPin, Package } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { DataTableSkeleton } from "@/Components/DataTableSkeleton";
import { Button } from "@/components/ui/button";
interface SolicitudesModalProps {
    isOpen: boolean;
    onClose: () => void;
    requests?: Solicitudes[];
}

export default function SolicitudesStock({ isOpen, onClose, requests, }: SolicitudesModalProps) {
    const [solicitudesStock, setSolicitudesStock] = useState<Solicitudes[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [solicitudesAceptar, setSolicitudesAceptar] = useState<any>(null);
    const [solicitudesAceptadas, setSolicitudesAceptadas] = useState<Solicitudes[]>([]);
    /* pagination stock  */
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const totalPages = Math.ceil(solicitudesStock.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = solicitudesStock.slice(startIndex, endIndex);
    /* pagination mis solicitudes */
    const [currentPageMisSolicitudes, setCurrentPageMisSolicitudes] = useState(1);
    const totalPagesMisSolicitudes = Math.ceil(solicitudesAceptadas.length / itemsPerPage);
    const startIndexMisSolicitudes = (currentPageMisSolicitudes - 1) * itemsPerPage;
    const endIndexMisSolicitudes = startIndexMisSolicitudes + itemsPerPage;
    const currentItemsMisSolicitudes = solicitudesAceptadas.slice(startIndexMisSolicitudes, endIndexMisSolicitudes);
    const [activeTab, setActiveTab] = useState("solicitadas");
    const [isLoading, setIsLoading] = useState(true);
    const [expandedRow, setExpandedRow] = useState<string | null>(null)

    const toggleRow = (solicitudId: string) => {
        if (expandedRow === solicitudId) {
            setExpandedRow(null)
        } else {

            setExpandedRow(solicitudId)
        }
    }

    const getEstadoBadge = (estado: string) => {
        const normalizado = estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase()
        const styles = {
            Cancelada: "w-20 text-center bg-red-100 text-red-700 hover:bg-red-200 rounded-2xl ",
            Pendiente: "w-20 text-center bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-2xl",
            Aceptada: "w-20 text-center bg-green-100 text-green-700 hover:bg-green-200 rounded-2xl",
        }
        return styles[normalizado as keyof typeof styles] || "bg-gray-100 text-gray-700"
    }

    useEffect(() => {
        if (requests) {
            setSolicitudesStock(requests);
        }
    }, [requests]);

    const MisSolicitudes = async () => {
        try {
            const res = await axios.get("/solicitudes-stock-aceptadas");
            setIsLoading(false)
            setSolicitudesAceptadas(res.data);
        } catch (error) {
            console.error("Error al cargar solicitudes aceptadas", error);
        }
    };

    const handleTabChange = (value: string) => {
        if (value === "misSolicitudes") {
            MisSolicitudes();
            setCurrentPageMisSolicitudes(1);
        } else {
            setCurrentPage(1);
        }
    };

    const handleClose = () => {
        onClose();
        setCurrentPage(1);
    };

    const openModal = async (id: number) => {
        try {
            const res = await axios.get(`/solicitudes-stock/${id}`);
            setSolicitudesAceptar(res.data);
            setIsModalOpen(true);
        } catch (err) {
            console.error("Error al cargar detalles de la solicitud", err);
        }
    };

    const handleAprobado = (id: any) => {
        setSolicitudesStock((prev) => prev.filter((s) => s.id !== id))
        setIsModalOpen(false);
    };

    const handleRechazado = (id: any) => {
        setSolicitudesStock((prev) => prev.filter((s) => s.id !== id))
        setIsModalOpen(false);
    };

    const goToPageMisSolicitudes = (page: number) => setCurrentPageMisSolicitudes(page);
    const goToPreviousPageMisSolicitudes = () => setCurrentPageMisSolicitudes((prev) => Math.max(prev - 1, 1));
    const goToNextPageMisSolicitudes = () => setCurrentPageMisSolicitudes((prev) => Math.min(prev + 1, totalPagesMisSolicitudes));
    const goToPage = (page: number) => setCurrentPage(page);
    const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="w-full max-w-[90vw] sm:max-w-[60vw] max-h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Solicitudes de Stock</DialogTitle>
                        <DialogDescription>Revisa y gestiona las solicitudes entrantes.</DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="solicitudesPorAprobar" value={activeTab} onValueChange={(value) => {
                        setActiveTab(value);
                        handleTabChange(value);

                    }} className="flex-1 flex flex-col overflow-hidden">
                        <TabsList>
                            <TabsTrigger value="solicitudesPorAprobar">Solicitudes de stock</TabsTrigger>
                            <TabsTrigger value="misSolicitudes"> Mis solicitudes</TabsTrigger>
                        </TabsList>

                        <TabsContent value="solicitudesPorAprobar" className="flex-1 overflow-auto" >
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>N° solicitud</TableHead>
                                        <TableHead>Almacén Origen</TableHead>
                                        <TableHead>Prioridad</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {currentItems.length > 0 ? (currentItems.map((solicitud) => (
                                        <TableRow key={solicitud.id}>
                                            <TableCell>SOL-0{solicitud.id}</TableCell>
                                            <TableCell>   <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                {solicitud.nombre_almacen_solicitante}
                                            </div></TableCell>
                                            <TableCell>

                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${{
                                                    Alta: "bg-red-100 text-red-700",
                                                    Media: "bg-yellow-100 text-yellow-700",
                                                    Baja: "bg-green-100 text-green-700",
                                                }[solicitud.prioridad] || "bg-gray-100 text-gray-700"
                                                    }`} >
                                                    {solicitud.prioridad ?? "Media"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    {new Date(solicitud.fecha).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm" onClick={() => openModal(solicitud.id)} >Ver Detalles </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8">
                                                No hay solicitudes disponibles
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <Pagination
                                totalItems={solicitudesStock.length}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                startIndex={startIndex}
                                goToPreviousPage={goToPreviousPage}
                                goToNextPage={goToNextPage}
                                goToPage={goToPage}
                                itemLabel="solicitudes"
                            />
                        </TabsContent>

                        <TabsContent value="misSolicitudes">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-12"></TableHead>
                                        <TableHead>Solicitud</TableHead>
                                        <TableHead>Almacén Origen</TableHead>
                                        <TableHead>Almacén Destino</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Productos</TableHead>
                                        <TableHead>Motivo</TableHead>
                                        <TableHead>Fecha</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <AnimatePresence mode="wait">
                                    {isLoading ? (
                                        <motion.tbody
                                            key="skeleton"
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            transition={{ duration: 0.35, ease: "easeInOut" }}
                                        >
                                            <DataTableSkeleton columnCount={7} rowCount={4} showHeaders={false} />
                                        </motion.tbody>
                                    ) : (
                                        <motion.tbody
                                            key="tbody"
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            transition={{ duration: 0.35, ease: "easeInOut" }}
                                            className="text-center"
                                        >

                                            {currentItemsMisSolicitudes.map((solicitud: any, index: number) => {
                                                const isExpanded = expandedRow === solicitud.id
                                                return (
                                                    <Fragment key={solicitud.id}>
                                                        <TableRow className="hover:bg-muted/50 cursor-pointer" onClick={() => toggleRow(solicitud.id)} >
                                                            <TableCell>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        toggleRow(solicitud.id)
                                                                    }}
                                                                >
                                                                    {isExpanded ? (
                                                                        <ChevronDown className="h-4 w-4" />
                                                                    ) : (
                                                                        <ChevronRight className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </TableCell>
                                                            <TableCell className="font-medium">SOL-0{solicitud.id}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                                    {solicitud.nombre_almacen_solicitante}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                                    {solicitud.nombre_almacen_proveedor}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className={getEstadoBadge(solicitud.estado)}>
                                                                    {solicitud.estado}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <Package className="h-4 w-4 text-muted-foreground" />
                                                                    <span className="font-medium">{solicitud.detalles.length}</span>
                                                                    <span className="text-muted-foreground">productos</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="max-w-[200px] truncate">
                                                                {solicitud.motivo}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                                    {new Date(solicitud.fecha).toLocaleDateString()}
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>


                                                        <AnimatePresence initial={false}>
                                                            {isExpanded && (
                                                                <TableRow key={`${solicitud.id}-expanded`}>
                                                                    <TableCell colSpan={8} className="p-0">
                                                                        <motion.div
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: "auto", opacity: 1 }}
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                            style={{ overflow: "hidden" }}
                                                                        >
                                                                            <div className="bg-muted/20 border-t">
                                                                                <div className="p-4">
                                                                                    <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                                                                                        Productos en esta solicitud
                                                                                    </h4>
                                                                                    <div className="space-y-2">
                                                                                        {solicitud.detalles.map((producto: any) => (
                                                                                            <div
                                                                                                key={producto.producto_id}
                                                                                                className="flex items-center justify-between p-3 bg-background rounded-lg border"
                                                                                            >
                                                                                                <div className="flex items-center gap-3">
                                                                                                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                                                                        <Package className="h-5 w-5 text-primary" />
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <p className="font-medium">{producto.nombre_producto}</p>
                                                                                                        <p className="text-sm text-muted-foreground">
                                                                                                            Código: {producto.codigo_producto}
                                                                                                        </p>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="flex items-center gap-6 text-sm">
                                                                                                    <div className="text-center">
                                                                                                        <p className="font-medium">{producto.cantidad}</p>
                                                                                                        <p className="text-muted-foreground">Solicitada</p>
                                                                                                    </div>
                                                                                                    <div className="text-center">
                                                                                                        <p className="font-medium text-green-600">{producto.cantidad_aprobada}</p>
                                                                                                        <p className="text-muted-foreground">Aprobada</p>
                                                                                                    </div>
                                                                                                    <div className="text-center">
                                                                                                        <p className="text-muted-foreground">unidades</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </motion.div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </AnimatePresence>
                                                    </Fragment>
                                                )
                                            })}

                                        </motion.tbody>
                                    )}
                                </AnimatePresence>
                            </Table>

                            <Pagination
                                totalItems={solicitudesAceptadas.length}
                                currentPage={currentPageMisSolicitudes}
                                totalPages={totalPagesMisSolicitudes}
                                startIndex={startIndexMisSolicitudes}
                                goToPreviousPage={goToPreviousPageMisSolicitudes}
                                goToNextPage={goToNextPageMisSolicitudes}
                                goToPage={goToPageMisSolicitudes}
                                itemLabel="solicitudes"
                            />
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>

            <AceptarStock
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                request={solicitudesAceptar}
                onAprobado={handleAprobado}
                onRechazado={handleRechazado}
            />
        </>
    );
}

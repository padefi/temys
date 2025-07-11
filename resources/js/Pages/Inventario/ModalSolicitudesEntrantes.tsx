import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle} from "@/components/ui/dialog";
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import AceptarStock from "./ModalAprobarORechazarStock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Pagination } from "./components/PaginationSolicitud";

interface Solicitudes {
    id: number;
    nombre_producto: string;
    nombre_almacen: string;
    estado: string;
    cantidad: number;
    motivo: string;
    prioridad: string;
    fecha: Date;
}

interface SolicitudesModalProps {
    isOpen: boolean;
    onClose: () => void;
    requests?: Solicitudes[];
}

export default function SolicitudesStock({ isOpen, onClose, requests,}: SolicitudesModalProps) {
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
    const [currentPageMisSolicitudes, setCurrentPageMisSolicitudes] =useState(1);
    const totalPagesMisSolicitudes = Math.ceil(solicitudesAceptadas.length / itemsPerPage);
    const startIndexMisSolicitudes =(currentPageMisSolicitudes - 1) * itemsPerPage;
    const endIndexMisSolicitudes = startIndexMisSolicitudes + itemsPerPage;
    const currentItemsMisSolicitudes = solicitudesAceptadas.slice(startIndexMisSolicitudes,endIndexMisSolicitudes);
    const [activeTab, setActiveTab] = useState("solicitadas");

    useEffect(() => {
        if (requests) {
            setSolicitudesStock(requests);
        }
    }, [requests]);

    const MisSolicitudes = async () => {
        try {
            const res = await axios.get("/solicitudes-stock-aceptadas");
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

    const handleAprobado = (id: any, qty: any, notes: any) => {
        console.log("Aprobado", id, qty, notes);
        setSolicitudesStock((prev) => prev.filter((s) => s.id !== id))
        setIsModalOpen(false);
    };

    const handleRechazado = (id: any, reason: any) => {
        console.log("Rechazado", id, reason);
        setSolicitudesStock((prev) => prev.filter((s) => s.id !== id))
        setIsModalOpen(false);
    };

    const goToPageMisSolicitudes = (page: number) => setCurrentPageMisSolicitudes(page);
    const goToPreviousPageMisSolicitudes = () => setCurrentPageMisSolicitudes((prev) => Math.max(prev - 1, 1));
    const goToNextPageMisSolicitudes = () => setCurrentPageMisSolicitudes((prev) =>Math.min(prev + 1, totalPagesMisSolicitudes) );
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

            <Tabs defaultValue="solicitudesPorAprobar" value={activeTab} onValueChange={(value) => { setActiveTab(value);
                handleTabChange(value);
                console.log("Tab seleccionado:", value);
                }} className="flex-1 flex flex-col overflow-hidden">
                    <TabsList>
                        <TabsTrigger value="solicitudesPorAprobar">Solicitudes de stock</TabsTrigger>
                        <TabsTrigger value="misSolicitudes"> Mis solicitudes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="solicitudesPorAprobar"  className="flex-1 overflow-auto" >
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead>Almacén</TableHead>
                                    <TableHead>Prioridad</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>  
                                {currentItems.length > 0 ? ( currentItems.map((solicitud) => (
                                    <TableRow key={solicitud.id}>
                                        <TableCell>{solicitud.nombre_producto}</TableCell>
                                        <TableCell>{solicitud.nombre_almacen}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${{
                                                                Alta: "bg-red-100 text-red-700",
                                                                Media: "bg-yellow-100 text-yellow-700",
                                                                Baja: "bg-green-100 text-green-700",}[solicitud.prioridad] || "bg-gray-100 text-gray-700"
                                                            }`} >
                                                        {solicitud.prioridad ?? "Media"}
                                            </span>
                                        </TableCell>
                                        <TableCell> {new Date( solicitud.fecha ).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                             <Button variant="outline"  size="sm"   onClick={() => openModal( solicitud.id  ) } >Ver Detalles </Button>
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
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead>Almacén origen</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Cantidad aprobada</TableHead>
                                    <TableHead>Motivo</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    {/*  <TableHead>Acciones</TableHead> */}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {solicitudesAceptadas.length > 0 ? ( solicitudesAceptadas.map((solicitud) => (
                                 <TableRow key={solicitud.id}>
                                    <TableCell>{solicitud.nombre_producto}</TableCell>
                                    <TableCell>{solicitud.nombre_almacen}</TableCell>
                                    <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium  ${{
                                                    Cancelada:"bg-red-100 text-red-700",
                                                    Pendiente:"bg-yellow-100 text-yellow-700",
                                                    Aceptada:"bg-green-100 text-green-700",
                                                    }[solicitud.estado] ||"bg-gray-100 text-gray-700" }`}>
                                                    {solicitud.estado}
                                                </span>
                                    </TableCell>
                                    <TableCell>{solicitud.cantidad}</TableCell>
                                    <TableCell>{solicitud.motivo}</TableCell>
                                    <TableCell>{new Date(solicitud.fecha ).toLocaleDateString()}</TableCell>
                                </TableRow>))) : (
                                 <TableRow><TableCell colSpan={5}  className="text-center py-8"  >No hay solicitudes disponibles</TableCell></TableRow>
                                    )}
                            </TableBody>
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
